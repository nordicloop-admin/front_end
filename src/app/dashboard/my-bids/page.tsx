"use client";

import React, { useState, useEffect } from 'react';
import { Clock, ArrowUpRight, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for user's bids
const initialBids = [
  {
    id: '1',
    auctionId: '1',
    auctionName: 'PPA Thermocomp UFW49RSC (Black)',
    category: 'Plastics',
    bidAmount: '5,250,000',
    currentHighestBid: '5,250,000',
    isHighestBidder: true,
    timeLeft: '2d 4h',
    bidDate: '2023-06-15T10:30:00Z',
    image: '/images/marketplace/categories/plastics.jpg'
  },
  {
    id: '2',
    auctionId: '3',
    auctionName: 'Aluminum Scrap 6061',
    category: 'Metals',
    bidAmount: '7,400,000',
    currentHighestBid: '7,500,000',
    isHighestBidder: false,
    timeLeft: '3d 6h',
    bidDate: '2023-06-14T14:45:00Z',
    image: '/images/marketplace/categories/metals.jpg'
  }
];

export default function MyBids() {
  const [bids, setBids] = useState(initialBids);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading bids from API
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

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
    <div className="p-5">
      <h1 className="text-xl font-medium mb-5">My Bids</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF8A00]"></div>
        </div>
      ) : bids.length > 0 ? (
        <div className="space-y-4">
          {bids.map((bid) => (
            <div key={bid.id} className="bg-white border border-gray-100 rounded-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-40 md:h-auto md:w-48 flex-shrink-0">
                  <Image
                    src={bid.image}
                    alt={bid.auctionName}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs">
                    {bid.category}
                  </div>
                </div>
                
                <div className="p-4 flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-base font-medium text-gray-900">{bid.auctionName}</h2>
                      <div className="text-xs text-gray-500 mt-1">
                        Bid placed on {formatDate(bid.bidDate)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-xs">
                        <Clock size={12} className="mr-1 text-gray-500" />
                        <span>{bid.timeLeft} left</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Your Bid</div>
                      <div className="text-sm font-medium">{bid.bidAmount} SEK</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500">Current Highest Bid</div>
                      <div className="text-sm font-medium">{bid.currentHighestBid} SEK</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500">Status</div>
                      {bid.isHighestBidder ? (
                        <div className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-full inline-flex items-center">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                          Highest Bidder
                        </div>
                      ) : (
                        <div className="text-xs font-medium px-2 py-1 bg-amber-50 text-amber-700 rounded-full inline-flex items-center">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1"></span>
                          Outbid
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    {!bid.isHighestBidder && (
                      <Link
                        href={`/dashboard/auctions/${bid.auctionId}`}
                        className="px-3 py-1.5 bg-[#FF8A00] text-white rounded-md text-xs hover:bg-[#e67e00] transition-colors flex items-center"
                      >
                        Place New Bid
                        <ArrowUpRight size={12} className="ml-1" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-md p-6 text-center">
          <div className="flex flex-col items-center">
            <AlertCircle size={24} className="text-gray-400 mb-2" />
            <h3 className="text-base font-medium text-gray-900">No bids yet</h3>
            <p className="text-gray-500 text-sm mt-1">You haven't placed any bids on auctions yet.</p>
            <Link
              href="/dashboard/auctions"
              className="mt-4 px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors"
            >
              Browse Auctions
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
