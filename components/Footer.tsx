
import React from 'react';
import { FacebookIcon, InstagramIcon, LinkedInIcon } from './Icon';

interface FooterProps {
  onScheduleClick: () => void;
  onEstimateClick: () => void;
  onPrivacyPolicyClick: () => void;
}

const YoutubeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const Footer: React.FC<FooterProps> = ({ onScheduleClick, onEstimateClick, onPrivacyPolicyClick }) => {
  const openWarrantyPopup = () => {
    const width = 1100;
    const height = 850;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    window.open(
        '/warranty.html', 
        'EliteRoofingWarranty', 
        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes,location=no,status=no`
    );
  };

  return (
    <footer className="bg-[#0f172a] text-white relative">
      {/* Top Blue Bar */}
      <div className="h-2 w-full bg-blue-700"></div>

      <div className="container mx-auto py-16 px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          {/* Services Column */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-100">Services</h3>
            <ul className="space-y-3">
              <li><button onClick={onScheduleClick} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Free Roof Inspection</button></li>
              <li><a href="#services" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Residential</a></li>
              <li><a href="#services" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Commercial</a></li>
              <li><a href="#services" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Roof Repair</a></li>
            </ul>
          </div>

          {/* About Us Column */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-100">About Us</h3>
            <ul className="space-y-3">
              <li><button className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Who We Are</button></li>
              <li><button className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Locations</button></li>
              <li><button className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Customer Reviews</button></li>
              <li><button className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Community Support</button></li>
              <li><button className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Roof Rescue Program</button></li>
              <li><button className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Careers</button></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-100">Resources</h3>
            <ul className="space-y-3">
              <li><button onClick={onEstimateClick} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Financing</button></li>
              <li><button onClick={openWarrantyPopup} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Warranty</button></li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-100">Connect</h3>
            <ul className="space-y-6">
              <li><button className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Contact Us</button></li>
              <li className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded bg-blue-700 flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg" aria-label="Facebook">
                    <FacebookIcon className="h-5 w-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 rounded bg-blue-700 flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg" aria-label="Instagram">
                    <InstagramIcon className="h-5 w-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 rounded bg-blue-700 flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg" aria-label="LinkedIn">
                    <LinkedInIcon className="h-5 w-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 rounded bg-blue-700 flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg" aria-label="YouTube">
                    <YoutubeIcon className="h-5 w-5 text-white" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Large Logo Block */}
        <div className="flex flex-col items-center justify-center pt-10">
          <div className="flex flex-col items-center gap-2 group cursor-default">
             <div className="flex items-center">
                {/* Visual M logo approximation */}
                <div className="relative w-16 h-12 flex items-center justify-center">
                    <div className="absolute left-0 bottom-0 w-3 h-full bg-blue-600 transform -skew-x-12"></div>
                    <div className="absolute left-4 top-0 w-3 h-full bg-white transform skew-x-12"></div>
                    <div className="absolute right-4 top-0 w-3 h-full bg-blue-600 transform -skew-x-12"></div>
                    <div className="absolute right-0 bottom-0 w-3 h-full bg-white transform skew-x-12"></div>
                </div>
                <div className="ml-3 flex flex-col justify-center leading-none">
                    <span className="text-4xl font-black text-blue-600 tracking-tighter uppercase italic">Midwest</span>
                    <span className="text-5xl font-black text-white tracking-tighter uppercase leading-[0.8] italic -mt-1">Roofing</span>
                </div>
             </div>
          </div>
          <div className="mt-8 text-center text-xs text-gray-500 font-bold uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} Midwest Roofing
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
