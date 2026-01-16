
import React, { useState, useEffect } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, SparkleIcon, ArrowPathIcon } from './Icon';
import ImageSlider from './ImageSlider';
import { ExtendedGalleryImage, GALLERY_IMAGES } from '../constants';
import { generateComparisonImage } from '../services/geminiService';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ExtendedGalleryImage | null;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, onClose, item }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dynamicImages, setDynamicImages] = useState<Record<number, string>>({});
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Synchronize internal index with the item passed from parent
  useEffect(() => {
    if (item) {
      const index = GALLERY_IMAGES.findIndex(img => img.title === item.title);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [item, isOpen]);

  if (!isOpen) {
    return null;
  }

  const currentItem = GALLERY_IMAGES[currentIndex];
  
  // Use the AI-generated image if it exists for this index
  const activeImage = dynamicImages[currentIndex] ? {
    ...currentItem,
    before: dynamicImages[currentIndex],
    after: dynamicImages[currentIndex],
    isComparisonFullImage: true // Flag to tell slider to show full image if it's already a side-by-side
  } : currentItem;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  };

  const handleRegenerate = async () => {
    if (isRegenerating) return;
    
    setIsRegenerating(true);
    try {
        const aistudio = (window as any).aistudio;
        if (aistudio && !(await aistudio.hasSelectedApiKey())) {
            await aistudio.openSelectKey();
        }

        const prompt = currentItem.aiPrompt || `${currentItem.title} transformation`;
        const result = await generateComparisonImage(prompt);
        setDynamicImages(prev => ({ ...prev, [currentIndex]: result }));
    } catch (e) {
        console.error("Failed to regenerate gallery image:", e);
        alert("Sarah encountered an issue rendering this visual. Please try again or check your API key.");
    } finally {
        setIsRegenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col animate-modal-enter overflow-hidden border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 z-10">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">Project Showcase</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Comparing transformations: Before vs After</p>
            </div>
            <button 
                onClick={onClose} 
                className="p-2 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-sm"
                title="Close Gallery"
            >
                <XMarkIcon className="w-8 h-8" />
            </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto relative bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col lg:flex-row h-full">
                {/* Main Carousel Viewer */}
                <div className="flex-1 p-4 md:p-8 flex items-center justify-center relative group min-h-[400px]">
                    {/* Navigation Arrows */}
                    <button 
                        onClick={handlePrev}
                        className="absolute left-6 z-20 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white p-3 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 border border-gray-100 dark:border-gray-700"
                        title="Previous Project"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    
                    <div className="w-full max-w-3xl animate-fade-in-scale relative">
                         {isRegenerating ? (
                            <div className="aspect-[4/3] w-full bg-white dark:bg-gray-800 rounded-2xl flex flex-col items-center justify-center gap-6 shadow-inner animate-pulse">
                                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl animate-bounce">
                                    <SparkleIcon className="w-8 h-8" />
                                </div>
                                <p className="font-bold text-lg dark:text-white">Sarah is rendering your transformation...</p>
                            </div>
                         ) : (
                            <ImageSlider key={`${currentIndex}-${dynamicImages[currentIndex] ? 'dynamic' : 'static'}`} item={activeImage} />
                         )}
                    </div>

                    <button 
                        onClick={handleNext}
                        className="absolute right-6 z-20 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white p-3 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 border border-gray-100 dark:border-gray-700"
                        title="Next Project"
                    >
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Info Sidebar */}
                <div className="w-full lg:w-80 bg-white dark:bg-gray-800 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-gray-700 p-8 flex flex-col justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold mb-6">
                            Project {currentIndex + 1} of {GALLERY_IMAGES.length}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{currentItem.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm mb-6">
                            {currentItem.description}
                        </p>

                        <button 
                            onClick={handleRegenerate}
                            disabled={isRegenerating}
                            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                        >
                            {isRegenerating ? (
                                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                            ) : (
                                <SparkleIcon className="w-5 h-5" />
                            )}
                            {dynamicImages[currentIndex] ? "Regenerate Again" : "Regenerate with AI"}
                        </button>
                        <p className="mt-3 text-[10px] text-gray-400 text-center italic">
                            Generate a high-res comparison using your custom prompt.
                        </p>
                    </div>

                    <div className="mt-10 pt-6 border-t border-gray-50 dark:border-gray-700 flex flex-col gap-3">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">More Transformations</p>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {GALLERY_IMAGES.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-14 h-14 rounded-lg flex-shrink-0 overflow-hidden border-2 transition-all ${currentIndex === idx ? 'border-blue-600 scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                >
                                    <img src={dynamicImages[idx] || img.after} className="w-full h-full object-cover" alt="" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
      </div>
      <style>{`
        @keyframes modal-enter {
            0% { opacity: 0; transform: translateY(30px) scale(0.95); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fade-in-scale {
            0% { opacity: 0; transform: scale(0.98); }
            100% { opacity: 1; transform: scale(1); }
        }
        .animate-modal-enter {
            animation: modal-enter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in-scale {
            animation: fade-in-scale 0.5s ease-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default GalleryModal;
