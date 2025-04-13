import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const MarketplaceSection = () => {
  return (
    <section className="py-10 md:py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-3 text-[#1E2A36]">Waste Marketplace</h3>
            <p className="text-[#666666] mb-4 text-sm md:text-base">
              Discover endless recycling and material-sourcing opportunities! Whether you're on the search
              for high-quality recyclable materials or dependable recycling partners, our marketplace has
              you covered. Best of all, it's free to join!
            </p>
            <p className="text-[#666666] mb-6 text-sm md:text-base">
              Dive into a world of innovative tools designed to help you achieve and exceed your
              sustainability goals.
            </p>
            <Link
              href="/marketplace"
              className="bg-[#FF8A00] text-white px-6 py-2 rounded-md hover:bg-[#e67e00] transition-colors inline-block w-[140px] text-center text-sm font-medium"
            >
              Marketplace →
            </Link>
          </div>
          <div className="relative h-[300px] md:h-[350px]">
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
