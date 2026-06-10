
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
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(true);
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
      setIsVideoLoaded(true);
    };

    window.addEventListener('hero-video-updated', handleUpdate);
    return () => {
      window.removeEventListener('hero-video-updated', handleUpdate);
    };
  }, []);

  // Built-in pool of stable backgrounds (including a static slate option for silent/disabled view)
  const BACKGROUND_MEDIA_OPTIONS = useMemo(() => {
    const list: Array<{ name: string; type: 'video' | 'image'; url: string; poster: string }> = [
      {
        name: "Premium Roofing Loop",
        type: "video",
        url: "/hero-video.mp4",
        poster: HERO_IMAGE
      }
    ];
    
    if (customVideoUrl) {
      list.push({
        name: "✨ AI Design Render",
        type: "video",
        url: customVideoUrl,
        poster: HERO_IMAGE
      });
    }
    
    list.push(
      {
        name: "Modern House Shingles",
        type: "video",
        url: "https://player.vimeo.com/external/435674703.sd.mp4?s=79fa3ffd107e20ad4cf909d224850021c3b2e5ef&profile_id=139&oauth2_token_id=57447761",
        poster: HERO_IMAGE
      },
      {
        name: "Scenic Sunset Aerial",
        type: "video",
        url: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c02cba73d113f1d41359b4e19cbd0a56&profile_id=139&oauth2_token_id=57447761",
        poster: HERO_IMAGE
      },
      {
        name: "Standard Landscape Loop",
        type: "video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        poster: HERO_IMAGE
      },
      {
        name: "Static Slate Image",
        type: "image",
        url: HERO_IMAGE,
        poster: HERO_IMAGE
      }
    );
    
    return list;
  }, [customVideoUrl]);

  const currentMedia = BACKGROUND_MEDIA_OPTIONS[currentMediaIndex] || BACKGROUND_MEDIA_OPTIONS[0];

  // Prevent video remaining invisible if loading/autoplay is blocked by browser policies
  useEffect(() => {
    if (currentMedia.type === 'video') {
      const timer = setTimeout(() => {
        setIsVideoLoaded(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsVideoLoaded(true);
    }
  }, [currentMediaIndex, currentMedia.url, currentMedia.type]);

  const togglePlayPause = () => {
    const el = videoRef.current;
    if (el) {
      if (isPlaying) {
        el.pause();
        setIsPlaying(false);
      } else {
        el.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.warn("Failed to play video programmatically:", e));
      }
    }
  };

  const handleCycleMedia = () => {
    const nextIndex = (currentMediaIndex + 1) % BACKGROUND_MEDIA_OPTIONS.length;
    setCurrentMediaIndex(nextIndex);
    setIsPlaying(true);
  };

  // Synchronize playing state with DOM video player nicely
  useEffect(() => {
    const el = videoRef.current;
    if (!el || currentMedia.type !== 'video') return;

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
        if (active) setIsVideoLoaded(true);
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
        if (active) setIsVideoLoaded(true);
      } catch (err) {
        console.warn("Muted video autoplay pending interaction:", err);
        if (active) {
          window.addEventListener('click', handleUserGesture, { once: true });
          window.addEventListener('touchstart', handleUserGesture, { once: true });
          gestureRegistered = true;
        }
      }
    };

    if (isPlaying) {
      startPlay();
    } else {
      el.pause();
    }

    return () => {
      active = false;
      if (gestureRegistered) {
        removeListeners();
      }
    };
  }, [isPlaying, currentMedia.url, currentMedia.type]);

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

    console.warn("Active video source failed to play:", currentMedia.name, error);
    
    const stored = localStorage.getItem('custom_hero_video');
    if (stored && currentMedia.name.includes("AI")) {
      localStorage.removeItem('custom_hero_video');
      setCustomVideoUrl(null);
    }
  };

  const handleSectionInteraction = () => {
    const el = videoRef.current;
    if (el && currentMedia.type === 'video' && isPlaying) {
      el.play()
        .then(() => {
          setIsVideoLoaded(true);
        })
        .catch(() => {});
    }
  };

  return (
    <section 
      onMouseEnter={handleSectionInteraction}
      className="relative bg-gray-900 text-white py-20 sm:py-24 md:py-32 min-h-[700px] sm:min-h-[800px] flex items-center overflow-hidden"
    >
      {/* Background Layers */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Static Background Image Fallback */}
          <div
              className="absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-[1500ms]"
              style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
          ></div>

          {/* Background Video (unthrottled autoplay loop) */}
          {currentMedia.type === 'video' && (
            <video 
              ref={videoRef}
              key={currentMedia.url}
              src={currentMedia.url}
              autoPlay={true}
              loop={true}
              muted={true}
              playsInline={true}
              preload="auto"
              onLoadedData={handleLoadedData}
              onCanPlay={handleLoadedData}
              onLoadedMetadata={handleLoadedData}
              onPlay={() => {
                setIsVideoLoaded(true);
                setIsPlaying(true);
              }}
              onError={handleVideoError}
              poster={currentMedia.poster}
              className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-1000 ${
                isVideoLoaded ? 'opacity-100' : 'opacity-85'
              }`}
            />
          )}
          
          {/* Gradients and Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/40 to-gray-900/80 z-20"></div>
          <div className="absolute inset-0 bg-black/15 z-20"></div>
      </div>
      
      {/* Ambient Background Media Control Board */}
      <div className="absolute bottom-6 right-6 z-40 bg-black/45 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-3 shadow-2xl animate-fade-in pointer-events-auto">
        <span className="text-[10px] uppercase font-black tracking-widest text-white/50 pl-1 select-none">
          Ambient Control
        </span>
        <div className="h-4 w-[1px] bg-white/10"></div>
        
        {/* Play/Pause Button */}
        {currentMedia.type === 'video' && (
          <button
            onClick={togglePlayPause}
            className="p-1 px-2.5 rounded-lg text-white bg-white/10 hover:bg-white/20 transition-all font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            title={isPlaying ? "Pause background loop" : "Play background loop"}
          >
            {isPlaying ? (
              <>
                <span className="inline-block w-1 h-3 bg-white rounded-sm"></span>
                <span className="inline-block w-1 h-3 bg-white rounded-sm"></span>
                <span>Pause</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Play</span>
              </>
            )}
          </button>
        )}

        {/* Change Background Style Carousel */}
        <button
          onClick={handleCycleMedia}
          className="p-1 px-2.5 rounded-lg text-white bg-blue-600/80 hover:bg-blue-600 transition-all font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/10"
          title="Cycle ambient background video asset or static design"
        >
          <ArrowPathIcon className="w-3.5 h-3.5 animate-spin-slow" />
          <span>Style: {currentMedia.name}</span>
        </button>
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
