import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const MarketplaceSection = () => {
  return (
    <section className="py-8 md:py-12 section-margin">
      <div className="container mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="order-1 md:order-1">
            <h3 className="text-md md:text-md font-semibold mb-3 text-[#1E2A36]">Waste Marketplace</h3>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-[#1E2A36]">
              Discover Endless Recycling And <br className="hidden md:block"/> Material-Sourcing Opportunities!
            </h2>
            <p className="text-[#666666] mb-6 text-sm md:text-base">
              Whether you&apos;re on the search for high-quality recyclable materials
              or dependable recycling partners, our marketplace has you
              covered. Best of all, it&apos;s free to join!<br/>
              Dive into a world of innovative tools designed to help you achieve
              and exceed your sustainability goals.
            </p>

            <Link
              href="/market-place"
              className="bg-[#FF8A00] text-white px-8 py-4 w-[200px] rounded-md hover:bg-[#e67e00] transition-colors inline-block text-center text-sm font-medium"
            >
              Market place
            </Link>
          </div>
          <div className="order-2 md:order-2 relative h-[300px] md:h-[400px] mt-8 md:mt-0">
            {/* <Image
              src="/images/landing page/sol-tZw3fcjUIpM-unsplash.jpg"
              alt="Recycling materials"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-lg"
              priority
              loading="eager"
            /> */}
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Tutorial showing Nordic Loop circular materials workflow"
              poster="/hero-image.jpg"
            >
              <source src="https://pub-7515a715eee34bd9ab26b28cbe2f7fa1.r2.dev/General%20Resources/Nordic%20Loop%20Tutorial%20.mp4" type="video/mp4" />
              {/* Fallback text */}
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceSection;
