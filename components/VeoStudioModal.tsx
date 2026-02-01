
import React, { useState, useRef } from 'react';
import { XMarkIcon, SparkleIcon, CameraIcon, ArrowPathIcon, VideoCameraIcon } from './Icon';
import { generateHeroVideo } from '../services/geminiService';

interface VeoStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VeoStudioModal: React.FC<VeoStudioModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('cinematic fly over of with red shingles with solar integration at sunset');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    setVideoUrl(null);

    const aistudio = (window as any).aistudio;
    if (aistudio && !(await aistudio.hasSelectedApiKey())) {
        await aistudio.openSelectKey();
    }

    try {
      const url = await generateHeroVideo(prompt);
      setVideoUrl(url);
    } catch (err: any) {
      if (err.message === "ENTITY_NOT_FOUND" || err.message === "INVALID_KEY_OR_PROJECT" || err.message === "VIDEO_NOT_SUPPORTED") {
          setError("Video generation requires a PAID API key from a billable Google Cloud project. Verify your project supports Generative AI Video and your region is allowed.");
      } else {
          setError(err.message || "Failed to generate cinematic video.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenBilling = () => {
    window.open('https://ai.google.dev/gemini-api/docs/billing', '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-modal-enter" onClick={e => e.stopPropagation()}>
        <header className="p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 z-10">
          <div className="text-center w-full relative">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Design Studio</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Animate your project visions. Upload a photo or describe your dream roof.</p>
            <button onClick={onClose} className="absolute top-0 right-0 p-2 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                <XMarkIcon className="w-8 h-8" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-gray-900/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            {/* Input Column */}
            <div className="flex flex-col gap-6">
                <div className="relative group">
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-video w-full bg-white dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all shadow-inner"
                    >
                        {imagePreview ? (
                            <img src={imagePreview} className="w-full h-full object-cover" alt="Upload Preview" />
                        ) : (
                            <div className="flex flex-col items-center gap-3 opacity-40">
                                <CameraIcon className="w-12 h-12" />
                                <p className="text-sm font-medium">Click to upload reference photo</p>
                            </div>
                        )}
                        <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>
                    {imagePreview && (
                        <button 
                            onClick={() => setImagePreview(null)}
                            className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-black transition-colors"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Motion Description</label>
                    <textarea 
                        value={prompt} 
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="Describe the cinematic motion and environment..."
                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all shadow-sm min-h-[120px] resize-none"
                    />
                </div>

                <div className="space-y-4">
                    <button 
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 text-lg"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <SparkleIcon className="w-6 h-6" />
                                Animate Vision
                            </>
                        )}
                    </button>
                    <p className="text-[10px] text-center text-gray-400">
                        Veo requires a paid Gemini API key. <button onClick={handleOpenBilling} className="text-blue-500 underline font-bold">View Billing Requirements</button>
                    </p>
                </div>
            </div>

            {/* Output Column */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center justify-center relative overflow-hidden shadow-2xl">
              {videoUrl ? (
                <div className="w-full h-full animate-fade-in group">
                  <video src={videoUrl} controls autoPlay loop muted playsInline className="w-full h-full object-cover" />
                  <div className="absolute top-6 left-6 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                    <SparkleIcon className="w-3 h-3" />
                    AI Cinematic Render
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-center p-12">
                   {isLoading ? (
                       <div className="flex flex-col items-center gap-8">
                            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <div className="space-y-2">
                                <p className="font-bold text-lg text-blue-600 dark:text-blue-400">Hannah is painting your dream project...</p>
                                <p className="text-sm text-gray-500">This typically takes 20-60 seconds on the fast-preview model.</p>
                            </div>
                       </div>
                   ) : (
                        <div className="opacity-40 flex flex-col items-center gap-4">
                            <VideoCameraIcon className="w-20 h-20 text-gray-400" />
                            <p className="text-sm font-medium">Your cinematic flyover will appear here.</p>
                        </div>
                   )}
                </div>
              )}
              
              {error && (
                <div className="absolute bottom-8 left-8 right-8 p-6 bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-300 text-sm font-bold flex flex-col gap-3 animate-fade-in shadow-xl">
                    <div className="flex items-center gap-3">
                        <XMarkIcon className="w-5 h-5 flex-shrink-0" />
                        <span>Generation Failed</span>
                    </div>
                    <p className="font-normal text-xs opacity-90">{error}</p>
                    <div className="flex gap-4 pt-2">
                        <button onClick={handleGenerate} className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors">Retry</button>
                        <button onClick={() => (window as any).aistudio?.openSelectKey()} className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-black transition-colors">Switch API Key</button>
                    </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <style>{`
        @keyframes modal-enter {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-modal-enter {
          animation: modal-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default VeoStudioModal;
