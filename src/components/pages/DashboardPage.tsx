"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF8A00]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Greeting */}
      <div className="mb-6">
        <div className="text-gray-600">Hello</div>
        <h1 className="text-2xl font-bold text-gray-900">
          {user?.firstName || user?.username?.split(' ')[0] || 'User'}
        </h1>
      </div>

      {/* Verification Status Alert */}
      <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Your business is under verification</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Thank you for registering your company with Nordic Loop. Our team is currently reviewing your information. You&apos;ll be notified once the verification is complete.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Text */}
      <div className="mb-8">
        <p className="text-gray-700">
          From your account dashboard you can view your <span className="font-medium">recent orders</span>, manage your <span className="font-medium">shipping and billing addresses</span>.
        </p>
      </div>

      {/* No Auction Yet Section */}
      <div className="bg-white p-8 rounded-md border border-gray-200 flex flex-col items-center justify-center text-center">
        <div className="mb-4">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 13.3333L13.3333 26.6667V53.3333L40 66.6667L66.6667 53.3333V26.6667L40 13.3333Z" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M40 66.6667V40" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.3333 26.6667L40 40L66.6667 26.6667" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M26.6667 20L53.3333 33.3333" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">No auction yet</h2>
        <p className="text-gray-600 mb-6">There are no active auction at the moment. Please check back later to place your bid!</p>
        <button className="bg-[#FF8A00] text-white py-3 px-6 rounded hover:bg-[#e67e00] transition-colors">
          Place a bid
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
