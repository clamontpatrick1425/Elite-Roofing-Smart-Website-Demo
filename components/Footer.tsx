
import React from 'react';
import { HomeIcon } from './Icon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <HomeIcon className="h-8 w-8 text-blue-500" />
              <span className="font-bold text-xl">Elite Roofing Solutions</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Combining innovative AI technology with decades of roofing expertise to provide unparalleled service and quality for your home.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#services" className="text-base text-gray-400 hover:text-white">Services</a></li>
              <li><a href="#estimate" className="text-base text-gray-400 hover:text-white">AI Estimate</a></li>
              <li><a href="#schedule" className="text-base text-gray-400 hover:text-white">Schedule</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Contact Us</h3>
            <ul className="mt-4 space-y-2 text-gray-400">
              <li>123 Roofing Ave, Beverly Hills, CA 90210</li>
              <li>Email: contact@eliteroof.ai</li>
              <li>Phone: (800) 555-ROOF</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Elite Roofing Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
