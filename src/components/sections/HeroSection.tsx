"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
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
          {/* Hero image with overlay */}
          <div className="relative h-[60vh] rounded-lg overflow-hidden">
            <Image
              src="/hero-image.jpg"
              alt="Recycling materials"
              fill
              sizes="100vw"
              className="object-cover"
              priority
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1E2A36]/90 to-[#1E2A36]/60 flex flex-col justify-center">
              <div className="p-6 pt-8">
                <h1 className="text-white text-3xl font-bold mb-3 leading-tight">
                  The Marketplace Where Waste Becomes A Resource
                </h1>
                <p className="text-white text-sm mb-6 max-w-xs">
                  Nordic Loop connects businesses to trade surplus materials, reducing costs, cutting CO₂ emissions, and driving sustainability.
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/coming-soon"
                    className="bg-[#FF8A00] text-white px-6 py-3 rounded-lg hover:bg-[#e67e00] transition-colors text-center w-full flex items-center justify-center font-medium"
                  >
                    Join Us Now
                  </Link>
                  <Link
                    href="/coming-soon"
                    className="bg-white text-[#FF8A00] px-6 py-3 rounded-lg hover:bg-[#EBEBEB] transition-colors text-center w-full flex items-center justify-center font-medium"
                  >
                    Our Market Place
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
                The Marketplace Where Waste Becomes A Resource
              </h1>
              <p className="text-[#666666] mb-6 text-base">
                Nordic Loop connects businesses to trade surplus materials, reducing costs, cutting CO₂ emissions, and driving sustainability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Link
                  href="/coming-soon"
                  className="bg-[#FF8A00] text-white px-5 py-2.5 rounded-lg hover:bg-[#e67e00] transition-colors text-center flex-1 flex items-center justify-center font-medium"
                >
                  Join Us Now
                </Link>
                <Link
                  href="/coming-soon"
                  className="bg-[#F5F5F5] text-[#FF8A00] px-5 py-2.5 rounded-lg hover:bg-[#EBEBEB] transition-colors text-center flex-1 flex items-center justify-center font-medium"
                >
                  Our Market Place
                </Link>
              </div>
            </div>

            {/* Image Container */}
            <div className="relative">
              <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                <Image
                  src="/hero-image.jpg"
                  alt="Recycling materials"
                  fill
                  sizes="(max-width: 1023px) 50vw, 33vw"
                  className="object-cover rounded-lg"
                  priority
                  loading="eager"
                />
              </div>
              {/* Small image - positioned more subtly */}
              {/* <div className="absolute bottom-4 right-4 w-[100px] h-[120px] bg-white p-1.5 rounded-lg shadow-md border-4 border-white">
                <Image
                  src="/Nordic Garbage.jpeg"
                  alt="Recycling icon"
                  fill
                  sizes="100px"
                  className="object-fill rounded-md"
                  priority
                  loading="eager"
                />
              </div> */}
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
      className="w-full section-margin"
      style={{ minHeight: heroHeight }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 w-full py-10">
        <div className="order-2 lg:order-1 flex flex-col justify-center items-start w-full">
          <h1 className="text-[36px] lg:text-[56px] leading-[1.2] font-bold text-[#1E2A36] mb-6 tracking-[-0.5px]">
            The Marketplace <br/>
            Where Waste Becomes <br/> A Resource
          </h1>
          <p className="text-[#666666] mb-8 max-w-7xl text-base lg:text-lg">
            Nordic Loop connects businesses to trade surplus materials, <br className="hidden lg:block"/> reducing costs, cutting CO₂ emissions, and driving sustainability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
            <Link
              href="/coming-soon"
              className="bg-[#FF8A00] text-white px-6 py-3 rounded-lg hover:bg-[#e67e00] transition-colors text-center w-full flex items-center justify-center font-medium"
            >
              Join Us Now
            </Link>
            <Link
              href="/coming-soon"
              className="bg-[#F5F5F5] text-[#FF8A00] px-6 py-3 rounded-lg hover:bg-[#EBEBEB] transition-colors text-center w-full flex items-center justify-center font-medium"
            >
              Our Market Place
            </Link>
          </div>
        </div>
        <div className="order-1 lg:order-2 relative">
          <div className="relative w-full" style={{ height: 'calc(100vh - 30vh)' }}>
            <Image
              src="/hero-image.jpg"
              alt="Recycling materials"
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="object-cover rounded-lg"
              priority
              loading="eager"
            />
          </div>
          {/* <div className="absolute bottom-4 right-4 w-[140px] h-[170px] bg-white p-2 rounded-lg shadow-md border-6 border-white">
            <Image
              src="/Nordic Garbage.jpeg"
              alt="Recycling icon"
              fill
              sizes="120px"
              className="object-fill rounded-md"
              priority
              loading="eager"
            />
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
