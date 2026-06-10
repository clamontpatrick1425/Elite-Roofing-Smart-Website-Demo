
import React, { useState } from 'react';
import { getAIEstimate } from '../services/geminiService';
import { EstimateFormData } from '../types';

type EstimateResult = {
  lowEstimate: number;
  highEstimate: number;
  explanation: string;
  weather?: {
    locationName: string;
    temperatureF: number | null;
    windMph: number | null;
    precipitation: number | null;
    humidity: number | null;
  } | null;
};

interface EstimateCalculatorProps {
  onScheduleClick: () => void;
}

const EstimateCalculator: React.FC<EstimateCalculatorProps> = ({ onScheduleClick }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<EstimateFormData>({
    roofType: 'Asphalt Shingle',
    sqft: '2000',
    slope: 'Standard (4/12 - 8/12)',
    stories: '1 Story',
    zipCode: '',
    email: '',
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<EstimateResult | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };
  
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const aistudio = (window as any).aistudio;
    if (aistudio && !(await aistudio.hasSelectedApiKey())) {
        await aistudio.openSelectKey();
        return;
    }

    setError('');
    setLoading(true);
    setResult(null);
    try {
      const estimate = await getAIEstimate(formData);
      setResult(estimate);
      setStep(4);
    } catch (err) {
      let msg = err instanceof Error ? err.message : 'An unknown error occurred.';
      if (msg === 'QUOTA_EXHAUSTED') msg = 'High traffic: AI capacity reached. Please try again momentarily.';
      setError(msg);
      setStep(3); // stay on contact info step to show error
    } finally {
      setLoading(false);
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Roof Details</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="roofType" className="block text-sm font-medium text-gray-700">Primary Roof Material</label>
                <select id="roofType" name="roofType" value={formData.roofType} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                  <option>Asphalt Shingle</option>
                  <option>Tile (Clay/Concrete)</option>
                  <option>Metal</option>
                  <option>Flat Roof (TPO/EPDM)</option>
                  <option>Wood Shake</option>
                </select>
              </div>
              <div>
                <label htmlFor="sqft" className="block text-sm font-medium text-gray-700">Estimated Square Footage</label>
                <input type="number" name="sqft" id="sqft" value={formData.sqft} onChange={handleChange} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2" placeholder="e.g., 2000" />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Property Details</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="slope" className="block text-sm font-medium text-gray-700">Roof Slope (Pitch)</label>
                <select id="slope" name="slope" value={formData.slope} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                  <option>Standard (4/12 - 8/12)</option>
                  <option>Low Slope (2/12 - 4/12)</option>
                  <option>Steep Slope (9/12+)</option>
                </select>
              </div>
              <div>
                <label htmlFor="stories" className="block text-sm font-medium text-gray-700">Number of Stories</label>
                <select id="stories" name="stories" value={formData.stories} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                  <option>1 Story</option>
                  <option>2 Stories</option>
                  <option>3+ Stories</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Final Details</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Project ZIP Code</label>
                <input type="text" name="zipCode" id="zipCode" value={formData.zipCode} onChange={handleChange} required className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2" placeholder="e.g., 90210" maxLength={5} />
              </div>
               <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2" placeholder="you@example.com" />
                 <p className="mt-1 text-xs text-gray-500">Required to view your free estimate.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Upload Photos (Optional)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" title="Upload a file or drag and drop" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"><p>Upload a file</p><input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" /></label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">{uploadedFile ? uploadedFile.name : 'PNG, JPG up to 10MB'}</p>
                  </div>
                </div>
              </div>
            </div>
             {error && <p className="mt-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
          </div>
        );
      case 4:
        return (
          <div className="text-center" id="appointment-confirmation">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Your AI-Powered Estimate</h3>
            <p className="text-gray-600 mb-6 no-print">This is a preliminary estimate. A firm quote requires an on-site inspection.</p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg text-left shadow-sm">
                <div className="flex justify-center items-baseline gap-2 sm:gap-4 mb-4">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-900">
                    ${result?.lowEstimate.toLocaleString()}
                  </span>
                  <span className="text-xl sm:text-2xl font-semibold text-gray-500 font-light">to</span>
                  <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-900">
                    ${result?.highEstimate.toLocaleString()}
                  </span>
                </div>

                {/* Weather details container */}
                {result?.weather && (
                  <div className="mb-4 p-4 bg-white border border-blue-200/60 rounded-xl shadow-sm">
                    <h4 className="font-bold text-blue-950 flex items-center gap-1.5 text-sm sm:text-base mb-2">
                       <span>🌤️ Climate Adaptations Activated</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed">
                       This estimate is dynamically optimized based on real-time climate data for <strong>{result.weather.locationName}</strong>:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
                       <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                          <span className="block text-gray-500 text-[10px] uppercase font-semibold">Temperature</span>
                          <span className="font-bold text-blue-900">{result.weather.temperatureF !== null ? `${result.weather.temperatureF}°F` : 'N/A'}</span>
                       </div>
                       <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                          <span className="block text-gray-500 text-[10px] uppercase font-semibold">Wind Speed</span>
                          <span className="font-bold text-blue-900">{result.weather.windMph !== null ? `${result.weather.windMph} mph` : 'N/A'}</span>
                       </div>
                       <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                          <span className="block text-gray-500 text-[10px] uppercase font-semibold">Precipitation</span>
                          <span className="font-bold text-blue-900">{result.weather.precipitation !== null ? `${result.weather.precipitation} mm` : '0 mm'}</span>
                       </div>
                       <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                          <span className="block text-gray-500 text-[10px] uppercase font-semibold">Humidity</span>
                          <span className="font-bold text-blue-900">{result.weather.humidity !== null ? `${result.weather.humidity}%` : 'N/A'}</span>
                       </div>
                    </div>
                  </div>
                )}
                
                <div className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line border-t border-gray-150 pt-4 mt-2">
                  {result?.explanation}
                </div>
            </div>

            <p className="mt-6 text-lg font-semibold no-print">Ready for the next step?</p>
            <div className="mt-3 flex flex-col sm:flex-row gap-3 justify-center items-center no-print">
              <button
                type="button"
                onClick={onScheduleClick}
                className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                  Schedule Free Inspection
              </button>
              
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.615 0-1.101-.483-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-14.326 0C3.768 7.44 3 8.375 3 9.456V15.75a2.25 2.25 0 002.25 2.25h1.091M9 9h6m-6 3h6m-6-6h6" />
                  </svg>
                  <span>Print Estimate</span>
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const progress = (step / (result ? 4 : 3)) * 100;
  
  return (
    <>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 text-center mb-12 no-print">
        Answer a few questions to get a real-time, data-driven estimate for your roofing project in under 60 seconds.
      </p>
      
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        {step <= 3 && (
          <div className="mb-8">
              <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                      <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"></div>
                  </div>
              </div>
              <p className="text-center text-sm text-gray-600 font-medium">Step {step} of 3</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {renderStep()}
          
          <div className={`mt-8 flex justify-between items-center ${step === 4 ? 'no-print' : ''}`}>
            {step > 1 && step < 4 && (
              <button type="button" onClick={prevStep} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                Back
              </button>
            )}
            {step < 3 && (
              <button type="button" onClick={nextStep} className="ml-auto bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Next
              </button>
            )}
            {step === 3 && (
              <button type="submit" disabled={loading} className="ml-auto bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center gap-2">
                {loading ? (
                  <>
                    <span>Generating...</span>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </>
                ) : (
                  'Get My Estimate'
                )}
              </button>
            )}
            {step === 4 && (
              <button type="button" onClick={() => { setStep(1); setResult(null); }} className="mx-auto bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                Start New Estimate
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default EstimateCalculator;
