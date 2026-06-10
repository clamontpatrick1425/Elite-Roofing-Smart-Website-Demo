
import React, { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { 
  PaperAirplaneIcon, 
  XMarkIcon, 
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
  resetChatSession
} from '../services/geminiService';
import { ChatMessage } from '../types';
import VoiceAgentOrb from './VoiceAgentOrb';

export type AIHubHandle = {
  openHub: (tab?: 'chat' | 'voice' | 'tools') => void;
};

type HubTab = 'chat' | 'voice' | 'tools';

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

const AIHub = forwardRef<AIHubHandle, AIHubProps>(({ onOpenEstimate, onOpenDamageAssessor, onOpenVisualizer, onOpenDesignStudio }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<HubTab>('chat');
  const [chatKey, setChatKey] = useState(0); 
  const [messages, setMessages] = useState<(ChatMessage & { appointmentSummary?: AppointmentDetails; showSwitchKeyButton?: boolean })[]>(() => {
    try {
      const saved = localStorage.getItem('eliteRoofingChatHistory');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const chatSessionIdRef = useRef<number>(0);
  const hubRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    openHub: (tab = 'chat') => {
      setIsOpen(true);
      setActiveTab(tab);
    }
  }));

  const scrollToBottom = useCallback((scrollRef: React.RefObject<HTMLDivElement | null>, behavior: ScrollBehavior = 'smooth') => {
    if (scrollRef.current) {
        requestAnimationFrame(() => {
            if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior });
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
    if (isOpen) scrollToBottom(chatScrollRef);
  }, [messages, isOpen, scrollToBottom]);

  const clearChat = () => {
    if (window.confirm("Erase conversation history?")) {
      chatSessionIdRef.current += 1;
      localStorage.removeItem('eliteRoofingChatHistory');
      setMessages([{ role: 'model', content: INITIAL_MESSAGE_CONTENT }]);
      setIsLoading(false);
      setUserInput('');
      setChatKey(prev => prev + 1);
      resetChatSession();
    }
  };

  const handleChatSend = async () => {
    if (!userInput.trim() || isLoading) return;
    
    const aistudio = (window as any).aistudio;
    if (aistudio && !(await aistudio.hasSelectedApiKey())) {
        await aistudio.openSelectKey();
        return;
    }
    
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
                if (next[placeholderIndex]) {
                    const errorMsg = String(e.message || e);
                    if (errorMsg.includes("QUOTA_EXHAUSTED") || errorMsg.includes("429") || errorMsg.includes("depleted") || errorMsg.includes("quota")) {
                        next[placeholderIndex].content = "⚠️ Your API key's prepayment credits are depleted or quota limit has been exceeded.\n\nPlease top up your project credits on Google AI Studio, or click the button below to choose/switch to a different API key.";
                        next[placeholderIndex].showSwitchKeyButton = true;
                    } else if (errorMsg.includes("INVALID_KEY_OR_PROJECT") || errorMsg.includes("403") || errorMsg.includes("API_KEY_INVALID")) {
                        next[placeholderIndex].content = "⚠️ The selected API key appears invalid or expired.\n\nPlease switch to a valid API key using the button below.";
                        next[placeholderIndex].showSwitchKeyButton = true;
                    } else {
                        next[placeholderIndex].content = "I encountered an error. Please try again.\n\nDetail: " + errorMsg;
                    }
                }
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
                        className={`flex-1 py-2.5 rounded-lg text-[11px] font-black transition-all focus-visible:ring-2 focus-visible:ring-blue-600 ${activeTab === tab ? 'bg-white dark:bg-gray-700 text-blue-800 dark:text-blue-300 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                    >
                        {tab === 'chat' ? 'CHAT SCRIPT' : tab === 'voice' ? 'VOICE CALL' : 'INTERACTIVE TOOLS'}
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
                                        {msg.showSwitchKeyButton && (
                                            <div className="mt-3">
                                                <button 
                                                    onClick={async () => {
                                                        const aistudio = (window as any).aistudio;
                                                        if (aistudio) {
                                                            await aistudio.openSelectKey();
                                                        }
                                                    }}
                                                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-md transition-all duration-200"
                                                >
                                                    <SparkleIcon className="w-3.5 h-3.5 animate-pulse" />
                                                    Switch API Key
                                                </button>
                                            </div>
                                        )}
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
                <div id="hub-panel-voice" role="tabpanel" aria-labelledby="tab-voice" className="flex-1 flex flex-col justify-center items-center p-6 space-y-6 animate-fade-in text-center">
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-[2rem] border border-blue-100/60 dark:border-blue-900/20 w-full max-w-[340px] flex flex-col items-center shadow-inner">
                        <VoiceAgentOrb className="my-4" />
                        
                        <div className="mt-4 border-t border-gray-100 dark:border-gray-800/60 pt-4 text-xs text-gray-500 dark:text-gray-400 space-y-2 max-w-[260px]">
                            <p className="font-semibold text-gray-700 dark:text-gray-300">Hands-Free Roofing Assistant</p>
                            <p>Speak with Hannah about roof designs, local climate estimations, storm damage, or booking your premium home consultation.</p>
                        </div>
                    </div>
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
});

export default AIHub;
