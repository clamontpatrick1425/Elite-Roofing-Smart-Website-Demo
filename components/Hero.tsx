

import React from 'react';
import { SERVICE_AREA_ZIPS } from '../constants';

// FIX: Moved ServiceAreaValidator component definition before Hero component to fix used-before-declaration error.
const ServiceAreaValidator: React.FC = () => {
  // This is a sub-component, but small enough to co-locate.
  // In a larger app, this would be its own file.
  const [zip, setZip] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isValid, setIsValid] = React.useState<boolean | null>(null);

  const checkAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.match(/^\d{5}$/)) {
      if (SERVICE_AREA_ZIPS.includes(zip)) {
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

  return (
    <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-white/30">
        <h3 className="text-xl font-bold text-center text-white mb-4">Check Service Availability</h3>
        <form onSubmit={checkAvailability} className="flex flex-col sm:flex-row gap-2">
            <input
                type="text"
                value={zip}
                onChange={(e) => {
                    setZip(e.target.value);
                    setMessage('');
                    setIsValid(null);
                }}
                placeholder="Enter your 5-digit ZIP code"
                className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                maxLength={5}
            />
            <button type="submit" className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300 flex-shrink-0">
                Check
            </button>
        </form>
        {message && (
            <p className={`mt-3 text-center text-sm font-semibold ${isValid ? 'text-green-300' : 'text-yellow-300'}`}>
                {message}
            </p>
        )}
    </div>
  );
};

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gray-800 text-white py-20 md:py-32">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('https://picsum.photos/1600/900?image=1059')" }}
      ></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl text-center mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 tracking-tight">
            The Future of Roofing is Here.
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Experience seamless service with our AI-powered tools. Get instant estimates, book appointments online, and protect your home with the best in the business.
          </p>
           <div className="my-8">
            <a
              href="tel:1-800-555-ROOF"
              className="inline-block bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 animate-pulse"
            >
              For 24/7 Emergency Service, Call Now
            </a>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#estimate"
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 text-lg"
            >
              Get a Free Quote
            </a>
            <a
              href="#schedule"
              className="bg-gray-100 text-gray-800 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-105 text-lg"
            >
              Book a Consultation
            </a>
          </div>
        </div>
        <div className="mt-16 max-w-md mx-auto">
          <ServiceAreaValidator />
        </div>
      </div>
    </section>
  );
};

// FIX: Changed default export to Hero component.
export default Hero;