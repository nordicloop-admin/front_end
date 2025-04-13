import React from 'react';
import Link from 'next/link';

const WasteValueSection = () => {
  return (
    <section className="bg-[#1E2A36] text-white py-10 mx-4 rounded-lg">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-xl md:text-2xl font-semibold mb-4">Turning Waste Into Value</h2>
        <p className="text-center max-w-3xl mx-auto mb-6 text-sm md:text-base">
          Optimize your waste management with us—from Circular Waste Scans to Green Sourcing.
          Our market place will facilitate the exchange of surplus materials between businesses.
          Help you cut costs, enhance resource efficiency, boosting profits, reducing environmental
          impact and ensure full regulatory compliance. Transform sustainability goals into
          measurable success with our innovative circular approach.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/pricing"
            className="bg-[#FF8A00] text-white px-6 py-2 rounded-md hover:bg-[#e67e00] transition-colors text-center w-[140px] font-medium text-sm"
          >
            Join us
          </Link>
          <Link
            href="/marketplace"
            className="border border-white text-white px-6 py-2 rounded-md hover:bg-white hover:text-[#1E2A36] transition-colors text-center w-[140px] font-medium text-sm"
          >
            Marketplace
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WasteValueSection;
