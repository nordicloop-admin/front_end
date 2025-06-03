"use client";

import React from 'react';
import Link from 'next/link';

const PricingPage = () => {
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

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {/* Free Plan */}
        <div className="bg-gray-50 rounded-lg p-8 flex flex-col h-full">
          <div className="mb-8">
            <h3 className="text-[#008066] font-semibold text-xl mb-4">Free Plan</h3>
            <div className="flex items-end mb-4">
              <span className="text-3xl font-bold">Free</span>
              <span className="text-gray-500 ml-2">/ Month</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8 flex-grow">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Limited marketplace listings</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Limited monthly auctions</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Basic reporting</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Participation in discussion forums for industry insights</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>9% commission fee on trades</span>
            </li>
          </ul>

          <Link
            href="/coming-soon"
            className="block text-center py-3 px-6 border border-gray-300 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Standard Plan */}
        <div className="bg-gray-50 rounded-lg p-8 flex flex-col h-full">
          <div className="mb-8">
            <h3 className="text-[#008066] font-semibold text-xl mb-4">Standard Plan</h3>
            <div className="flex items-end mb-4">
              <span className="text-3xl font-bold">599 SEK</span>
              <span className="text-gray-500 ml-2">/ Month</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8 flex-grow">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Unlimited marketplace listings</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Unlimited monthly auctions</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Advanced reporting</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Participation in discussion forums for industry insights</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>7% commission fee on trades</span>
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

        {/* Premium Plan */}
        <div className="bg-gray-50 rounded-lg p-8 flex flex-col h-full relative">
          <div className="mb-8">
            <h3 className="text-[#008066] font-semibold text-xl mb-4">Premium Plan</h3>
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
              <span>Priority listing and access</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Unlimited marketplace listings</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Unlimited monthly auctions</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Advanced reporting</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1"></div>
              <span>Participation in discussion forums for industry insights</span>
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
      </div>
    </div>
  );
};

export default PricingPage;
