
import React from 'react';
import { ShieldCheckIcon, BoltIcon, CalendarDaysIcon, UserCircleIcon, SparkleIcon } from './Icon';

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      name: 'AI-Powered Precision',
      description: 'Satellite analysis provides 99.9% accurate measurements, eliminating waste and reducing costs.',
      icon: BoltIcon,
    },
    {
      name: 'Instant Estimates',
      description: 'Get a transparent, data-driven quote in seconds—not days—using our real-time pricing engine.',
      icon: CalendarDaysIcon,
    },
    {
      name: 'Expert Craftsmanship',
      description: 'Master roofers with decades of experience, supported by smart tools for perfect installation.',
      icon: UserCircleIcon,
    },
    {
      name: 'Lifetime Warranty',
      description: 'Industry-leading protection on materials and labor, backed by our commitment to quality.',
      icon: ShieldCheckIcon,
    },
  ];

  return (
    <section id="why-choose-us" className="py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-50 dark:bg-blue-800/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-semibold mb-4">
             <SparkleIcon className="w-4 h-4" />
             <span>The Elite Difference</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
            Why Choose Elite Roofing?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            We combine cutting-edge technology with traditional expertise to deliver a superior roofing experience that protects your home for decades.
          </p>
        </div>

        {/* Features Grid - Redesigned as Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <div 
                key={feature.name} 
                className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-7 w-7 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {feature.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* The Elite Roofing Advantage Card - Redesigned (Text Only Center) */}
        <div className="max-w-5xl mx-auto">
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
              {/* Background gradient/pattern for the card */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 pointer-events-none"></div>
              
              <div className="relative p-10 md:p-16 text-center z-10">
                  <div className="max-w-3xl mx-auto">
                        <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
                            The Elite Roofing Advantage
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                            We don't just fix roofs; we upgrade your home's defense system. By utilizing advanced predictive weather modeling and rigorous material selection, we ensure your roof is built to withstand your local climate challenges for generations to come.
                        </p>
                        
                        <div className="bg-white dark:bg-gray-700/50 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 relative inline-block text-left mx-auto max-w-2xl transform hover:scale-[1.02] transition-transform duration-300">
                            <div className="absolute -top-4 -left-2 text-5xl text-blue-200 dark:text-blue-900 font-serif leading-none">"</div>
                            <p className="text-lg font-medium text-gray-800 dark:text-gray-200 italic relative z-10">
                                The most professional and high-tech roofing experience I've ever had. The process was seamless from start to finish.
                            </p>
                            <div className="flex items-center gap-4 mt-6 border-t border-gray-100 dark:border-gray-600 pt-4">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">JT</div>
                                <div>
                                    <p className="text-base font-bold text-gray-900 dark:text-white">James T.</p>
                                    <p className="text-sm text-blue-600 dark:text-blue-400">Homeowner, Kansas City</p>
                                </div>
                            </div>
                        </div>
                  </div>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
