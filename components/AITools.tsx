
import React from 'react';
import { SparkleIcon, CameraIcon, VideoCameraIcon } from './Icon';

interface AIToolsProps {
  onEstimateClick: () => void;
  onDamageAssessorClick: () => void;
  onVisualizerClick: () => void;
}

const AITools: React.FC<AIToolsProps> = ({ onEstimateClick, onDamageAssessorClick, onVisualizerClick }) => {
  return (
    <section id="ai-tools" className="py-16 md:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-100 dark:bg-blue-900/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold mb-4 uppercase tracking-widest">
             <SparkleIcon className="w-4 h-4" />
             <span>Smart Services</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
            Leverage Our AI-Powered Tools
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Get instant insights and project visualizations to plan your perfect roof with zero guesswork.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* AI Estimate Card */}
          <div className="group bg-gray-50 dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <SparkleIcon className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI Project Estimate</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 flex-grow leading-relaxed">Get a transparent, data-driven quote in under 60 seconds based on local material costs.</p>
            <button
              onClick={onEstimateClick}
              className="w-full bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-bold py-4 rounded-2xl border-2 border-blue-50 dark:border-gray-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all shadow-md"
            >
              Get Estimate
            </button>
          </div>

          {/* AI Vision Card */}
          <div className="group bg-gray-50 dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                <VideoCameraIcon className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Project Visualizer</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 flex-grow leading-relaxed">Generate realistic "Before vs After" comparisons to see how different materials look on your home.</p>
            <button
              onClick={onVisualizerClick}
              className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
            >
              Visualize My Roof
            </button>
          </div>

          {/* AI Checkup Card */}
          <div className="group bg-gray-50 dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gray-900 dark:bg-white rounded-3xl flex items-center justify-center text-white dark:text-gray-900 mb-8 shadow-lg group-hover:scale-110 transition-transform">
                <CameraIcon className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI Damage Check</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 flex-grow leading-relaxed">Upload a photo of your current roof for an instant preliminary health and damage report.</p>
            <button
              onClick={onDamageAssessorClick}
              className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-4 rounded-2xl hover:opacity-90 transition-all shadow-md"
            >
              Start Analysis
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AITools;
