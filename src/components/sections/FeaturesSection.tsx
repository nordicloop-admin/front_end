import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FullWidthSection from '../layout/FullWidthSection';

const FeaturesSection = () => {
  return (
    <FullWidthSection backgroundColor="#F5F5F5">
      <section className="sections-margin max-w-[86%] mx-auto rounded-corners">
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sample Requests Feature */}
            <div className="bg-white rounded-lg overflow-hidden rounded-corners sections-padding">
              <div className="relative h-[300px] ">
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
              <div className="pt-4">
                <h3 className="text-lg font-semibold mb-2 text-[#1E2A36]">Sample Requests</h3>
                <p className="text-[#666666] mb-4 text-sm">
                  Preview material quality with our unique sample request feature, ensuring perfect matches before committing to a trade.
                </p>
                <Link
                  href="/coming-soon"
                  className="bg-[#FF8A00] text-white px-8 py-4 w-[200px] rounded-md hover:bg-[#e67e00] transition-colors inline-block text-xs text-center font-medium"
                >
                  Market Place
                </Link>
              </div>
            </div>

            {/* Secure Transactions Feature */}
            <div className="bg-white rounded-lg overflow-hidden sections-padding rounded-corners">
              <div className="relative h-[300px]">
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
              <div className="pt-4">
                <h3 className="text-lg font-semibold mb-2 text-[#1E2A36]">Secure Transactions</h3>
                <p className="text-[#666666] mb-4 text-sm">
                  Using advanced tools designed to ensure secure, reliable, and seamless exchanges, fostering trust and efficiency in every transaction.
                </p>
                <Link
                  href="/coming-soon"
                  className="bg-[#FF8A00] text-white px-8 py-4 w-[200px] rounded-md hover:bg-[#e67e00] transition-colors inline-block text-xs text-center font-medium"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </FullWidthSection>
  );
};

export default FeaturesSection;
