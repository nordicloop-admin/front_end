"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when clicking outside or on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    // This is a backup handler for any clicks that might not be caught by the overlay click handler
    const handleClickOutside = (e: MouseEvent) => {
      if (isMenuOpen) {
        const target = e.target as HTMLElement;
        const menuContent = document.querySelector('.menu-content');
        const hamburgerButton = document.querySelector('.hamburger-button');

        if (menuContent && !menuContent.contains(target as Node) &&
            hamburgerButton && !hamburgerButton.contains(target as Node)) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#1E2A36] py-4 rounded-lg mt-4 relative z-50">
      <div className="mx-7 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="relative w-[120px] h-[32px]">
            <Image
              src="/nordic logo.png"
              alt="Nordic Loop Logo"
              fill
              sizes="120px"
              priority
              loading="eager"
              className="object-contain"
            />
          </div>
        </Link>

        <div className="flex items-center space-x-4 md:space-x-8">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/coming-soon" className="text-white hover:text-[#FF8A00] transition-colors font-medium">
              About Us
            </Link>
            <Link href="/coming-soon" className="text-white hover:text-[#FF8A00] transition-colors font-medium">
            Marketplace
            </Link>
            <Link href="/coming-soon" className="text-white hover:text-[#FF8A00] transition-colors font-medium">
              Pricing
            </Link>
            <Link href="/coming-soon" className="text-white hover:text-[#FF8A00] transition-colors font-medium">
              Contact
            </Link>
          </nav>

          {/* Login Button - Desktop Only */}
          <Link
            href="/coming-soon"
            className="hidden md:block bg-[#FF8A00] text-white px-6 py-2 rounded-md hover:bg-[#e67e00] transition-colors font-medium"
          >
            Log In
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden hamburger-button p-2 text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{
          backdropFilter: 'blur(2px)',
          backgroundColor: 'rgba(30, 42, 54, 0.7)', /* Dark blue with transparency */
          width: '100vw',
          height: '100vh',
          left: 0,
          top: 0,
          position: 'fixed'
        }}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      >
        <div
          className={`absolute right-0 top-0 h-screen bg-[#1E2A36] w-[75%] max-w-[300px] shadow-lg transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full menu-content">
            {/* Menu Header with Close Button */}
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-white text-lg font-medium">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-400 hover:text-white focus:outline-none"
                aria-label="Close menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-6 px-6">
              <nav className="flex flex-col space-y-4">
                <Link
                  href="/coming-soon"
                  className="text-white hover:text-[#FF8A00] transition-colors font-medium block py-3 border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="/coming-soon"
                  className="text-white hover:text-[#FF8A00] transition-colors font-medium block py-3 border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Marketplace 
                </Link>
                <Link
                  href="/coming-soon"
                  className="text-white hover:text-[#FF8A00] transition-colors font-medium block py-3 border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="/coming-soon"
                  className="text-white hover:text-[#FF8A00] transition-colors font-medium block py-3 border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </nav>
            </div>

            {/* Login Button in Mobile Menu  */}
            <div className="p-6 border-t border-gray-700">
              <Link
                href="/coming-soon"
                className="bg-[#FF8A00] text-white px-6 py-3 rounded-md hover:bg-[#e67e00] transition-colors font-medium block text-center w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
