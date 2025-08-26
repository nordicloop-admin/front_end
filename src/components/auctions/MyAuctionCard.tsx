"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface MyAuctionCardProps {
  id: string;
  name: string;
  category: string;
  volume: string;
  basePrice: string;
  timeLeft: string | undefined;
  image: string;
  status?: string;
  auctionStatus?: string;
  onEditClick?: () => void;
}

export default function MyAuctionCard({
  id,
  name,
  category,
  volume,
  basePrice,
  timeLeft,
  image,
  status,
  auctionStatus,
  onEditClick,
}: MyAuctionCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="flex h-full">
        {/* Left Section - Image */}
        <div className="w-[100px] h-auto relative flex-shrink-0">
          <div className="absolute inset-0">
            <Image
              src={image}
              alt={name}
              fill
              sizes="100px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Middle and Right Sections Combined */}
        <div className="flex flex-1 justify-between p-3">
          {/* Content Section */}
          <div className="flex-1 pr-4">
            <div className="flex justify-between items-start">
              <h2 className="text-sm font-medium text-gray-900 line-clamp-1">{name}</h2>
              {auctionStatus && (
                <span className={`text-xs px-1.5 py-0.5 rounded-sm font-medium ${
                  ['suspended', 'Suspended'].includes(status || auctionStatus) ? 'bg-red-50 text-red-700' :
                  ['active', 'Active'].includes(status || auctionStatus) ? 'bg-green-50 text-green-700' : 
                  ['completed', 'won', 'Won', 'Completed'].includes(status || auctionStatus) ? 'bg-blue-50 text-blue-700' :
                  ['closed', 'ended', 'Closed', 'Ended'].includes(status || auctionStatus) ? 'bg-gray-50 text-gray-700' :
                  'bg-yellow-50 text-yellow-700'
                }`}>
                  {auctionStatus}
                </span>
              )}
            </div>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <span>Category: {category}</span>
              <span className="mx-1.5">•</span>
              <span>Volume: {volume}</span>
            </div>
            <div className="mt-2 flex items-baseline">
              <div className="text-xs text-gray-500 mr-1">Base price:</div>
              <div className="text-sm font-medium text-[#FF8A00]">{basePrice}</div>
            </div>
          </div>

          {/* Time and Actions */}
          <div className="flex flex-col items-end justify-between">
            {/* Time Left */}
            <div className="text-xs text-gray-500 whitespace-nowrap mb-3">
              {timeLeft ? `${timeLeft} left` : 'Time pending'}
            </div>

            {/* Actions */}
            <div className="flex space-x-2 mt-auto">
              <button
                onClick={onEditClick}
                className="px-2 py-1 border border-gray-200 rounded-md text-xs text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Edit
              </button>
              <Link
                href={`/dashboard/my-auctions/${id}`}
                className="px-2 py-1 bg-[#FF8A00] text-white rounded-md text-xs hover:bg-[#e67e00] transition-colors flex items-center"
              >
                View
                <ArrowUpRight size={10} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
