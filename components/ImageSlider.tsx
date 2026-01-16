
import React, { useState, useRef, useCallback } from 'react';
// FIX: Added SparkleIcon to the imports from './Icon'
import { ChevronLeftIcon, ChevronRightIcon, SparkleIcon } from './Icon';
import { GalleryImage } from '../types';

interface ExtendedGalleryImage extends GalleryImage {
    isComparisonFullImage?: boolean;
}

interface ImageSliderProps {
  item: ExtendedGalleryImage;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ item }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

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
            className={`relative w-full aspect-[4/3] select-none overflow-hidden rounded-2xl shadow-2xl ${item.isComparisonFullImage ? 'cursor-default' : 'cursor-ew-resize'}`}
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
                src={item.after} 
                alt="After" 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                draggable={false}
            />

            {!item.isComparisonFullImage && (
                <>
                    {/* Before Image (clipped) */}
                    <div 
                        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                    >
                        <img 
                            src={item.before} 
                            alt="Before" 
                            className="w-full h-full object-cover pointer-events-none"
                            draggable={false}
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
            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-black tracking-widest pointer-events-none border border-white/20">BEFORE</div>
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-black tracking-widest pointer-events-none border border-white/20">AFTER</div>
            
            {item.isComparisonFullImage && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600/90 backdrop-blur-md text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2">
                    {/* FIX: SparkleIcon is now properly imported from './Icon' */}
                    <SparkleIcon className="w-3 h-3" />
                    AI-Generated Comparison
                </div>
            )}
        </div>
    );
};

export default ImageSlider;
