
import React from 'react';
import { XMarkIcon, ShieldCheckIcon, BoltIcon, WrenchScrewdriverIcon } from './Icon';

interface WarrantyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WarrantyModal: React.FC<WarrantyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldCheckIcon className="w-7 h-7 text-blue-600" />
              Elite Protection Warranty
            </h2>
            <p className="text-gray-600 dark:text-gray-300">Industry-leading coverage for your peace of mind.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <XMarkIcon className="w-7 h-7" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-8 text-gray-700 dark:text-gray-300 space-y-8">
          <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                <WrenchScrewdriverIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">10-Year Workmanship Warranty</h3>
                <p className="text-sm leading-relaxed">
                  We stand behind our labor. Elite Roofing Solutions provides a comprehensive 10-year guarantee against any installation defects. If there is an issue related to our craftsmanship, we fix it at zero cost to you.
                </p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-gray-100 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
              <BoltIcon className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Manufacturer Warranty</h4>
              <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                As certified installers for GAF and Owens Corning, we provide Lifetime Limited Warranties on all premium architectural shingles. This covers material defects for as long as you own your home.
              </p>
            </div>
            <div className="p-6 border border-gray-100 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
              <ShieldCheckIcon className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Transferable Coverage</h4>
              <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                Selling your home? Our workmanship warranty is fully transferable