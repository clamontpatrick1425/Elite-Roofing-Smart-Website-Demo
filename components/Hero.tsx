import React, { useState, useRef, useEffect } from 'react';
import VoiceAgentOrb, { VoiceAgentHandle } from './VoiceAgentOrb';
import { generateHeroVideo } from '../services/geminiService';
import { VideoCameraIcon, SparkleIcon, XMarkIcon, ArrowPathIcon } from './Icon';

interface HeroProps {
    onScheduleClick: () => void;
    onEstimateClick: () => void;
    voiceAgentRef: React.Ref<VoiceAgentHandle>;
}

const Hero: React.FC<HeroProps> = ({ onScheduleClick, onEstimateClick, voiceAgentRef }) => {
  const [heroImageUrl] = useState('https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'quota' | 'auth' | 'general' | 'transient' | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoUrl && videoRef.current) {
        setIsVideoReady(false);
        const v = videoRef.current;
        v.load();
        
        const checkReady = () => {
            if (v.readyState >= 3) setIsVideoReady(true);
        };

        v.addEventListener('canplay', checkReady);
        const playPromise = v.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn("Autoplay prevented:", error);
            });
        }
        return () => v.removeEventListener('canplay', checkReady);
    }
  }, [videoUrl]);

  const handleModalClick = (e: React.MouseEvent<HTMLAnchorElement>, handler: () => void) => {
    e.preventDefault();
    handler();
  };

  const handleSwitchKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
        await aistudio.openSelectKey();
        setGenerationError(null);
        setErrorType(null);
    }
  };

  const handleGenerateVideo = async () => {
    if (isGeneratingVideo) return;
    
    const aistudio = (window as any).aistudio;
    if (aistudio && !(await aistudio.hasSelectedApiKey())) {
        await aistudio.openSelectKey();
    }

    setGenerationError(null);
    setIsGeneratingVideo(true);
    setErrorType(null);

    try {
      const prompt = "A cinematic wide shot of a beautiful modern home with a perfect new grey shingle roof. Sunny day, bright blue sky, high-end photography style, smooth cinematic camera drift.";
      const url = await generateHeroVideo(prompt);
      setVideoUrl(url);
    } catch (error: any) {
      const msg = error.message;
      if (msg === "QUOTA_EXHAUSTED") {
          setErrorType('quota');
          setGenerationError("Daily limit reached. AI Video generation requires a paid Google Cloud project.");
      } else if (msg === "INVALID_KEY_OR_PROJECT") {
          setErrorType('auth');
          setGenerationError("API Key Issue: Your selected key must belong to a PAID Google Cloud project with billing enabled.");
      } else if (msg === "TRANSIENT_ERROR") {
          setErrorType('transient');
          setGenerationError("Service is temporarily busy. Please try generating the background again in a minute.");
      } else {
          setErrorType('general');
          setGenerationError(msg || "An unexpected error occurred.");
      }
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <section className="relative bg-gray-900 text-white py-20 sm:py-24 md:py-32 min-h-[550px] sm:min-h-[600px] flex items-center overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
          <div
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{ backgroundImage: `url('${heroImageUrl}')` }}
          ></div>

          {videoUrl && (
             <video 
                ref={videoRef}
                key={videoUrl}
                autoPlay 
                loop 
                muted 
                playsInline 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-10 ${isVideoReady ? 'opacity-100' : 'opacity-0'}`}
                src={videoUrl}
             />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/90 z-20"></div>
      </div>
      
      {/* Content Layer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
        <div className="max-w-4xl text-center mx-auto flex flex-col items-center">
          
          {/* Emergency Service Tab */}
          <div className="mb-14">
            <a
              href="tel:1-800-555-ROOF"
              className="inline-flex items-center gap-3 bg-red-600/30 backdrop-blur-md border border-red-500/40 px-8 sm:px-10 py-3 rounded-full text-red-100 font-bold hover:bg-red-600/40 transition-all group shadow-2xl"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              24/7 Emergency Service: (800) 555-ROOF
            </a>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight drop-shadow-lg">
            Protecting Your Home <br className="hidden md:block" /> with AI Precision.
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
            Seamless roof inspections, instant AI estimates, and 24/7 support. Experience the future of home protection with Elite Roofing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
            <a
              href="#estimate"
              onClick={(e) => handleModalClick(e, onEstimateClick)}
              className="w-full sm:w-auto bg-blue-600 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-blue-600/50 transition-all duration-300 transform hover:-translate-y-1 text-lg min-w-[220px]"
            >
              Get Free Estimate
            </a>
            
            <div className="hidden md:block">
                 <VoiceAgentOrb ref={voiceAgentRef} />
            </div>

            <a
              href="#schedule"
              onClick={(e) => handleModalClick(e, onScheduleClick)}
              className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold py-3.5 px-10 rounded-full shadow-lg hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:-translate-y-1 text-lg min-w-[220px]"
            >
              Book Inspection
            </a>
          </div>
           
           <div className="mt-8 md:hidden">
                 <VoiceAgentOrb ref={voiceAgentRef} />
            </div>
        </div>
        
        {/* AI Video Control UI */}
        <div className="absolute bottom-10 right-4 sm:right-10 z-40 flex flex-col items-end gap-3 max-w-sm">
            {generationError && (
                <div className="bg-red-900/95 backdrop-blur-2xl border border-red-500/30 text-white p-5 rounded-2xl shadow-2xl animate-fade-in flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <p className="text-sm font-bold text-red-200 mb-1">
                                {errorType === 'auth' ? 'API Billing Required' : 'AI Render Failed'}
                            </p>
                            <p className="text-xs leading-relaxed opacity-90">{generationError}</p>
                        </div>
                        <button onClick={() => setGenerationError(null)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                    {(errorType === 'auth' || errorType === 'quota') && (
                        <button 
                            onClick={handleSwitchKey} 
                            className="w-full flex items-center justify-center gap-2 bg-white text-red-900 text-[11px] font-bold py-2.5 rounded-xl hover:bg-gray-100 transition-all"
                        >
                            <ArrowPathIcon className="w-4 h-4" />
                            RECONFIGURE API KEY
                        </button>
                    )}
                </div>
            )}
            <button
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo}
                className={`flex items-center gap-3 bg-black/60 backdrop-blur-xl border border-white/20 text-white text-xs font-bold py-3.5 px-6 rounded-full hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-2xl ${isGeneratingVideo ? 'ring-2 ring-blue-500' : ''}`}
            >
                {isGeneratingVideo ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Hannah is rendering...
                    </>
                ) : (
                    <>
                         <VideoCameraIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                         {videoUrl ? "Refresh AI Background" : "Generate AI Background"}
                    </>
                )}
            </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Hero;
