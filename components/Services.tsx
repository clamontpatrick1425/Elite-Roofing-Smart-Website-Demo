
import React from 'react';
import { SERVICES } from '../constants';

interface ServicesProps {
  onFinancingClick?: () => void;
}

const Services: React.FC<ServicesProps> = ({ onFinancingClick }) => {
  return (
    <section id="services" className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Our Comprehensive Roofing Solutions
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            From emergency repairs to full-scale replacements, we've got your home covered.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {SERVICES.map((service) => {
            const hasFinancing = service.title !== 'Roof Inspection' && service.title !== 'Emergency Tarping';
            return (
              <div
                key={service.title}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/50 mb-6">
                    <service.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
                </div>

                {hasFinancing && (
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                      <span>Financing Available</span>
                      <span className="font-mono">From $189/mo</span>
                    </div>
                    {onFinancingClick && (
                      <button 
                        onClick={onFinancingClick}
                        className="text-left text-xs font-black text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1 group"
                      >
                        Ask about financing
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
