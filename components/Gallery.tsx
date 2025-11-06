
import React, { useState, useRef, useCallback } from 'react';
import { GALLERY_IMAGES } from '../constants';
import { ChevronLeftIcon, ChevronRightIcon } from './Icon';

const Gallery: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const currentImage = GALLERY_IMAGES[currentIndex];

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

    const prevImage = () => {
        const isFirst = currentIndex === 0;
        setCurrentIndex(isFirst ? GALLERY_IMAGES.length - 1 : currentIndex - 1);
        setSliderPosition(50);
    };

    const nextImage = () => {
        const isLast = currentIndex === GALLERY_IMAGES.length - 1;
        setCurrentIndex(isLast ? 0 : currentIndex + 1);
        setSliderPosition(50);
    };

    return (
        <section id="gallery" className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Our Transformation Gallery
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        Seeing is believing. Drag the slider to see the dramatic before-and-after results of our work.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
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
                            src={currentImage.after} 
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
                                src={currentImage.before} 
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

                    <div className="flex justify-between items-center mt-6">
                        <button onClick={prevImage} className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors">
                            <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
                        </button>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-900">{currentImage.title}</h3>
                            <p className="text-gray-600">{currentImage.description}</p>
                        </div>
                        <button onClick={nextImage} className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors">
                            <ChevronRightIcon className="w-6 h-6 text-gray-800" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
