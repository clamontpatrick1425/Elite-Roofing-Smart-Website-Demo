import React, { useState, useRef } from 'react';
import { analyzeRoofImage, analyzeRoofVideo } from '../services/geminiService';
import { CameraIcon } from './Icon';

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    // Split by newlines to process line by line
    const lines = content.split('\n');
    const elements = lines.map((line, index) => {
        // Make text bold
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Create list items for lines starting with * or -
        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
            return <li key={index} className="ml-5 list-disc" dangerouslySetInnerHTML={{ __html: line.replace(/^[\*\-]\s*/, '') }} />;
        }
        if (line.trim() === '') {
            return null; // Don't render empty lines
        }
        // Render other lines as paragraphs
        return <p key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: line }} />;
    });

    return <div className="text-gray-700">{elements}</div>;
};

const DamageAssessor: React.FC = () => {
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
    const [analysis, setAnalysis] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');
            const sizeLimit = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB for video, 10MB for image
            const friendlyLimit = isVideo ? '50MB' : '10MB';

            if (!isImage && !isVideo) {
                setError('Unsupported file type. Please upload an image or a video.');
                return;
            }

            if (file.size > sizeLimit) {
                setError(`File is too large. Please upload a file under ${friendlyLimit}.`);
                return;
            }
            
            setMediaFile(file);
            setMediaType(isImage ? 'image' : 'video');
            setAnalysis('');
            setError('');
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setMediaPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyzeClick = async () => {
        if (!mediaFile) {
            setError('Please select a file first.');
            return;
        }
        setLoading(true);
        setError('');
        setAnalysis('');
        try {
            let result;
            if (mediaType === 'image') {
                result = await analyzeRoofImage(mediaFile);
            } else if (mediaType === 'video') {
                result = await analyzeRoofVideo(mediaFile);
            } else {
                throw new Error("Invalid media type");
            }
            setAnalysis(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setMediaFile(null);
        setMediaPreview(null);
        setMediaType(null);
        setAnalysis('');
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <section id="damage-assessor" className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        AI Roof Condition Checker
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        Upload a photo or video of your roof and let our AI provide a preliminary condition analysis instantly.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto bg-gray-50 p-8 rounded-2xl shadow-xl border border-gray-200">
                    {!mediaPreview ? (
                        <div className="flex flex-col items-center justify-center">
                            <label htmlFor="roof-media-upload" className="w-full flex flex-col items-center px-6 py-10 bg-white text-blue-600 rounded-lg shadow-md border border-blue-200 cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors">
                                <CameraIcon className="w-16 h-16" />
                                <span className="mt-4 text-xl font-semibold">Upload a Photo or Video</span>
                                <span className="mt-1 text-sm text-gray-500">PNG, JPG, MP4, etc. (Max 10MB for images, 50MB for videos)</span>
                                <input id="roof-media-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp, video/mp4, video/quicktime, video/webm" onChange={handleFileChange} ref={fileInputRef} />
                            </label>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Upload</h3>
                                {mediaType === 'image' && <img src={mediaPreview!} alt="Roof preview" className="rounded-lg shadow-md w-full" />}
                                {mediaType === 'video' && <video src={mediaPreview!} controls className="rounded-lg shadow-md w-full" />}
                                
                                <div className="flex gap-2 mt-4">
                                    <button onClick={handleAnalyzeClick} disabled={loading} className="flex-1 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2">
                                        {loading ? 'Analyzing...' : `Analyze My ${mediaType === 'video' ? 'Video' : 'Roof'}`}
                                        {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                    </button>
                                    <button onClick={handleReset} className="bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                                        New Upload
                                    </button>
                                </div>
                            </div>
                            <div className="min-h-[200px]">
                                 <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Analysis</h3>
                                 {loading && (
                                     <div className="flex justify-center items-center h-full bg-gray-100 rounded-lg p-4">
                                         <p className="text-gray-600">Our AI is inspecting your roof...</p>
                                     </div>
                                 )}
                                 {analysis && !loading && (
                                     <>
                                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                                            <MarkdownRenderer content={analysis} />
                                        </div>
                                        <div className="mt-6 text-center">
                                            <p className="font-semibold text-gray-800">Based on this analysis, we recommend a professional inspection.</p>
                                            <a href="#schedule" className="mt-2 inline-block bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
                                                Schedule a Free Inspection Now
                                            </a>
                                        </div>
                                     </>
                                 )}
                                 {!analysis && !loading && (
                                     <div className="flex justify-center items-center h-full bg-gray-100 rounded-lg p-4">
                                        <p className="text-gray-500 text-center">Your analysis will appear here.</p>
                                    </div>
                                 )}
                            </div>
                        </div>
                    )}
                    {error && <p className="mt-4 text-sm text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
                </div>
            </div>
        </section>
    );
};

export default DamageAssessor;