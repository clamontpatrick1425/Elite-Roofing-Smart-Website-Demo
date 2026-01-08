
import React, { useState, useRef, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icon';
import { GalleryImage } from '../types';

interface ImageSliderProps {
  item: GalleryImage;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ item }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        let percentage = (x / rect.width) * 100;
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;
        setSliderPosition(percentage);
    }, []);

    const handleMouseDown = () => setIsDragging(true);
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
            className="relative w-full aspect-[4/3] select-none cursor-ew-resize overflow-hidden rounded-2xl shadow-2xl"
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
                className="absolute top-0 bottom-0 w-1 bg-white/80 cursor-ew-resize pointer-events-none"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-md">
                    <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
                    <ChevronRightIcon className="w-5 h-5 text-gray-700 -ml-1" />
                </div>
            </div>
            <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-bold pointer-events-none">BEFORE</div>
            <div className="absolute top-2 right-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-bold pointer-events-none">AFTER</div>
        </div>
    );
};

export default ImageSlider;
