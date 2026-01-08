
import React, { useState, useMemo, useEffect } from 'react';
import { FAQ_DATA } from '../constants';
import { XMarkIcon, MagnifyingGlassIcon, ChevronDownIcon } from './Icon';

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FAQModal: React.FC<FAQModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when modal is closed
    if (!isOpen) {
      setSearchTerm('');
      setOpenAccordion(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalTitle = document.title;
    const metaDescriptionTag = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescriptionTag ? metaDescriptionTag.getAttribute('content') : '';

    document.title = 'FAQ | Elite Roofing Solutions';
    if (metaDescriptionTag) {
        metaDescriptionTag.setAttribute('content', 'Find answers to frequently asked questions about roofing repairs, replacement costs, materials, insurance claims, and our white-glove service process.');
    }

    // Cleanup function to restore original values
    return () => {
      document.title = originalTitle;
      if (metaDescriptionTag && originalDescription) {
          metaDescriptionTag.setAttribute('content', originalDescription);
      }
    };
  }, [isOpen]);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return FAQ_DATA;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return FAQ_DATA.map(category => {
      const filteredItems = category.items.filter(
        item =>
          item.question.toLowerCase().includes(lowercasedFilter) ||
          item.answer.toLowerCase().includes(lowercasedFilter)
      );
      return { ...category, items: filteredItems };
    }).filter(category => category.items.length > 0);
  }, [searchTerm]);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };
  
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Knowledge Base</h2>
            <p className="text-gray-600 dark:text-gray-300">Find answers to your questions.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
            <XMarkIcon className="w-7 h-7" />
          </button>
        </header>
        
        <div className="p-5 flex-shrink-0">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions or inquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </div>
        
        <main className="flex-1 overflow-y-auto p-5 space-y-6">
          {filteredData.length > 0 ? (
            filteredData.map(category => (
              <div key={category.category}>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{category.category}</h3>
                <div className="space-y-2">
                  {category.items.map(item => {
                    const id = `${category.category}-${item.question}`;
                    const isAccordionOpen = openAccordion === id;
                    return (
                      <div key={id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                        <button
                          className="w-full flex justify-between items-center text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          onClick={() => toggleAccordion(id)}
                          aria-expanded={isAccordionOpen}
                        >
                          <span className="font-medium text-gray-900 dark:text-gray-100">{item.question}</span>
                          <ChevronDownIcon className={`w-5 h-5 text-gray-500 transform transition-transform ${isAccordionOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${isAccordionOpen ? 'max-h-96' : 'max-h-0'}`}
                        >
                          <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Results Found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Try searching for a different term.</p>
            </div>
          )}
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

export default FAQModal;