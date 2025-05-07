import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FullWidthSection from '../layout/FullWidthSection';

const FeaturesSection = () => {
  return (
    <FullWidthSection backgroundColor="#F5F5F5">
      <section className="mx-auto max-w-[86%] section-margin mb-6 md:mb-10 mt-8 md:mt-12">
        {/* Sample Requests Feature */}
        <div className="bg-white rounded-corners sections-padding mb-8 md:mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-1 md:order-1 relative h-[250px] md:h-[300px]">
              <Image
                src="/images/landing page/slava-kompaniets-L2XiRnvJVz0-unsplash.jpg"
                alt="Sample Requests"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-2xl"
                priority
                loading="eager"
              />
            </div>
            <div className="order-2 md:order-2">
              <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-[#1E2A36]">
                Sample Requests<span className="text-[#FF8A00]">.</span>
              </h3>
              <p className="text-[#666666] mb-6 text-sm md:text-base leading-relaxed">
                Preview material quality with our unique sample request feature, ensuring perfect matches before committing to a trade.
              </p>
              <Link
                href="/coming-soon"
                className="bg-[#FF8A00] text-white px-8 py-4 w-[200px] rounded-md hover:bg-[#e67e00] transition-colors inline-block text-center text-sm font-medium"
              >
                Market Place →
              </Link>
            </div>
          </div>
        </div>

        {/* Secure Transactions Feature */}
        <div className="bg-white rounded-corners sections-padding">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-[#1E2A36]">
                Secure Transactions<span className="text-[#FF8A00]">.</span>
              </h3>
              <p className="text-[#666666] mb-6 text-sm md:text-base leading-relaxed">
                Using advanced tools designed to ensure secure, reliable, and seamless exchanges, fostering trust and efficiency in every transaction.
              </p>
              <Link
                href="/coming-soon"
                className="bg-[#FF8A00] text-white px-8 py-4 w-[200px] rounded-md hover:bg-[#e67e00] transition-colors inline-block text-center text-sm font-medium"
              >
                Get Started →
              </Link>
            </div>
            <div className="order-1 md:order-2 relative h-[250px] md:h-[300px]">
              <Image
                src="/images/landing page/amina-atar-Mqc-m8kgxkg-unsplash.jpg"
                alt="Secure Transactions"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-2xl"
                priority
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>
    </FullWidthSection>
  );
};

export default FeaturesSection;
