
import React from 'react';
import { GALLERY_IMAGES } from '../constants';
import ImageSlider from './ImageSlider';

const Gallery: React.FC = () => {
  return (
    <section id="gallery" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Project Showcase
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            See the difference our expert team makes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GALLERY_IMAGES.map((item, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden flex flex-col">
              <div className="relative aspect-[4/3]">
                {item.title === 'Asphalt Shingle Replacement' ? (
                   <ImageSlider item={item} />
                ) : (
                   <img src={item.after} alt={item.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
