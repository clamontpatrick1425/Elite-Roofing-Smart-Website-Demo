
import React, { useState } from 'react';
import { SERVICE_AREA_ZIPS } from '../constants';

interface ServiceAreaValidatorProps {
    variant?: 'hero' | 'card';
}

const ServiceAreaValidator: React.FC<ServiceAreaValidatorProps> = ({ variant = 'card' }) => {
  const [zip, setZip] = useState('');
  const [message, setMessage] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [mapSrc, setMapSrc] = useState("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d198320.8430442023!2d-94.73837843615293!3d39.09191900000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c0f75eafe99997%3A0x558525e66aaa51a2!2sKansas%20City%2C%20MO!5e0!3m2!1sen!2sus!4v1709220000000!5m2!1sen!2sus");

  const checkAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.match(/^\d{5}$/)) {
      const isServiced = SERVICE_AREA_ZIPS.includes(zip);
      
      // Update the map to show the pin for the entered zip code
      setMapSrc(`https://maps.google.com/maps?q=${zip}&t=&z=13&ie=UTF8&iwloc=&output=embed`);

      if (isServiced) {
        setMessage(`Great news! We serve the ${zip} area.`);
        setIsValid(true);
      } else {
        setMessage(`We're sorry, we don't currently serve the ${zip} area.`);
        setIsValid(false);
      }
    } else {
      setMessage('Please enter a valid 5-digit zip code.');
      setIsValid(false);
    }
  };

  const isHero = variant === 'hero';

  const containerClasses = isHero
    ? "bg-white/10 backdrop-blur-lg p-2 rounded-2xl shadow-xl border border-white/20"
    : "bg-white dark:bg-gray-800 p-1 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden";

  const innerLayoutClasses = isHero
    ? ""
    : "md:flex md:flex-row";

  const contentSideClasses = isHero
    ? "px-2"
    : "p-8 md:w-1/2 flex flex-col justify-center";

  const titleClasses = isHero
    ? "text-lg font-bold text-center text-white mb-2"
    : "text-xl font-bold text-gray-900 dark:text-white mb-2";

  const descriptionClasses = isHero
    ? "hidden"
    : "text-gray-600 dark:text-gray-400 mb-6";

  const inputClasses = isHero
     ? "w-full px-4 py-3.5 rounded-xl text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-base"
     : "w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow";

  const buttonClasses = isHero
    ? "bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:bg-blue-500 transition-colors duration-300 flex-shrink-0 text-base"
    : "bg-orange-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-orange-600 transition-colors duration-300 flex-shrink-0 w-full sm:w-auto";

  const messageClasses = isHero
      ? (isValid ? 'text-green-300 bg-green-900/40 px-2 py-1 rounded inline-block' : 'text-yellow-300 bg-yellow-900/40 px-2 py-1 rounded inline-block')
      : (isValid ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400');

  return (
    <div className={containerClasses}>
        <div className={innerLayoutClasses}>
            <div className={contentSideClasses}>
                <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                    {!isHero && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600 dark:text-blue-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                    )}
                    {isHero && <span className="text-white text-sm font-medium mr-2">Check availability:</span>}
                    <h3 className={isHero ? "hidden" : titleClasses}>Check Your Location</h3>
                </div>
                
                <p className={descriptionClasses}>
                    Enter your 5-digit ZIP code below for instant confirmation.
                </p>
                
                <form onSubmit={checkAvailability} className={`flex flex-col ${isHero ? 'sm:flex-row' : 'gap-4'} gap-2`}>
                    <input
                        type="text"
                        value={zip}
                        onChange={(e) => {
                            setZip(e.target.value);
                            setMessage('');
                            setIsValid(null);
                        }}
                        placeholder="Enter ZIP Code"
                        className={inputClasses}
                        maxLength={5}
                    />
                    <button type="submit" className={buttonClasses}>
                        {isHero ? 'Check' : 'Check Location'}
                    </button>
                </form>
                {message && (
                    <div className={`${isHero ? 'text-center' : 'text-left'} mt-2`}>
                        <p className={`text-sm font-semibold ${messageClasses}`}>
                            {message}
                        </p>
                    </div>
                )}
            </div>
            
            {!isHero && (
                <div className="md:w-1/2 h-64 md:h-auto min-h-[300px] relative border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700">
                    <iframe 
                        src={mapSrc}
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen={false} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Service Area Map"
                        className="absolute inset-0 w-full h-full object-cover"
                    ></iframe>
                    <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur px-3 py-2 rounded-lg shadow-md text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 pointer-events-none">
                        <p className="font-semibold">Proudly Serving Our Community</p>
                        <p>Greater Kansas City Metro Area</p>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default ServiceAreaValidator;
