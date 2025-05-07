"use client";

import React from 'react';
import Image from 'next/image';

// Custom Icons for Feature Cards
const TransparentPricingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
    <path d="M20 16v-4a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2v4" />
    <path d="M20 16H10a2 2 0 1 1 0-4h10a2 2 0 1 1 0 4Z" />
  </svg>
);

const SecurePaymentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const QualityAssuranceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

const AIReportingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
    <line x1="6" y1="6" x2="6.01" y2="6"/>
    <line x1="6" y1="18" x2="6.01" y2="18"/>
  </svg>
);

// Feature Card Component
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}

const FeatureCard = ({ title, description, icon, index }: FeatureCardProps) => {
  // Different background colors for each card
  const bgColors = [
    "bg-gray-300", // Transparent pricing - light gray
    "bg-white",    // 100% secure - white
    "bg-white",    // Quality assurance - white
    "bg-gray-300"  // AI Reporting - light gray
  ];

  return (
    <div className={`${bgColors[index]} p-6 rounded-xl shadow-md flex flex-col items-center text-center h-full`}>
      <h3 className="text-xl font-bold text-[#1E2A36] mb-4">{title}</h3>
      <p className="text-gray-700 mb-6">{description}</p>
      <div className="mt-auto">
        {icon}
      </div>
    </div>
  );
};

const WasteValueSection = () => {

  const features = [
    {
      title: "Transparent pricing",
      description: "Buy and sell surplus materials through our bidding system marketplace",
      icon: <TransparentPricingIcon />
    },
    {
      title: "100% secure",
      description: "Trust our escrow payment system for safe material exchanges",
      icon: <SecurePaymentIcon />
    },
    {
      title: "Quality assurance",
      description: "Test material quality before committing to larger purchases",
      icon: <QualityAssuranceIcon />
    },
    {
      title: "AI Reporting",
      description: "Track and document your environmental impact with AI-powered analytics",
      icon: <AIReportingIcon />
    }
  ];

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
    <>
      <section className="bg-[#1E2A36] py-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* Main heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Turning Waste Into Value<span className="text-[#FF8A00]">.</span>
            </h2>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Endorsements section with light gray background */}
      <section className="bg-gray-100 py-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Desktop layout */}
            <div className="hidden md:flex items-center">
              <div className="w-1/4">
                <h3 className="text-2xl font-semibold text-[#1E2A36]">
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
    </>
  );
};

export default WasteValueSection;
