
import React, { useState } from 'react';
import { TESTIMONIALS } from '../constants';
import { ChevronLeftIcon, ChevronRightIcon, UserCircleIcon } from './Icon';

const Testimonials: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevTestimonial = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? TESTIMONIALS.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextTestimonial = () => {
        const isLastSlide = currentIndex === TESTIMONIALS.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Trusted by Homeowners Like You
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
            See what our satisfied customers are saying about our work.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
            <div className="overflow-hidden relative h-64">
                 {TESTIMONIALS.map((testimonial, index) => (
                    <div
                        key={index}
                        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                    >
                         <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl h-full flex flex-col justify-center">
                            <p className="text-xl italic text-white text-center">
                                "{testimonial.quote}"
                            </p>
                            <div className="flex items-center justify-center mt-6">
                                <UserCircleIcon className="w-10 h-10 text-gray-300" />
                                <div className="ml-3 text-left">
                                    <p className="font-bold text-white">{testimonial.author}</p>
                                    <p className="text-sm text-gray-400">{testimonial.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={prevTestimonial} className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 bg-white/20 p-2 rounded-full text-white hover:bg-white/40 transition-colors">
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button onClick={nextTestimonial} className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 bg-white/20 p-2 rounded-full text-white hover:bg-white/40 transition-colors">
                <ChevronRightIcon className="w-6 h-6" />
            </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
