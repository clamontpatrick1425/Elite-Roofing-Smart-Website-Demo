
import React, { useState, useRef, useEffect } from 'react';
import { HomeIcon, XMarkIcon, ChevronDownIcon, MicrophoneIcon, SparkleIcon, CameraIcon, VideoCameraIcon } from './Icon';
import { SERVICES, GALLERY_IMAGES } from '../constants';
import { GalleryImage } from '../types';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onFaqClick: () => void;
  onEstimateClick: () => void;
  onDamageAssessorClick: () => void;
  onAboutUsClick: () => void;
  onScheduleClick: () => void;
  onContactClick: () => void;
  onGalleryItemClick: (item: GalleryImage) => void;
  onVoiceAgentClick: () => void;
  onAuditClick: () => void;
  onVeoStudioClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
    onFaqClick, 
    onEstimateClick, 
    onDamageAssessorClick, 
    onAboutUsClick, 
    onScheduleClick, 
    onContactClick, 
    onGalleryItemClick, 
    onVoiceAgentClick,
    onAuditClick,
    onVeoStudioClick
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isGalleryDropdownOpen, setIsGalleryDropdownOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const galleryDropdownRef = useRef<HTMLDivElement>(null);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node)) {
        setIsServicesDropdownOpen(false);
      }
      if (galleryDropdownRef.current && !galleryDropdownRef.current.contains(event.target as Node)) {
        setIsGalleryDropdownOpen(false);
      }
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target as Node)) {
        setIsToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    if (e.currentTarget.tagName === 'A') e.preventDefault();
    setIsMenuOpen(false);
    setIsServicesDropdownOpen(false);
    setIsGalleryDropdownOpen(false);
    setIsToolsDropdownOpen(false);

    if (href === '#faq') { onFaqClick(); return; }
    if (href === '#estimate') { onEstimateClick(); return; }
    if (href === '#damage-assessor') { onDamageAssessorClick(); return; }
    if (href === '#design-studio') { onVeoStudioClick(); return; }
    if (href === '#about-us') { onAboutUsClick(); return; }
    if (href === '#schedule') { onScheduleClick(); return; }
    if (href === '#contact') { onContactClick(); return; }

    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleGalleryItemClick = (item: GalleryImage) => {
    setIsMenuOpen(false);
    setIsGalleryDropdownOpen(false);
    onGalleryItemClick(item);
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-24 md:h-28 bg-white/95 dark:bg-gray-950/98 backdrop-blur-2xl shadow-lg dark:shadow-none dark:border-b dark:border-gray-800/50 flex items-center transition-all duration-300">
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="#" onClick={(e) => handleNavClick(e, '#')} className="flex-shrink-0 flex items-center gap-3 group">
              <HomeIcon className="h-11 w-11 text-blue-600 dark:text-blue-500 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col">
                <span className="font-bold text-3xl text-gray-800 dark:text-gray-50 leading-none">Elite Roofing</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">Midwest Premier Service</span>
              </div>
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex lg:items-center">
              <nav className="flex items-center space-x-4">
                {/* Tools Dropdown */}
                <div className="relative" ref={toolsDropdownRef}>
                    <button 
                        onClick={() => setIsToolsDropdownOpen(prev => !prev)}
                        className="text-gray-600 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 px-3 py-2 rounded-md text-lg font-black uppercase tracking-wider flex items-center gap-1.5"
                    >
                        Tools
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isToolsDropdownOpen && (
                        <div className="absolute top-full mt-2 w-72 bg-white dark:bg-gray-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black ring-opacity-5 dark:ring-white/10 z-50 py-3 animate-fade-in-down border dark:border-gray-800">
                            <button onClick={(e) => handleNavClick(e, '#damage-assessor')} className="w-full text-left px-6 py-4 text-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3">
                                <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <CameraIcon className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold">AI Checkup</span>
                                    <span className="text-xs opacity-60">Upload photos for analysis</span>
                                </div>
                            </button>
                            <button onClick={(e) => handleNavClick(e, '#estimate')} className="w-full text-left px-6 py-4 text-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3">
                                <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    <SparkleIcon className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold">AI Estimate</span>
                                    <span className="text-xs opacity-60">Instant pricing breakdown</span>
                                </div>
                            </button>
                            <button onClick={(e) => handleNavClick(e, '#design-studio')} className="w-full text-left px-6 py-4 text-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3">
                                <div className="w-9 h-9 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                                    <VideoCameraIcon className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold">Design Studio</span>
                                    <span className="text-xs opacity-60">Animate your roof vision</span>
                                </div>
                            </button>
                        </div>
                    )}
                </div>

                <div className="relative" ref={servicesDropdownRef}>
                    <button 
                        onClick={() => setIsServicesDropdownOpen(prev => !prev)}
                        className="text-gray-600 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 px-3 py-2 rounded-md text-lg font-semibold flex items-center gap-1"
                    >
                        Services
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isServicesDropdownOpen && (
                        <div className="absolute top-full mt-2 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 dark:ring-white/10 z-50 py-2 animate-fade-in-down border dark:border-gray-800">
                            {SERVICES.map(service => (
                                <button 
                                    key={service.title}
                                    onClick={(e) => handleNavClick(e, '#services')}
                                    className="w-full text-left px-6 py-4 text-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-3"
                                >
                                    <service.icon className="w-5 h-5" />
                                    {service.title}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative" ref={galleryDropdownRef}>
                    <button 
                        onClick={() => setIsGalleryDropdownOpen(prev => !prev)}
                        className="text-gray-600 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 px-3 py-2 rounded-md text-lg font-semibold flex items-center gap-1"
                    >
                        Gallery
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isGalleryDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isGalleryDropdownOpen && (
                        <div className="absolute top-full mt-2 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 dark:ring-white/10 z-50 py-2 animate-fade-in-down border dark:border-gray-800">
                            {GALLERY_IMAGES.map(item => (
                                <button
                                    key={item.title} 
                                    onClick={() => handleGalleryItemClick(item)}
                                    className="w-full text-left block px-6 py-4 text-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    {item.title}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <a href="#about-us" onClick={(e) => handleNavClick(e, '#about-us')} className="text-gray-600 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 px-3 py-2 rounded-md text-lg font-semibold">About</a>
                <a href="#schedule" onClick={(e) => handleNavClick(e, '#schedule')} className="text-gray-600 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 px-3 py-2 rounded-md text-lg font-semibold">Inspection</a>
                <button onClick={() => onContactClick()} className="text-gray-600 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 px-3 py-2 rounded-md text-lg font-semibold">Contact</button>
              </nav>
              
              <div className="ml-6 flex items-center gap-4 border-l pl-6 border-gray-200 dark:border-gray-800">
                <button
                    onClick={onVoiceAgentClick}
                    className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2 text-base uppercase tracking-wider"
                >
                    <MicrophoneIcon className="w-5 h-5" />
                    <span>Call Now</span>
                </button>
                <ThemeToggle />
              </div>
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-gray-600 dark:text-gray-400">
              {isMenuOpen ? <XMarkIcon className="h-8 w-8" /> : <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>}
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-1 bg-blue-600 transition-all duration-100 ease-out" style={{ width: `${scrollProgress}%` }} />
    </header>
  );
};

export default Header;
