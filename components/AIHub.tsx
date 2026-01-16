import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  PaperAirplaneIcon, 
  XMarkIcon, 
  MicrophoneIcon, 
  SpeakerWaveIcon, 
  ArrowPathIcon, 
  TrashIcon,
  SparkleIcon,
  CameraIcon,
  ChevronRightIcon,
  HomeIcon,
  ShieldCheckIcon,
  CalendarDaysIcon
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
type AgentStatus = 'idle' | 'connecting' | 'listening' | 'processing' | 'speaking';
type Transcription = { speaker: 'user' | 'model'; text: string };

interface AIHubProps {
  onOpenEstimate: () => void;
  onOpenDamageAssessor: () => void;
}

interface AppointmentDetails {
  name: string;
  address: string;
  time: string;
  email: string;
  phone: string;
}

const INITIAL_MESSAGE_CONTENT = "Hello! I'm Hannah from Elite Roofing. May I ask whom I'm speaking with today?";

const AIHub: React.FC<AIHubProps> = ({ onOpenEstimate, onOpenDamageAssessor }) => {
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
  
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const voiceScrollRef = useRef<HTMLDivElement>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const chatSessionIdRef = useRef<number>(0);

  const scrollToBottom = useCallback((ref: React.RefObject<HTMLDivElement | null>, behavior: ScrollBehavior = 'smooth') => {
    if (ref.current) {
        requestAnimationFrame(() => {
            if (ref.current) ref.current.scrollTo({ top: ref.current.scrollHeight, behavior });
        });
    }
  }, []);

  useEffect(() => {
    if (messages.length === 0 && !isLoading) {
        setMessages([{ role: 'model', content: INITIAL_MESSAGE_CONTENT }]);
    }
  }, [messages.length, isLoading]);

  useEffect(() => {
    if (isOpen) scrollToBottom(activeTab === 'chat' ? chatScrollRef : voiceScrollRef);
  }, [messages, voiceTranscription, currentVoiceInput, currentVoiceOutput, activeTab, isOpen, scrollToBottom]);

  useEffect(() => {
    if (messages.length > 0) localStorage.setItem('eliteRoofingChatHistory', JSON.stringify(messages));
  }, [messages]);

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
    if (window.confirm("This will permanently clear your conversation. Continue?")) {
      chatSessionIdRef.current += 1;
      localStorage.removeItem('eliteRoofingChatHistory');
      setMessages([]);
      setIsLoading(false);
      setUserInput('');
      setChatKey(prev => prev + 1);
      resetChatSession();
      setVoiceTranscription([]);
    }
  };

  const startVoiceSession = async () => {
    try {
        setVoiceStatus('connecting');
        setVoiceActive(true);
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
                        setVoiceTranscription(prev => [...prev, { speaker: 'user', text: currentVoiceInput }, { speaker: 'model', text: currentVoiceOutput }].filter(t => t.text));
                        setCurrentVoiceInput(''); setCurrentVoiceOutput(''); setVoiceStatus('listening');
                    }
                },
                onerror: () => endVoiceSession(),
                onclose: () => endVoiceSession(),
            },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                systemInstruction: `You are Hannah, Elite's AI Receptionist. Be brief and professional. Always collect address parts one by one.`,
                inputAudioTranscription: {},
                outputAudioTranscription: {},
            },
        });
        await micStreamPromise;
    } catch (error) { endVoiceSession(); }
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
                if (next[placeholderIndex]) next[placeholderIndex].content = "I encountered an error. Please try again or reconfigure your API key.";
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
        <button onClick={() => setIsOpen(!isOpen)} className={`group relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 ${isOpen ? 'bg-gray-800 rotate-90' : 'bg-blue-600'}`}>
          {isOpen ? <XMarkIcon className="w-8 h-8 text-white" /> : <SparkleIcon className="w-8 h-8 text-white" />}
        </button>
      </div>

      <div className={`fixed bottom-24 right-6 z-50 w-[380px] md:w-[420px] max-w-[90vw] h-[640px] max-h-[85vh] bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden transition-all duration-500 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'}`}>
        <header className="p-6 pb-2">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><HomeIcon className="w-6 h-6 text-white" /></div>
                    <div>
                        <h3 className="font-bold text-base dark:text-white leading-tight">Elite Hub</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Hannah AI Assistant</p>
                    </div>
                </div>
                <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    {(['chat', 'voice', 'tools'] as HubTab[]).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeTab === tab ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>{tab.toUpperCase()}</button>
                    ))}
                </div>
            </div>
            {activeTab === 'chat' && messages.length > 1 && (
                <button onClick={clearChat} className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest">
                    <TrashIcon className="w-3 h-3" /> Clear History
                </button>
            )}
        </header>

        <main className="flex-1 overflow-hidden relative flex flex-col">
            {activeTab === 'chat' && (
                <div className="flex-1 flex flex-col animate-fade-in overflow-hidden" key={chatKey}>
                    <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 pt-0 space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-tl-none'}`}>
                                    <p className="whitespace-pre-wrap">{msg.content || (isLoading && i === messages.length - 1 ? 'Hannah is typing...' : '')}</p>
                                </div>
                                {msg.appointmentSummary && (
                                    <div className="w-full max-w-[90%] bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-2xl shadow-sm">
                                        <div className="flex items-center gap-2 mb-3 text-green-700 dark:text-green-400">
                                            <ShieldCheckIcon className="w-5 h-5" />
                                            <span className="font-bold text-xs">Confirmed Inspection</span>
                                        </div>
                                        <div className="space-y-1 text-[11px] text-gray-600 dark:text-gray-300">
                                            <p><span className="font-bold text-gray-400 mr-2">Client:</span> {msg.appointmentSummary.name}</p>
                                            <p><span className="font-bold text-gray-400 mr-2">Address:</span> {msg.appointmentSummary.address}</p>
                                            <p><span className="font-bold text-gray-400 mr-2">Window:</span> {msg.appointmentSummary.time}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-950/30 border-t dark:border-gray-800 flex items-center gap-2">
                        <input value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChatSend()} placeholder="Type a message..." disabled={isLoading} className="flex-1 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" />
                        <button onClick={handleChatSend} disabled={isLoading || !userInput.trim()} className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg disabled:opacity-50"><PaperAirplaneIcon className="w-5 h-5" /></button>
                    </div>
                </div>
            )}

            {activeTab === 'voice' && (
                <div className="flex-1 flex flex-col p-6 pt-0 animate-fade-in">
                    {!voiceActive ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                            <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center border border-blue-100 dark:border-blue-800 shadow-xl"><MicrophoneIcon className="w-10 h-10 text-blue-600" /></div>
                            <h4 className="font-bold text-xl dark:text-white">AI Receptionist</h4>
                            <p className="text-sm text-gray-500 max-w-[240px]">Hannah can help you book an inspection by voice.</p>
                            <button onClick={startVoiceSession} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl hover:bg-blue-700 transition-all">Start Call</button>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col">
                            <div ref={voiceScrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4">
                                {voiceTranscription.map((t, i) => (<div key={i} className={`flex flex-col ${t.speaker === 'user' ? 'items-end' : 'items-start'}`}><div className={`max-w-[90%] p-3 rounded-xl text-xs ${t.speaker === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 dark:text-white'}`}>{t.text}</div></div>))}
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl text-center border dark:border-gray-700">
                                <div className="flex justify-center gap-1 mb-4 h-6 items-center">
                                    {[1,2,3,4,5].map(i => (<div key={i} className={`w-1 bg-blue-500 rounded-full transition-all duration-300 ${voiceStatus === 'speaking' ? 'h-full animate-bounce' : 'h-1'}`} style={{ animationDelay: `${i*0.1}s` }}></div>))}
                                </div>
                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4">{voiceStatus}</p>
                                <button onClick={endVoiceSession} className="bg-red-500 text-white px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest">End Call</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'tools' && (
                <div className="flex-1 p-6 pt-0 space-y-3 animate-fade-in overflow-y-auto">
                    <button onClick={() => { onOpenEstimate(); setIsOpen(false); }} className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl border dark:border-gray-700 flex items-center justify-between hover:border-blue-500 transition-all shadow-sm"><div className="flex items-center gap-3"><SparkleIcon className="w-5 h-5 text-blue-600" /><div className="text-left"><p className="font-bold text-sm dark:text-white">AI Project Estimate</p><p className="text-[10px] text-gray-500">Live price comparison</p></div></div><ChevronRightIcon className="w-4 h-4 text-gray-300" /></button>
                    <button onClick={() => { onOpenDamageAssessor(); setIsOpen(false); }} className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl border dark:border-gray-700 flex items-center justify-between hover:border-blue-500 transition-all shadow-sm"><div className="flex items-center gap-3"><CameraIcon className="w-5 h-5 text-orange-600" /><div className="text-left"><p className="font-bold text-sm dark:text-white">AI Damage Check</p><p className="text-[10px] text-gray-500">Upload and scan photos</p></div></div><ChevronRightIcon className="w-4 h-4 text-gray-300" /></button>
                </div>
            )}
        </main>
        <style>{`.animate-fade-in { animation: fade-in 0.3s ease-out forwards; } @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }`}</style>
      </div>
    </>
  );
};

export default AIHub;
