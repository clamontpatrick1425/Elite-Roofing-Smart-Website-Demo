import React, { useState, useRef, useEffect } from 'react';
import VoiceAgentOrb, { VoiceAgentHandle } from './VoiceAgentOrb';
import { generateHeroVideo } from '../services/geminiService';
import { VideoCameraIcon } from './Icon';

interface HeroProps {
    onScheduleClick: () => void;
    onEstimateClick: () => void;
    voiceAgentRef: React.Ref<VoiceAgentHandle>;
}

const Hero: React.FC<HeroProps> = ({ onScheduleClick, onEstimateClick, voiceAgentRef }) => {
  const [heroImageUrl] = useState('https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoUrl && videoRef.current) {
        videoRef.current.play().catch(e => console.error("Autoplay failed:", e));
    }
  }, [videoUrl]);

  const handleModalClick = (e: React.MouseEvent<HTMLAnchorElement>, handler: () => void) => {
    e.preventDefault();
    handler();
  };

  const generateVideo = async (retryCount = 0) => {
      try {
        const prompt = "A professional, high-quality cinematic video for Elite Roofing. A sunny day showing a beautiful home with a pristine, durable roof. A friendly roofing professional in a uniform is shaking hands with a happy homeowner in front of the house, symbolizing trust, reliability, and customer satisfaction. An Elite Roofing truck is visible in the driveway. The scene is calm, reliable, and premium. 4k resolution, highly detailed, smooth motion, architectural style.";
        const url = await generateHeroVideo(prompt);
        setVideoUrl(url);
      } catch (error: any) {
        console.error("Video generation failed:", error);
        
        let errorMsg = error.message || '';
        try {
            if (typeof error === 'object') {
                errorMsg += ' ' + JSON.stringify(error);
            }
        } catch(e) {}
        
        const aistudio = (window as any).aistudio;
        
        // Handle Quota Exhausted (429) specifically
        if (errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("quota")) {
            alert("You've reached the API rate limit or quota for video generation. Please check your project's billing and plan at https://ai.google.dev/pricing or wait a few minutes before trying again.");
            return;
        }

        // Handle API key issues
        if (errorMsg.includes("API key") || errorMsg.includes("expired") || errorMsg.includes("400") || errorMsg.includes("INVALID_ARGUMENT") || errorMsg.includes("403")) {
             if (aistudio && retryCount < 1) { 
                 const retry = window.confirm("The API key appears to be invalid or expired. Would you like to select a new key and try again?");
                 if (retry) {
                     const success = await aistudio.openSelectKey();
                     if (success) {
                         await generateVideo(retryCount + 1);
                         return;
                     }
                 }
             } else {
                 alert("API Key expired or invalid. Please refresh the page to reset the key selection.");
             }
        } else {
             alert("Failed to generate video background. " + (error.message || "Please try again later."));
        }
      }
  };

  const handleGenerateVideo = async () => {
    if (isGeneratingVideo) return;
    setIsGeneratingVideo(true);
    const aistudio = (window as any).aistudio;
    try {
        if (aistudio) {
             const hasKey = await aistudio.hasSelectedApiKey();
             if (!hasKey) {
                 const success = await aistudio.openSelectKey();
                 if (!success) {
                     setIsGeneratingVideo(false);
                     return;
                 }
             }
        }
        
        await generateVideo();

    } catch (error) {
        console.error("Error in generation flow:", error);
    } finally {
        setIsGeneratingVideo(false);
    }
  };

  return (
    <section className="relative bg-gray-900 text-white py-20 sm:py-24 md:py-32 min-h-[550px] sm:min-h-[600px] flex items-center overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
          {videoUrl ? (
             <video 
                ref={videoRef}
                key={videoUrl}
                autoPlay 
                loop 
                muted 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                src={videoUrl}
                onLoadedData={() => console.log("Video loaded")}
                onError={(e) => console.error("Video playback error", e)}
             />
          ) : (
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
                style={{ backgroundImage: `url('${heroImageUrl}')` }}
            ></div>
          )}
           <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/90"></div>
      </div>
      
      {/* Content Layer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl text-center mx-auto flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4 sm:mb-6 tracking-tight drop-shadow-lg">
            The Future of Roofing <br className="hidden md:block" /> is Here.
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-gray-200 mb-8 sm:mb-10 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
            Experience seamless service with our AI-powered tools. Get instant estimates, book appointments online, and protect your home with the best in the business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
            <a
              href="#estimate"
              onClick={(e) => handleModalClick(e, onEstimateClick)}
              className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-blue-600/50 transition-all duration-300 transform hover:-translate-y-1 text-base sm:text-lg min-w-[200px]"
            >
              Get a Free Quote
            </a>
            
            <div className="hidden md:block">
                 <VoiceAgentOrb ref={voiceAgentRef} />
            </div>

            <a
              href="#schedule"
              onClick={(e) => handleModalClick(e, onScheduleClick)}
              className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold py-3 sm:py-3.5 px-6 sm:px-8 rounded-full shadow-lg hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:-translate-y-1 text-base sm:text-lg min-w-[200px]"
            >
              Book a Consultation
            </a>
          </div>
           
           <div className="mt-8 md:hidden scale-90 sm:scale-100">
                 <VoiceAgentOrb ref={voiceAgentRef} />
            </div>

           <div className="mt-8">
            <a
              href="tel:1-800-555-ROOF"
              className="inline-flex items-center gap-2 text-red-400 font-bold hover:text-red-300 transition-colors animate-pulse text-sm sm:text-base"
            >
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              For 24/7 Emergency Service, Call Now
            </a>
           </div>
        </div>
        
        <div className="absolute top-4 right-4 z-20">
            <button
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo}
                className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] sm:text-xs font-semibold py-1.5 px-2 sm:py-2 sm:px-3 rounded-full hover:bg-black/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Generate a custom AI video background for this section"
            >
                {isGeneratingVideo ? (
                    <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generating...
                    </>
                ) : videoUrl ? (
                    <>
                         <VideoCameraIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                         Regenerate
                    </>
                ) : (
                    <>
                         <VideoCameraIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        Generate AI Video
                    </>
                )}
            </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;