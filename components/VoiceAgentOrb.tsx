import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type } from '@google/genai';
import { MicrophoneIcon, XMarkIcon } from './Icon';
import { useAudioProcessor } from '../hooks/useAudioProcessor';
import { createBlob } from '../services/geminiService';

type AgentStatus = 'idle' | 'listening' | 'processing' | 'speaking';
type Transcription = { speaker: 'user' | 'model'; text: string };

// Sub-component for displaying transcriptions
const TranscriptionDisplay: React.FC<{ history: Transcription[], currentInput: string, currentOutput: string }> = ({ history, currentInput, currentOutput }) => (
    <div className="fixed bottom-24 right-5 z-40 w-full max-w-sm h-auto max-h-[50vh] bg-black/70 backdrop-blur-md rounded-xl shadow-2xl flex flex-col p-4 text-white font-mono text-sm">
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {history.map((t, i) => (
                <div key={i} className={`flex items-start gap-2 ${t.speaker === 'user' ? 'text-cyan-300' : 'text-fuchsia-300'}`}>
                    <span className="font-bold uppercase">{t.speaker}:</span>
                    <p className="flex-1 whitespace-pre-wrap break-words">{t.text}</p>
                </div>
            ))}
            {currentInput && <div className="text-cyan-300/70"><span className="font-bold uppercase">USER:</span> {currentInput}</div>}
            {currentOutput && <div className="text-fuchsia-300/70"><span className="font-bold uppercase">MODEL:</span> {currentOutput}</div>}
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
        },
        required: ['date', 'time'],
    },
};

const VoiceAgentOrb: React.FC = () => {
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
            await startProcessing();
            setStatus('listening');
            setIsActive(true);

            const ai = getAI();
            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => console.log('Live session opened.'),
                    onmessage: (message: LiveServerMessage) => {
                        // Handle audio
                        const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
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
                                if (fc.name === 'scheduleInspection') {
                                    // In a real app, this would trigger the scheduling logic.
                                    // For now, we'll confirm it back to the model.
                                    const result = `Successfully noted user's request to schedule for ${fc.args.date} at ${fc.args.time}. Confirmed with user.`;
                                    sessionPromiseRef.current?.then(session => {
                                        session.sendToolResponse({
                                            functionResponses: { id: fc.id, name: fc.name, response: { result } }
                                        });
                                    });
                                }
                            }
                        }

                        if (message.serverContent?.interrupted) {
                            interruptPlayback();
                        }
                        if (message.serverContent?.turnComplete) {
                            setTranscriptionHistory(prev => [
                                ...prev,
                                { speaker: 'user', text: currentInputTranscription },
                                { speaker: 'model', text: currentOutputTranscription },
                            ]);
                            setCurrentInputTranscription('');
                            setCurrentOutputTranscription('');
                            setStatus('listening');
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        setStatus('idle');
                        alert("There was a connection error with the voice agent.");
                        endSession();
                    },
                    onclose: (e: CloseEvent) => {
                        console.log('Live session closed.');
                        endSession();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: `You are a friendly and helpful AI receptionist for 'Elite Roofing Solutions'. Keep your answers concise and conversational for a voice-first experience. You can schedule inspections for users. Today's date is ${new Date().toLocaleDateString()}. Ask clarifying questions if needed before calling a function.`,
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
        }
    };

    const toggleSession = () => {
        if (micPermissionStatus === 'denied') {
            alert("Microphone access is blocked. To use the voice agent, please enable microphone permissions for this site in your browser settings.");
            return;
        }

        if (isActive) {
            endSession();
        } else {
            startSession();
        }
    };

    const getStatusStyles = () => {
        if (micPermissionStatus === 'denied') {
            return 'bg-red-600 ring-red-500 cursor-not-allowed';
        }
        switch (status) {
            case 'listening': return 'bg-blue-500 ring-blue-400 animate-pulse';
            case 'processing': return 'bg-yellow-500 ring-yellow-400 animate-spin';
            case 'speaking': return 'bg-green-500 ring-green-400 animate-pulse-speak';
            default: return 'bg-gray-700 hover:bg-gray-600';
        }
    };
    
    const getStatusIcon = () => {
        if (!isActive) return <MicrophoneIcon className="w-6 h-6" />;
        if (status === 'listening' || status === 'speaking' || status === 'processing') return <MicrophoneIcon className="w-6 h-6"/>;
        return <XMarkIcon className="w-6 h-6"/>;
    };


    return (
       <>
        {isActive && <TranscriptionDisplay history={transcriptionHistory} currentInput={currentInputTranscription} currentOutput={currentOutputTranscription} />}
        <div className="relative z-50 flex items-center justify-center">
            <style>{`
                @keyframes pulse-speak {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.9; }
                }
                .animate-pulse-speak {
                    animation: pulse-speak 1s ease-in-out infinite;
                }
            `}</style>
            <button
                onClick={toggleSession}
                className={`text-white rounded-full p-2 shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none ring-4 ring-opacity-50 ${getStatusStyles()}`}
                aria-label={isActive ? "Deactivate Voice Agent" : "Activate Voice Agent"}
                title={micPermissionStatus === 'denied' ? "Microphone access blocked. Check browser settings." : (isActive ? "Deactivate Voice Agent" : "Activate Voice Agent")}
            >
                {getStatusIcon()}
            </button>
        </div>
       </>
    );
};

export default VoiceAgentOrb;