
import React from 'react';
import { XMarkIcon } from './Icon';
import Scheduler from './Scheduler';

interface SchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SchedulerModal: React.FC<SchedulerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div 
        className="w-full max-w-2xl relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/30 text-white/70 hover:text-white hover:bg-black/55 hover:scale-105 border border-white/10 transition-all cursor-pointer shadow-lg"
          aria-label="Close scheduling modal"
        >
          <XMarkIcon className="w-5 h-5 text-white" />
        </button>
        <main className="w-full">
          <Scheduler showTitle={false} onBookingConfirmed={onClose} />
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

export default SchedulerModal;
