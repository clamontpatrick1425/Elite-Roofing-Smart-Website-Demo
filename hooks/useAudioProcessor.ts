import { useState, useRef, useCallback } from 'react';

// FIX: Add a global declaration for window.webkitAudioContext to support older browsers.
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

// Helper function to decode base64 string to Uint8Array
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Custom function to decode raw PCM audio data into an AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
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
    const playbackQueueRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);

    const startProcessing = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            const inputContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
            inputAudioContextRef.current = inputContext;

            const outputContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
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
            console.error("Error starting audio processing:", error);
            if (error instanceof DOMException && error.name === 'NotAllowedError') {
                 alert("Microphone access was denied. Please allow microphone access in your browser settings to use the voice agent.");
            } else {
                alert("Could not access the microphone. Please check your browser permissions.");
            }
            throw error; // Propagate error to be caught by caller
        }
    }, [onAudioData]);

    const stopProcessing = useCallback(() => {
        if (!isProcessing) return;

        // Stop microphone input processing
        if (scriptProcessorRef.current && mediaStreamSourceRef.current && inputAudioContextRef.current) {
            mediaStreamSourceRef.current.disconnect();
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current.onaudioprocess = null;
        }
        if (inputAudioContextRef.current?.state !== 'closed') {
            inputAudioContextRef.current?.close();
        }
        
        // Stop any ongoing playback
        if (outputAudioContextRef.current) {
            playbackQueueRef.current.forEach(source => {
                try {
                    source.stop();
                } catch (e) {
                    // Ignore errors from stopping already stopped sources
                }
            });
            playbackQueueRef.current.clear();

            if (outputAudioContextRef.current.state !== 'closed') {
                 outputAudioContextRef.current.close();
            }
        }
        
        // Clean up stream tracks
        mediaStreamSourceRef.current?.mediaStream.getTracks().forEach(track => track.stop());
        
        // Reset refs
        inputAudioContextRef.current = null;
        outputAudioContextRef.current = null;
        scriptProcessorRef.current = null;
        mediaStreamSourceRef.current = null;
        
        setIsProcessing(false);
    }, [isProcessing]);

    const playAudio = useCallback(async (base64Audio: string) => {
        const outputContext = outputAudioContextRef.current;
        if (!outputContext || outputContext.state === 'closed') {
             console.warn("Output audio context is not available for playback.");
             return;
        }

        try {
            const decodedBytes = decode(base64Audio);
            const audioBuffer = await decodeAudioData(decodedBytes, outputContext, 24000, 1);
            
            const source = outputContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputContext.destination);

            const currentTime = outputContext.currentTime;
            const startTime = Math.max(currentTime, nextStartTimeRef.current);

            source.start(startTime);
            nextStartTimeRef.current = startTime + audioBuffer.duration;

            playbackQueueRef.current.add(source);
            source.onended = () => {
                playbackQueueRef.current.delete(source);
            };

        } catch (error) {
            console.error("Error playing audio:", error);
        }
    }, []);
    
    const interruptPlayback = useCallback(() => {
        if (outputAudioContextRef.current) {
            playbackQueueRef.current.forEach(source => {
                try {
                    source.stop();
                } catch(e) { /* ignore */ }
            });
            playbackQueueRef.current.clear();
            nextStartTimeRef.current = 0;
        }
    }, []);

    return { isProcessing, startProcessing, stopProcessing, playAudio, interruptPlayback };
};