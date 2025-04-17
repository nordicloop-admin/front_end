"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  // State to track viewport height minus header height
  const [heroHeight, setHeroHeight] = useState('calc(100vh - 56px)');
  const [isMobile, setIsMobile] = useState(false);

  // Update hero height and check if mobile on window resize
  useEffect(() => {
    const updateHeroHeight = () => {
      // Get header height - 56px is an estimate (48px height + 8px margin)
      const headerHeight = 56;
      setHeroHeight(`calc(100vh - ${headerHeight}px)`);
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial height and mobile state
    updateHeroHeight();

    // Add resize listener
    window.addEventListener('resize', updateHeroHeight);

    // Cleanup
    return () => window.removeEventListener('resize', updateHeroHeight);
  }, []);

  // Mobile Hero Section with Text Overlay
  if (isMobile) {
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

  // Desktop Hero Section (original layout)
  return (
    <section
      className="w-full section-margin"
      style={{ minHeight: heroHeight }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-32 w-full py-10">
        <div className="order-2 md:order-1 flex flex-col justify-center items-start w-full">
          <h1 className="text-[36px] md:text-[56px] leading-[1.2] font-bold text-[#1E2A36] mb-6 tracking-[-0.5px]">
            The Marketplace <br/>
            Where Waste Becomes <br/> A Resource
          </h1>
          <p className="text-[#666666] mb-8 max-w-7xl text-base md:text-lg">
            Nordic Loop connects businesses to trade surplus materials, <br/> reducing costs, cutting CO₂ emissions, and driving sustainability.
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
        <div className="order-1 md:order-2 relative">
          <div className="relative w-full" style={{ height: 'calc(100vh - 30vh)' }}>
            <Image
              src="/hero-image.jpg"
              alt="Recycling materials"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-lg"
              priority
              loading="eager"
            />
          </div>
          <div className="absolute bottom-4 right-4 w-[140px] h-[170px] bg-white p-2 rounded-lg shadow-md border-6 border-white">
            <Image
              src="/Nordic Garbage.jpeg"
              alt="Recycling icon"
              fill
              sizes="120px"
              className="object-fill rounded-md"
              priority
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
