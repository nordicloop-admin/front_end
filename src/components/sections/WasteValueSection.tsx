import React from 'react';
import Link from 'next/link';

const WasteValueSection = () => {
  return (
    <section className="bg-[#1E2A36] text-white py-10 rounded-4xl">
      <div className="container mx-auto">
        <h2 className="text-center text-[16px]  mb-4 text-[#e67e00]">Turning Waste Into Value</h2>
        <h3 className="text-center text-xl md:text-2xl font-semibold mb-3 text-gray-300">
        Optimize your waste management with us—from <br/> Circular Waste Scans to Green Sourcing.
        </h3>
        <p className="text-center max-w-7xl mb-6 text-sm md:text-base text-gray-500">
          
          Our market place will facilitate the exchange of surplus materials between <br/> businesses.
          Help you cut costs, enhance resource efficiency, boosting <br/>  profits, reducing environmental
          impact and ensure full regulatory compliance.<br/>  Transform sustainability goals into
          measurable success with our innovative<br/>  circular approach.
        </p>
        
      </div>
    </section>
  );
};

export default WasteValueSection;
