
import React from 'react';
import { HomeIcon, FacebookIcon, InstagramIcon, XIcon, LinkedInIcon, WhatsAppIcon } from './Icon';
import { SERVICES } from '../constants';

interface FooterProps {
  onScheduleClick: () => void;
  onEstimateClick: () => void;
  onPrivacyPolicyClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onScheduleClick, onEstimateClick, onPrivacyPolicyClick }) => {
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
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Services</h3>
            <ul className="mt-4 space-y-2">
              {SERVICES.map((service) => (
                <li key={service.title}>
                  <a href="#services" className="text-base text-gray-400 hover:text-white transition-colors">
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <button type="button" onClick={onEstimateClick} className="text-base text-left bg-transparent border-none p-0 text-gray-400 hover:text-white transition-colors">
                  AI Estimate
                </button>
              </li>
              <li>
                <button type="button" onClick={onScheduleClick} className="text-base text-left bg-transparent border-none p-0 text-gray-400 hover:text-white transition-colors">
                  Free Inspection
                </button>
              </li>
              <li>
                <button type="button" onClick={onPrivacyPolicyClick} className="text-base text-left bg-transparent border-none p-0 text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
            </ul>
             <h3 className="mt-6 text-sm font-semibold text-gray-200 tracking-wider uppercase">Contact Us</h3>
            <ul className="mt-4 space-y-2 text-gray-400">
              <li>1546 Roofing Ave, Kansas City, MO 64082</li>
              <li>Email: contact@eliteroof.ai</li>
              <li>Phone: (800) 555-ROOF</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8">
            <h3 className="text-center text-sm font-semibold text-gray-200 tracking-wider uppercase">Follow Us</h3>
            <div className="mt-4 flex justify-center space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors" title="Facebook">
                    <span className="sr-only">Facebook</span>
                    <FacebookIcon className="h-7 w-7" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" title="Instagram">
                    <span className="sr-only">Instagram</span>
                    <InstagramIcon className="h-7 w-7" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" title="X.com">
                    <span className="sr-only">X.com</span>
                    <XIcon className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" title="LinkedIn">
                    <span className="sr-only">LinkedIn</span>
                    <LinkedInIcon className="h-7 w-7" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" title="WhatsApp">
                    <span className="sr-only">WhatsApp</span>
                    <WhatsAppIcon className="h-7 w-7" />
                </a>
            </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Elite Roofing Solutions. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
