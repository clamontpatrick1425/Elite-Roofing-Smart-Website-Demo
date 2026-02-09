
import React, { useState, useRef } from 'react';
import { XMarkIcon, SparkleIcon, ArrowPathIcon, CameraIcon } from './Icon';
import { generateComparisonImage } from '../services/geminiService';

interface ProjectVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProjectVisualizerModal: React.FC<ProjectVisualizerModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('Old weathered gray shingles vs Brand new charcoal architectural shingles');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadedImage(reader.result as string);
            // Update default prompt if image is uploaded to be more relevant
            if (prompt === 'Old weathered gray shingles vs Brand new charcoal architectural shingles') {
                setPrompt('Replace existing roof with premium slate tiles');
            }
        };
        reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const url = await generateComparisonImage(prompt, uploadedImage || undefined);
      setGeneratedImage(url);
    } catch (err: any) {
      let msg = err.message || "Failed to generate visual.";
      if (msg === 'QUOTA_EXHAUSTED') msg = 'High traffic: AI capacity reached. Please try again momentarily.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'elite-roof-comparison.png';
    link.click();
  };

  const handleClearUpload = (e: React.MouseEvent) => {
      e.stopPropagation();
      setUploadedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-modal-enter" onClick={e => e.stopPropagation()}>
        <header className="p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <SparkleIcon className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">AI Project Visualizer</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">See your home's future transformation instantly.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
            <XMarkIcon className="w-8 h-8" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex flex-col gap-8 h-full">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Upload Area */}
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative w-full sm:w-32 h-24 sm:h-auto flex-shrink-0 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${uploadedImage ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}
                >
                    {uploadedImage ? (
                        <>
                            <img src={uploadedImage} alt="Reference" className="w-full h-full object-cover rounded-xl opacity-80" />
                            <button 
                                onClick={handleClearUpload}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors z-10"
                                title="Remove photo"
                            >
                                <XMarkIcon className="w-3 h-3" />
                            </button>
                        </>
                    ) : (
                        <>
                            <CameraIcon className="w-6 h-6 text-gray-400 mb-1" />
                            <span className="text-[10px] text-gray-500 font-bold text-center leading-tight">Upload<br/>Photo</span>
                        </>
                    )}
                    <input 
                        ref={fileInputRef} 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange} 
                    />
                </div>

                {/* Text Prompt */}
                <div className="flex-1 flex flex-col gap-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        {uploadedImage ? "Desired Transformation" : "Comparison Prompt"}
                    </label>
                    <textarea 
                        value={prompt} 
                        onChange={e => setPrompt(e.target.value)}
                        placeholder={uploadedImage ? "e.g. Change roof to black metal standing seam" : "Describe Before vs After (e.g., Old brown tile vs Black Metal)"}
                        className="w-full h-24 sm:h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all shadow-sm resize-none"
                    />
                </div>

                {/* Generate Button */}
                <button 
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 self-stretch"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Rendering...
                    </>
                  ) : (
                    <>
                      <SparkleIcon className="w-5 h-5" />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-[400px] bg-white dark:bg-gray-800 rounded-[2rem] border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center relative overflow-hidden shadow-inner">
              {generatedImage ? (
                <div className="w-full h-full animate-fade-in group">
                  <img src={generatedImage} alt="AI Comparison" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button onClick={handleDownload} className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl">Download Image</button>
                    <button onClick={handleGenerate} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl">Regenerate</button>
                  </div>
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Before / After Comparison</div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-center p-8 opacity-40">
                  <SparkleIcon className="w-16 h-16 text-blue-600 mb-2" />
                  <p className="text-sm font-medium">Your transformation preview will appear here.<br/>Try uploading a photo or typing a scenario.</p>
                </div>
              )}
              {isLoading && (
                <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 animate-fade-in">
                  <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce">
                    <SparkleIcon className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-bold text-lg dark:text-white">AI is painting your vision...</p>
                </div>
              )}
            </div>
            
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0"><XMarkIcon className="w-4 h-4" /></div>
                {error}
              </div>
            )}
          </div>
        </main>
      </div>
      <style>{`
        @keyframes modal-enter {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-modal-enter {
          animation: modal-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ProjectVisualizerModal;
