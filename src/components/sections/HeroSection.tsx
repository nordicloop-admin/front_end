"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  // State to track viewport height minus header height
  const [heroHeight, setHeroHeight] = useState('calc(100vh - 56px)');

  // Update hero height on window resize
  useEffect(() => {
    const updateHeroHeight = () => {
      // Get header height - 56px is an estimate (48px height + 8px margin)
      const headerHeight = 56;
      setHeroHeight(`calc(100vh - ${headerHeight}px)`);
    };

    // Set initial height
    updateHeroHeight();

    // Add resize listener
    window.addEventListener('resize', updateHeroHeight);

    // Cleanup
    return () => window.removeEventListener('resize', updateHeroHeight);
  }, []);

  return (
    <section
      className=" w-full section-margin"
      style={{ minHeight: heroHeight }}

    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-32  w-full  py-10 ">
        <div className="order-2 md:order-1 flex flex-col justify-center items-start w-full">
          <h1 className="text-[36px] md:text-[56px] leading-[1.2]  font-bold text-[#1E2A36] mb-6 tracking-[-0.5px]">
            The Marketplace <br/>
            Where Waste Becomes <br/> A Resource
          </h1>
          <p className="text-[#666666] mb-8 max-w-7xl text-base md:text-lg">
            Nordic Loop connects businesses to trade surplus materials, <br/> reducing costs, cutting CO₂ emissions, and driving sustainability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
            <Link
              href="/coming-soon"
              className="bg-[#FF8A00] text-white px-6 py-3 rounded-lg hover:bg-[#e67e00] transition-colors text-center  w-full flex items-center justify-center  font-medium"
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
              className="object-cover rounded-lg"
              priority
            />
          </div>
          <div className="absolute bottom-4 right-4 w-[120px] h-[120px] bg-white p-2 rounded-lg shadow-md">
            <Image
              src="/recycling-icon.jpg"
              alt="Recycling icon"
              fill
              className="object-cover rounded-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
