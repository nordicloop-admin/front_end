import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FullWidthSection from '../layout/FullWidthSection';

const AnalyticsSection = () => {
  return (
    <FullWidthSection backgroundColor="#F5F5F5">
      <section className=" mx-auto max-w-[86%] bg-white section-margin rounded-corners  sections-margin sections-padding pt-0">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-[#1E2A36]">Analytics for Sustainability</h3>
              <p className="text-[#666666] mb-6 text-sm md:text-base">
                Gain data-driven insights to track waste reduction, CO₂ savings, and sustainability progress.
              </p>
              <Link
                href="/coming-soon"
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
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-2xl"
                priority
                loading="eager"
              />
            </div>
          </div>

      </section>
    </FullWidthSection>
  );
};

export default AnalyticsSection;
