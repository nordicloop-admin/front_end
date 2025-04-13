import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AnalyticsSection = () => {
  return (
    <section className="py-10 md:py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-xl md:text-2xl font-semibold mb-3 text-[#1E2A36]">Analytics for Sustainability</h3>
            <p className="text-[#666666] mb-6 text-sm md:text-base">
              Gain data-driven insights to track waste reduction, CO₂ savings, and sustainability progress.
            </p>
            <Link
              href="/marketplace"
              className="bg-[#FF8A00] text-white px-6 py-2 rounded-md hover:bg-[#e67e00] transition-colors inline-block w-[140px] text-center text-sm font-medium"
            >
              Try for free →
            </Link>
          </div>
          <div className="order-1 md:order-2 relative h-[250px] md:h-[300px]">
            <Image
              src="/analytics-image.jpg"
              alt="Analytics dashboard"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsSection;
