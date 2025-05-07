"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

// Simple Icons
const TransparentPricingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF8A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v12"/>
    <path d="M8 10h8"/>
  </svg>
);

const SecurePaymentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF8A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const QualityAssuranceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF8A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

const AIReportingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF8A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

// Feature Card Component
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <div className="bg-white p-6 flex flex-col items-start text-left h-full">
      <div className="mb-4 text-[#FF8A00]">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-[#1E2A36] mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

const WasteValueSection = () => {
  const autoplayRef = useRef<ReturnType<typeof Autoplay> | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

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

  // Create autoplay plugin instance
  useEffect(() => {
    if (isMobile && autoplayRef.current) {
      if (isPaused) {
        autoplayRef.current.stop();
      } else {
        autoplayRef.current.play();
      }
    }
  }, [isPaused, isMobile]);

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1E2A36] mb-3">
            Turning Waste Into Value<span className="text-[#FF8A00]">.</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
            Our marketplace facilitates the exchange of surplus materials between businesses,
            helping you cut costs and reduce environmental impact.
          </p>
        </div>

        {/* Desktop view - Grid */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>

        {/* Mobile view - Auto-scrolling Carousel */}
        <div className="md:hidden">
          <div className="relative px-6">
            <Carousel
              opts={{
                align: "center",
                loop: true,
                dragFree: true,
              }}
              plugins={[
                Autoplay({
                  delay: 3000,
                  stopOnInteraction: true,
                  stopOnMouseEnter: true,
                }),
              ]}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              className="w-full touch-pan-y"
              setApi={(api) => {
                if (api) {
                  const plugins = api.plugins();
                  const autoplay = plugins.autoplay as ReturnType<typeof Autoplay> | undefined;
                  if (autoplay) {
                    autoplayRef.current = autoplay;
                  }
                }
              }}
            >
              <CarouselContent className="-ml-2">
                {features.map((feature, index) => (
                  <CarouselItem key={index} className="basis-full pl-2">
                    <div className="px-2 py-1">
                      <FeatureCard
                        title={feature.title}
                        description={feature.description}
                        icon={feature.icon}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Positioned navigation buttons */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10">
                <CarouselPrevious className="relative bg-[#1E2A36] hover:bg-[#2a3a4a] border-none text-white h-12 w-12 rounded-full shadow-md" />
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                <CarouselNext className="relative bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 h-12 w-12 rounded-full shadow-md" />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WasteValueSection;
