
import React from 'react';
import { XMarkIcon } from './Icon';
import DamageAssessor from './DamageAssessor';

interface DamageAssessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleClick: () => void;
}

const DamageAssessorModal: React.FC<DamageAssessorModalProps> = ({ isOpen, onClose, onScheduleClick }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-5 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">AI Roof Condition Checker</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors">
            <XMarkIcon className="w-7 h-7" />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <DamageAssessor onScheduleClick={onScheduleClick} />
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

export default DamageAssessorModal;
