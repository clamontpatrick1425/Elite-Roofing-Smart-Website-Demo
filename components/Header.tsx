
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
  onVisualizerClick: () => void;
  onStormDamageClick?: () => void;
  onLogoClick?: () => void;
  onFinancingClick?: () => void;
  currentView?: 'home' | 'storm-damage' | 'financing';
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
    onVeoStudioClick,
    onVisualizerClick,
    onStormDamageClick,
    onLogoClick,
    onFinancingClick,
    currentView = 'home'
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isGalleryDropdownOpen, setIsGalleryDropdownOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const galleryDropdownRef = useRef<HTMLDivElement>(null);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
      setIsScrolled(window.scrollY > 15);
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

    if (href === '#') {
      if (onLogoClick) onLogoClick();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (href === '#faq') { onFaqClick(); return; }
    if (href === '#estimate') { onEstimateClick(); return; }
    if (href === '#damage-assessor') { onDamageAssessorClick(); return; }
    if (href === '#design-studio') { onVeoStudioClick(); return; }
    if (href === '#visualizer') { onVisualizerClick(); return; }
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
    <header className={`fixed top-0 left-0 right-0 z-40 flex items-center transition-all duration-500 will-change-[height,padding] ${isScrolled ? 'h-16 md:h-20 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-md dark:border-b dark:border-gray-800/80' : 'h-24 md:h-28 bg-white/90 dark:bg-gray-950/90 backdrop-blur-lg'}`}>
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="#" onClick={(e) => { e.preventDefault(); if (onLogoClick) onLogoClick(); }} className="flex-shrink-0 flex items-center gap-3 group">
              <HomeIcon className="h-11 w-11 text-blue-600 dark:text-blue-500 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col">
                <span className="font-bold text-3xl text-gray-800 dark:text-gray-50 leading-none">Elite Roofing</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">Midwest Premier Service</span>
              </div>
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex lg:items-center">
              <nav className="flex items-center space-x-2 xl:space-x-4">
                {/* 1. Home */}
                <button
                  onClick={(e) => { e.preventDefault(); if (onLogoClick) onLogoClick(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`transition-all duration-300 px-3 py-2 text-lg font-bold ${currentView === 'home' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 rounded-none' : 'text-gray-600 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400'}`}
                >
                  Home
                </button>

                {/* 2. About */}
                <a href="#about-us" onClick={(e) => handleNavClick(e, '#about-us')} className="text-gray-600 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 px-3 py-2 rounded-md text-lg font-bold">About</a>

                {/* 3. Gallery Dropdown */}
                <div className="relative" ref={galleryDropdownRef}>
                    <button 
                        onClick={() => setIsGalleryDropdownOpen(prev => !prev)}
                        className="text-gray-600 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 px-3 py-2 rounded-md text-lg font-bold flex items-center gap-1"
                    >
                        Gallery
                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isGalleryDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isGalleryDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 dark:ring-white/10 z-50 py-2 animate-fade-in-down border dark:border-gray-800">
                            {GALLERY_IMAGES.map(item => (
                                <button
                                    key={item.title} 
                                    onClick={() => handleGalleryItemClick(item)}
                                    className="w-full text-left block px-6 py-3.5 text-base text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                                >
                                    {item.title}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 4. Services Dropdown */}
                <div className="relative" ref={servicesDropdownRef}>
                    <button 
                        onClick={() => setIsServicesDropdownOpen(prev => !prev)}
                        className="text-gray-600 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 px-3 py-2 rounded-md text-lg font-bold flex items-center gap-1"
                    >
                        Services
                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isServicesDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 dark:ring-white/10 z-50 py-2 animate-fade-in-down border dark:border-gray-800">
                            {SERVICES.map(service => (
                                <button 
                                    key={service.title}
                                    onClick={(e) => handleNavClick(e, '#services')}
                                    className="w-full text-left px-6 py-3.5 text-base text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-3 font-medium"
                                >
                                    <service.icon className="w-5 h-5 text-blue-500" />
                                    {service.title}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 5. Financing Link */}
                {onFinancingClick && (
                  <button 
                    onClick={onFinancingClick} 
                    className={`transition-all duration-300 px-3 py-2 text-lg font-extrabold flex items-center gap-1 ${currentView === 'financing' ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 rounded-none' : 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300'}`}
                  >
                    Financing
                  </button>
                )}

                {/* 6. Storm Recovery Link */}
                {onStormDamageClick && (
                  <button 
                    onClick={onStormDamageClick} 
                    className={`transition-all duration-300 px-3 py-2 text-lg font-extrabold flex items-center gap-1.5 ${currentView === 'storm-damage' ? 'text-red-500 dark:text-red-400 border-b-2 border-red-500 dark:border-red-400 rounded-none' : 'text-red-500 hover:text-red-600 dark:hover:text-red-400'}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                    Storm Recovery
                  </button>
                )}

                {/* 7. Inspection Link */}
                <a href="#schedule" onClick={(e) => handleNavClick(e, '#schedule')} className="text-gray-600 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 px-3 py-2 rounded-md text-lg font-bold">Inspection</a>

                {/* 8. Contact Button */}
                <button onClick={() => onContactClick()} className="text-gray-600 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 px-3 py-2 rounded-md text-lg font-bold">Contact</button>
              </nav>
              
              <div className="ml-6 flex items-center gap-4 border-l pl-6 border-gray-200 dark:border-gray-800">
                {/* Tools Dropdown (Intelligently placed in right Actions group) */}
                <div className="relative" ref={toolsDropdownRef}>
                    <button 
                        onClick={() => setIsToolsDropdownOpen(prev => !prev)}
                        className="text-gray-600 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 px-3 py-2 rounded-md text-base font-black uppercase tracking-wider flex items-center gap-1"
                    >
                        Tools
                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isToolsDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black ring-opacity-5 dark:ring-white/10 z-50 py-3 animate-fade-in-down border dark:border-gray-800">
                            {/* AI Project Estimate */}
                            <button onClick={(e) => handleNavClick(e, '#estimate')} className="w-full text-left px-6 py-4 text-base text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3">
                                <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                                    <SparkleIcon className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold">AI Project Estimate</span>
                                    <span className="text-xs opacity-60">Instant pricing breakdown</span>
                                </div>
                            </button>

                            {/* Design Studio */}
                            <button onClick={(e) => handleNavClick(e, '#design-studio')} className="w-full text-left px-6 py-4 text-base text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3">
                                <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                                    <VideoCameraIcon className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold">Design Studio</span>
                                    <span className="text-xs opacity-60">Animate your roof vision</span>
                                </div>
                            </button>

                            {/* Project Visualizer */}
                             <button onClick={(e) => handleNavClick(e, '#visualizer')} className="w-full text-left px-6 py-4 text-base text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3">
                                <div className="w-9 h-9 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0">
                                    <SparkleIcon className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold">Project Visualizer</span>
                                    <span className="text-xs opacity-60">Before & After comparison</span>
                                </div>
                            </button>

                            {/* AI Damage Check */}
                            <button onClick={(e) => handleNavClick(e, '#damage-assessor')} className="w-full text-left px-6 py-4 text-base text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3">
                                <div className="w-9 h-9 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 flex-shrink-0">
                                    <CameraIcon className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold">AI Damage Check</span>
                                    <span className="text-xs opacity-60">Upload photos for analysis</span>
                                </div>
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={onVoiceAgentClick}
                    className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2 text-base uppercase tracking-wider"
                >
                    <SparkleIcon className="w-5 h-5 animate-pulse" />
                    <span>Ask Hannah</span>
                </button>
                <ThemeToggle />
              </div>
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-xl transition-all">
              {isMenuOpen ? <XMarkIcon className="h-8 w-8" /> : <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Sliding Navigation Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-slate-950/60 dark:bg-black/80 backdrop-blur-md transition-all duration-300" style={{ transitionBehavior: 'allow-discrete' }}>
          <div className="fixed top-0 right-0 bottom-0 w-11/12 max-w-sm bg-white dark:bg-gray-950 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto border-l dark:border-gray-850">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-150 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
                    <HomeIcon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-lg text-gray-800 dark:text-white leading-tight">Elite Roofing</span>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600 dark:text-blue-400">Navigation Menu</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-xl transition-colors bg-gray-50 dark:bg-gray-900"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation Items in precise requested order */}
              <nav className="mt-6 flex flex-col space-y-3">
                {/* 1. Home */}
                <button
                  onClick={() => { setIsMenuOpen(false); if (onLogoClick) onLogoClick(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`w-full text-left py-2.5 px-3 rounded-xl text-lg font-extrabold transition-all flex items-center justify-between ${currentView === 'home' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/15' : 'text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
                >
                  <span>Home</span>
                  <span className="text-gray-400 text-sm">→</span>
                </button>

                {/* 2. About */}
                <button
                  onClick={() => { setIsMenuOpen(false); onAboutUsClick(); }}
                  className="w-full text-left py-2.5 px-3 rounded-xl text-lg font-extrabold text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all flex items-center justify-between"
                >
                  <span>About Us</span>
                  <span className="text-gray-400 text-sm">→</span>
                </button>

                {/* 3. Gallery Expandable Grid */}
                <div className="py-2 px-3 bg-gray-50/50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800/40">
                  <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 dark:text-gray-500 block mb-2">3. Our Design Galleries</span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {GALLERY_IMAGES.map(item => (
                      <button
                        key={item.title}
                        onClick={() => handleGalleryItemClick(item)}
                        className="text-left py-1.5 px-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-850 hover:text-blue-600 rounded-lg transition-all"
                      >
                        • {item.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Services Expandable Grid */}
                <div className="py-2 px-3 bg-gray-50/50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800/40">
                  <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 dark:text-gray-500 block mb-2">4. Core Shingle Services</span>
                  <div className="grid grid-cols-1 gap-1">
                    {SERVICES.map(service => (
                      <button
                        key={service.title}
                        onClick={(e) => { setIsMenuOpen(false); handleNavClick(e, '#services'); }}
                        className="text-left py-1.5 px-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-850 rounded-lg transition-all flex items-center gap-2"
                      >
                        <service.icon className="w-4 h-4 text-blue-500" />
                        {service.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Financing Link */}
                {onFinancingClick && (
                  <button
                    onClick={() => { setIsMenuOpen(false); onFinancingClick(); }}
                    className={`w-full text-left py-3 px-4 rounded-xl text-lg font-black transition-all flex items-center justify-between ${currentView === 'financing' ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-950/40 border-l-4 border-emerald-500' : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/50'}`}
                  >
                    <span className="flex items-center gap-2">💸 Financing Solution</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/45">$189/mo</span>
                  </button>
                )}

                {/* 6. Storm Recovery Link */}
                {onStormDamageClick && (
                  <button
                    onClick={() => { setIsMenuOpen(false); onStormDamageClick(); }}
                    className={`w-full text-left py-3 px-4 rounded-xl text-lg font-black transition-all flex items-center justify-between ${currentView === 'storm-damage' ? 'text-red-700 dark:text-red-400 bg-red-100/50 dark:bg-red-950/40 border-l-4 border-red-500' : 'text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20 hover:bg-red-100/50'}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                      Storm Recovery
                    </span>
                    <span className="text-xs uppercase font-bold tracking-widest text-red-500">Active</span>
                  </button>
                )}

                {/* 7. Inspection Link */}
                <button
                  onClick={() => { setIsMenuOpen(false); onScheduleClick(); }}
                  className="w-full text-left py-2.5 px-3 rounded-xl text-lg font-extrabold text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all flex items-center justify-between"
                >
                  <span>Inspection</span>
                  <span className="text-gray-400 text-sm">→</span>
                </button>

                {/* 8. Contact Link */}
                <button
                  onClick={() => { setIsMenuOpen(false); onContactClick(); }}
                  className="w-full text-left py-2.5 px-3 rounded-xl text-lg font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center justify-between"
                >
                  <span>Contact Elite</span>
                  <span className="text-sm">→</span>
                </button>
              </nav>
            </div>

            {/* Mobile Actions with interactive Tool Links and Voice Call */}
            <div className="mt-8 pt-6 border-t border-gray-150 dark:border-gray-850 space-y-4">
              <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 dark:text-gray-500 block">AI Roofing Suite</span>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => { setIsMenuOpen(false); onEstimateClick(); }}
                  className="py-2.5 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-xs font-bold text-center border border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600"
                >
                  Project Estimate
                </button>
                <button 
                  onClick={() => { setIsMenuOpen(false); onVeoStudioClick(); }}
                  className="py-2.5 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-xs font-bold text-center border border-gray-100 dark:border-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:text-indigo-600"
                >
                  AI Roof Design
                </button>
                <button 
                  onClick={() => { setIsMenuOpen(false); onVisualizerClick(); }}
                  className="py-2.5 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-xs font-bold text-center border border-gray-100 dark:border-gray-800 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:text-purple-600"
                >
                  Visual Comparison
                </button>
                <button 
                  onClick={() => { setIsMenuOpen(false); onDamageAssessorClick(); }}
                  className="py-2.5 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-xs font-bold text-center border border-gray-100 dark:border-gray-800 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-600"
                >
                  AI Damage Check
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-gray-500">Theme</span>
                <ThemeToggle />
              </div>

              <button
                onClick={() => { setIsMenuOpen(false); onVoiceAgentClick(); }}
                className="w-full bg-blue-600 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
              >
                <SparkleIcon className="w-5 h-5 animate-pulse" />
                <span>Call Hannah (Voice Client)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-100 ease-out" style={{ width: `${scrollProgress}%` }} />
    </header>
  );
};

export default Header;
