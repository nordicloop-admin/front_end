"use client";

import React from 'react';
import Image from 'next/image';

const EndorsedSection = () => {
  const endorsements = [
    {
      name: "Venture Cup",
      logo: "/images/landing page/Endorsed images/venture cup.png",
      width: 70,
      height: 70
    },
    {
      name: "Founders Loft",
      logo: "/images/landing page/Endorsed images/founders loft.png",
      width: 130,
      height: 55
    },
    {
      name: "Connect",
      logo: "/images/landing page/Endorsed images/connect.png",
      width: 110,
      height: 30
    }
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Desktop layout */}
          <div className="hidden md:flex items-center">
            <div className="w-1/4">
              <h3 className="text-xl font-semibold text-[#1E2A36]">
                Endorsed by
              </h3>
            </div>
            <div className="w-3/4 flex items-center justify-between">
              {endorsements.map((endorsement, index) => (
                <div key={index} className="flex items-center justify-center px-4">
                  <Image
                    src={endorsement.logo}
                    alt={`${endorsement.name} logo`}
                    width={endorsement.width}
                    height={endorsement.height}
                    className="opacity-100"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile layout */}
          <div className="md:hidden">
            <h3 className="text-xl font-semibold text-[#1E2A36] mb-8 text-center">
              Endorsed by
            </h3>
            <div className="flex flex-wrap items-center justify-around gap-8">
              {endorsements.map((endorsement, index) => (
                <div key={index} className="flex items-center justify-center">
                  <Image
                    src={endorsement.logo}
                    alt={`${endorsement.name} logo`}
                    width={endorsement.width}
                    height={endorsement.height}
                    className="opacity-100"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EndorsedSection;
