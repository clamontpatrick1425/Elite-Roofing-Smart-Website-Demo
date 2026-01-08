

import React from 'react';
import { SparkleIcon, CameraIcon } from './Icon';

interface AIToolsProps {
  onEstimateClick: () => void;
  onDamageAssessorClick: () => void;
}

const AITools: React.FC<AIToolsProps> = ({ onEstimateClick, onDamageAssessorClick }) => {
  return (
    <section id="ai-tools" className="py-8 md:py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Leverage Our AI-Powered Tools
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Get instant insights and estimates for your roofing project.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* AI Estimate Card */}
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out flex flex-col items-center text-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/50 mb-6">
                <SparkleIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Instant AI-Powered Estimate</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">Answer a few questions to get a real-time, data-driven estimate for your project in under 60 seconds.</p>
            <button
              onClick={onEstimateClick}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Get Estimate
            </button>
          </div>
          {/* AI Checkup Card */}
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out flex flex-col items-center text-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/50 mb-6">
                <CameraIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">AI Roof Condition Checker</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">Upload a photo or video of your roof and let our AI provide a preliminary condition analysis instantly.</p>
            <button
              onClick={onDamageAssessorClick}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Start Checkup
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AITools;