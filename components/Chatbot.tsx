import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UserCircleIcon, PaperAirplaneIcon, XMarkIcon, MicrophoneIcon } from './Icon';
import { sendMessageToChatbot } from '../services/geminiService';
import { ChatMessage } from '../types';

// FIX: Add type definitions for the Web Speech API to resolve errors with SpeechRecognition.
// This is necessary because these types are not included in all TypeScript DOM library versions.
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

// Extend window type for webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
  }
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Hello! I'm the Elite Roofing AI assistant. How can I help you today? You can ask me about our services, get an estimate, or schedule an inspection." }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [micPermissionStatus, setMicPermissionStatus] = useState<PermissionState>('prompt');
  
  const chatboxRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Refs for voice visualization
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const mediaStreamForVisRef = useRef<MediaStream | null>(null);

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
  }, [messages]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToChatbot(userInput);
      setMessages([...newMessages, { role: 'model', content: response }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'model', content: "I'm sorry, something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
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
                alert("Could not access the microphone because permission was denied. Please check your browser settings.");
            } else {
                alert("Could not access the microphone. Please check your browser permissions.");
            }
        }
    }
  };
  
  const renderMessageContent = (content: string) => {
    if (content.includes('[ESTIMATE_LINK]')) {
        const parts = content.split('[ESTIMATE_LINK]');
        return (
            <>
                {parts[0]}
                <button
                    onClick={() => {
                        document.getElementById('estimate')?.scrollIntoView({ behavior: 'smooth' });
                        setIsOpen(false);
                    }}
                    className="mt-2 w-full text-left bg-blue-100 text-blue-800 font-bold py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors"
                >
                    Go to AI Estimate Calculator
                </button>
                {parts[1]}
            </>
        );
    }
    return content;
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110"
        >
          {isOpen ? <XMarkIcon className="w-8 h-8"/> : <UserCircleIcon className="w-8 h-8"/>}
        </button>
      </div>

      <div
        className={`fixed bottom-24 right-5 z-50 w-full max-w-sm h-[70vh] max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <header className="bg-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
          <h3 className="font-bold text-lg">Claire</h3>
          <button onClick={() => setIsOpen(false)} className="text-white hover:opacity-80">
            <XMarkIcon className="w-6 h-6"/>
          </button>
        </header>
        
        <div ref={chatboxRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">AI</div>}
              <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                {renderMessageContent(msg.content)}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">AI</div>
              <div className="max-w-[80%] p-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-4 bg-white rounded-b-2xl">
           {isRecording && (
                <div className="h-12 w-full mb-2 bg-gray-100 rounded-lg overflow-hidden">
                    <canvas ref={canvasRef} className="w-full h-full"></canvas>
                </div>
            )}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isRecording && handleSend()}
              placeholder={isRecording ? "Listening..." : "Ask a question..."}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={toggleRecording}
              disabled={isLoading || micPermissionStatus === 'denied'}
              className={`p-3 rounded-lg transition-colors duration-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed ${
                isRecording 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
              title={micPermissionStatus === 'denied' ? 'Microphone access is blocked. Check your browser settings.' : (isRecording ? 'Stop recording' : 'Start voice input')}
            >
                <MicrophoneIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleSend}
              disabled={isLoading || !userInput.trim()}
              className="bg-blue-600 text-white p-3 rounded-lg disabled:bg-gray-400"
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