
import React from 'react';
import { FacebookIcon, InstagramIcon, LinkedInIcon, HomeIcon } from './Icon';

interface FooterProps {
  onScheduleClick: () => void;
  onEstimateClick: () => void;
  onPrivacyPolicyClick: () => void;
  onAboutUsClick: () => void;
  onStormDamageClick?: () => void;
  onFinancingClick?: () => void;
}

const YoutubeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const Footer: React.FC<FooterProps> = ({ onScheduleClick, onEstimateClick, onPrivacyPolicyClick, onAboutUsClick, onStormDamageClick, onFinancingClick }) => {
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

      <div className="container mx-auto py-20 px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">
          {/* Services Column */}
          <div>
            <h3 className="text-3xl font-bold mb-8 text-gray-100">Services</h3>
            <ul className="space-y-4">
              <li><button onClick={onScheduleClick} className="text-gray-300 hover:text-white transition-colors text-xl font-medium">Free Roof Inspection</button></li>
              <li><a href="#services" className="text-gray-300 hover:text-white transition-colors text-xl font-medium">Residential</a></li>
              <li><a href="#services" className="text-gray-300 hover:text-white transition-colors text-xl font-medium">Commercial</a></li>
              <li><a href="#services" className="text-gray-300 hover:text-white transition-colors text-xl font-medium">Roof Repair</a></li>
              {onStormDamageClick && (
                <li><button onClick={onStormDamageClick} className="text-gray-300 hover:text-white text-left transition-colors text-xl font-medium">Storm Damage Restoration</button></li>
              )}
            </ul>
          </div>

          {/* About Us Column */}
          <div>
            <h3 className="text-3xl font-bold mb-8 text-gray-100">About Us</h3>
            <ul className="space-y-4">
              <li><button onClick={onAboutUsClick} className="text-gray-300 hover:text-white transition-colors text-xl font-medium">Who We Are</button></li>
              <li><button className="text-gray-300 hover:text-white transition-colors text-xl font-medium">Locations</button></li>
              <li><button className="text-gray-300 hover:text-white transition-colors text-xl font-medium">Customer Reviews</button></li>
              <li><button className="text-gray-300 hover:text-white transition-colors text-xl font-medium">Community Support</button></li>
              <li><button className="text-gray-300 hover:text-white transition-colors text-xl font-medium">Roof Rescue Program</button></li>
              <li><button className="text-gray-300 hover:text-white transition-colors text-xl font-medium">Careers</button></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-3xl font-bold mb-8 text-gray-100">Resources</h3>
            <ul className="space-y-4">
              <li><button onClick={onFinancingClick || onEstimateClick} className="text-gray-300 hover:text-white transition-colors text-xl font-medium">Financing</button></li>
              <li><button onClick={openWarrantyPopup} className="text-gray-300 hover:text-white transition-colors text-xl font-medium">Warranty</button></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-3xl font-black mb-8 text-white uppercase tracking-widest">CONTACT US</h3>
            <div className="space-y-6 text-xl text-gray-300">
                <div>
                    <p className="mb-3 font-medium">1546 Roofing Ave, Kansas City, MO 64082</p>
                    <p className="mb-3">Email: <a href="mailto:contact@eliteroof.ai" className="hover:text-white transition-colors">contact@eliteroof.ai</a></p>
                    <p>Phone: <a href="tel:8005557663" className="hover:text-white transition-colors">(800) 555-ROOF</a></p>
                </div>
                <div className="flex gap-4 mt-6">
                    <a href="#" className="w-12 h-12 rounded bg-blue-700 flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg" aria-label="Facebook">
                        <FacebookIcon className="h-6 w-6 text-white" />
                    </a>
                    <a href="#" className="w-12 h-12 rounded bg-blue-700 flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg" aria-label="Instagram">
                        <InstagramIcon className="h-6 w-6 text-white" />
                    </a>
                    <a href="#" className="w-12 h-12 rounded bg-blue-700 flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg" aria-label="LinkedIn">
                        <LinkedInIcon className="h-6 w-6 text-white" />
                    </a>
                    <a href="#" className="w-12 h-12 rounded bg-blue-700 flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg" aria-label="YouTube">
                        <YoutubeIcon className="h-6 w-6 text-white" />
                    </a>
                </div>
            </div>
          </div>
        </div>

        {/* Large Logo Block */}
        <div className="flex flex-col items-center justify-center pt-12 pb-12">
          <div className="flex items-center gap-4">
             <HomeIcon className="h-16 w-16 text-blue-500" />
             <div className="flex flex-col">
                <span className="font-bold text-5xl text-white leading-none">Elite Roofing</span>
                <span className="text-sm text-gray-400 uppercase tracking-widest mt-1">Midwest Premier Service</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
