"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { User } from 'lucide-react';

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  // State to track device type
  const [deviceType, setDeviceType] = useState('desktop'); // 'mobile', 'tablet', or 'desktop'

  // Update device type on window resize
  useEffect(() => {
    const updateDeviceType = () => {
      // Set device type based on window width
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width >= 768 && width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    // Set initial device type
    updateDeviceType();

    // Add resize listener
    window.addEventListener('resize', updateDeviceType);

    // Cleanup
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  // Integrated Navbar Component
  const IntegratedNavbar = () => (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-[86%] mx-auto py-4">
        <div className="flex justify-between items-center px-7">
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

          <div className="flex items-center">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center">
              <Link href="/market-place" className="text-white hover:text-[#FF8A00] transition-colors font-medium px-4">
                Marketplace
              </Link>
              <Link href="/about" className="text-white hover:text-[#FF8A00] transition-colors font-medium px-4">
                About Us
              </Link>
              <Link href="/pricing" className="text-white hover:text-[#FF8A00] transition-colors font-medium px-4">
                Pricing
              </Link>
              <Link href="/contact" className="text-white hover:text-[#FF8A00] transition-colors font-medium px-4">
                Contact
              </Link>
            </nav>

            {/* Login/Dashboard Button - Desktop Only */}
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="hidden md:flex bg-[#FF8A00] text-white px-6 py-2 rounded-md hover:bg-[#e67e00] transition-colors font-medium ml-4 items-center"
              >
                <User size={18} className="mr-2" />
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden md:block bg-[#FF8A00] text-white px-6 py-2 rounded-md hover:bg-[#e67e00] transition-colors font-medium ml-4"
              >
                Log In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  // Shared benefits panel component
  const Benefits = () => (
    <div className="mt-8 w-full max-w-xl">
      <div className="grid grid-cols-3 gap-3 md:gap-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg border border-white/50">
        <div className="flex flex-col items-center text-center">
          <div className="text-sm md:text-base font-semibold text-[#1E2A36]">Reduce Costs</div>
          <p className="text-[11px] md:text-xs text-[#666666]">Turn surplus into revenue</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="text-sm md:text-base font-semibold text-[#1E2A36]">Cut CO₂</div>
          <p className="text-[11px] md:text-xs text-[#666666]">Shorter supply chains</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="text-sm md:text-base font-semibold text-[#1E2A36]">Circular</div>
          <p className="text-[11px] md:text-xs text-[#666666]">Enable reuse loops</p>
        </div>
      </div>
    </div>
  );

  // Mobile hero
  if (deviceType === 'mobile') {
    return (
      <section className="relative w-full h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: 'url(/images/landing%20page/hero%20section.png)' }}
          aria-hidden="true"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/80" />
        {/* Animated ambient orbs */}
        <div className="pointer-events-none absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#FF8A00]/20 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-56 h-56 rounded-full bg-[#1E2A36]/30 blur-3xl animate-pulse [animation-delay:1.5s]" />
        
        {/* Integrated Navbar */}
        <IntegratedNavbar />
        
        <div className="relative z-10 px-6 pt-24 pb-16 flex flex-col justify-center h-full">
          <h1 className="text-white text-3xl font-bold leading-tight tracking-tight">
            The Marketplace<br />Where Waste Becomes<br />A Resource
          </h1>
          <p className="text-white/80 text-sm mt-4 max-w-xs">
            Nordic Loop connects businesses to trade surplus materials, reducing costs, cutting CO₂ emissions, and driving sustainability.
          </p>
          <div className="flex flex-col gap-3 mt-6">
            <Link href="/register" className="bg-[#FF8A00] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#e67e00] transition-colors text-center">
              Join Us Now
            </Link>
            <Link href="/market-place" className="bg-white/90 text-[#FF8A00] px-6 py-3 rounded-lg font-medium backdrop-blur hover:bg-white transition-colors text-center">
              Our Marketplace
            </Link>
          </div>
          <Benefits />
        </div>
      </section>
    );
  }

  // Tablet hero
  if (deviceType === 'tablet') {
    return (
      <section className="relative w-full h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-cover scale-105"
          style={{ backgroundImage: 'url(/images/landing%20page/hero%20section.png)' }}
        />
        <div className="absolute inset-0 bg-black/80" />
        
        {/* Integrated Navbar */}
        <IntegratedNavbar />
        
        <div className="relative z-10 px-6 py-12 pt-24 grid grid-cols-2 gap-10 h-full items-center">
          <div className="flex flex-col justify-center">
            <h1 className="font-bold text-4xl leading-tight text-white tracking-tight">
              The Marketplace<br />Where Waste Becomes<br />A Resource
            </h1>
            <p className="text-white/80 mt-5 text-base max-w-md">
              Nordic Loop connects businesses to trade surplus materials, reducing costs, cutting CO₂ emissions, and driving sustainability.
            </p>
            <div className="flex flex-row gap-4 mt-8">
              <Link href="/register" className="bg-[#FF8A00] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#e67e00] transition-colors">
                Join Us Now
              </Link>
              <Link href="/market-place" className="rounded-xl px-6 py-3 font-medium bg-white/90 text-[#FF8A00] backdrop-blur hover:bg-white transition shadow">
                Our Marketplace
              </Link>
            </div>
            <Benefits />
          </div>
          <div className="relative flex items-center justify-center">
            {/* Decorative glass card */}
            <div className="relative w-full max-w-md p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 shadow-2xl">
              <h2 className="text-white font-semibold mb-3 text-lg">Why Nordic Loop?</h2>
              <ul className="space-y-2 text-white/80 text-sm">
                <li className="flex justify-between"><span>CO₂ Avoided</span><span className="font-medium text-white">1.2k kg</span></li>
                <li className="flex justify-between"><span>Materials Re-homed</span><span className="font-medium text-white">640+</span></li>
                <li className="flex justify-between"><span>Active Companies</span><span className="font-medium text-white">120+</span></li>
              </ul>
              <div className="mt-4 text-[10px] text-white/50">Live metrics illustrating circular traction.</div>
              <div className="absolute -inset-0.5 rounded-2xl border border-[#FF8A00]/40 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Desktop hero
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background wrapper */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-center bg-cover will-change-transform" style={{ backgroundImage: 'url(/images/landing%20page/hero%20section.png)' }} />
        <div className="absolute inset-0 bg-black/80" />
      </div>
      {/* Animated accent lines using brand colors */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-full">
        <div className="absolute left-[10%] top-[20%] h-px w-32 bg-[#FF8A00] opacity-60 animate-pulse" />
        <div className="absolute right-[15%] top-[55%] h-px w-48 bg-[#FF8A00] opacity-60 animate-pulse [animation-delay:2s]" />
      </div>
      
      {/* Integrated Navbar */}
      <IntegratedNavbar />
      
      <div className="relative z-10 w-full px-6 py-20 pt-24 h-full flex items-center">
        <div className="w-full max-w-[86%] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <h1 className="text-white text-4xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
                The Marketplace<br />Where Waste Becomes<br />A <span className="text-[#FF8A00]">Resource</span>
              </h1>
              <p className="text-white/80 mt-6 text-lg max-w-2xl">
                Nordic Loop connects businesses to trade surplus materials, reducing costs, cutting CO₂ emissions, and driving sustainability.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="bg-[#FF8A00] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#e67e00] transition-colors text-center">
                  Join Us Now
                </Link>
                <Link href="/market-place" className="rounded-xl px-8 py-4 font-semibold bg-white/90 text-[#FF8A00] backdrop-blur hover:bg-white transition shadow-lg">
                  Our Marketplace
                </Link>
              </div>
              <Benefits />
            </div>
            <div className="lg:col-span-5 flex items-center">
              {/* Metrics card using brand colors */}
              <div className="relative w-full max-w-xl mx-auto bg-white/5 backdrop-blur-xl border border-white/15 rounded-3xl p-8 shadow-2xl overflow-hidden">
                <div className="absolute -inset-[2px] rounded-3xl pointer-events-none border border-[#FF8A00]/40" />
                <h2 className="text-white font-semibold text-xl mb-4">Why Nordic Loop?</h2>
                <div className="grid grid-cols-2 gap-6 text-white/80 text-sm">
                  <div>
                    <div className="text-2xl font-bold text-white">92%</div>
                    <p className="mt-1">Average material recovery boost</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">-38%</div>
                    <p className="mt-1">Carbon intensity reduction</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">24h</div>
                    <p className="mt-1">Typical listing liquidity</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">Global</div>
                    <p className="mt-1">Cross-industry network</p>
                  </div>
                </div>
                <div className="mt-6 text-[11px] text-white/50">Indicative figures from early adopter cohorts.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
