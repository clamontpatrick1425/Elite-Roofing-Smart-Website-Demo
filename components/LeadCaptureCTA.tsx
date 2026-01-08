
import React from 'react';
import { ChatBubbleOvalLeftEllipsisIcon } from './Icon';

interface LeadCaptureCTAProps {
  onContactClick: () => void;
}

const LeadCaptureCTA: React.FC<LeadCaptureCTAProps> = ({ onContactClick }) => {
  return (
    <section id="contact-cta" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
            <ChatBubbleOvalLeftEllipsisIcon className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Ready to Start Your Project?
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Have questions or need a detailed quote? Our team is here to help. Click below to fill out our contact form, and we'll get back to you promptly.
            </p>
            <div className="mt-8">
              <button
                onClick={onContactClick}
                className="inline-block bg-blue-600 text-white font-bold py-4 px-10 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 text-lg"
              >
                Get a Free Quote
              </button>
            </div>
        </div>
      </div>
    </section>
  );
};

export default LeadCaptureCTA;