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

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.mobile-menu-container') && !target.closest('.hamburger-button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    <header className="bg-[#1E2A36] py-8 rounded-lg mt-4 relative z-50">
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
              Market Place
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
        className={`mobile-menu-container fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          className={`absolute right-0 top-0 h-screen bg-[#1E2A36] w-64 shadow-lg transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="p-6 flex flex-col space-y-6">
            <Link
              href="/coming-soon"
              className="text-white hover:text-[#FF8A00] transition-colors font-medium block py-2 border-b border-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/coming-soon"
              className="text-white hover:text-[#FF8A00] transition-colors font-medium block py-2 border-b border-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Market Place
            </Link>
            <Link
              href="/coming-soon"
              className="text-white hover:text-[#FF8A00] transition-colors font-medium block py-2 border-b border-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/coming-soon"
              className="text-white hover:text-[#FF8A00] transition-colors font-medium block py-2 border-b border-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {/* Login Button in Mobile Menu */}
            <div className="mt-4 pt-4">
              <Link
                href="/coming-soon"
                className="bg-[#FF8A00] text-white px-6 py-3 rounded-md hover:bg-[#e67e00] transition-colors font-medium block text-center"
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
