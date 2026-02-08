
import React, { useState, useEffect, useRef } from 'react';
import { TESTIMONIALS } from '../constants';
import { SparkleIcon, ChevronLeftIcon, ChevronRightIcon } from './Icon';

// Explicitly type StarIcon as React.FC to handle React-specific props like 'key' correctly in JSX.
const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setItemsToShow(3);
      else if (window.innerWidth >= 768) setItemsToShow(2);
      else setItemsToShow(1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, TESTIMONIALS.length - itemsToShow);

  // Ensure index is valid after resize
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [itemsToShow, maxIndex, currentIndex]);

  const handleNext = () => {
    setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1);
  };

  // Auto-rotation
  useEffect(() => {
    const interval = setInterval(handleNext, 6000);
    return () => clearInterval(interval);
  }, [maxIndex]);

  return (
    <section id="testimonials" className="py-24 bg-white dark:bg-gray-900 overflow-hidden relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-semibold mb-4">
             <SparkleIcon className="w-4 h-4" />
             <span>Customer Success</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            Hear From Our Happy Homeowners
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Our commitment to excellence is reflected in the real-world experiences of those we've served across the Kansas City metro area.
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
            {/* Navigation Buttons */}
            <button 
                onClick={handlePrev}
                className="absolute top-1/2 -left-4 md:-left-8 z-10 p-3 rounded-full bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-white hover:scale-110 transition-transform focus:outline-none -translate-y-1/2"
                aria-label="Previous testimonial"
            >
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
            
            <button 
                onClick={handleNext}
                className="absolute top-1/2 -right-4 md:-right-8 z-10 p-3 rounded-full bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-white hover:scale-110 transition-transform focus:outline-none -translate-y-1/2"
                aria-label="Next testimonial"
            >
                <ChevronRightIcon className="w-6 h-6" />
            </button>

            {/* Carousel Container */}
            <div className="overflow-hidden px-2 py-4" ref={containerRef}>
                <div 
                    className="flex transition-transform duration-500 ease-in-out gap-8"
                    style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
                >
                    {TESTIMONIALS.map((testimonial, index) => (
                        <div 
                            key={index} 
                            className="flex-shrink-0 w-full"
                            style={{ width: `calc((100% - ${(itemsToShow - 1) * 32}px) / ${itemsToShow})` }}
                        >
                            <div className="h-full relative bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
                                <div>
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                        <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 italic mb-8 relative z-10 text-lg leading-relaxed">
                                        "{testimonial.quote}"
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-black shadow-md uppercase tracking-wider">
                                        {testimonial.author.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.author}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest text-[10px] font-black">{testimonial.location}</p>
                                    </div>
                                </div>
                                <div className="absolute top-6 right-8 text-6xl text-blue-200 dark:text-blue-800 font-serif opacity-30 select-none group-hover:scale-110 transition-transform">
                                    &ldquo;
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? 'bg-blue-600 w-8' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'}`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
