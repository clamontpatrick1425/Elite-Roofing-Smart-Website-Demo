import React, { useState, useRef, useCallback, useEffect, useImperativeHandle, forwardRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { MicrophoneIcon, XMarkIcon, SpeakerWaveIcon, ArrowPathIcon } from './Icon';
import { useAudioProcessor } from '../hooks/useAudioProcessor';
import { createBlob, handleApiError } from '../services/geminiService';

type AgentStatus = 'idle' | 'connecting' | 'listening' | 'processing' | 'speaking' | 'error';
type Transcription = { speaker: 'user' | 'model' | 'tool_call'; text: string };

export type VoiceAgentHandle = {
  activate: () => void;
};

const TranscriptionDisplay: React.FC<{ history: Transcription[], currentInput: string, currentOutput: string }> = ({ history, currentInput, currentOutput }) => (
    <div 
        className="fixed bottom-24 right-5 z-40 w-full max-w-sm h-auto max-h-[50vh] bg-gray-900/90 backdrop-blur-2xl rounded-2xl shadow-2xl flex flex-col text-white font-sans text-xs border border-white/10 animate-fade-in-up"
        role="log"
        aria-live="polite"
        aria-label="Assistant Transcript History"
    >
        <div className="p-3 border-b border-white/10 flex items-center justify-between">
            <h4 className="font-bold uppercase tracking-widest text-[10px] opacity-70">Live Assistant Transcript</h4>
            <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="text-[10px] opacity-50">Live</span>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {history.map((t, i) => (
                <div key={i} className={`flex flex-col ${t.speaker === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[90%] p-2 rounded-xl ${t.speaker === 'user' ? 'bg-blue-600 rounded-tr-none' : 'bg-gray-700 rounded-tl-none'}`}>
                        <span className="sr-only">{t.speaker === 'user' ? 'You:' : 'Hannah:'}</span>
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
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    
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
        setErrorMsg(null);
    }, [stopProcessing]);

    const startSession = async () => {
        try {
            setErrorMsg(null);
            setStatus('connecting');
            setIsActive(true);
            
            const aistudio = (window as any).aistudio;
            if (aistudio && !(await aistudio.hasSelectedApiKey())) {
                await aistudio.openSelectKey();
            }

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
                            // Fix: Added 'as const' to string literals for speaker to match the Transcription type definition
                            setTranscriptionHistory(prev => [...prev, { speaker: 'user' as const, text: inputBufferRef.current }, { speaker: 'model' as const, text: outputBufferRef.current }].filter(t => t.text));
                            inputBufferRef.current = ''; outputBufferRef.current = ''; setUiInputTranscription(''); setUiOutputTranscription('');
                            setStatus('listening');
                        }
                    },
                    onerror: (e: any) => { 
                        console.error("Live Assistant API Error:", e);
                        const msg = String(e).toLowerCase();
                        if (msg.includes("entity was not found") || msg.includes("api key not found")) {
                            setErrorMsg("Billing Required: Please use a key from a PAID Google Cloud project.");
                        } else {
                            setErrorMsg("Assistant connection failed. Check your network.");
                        }
                        setStatus('error');
                    },
                    onclose: () => {
                        if (status !== 'error') endSession();
                    },
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
        } catch (error) { 
            console.error("Assistant Start Error:", error);
            setErrorMsg("Microphone permission denied or connection timed out.");
            setStatus('error');
        }
    };

    const toggleSession = () => isActive ? endSession() : startSession();
    useImperativeHandle(ref, () => ({ activate: () => { if (!isActive) startSession(); } }));

    const handleReconfigure = async () => {
        const aistudio = (window as any).aistudio;
        if (aistudio) {
            await aistudio.openSelectKey();
            endSession();
        }
    };

    return (
       <>
        {isActive && status !== 'error' && <TranscriptionDisplay history={transcriptionHistory} currentInput={uiInputTranscription} currentOutput={uiOutputTranscription} />}
        
        <div className="flex flex-col items-center gap-4">
            <button 
                onClick={toggleSession} 
                aria-label={isActive ? `Disconnect Hannah Assistant (Status: ${status})` : 'Call Hannah AI Assistant'}
                aria-pressed={isActive}
                className={`relative text-white rounded-full p-8 h-40 w-40 flex items-center justify-center shadow-2xl transition-all duration-700 transform hover:scale-110 focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-offset-4 ${isActive ? (status === 'error' ? 'bg-red-600' : 'bg-blue-600 ring-4 ring-blue-400 ring-opacity-50 animate-pulse') : 'bg-gray-800 hover:bg-gray-700 animate-orb-pulsate'}`}
            >
                <div className={`z-10 transition-transform duration-500 ${status === 'speaking' ? 'scale-125' : 'scale-100'}`} aria-hidden="true">
                    {status === 'speaking' ? <SpeakerWaveIcon className="w-24 h-24" /> : (status === 'error' ? <XMarkIcon className="w-24 h-24" /> : <MicrophoneIcon className={`w-24 h-24 ${status === 'connecting' ? 'animate-bounce opacity-50' : ''}`} />)}
                </div>
                {status === 'speaking' && <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping" aria-hidden="true"></div>}
                <div 
                    className={`absolute -bottom-12 text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap ${status === 'error' ? 'text-red-500' : 'text-gray-500'}`}
                    aria-live="polite"
                >
                    {isActive ? status : 'Speak with Hannah'}
                </div>
            </button>

            {status === 'error' && (
                <div className="flex flex-col items-center gap-3 animate-fade-in-up mt-16 max-w-[200px] text-center" role="alert" aria-live="assertive">
                    <p className="text-[10px] font-bold text-red-600 leading-tight">{errorMsg}</p>
                    <button 
                        onClick={handleReconfigure}
                        className="flex items-center gap-2 bg-white text-red-600 text-[10px] font-black py-2 px-4 rounded-full shadow-lg hover:bg-gray-50 transition-all focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                        <ArrowPathIcon className="w-3 h-3" /> RECONFIGURE KEY
                    </button>
                    <button 
                        onClick={endSession} 
                        className="text-[9px] font-bold text-gray-500 underline hover:text-gray-700 focus-visible:text-gray-900"
                    >
                        DISMISS
                    </button>
                </div>
            )}

            {isActive && status !== 'error' && (
                <button 
                    onClick={endSession} 
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-600 text-[10px] font-bold py-1 px-4 rounded-full border border-red-500/20 transition-all flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-red-500"
                >
                    <XMarkIcon className="w-3 h-3" /> DISCONNECT
                </button>
            )}
        </div>
        <style>{`
            @keyframes orb-pulsate {
                0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(31, 41, 55, 0.4), 0 10px 30px rgba(0,0,0,0.3); }
                50% { transform: scale(1.15); box-shadow: 0 0 0 35px rgba(31, 41, 55, 0), 0 20px 60px rgba(0,0,0,0.5); }
                100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(31, 41, 55, 0), 0 10px 30px rgba(0,0,0,0.3); }
            }
            .animate-orb-pulsate {
                animation: orb-pulsate 2s infinite ease-in-out;
            }
        `}</style>
       </>
    );
});

export default VoiceAgentOrb;