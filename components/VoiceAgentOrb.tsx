import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useAudioProcessor } from '../hooks/useAudioProcessor';
import { createBlob } from '../services/geminiService';

export interface VoiceAgentHandle {
  toggle: () => void;
  stop: () => void;
}

interface VoiceAgentOrbProps {
  className?: string;
}

const VoiceAgentOrb = forwardRef<VoiceAgentHandle, VoiceAgentOrbProps>(({ className = "" }, ref) => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  
  const wsRef = useRef<WebSocket | null>(null);
  const statusRef = useRef(status);

  // Sync ref to avoid stale closures
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const onAudioDataReceived = (data: Float32Array) => {
    // Only send audio if we are in listening state and socket is open
    if (statusRef.current === 'listening' && wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        const blob = createBlob(data);
        wsRef.current.send(JSON.stringify({ audio: blob.data }));
      } catch (err) {
        console.error("Error creating audio blob:", err);
      }
    }
  };

  const { isProcessing, startProcessing, stopProcessing, playAudio, interruptPlayback } = useAudioProcessor(onAudioDataReceived);

  // Close everything on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    try {
      stopProcessing();
    } catch (e) {}

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (e) {}
      wsRef.current = null;
    }
  };

  const startSession = async () => {
    cleanup();
    setStatus('connecting');
    setErrorMessage(null);
    setTranscript('');

    try {
      // 1. Start audio recording and playback pipeline
      await startProcessing();

      // 2. Build WebSocket url dynamically targeting our single Express host
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live-voice`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connection opened to live voice API");
        // Status updates to 'listening' once the backend sends 'connected' notification
      };

      ws.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.error) {
            console.error("Server voice error:", msg.error);
            setErrorMessage(msg.error);
            setStatus('error');
            cleanup();
            return;
          }

          if (msg.connected) {
            setStatus('listening');
          }

          if (msg.audio) {
            setStatus('speaking');
            await playAudio(msg.audio);
            // Revert back to listening once audio finishes playing or client remains active
            setTimeout(() => {
              if (statusRef.current === 'speaking') {
                setStatus('listening');
              }
            }, 800);
          }

          if (msg.interrupted) {
            setStatus('listening');
            interruptPlayback();
          }

          if (msg.transcript) {
            setTranscript(msg.transcript);
          }
        } catch (err) {
          console.error("Error parsing voice socket message:", err);
        }
      };

      ws.onclose = (event) => {
        console.log("WebSocket connection closed", event);
        setStatus('idle');
        cleanup();
      };

      ws.onerror = (err) => {
        console.error("WebSocket connection error:", err);
        setErrorMessage("Network connection error. Try again.");
        setStatus('error');
        cleanup();
      };

    } catch (err: any) {
      console.error("Failed to start voice agent session:", err);
      setErrorMessage(err.message || "Could not access microphone.");
      setStatus('error');
      cleanup();
    }
  };

  const endSession = () => {
    cleanup();
    setStatus('idle');
  };

  const toggleSession = () => {
    if (status === 'idle' || status === 'error') {
      startSession();
    } else {
      endSession();
    }
  };

  // Expose handles to parenting refs if requested
  useImperativeHandle(ref, () => ({
    toggle: () => toggleSession(),
    stop: () => endSession()
  }));

  // Style attributes based on current state
  const getOrbStyles = () => {
    switch (status) {
      case 'connecting':
        return 'bg-gradient-to-tr from-amber-400 to-yellow-500 shadow-amber-500/50 animate-pulse border-2 border-amber-300';
      case 'listening':
        return 'bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-emerald-500/50 scale-105 border-2 border-emerald-300';
      case 'speaking':
        return 'bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-blue-500/50 scale-110 border-2 border-blue-300';
      case 'error':
        return 'bg-gradient-to-tr from-red-600 to-rose-700 shadow-red-500/50 border-2 border-red-300';
      case 'idle':
      default:
        return 'bg-gradient-to-tr from-gray-700 via-gray-800 to-gray-900 hover:from-blue-600 hover:to-indigo-600 text-white shadow-black/80 hover:shadow-blue-500/30 hover:scale-105';
    }
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* Wave Ring visual effects */}
      <div className="relative flex items-center justify-center p-3">
        {/* Animated outer ripples */}
        {(status === 'listening' || status === 'speaking') && (
          <>
            <div className={`absolute inset-0 rounded-full opacity-25 animate-ping duration-1000 ${status === 'speaking' ? 'bg-blue-400' : 'bg-emerald-400'}`}></div>
            <div className={`absolute -inset-2 rounded-full opacity-10 animate-pulse duration-1500 ${status === 'speaking' ? 'bg-blue-300' : 'bg-emerald-300'}`}></div>
          </>
        )}

        <button
          onClick={toggleSession}
          className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all duration-300 ease-out select-none active:scale-95 ${getOrbStyles()}`}
          title={status === 'idle' ? "Start conversation with Hannah" : "End voice session"}
        >
          {status === 'connecting' ? (
            <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : status === 'error' ? (
            <span className="text-3xl text-white font-bold leading-none select-none">!</span>
          ) : (
            <svg
              className={`w-8 h-8 sm:w-10 sm:h-10 text-white transition-transform ${status === 'listening' || status === 'speaking' ? 'scale-110' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {status === 'idle' || status === 'error' ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
            </svg>
          )}
        </button>
      </div>

      {/* State context labels & errors */}
      <div className="text-center max-w-[200px]">
        <p className="text-xs font-semibold tracking-wider uppercase text-gray-300">
          {status === 'idle' && "Talk to Hannah"}
          {status === 'connecting' && "Connecting..."}
          {status === 'listening' && "Listening..."}
          {status === 'speaking' && "Hannah is Speaking"}
          {status === 'error' && "Connection Error"}
        </p>
        
        {errorMessage ? (
          <p className="text-[10px] text-red-400 mt-1 line-clamp-2 leading-relaxed">{errorMessage}</p>
        ) : (
          <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">
            {status === 'idle' && "Click to start real-time voice call"}
            {status === 'listening' && "Speak clearly into your mic"}
            {status === 'speaking' && "Hannah is responding..."}
            {status === 'connecting' && "Initializing audio socket..."}
          </p>
        )}
      </div>
    </div>
  );
});

VoiceAgentOrb.displayName = "VoiceAgentOrb";

export default VoiceAgentOrb;
