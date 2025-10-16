"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const HeroSection = () => {
  // State to track viewport height minus header height
  const [heroHeight, setHeroHeight] = useState('calc(100vh - 56px)');
  const [deviceType, setDeviceType] = useState('desktop'); // 'mobile', 'tablet', or 'desktop'

  // Update hero height and check device type on window resize
  useEffect(() => {
    const updateHeroHeight = () => {
      // Get header height - 56px is an estimate (48px height + 8px margin)
      const headerHeight = 56;
      setHeroHeight(`calc(100vh - ${headerHeight}px)`);

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

    // Set initial height and device type
    updateHeroHeight();

    // Add resize listener
    window.addEventListener('resize', updateHeroHeight);

    // Cleanup
    return () => window.removeEventListener('resize', updateHeroHeight);
  }, []);

  // Mobile Hero Section with Text Overlay
  if (deviceType === 'mobile') {
    return (
      <section className="w-full section-margin mt-6">
        <div className="relative">
          {/* Hero video with overlay */}
          <div className="relative h-[60vh] rounded-lg overflow-hidden">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Tutorial showing Nordic Loop circular materials workflow"
              poster="/hero-image.jpg"
            >
              <source src="https://pub-7515a715eee34bd9ab26b28cbe2f7fa1.r2.dev/General%20Resources/Nordic%20Loop%20Tutorial.mp4" type="video/mp4" />
              {/* Fallback text */}
              Your browser does not support the video tag.
            </video>
            
            {/* Subtle video control hint */}
            <div className="absolute bottom-4 right-4">
              <button 
                className="bg-black/30 backdrop-blur-sm rounded-full p-2 text-white/80 hover:text-white transition-colors"
                onClick={(e) => {
                  const video = e.currentTarget.closest('.relative')?.querySelector('video');
                  if (video) {
                    if (video.paused) video.play();
                    else video.pause();
                  }
                }}
                aria-label="Toggle video playback"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#1E2A36]/90 to-[#1E2A36]/60 flex flex-col justify-center">
              <div className="p-6 pt-8">
                <h1 className="text-white text-3xl font-bold mb-3 leading-tight">
                  The Marketplace <br/> <span className="sm:whitespace-nowrap">Where Waste Becomes</span> <br/> A Resource
                </h1>
                <p className="text-white text-sm mb-6 max-w-xs">
                  Nordic Loop connects businesses to trade surplus materials, reducing costs, cutting CO₂ emissions, and driving sustainability.
                </p>
                <div className="flex flex-col gap-3 ">
                  <Link
                    href="/register"
                    className="bg-[#FF8A00] text-white px-6 py-3 rounded-lg hover:bg-[#e67e00] transition-colors text-center w-full flex items-center justify-center font-medium"
                  >
                    Join Us Now
                  </Link>
                  <Link
                    href="/market-place"
                    className="bg-white text-[#FF8A00] px-6 py-3 rounded-lg hover:bg-[#EBEBEB] transition-colors text-center w-full flex items-center justify-center font-medium"
                  >
                    Our Marketplace
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Key benefits section */}
          <div className="bg-white py-8 px-4 rounded-lg mt-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-[#1E2A36] font-semibold text-sm mb-1">Reduce Costs</div>
                <p className="text-[#666666] text-xs">Save on material expenses</p>
              </div>
              <div>
                <div className="text-[#1E2A36] font-semibold text-sm mb-1">Cut CO₂</div>
                <p className="text-[#666666] text-xs">Lower emissions</p>
              </div>
              <div>
                <div className="text-[#1E2A36] font-semibold text-sm mb-1">Sustainable</div>
                <p className="text-[#666666] text-xs">Circular economy</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Tablet Hero Section (new optimized layout for iPad/tablet)
  if (deviceType === 'tablet') {
    return (
      <section className="w-full section-margin mt-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="flex flex-col justify-center">
              <h1 className="text-[32px] font-bold text-[#1E2A36] mb-4 leading-tight">
                The Marketplace<br/>
                <span className="whitespace-nowrap">Where Waste Becomes</span>
              </h1>
              <p className="text-[#666666] mb-6 text-base">
                Nordic Loop connects businesses to trade surplus materials, reducing costs, cutting CO₂ emissions, and driving sustainability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Link
                  href="/register"
                  className="bg-[#FF8A00] text-white px-5 py-2.5 rounded-lg hover:bg-[#e67e00] transition-colors text-center flex-1 flex items-center justify-center font-medium"
                >
                  Join Us Now
                </Link>
                <Link
                  href="/market-place"
                  className="bg-[#F5F5F5] text-[#FF8A00] px-5 py-2.5 rounded-lg hover:bg-[#EBEBEB] transition-colors text-center flex-1 flex items-center justify-center font-medium"
                >
                  Our Marketplace
                </Link>
              </div>
            </div>

            {/* Video Container */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                {/* Video with proper 16:9 aspect ratio */}
                <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                  <video
                    className="w-full h-full rounded-xl shadow-xl object-contain bg-black"
                    controls
                    muted
                    playsInline
                    preload="metadata"
                    aria-label="Tutorial showing Nordic Loop circular materials workflow"
                    poster="/hero-image.jpg"
                  >
                    <source src="https://pub-7515a715eee34bd9ab26b28cbe2f7fa1.r2.dev/General%20Resources/Nordic%20Loop%20Tutorial.mp4" type="video/mp4" />
                    <div className="flex items-center justify-center h-full bg-gray-100 rounded-xl">
                      <p className="text-gray-600 text-center text-sm">Video not supported</p>
                    </div>
                  </video>
                </div>
                
                {/* Video caption for tablet */}
                <div className="mt-3 text-center">
                  <p className="text-xs text-gray-600 font-medium">Nordic Loop Platform Demo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key benefits section */}
          <div className="bg-white py-6 px-6 rounded-lg mt-6 shadow-sm">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-[#1E2A36] font-semibold text-sm mb-1">Reduce Costs</div>
                <p className="text-[#666666] text-xs">Save on material expenses</p>
              </div>
              <div>
                <div className="text-[#1E2A36] font-semibold text-sm mb-1">Cut CO₂</div>
                <p className="text-[#666666] text-xs">Lower emissions</p>
              </div>
              <div>
                <div className="text-[#1E2A36] font-semibold text-sm mb-1">Sustainable</div>
                <p className="text-[#666666] text-xs">Circular economy</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Desktop Hero Section (original layout with minor improvements)
  return (
    <section
      className="w-full section-margin flex items-center"
      style={{ minHeight: heroHeight }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 w-full py-10">
        <div className="order-2 lg:order-1 flex flex-col justify-center items-start w-full">
          <h1 className="text-[36px] lg:text-[56px] leading-[1.2] font-bold text-[#1E2A36] mb-6 tracking-[-0.5px]">
            The Marketplace <br/>
            <span className="whitespace-nowrap">Where Waste Becomes</span> <br/> A Resource
          </h1>
          <p className="text-[#666666] mb-8 max-w-7xl text-base lg:text-lg">
            Nordic Loop connects businesses to trade surplus materials, <br className="hidden lg:block"/> reducing costs, cutting CO₂ emissions, and driving sustainability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full md:w-full xl:w-[75%]">
            <Link
              href="/register"
              className="bg-[#FF8A00] text-white px-6 py-3 rounded-lg hover:bg-[#e67e00] transition-colors text-center w-full flex items-center justify-center font-medium"
            >
              Join Us Now
            </Link>
            <Link
              href="/market-place"
              className="bg-[#F5F5F5] text-[#FF8A00] px-6 py-3 rounded-lg hover:bg-[#EBEBEB] transition-colors text-center w-full flex items-center justify-center font-medium"
            >
              Our Marketplace
            </Link>
          </div>
        </div>
        <div className="order-1 lg:order-2 relative flex items-center justify-center">
          {/* Video Container with Cinematic Design */}
          <div className="relative w-full max-w-2xl">
            {/* Video Frame with 16:9 Aspect Ratio */}
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              <video
                className="w-full h-full rounded-2xl shadow-2xl object-contain bg-black"
                controls
                muted
                playsInline
                preload="metadata"
                aria-label="Tutorial showing Nordic Loop circular materials workflow"
                poster="/images/landing page/jeriden-villegas-VLPUm5wP5Z0-unsplash.jpg"
                style={{
                  filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.25))'
                }}
              >
                <source src="https://pub-7515a715eee34bd9ab26b28cbe2f7fa1.r2.dev/General%20Resources/Nordic%20Loop%20Tutorial.mp4" type="video/mp4" />
                <div className="flex items-center justify-center h-full bg-gray-100 rounded-2xl">
                  <p className="text-gray-600 text-center px-4">
                    Your browser does not support video playback.<br/>
                    <a href="https://pub-7515a715eee34bd9ab26b28cbe2f7fa1.r2.dev/General%20Resources/Nordic%20Loop%20Tutorial.mp4" 
                       className="text-[#FF8A00] underline">Watch on external player</a>
                  </p>
                </div>
              </video>
              
              {/* Subtle Play Button Overlay (appears on hover when paused) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl">
                <div className="bg-black/20 rounded-full p-4 backdrop-blur-sm">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#FF8A00]/10 to-[#FF8A00]/5 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-[#1E2A36]/5 to-transparent rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
