
import React from 'react';
import { XMarkIcon, ShieldCheckIcon, HomeIcon } from './Icon';

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutUsModal: React.FC<AboutUsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <HomeIcon className="w-7 h-7 text-blue-600" />
              About Elite Roofing Solutions
            </h2>
            <p className="text-gray-600 dark:text-gray-300">Our Story, Our Mission, Your Peace of Mind.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
            <XMarkIcon className="w-7 h-7" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-8 text-gray-700 dark:text-gray-300 space-y-8">
          <section>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              Our Synopsis
            </h3>
            <p>
              Elite Roofing Solutions is where time-honored craftsmanship meets tomorrow's technology. Founded in 2015, we are a forward-thinking roofing company dedicated to providing homeowners with a service that is as durable and reliable as the roofs we build. By integrating innovative AI tools with hands-on expertise, we've revolutionized the customer experience, delivering unparalleled transparency, efficiency, and quality from start to finish.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              Our History
            </h3>
            <p className="mb-4">
              Our founder, Johnathan Masters, a third-generation roofer, established Elite Roofing Solutions with a clear vision: to modernize an industry ripe for change. Growing up in the trade, he witnessed firsthand the common frustrations homeowners faced—unpredictable timelines, confusing quotes, and poor communication.
            </p>
            <p>
              Determined to build a better company, he started with a small, dedicated crew focused on impeccable workmanship and customer-centric service. As our reputation grew, so did our ambition. In recent years, we embraced artificial intelligence not to replace our core values, but to amplify them, leading to the development of our industry-leading AI Estimate, Damage Assessment, and 24/7 AI Concierge services.
            </p>
          </section>

          <section className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-6 rounded-r-lg">
             <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
                Our Mission Statement
            </h3>
            <blockquote className="italic text-lg text-blue-900 dark:text-blue-200 font-medium">
              "To protect homes and empower homeowners by delivering exceptional roofing solutions with unparalleled transparency, efficiency, and craftsmanship. We leverage innovative technology not to replace the human touch, but to enhance it, ensuring every client receives a seamless, stress-free experience from the initial consultation to the final inspection."
            </blockquote>
          </section>
        </main>
      </div>
      <style>{`
        @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px) scale(0.98); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AboutUsModal;