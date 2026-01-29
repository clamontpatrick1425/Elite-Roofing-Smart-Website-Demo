
import React, { useState, useRef, useEffect } from 'react';
import { HomeIcon, XMarkIcon, ChevronDownIcon, MicrophoneIcon, SparkleIcon } from './Icon';
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const galleryDropdownRef = useRef<HTMLDivElement>(null);

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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { href: '#damage-assessor', label: 'AI Checkup' },
    { href: '#estimate', label: 'AI Estimate' },
    { href: '#design-studio', label: 'Design Studio', isHighlight: true },
    { href: '#schedule', label: 'Free Inspection' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contact', label: 'Contact' },
  ];

  const serviceLinks = SERVICES.map(service => ({
      label: service.title,
      href: '#services'
  }));

  const galleryLinks = GALLERY_IMAGES.map(item => ({
      label: item.title,
      item: item,
  }));

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setIsServicesDropdownOpen(false);
    setIsGalleryDropdownOpen(false);

    if (href === '#faq') {
      onFaqClick();
      return;
    }
    
    if (href === '#estimate') {
      onEstimateClick();
      return;
    }

    if (href === '#damage-assessor') {
      onDamageAssessorClick();
      return;
    }

    if (href === '#design-studio') {
      onVeoStudioClick();
      return;
    }

    if (href === '#about-us') {
      onAboutUsClick();
      return;
    }

    if (href === '#schedule') {
        onScheduleClick();
        return;
    }
    
    if (href === '#contact') {
        onContactClick();
        return;
    }

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
  
  const MobileServicesMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="flex items-center justify-between block text-center text-base font-semibold text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400 w-full py-3 px-4 rounded-xl transition-colors"
            >
                <span>Services</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="pl-4 mt-1 space-y-1 border-l-2 border-blue-200 dark:border-blue-800">
                    {serviceLinks.map(link => (
                        <a key={link.label} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="block text-left text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400 w-full py-2 px-3 rounded-lg transition-colors">
                            {link.label}
                        </a>
                    ))}
                </div>
            )}
        </div>
    )
  }

  const MobileGalleryMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="flex items-center justify-between block text-center text-base font-semibold text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400 w-full py-3 px-4 rounded-xl transition-colors"
            >
                <span>Gallery</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="pl-4 mt-1 space-y-1 border-l-2 border-blue-200 dark:border-blue-800">
                    {galleryLinks.map(link => (
                        <button key={link.label} onClick={() => handleGalleryItemClick(link.item)} className="block text-left text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400 w-full py-2 px-3 rounded-lg transition-colors">
                            {link.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
  }

  const NavLinkItems: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
    const mobileClasses = "block text-center text-base font-semibold text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400 w-full py-3 rounded-xl transition-colors";
    const desktopClasses = "text-gray-600 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium";

    return (
      <>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            className={`${isMobile ? mobileClasses : desktopClasses} ${link.isHighlight ? 'text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center gap-1' : ''}`}
          >
            {link.isHighlight && <SparkleIcon className="w-3 h-3" />}
            {link.label}
          </a>
        ))}
      </>
    );
  };


  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-20 md:h-24 bg-white/95 dark:bg-gray-950/98 backdrop-blur-2xl shadow-lg dark:shadow-none dark:border-b dark:border-gray-800/50 flex items-center transition-all duration-300">
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="#" title="Go to Homepage" className="flex-shrink-0 flex items-center gap-2 group">
              <HomeIcon className="h-8 w-8 text-blue-600 dark:text-blue-500 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col">
                <span className="font-bold text-xl text-gray-800 dark:text-gray-50 leading-none">Elite Roofing</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">Midwest Premier Service</span>
              </div>
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex lg:items-center">
              <nav className="flex items-baseline space-x-1">
                <a
                    href="#about-us"
                    onClick={(e) => handleNavClick(e, '#about-us')}
                    className="text-gray-600 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    About Us
                </a>
                 <div className="relative" ref={servicesDropdownRef}>
                    <button 
                        onClick={() => setIsServicesDropdownOpen(prev => !prev)}
                        className="text-gray-600 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
                    >
                        Services
                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isServicesDropdownOpen && (
                        <div className="absolute top-full mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 dark:ring-white/10 z-50 py-2 animate-fade-in-down border dark:border-gray-800">
                            {serviceLinks.map(link => (
                                <a 
                                    key={link.label} 
                                    href={link.href} 
                                    onClick={e => handleNavClick(e, link.href)}
                                    className="block px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
                <div className="relative" ref={galleryDropdownRef}>
                    <button 
                        onClick={() => setIsGalleryDropdownOpen(prev => !prev)}
                        className="text-gray-600 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
                    >
                        Gallery
                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isGalleryDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isGalleryDropdownOpen && (
                        <div className="absolute top-full mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 dark:ring-white/10 z-50 py-2 animate-fade-in-down border dark:border-gray-800">
                            {galleryLinks.map(link => (
                                <button
                                    key={link.label} 
                                    onClick={() => handleGalleryItemClick(link.item)}
                                    className="w-full text-left block px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    {link.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <NavLinkItems />
              </nav>
              
              <div className="ml-6 flex items-center gap-6 border-l pl-6 border-gray-200 dark:border-gray-800">
                <button
                    onClick={onVoiceAgentClick}
                    title="Call 555 555 1212"
                    className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-2xl shadow-lg hover:bg-blue-700 hover:shadow-blue-600/30 transition-all duration-300 flex items-center gap-2 text-sm transform hover:-translate-y-0.5"
                    >
                    <MicrophoneIcon className="w-5 h-5" />
                    <span>Call 555 555 1212</span>
                </button>
                <ThemeToggle />
              </div>
            </div>

            <div className="flex md:hidden items-center gap-2">
                 <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    title={isMenuOpen ? "Close menu" : "Open main menu"}
                    className="bg-gray-100 dark:bg-gray-800 inline-flex items-center justify-center p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-600 focus:outline-none transition-all"
                >
                    {isMenuOpen ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    )}
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Progress Bar */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-blue-600 dark:bg-blue-500 transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full animate-fade-in-down z-50">
          <div className="px-4 pt-4 pb-8 space-y-2 bg-white dark:bg-gray-950 shadow-2xl border-t dark:border-gray-800">
            <div className="flex justify-between items-center pb-4 px-2">
                <span className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Navigation</span>
                <ThemeToggle />
            </div>
            <a
              href="#about-us"
              onClick={(e) => handleNavClick(e, '#about-us')}
              className="block text-center text-base font-semibold text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-900 hover:text-blue-600 dark:hover:text-blue-400 w-full py-4 rounded-2xl transition-colors"
            >
              About Us
            </a>
            <MobileServicesMenu />
            <MobileGalleryMenu />
            <NavLinkItems isMobile={true} />
             <div className="pt-6 flex flex-col gap-3">
                <button
                    onClick={() => {
                        setIsMenuOpen(false);
                        onVoiceAgentClick();
                    }}
                    className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold py-4 px-4 rounded-2xl shadow-xl hover:bg-blue-700 transition-all"
                >
                    <MicrophoneIcon className="w-5 h-5" />
                    <span>Call 555 555 1212</span>
                </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fade-in-down {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
            animation: fade-in-down 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </header>
  );
};

export default Header;
