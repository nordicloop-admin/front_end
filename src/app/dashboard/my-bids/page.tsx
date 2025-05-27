"use client";

import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getUserBids, getAuctionBids, UserBidResponse } from '@/services/bid';
import { getAuctionById } from '@/services/auction';
import { toast } from 'sonner';
import useBidding from '@/hooks/useBidding';
import PlaceBidModal from '@/components/auctions/PlaceBidModal';
import MyBidCard from '@/components/auctions/MyBidCard';

// Using UserBidResponse from bid service

// Interface for auction data
interface _AuctionData { // Prefixed with underscore to indicate it's not used
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
  const { selectedAuction, isModalOpen, openBidModal, closeBidModal, submitBid } = useBidding();

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
          // Error handling for user bids fetch failures
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
              // Error handling for auction fetch failures
              return null;
            }

            const auction = auctionResponse.data;

            // Get the highest bid for this auction
            let highestBid = auction.base_price;
            let isHighestBidder = false;

            try {
              // Fetch bids for this auction to determine if user is highest bidder
              const bidsResponse = await getAuctionBids(auction.id);

              if (bidsResponse.data && bidsResponse.data.length > 0) {
                // Sort bids by amount (highest first)
                const sortedBids = [...bidsResponse.data].sort((a, b) =>
                  parseFloat(b.amount) - parseFloat(a.amount)
                );

                // Get the highest bid
                highestBid = sortedBids[0].amount;

                // Check if the user is the highest bidder
                isHighestBidder = sortedBids[0].user === bid.username ||
                                 sortedBids[0].id === bid.bid_id; // Using 'id' instead of 'bid_id'
              }
            } catch (_error) {
              // Error handling for auction bids fetch failures
              // Continue with default values
            }

            // Create a formatted bid object
            return {
              id: bid.bid_id.toString(),
              auctionId: auction.id.toString(),
              auctionName: auction.item_name,
              category: auction.item_name.split(' ')[0] || 'Unknown', // Extract category from item name
              bidAmount: bid.amount, // Original bid amount from API
              currentHighestBid: highestBid,
              isHighestBidder: isHighestBidder,
              timeLeft: calculateTimeLeft(auction.end_date, auction.end_time),
              bidDate: bid.timestamp,
              image: auction.item_image || '/images/marketplace/categories/plastics.jpg', // Fallback image
              username: bid.username
            };
          } catch (_error) {
            // Error handling for bid processing failures
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
        // Error handling for overall fetch process
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserBids();
  }, []);

  // Format date to readable string (not used in this component but kept for future use)
  const _formatDate = (dateString: string) => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bids.map((bid) => (
            <MyBidCard
              key={bid.id}
              id={bid.id}
              auctionId={bid.auctionId}
              auctionName={bid.auctionName}
              category={bid.category}
              bidAmount={parseFloat(bid.bidAmount).toLocaleString()}
              currentHighestBid={parseFloat(bid.currentHighestBid).toLocaleString()}
              isHighestBidder={bid.isHighestBidder}
              timeLeft={bid.timeLeft}
              bidDate={bid.bidDate}
              username={bid.username}
              image={bid.image}
              onPlaceBidClick={async () => {
                // Show loading toast
                const loadingToast = toast.loading('Preparing bid form...');

                try {
                  // Fetch the latest auction details
                  const response = await getAuctionById(bid.auctionId);

                  // Dismiss loading toast
                  toast.dismiss(loadingToast);

                  if (response.error || !response.data) {
                    throw new Error(response.error || 'Failed to fetch auction details');
                  }

                  const auction = response.data;

                  // Get the highest bid amount from the API
                  let highestBidAmount = auction.base_price;

                  try {
                    // Fetch the latest bids for this auction
                    const bidsResponse = await getAuctionBids(auction.id);

                    if (bidsResponse.data && bidsResponse.data.length > 0) {
                      // Sort bids by amount (highest first)
                      const sortedBids = [...bidsResponse.data].sort((a, b) =>
                        parseFloat(b.amount) - parseFloat(a.amount)
                      );

                      // Get the highest bid amount
                      highestBidAmount = sortedBids[0].amount;
                    }
                  } catch (_error) {
                    // Error handling for latest bids fetch failures
                    // Fallback to using the bid amount we already have
                    highestBidAmount = bid.currentHighestBid || auction.base_price;
                  }

                  // Format the bid amount to match what's shown in the UI (with commas)
                  const formattedBidAmount = parseFloat(highestBidAmount).toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 0
                  });

                  // Open bid modal with latest auction details
                  openBidModal({
                    id: auction.id.toString(),
                    name: auction.item_name,
                    category: auction.item_name.split(' ')[0] || bid.category, // Extract category from item name
                    basePrice: formattedBidAmount,
                    highestBid: formattedBidAmount,
                    timeLeft: calculateTimeLeft(auction.end_date, auction.end_time),
                    volume: `${auction.volume} ${auction.unit}`,
                    countryOfOrigin: auction.country_of_origin,
                    originalBidAmount: bid.bidAmount, // Pass the original bid amount
                    bidId: bid.id // Pass the bid ID for updating
                  });
                } catch (error) {
                  // Dismiss loading toast
                  toast.dismiss(loadingToast);

                  // Show error toast
                  toast.error('Failed to prepare bid form', {
                    description: error instanceof Error ? error.message : 'An unexpected error occurred',
                    duration: 5000,
                  });

                  // Format the bid amount to match what's shown in the UI (with commas)
                  const formattedBidAmount = parseFloat(bid.bidAmount).toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 0
                  });

                  // Fallback to using the data we already have
                  openBidModal({
                    id: bid.auctionId,
                    name: bid.auctionName,
                    category: bid.category,
                    basePrice: formattedBidAmount,
                    highestBid: formattedBidAmount,
                    timeLeft: bid.timeLeft,
                    volume: '1 kg', // Default value
                    countryOfOrigin: 'Unknown', // Default value
                    originalBidAmount: bid.bidAmount, // Pass the original bid amount
                    bidId: bid.id // Pass the bid ID for updating
                  });
                }
              }}
            />
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

      {/* Bid Modal */}
      {selectedAuction && (
        <PlaceBidModal
          isOpen={isModalOpen}
          onClose={closeBidModal}
          onSubmit={submitBid}
          auction={selectedAuction}
          initialBidAmount={selectedAuction.originalBidAmount} // Pass the original bid amount
        />
      )}
    </div>
  );
}
