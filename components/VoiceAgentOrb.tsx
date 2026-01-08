
import React, { useState, useRef, useCallback, useEffect, useImperativeHandle, forwardRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type } from '@google/genai';
import { MicrophoneIcon, XMarkIcon, SpeakerWaveIcon, SparkleIcon } from './Icon';
import { useAudioProcessor } from '../hooks/useAudioProcessor';
import { createBlob } from '../services/geminiService';

type AgentStatus = 'idle' | 'listening' | 'processing' | 'speaking';
type Transcription = { speaker: 'user' | 'model' | 'tool_call'; text: string };

export type VoiceAgentHandle = {
  activate: () => void;
};

// Sub-component for displaying transcriptions
const TranscriptionDisplay: React.FC<{ history: Transcription[], currentInput: string, currentOutput: string }> = ({ history, currentInput, currentOutput }) => (
    <div className="fixed bottom-24 right-5 z-40 w-full max-w-sm h-auto max-h-[60vh] bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col text-white font-mono text-sm border border-white/20 animate-fade-in-up">
        <div className="p-4 border-b border-white/20">
            <h4 className="font-bold text-center">Live Transcription</h4>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {history.map((t, i) => (
                <div key={i} className={`flex flex-col ${t.speaker === 'user' ? 'items-end' : t.speaker === 'model' ? 'items-start' : 'items-center'}`}>
                    <div className={`max-w-[85%] p-3 rounded-xl ${
                        t.speaker === 'user' ? 'bg-blue-500/80 rounded-br-none' : 
                        t.speaker === 'model' ? 'bg-gray-700/80 rounded-bl-none' :
                        'bg-yellow-600/80 text-xs font-sans'
                    }`}>
                        <p className="whitespace-pre-wrap break-words">{t.text}</p>
                    </div>
                </div>
            ))}
            {currentInput && (
                <div className="flex flex-col items-end">
                    <div className="max-w-[85%] p-3 rounded-xl bg-blue-500/50 rounded-br-none opacity-70">
                        <p className="whitespace-pre-wrap break-words">{currentInput}</p>
                    </div>
                </div>
            )}
            {currentOutput && (
                <div className="flex flex-col items-start">
                    <div className="max-w-[85%] p-3 rounded-xl bg-gray-700/50 rounded-bl-none opacity-70">
                        <p className="whitespace-pre-wrap break-words">{currentOutput}</p>
                    </div>
                </div>
            )}
        </div>
    </div>
);


const scheduleInspectionFunctionDeclaration: FunctionDeclaration = {
    name: 'scheduleInspection',
    description: 'Schedules a free, on-site roof inspection for the user.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            date: {
                type: Type.STRING,
                description: 'The requested date for the inspection in YYYY-MM-DD format. E.g., 2024-07-28.',
            },
            time: {
                type: Type.STRING,
                description: 'The requested time for the inspection. E.g., "morning", "afternoon", or a specific time like "3:00 PM".',
            },
            phone: {
                type: Type.STRING,
                description: 'The user\'s phone number for contact regarding the appointment.',
            },
            email: {
                type: Type.STRING,
                description: 'The user\'s email address for appointment confirmation.',
            },
        },
        required: ['date', 'time', 'phone', 'email'],
    },
};

