"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ExternalLink } from 'lucide-react';

interface MyBidCardProps {
  id: string;
  _id?: string; // Added for ESLint compatibility
  auctionId: string;
  auctionName: string;
  category: string;
  bidAmount: string;
  currentHighestBid: string;
  isHighestBidder: boolean;
  timeLeft: string;
  bidDate: string;
  username: string;
  _username?: string; // Added for ESLint compatibility
  image: string;
  onPlaceBidClick?: () => void;
}

export default function MyBidCard({
  _id, // Prefixed with underscore to indicate it's not used
  auctionId,
  auctionName,
  category,
  bidAmount,
  currentHighestBid,
  isHighestBidder,
  timeLeft,
  bidDate,
  _username, // Prefixed with underscore to indicate it's not used
  image,
  onPlaceBidClick,
}: MyBidCardProps) {
  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="flex h-full">
        {/* Left Section - Image */}
        <div className="w-[100px] h-auto relative flex-shrink-0">
          <div className="absolute inset-0">
            <Image
              src={image}
              alt={auctionName}
              fill
              sizes="100px"
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute top-0 left-0 bg-[#2196F3] px-1.5 py-0.5 rounded-br text-[9px] text-white z-10">
            {category}
          </div>
        </div>

        {/* Middle and Right Sections Combined */}
        <div className="flex flex-1 justify-between p-3">
          {/* Content Section */}
          <div className="flex-1 pr-4">
            <h2 className="text-sm font-medium text-gray-900 line-clamp-1">{auctionName}</h2>
            <div className="text-xs text-gray-500 mt-1 line-clamp-1">
              Bid placed on {formatDate(bidDate)}
            </div>

            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
              <div>
                <div className="text-xs text-gray-500">Your Bid</div>
                <div className="text-sm font-medium">{bidAmount} SEK</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Current Highest</div>
                <div className="text-sm font-medium">{currentHighestBid} SEK</div>
              </div>
              <div className="col-span-2 mt-1">
                {isHighestBidder ? (
                  <div className="text-xs font-medium px-1.5 py-0.5 bg-green-50 text-green-700 rounded-full inline-flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                    Highest Bidder
                  </div>
                ) : (
                  <div className="text-xs font-medium px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded-full inline-flex items-center">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1"></span>
                    Outbid
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Time and Actions */}
          <div className="flex flex-col items-end justify-between">
            {/* Time Left */}
            <div className="text-xs text-gray-500 whitespace-nowrap mb-3">
              {timeLeft} left
            </div>

            {/* Actions */}
            <div className="flex space-x-2 mt-auto">
              {!isHighestBidder && timeLeft !== 'Ended' && onPlaceBidClick && (
                <button
                  onClick={onPlaceBidClick}
                  className="px-2 py-1 bg-[#FF8A00] text-white rounded-md text-xs hover:bg-[#e67e00] transition-colors flex items-center"
                >
                  New Bid
                  <ArrowUpRight size={10} className="ml-1" />
                </button>
              )}
              <Link
                href={`/dashboard/auctions/${auctionId}`}
                className="px-2 py-1 border border-gray-200 text-gray-700 rounded-md text-xs hover:bg-gray-50 transition-colors flex items-center"
              >
                View
                <ExternalLink size={10} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
