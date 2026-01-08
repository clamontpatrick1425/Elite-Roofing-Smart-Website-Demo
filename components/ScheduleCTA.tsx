
import React from 'react';
import { CalendarDaysIcon } from './Icon';

interface ScheduleCTAProps {
  onScheduleClick: () => void;
  id?: string | null;
}

const ScheduleCTA: React.FC<ScheduleCTAProps> = ({ onScheduleClick, id = "schedule" }) => {
  return (
    <section {...(id ? {id: id} : {})} className="py-16 md:py-24 bg-blue-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
            <CalendarDaysIcon className="w-16 h-16 mx-auto text-white/80 mb-4" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Ready for a Professional Opinion?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Book your free, no-obligation roof inspection today. Our experts are ready to provide a thorough assessment and answer all your questions.
            </p>
            <div className="mt-8">
              <button
                onClick={onScheduleClick}
                className="inline-block bg-white text-blue-600 font-bold py-4 px-10 rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-lg"
              >
                Schedule Your Free Inspection
              </button>
            </div>
        </div>
      </div>
    </section>
  );
};

export default ScheduleCTA;