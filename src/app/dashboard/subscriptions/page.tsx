"use client";

import React from 'react';
import Link from 'next/link';
import { Check, X, CreditCard, Calendar, ArrowRight } from 'lucide-react';

// Subscription plan details
const subscriptionPlans = [
  {
    id: 'free',
    name: 'Free Plan',
    price: '0 SEK',
    commission: '9%',
    features: [
      'Limited marketplace listings',
      'Limited monthly auctions',
      'Basic reporting',
      'Participation in discussion forums'
    ],
    notIncluded: [
      'Advanced sample request functionality',
      'Access to contact information',
      'Priority listing and access'
    ],
    current: true
  },
  {
    id: 'standard',
    name: 'Standard Plan',
    price: '599 SEK',
    commission: '7%',
    features: [
      'Unlimited marketplace listings',
      'Unlimited monthly auctions',
      'Advanced reporting',
      'Participation in discussion forums'
    ],
    notIncluded: [
      'Advanced sample request functionality',
      'Access to contact information',
      'Priority listing and access'
    ],
    current: false
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: '799 SEK',
    commission: '0%',
    features: [
      'No commission fees on trades',
      'Advanced sample request functionality',
      'Access to contact information',
      'Priority listing and access',
      'Unlimited marketplace listings',
      'Unlimited monthly auctions',
      'Advanced reporting',
      'Participation in discussion forums'
    ],
    notIncluded: [],
    current: false
  }
];

export default function Subscriptions() {
  return (
    <div className="p-5">
      <h1 className="text-xl font-medium mb-5">Subscription Plans</h1>

      {/* Current Subscription */}
      <div className="bg-white border border-gray-100 rounded-md p-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-sm font-medium text-gray-700">Current Plan</h2>
            <div className="text-base font-medium mt-1">Free Plan</div>
            <div className="text-xs text-gray-500 mt-1">
              Commission rate: 9% on all trades
            </div>
          </div>

          <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Active
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-xs text-gray-500 flex items-center">
            <Calendar size={14} className="mr-1" />
            Next billing date: N/A
          </div>

          <button className="text-[#FF8A00] hover:text-[#e67e00] text-xs font-medium">
            Manage Payment Methods
          </button>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white border rounded-md p-4 ${
              plan.current
                ? 'border-[#FF8A00] ring-1 ring-[#FF8A00]'
                : 'border-gray-100'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-base font-medium">{plan.name}</h3>
              {plan.current && (
                <span className="bg-[#FF8A00] text-white text-xs px-2 py-0.5 rounded-full">
                  Current
                </span>
              )}
            </div>

            <div className="flex items-baseline mb-3">
              <span className="text-xl font-bold">{plan.price}</span>
              <span className="text-xs text-gray-500 ml-1">/month</span>
            </div>

            <div className="text-xs text-gray-500 mb-4">
              Commission rate: {plan.commission} on all trades
            </div>

            <div className="space-y-2 mb-4">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <Check size={14} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-gray-700">{feature}</span>
                </div>
              ))}

              {plan.notIncluded.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <X size={14} className="text-gray-300 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-gray-400">{feature}</span>
                </div>
              ))}
            </div>

            <button
              className={`w-full py-2 rounded-md text-sm ${
                plan.current
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#FF8A00] text-white hover:bg-[#e67e00] transition-colors'
              }`}
              disabled={plan.current}
            >
              {plan.current ? 'Current Plan' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>

      {/* Billing History */}
      <div className="bg-white border border-gray-100 rounded-md p-4">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Billing History</h2>

        <div className="border-t border-gray-100 py-4 text-center">
          <p className="text-sm text-gray-500">No billing history available for Free Plan.</p>
          <Link
            href="/dashboard/subscriptions/billing"
            className="text-[#FF8A00] hover:text-[#e67e00] text-xs font-medium flex items-center justify-center mt-2"
          >
            View all transactions <ArrowRight size={12} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
