
import React, { useState, useRef, useEffect } from 'react';
import VoiceAgentOrb, { VoiceAgentHandle } from './VoiceAgentOrb';
import { ShieldCheckIcon, UserCircleIcon, SparkleIcon, ArrowPathIcon, XMarkIcon } from './Icon';
import { generateHeroVideo } from '../services/geminiService';

interface HeroProps {
    onScheduleClick: () => void;
    onEstimateClick: () => void;
    voiceAgentRef: React.Ref<VoiceAgentHandle>;
}

const Hero: React.FC<HeroProps> = ({ onScheduleClick, onEstimateClick, voiceAgentRef }) => {
  // A high-quality, stable cinematic roofing video source for production
  const PERMANENT_CINEMATIC_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-modern-house-with-dark-shingles-in-the-forest-43180-large.mp4";
  const HERO_IMAGE = 'https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
  
  const CINEMATIC_PROMPT = "Cinematic wide shot of two professional roofers in high-visibility safety gear expertly installing premium slate tiles on a modern luxury mansion. Golden hour lighting with soft sun flares. Smooth drone tracking shot moving slowly across the roofline. 4k resolution, highly detailed textures, professional architectural videography.";

  const [videoUrl, setVideoUrl] = useState(PERMANENT_CINEMATIC_VIDEO);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const attemptAiGeneration = async (bypassKeyCheck = false) => {
    const aistudio = (window as any).aistudio;
    // We only attempt auto-generation if the key is already present/selected or explicitly bypassed
    if (bypassKeyCheck || (aistudio && await aistudio.hasSelectedApiKey())) {
        setIsGenerating(true);
        setGenError(null);
        try {
            const url = await generateHeroVideo(CINEMATIC_PROMPT);
            setVideoUrl(url);
            setIsAiGenerated(true);
            setIsVideoLoaded(false); 
        } catch (e: any) {
            console.warn("Hero AI Generation failed:", e);
            if (e.message === "VIDEO_NOT_SUPPORTED") {
                setGenError("AI Render requires a paid project key.");
            } else if (e.message === "QUOTA_EXHAUSTED") {
                setGenError("Daily quota limit reached.");
            } else {
                setGenError("AI Render failed. Using premium background.");
            }
            // Keep using the permanent video on failure
            setVideoUrl(PERMANENT_CINEMATIC_VIDEO);
        } finally {
            setIsGenerating(false);
        }
    }
  };

  // Removed automatic generation on mount to conserve quota
  // useEffect(() => {
  //   attemptAiGeneration();
  // }, []);

  const handleLoadedData = () => {
    setIsVideoLoaded(true);
    if (videoRef.current) {
        videoRef.current.play().catch(e => console.error("Autoplay failed:", e));
    }
  };

  const handleOpenSelectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
        await aistudio.openSelectKey();
        // Force generation attempt immediately after key selection, bypassing the race-prone check
        attemptAiGeneration(true);
    }
  };

  return (
    <section className="relative bg-gray-900 text-white py-20 sm:py-24 md:py-32 min-h-[700px] sm:min-h-[800px] flex items-center overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Static Background Image Fallback */}
          <div
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
          ></div>

          {/* Background Video - Optimized for background usage */}
          <video 
            key={videoUrl}
            ref={videoRef}
            src={videoUrl}
            autoPlay 
            loop 
            muted 
            playsInline
            onLoadedData={handleLoadedData}
            poster={HERO_IMAGE}
            className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-100' : 'opacity-20'}`}
          />
          
          {/* Gradients and Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/40 to-gray-900/80 z-20"></div>
          <div className="absolute inset-0 bg-black/10 z-20"></div>
      </div>
      
      {/* Content Layer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
        <div className="max-w-5xl text-center mx-auto flex flex-col items-center">
          
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-400 text-xs font-black uppercase tracking-[0.2em] animate-fade-in-down shadow-2xl backdrop-blur-md">
               <SparkleIcon className="w-4 h-4" />
               <span>Kansas & Missouri's Finest</span>
            </div>

            {isGenerating && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                    <ArrowPathIcon className="w-3 h-3 animate-spin" />
                    Rendering Your AI Vision...
                </div>
            )}

            {!isGenerating && !isAiGenerated && (
                <button 
                  onClick={handleOpenSelectKey}
                  className="group flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[9px] font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                >
                    <SparkleIcon className="w-3 h-3 group-hover:text-blue-400" />
                    Enable AI Custom Background
                </button>
            )}

            {isAiGenerated && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-400/20 text-green-300 text-[10px] font-bold uppercase tracking-widest animate-fade-in">
                    <SparkleIcon className="w-3 h-3" />
                    AI Cinematic Render Active
                </div>
            )}
            
            {genError && (
               <div className="text-[10px] text-red-400 font-bold uppercase tracking-widest bg-red-900/20 px-3 py-1 rounded-full border border-red-500/30">
                   {genError}
               </div>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-8 tracking-tighter drop-shadow-2xl max-w-4xl text-white">
            Built Local. Built to Last. <br/> <span className="text-blue-500">Built for You.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-lg">
            Your neighborhood’s trusted roofing experts for over 10 years. Quality workmanship you can see and a warranty you can trust.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full sm:w-auto mb-20">
            <button
              onClick={onEstimateClick}
              className="w-full sm:w-auto bg-blue-600 text-white font-black py-5 px-12 rounded-2xl shadow-2xl hover:bg-blue-500 hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-1.5 text-xl min-w-[280px] flex items-center justify-center gap-3"
            >
              <SparkleIcon className="w-6 h-6" />
              Claim Your Free Quote
            </button>
            
            <div className="hidden md:block">
                 <VoiceAgentOrb ref={voiceAgentRef} />
            </div>

            <button
              onClick={onScheduleClick}
              className="w-full sm:w-auto bg-white/10 backdrop-blur-md border-2 border-white/40 text-white font-bold py-5 px-12 rounded-2xl shadow-xl hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:-translate-y-1 text-xl min-w-[280px] flex items-center justify-center gap-3"
            >
              Book Inspection
            </button>
          </div>

          {/* Trust Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-16 w-full max-w-4xl mx-auto pt-12 border-t border-white/10">
              <div className="flex flex-col items-center gap-4 group">
                  <div className="p-4 bg-white/5 rounded-3xl group-hover:bg-blue-600/20 transition-all duration-500 border border-white/5 group-hover:border-blue-500/30">
                      <ShieldCheckIcon className="w-10 h-10 text-blue-400" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-xl text-white">Fully Insured</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-1">GL & WC Coverage</p>
                  </div>
              </div>
              <div className="flex flex-col items-center gap-4 group">
                  <div className="p-4 bg-white/5 rounded-3xl group-hover:bg-blue-600/20 transition-all duration-500 border border-white/5 group-hover:border-blue-500/30">
                      <svg className="w-10 h-10 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-xl text-white">A+ BBB Rating</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-1">Accredited Member</p>
                  </div>
              </div>
              <div className="flex flex-col items-center gap-4 group">
                  <div className="p-4 bg-white/5 rounded-3xl group-hover:bg-blue-600/20 transition-all duration-500 border border-white/5 group-hover:border-blue-500/30">
                      <UserCircleIcon className="w-10 h-10 text-blue-400" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-xl text-white">Family Owned</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-1">Serving MO & KS for 10+ yrs</p>
                  </div>
              </div>
          </div>
           
           <div className="mt-16 md:hidden">
                 <VoiceAgentOrb ref={voiceAgentRef} />
            </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-down {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
            animation: fade-in-down 0.8s ease-out forwards;
        }
        @keyframes fade-in {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 1s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Hero;
