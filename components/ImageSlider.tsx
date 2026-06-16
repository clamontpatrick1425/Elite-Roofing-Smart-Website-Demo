
import React, { useState, useRef, useCallback } from 'react';
// FIX: Added SparkleIcon to the imports from './Icon'
import { ChevronLeftIcon, ChevronRightIcon, SparkleIcon } from './Icon';
import { GalleryImage } from '../types';

interface ExtendedGalleryImage extends GalleryImage {
    isComparisonFullImage?: boolean;
    isSplit?: boolean;
}

interface ImageSliderProps {
  item: ExtendedGalleryImage;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ item }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Dynamic state to support live fallbacks and local uploads
    const [beforeSrc, setBeforeSrc] = useState(item.before || '');
    const [afterSrc, setAfterSrc] = useState(item.after || '');
    const [beforeError, setBeforeError] = useState(false);
    const [afterError, setAfterError] = useState(false);

    // Update state when item props change
    React.useEffect(() => {
        setBeforeSrc(item.before || '');
        setAfterSrc(item.after || '');
        setBeforeError(false);
        setAfterError(false);
    }, [item.before, item.after]);

    // High fidelity fallbacks that remain active and descriptive (quality roof textures)
    const fallbackBefore = 'https://images.unsplash.com/photo-1508333706533-1ec43ecb1606?auto=format&fit=crop&q=80&w=1200';
    const fallbackAfter = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200';

    const handleBeforeError = () => {
        if (!beforeError) {
            setBeforeError(true);
            setBeforeSrc(fallbackBefore);
        }
    };

    const handleAfterError = () => {
        if (!afterError) {
            setAfterError(true);
            setAfterSrc(fallbackAfter);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const localUrl = URL.createObjectURL(file);
            setBeforeSrc(localUrl);
            setBeforeError(false); // Reset to display the newly selected local file
        }
    };

    const triggerFileInput = (e: React.MouseEvent) => {
        e.stopPropagation();
        fileInputRef.current?.click();
    };

    const handleMove = useCallback((clientX: number) => {
        if (!containerRef.current || item.isComparisonFullImage) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        let percentage = (x / rect.width) * 100;
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;
        setSliderPosition(percentage);
    }, [item.isComparisonFullImage]);

    const handleMouseDown = () => !item.isComparisonFullImage && setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        handleMove(e.clientX);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        handleMove(e.touches[0].clientX);
    };

    return (
        <div 
            ref={containerRef}
            className={`relative w-full h-full min-h-[250px] aspect-[4/3] select-none overflow-hidden rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 ${item.isComparisonFullImage ? 'cursor-default' : 'cursor-ew-resize'}`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            onTouchMove={handleTouchMove}
        >
            {/* After Image */}
            <img 
                src={afterSrc} 
                alt="After" 
                className={item.isSplit ? "absolute top-0 h-full object-cover pointer-events-none" : "absolute inset-0 w-full h-full object-cover pointer-events-none"}
                style={item.isSplit ? { width: '200%', maxWidth: 'none', left: '-100%' } : {}}
                draggable={false}
                onError={handleAfterError}
                referrerPolicy="no-referrer"
            />

            {!item.isComparisonFullImage && (
                <>
                    {/* Before Image (clipped) */}
                    <div 
                        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                    >
                        <img 
                            src={beforeSrc} 
                            alt="Before" 
                            className={item.isSplit ? "absolute top-0 h-full object-cover pointer-events-none" : "w-full h-full object-cover pointer-events-none"}
                            style={item.isSplit ? { width: '200%', maxWidth: 'none', left: '0px' } : {}}
                            draggable={false}
                            onError={handleBeforeError}
                            referrerPolicy="no-referrer"
                        />
                    </div>
                    {/* Slider Handle */}
                    <div 
                        className="absolute top-0 bottom-0 w-1 bg-white/80 cursor-ew-resize pointer-events-none shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                    >
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-2xl border border-gray-100 flex items-center justify-center">
                            <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
                            <ChevronRightIcon className="w-5 h-5 text-gray-700 -ml-1" />
                        </div>
                    </div>
                </>
            )}

            {/* Labels */}
            {!item.isSplit && (
                <>
                    <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-black tracking-widest pointer-events-none border border-white/20">BEFORE</div>
                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-black tracking-widest pointer-events-none border border-white/20">AFTER</div>
                </>
            )}
            


            {item.isComparisonFullImage && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600/90 backdrop-blur-md text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2">
                    <SparkleIcon className="w-3 h-3" />
                    AI-Generated Comparison
                </div>
            )}
        </div>
    );
};

export default ImageSlider;
