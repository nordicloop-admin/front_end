"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, AlertCircle } from 'lucide-react';
import { getPricingData, PricingData, PricingPlan } from '@/services/pricing';

// Component for rendering individual pricing plan
const PricingPlanCard = ({ plan, ctaText, ctaUrl }: { plan: PricingPlan; ctaText: string; ctaUrl: string }) => {
  const isPremium = plan.plan_type === 'premium';

  return (
    <div className={`bg-gray-50 rounded-lg p-8 flex flex-col h-full relative ${plan.is_popular ? 'ring-2 ring-[#FF8A00]' : ''}`}>
      {plan.is_popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-[#FF8A00] text-white px-4 py-1 rounded-full text-xs font-medium">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-8">
        <h3 className="font-semibold text-xl mb-4" style={{ color: plan.color }}>
          {plan.name}
        </h3>
        <div className="flex items-end mb-4">
          <span className="text-3xl font-bold">
            {plan.price === 0 ? 'Free' : `${plan.price} ${plan.currency}`}
          </span>
          {plan.price > 0 && <span className="text-gray-500 ml-2">/ Month</span>}
        </div>
      </div>

      <ul className="space-y-4 mb-8 flex-grow">
        {plan.features.map((feature) => (
          <li key={feature.id} className="flex items-start">
            <div className={`flex-shrink-0 h-5 w-5 rounded-full mr-3 mt-1 ${
              feature.is_highlighted
                ? 'bg-[#FF8A00]'
                : 'bg-gray-200'
            }`}></div>
            <span className={`${
              feature.is_included ? '' : 'line-through text-gray-400'
            } ${
              feature.is_highlighted ? 'font-medium text-gray-900' : ''
            }`}>
              {feature.feature_text}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href={ctaUrl}
        className={`block text-center py-3 px-6 rounded-md font-medium transition-colors ${
          isPremium
            ? 'bg-[#FF8A00] text-white hover:bg-[#e67e00]'
            : 'border border-gray-300 hover:bg-gray-100'
        }`}
      >
        {ctaText}
      </Link>
    </div>
  );
};

const PricingPage = () => {
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        setIsLoading(true);
        const response = await getPricingData();

        if (response.error) {
          setError(response.error);
        } else if (response.data?.success) {
          setPricingData(response.data.data);
        } else {
          setError('Failed to load pricing data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPricingData();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="py-16 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-[#FF8A00] mx-auto mb-4" />
          <p className="text-gray-600">Loading pricing information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !pricingData) {
    return (
      <div className="py-16 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle size={32} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-2">Failed to load pricing information</p>
          <p className="text-gray-500 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { page_content, pricing_plans } = pricingData;

  return (
    <div className="py-16">
      {/* Pricing Header */}
      <div className="text-center mb-12">
        <h3 className="text-[#FF8A00] font-medium mb-4">{page_content.section_label}</h3>
        <h1 className="text-4xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: page_content.title.replace(/\n/g, '<br />') }} />
        <p className="text-gray-600 max-w-2xl mx-auto">
          {page_content.subtitle}
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {pricing_plans.map((plan) => (
          <PricingPlanCard
            key={plan.id}
            plan={plan}
            ctaText={page_content.cta_text}
            ctaUrl={page_content.cta_url}
          />
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
