"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('annually');

  return (
    <div className="py-16">
      {/* Pricing Header */}
      <div className="text-center mb-12">
        <h3 className="text-[#FF8A00] font-medium mb-4">Pricing</h3>
        <h1 className="text-4xl font-bold mb-4">Flexible Business Plans for<br />Sustainable Growth</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Flexible plans for every business; whether you&apos;re just starting or looking to scale sustainability.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-16">
        <div className="bg-gray-100 rounded-full p-1 inline-flex">
          <button
            className={`px-6 py-2 rounded-full text-sm font-medium ${
              billingCycle === 'annually' ? 'bg-black text-white' : 'text-gray-700'
            }`}
            onClick={() => setBillingCycle('annually')}
          >
            Annually
          </button>
          <button
            className={`px-6 py-2 rounded-full text-sm font-medium ${
              billingCycle === 'monthly' ? 'bg-black text-white' : 'text-gray-700'
            }`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {/* Basic Package */}
        <div className="bg-gray-50 rounded-lg p-8 flex flex-col h-full">
          <div className="mb-8">
            <h3 className="text-[#008066] font-semibold text-xl mb-4">Basic Package</h3>
            <div className="flex items-end mb-4">
              <span className="text-3xl font-bold">Free</span>
              <span className="text-gray-500 ml-2">/ Month</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8 flex-grow">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Limited listing on the market place</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Limited auctions per month</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Basic reporting</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Participate in discussion forums to share and gain industry insights</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>0.5% commission fee on trades</span>
            </li>
          </ul>

          <Link
            href="/coming-soon"
            className="block text-center py-3 px-6 border border-gray-300 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Premium */}
        <div className="bg-gray-50 rounded-lg p-8 flex flex-col h-full relative">
          <div className="mb-8">
            <h3 className="text-[#008066] font-semibold text-xl mb-4">Premium</h3>
            <div className="flex items-end mb-4">
              <span className="text-3xl font-bold">799 SEK</span>
              <span className="text-gray-500 ml-2">/ Month</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8 flex-grow">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>No commission fees on trades</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Advanced sample request functionality</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Access to contact information</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Priority access and listing</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Unlimited listing on the market place</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Unlimited auctions per month</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Advanced reporting</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Participate in discussion forums to share and gain industry insights</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Verified account status and company ratings</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Premium customer support with faster response times</span>
            </li>
          </ul>

          <Link
            href="/coming-soon"
            className="block text-center py-3 px-6 bg-[#FF8A00] text-white rounded-md font-medium hover:bg-[#e67e00] transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Standard */}
        <div className="bg-gray-50 rounded-lg p-8 flex flex-col h-full">
          <div className="mb-8">
            <h3 className="text-[#008066] font-semibold text-xl mb-4">Standard</h3>
            <div className="flex items-end mb-4">
              <span className="text-3xl font-bold">599 SEK</span>
              <span className="text-gray-500 ml-2">/ Month</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8 flex-grow">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Unlimited listing on the market place</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Unlimited auctions per month</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Advanced reporting</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Participate in discussion forums to share and gain industry insights</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>0.25% commission fee on trades</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Verified account status and company ratings</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Premium customer support with faster response times</span>
            </li>
          </ul>

          <Link
            href="/coming-soon"
            className="block text-center py-3 px-6 border border-gray-300 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
