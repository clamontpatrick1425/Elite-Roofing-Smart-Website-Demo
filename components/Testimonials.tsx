
import React from 'react';
import { TESTIMONIALS } from '../constants';
import { SparkleIcon } from './Icon';

// Explicitly type StarIcon as React.FC to handle React-specific props like 'key' correctly in JSX.
const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-semibold mb-4">
             <SparkleIcon className="w-4 h-4" />
             <span>Customer Success</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            Hear From Our Happy Homeowners
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our commitment to excellence is reflected in the experiences of those we've served.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <div 
              key={index} 
              className="relative bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic mb-8 relative z-10">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.author}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</p>
                </div>
              </div>
              <div className="absolute top-6 right-8 text-6xl text-blue-200 dark:text-blue-800 font-serif opacity-30 select-none group-hover:scale-110 transition-transform">
                &ldquo;
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
            <div className="inline-block p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                <div className="px-8 py-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Rated <span className="text-gray-900 dark:text-white font-bold">4.9/5 stars</span> based on 2,500+ reviews across Google and Yelp.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
