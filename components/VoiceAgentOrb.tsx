
import React, { useState, useRef, useCallback, useEffect, useImperativeHandle, forwardRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { MicrophoneIcon, XMarkIcon, SpeakerWaveIcon } from './Icon';
import { useAudioProcessor } from '../hooks/useAudioProcessor';
import { createBlob } from '../services/geminiService';

type AgentStatus = 'idle' | 'connecting' | 'listening' | 'processing' | 'speaking';
type Transcription = { speaker: 'user' | 'model' | 'tool_call'; text: string };

export type VoiceAgentHandle = {
  activate: () => void;
};

const TranscriptionDisplay: React.FC<{ history: Transcription[], currentInput: string, currentOutput: string }> = ({ history, currentInput, currentOutput }) => (
    <div className="fixed bottom-24 right-5 z-40 w-full max-w-sm h-auto max-h-[50vh] bg-gray-900/90 backdrop-blur-2xl rounded-2xl shadow-2xl flex flex-col text-white font-sans text-xs border border-white/10 animate-fade-in-up">
        <div className="p-3 border-b border-white/10 flex items-center justify-between">
            <h4 className="font-bold uppercase tracking-widest text-[10px] opacity-70">Live Assistant Transcript</h4>
            <div className="flex items-center gap-1.5">
                <span className="text-[10px] opacity-50">Live</span>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {history.map((t, i) => (
                <div key={i} className={`flex flex-col ${t.speaker === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[90%] p-2 rounded-xl ${t.speaker === 'user' ? 'bg-blue-600 rounded-tr-none' : 'bg-gray-700 rounded-tl-none'}`}>
                        <p className="leading-relaxed">{t.text}</p>
                    </div>
                </div>
            ))}
            {(currentInput || currentOutput) && (
                <div className={`flex flex-col ${currentInput ? 'items-end' : 'items-start'} animate-pulse`}>
                    <div className={`max-w-[90%] p-2 rounded-xl italic ${currentInput ? 'bg-blue-600/50 rounded-tr-none' : 'bg-gray-700/50 rounded-tl-none'}`}>
                        <p className="leading-relaxed">{currentInput || currentOutput}</p>
                    </div>
                </div>
            )}
        </div>
    </div>
);

const VoiceAgentOrb = forwardRef<VoiceAgentHandle, {}>((props, ref) => {
    const [status, setStatus] = useState<AgentStatus>('idle');
    const [isActive, setIsActive] = useState(false);
    const [uiInputTranscription, setUiInputTranscription] = useState('');
    const [uiOutputTranscription, setUiOutputTranscription] = useState('');
    const [transcriptionHistory, setTranscriptionHistory] = useState<Transcription[]>([]);
    
    const inputBufferRef = useRef('');
    const outputBufferRef = useRef('');
    const sessionPromiseRef = useRef<Promise<any> | null>(null);

    const handleAudioData = useCallback((audioData: Float32Array) => {
        if (sessionPromiseRef.current) {
            const pcmBlob = createBlob(audioData);
            sessionPromiseRef.current.then(session => {
                if (session) session.sendRealtimeInput({ media: pcmBlob });
            });
        }
    }, []);

    const { startProcessing, stopProcessing, playAudio, interruptPlayback } = useAudioProcessor(handleAudioData);

    const endSession = useCallback(() => {
        stopProcessing();
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => { if(session) session.close(); });
            sessionPromiseRef.current = null;
        }
        setStatus('idle');
        setIsActive(false);
        setTranscriptionHistory([]);
        inputBufferRef.current = '';
        outputBufferRef.current = '';
        setUiInputTranscription('');
        setUiOutputTranscription('');
    }, [stopProcessing]);

    const startSession = async () => {
        try {
            setStatus('connecting');
            setIsActive(true);
            const aistudio = (window as any).aistudio;
            if (aistudio && !(await aistudio.hasSelectedApiKey())) await aistudio.openSelectKey();

            const micStreamPromise = startProcessing();
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-12-2025',
                callbacks: {
                    onopen: () => {
                        setStatus('listening');
                        sessionPromiseRef.current?.then(session => {
                            if (session) session.sendRealtimeInput({ text: "Please introduce yourself as Hannah. Start the conversation by asking for the user's name immediately. Do not ask for their needs yet." });
                        });
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (audioData) { setStatus('speaking'); await playAudio(audioData); }
                        if (message.serverContent?.inputTranscription) {
                            inputBufferRef.current += message.serverContent.inputTranscription.text;
                            setUiInputTranscription(inputBufferRef.current);
                        }
                        if (message.serverContent?.outputTranscription) {
                            outputBufferRef.current += message.serverContent.outputTranscription.text;
                            setUiOutputTranscription(outputBufferRef.current);
                        }
                        if (message.serverContent?.interrupted) interruptPlayback();
                        if (message.serverContent?.turnComplete) {
                            setTranscriptionHistory(prev => [...prev, { speaker: 'user', text: inputBufferRef.current }, { speaker: 'model', text: outputBufferRef.current }].filter(t => t.text));
                            inputBufferRef.current = ''; outputBufferRef.current = ''; setUiInputTranscription(''); setUiOutputTranscription('');
                            setStatus('listening');
                        }
                    },
                    onerror: (e) => { console.error("Live API Error:", e); endSession(); },
                    onclose: () => endSession(),
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: `You are "Hannah - Elite's Virtual Assistant".
                    STRICT GREETING PROTOCOL:
                    1. First, ask whom you are speaking with.
                    2. Once they give you a name, greet them by name and ask how they are doing today.
                    3. Only then, ask how you can help them with their roofing needs.
                    
                    LEAD COLLECTION: If they want to book an inspection, collect Name, Property Address, Availability (Days/Times), Email, and Phone one by one.`,
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                },
            });
            await micStreamPromise;
        } catch (error) { endSession(); }
    };

    const toggleSession = () => isActive ? endSession() : startSession();
    useImperativeHandle(ref, () => ({ activate: () => { if (!isActive) startSession(); } }));

    return (
       <>
        {isActive && <TranscriptionDisplay history={transcriptionHistory} currentInput={uiInputTranscription} currentOutput={uiOutputTranscription} />}
        <div className="flex flex-col items-center gap-4">
            <button 
                onClick={toggleSession} 
                className={`relative text-white rounded-full p-8 h-40 w-40 flex items-center justify-center shadow-2xl transition-all duration-700 transform hover:scale-110 ${isActive ? 'bg-blue-600 ring-4 ring-blue-400 ring-opacity-50 animate-pulse' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
                <div className={`z-10 transition-transform duration-500 ${status === 'speaking' ? 'scale-125' : 'scale-100'}`}>
                    {status === 'speaking' ? <SpeakerWaveIcon className="w-24 h-24" /> : <MicrophoneIcon className={`w-24 h-24 ${status === 'connecting' ? 'animate-bounce opacity-50' : ''}`} />}
                </div>
                {status === 'speaking' && <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping"></div>}
                <div className="absolute -bottom-12 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 whitespace-nowrap">
                    {isActive ? status : 'SPEAK WITH HANNAH'}
                </div>
            </button>
            {isActive && (
                <button onClick={endSession} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-bold py-1 px-4 rounded-full border border-red-500/20 transition-all flex items-center gap-2">
                    <XMarkIcon className="w-3 h-3" /> DISCONNECT
                </button>
            )}
        </div>
       </>
    );
});

export default VoiceAgentOrb;
