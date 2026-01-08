
import { useState, useRef, useCallback } from 'react';

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
    // Fix: Add a ref to hold the MediaStream object.
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const playbackQueueRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);

    const startProcessing = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Fix: Store the stream in the ref.
            mediaStreamRef.current = stream;
            
            // Input context (16k required for Gemini Live input)
            // Use try/catch because some browsers/hardware may not support 16k directly
            let inputContext;
            try {
                inputContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
            } catch (e) {
                console.warn("Could not create 16k AudioContext, falling back to default sample rate.", e);
                inputContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            // Explicitly resume context to prevent "suspended" state issues
            if (inputContext.state === 'suspended') {
                await inputContext.resume().catch(e => console.warn("Failed to resume input context", e));
            }
            inputAudioContextRef.current = inputContext;

            // Output context (24k required for Gemini Live output)
            let outputContext;
            try {
                outputContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
            } catch (e) {
                console.warn("Could not create 24k AudioContext for output, using default.", e);
                outputContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            // Explicitly resume context to prevent "suspended" state issues
            if (outputContext.state === 'suspended') {
                await outputContext.resume().catch(e => console.warn("Failed to resume output context", e));
            }
            outputAudioContextRef.current = outputContext;
            nextStartTimeRef.current = outputContext.currentTime;


            const source = inputContext.createMediaStreamSource(stream);
            mediaStreamSourceRef.current = source;

            // Use 4096 buffer size for balance between latency and performance
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
            // Ensure cleanup happens if partial initialization occurred
            if (inputAudioContextRef.current) inputAudioContextRef.current.close();
            if (outputAudioContextRef.current) outputAudioContextRef.current.close();
            if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(t => t.stop());
            
            throw error; // Propagate error to be caught by caller
        }
    }, [onAudioData]);

    const interruptPlayback = useCallback(() => {
        const playbackQueue = playbackQueueRef.current;
        if (playbackQueue.size > 0) {
            for (const source of playbackQueue) {
                try {
                    source.stop();
                } catch(e) { /* ignore already stopped */ }
            }
            playbackQueue.clear();
        }
        if (outputAudioContextRef.current) {
            nextStartTimeRef.current = outputAudioContextRef.current.currentTime;
        } else {
            nextStartTimeRef.current = 0;
        }
    }, []);

    const playAudio = useCallback(async (base64Audio: string) => {
        const outputContext = outputAudioContextRef.current;
        if (!outputContext || outputContext.state === 'closed') return;
    
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
            console.error("Error playing audio:", error);
        }
    }, []);

    const stopProcessing = useCallback(() => {
        // Always attempt cleanup even if isProcessing is false to ensure clean state
        
        // Stop microphone input processing
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
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        
        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
            inputAudioContextRef.current.close().catch(console.error);
            inputAudioContextRef.current = null;
        }

        // Stop any ongoing playback and close output context
        interruptPlayback();
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            outputAudioContextRef.current.close().catch(console.error);
            outputAudioContextRef.current = null;
        }
        
        setIsProcessing(false);
    }, [interruptPlayback]);
    
    return { isProcessing, startProcessing, stopProcessing, playAudio, interruptPlayback };
};
