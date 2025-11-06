
import React, { useState } from 'react';
import { HomeIcon, XMarkIcon } from './Icon';
import VoiceAgentOrb from './VoiceAgentOrb';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '#services', label: 'Services' },
    { href: '#damage-assessor', label: 'AI Checkup' },
    { href: '#estimate', label: 'AI Estimate' },
    { href: '#schedule', label: 'Schedule' },
    { href: '#testimonials', label: 'Reviews' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const NavLinkItems = () => (
    <>
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          onClick={(e) => handleNavClick(e, link.href)}
          className="text-gray-600 hover:text-blue-600 transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium"
        >
          {link.label}
        </a>
      ))}
    </>
  );

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="#" className="flex-shrink-0 flex items-center gap-2">
              <HomeIcon className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-800">Elite Roofing</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <nav className="ml-10 flex items-baseline space-x-4">
                <NavLinkItems />
              </nav>
            </div>
             <VoiceAgentOrb />
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            <NavLinkItems />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
