import React from 'react';
import Link from 'next/link';

const MarketplaceSection = () => {
  return (
    // Match hero width: use section-margin + full-width grid similar spacing
    <section className="py-12 lg:py-16 section-margin">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 w-full">
        <div className="order-2 lg:order-1 flex flex-col justify-center items-start w-full">
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
        <div className="order-1 lg:order-2 relative flex items-center justify-center">
          <div className="relative w-full max-w-2xl">
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              <video
                className="w-full h-full rounded-2xl shadow-2xl object-cover bg-black"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Tutorial showing Nordic Loop circular materials workflow"
                poster="/hero-image.jpg"
              >
                <source src="https://pub-7515a715eee34bd9ab26b28cbe2f7fa1.r2.dev/General%20Resources/Nordic%20Loop%20Tutorial%20.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#FF8A00]/10 to-[#FF8A00]/5 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-[#1E2A36]/5 to-transparent rounded-full blur-2xl"></div>
            </div>
          </div>
            {/* <Image
              src="/images/landing page/sol-tZw3fcjUIpM-unsplash.jpg"
              alt="Recycling materials"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-lg"
              priority
              loading="eager"
            /> */}
        </div>
      </div>
    </section>
  );
};

export default MarketplaceSection;
