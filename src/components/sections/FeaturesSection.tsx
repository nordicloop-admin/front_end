import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const FeaturesSection = () => {
  return (
    <section className="py-10 md:py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sample Requests Feature */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-[200px]">
              <Image
                src="/sample-requests.jpg"
                alt="Sample Requests"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-[#1E2A36]">Sample Requests</h3>
              <p className="text-[#666666] mb-4 text-sm">
                Preview material quality with our unique sample request feature, ensuring perfect matches before committing to a trade.
              </p>
              <Link
                href="/contact"
                className="bg-[#FF8A00] text-white px-4 py-2 rounded-md hover:bg-[#e67e00] transition-colors inline-block text-xs w-[120px] text-center font-medium"
              >
                Contact us →
              </Link>
            </div>
          </div>

          {/* Secure Transactions Feature */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-[200px]">
              <Image
                src="/secure-transactions.jpg"
                alt="Secure Transactions"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-[#1E2A36]">Secure Transactions</h3>
              <p className="text-[#666666] mb-4 text-sm">
                Using advanced tools designed to ensure secure, reliable, and seamless exchanges, fostering trust and efficiency in every transaction.
              </p>
              <Link
                href="/pricing"
                className="bg-[#FF8A00] text-white px-4 py-2 rounded-md hover:bg-[#e67e00] transition-colors inline-block text-xs w-[140px] text-center font-medium"
              >
                Get Started Today →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
