
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UserCircleIcon, PaperAirplaneIcon, XMarkIcon, MicrophoneIcon, TrashIcon, PaperClipIcon } from './Icon';
import { sendMessageToChatbot } from '../services/geminiService';
import { ChatMessage } from '../types';

// Type definitions for the Web Speech API to resolve errors.
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  readonly [index: number]: SpeechRecognitionAlternative;
  readonly isFinal: boolean;
  readonly length: number;
}

interface SpeechRecognitionResultList {
  readonly [index: number]: SpeechRecognitionResult;
  readonly length: number;
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start(): void;
  stop(): void;
}

declare var SpeechRecognition: {
  new (): SpeechRecognition;
};

declare var webkitSpeechRecognition: {
  new (): SpeechRecognition;
};

// Extend window type for cross-browser compatibility
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
  }
}

// New component for rendering formatted chat messages from the AI model.
// It handles markdown-like syntax for lists, bold text, and links.
const ChatMessageContent: React.FC<{ content: string; onEstimateClick: () => void }> = ({ content, onEstimateClick }) => {
    // Split content by the special estimate link tag, keeping the tag itself in the array.
    const parts = content.split(/(\[ESTIMATE_LINK\])/g).filter(Boolean);

    return (
        <>
            {parts.map((part, index) => {
                if (part === '[ESTIMATE_LINK]') {
                    // If the part is the special tag, render a button.
                    return (
                        <button
                            key={index}
                            onClick={onEstimateClick}
                            className="mt-2 block w-full text-left bg-blue-100 text-blue-800 font-bold py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900"
                        >
                            Go to AI Estimate Calculator
                        </button>
                    );
                }

                // Process text parts for markdown (lists, bold, links).
                const elements: React.ReactNode[] = [];
                let listItems: string[] = [];
                const lines = part.split('\n');

                // Helper function to render a list and clear the temporary list item array.
                const flushList = (keyPrefix: string | number) => {
                    if (listItems.length > 0) {
                        elements.push(
                            <ul key={`ul-${keyPrefix}`} className="list-disc list-inside space-y-1 my-2">
                                {listItems.map((item, i) => {
                                    // Format list item: remove bullet and format bold text/links.
                                    let formattedItem = item.replace(/^[\*\-]\s*/, '');
                                    formattedItem = formattedItem.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                                    // Markdown links [text](url)
                                    formattedItem = formattedItem.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>');
                                    return <li key={i} dangerouslySetInnerHTML={{ __html: formattedItem }} />;
                                })}
                            </ul>
                        );
                        listItems = [];
                    }
                };

                lines.forEach((line, lineIndex) => {
                    const key = `${index}-${lineIndex}`;
                    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                        // If it's a list item, add it to the current list buffer.
                        listItems.push(line);
                    } else {
                        // If not a list item, first render any existing list.
                        flushList(key);
                        // Then render the current line as a paragraph if it's not empty.
                        if (line.trim() !== '') {
                            let formattedLine = line;
                            // Bold
                            formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                            // Markdown links [text](url)
                            formattedLine = formattedLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>');
                            // Raw URLs that start with http/https and are not part of a markdown link
                            // This is a simple regex and might need refinement for complex cases
                            formattedLine = formattedLine.replace(/(?<!\]\()(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>');

                            elements.push(<p key={`p-${key}`} className="my-1" dangerouslySetInnerHTML={{ __html: formattedLine }} />);
                        }
                    }
                });

                // Flush any remaining list items at the end of the part.
                flushList(`final-${index}`);

                return <div key={index}>{elements}</div>;
            })}
        </>
    );
};

interface ChatbotProps {
    onOpenEstimate?: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onOpenEstimate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('eliteRoofingChatHistory');
      const initialValue = saved ? JSON.parse(saved) : null;
      if (Array.isArray(initialValue) && initialValue.length > 0) {
        return initialValue.slice(-20);
      }
    } catch (e) {
      console.error('Could not load messages from local storage', e);
    }
    return [{ role: 'model', content: "Hello! Welcome to Elite Roofing Solutions. I'm Claire, your AI Concierge. To get started, may I ask who I am speaking with and how can I help you today?", suggestedQuestions: ["What services do you offer?", "Can I get a free estimate?", "Do you handle storm damage?"] }];
  });
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [micPermissionStatus, setMicPermissionStatus] = useState<PermissionState>('prompt');
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  
  // Image Upload State
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const chatboxRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Refs for voice visualization
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const mediaStreamForVisRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    try {
      const recentMessages = messages.slice(-20);
      localStorage.setItem('eliteRoofingChatHistory', JSON.stringify(recentMessages));
    } catch (e) {
      console.error('Could not save messages to local storage', e);
    }
  }, [messages]);

  const stopVisualization = useCallback(() => {
    if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
    }
    const canvas = canvasRef.current;
    if (canvas) {
        const canvasCtx = canvas.getContext('2d');
        canvasCtx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    sourceRef.current?.disconnect();
    analyserRef.current?.disconnect();
    if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
    }
    mediaStreamForVisRef.current?.getTracks().forEach(track => track.stop());
    mediaStreamForVisRef.current = null;
  }, []);

  const drawVisualization = useCallback(() => {
    if (!analyserRef.current || !canvasRef.current) return;
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const draw = () => {
        if (!analyserRef.current) return; // Stop if analyser is cleaned up
        animationFrameIdRef.current = requestAnimationFrame(draw);
        
        analyser.getByteFrequencyData(dataArray);
        
        canvasCtx.fillStyle = 'rgb(243 244 246)'; // bg-gray-100
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = (canvas.width / bufferLength) * 2;
        let barHeight;
        let x = 0;
        
        for(let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2.5;
            
            canvasCtx.fillStyle = `rgb(59 130 246)`; // bg-blue-600
            canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
        }
    };
    draw();
  }, []);

  const startVisualization = useCallback((stream: MediaStream) => {
    mediaStreamForVisRef.current = stream;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = audioContext;
    analyserRef.current = audioContext.createAnalyser();
    sourceRef.current = audioContext.createMediaStreamSource(stream);
    sourceRef.current.connect(analyserRef.current);
    drawVisualization();
  }, [drawVisualization]);

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

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
        console.warn('Speech Recognition is not supported by this browser.');
        return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(prev => prev ? `${prev} ${transcript}` : transcript);
    };

    recognition.onend = () => {
        setIsRecording(false);
        stopVisualization();
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
            setMicPermissionStatus('denied');
            alert("Microphone access was denied. Please allow microphone access in your browser settings to use voice input.");
        }
        setIsRecording(false);
        stopVisualization();
    };

    recognitionRef.current = recognition;
  }, [stopVisualization]);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages, imagePreview]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }
        
        setSelectedImage(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async (messageToSend?: string) => {
    const currentMessage = messageToSend || userInput;
    const currentImage = selectedImage;

    // Must have at least text or an image
    if (!currentMessage.trim() && !currentImage) return;

    const newMessages: ChatMessage[] = [
        ...messages, 
        { 
            role: 'user', 
            content: currentMessage,
            userImage: imagePreview || undefined
        }
    ];
    
    setMessages(newMessages);
    setUserInput('');
    // Clear image state
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    setIsLoading(true);

    try {
      const response = await sendMessageToChatbot(currentMessage, currentImage || undefined);
      setMessages(prev => [...prev, { role: 'model', content: response.reply, suggestedQuestions: response.suggestedQuestions }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "I'm sorry, something went wrong. Please try again.", suggestedQuestions: [] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestionClick = (question: string) => {
    handleSend(question);
  };

  const toggleRecording = async () => {
    if (micPermissionStatus === 'denied') {
        alert("Microphone access is blocked. To use voice input, please enable microphone permissions for this site in your browser settings.");
        return;
    }
    
    if (!recognitionRef.current) {
        alert("Voice input is not supported on your browser.");
        return;
    }

    if (isRecording) {
        recognitionRef.current.stop();
    } else {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            startVisualization(stream);
            recognitionRef.current.start();
            setIsRecording(true);
        } catch (err) {
            stopVisualization();
            console.error("Error getting microphone access:", err);
            if (err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')) {
                setMicPermissionStatus('denied');
            }
            alert("Could not access the microphone. Please check your browser permissions.");
        }
    }
  };

  const handleClearChat = () => {
    setShowClearConfirmation(true);
  };

  const confirmClearChat = () => {
    setMessages([
      { role: 'model', content: "Hello! Welcome to Elite Roofing Solutions. I'm Claire, your AI Concierge. To get started, may I ask who I am speaking with and how can I help you today?", suggestedQuestions: ["What services do you offer?", "Can I get a free estimate?", "Do you handle storm damage?"] }
    ]);
    setShowClearConfirmation(false);
  };
  
  const handleEstimateClick = () => {
      if (onOpenEstimate) {
          onOpenEstimate();
      } else {
          // Fallback if prop not provided
          document.getElementById('ai-tools')?.scrollIntoView({ behavior: 'smooth' });
      }
      setIsOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          title={isOpen ? "Close chatbot" : "Open AI Chat Assistant"}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110"
        >
          {isOpen ? <XMarkIcon className="w-24 h-24"/> : <UserCircleIcon className="w-24 h-24"/>}
        </button>
      </div>

      <div
        className={`fixed bottom-24 right-5 z-50 w-full max-w-sm h-[70vh] max-h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <header className="bg-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <h3 className="font-bold text-lg">AI Concierge: Claire</h3>
            <div className="flex items-center gap-2">
                <button onClick={handleClearChat} title="Clear chat history" className="text-white hover:opacity-80 p-1 rounded-full">
                    <TrashIcon className="w-5 h-5"/>
                </button>
                <button onClick={() => setIsOpen(false)} title="Close chat" className="text-white hover:opacity-80 p-1 rounded-full">
                    <XMarkIcon className="w-6 h-6"/>
                </button>
            </div>
        </header>
        
        <div ref={chatboxRef} className="relative flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900 scroll-smooth">
          {messages.map((msg, index) => {
            const isLastMessage = index === messages.length - 1;
            return (
                <React.Fragment key={index}>
                    <div className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">AI</div>}
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-bl-none'}`}>
                        {msg.userImage && (
                            <div className="mb-2">
                                <img src={msg.userImage} alt="Uploaded by user" className="rounded-lg max-h-40 w-auto object-cover border border-white/20" />
                            </div>
                        )}
                        {msg.role === 'model' ? (
                        <ChatMessageContent content={msg.content} onEstimateClick={handleEstimateClick} />
                        ) : (
                        msg.content // User messages are not formatted
                        )}
                    </div>
                    </div>
                    {msg.role === 'model' && isLastMessage && !isLoading && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                        <div className="flex flex-col items-end gap-2 mt-3">
                            {msg.suggestedQuestions.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSuggestedQuestionClick(q)}
                                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-2xl text-sm hover:bg-blue-200 transition-colors duration-200 self-end max-w-max dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}
                </React.Fragment>
            );
          })}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">AI</div>
              <div className="max-w-[80%] p-3 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none">
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
           {showClearConfirmation && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-xl p-6 w-full max-w-xs text-center">
                    <h4 className="font-bold text-gray-800 dark:text-gray-100">Clear Conversation</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Are you sure you want to permanently delete this conversation?</p>
                    <div className="mt-6 flex justify-center gap-4">
                        <button onClick={() => setShowClearConfirmation(false)} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                            Cancel
                        </button>
                        <button onClick={confirmClearChat} className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700">
                            Yes, Clear
                        </button>
                    </div>
                </div>
            </div>
          )}
        </div>

        <div className="border-t p-4 bg-white dark:bg-gray-800 dark:border-gray-700 rounded-b-2xl">
           {isRecording && (
                <div className="h-12 w-full mb-2 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <canvas ref={canvasRef} className="w-full h-full"></canvas>
                </div>
            )}
            {imagePreview && (
                <div className="relative mb-2 inline-block">
                    <img src={imagePreview} alt="Selected" className="h-16 w-auto rounded-lg border border-gray-300 shadow-sm" />
                    <button 
                        onClick={removeSelectedImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-sm hover:bg-red-600"
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
          <div className="flex items-center gap-2">
             <label htmlFor="chat-file-upload" className="cursor-pointer p-3 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 transition-colors">
                <PaperClipIcon className="w-5 h-5" />
                <input 
                    id="chat-file-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                />
            </label>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isRecording && handleSend()}
              placeholder={isRecording ? "Listening..." : "Ask or upload photo..."}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={toggleRecording}
              disabled={isLoading || micPermissionStatus === 'denied'}
              className={`p-3 rounded-lg transition-colors duration-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed dark:disabled:bg-gray-600 dark:disabled:text-gray-400 ${
                isRecording 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
              }`}
              aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
              title={micPermissionStatus === 'denied' ? 'Microphone access is blocked. Check your browser settings.' : (isRecording ? 'Stop recording' : 'Start voice input')}
            >
                <MicrophoneIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleSend()}
              disabled={isLoading || (!userInput.trim() && !selectedImage)}
              title="Send message"
              className="bg-blue-600 text-white p-3 rounded-lg disabled:bg-gray-400 dark:disabled:bg-gray-500"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
