import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="relative bg-white py-8 md:py-12 px-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="order-2 md:order-1">
          <h1 className="text-[32px] md:text-[40px] leading-[48px] font-bold text-[#1E2A36] mb-4 tracking-[-0.5px]">
            The Marketplace Where Waste Becomes A Resource
          </h1>
          <p className="text-[#666666] mb-6 max-w-lg text-sm md:text-base">
            Nordic Loop connects businesses to trade surplus materials, reducing costs, cutting CO₂ emissions, and driving sustainability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/get-started"
              className="bg-[#FF8A00] text-white px-6 py-2 rounded-md hover:bg-[#e67e00] transition-colors text-center w-[180px] font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
        <div className="order-1 md:order-2 relative">
          <div className="relative w-full h-[300px] md:h-[400px]">
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
