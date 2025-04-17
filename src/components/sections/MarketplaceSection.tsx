import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const MarketplaceSection = () => {
  return (
    <section className="py-10 md:py-16 section-margin">
      <div className=" mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-32 items-center">
          <div>
            <h3 className="text-md md:text-mdfont-semibold mb-3 text-[#1E2A36]">Waste Marketplace</h3>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-[#1E2A36]">
            Discover Endless Recycling And <br/> Material-Sourcing Opportunities!
            </h2>
            <p className="text-[#666666] mb-4 text-sm md:text-base">
               Whether you're on the search
              for high-quality recyclable materials <br/>  or dependable recycling partners, our marketplace has
              you  <br/>  covered. Best of all, it's free to join! <br/>
              Dive into a world of innovative tools designed to help you achieve <br/>  and exceed your
              sustainability goals.
            </p>

            <Link
              href="/coming-soon"
              className="bg-[#FF8A00] text-white px-6 py-2 rounded-md hover:bg-[#e67e00] transition-colors inline-block w-[140px] text-center text-sm font-medium"
            >
              Market place
            </Link>
          </div>
          <div className="relative h-[300px] md:h-[400px]">
            <Image
              src="/marketplace-image.jpg"
              alt="Recycling materials"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceSection;
