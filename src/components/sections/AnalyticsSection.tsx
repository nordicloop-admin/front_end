import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FullWidthSection from '../layout/FullWidthSection';

const AnalyticsSection = () => {
  return (
    <FullWidthSection backgroundColor="#F5F5F5">
      <section className="mx-auto max-w-[86%] bg-white section-margin rounded-corners sections-padding mb-6 md:mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-1 md:order-1 relative h-[250px] md:h-[300px]">
            <Image
              src="/images/landing page/made-from-the-sky-i-eXpmQ98M8-unsplash.jpg"
              alt="AI Sustainability Reports"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-2xl"
              priority
              loading="eager"
            />
          </div>
          <div className="order-2 md:order-2">
            <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-[#1E2A36]">
              AI Sustainability Reports <span className="text-gray-600 italic">(coming soon)</span><span className="text-[#FF8A00]">.</span>
            </h3>
            <p className="text-[#666666] mb-6 text-sm md:text-base leading-relaxed">
              Our advanced AI technology will produce detailed sustainability reports to quantify environmental impact and ensure regulatory compliance.
              The reports feature CO<sub>2</sub> emission reduction calculations, ESG reporting aligned with international standards,
              metrics on waste diverged from landfills, and actionable insights for enhanced sustainability efforts.
            </p>
            <Link
              href="/coming-soon"
              className="bg-[#FF8A00] text-white px-8 py-4 w-[200px] rounded-md hover:bg-[#e67e00] transition-colors inline-block text-center text-sm font-medium"
            >
              Learn more →
            </Link>
          </div>
        </div>
      </section>
    </FullWidthSection>
  );
};

export default AnalyticsSection;
