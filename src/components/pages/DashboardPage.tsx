"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Info, Package, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { getTimeUntilExpiration, forceTokenExpiration } from '@/services/auth';

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tokenTimeLeft, setTokenTimeLeft] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Update token time left every second (for development testing)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const updateTokenTime = () => {
        setTokenTimeLeft(getTimeUntilExpiration());
      };

      updateTokenTime();
      const interval = setInterval(updateTokenTime, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FF8A00]"></div>
      </div>
    );
  }

  return (
    <div className="p-5">
      {/* Development Token Status */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 p-3 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock size={16} className="text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-yellow-800">
                Token expires in: {formatTime(tokenTimeLeft)}
              </span>
            </div>
            <button
              onClick={forceTokenExpiration}
              className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
            >
              Test Expiration
            </button>
          </div>
          {tokenTimeLeft < 300 && tokenTimeLeft > 0 && (
            <div className="mt-2 flex items-center">
              <AlertTriangle size={14} className="text-orange-500 mr-1" />
              <span className="text-xs text-orange-700">Token will expire soon!</span>
            </div>
          )}
        </div>
      )}

      {/* Greeting */}
      <div className="mb-5">
        <div className="text-gray-500 text-sm">Hello</div>
        <h1 className="text-xl font-medium text-gray-900">
          {user?.firstName || user?.username?.split(' ')[0] || 'User'}
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-100 rounded-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-700">Active Bids</h2>
            <div className="text-[#FF8A00]">
              <Package size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">2</div>
          <Link
            href="/dashboard/my-auctions"
            className="text-[#FF8A00] hover:text-[#e67e00] text-xs font-medium flex items-center"
          >
            View all bids <ArrowRight size={12} className="ml-1" />
          </Link>
        </div>

        <div className="bg-white border border-gray-100 rounded-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-700">Subscription</h2>
            <div className="text-green-500">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.5 12L10.5 15L16.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="text-sm font-medium mb-1">Free Plan</div>
          <Link
            href="/dashboard/subscriptions"
            className="text-[#FF8A00] hover:text-[#e67e00] text-xs font-medium flex items-center"
          >
            Upgrade plan <ArrowRight size={12} className="ml-1" />
          </Link>
        </div>

        <div className="bg-white border border-gray-100 rounded-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-700">Verification</h2>
            <div className="text-blue-500">
              <Info size={18} />
            </div>
          </div>
          <div className="text-sm font-medium mb-1">Pending</div>
          <span className="text-xs text-gray-500">
            Your business is under verification
          </span>
        </div>
      </div>

      {/* Verification Status Alert */}
      <div className="mb-6 bg-blue-50 border border-blue-100 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info size={16} className="text-blue-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-700">Your business is under verification</h3>
            <div className="mt-1 text-xs text-blue-600">
              <p>Thank you for registering your company with Nordic Loop. Our team is currently reviewing your information. You&apos;ll be notified once the verification is complete.</p>
            </div>
          </div>
        </div>
      </div>

      {/* No Auction Yet Section */}
      <div className="bg-white border border-gray-100 rounded-md p-6 flex flex-col items-center justify-center text-center">
        <div className="mb-4 text-gray-300">
          <Package size={48} />
        </div>
        <h2 className="text-base font-medium text-gray-800 mb-2">No active auctions</h2>
        <p className="text-sm text-gray-500 mb-4">There are no active auctions at the moment. Please check back later to place your bid!</p>
        <button className="bg-[#FF8A00] text-white py-2 px-5 rounded-md hover:bg-[#e67e00] transition-colors text-sm">
          Place a bid
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
