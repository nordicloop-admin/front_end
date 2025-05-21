"use client";

import React, { useState, useEffect } from 'react';
import { Clock, ArrowUpRight, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getUserBids, UserBidResponse } from '@/services/bid';
import { getAuctionById } from '@/services/auction';
import { toast } from 'sonner';

// Using UserBidResponse from bid service

// Interface for auction data
interface AuctionData {
  id: number;
  item_name: string;
  category?: string;
  description: string;
  base_price: string;
  volume: string;
  unit: string;
  country_of_origin: string;
  end_date: string;
  end_time: string;
  item_image: string | null;
}

// Interface for combined bid and auction data
interface UserBid {
  id: string;
  auctionId: string;
  auctionName: string;
  category: string;
  bidAmount: string;
  currentHighestBid: string;
  isHighestBidder: boolean;
  timeLeft: string;
  bidDate: string;
  image: string;
  username: string;
}

export default function MyBids() {
  const [bids, setBids] = useState<UserBid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate time left for an auction
  const calculateTimeLeft = (endDate: string, endTime: string) => {
    const now = new Date();
    const end = new Date(`${endDate}T${endTime}`);

    if (end <= now) {
      return 'Ended';
    }

    const diffMs = end.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return `${diffDays}d ${diffHours}h`;
  };

  // Fetch user bids from API
  useEffect(() => {
    const fetchUserBids = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get user bids
        const bidsResponse = await getUserBids();

        if (bidsResponse.error) {
          console.error('Error fetching user bids:', bidsResponse.error);
          setError(bidsResponse.error);
          setIsLoading(false);
          return;
        }

        if (!bidsResponse.data || bidsResponse.data.length === 0) {
          // No bids found
          setBids([]);
          setIsLoading(false);
          return;
        }

        // Process each bid to get auction details
        const userBidsPromises = bidsResponse.data.map(async (bid: UserBidResponse) => {
          try {
            // Get auction details for this bid
            const auctionResponse = await getAuctionById(bid.ad_id);

            if (auctionResponse.error || !auctionResponse.data) {
              console.error(`Error fetching auction ${bid.ad_id}:`, auctionResponse.error);
              return null;
            }

            const auction = auctionResponse.data;

            // Create a formatted bid object
            return {
              id: bid.bid_id.toString(),
              auctionId: auction.id.toString(),
              auctionName: auction.item_name,
              category: auction.category || 'Unknown',
              bidAmount: bid.amount,
              currentHighestBid: auction.base_price, // This is a placeholder, we don't know the current highest bid
              isHighestBidder: false, // This is a placeholder, we don't know if user is highest bidder
              timeLeft: calculateTimeLeft(auction.end_date, auction.end_time),
              bidDate: bid.timestamp,
              image: auction.item_image || '/images/marketplace/categories/plastics.jpg', // Fallback image
              username: bid.username
            };
          } catch (error) {
            console.error(`Error processing bid ${bid.bid_id}:`, error);
            return null;
          }
        });

        // Wait for all promises to resolve
        const userBids = await Promise.all(userBidsPromises);

        // Filter out null values (failed auction fetches)
        const validBids = userBids.filter(bid => bid !== null) as UserBid[];

        // Sort bids by date (newest first)
        validBids.sort((a, b) => new Date(b.bidDate).getTime() - new Date(a.bidDate).getTime());

        setBids(validBids);
      } catch (error) {
        console.error('Error in fetchUserBids:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserBids();
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
          <div className="flex flex-col items-center">
            <Loader2 size={24} className="animate-spin text-[#FF8A00] mb-2" />
            <p className="text-gray-500">Loading your bids...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white border border-red-100 rounded-md p-6 text-center">
          <div className="flex flex-col items-center">
            <AlertCircle size={24} className="text-red-500 mb-2" />
            <h3 className="text-base font-medium text-red-500">Error loading bids</h3>
            <p className="text-gray-500 text-sm mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors"
            >
              Try Again
            </button>
          </div>
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
                        Bid placed on {formatDate(bid.bidDate)} by {bid.username}
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
                    {!bid.isHighestBidder && bid.timeLeft !== 'Ended' && (
                      <Link
                        href={`/dashboard/auctions/${bid.auctionId}`}
                        className="px-3 py-1.5 bg-[#FF8A00] text-white rounded-md text-xs hover:bg-[#e67e00] transition-colors flex items-center"
                      >
                        Place New Bid
                        <ArrowUpRight size={12} className="ml-1" />
                      </Link>
                    )}
                    <Link
                      href={`/dashboard/auctions/${bid.auctionId}`}
                      className="px-3 py-1.5 ml-2 border border-gray-100 text-gray-700 rounded-md text-xs hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </Link>
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
            <p className="text-gray-500 text-sm mt-1">You haven&apos;t placed any bids on auctions yet.</p>
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
