import React, { useState } from 'react';
import { generateHeroImage } from '../services/geminiService';
import { SparkleIcon } from './Icon';

interface ImageGeneratorProps {
  onImageGenerated: (imageUrl: string) => void;
  onGenerationStart: () => void;
  onGenerationEnd: () => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onImageGenerated, onGenerationStart, onGenerationEnd }) => {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for the image.');
      return;
    }
    setError('');
    setLoading(true);
    onGenerationStart();
    try {
      const imageUrl = await generateHeroImage(prompt);
      onImageGenerated(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
      onGenerationEnd();
    }
  };

  return (
    <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-white/30 mt-8">
      <h3 className="text-xl font-bold text-center text-white mb-4 flex items-center justify-center gap-2">
        <SparkleIcon className="w-6 h-6" />
        Generate a Custom Hero Image
      </h3>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., a modern suburban house after a rainstorm"
          className="w-full px-4 py-3 rounded-lg text-gray-800 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          disabled={loading}
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 flex-shrink-0 flex items-center justify-center gap-2 disabled:bg-gray-400"
        >
          {loading ? (
            <>
              <span>Generating...</span>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </>
          ) : (
            'Generate'
          )}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-center text-sm font-semibold text-yellow-300">
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageGenerator;
