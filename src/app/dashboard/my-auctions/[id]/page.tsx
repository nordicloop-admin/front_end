"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Clock, Package, User, Calendar, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import EditAuctionModal, { AuctionData } from '@/components/auctions/EditAuctionModal';
import { getAuctionById, updateAuction, deleteAuction } from '@/services/auction';
import { getAuctionBids } from '@/services/bid';

// Mock data for auctions (not used but kept for reference)
const _myAuctions = [
  {
    id: '1',
    name: 'PPA Thermocomp UFW49RSC (Black)',
    category: 'Plastics',
    subcategory: 'PP (Polypropylene)',
    basePrice: '5,013,008',
    currentBid: '5,250,000',
    status: 'active',
    timeLeft: '2d 4h',
    volume: '500 kg',
    image: '/images/marketplace/categories/plastics.jpg',
    description: 'High-quality recycled PPA Thermocomp material in black color. This material has been processed and tested to meet industry standards. Suitable for automotive and industrial applications.',
    createdAt: '2023-06-10T10:30:00Z',
    bidHistory: [
      { bidder: 'Company A', amount: '5,250,000', date: '2023-06-14T15:30:00Z' },
      { bidder: 'Company B', amount: '5,150,000', date: '2023-06-14T12:15:00Z' },
      { bidder: 'Company C', amount: '5,100,000', date: '2023-06-13T09:45:00Z' },
    ]
  },
  {
    id: '2',
    name: 'Aluminum Scrap 6061',
    category: 'Metals',
    subcategory: 'Aluminum',
    basePrice: '7,250,000',
    currentBid: '7,500,000',
    status: 'active',
    timeLeft: '3d 6h',
    volume: '1200 kg',
    image: '/images/marketplace/categories/metals.jpg',
    description: 'High-grade aluminum scrap 6061 alloy. Clean and sorted material suitable for recycling and manufacturing. This material has been tested for purity and meets industry standards.',
    createdAt: '2023-06-12T14:45:00Z',
    bidHistory: [
      { bidder: 'Company D', amount: '7,500,000', date: '2023-06-15T10:30:00Z' },
      { bidder: 'Company E', amount: '7,400,000', date: '2023-06-14T14:45:00Z' },
      { bidder: 'Company F', amount: '7,300,000', date: '2023-06-14T08:20:00Z' },
    ]
  }
];

