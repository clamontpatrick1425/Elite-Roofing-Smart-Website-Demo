
import { useState, useRef, useCallback } from 'react';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const bytesPerSample = 2; // Int16 PCM is 2 bytes per sample
  const bufferLength = Math.floor(data.byteLength / bytesPerSample);
  const dataInt16 = new Int16Array(bufferLength);
  
  // Safe extraction of 16-bit PCM little-endian values, avoiding alignment/RangeError issues
  const dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
  for (let i = 0; i < bufferLength; i++) {
    dataInt16[i] = dataView.getInt16(i * bytesPerSample, true);
  }

  const frameCount = bufferLength / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


export const useAudioProcessor = (onAudioData: (data: Float32Array) => void) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const playbackQueueRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);

    const startProcessing = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            
            let inputContext: AudioContext;
            try {
                inputContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
            } catch (e) {
                console.warn("Could not create input AudioContext at 16000Hz, falling back to native rate:", e);
                inputContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (inputContext.state === 'suspended') {
                await inputContext.resume();
            }
            inputAudioContextRef.current = inputContext;

            let outputContext: AudioContext;
            try {
                // Instantiating the AudioContext at its native/browser rate is highly compatible and matches any sound card.
                // The AudioBuffer decoded at 24000Hz below will be transparently resampled by the browser.
                outputContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn("Could not create output AudioContext, falling back to basic:", e);
                outputContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (outputContext.state === 'suspended') {
                await outputContext.resume();
            }
            outputAudioContextRef.current = outputContext;
            nextStartTimeRef.current = outputContext.currentTime;

            const source = inputContext.createMediaStreamSource(stream);
            mediaStreamSourceRef.current = source;

            const scriptProcessor = inputContext.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                onAudioData(inputData);
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputContext.destination);
            
            setIsProcessing(true);
        } catch (error) {
            console.error("Error starting audio processor:", error);
            throw error;
        }
    }, [onAudioData]);

    const interruptPlayback = useCallback(() => {
        const playbackQueue = playbackQueueRef.current;
        if (playbackQueue.size > 0) {
            for (const source of playbackQueue) {
                try {
                    source.stop();
                } catch(e) {}
            }
            playbackQueue.clear();
        }
        if (outputAudioContextRef.current) {
            nextStartTimeRef.current = outputAudioContextRef.current.currentTime;
        }
    }, []);

    const playAudio = useCallback(async (base64Audio: string) => {
        const outputContext = outputAudioContextRef.current;
        if (!outputContext || outputContext.state === 'closed') return;

        // Auto-resume standard suspended state (e.g. strict browser Autoplay Policies)
        if (outputContext.state === 'suspended') {
            try {
                await outputContext.resume();
            } catch (e) {
                console.warn("Failed to automatically resume output AudioContext:", e);
            }
        }
    
        try {
            const decodedData = decode(base64Audio);
            const audioBuffer = await decodeAudioData(
              decodedData,
              outputContext,
              24000,
              1,
            );
        
            const source = outputContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputContext.destination);
        
            const currentTime = outputContext.currentTime;
            const startTime = Math.max(currentTime, nextStartTimeRef.current);
            
            source.start(startTime);
            nextStartTimeRef.current = startTime + audioBuffer.duration;
            
            const playbackQueue = playbackQueueRef.current;
            playbackQueue.add(source);
            source.onended = () => {
              playbackQueue.delete(source);
            };
        } catch (error) {
            console.error("Error playing Live API audio chunk:", error);
        }
    }, []);

    const stopProcessing = useCallback(() => {
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current.onaudioprocess = null;
            scriptProcessorRef.current = null;
        }
        if (mediaStreamSourceRef.current) {
            mediaStreamSourceRef.current.disconnect();
            mediaStreamSourceRef.current = null;
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(t => t.stop());
            mediaStreamRef.current = null;
        }
        if (inputAudioContextRef.current) {
            inputAudioContextRef.current.close().catch(console.error);
            inputAudioContextRef.current = null;
        }
        interruptPlayback();
        if (outputAudioContextRef.current) {
            outputAudioContextRef.current.close().catch(console.error);
            outputAudioContextRef.current = null;
        }
        setIsProcessing(false);
    }, [interruptPlayback]);
    
    return { isProcessing, startProcessing, stopProcessing, playAudio, interruptPlayback };
};