const VoiceAgentOrb = forwardRef<VoiceAgentHandle, {}>((props, ref) => {
    const [status, setStatus] = useState<AgentStatus>('idle');
    const [isActive, setIsActive] = useState(false);
    const [micPermissionStatus, setMicPermissionStatus] = useState<PermissionState>('prompt');
    const [currentInputTranscription, setCurrentInputTranscription] = useState('');
    const [currentOutputTranscription, setCurrentOutputTranscription] = useState('');
    const [transcriptionHistory, setTranscriptionHistory] = useState<Transcription[]>([]);
    const sessionPromiseRef = useRef<Promise<any> | null>(null);

    useEffect(() => {
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'microphone' as PermissionName }).then((permissionStatus) => {
                setMicPermissionStatus(permissionStatus.state);
                permissionStatus.onchange = () => {
                    setMicPermissionStatus(permissionStatus.state);
                };
            }).catch(() => setMicPermissionStatus('prompt'));
        }
    }, []);

    const handleAudioData = useCallback((audioData: Float32Array) => {
        if (sessionPromiseRef.current) {
            const pcmBlob = createBlob(audioData);
            sessionPromiseRef.current.then(session => {
                if (session) session.sendRealtimeInput({ media: pcmBlob });
            });
        }
    }, []);

    const { startProcessing, stopProcessing, playAudio, interruptPlayback } = useAudioProcessor(handleAudioData);

    const getAI = () => {
        // Ensure we always get the latest key from process.env
        if (!process.env.API_KEY) throw new Error("API_KEY not set");
        return new GoogleGenAI({ apiKey: process.env.API_KEY });
    };
    
    const endSession = useCallback(() => {
        stopProcessing();
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => {
                if(session) session.close()
            });
            sessionPromiseRef.current = null;
        }
        setStatus('idle');
        setIsActive(false);
        setTranscriptionHistory([]);
        setCurrentInputTranscription('');
        setCurrentOutputTranscription('');
    }, [stopProcessing]);

    const startSession = async () => {
        try {
            setStatus('processing');
            setIsActive(true);
            await startProcessing();

            const ai = getAI();
            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        console.log('Live session opened.');
                        setStatus('listening');
                    },
                    onmessage: (message: LiveServerMessage) => {
                        // Handle audio
                        // Safer access to inlineData to avoid "Cannot read properties of undefined (reading 'data')"
                        const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (audioData) {
                            setStatus('speaking');
                            playAudio(audioData);
                        }
                        
                        // Handle transcriptions
                        if (message.serverContent?.inputTranscription) {
                            setCurrentInputTranscription(message.serverContent.inputTranscription.text);
                        }
                        if (message.serverContent?.outputTranscription) {
                            setCurrentOutputTranscription(message.serverContent.outputTranscription.text);
                        }

                        // Handle function calls
                        if (message.toolCall) {
                             for (const fc of message.toolCall.functionCalls) {
                                console.log('Function call received:', fc.name, fc.args);
                                let resultText = "Tool call executed.";
                                if (fc.name === 'scheduleInspection') {
                                    resultText = `Scheduling for ${fc.args.date} at ${fc.args.time} (Contact: ${fc.args.phone}, ${fc.args.email}).`;
                                    const result = `Successfully noted user's request to schedule for ${fc.args.date} at ${fc.args.time}. Contact info (${fc.args.phone}, ${fc.args.email}) captured. Confirmed with user.`;
                                    sessionPromiseRef.current?.then(session => {
                                        session.sendToolResponse({
                                            functionResponses: { id: fc.id, name: fc.name, response: { result } }
                                        });
                                    });
                                }
                                setTranscriptionHistory(prev => [...prev, { speaker: 'tool_call', text: `[Tool Call: ${resultText}]` }]);
                            }
                        }

                        if (message.serverContent?.interrupted) {
                            interruptPlayback();
                        }
                        if (message.serverContent?.turnComplete) {
                            const fullInputTranscription = currentInputTranscription;
                            const fullOutputTranscription = currentOutputTranscription;
                            if (fullInputTranscription || fullOutputTranscription) {
                                const newHistory: Transcription[] = [];
                                if(fullInputTranscription) newHistory.push({ speaker: 'user', text: fullInputTranscription });
                                if(fullOutputTranscription) newHistory.push({ speaker: 'model', text: fullOutputTranscription });

                                setTranscriptionHistory(prev => [
                                    ...prev,
                                    ...newHistory,
                                ]);
                            }
                            setCurrentInputTranscription('');
                            setCurrentOutputTranscription('');
                            setStatus('listening');
                        }
                    },
                    onerror: async (e: ErrorEvent) => {
                        console.error('Live session error details:', e);
                        
                        // Immediate cleanup to allow for a clean retry
                        stopProcessing();
                        if (sessionPromiseRef.current) {
                            sessionPromiseRef.current.then(session => session?.close());
                            sessionPromiseRef.current = null;
                        }
                        setStatus('idle');
                        setIsActive(false);

                        // Check for API Key issues and prompt user
                        const aistudio = (window as any).aistudio;
                        if (aistudio) {
                            const retry = window.confirm("Connection error with Voice Agent. Your API Key may be invalid or expired. Would you like to update your API Key and try again?");
                            if (retry) {
                                const success = await aistudio.openSelectKey();
                                if (success) {
                                    // Slight delay to ensure env var update
                                    setTimeout(() => startSession(), 500);
                                    return;
                                }
                            }
                        } else {
                            alert("Connection error: The Voice Agent could not connect. Please check your network or API Key.");
                        }
                    },
                    onclose: (e: CloseEvent) => {
                        console.log('Live session closed.');
                        endSession();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: `You are a friendly and professional AI receptionist for 'Elite Roofing Solutions'. Upon the start of the conversation, you MUST immediately greet the user, ask "Whom am I speaking with?", and then ask "How can I help you today?". Do not deviate from this opening. Keep your answers concise and conversational for a voice-first experience. You can schedule inspections for users. When a user requests to schedule an inspection, use the 'scheduleInspection' tool. You MUST ask for and collect the desired date, time, phone number, and email address from the user before calling the function. Do not call the function until you have all four pieces of information (Date, Time, Phone, Email). Today's date is ${new Date().toLocaleDateString()}.`,
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    tools: [{ functionDeclarations: [scheduleInspectionFunctionDeclaration] }],
                },
            });

        } catch (error) {
            console.error("Failed to start voice agent session:", error);
            if (error instanceof DOMException && error.name === 'NotAllowedError') {
                 setMicPermissionStatus('denied');
            }
            setStatus('idle');
            setIsActive(false);
            alert("Could not start audio processing. Please check your microphone permissions.");
        }
    };

    const toggleSession = async () => {
        if (micPermissionStatus === 'denied') {
            alert("Microphone access is blocked. To use the voice agent, please enable microphone permissions for this site in your browser settings.");
            return;
        }

        if (isActive) {
            endSession();
        } else {
             const aistudio = (window as any).aistudio;
             if (aistudio) {
                 const hasKey = await aistudio.hasSelectedApiKey();
                 if (!hasKey) {
                     const success = await aistudio.openSelectKey();
                     if (!success) return; 
                 }
             }
            startSession();
        }
    };

    useImperativeHandle(ref, () => ({
        activate: () => {
            if (!isActive) {
                toggleSession();
            }
        },
    }));

    const getStatusStyles = () => {
        if (micPermissionStatus === 'denied') {
            return 'bg-red-600 ring-red-500 cursor-not-allowed';
        }
        switch (status) {
            case 'listening': return 'bg-blue-500 ring-blue-400 animate-pulse-listen';
            case 'processing': return 'bg-yellow-500 ring-yellow-400 animate-glow-process';
            case 'speaking': return 'bg-green-500 ring-green-400';
            default: return 'bg-gray-700 hover:bg-gray-600 animate-pulse-idle';
        }
    };
    
    const getStatusIcon = () => {
        if (!isActive) {
            return <MicrophoneIcon className="w-24 h-24" />;
        }
    
        switch (status) {
            case 'listening':
                return <MicrophoneIcon className="w-24 h-24" />;
            case 'processing':
                return <SparkleIcon className="w-24 h-24" />;
            case 'speaking':
                return <SpeakerWaveIcon className="w-24 h-24" />;
            default:
                return <XMarkIcon className="w-24 h-24" />;
        }
    };
    
    const getTooltipText = () => {
        if (micPermissionStatus === 'denied') {
            return "Microphone access blocked. Check browser settings.";
        }
        if (!isActive) {
            return "Activate Voice Agent";
        }
        switch (status) {
            case 'listening': return "Listening (blue, pulsing). Click to deactivate.";
            case 'processing': return "Connecting (yellow, glowing)... Click to deactivate.";
            case 'speaking': return "Speaking (green, radiating waves). Click to deactivate.";
            default: return "Deactivate Voice Agent";
        }
    };


    return (
       <>
        {isActive && <TranscriptionDisplay history={transcriptionHistory} currentInput={currentInputTranscription} currentOutput={currentOutputTranscription} />}
        <div className="relative z-50 flex items-center justify-center">
            <style>{`
                @keyframes pulse-idle {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 0 0 0 rgba(209, 213, 219, 0.3);
                    }
                    50% {
                        transform: scale(1.05);
                        box-shadow: 0 0 0 10px rgba(209, 213, 219, 0);
                    }
                }
                .animate-pulse-idle {
                    animation: pulse-idle 2.5s infinite cubic-bezier(0.4, 0, 0.6, 1);
                }
                @keyframes pulse-listen {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.6); }
                    50% { box-shadow: 0 0 0 12px rgba(59, 130, 246, 0); }
                }
                .animate-pulse-listen {
                    animation: pulse-listen 2.5s infinite cubic-bezier(0.66, 0, 0, 1);
                }
                @keyframes glow-process {
                    0%, 100% { box-shadow: 0 0 5px 3px rgba(234, 179, 8, 0.2); }
                    50% { box-shadow: 0 0 10px 8px rgba(234, 179, 8, 0.5); }
                }
                .animate-glow-process {
                    animation: glow-process 2s infinite ease-in-out;
                }
                @keyframes ripple-speak {
                    0% { transform: scale(1); opacity: 0.7; }
                    100% { transform: scale(2.5); opacity: 0; }
                }
                .animate-ripple-speak {
                    animation: ripple-speak 2s infinite ease-out;
                }
                 @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                }
            `}</style>
            <button
                onClick={toggleSession}
                className={`relative text-white rounded-full p-6 h-40 w-40 flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none ring-4 ring-opacity-50 ${getStatusStyles()}`}
                aria-label={isActive ? "Deactivate Voice Agent" : "Activate Voice Agent"}
                title={getTooltipText()}
            >
                {status === 'speaking' && (
                    <span className="absolute inset-0 m-auto h-full w-full rounded-full bg-green-500 animate-ripple-speak"></span>
                )}
                <div className="relative z-10">
                    {getStatusIcon()}
                </div>
            </button>
        </div>
       </>
    );
});

export default VoiceAgentOrb;
