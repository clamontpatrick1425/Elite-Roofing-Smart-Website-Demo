
import React, { useState, useRef, useEffect } from 'react';
import VoiceAgentOrb, { VoiceAgentHandle } from './VoiceAgentOrb';
import { ShieldCheckIcon, UserCircleIcon, SparkleIcon, ArrowPathIcon } from './Icon';
import { generateHeroVideo } from '../services/geminiService';

interface HeroProps {
    onScheduleClick: () => void;
    onEstimateClick: () => void;
    voiceAgentRef: React.Ref<VoiceAgentHandle>;
}

const Hero: React.FC<HeroProps> = ({ onScheduleClick, onEstimateClick, voiceAgentRef }) => {
  const FALLBACK_VIDEO = "https://player.vimeo.com/external/434045526.sd.mp4?s=c27dc3699869559c73f1c6ca5e30d70f9cc6735c&profile_id=164&oauth2_token_id=57447761";
  const HERO_IMAGE = 'https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
  
  const CINEMATIC_PROMPT = "Cinematic wide shot of two professional roofers in high-visibility safety gear expertly installing premium slate tiles on a modern luxury mansion. Golden hour lighting with soft sun flares. Smooth drone tracking shot moving slowly across the roofline. 4k resolution, highly detailed textures, professional architectural videography.";

  const [videoUrl, setVideoUrl] = useState(FALLBACK_VIDEO);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const attemptAiGeneration = async () => {
        const aistudio = (window as any).aistudio;
        if (aistudio && await aistudio.hasSelectedApiKey()) {
            setIsGenerating(true);
            try {
                const url = await generateHeroVideo(CINEMATIC_PROMPT);
                setVideoUrl(url);
                setIsAiGenerated(true);
            } catch (e) {
                console.warn("Hero AI Generation skipped or failed, using fallback.", e);
            } finally {
                setIsGenerating(false);
            }
        }
    };

    attemptAiGeneration();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
        const v = videoRef.current;
        v.muted = true;
        v.defaultMuted = true;
        v.playsInline = true;

        const handleReady = () => setIsVideoLoaded(true);
        v.addEventListener('loadeddata', handleReady);
        v.play().catch(() => {});

        return () => v.removeEventListener('loadeddata', handleReady);
    }
  }, [videoUrl]);

  const handleModalClick = (e: React.MouseEvent<HTMLAnchorElement>, handler: () => void) => {
    e.preventDefault();
    handler();
  };

  return (
    <section className="relative bg-gray-900 text-white py-20 sm:py-24 md:py-32 min-h-[700px] sm:min-h-[800px] flex items-center overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <div
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
          ></div>

          <video 
            key={videoUrl}
            ref={videoRef}
            src={videoUrl}
            autoPlay 
            loop 
            muted 
            playsInline
            poster={HERO_IMAGE}
            className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-[2000ms] ${isVideoLoaded ? 'opacity-100' : 'opacity-30'}`}
          />
          
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/40 to-gray-900/90 z-20"></div>
          <div className="absolute inset-0 bg-black/20 z-20"></div>
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
                    AI Rendering Cinematic Background...
                </div>
            )}

            {isAiGenerated && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-400/20 text-green-300 text-[10px] font-bold uppercase tracking-widest animate-fade-in">
                    <SparkleIcon className="w-3 h-3" />
                    Custom AI Vision Loaded
                </div>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-8 tracking-tighter drop-shadow-2xl max-w-4xl text-white">
            Built Local. Built to Last. <span className="text-blue-500">Built for You.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-lg">
            Your neighborhood’s trusted roofing experts for over 10 years. Quality workmanship you can see and a warranty you can trust.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full sm:w-auto mb-20">
            <a
              href="#estimate"
              onClick={(e) => handleModalClick(e, onEstimateClick)}
              className="w-full sm:w-auto bg-blue-600 text-white font-black py-5 px-12 rounded-2xl shadow-2xl hover:bg-blue-500 hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-1.5 text-xl min-w-[280px] flex items-center justify-center gap-3"
            >
              <SparkleIcon className="w-6 h-6" />
              Claim Your Free Quote
            </a>
            
            <div className="hidden md:block">
                 <VoiceAgentOrb ref={voiceAgentRef} />
            </div>

            <a
              href="#schedule"
              onClick={(e) => handleModalClick(e, onScheduleClick)}
              className="w-full sm:w-auto bg-white/10 backdrop-blur-md border-2 border-white/40 text-white font-bold py-5 px-12 rounded-2xl shadow-xl hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:-translate-y-1 text-xl min-w-[280px] flex items-center justify-center gap-3"
            >
              Book Inspection
            </a>
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
