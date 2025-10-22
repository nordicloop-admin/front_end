"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
      } else if (width >= 768 && width < 1400) {
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
      <section className="w-full mt-6">
        <div className="relative">
          {/* Hero image with overlay */}
          <div className="relative h-[60vh] rounded-lg overflow-hidden">
            <Image
              src="/images/landing page/jeriden-villegas-VLPUm5wP5Z0-unsplash.jpg"
              alt="Nordic Loop circular materials workflow"
              fill
              className="object-cover"
              priority
            />
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

  // Tablet Hero Section (optimized layout for iPad/tablet and medium screens)
  if (deviceType === 'tablet') {
    return (
      <section className="w-full mt-6">
        <div className="container mx-auto max-w-[86%] px-6 py-8">
          <div className="grid grid-cols-2 gap-16 items-center min-h-[70vh]">
            {/* Text Content */}
            <div className="flex flex-col justify-center space-y-6 pr-4">
              <h1 className="text-[28px] md:text-[32px] lg:text-[36px] font-bold text-[#1E2A36] mb-4 leading-[1.1]">
                The Marketplace<br/>
                Where Waste<br/>
                Becomes<br/>
                A Resource
              </h1>
              <p className="text-[#666666] mb-8 text-base md:text-lg leading-relaxed max-w-md">
                Nordic Loop connects businesses to trade surplus materials, reducing costs, cutting CO₂ emissions, and driving sustainability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                <Link
                  href="/register"
                  className="bg-[#FF8A00] text-white px-6 py-3 md:px-8 md:py-4 rounded-lg hover:bg-[#e67e00] transition-colors text-center flex items-center justify-center font-medium text-base md:text-lg flex-1"
                >
                  Join Us Now
                </Link>
                <Link
                  href="/market-place"
                  className="bg-[#F5F5F5] text-[#FF8A00] px-6 py-3 md:px-8 md:py-4 rounded-lg hover:bg-[#EBEBEB] transition-colors text-center flex items-center justify-center font-medium text-base md:text-lg flex-1"
                >
                  Our Marketplace
                </Link>
              </div>
            </div>

            {/* Image Container */}
            <div className="relative flex items-center justify-center pl-4">
              <div className="relative w-full max-w-md lg:max-w-lg">
                {/* Image with optimized aspect ratio for tablet */}
                <div className="relative w-full" style={{ aspectRatio: '4/4.5' }}>
                  <Image
                    src="/images/landing page/jeriden-villegas-VLPUm5wP5Z0-unsplash.jpg"
                    alt="Nordic Loop circular materials workflow"
                    fill
                    className="rounded-2xl shadow-2xl object-cover"
                    priority
                  />
                </div>
                
                {/* Decorative elements for visual appeal */}
                <div className="absolute -top-3 -right-3 w-20 h-20 bg-gradient-to-br from-[#FF8A00]/10 to-[#FF8A00]/5 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-[#1E2A36]/5 to-transparent rounded-full blur-2xl"></div>
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
      className="w-full flex items-center"
      style={{ minHeight: heroHeight }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 w-full max-w-[86%] mx-auto py-10">
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
          {/* Image Container with Cinematic Design */}
          <div className="relative w-full">
            {/* Image Frame with a bit taller aspect ratio */}
            <div className="relative w-full" style={{ aspectRatio: '4/3.7' }}>
              <Image
                src="/images/landing page/jeriden-villegas-VLPUm5wP5Z0-unsplash.jpg"
                alt="Nordic Loop circular materials workflow"
                fill
                className="rounded-2xl shadow-2xl object-cover"
                priority
                // style={{
                //   filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.25))'
                // }}
              />
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
