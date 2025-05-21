"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowUpRight, ExternalLink } from 'lucide-react';

interface AuctionCardProps {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  basePrice: string;
  currentBid?: string;
  timeLeft: string;
  volume: string;
  image: string;
  status?: 'active' | 'ended' | 'pending';
  isMyAuction?: boolean;
  isMyBid?: boolean;
  bidAmount?: string;
  bidDate?: string;
  username?: string;
  isHighestBidder?: boolean;
  onEditClick?: () => void;
  onPlaceBidClick?: () => void;
}

export default function AuctionCard({
  id,
  name,
  category,
  subcategory,
  basePrice,
  currentBid,
  timeLeft,
  volume,
  image,
  status = 'active',
  isMyAuction = false,
  isMyBid = false,
  bidAmount,
  bidDate,
  username,
  isHighestBidder,
  onEditClick,
  onPlaceBidClick,
}: AuctionCardProps) {
  // Format date to readable string if provided
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
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
    <div className="bg-white border border-gray-100 rounded-md overflow-hidden">
      <div className="flex">
        {/* Image Section */}
        <div className="relative w-[120px] h-[120px] flex-shrink-0">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs">
            {category}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4">
          <div className="flex flex-col h-full">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-base font-medium text-gray-900 line-clamp-1">{name}</h2>
                <div className="text-xs text-gray-500 mt-0.5">
                  {isMyBid ? (
                    <>Bid placed on {formatDate(bidDate)} by {username}</>
                  ) : (
                    <>
                      {subcategory ? `${category}: ${subcategory}` : category} • {volume}
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500 whitespace-nowrap ml-2">
                <Clock size={12} className="mr-1" />
                <span>{timeLeft}</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="flex justify-between items-center mt-auto">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {isMyBid ? (
                  <>
                    <div>
                      <div className="text-xs text-gray-500">Your Bid</div>
                      <div className="text-sm font-medium text-[#FF8A00]">{bidAmount}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Current Highest</div>
                      <div className="text-sm font-medium">{currentBid}</div>
                    </div>
                    {isHighestBidder !== undefined && (
                      <div className="col-span-2 mt-1">
                        {isHighestBidder ? (
                          <div className="text-xs font-medium px-2 py-0.5 bg-green-50 text-green-700 rounded-full inline-flex items-center">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                            Highest Bidder
                          </div>
                        ) : (
                          <div className="text-xs font-medium px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full inline-flex items-center">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1"></span>
                            Outbid
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <div className="text-xs text-gray-500">Base price</div>
                      <div className="text-sm font-medium text-[#FF8A00]">{basePrice}</div>
                    </div>
                    {currentBid && (
                      <div>
                        <div className="text-xs text-gray-500">Current Bid</div>
                        <div className="text-sm font-medium">{currentBid}</div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Actions Section */}
              <div className="flex space-x-2 ml-2">
                {isMyAuction && onEditClick && (
                  <button
                    onClick={onEditClick}
                    className="px-3 py-1.5 border border-gray-100 rounded-md text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </button>
                )}
                
                {isMyBid && !isHighestBidder && timeLeft !== 'Ended' && onPlaceBidClick && (
                  <button
                    onClick={onPlaceBidClick}
                    className="px-3 py-1.5 bg-[#FF8A00] text-white rounded-md text-xs hover:bg-[#e67e00] transition-colors flex items-center"
                  >
                    Place New Bid
                    <ArrowUpRight size={12} className="ml-1" />
                  </button>
                )}
                
                <Link
                  href={isMyAuction ? `/dashboard/my-auctions/${id}` : `/dashboard/auctions/${id}`}
                  className="px-3 py-1.5 border border-gray-100 text-gray-700 rounded-md text-xs hover:bg-gray-50 transition-colors flex items-center"
                >
                  View Details
                  {isMyBid ? (
                    <ExternalLink size={12} className="ml-1" />
                  ) : (
                    <ArrowUpRight size={12} className="ml-1" />
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