export default function AuctionDetail() {
  const params = useParams();
  const router = useRouter();
  const [auction, setAuction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

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

  // Fetch auction data
  useEffect(() => {
    if (params.id) {
      setIsLoading(true);

      // Fetch auction data from API
      getAuctionById(params.id as string)
        .then(response => {
          if (response.error) {
            // Error handling for auction fetch failures
            // Auction not found or error, redirect to auctions list
            router.push('/dashboard/my-auctions');
            return;
          }

          if (response.data) {
            // Convert API auction to the format expected by the UI
            const apiAuction = response.data;

            // Create a formatted auction object
            const formattedAuction = {
              id: apiAuction.id.toString(),
              name: apiAuction.title || `${apiAuction.category_name} - ${apiAuction.subcategory_name}`,
              category: apiAuction.category_name,
              subcategory: apiAuction.subcategory_name,
              basePrice: apiAuction.starting_bid_price || apiAuction.total_starting_value,
              currentBid: '', // Will be updated if we fetch bids
              status: apiAuction.is_active ? 'active' : 'inactive',
              timeLeft: 'Available', // API doesn't provide end date/time in this format
              volume: apiAuction.available_quantity ? `${apiAuction.available_quantity} ${apiAuction.unit_of_measurement}` : 'N/A',
              image: apiAuction.material_image || '/images/marketplace/categories/plastics.jpg', // Fallback image
              description: apiAuction.title || `${apiAuction.category_name} material available for auction`, // No description field in API
              createdAt: apiAuction.created_at,
              bidHistory: [] // Will be populated if we fetch bids
            };

            // Set the auction data
            setAuction(formattedAuction);

            // Now fetch the bid history
            getAuctionBids(parseInt(params.id as string))
              .then(bidsResponse => {
                if (!bidsResponse.error && bidsResponse.data && bidsResponse.data.length > 0) {
                  // Format the bids
                  const formattedBids = bidsResponse.data.map(bid => ({
                    bidder: bid.user || 'Anonymous',
                    amount: bid.amount,
                    date: bid.timestamp
                  }));

                  // Update the auction with bid history
                  setAuction((prevAuction: any) => ({
                    ...prevAuction,
                    bidHistory: formattedBids,
                    // Update current bid with highest bid if available
                    currentBid: formattedBids.length > 0 ? formattedBids[0].amount : prevAuction.currentBid
                  }));
                }
              })
              .catch(_error => {
                // Error handling for bids fetch failures
                // Don't redirect, just continue with the auction data we have
              })
              .finally(() => {
                setIsLoading(false);
              });
          } else {
            // Auction not found, redirect to auctions list
            router.push('/dashboard/my-auctions');
            setIsLoading(false);
          }
        })
        .catch(_error => {
          // Error handling for auction fetch failures
          router.push('/dashboard/my-auctions');
          setIsLoading(false);
        });
    }
  }, [params.id, router]);

  // Handle edit auction
  const handleEditAuction = async (updatedAuction: AuctionData) => {
    // Show loading toast
    const loadingToast = toast.loading('Updating auction...');

    try {
      // Extract volume and unit from the volume string
      const volumeParts = updatedAuction.volume.split(' ');
      const volumeValue = volumeParts[0];
      const volumeUnit = volumeParts[1];

      // Prepare data for API
      const apiData = {
        item_name: updatedAuction.name,
        category: updatedAuction.category,
        subcategory: updatedAuction.subcategory,
        base_price: updatedAuction.basePrice.replace(/,/g, ''), // Remove commas
        volume: volumeValue,
        unit: volumeUnit
      };

      // Send update to API
      const response = await updateAuction(params.id as string, apiData);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.error) {
        // Show error toast
        toast.error('Failed to update auction', {
          description: response.error,
          duration: 5000,
        });
        return;
      }

      // Update local state
      setAuction({
        ...auction,
        ...updatedAuction
      });

      // Close the modal
      setIsEditModalOpen(false);

      // Show success message
      toast.success('Auction updated successfully', {
        description: 'Your changes have been saved.',
        duration: 3000,
      });
    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show error toast
      toast.error('Failed to update auction', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        duration: 5000,
      });
    }
  };

  // Handle delete auction
  const handleDeleteAuction = async () => {
    // Show loading toast
    const loadingToast = toast.loading('Deleting auction...');

    try {
      // Send delete request to API
      const response = await deleteAuction(params.id as string);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.error) {
        // Show error toast
        toast.error('Failed to delete auction', {
          description: response.error,
          duration: 5000,
        });
        return;
      }

      // Show success message
      toast.success('Auction deleted successfully', {
        description: 'The auction has been removed from your listings.',
        duration: 3000,
      });

      // Redirect to auctions list
      router.push('/dashboard/my-auctions');
    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show error toast
      toast.error('Failed to delete auction', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        duration: 5000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-5 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF8A00]"></div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="p-5">
        <div className="bg-white border border-gray-100 rounded-md p-6 text-center">
          <AlertCircle size={24} className="mx-auto text-gray-400 mb-2" />
          <h2 className="text-lg font-medium text-gray-900">Auction not found</h2>
          <p className="text-gray-500 mt-1">The auction you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <button
            onClick={() => router.push('/dashboard/my-auctions')}
            className="mt-4 px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors"
          >
            Back to My Auctions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="mb-5">
        <button
          onClick={() => router.push('/dashboard/my-auctions')}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to My Auctions
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative h-64 md:h-full">
            <Image
              src={auction.image}
              alt={auction.name}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 px-2 py-1 rounded text-xs">
              {auction.category}
            </div>
            <div className="absolute top-4 right-4 bg-black/80 px-2 py-1 rounded text-xs text-white flex items-center">
              <Clock size={12} className="mr-1" />
              {auction.timeLeft}
            </div>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-xl font-medium text-gray-900">{auction.name}</h1>

              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-2 text-gray-500 hover:text-gray-700 border border-gray-100 rounded-md"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="p-2 text-red-500 hover:text-red-700 border border-gray-100 rounded-md"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-500 mt-1">
              {auction.subcategory && <span>{auction.subcategory}</span>}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">
                  {auction.currentBid ? 'Current Highest Bid' : 'Base Price'}
                </div>
                <div className="text-lg font-medium text-[#FF8A00]">
                  {auction.currentBid || auction.basePrice} SEK
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Volume</div>
                <div className="text-sm font-medium flex items-center">
                  <Package size={14} className="mr-1 text-gray-500" />
                  {auction.volume}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Status</div>
                <div className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-full inline-flex items-center mt-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                  {auction.status === 'active' ? 'Active' : 'Inactive'}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Created On</div>
                <div className="text-sm font-medium flex items-center">
                  <Calendar size={14} className="mr-1 text-gray-500" />
                  {formatDate(auction.createdAt)}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-sm font-medium mb-2">Description</h2>
              <p className="text-sm text-gray-700">{auction.description}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 p-6">
          <h2 className="text-lg font-medium mb-3">Bid History</h2>
          {auction.bidHistory && auction.bidHistory.length > 0 ? (
            <div className="overflow-hidden border border-gray-100 rounded-md">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bidder</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (SEK)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {auction.bidHistory.map((bid: any, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm flex items-center">
                        <User size={14} className="mr-2 text-gray-400" />
                        {bid.bidder}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{bid.amount}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(bid.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">No bids have been placed yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Auction Modal */}
      {auction && (
        <EditAuctionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditAuction}
          auction={auction}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md max-w-md w-full p-6">
            <h2 className="text-lg font-medium mb-4">Delete Auction</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this auction? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 border border-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAuction}
                className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
