
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { ShieldCheckIcon, UserCircleIcon, SparkleIcon, ArrowPathIcon } from './Icon';
import { getVideoBlob } from '../services/videoDb';

interface HeroProps {
    onScheduleClick: () => void;
    onEstimateClick: () => void;
    onChatClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onScheduleClick, onEstimateClick, onChatClick }) => {
  const HERO_IMAGE = 'https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
  
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Load custom video if generated
  useEffect(() => {
    const loadVideoSource = async () => {
      try {
        const stored = localStorage.getItem('custom_hero_video');
        if (stored === 'indexeddb') {
          const blob = await getVideoBlob();
          if (blob) {
            const blobUrl = URL.createObjectURL(blob);
            setCustomVideoUrl(blobUrl);
          }
        } else if (stored && !stored.startsWith('blob:')) {
          setCustomVideoUrl(stored);
        }
      } catch (e) {
        console.error("Failed to load custom video", e);
      }
    };

    loadVideoSource();

    const handleUpdate = () => {
      loadVideoSource();
      setIsVideoLoaded(false);
      setIsPlaying(false);
    };

    window.addEventListener('hero-video-updated', handleUpdate);
    return () => {
      window.removeEventListener('hero-video-updated', handleUpdate);
    };
  }, []);

  // Use custom video if generated, otherwise default to premium local loop
  const videoUrl = customVideoUrl || "/hero-video.mp4";

  // Prevent video remaining invisible if loading/autoplay is blocked by browser policies
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVideoLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [videoUrl]);

  // Synchronize playing state with DOM video player nicely
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    // Apply proper muted/playsinline configurations programmatically
    el.defaultMuted = true;
    el.muted = true;
    el.playsInline = true;
    el.setAttribute('muted', '');
    el.setAttribute('playsinline', '');

    let active = true;
    let gestureRegistered = false;

    const handleUserGesture = async () => {
      if (!active || !el) return;
      try {
        await el.play();
        if (active) {
          setIsVideoLoaded(true);
          setIsPlaying(true);
        }
      } catch (e) {
        console.warn("Deferred gesture play failed:", e);
      }
    };

    const removeListeners = () => {
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('touchstart', handleUserGesture);
    };

    const startPlay = async () => {
      if (!el || !active) return;
      try {
        await el.play();
        if (active) {
          setIsVideoLoaded(true);
          setIsPlaying(true);
        }
      } catch (err) {
        console.warn("Muted video autoplay pending interaction:", err);
        if (active) {
          window.addEventListener('click', handleUserGesture, { once: true });
          window.addEventListener('touchstart', handleUserGesture, { once: true });
          gestureRegistered = true;
        }
      }
    };

    startPlay();

    return () => {
      active = false;
      if (gestureRegistered) {
        removeListeners();
      }
    };
  }, [videoUrl]);

  const handleLoadedData = () => {
    setIsVideoLoaded(true);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const target = e.target as HTMLVideoElement;
    const error = target.error;
    
    // Ignore aborted loads, which are common when sources transition or React re-renders the element
    if (error && error.code === 1) { // MediaError.MEDIA_ERR_ABORTED
      console.log("Video loading aborted during transition");
      return;
    }

    console.warn("Active video source failed to play:", videoUrl, error);
    setIsPlaying(false);
    
    const stored = localStorage.getItem('custom_hero_video');
    if (stored) {
      localStorage.removeItem('custom_hero_video');
      setCustomVideoUrl(null);
    }
  };

  const handleSectionInteraction = () => {
    const el = videoRef.current;
    if (el) {
      el.play()
        .then(() => {
          setIsVideoLoaded(true);
          setIsPlaying(true);
        })
        .catch(() => {});
    }
  };

  // Listen to general window events to trigger video play when user moves or scrolls for robust background autoplay
  useEffect(() => {
    let intervalId: any = null;
    
    const triggerPlay = () => {
      const el = videoRef.current;
      if (el) {
        el.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {});
      }
    };

    // Attempt to start play immediately on load or state update
    triggerPlay();

    // Continuous health check: if the video is paused but should be playing, kick-start it.
    intervalId = setInterval(() => {
      const el = videoRef.current;
      if (el && el.paused) {
        el.play()
          .then(() => {
            setIsVideoLoaded(true);
            setIsPlaying(true);
          })
          .catch(() => {});
      } else if (el && !el.paused) {
        setIsPlaying(true);
      }
    }, 800);

    // Register handlers for various interaction streams to trigger quick video play initialization
    window.addEventListener('scroll', triggerPlay, { passive: true });
    window.addEventListener('click', triggerPlay);
    window.addEventListener('touchstart', triggerPlay, { passive: true });
    window.addEventListener('mousemove', triggerPlay, { passive: true });
    window.addEventListener('pointerdown', triggerPlay, { passive: true });
    window.addEventListener('mouseover', triggerPlay, { passive: true });

    return () => {
      if (intervalId) clearInterval(intervalId);
      window.removeEventListener('scroll', triggerPlay);
      window.removeEventListener('click', triggerPlay);
      window.removeEventListener('touchstart', triggerPlay);
      window.removeEventListener('mousemove', triggerPlay);
      window.removeEventListener('pointerdown', triggerPlay);
      window.removeEventListener('mouseover', triggerPlay);
    };
  }, [videoUrl]);

  return (
    <section 
      onMouseEnter={handleSectionInteraction}
      onTouchStart={handleSectionInteraction}
      onClick={handleSectionInteraction}
      onMouseMove={handleSectionInteraction}
      className="relative bg-gray-900 text-white py-20 sm:py-24 md:py-32 min-h-[700px] sm:min-h-[800px] flex items-center overflow-hidden"
    >
      {/* Background Layers */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Static Background Image Fallback */}
          <div
              className="absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-[1500ms]"
              style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
          ></div>

          {/* Background Video (unthrottled autoplay loop with direct src attribute) */}
          <video 
            ref={videoRef}
            key={videoUrl}
            src={videoUrl}
            autoPlay={true}
            loop={true}
            muted={true}
            playsInline={true}
            preload="auto"
            onLoadedData={() => {
              setIsVideoLoaded(true);
            }}
            onCanPlay={() => {
              setIsVideoLoaded(true);
            }}
            onLoadedMetadata={() => {
              setIsVideoLoaded(true);
            }}
            onPlay={() => {
              setIsVideoLoaded(true);
              setIsPlaying(true);
            }}
            onError={handleVideoError}
            poster={HERO_IMAGE}
            className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-1000 ${
              isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
          
          {/* Gradients and Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/40 to-gray-900/80 z-20"></div>
          <div className="absolute inset-0 bg-black/15 z-20"></div>
      </div>

      {/* Content Layer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
        <div className="max-w-5xl text-center mx-auto flex flex-col items-center">
          
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-400 text-xs font-black uppercase tracking-[0.2em] animate-fade-in-down shadow-2xl backdrop-blur-md">
               <SparkleIcon className="w-4 h-4" />
               <span>Kansas & Missouri's Finest</span>
            </div>
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
            
            <button
              onClick={onChatClick}
              className="w-full sm:w-auto bg-gray-850 hover:bg-gray-800 text-white font-bold py-5 px-12 rounded-2xl shadow-xl border border-white/15 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-1 text-xl min-w-[280px] flex items-center justify-center gap-3"
            >
              <SparkleIcon className="w-6 h-6 text-blue-400 animate-pulse" />
              <span>Ask Hannah AI</span>
            </button>

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
           
           <div className="mt-16 md:hidden flex justify-center w-full">
                <button
                   onClick={onChatClick}
                   className="w-full max-w-[280px] bg-gray-850 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-2xl shadow-lg border border-white/10 transition-all flex items-center justify-center gap-3 text-base"
                >
                  <SparkleIcon className="w-5 h-5 text-blue-400 animate-pulse" />
                  <span>Ask Hannah AI</span>
                </button>
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
