
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  PaperAirplaneIcon, 
  XMarkIcon, 
  MicrophoneIcon, 
  SpeakerWaveIcon, 
  TrashIcon,
  SparkleIcon,
  CameraIcon,
  ChevronRightIcon,
  HomeIcon,
  ShieldCheckIcon,
  VideoCameraIcon
} from './Icon';
import { 
  sendMessageToChatbotStream, 
  resetChatSession, 
  createBlob
} from '../services/geminiService';
import { ChatMessage } from '../types';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { useAudioProcessor } from '../hooks/useAudioProcessor';

type HubTab = 'chat' | 'voice' | 'tools';
type AgentStatus = 'idle' | 'connecting' | 'listening' | 'processing' | 'speaking' | 'error';
type Transcription = { speaker: 'user' | 'model'; text: string };

interface AIHubProps {
  onOpenEstimate: () => void;
  onOpenDamageAssessor: () => void;
  onOpenVisualizer: () => void;
  onOpenDesignStudio: () => void;
}

interface AppointmentDetails {
  name: string;
  address: string;
  time: string;
  email: string;
  phone: string;
}

const INITIAL_MESSAGE_CONTENT = "Hello! I'm Hannah from Elite Roofing. May I ask whom I'm speaking with today?";

const AIHub: React.FC<AIHubProps> = ({ onOpenEstimate, onOpenDamageAssessor, onOpenVisualizer, onOpenDesignStudio }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<HubTab>('chat');
  const [chatKey, setChatKey] = useState(0); 
  const [messages, setMessages] = useState<(ChatMessage & { appointmentSummary?: AppointmentDetails })[]>(() => {
    try {
      const saved = localStorage.getItem('eliteRoofingChatHistory');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [voiceStatus, setVoiceStatus] = useState<AgentStatus>('idle');
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceTranscription, setVoiceTranscription] = useState<Transcription[]>([]);
  const [currentVoiceInput, setCurrentVoiceInput] = useState('');
  const [currentVoiceOutput, setCurrentVoiceOutput] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const voiceScrollRef = useRef<HTMLDivElement>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const chatSessionIdRef = useRef<number>(0);
  const hubRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback((ref: React.RefObject<HTMLDivElement | null>, behavior: ScrollBehavior = 'smooth') => {
    if (ref.current) {
        requestAnimationFrame(() => {
            if (ref.current) ref.current.scrollTo({ top: ref.current.scrollHeight, behavior });
        });
    }
  }, []);

  // Accessibility: Focus Restoration
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => chatInputRef.current?.focus(), 400);
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  // Accessibility: Focus Trap logic
  useEffect(() => {
    if (!isOpen) return;
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
      if (e.key === 'Tab') {
        const focusable = hubRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as NodeListOf<HTMLElement>;
        if (focusable.length) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [isOpen]);

  useEffect(() => {
    if (messages.length === 0 && !isLoading) {
        setMessages([{ role: 'model', content: INITIAL_MESSAGE_CONTENT }]);
    }
  }, [messages.length, isLoading]);

  useEffect(() => {
    if (isOpen) scrollToBottom(activeTab === 'chat' ? chatScrollRef : voiceScrollRef);
  }, [messages, voiceTranscription, currentVoiceInput, currentVoiceOutput, activeTab, isOpen, scrollToBottom]);

  const handleAudioData = useCallback((audioData: Float32Array) => {
    if (sessionPromiseRef.current) {
        const pcmBlob = createBlob(audioData);
        sessionPromiseRef.current.then(session => {
            if (session) session.sendRealtimeInput({ media: pcmBlob });
        });
    }
  }, []);

  const { startProcessing, stopProcessing, playAudio, interruptPlayback } = useAudioProcessor(handleAudioData);

  const endVoiceSession = useCallback(() => {
    stopProcessing();
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => { if(session) session.close(); });
        sessionPromiseRef.current = null;
    }
    setVoiceStatus('idle');
    setVoiceActive(false);
  }, [stopProcessing]);

  const clearChat = () => {
    if (window.confirm("Erase conversation history?")) {
      chatSessionIdRef.current += 1;
      localStorage.removeItem('eliteRoofingChatHistory');
      setMessages([{ role: 'model', content: INITIAL_MESSAGE_CONTENT }]);
      setIsLoading(false);
      setUserInput('');
      setChatKey(prev => prev + 1);
      resetChatSession();
      setVoiceTranscription([]);
    }
  };

  const startVoiceSession = async () => {
    try {
        setVoiceError(null);
        setVoiceStatus('connecting');
        setVoiceActive(true);

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
                    setVoiceStatus('listening');
                    sessionPromiseRef.current?.then(session => {
                        if (session) session.sendRealtimeInput({ text: "Introduce yourself as Hannah from Elite Roofing. Start by asking for the user's name." });
                    });
                },
                onmessage: async (message: LiveServerMessage) => {
                    const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (audioData) { setVoiceStatus('speaking'); await playAudio(audioData); }
                    if (message.serverContent?.inputTranscription) setCurrentVoiceInput(prev => prev + message.serverContent!.inputTranscription!.text);
                    if (message.serverContent?.outputTranscription) setCurrentVoiceOutput(prev => prev + message.serverContent!.outputTranscription!.text);
                    if (message.serverContent?.interrupted) interruptPlayback();
                    if (message.serverContent?.turnComplete) {
                        setVoiceTranscription(prev => [...prev, { speaker: 'user' as const, text: currentVoiceInput }, { speaker: 'model' as const, text: currentVoiceOutput }].filter(t => t.text));
                        setCurrentVoiceInput(''); setCurrentVoiceOutput(''); setVoiceStatus('listening');
                    }
                },
                onerror: (e) => { 
                    console.error("Live Hub API Error:", e);
                    setVoiceError("Connection lost. Please check your project billing or network.");
                    setVoiceStatus('error');
                },
                onclose: () => {
                    if (voiceStatus !== 'error') endVoiceSession();
                },
            },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                systemInstruction: `You are Hannah, Elite's AI Receptionist. Be brief and professional.`,
                inputAudioTranscription: {},
                outputAudioTranscription: {},
            },
        });
        await micStreamPromise;
    } catch (error: any) { 
        console.error("Voice Hub Start Error:", error);
        setVoiceError("Microphone or API access denied.");
        setVoiceStatus('error');
    }
  };

  const handleChatSend = async () => {
    if (!userInput.trim() || isLoading) return;
    
    setIsLoading(true);
    const text = userInput;
    const userMsg: ChatMessage = { role: 'user', content: text };
    const modelPlaceholder: ChatMessage = { role: 'model', content: '' };
    const placeholderIndex = messages.length + 1;
    const currentSessionId = chatSessionIdRef.current;

    setMessages(prev => [...prev, userMsg, modelPlaceholder]);
    setUserInput('');

    let accumulated = "";
    try {
        const result = await sendMessageToChatbotStream(text, (chunk) => {
            if (chatSessionIdRef.current !== currentSessionId) return;
            accumulated += chunk;
            setMessages(prev => {
                const next = [...prev];
                if (next[placeholderIndex]) next[placeholderIndex] = { ...next[placeholderIndex], content: accumulated };
                return next;
            });
        });
        
        if (chatSessionIdRef.current !== currentSessionId) return;
        setMessages(prev => {
            const next = [...prev];
            if (next[placeholderIndex]) {
                next[placeholderIndex] = { 
                    ...next[placeholderIndex], 
                    content: result.reply,
                    appointmentSummary: result.appointmentSummary
                };
            }
            return next;
        });
    } catch (e: any) {
        if (chatSessionIdRef.current === currentSessionId) {
            setMessages(prev => {
                const next = [...prev];
                if (next[placeholderIndex]) next[placeholderIndex].content = "I encountered an error. Please try again.";
                return next;
            });
        }
    } finally { 
        if (chatSessionIdRef.current === currentSessionId) setIsLoading(false); 
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          ref={triggerRef}
          onClick={() => setIsOpen(!isOpen)} 
          className={`group relative flex items-center justify-center w-[90px] h-[90px] rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${isOpen ? 'bg-gray-800 rotate-90' : 'bg-blue-700 animate-hub-pulse'}`}
          aria-label={isOpen ? "Close AI Hub" : "Open Elite AI Concierge Hub"}
          aria-expanded={isOpen}
          aria-controls="ai-hub-container"
        >
          {isOpen ? <XMarkIcon className="w-10 h-10 text-white" /> : <SparkleIcon className="w-12 h-12 text-white" aria-hidden="true" />}
        </button>
      </div>

      <div 
        id="ai-hub-container"
        ref={hubRef}
        className={`fixed bottom-[110px] right-6 z-50 w-[380px] md:w-[440px] max-w-[95vw] h-[680px] max-h-[85vh] bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden transition-all duration-500 ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-12 invisible pointer-events-none'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Elite Roofing AI Hub"
      >
        <header className="p-6 pb-2 border-b border-gray-50 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center shadow-lg" aria-hidden="true">
                        <HomeIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h2 className="font-bold text-base dark:text-white leading-tight">Elite Hub</h2>
                            {activeTab === 'chat' && messages.length > 1 && (
                                <button 
                                    onClick={clearChat} 
                                    aria-label="Clear chat history"
                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-red-600"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <p className="text-[10px] text-gray-700 dark:text-gray-400 uppercase tracking-widest font-black">Hannah AI Assistant</p>
                    </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full lg:hidden"
                  aria-label="Close"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
            </div>
            
            <nav className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl" role="tablist" aria-label="Hub features">
                {(['chat', 'voice', 'tools'] as HubTab[]).map(tab => (
                    <button 
                        key={tab} 
                        role="tab"
                        aria-selected={activeTab === tab}
                        aria-controls={`hub-panel-${tab}`}
                        id={`tab-${tab}`}
                        onClick={() => setActiveTab(tab)} 
                        className={`flex-1 py-2 rounded-lg text-[11px] font-black transition-all focus-visible:ring-2 focus-visible:ring-blue-600 ${activeTab === tab ? 'bg-white dark:bg-gray-700 text-blue-800 dark:text-blue-300 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}
            </nav>
        </header>

        <main className="flex-1 overflow-hidden relative flex flex-col" id="hub-panels">
            {activeTab === 'chat' && (
                <div id="hub-panel-chat" role="tabpanel" aria-labelledby="tab-chat" className="flex-1 flex flex-col animate-fade-in overflow-hidden" key={chatKey}>
                    <div 
                        ref={chatScrollRef} 
                        className="flex-1 overflow-y-auto p-6 pt-4 space-y-4"
                        role="log"
                        aria-live="polite"
                    >
                        <ul className="space-y-4">
                            {messages.map((msg, i) => (
                                <li key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}>
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-700 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-200/50 dark:border-gray-700/50'}`}>
                                        <span className="sr-only">{msg.role === 'user' ? 'You said:' : 'Hannah said:'}</span>
                                        <p className="whitespace-pre-wrap">{msg.content || (isLoading && i === messages.length - 1 ? 'Hannah is typing...' : '')}</p>
                                    </div>
                                    {msg.appointmentSummary && (
                                        <div className="w-full max-w-[90%] bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 p-5 rounded-2xl shadow-sm" aria-label="Appointment Confirmation Detail">
                                            <div className="flex items-center gap-2 mb-3 text-green-800 dark:text-green-400">
                                                <ShieldCheckIcon className="w-5 h-5" aria-hidden="true" />
                                                <span className="font-bold text-xs uppercase tracking-wider">Confirmed Inspection</span>
                                            </div>
                                            <div className="space-y-1.5 text-xs text-gray-800 dark:text-gray-300">
                                                <p><span className="font-bold text-gray-500 mr-2">CLIENT:</span> {msg.appointmentSummary.name}</p>
                                                <p><span className="font-bold text-gray-500 mr-2">ADDRESS:</span> {msg.appointmentSummary.address}</p>
                                                <p><span className="font-bold text-gray-500 mr-2">WINDOW:</span> {msg.appointmentSummary.time}</p>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="sr-only" aria-live="polite">
                        {isLoading ? "Hannah is typing a response..." : ""}
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-950/20 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
                        <div className="flex-1 relative">
                            <label htmlFor="hub-chat-input" className="sr-only">Type your message to the assistant</label>
                            <input 
                                ref={chatInputRef}
                                id="hub-chat-input"
                                value={userInput} 
                                onChange={e => setUserInput(e.target.value)} 
                                onKeyDown={e => e.key === 'Enter' && handleChatSend()} 
                                placeholder="Type a message..." 
                                disabled={isLoading} 
                                className="w-full bg-white dark:bg-gray-800 px-5 py-4 rounded-2xl text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-700 dark:text-white border border-gray-200 dark:border-gray-700" 
                            />
                        </div>
                        <button 
                            onClick={handleChatSend} 
                            disabled={isLoading || !userInput.trim()} 
                            aria-label="Send message"
                            className="w-14 h-14 bg-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg disabled:opacity-50 hover:bg-blue-800 transition-all focus-visible:ring-4 focus-visible:ring-blue-600/30"
                        >
                            <PaperAirplaneIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'voice' && (
                <div id="hub-panel-voice" role="tabpanel" aria-labelledby="tab-voice" className="flex-1 flex flex-col p-8 animate-fade-in overflow-hidden">
                    {!voiceActive ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
                            <div className="w-28 h-28 bg-blue-50 dark:bg-blue-900/10 rounded-full flex items-center justify-center border border-blue-100 dark:border-blue-800 shadow-2xl" aria-hidden="true">
                                <MicrophoneIcon className="w-12 h-12 text-blue-700" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="font-bold text-2xl dark:text-white">Voice Concierge</h3>
                                <p className="text-sm text-gray-700 dark:text-gray-400 max-w-[280px] leading-relaxed">Hannah is ready to talk. Use your microphone to book an appointment or ask questions.</p>
                            </div>
                            <button 
                                onClick={startVoiceSession} 
                                className="bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold text-base shadow-xl hover:bg-blue-800 transition-all focus-visible:ring-4 focus-visible:ring-blue-600/30"
                                aria-label="Start voice call with Hannah"
                            >
                                Start Conversation
                            </button>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <div 
                                ref={voiceScrollRef} 
                                className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2"
                                role="log"
                                aria-live="polite"
                                aria-label="Voice Transcript"
                            >
                                {voiceTranscription.map((t, i) => (
                                    <div key={i} className={`flex flex-col ${t.speaker === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[85%] p-4 rounded-2xl text-[14px] ${t.speaker === 'user' ? 'bg-blue-700 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-800 dark:text-white rounded-tl-none border border-gray-200/50 dark:border-gray-700/50'}`}>
                                            <span className="sr-only">{t.speaker === 'user' ? 'You said:' : 'Hannah said:'}</span>
                                            {t.text}
                                        </div>
                                    </div>
                                ))}
                                {(currentVoiceInput || currentVoiceOutput) && (
                                    <div className={`flex flex-col ${currentVoiceInput ? 'items-end' : 'items-start'} animate-pulse`}>
                                        <div className={`max-w-[85%] p-3 rounded-2xl text-[14px] italic ${currentVoiceInput ? 'bg-blue-600/30 text-white' : 'bg-gray-100 dark:bg-gray-800/80 dark:text-white'}`}>
                                            {currentVoiceInput || currentVoiceOutput}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className={`bg-gray-50 dark:bg-gray-800/50 p-8 rounded-[2.5rem] text-center border-2 border-transparent transition-all ${voiceStatus === 'error' ? 'border-red-500' : ''}`}>
                                {voiceStatus === 'error' ? (
                                    <div className="space-y-4" role="alert" aria-live="assertive">
                                        <p className="text-sm font-bold text-red-700">{voiceError}</p>
                                        <button 
                                            onClick={() => { setVoiceActive(false); setVoiceStatus('idle'); }} 
                                            className="bg-gray-900 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-center gap-1.5 mb-6 h-10 items-center" aria-hidden="true">
                                            {[1,2,3,4,5].map(i => (
                                                <div 
                                                    key={i} 
                                                    className={`w-1.5 bg-blue-700 rounded-full transition-all duration-300 ${voiceStatus === 'speaking' ? 'h-full animate-bounce' : 'h-1.5'}`} 
                                                    style={{ animationDelay: `${i*0.08}s` }}
                                                ></div>
                                            ))}
                                        </div>
                                        <p className="text-[11px] font-black text-blue-800 dark:text-blue-400 uppercase tracking-widest mb-6" aria-live="assertive">Status: {voiceStatus}</p>
                                        <button 
                                            onClick={endVoiceSession} 
                                            className="bg-red-600 text-white px-10 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all"
                                            aria-label="End call"
                                        >
                                            End Call
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'tools' && (
                <div id="hub-panel-tools" role="tabpanel" aria-labelledby="tab-tools" className="flex-1 p-6 space-y-4 animate-fade-in overflow-y-auto">
                    {[
                      { icon: SparkleIcon, title: "Project Estimate", color: "blue", action: onOpenEstimate, desc: "Live market pricing" },
                      { icon: VideoCameraIcon, title: "Design Studio", color: "indigo", action: onOpenDesignStudio, desc: "AI Cinematic flyover" },
                      { icon: SparkleIcon, title: "Project Visualizer", color: "purple", action: onOpenVisualizer, desc: "AI Before/After simulation" },
                      { icon: CameraIcon, title: "Damage Check", color: "orange", action: onOpenDamageAssessor, desc: "Photo-based AI report" }
                    ].map((tool) => (
                      <button 
                        key={tool.title}
                        onClick={() => { tool.action(); setIsOpen(false); }} 
                        className="w-full bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-200 dark:border-gray-700 flex items-center justify-between hover:border-blue-600 hover:shadow-xl transition-all group focus-visible:ring-4 focus-visible:ring-blue-600/30"
                        aria-label={`Open ${tool.title}: ${tool.desc}`}
                      >
                        <div className="flex items-center gap-4 text-left">
                            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center group-hover:bg-blue-700 group-hover:text-white transition-colors" aria-hidden="true">
                                <tool.icon className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="font-bold text-base dark:text-white leading-tight">{tool.title}</p>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest">{tool.desc}</p>
                            </div>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-300 group-hover:text-blue-700" aria-hidden="true" />
                      </button>
                    ))}
                </div>
            )}
        </main>
        <style>{`
          .animate-fade-in { animation: fade-in 0.4s ease-out forwards; } 
          @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
          @keyframes hub-pulse {
            0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
            70% { box-shadow: 0 0 0 20px rgba(37, 99, 235, 0); }
            100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
          }
          .animate-hub-pulse {
            animation: hub-pulse 2.5s infinite;
          }
          /* Visible focus for all elements */
          :focus-visible {
            outline: 3px solid #1d4ed8 !important;
            outline-offset: 2px !important;
          }
        `}</style>
      </div>
    </>
  );
};

export default AIHub;
