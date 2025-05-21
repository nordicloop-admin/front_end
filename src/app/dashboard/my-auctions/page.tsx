"use client";

import React, { useState, useEffect } from 'react';
import { Package, Filter, Search, Plus, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import AddAuctionModal, { AuctionFormData } from '@/components/auctions/AddAuctionModal';
import EditAuctionModal, { AuctionData } from '@/components/auctions/EditAuctionModal';
import MyAuctionCard from '@/components/auctions/MyAuctionCard';
import { createAuction, createAuctionWithImage, getUserAuctions } from '@/services/auction';



export default function MyAuctions() {
  const [auctions, setAuctions] = useState<AuctionData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<AuctionData | null>(null);

  // State for API auctions
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Fetch user auctions from the API
  useEffect(() => {
    const fetchUserAuctions = async () => {
      setIsLoading(true);

      try {
        const response = await getUserAuctions();

        if (response.error) {
          // Error handling for user auctions fetch failures

          // Check if it's an authentication error
          if (response.status === 401) {
            setError('Authentication required. Please log in to view your auctions.');
          } else {
            setError(response.error);
          }
        } else if (response.data) {
          // Successfully fetched user auctions

          // Convert API auctions to the format expected by the UI
          const convertedAuctions = response.data.map(auction => ({
            id: auction.id.toString(),
            name: auction.item_name,
            category: auction.item_name.split(' ')[0], // Temporary category extraction
            subcategory: '',
            basePrice: auction.base_price,
            currentBid: '', // API doesn't provide highest bid yet
            status: 'active',
            timeLeft: calculateTimeLeft(auction.end_date, auction.end_time),
            volume: `${auction.volume} ${auction.unit}`,
            image: auction.item_image || '/images/marketplace/categories/plastics.jpg' // Fallback image
          }));

          // Update the auctions state with the API data
          setAuctions(convertedAuctions);
        } else {
          // No user auctions data available
          // Don't set error here, just keep the mock data
        }
      } catch (err) {
        // Error handling for overall fetch process
        setError(err instanceof Error ? err.message : 'Failed to fetch your auctions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAuctions();
  }, []);

  const handleAddAuction = async (auctionData: AuctionFormData) => {
    // Show loading toast
    const loadingToast = toast.loading('Creating auction...');

    try {
      // Prepare the data for the API
      const apiData = {
        item_name: auctionData.name,
        category: auctionData.category,
        subcategory: auctionData.subcategory,
        description: auctionData.description,
        base_price: auctionData.basePrice,
        price_per_partition: auctionData.pricePerPartition,
        volume: auctionData.volume,
        unit: auctionData.unit,
        selling_type: auctionData.sellingType,
        country_of_origin: auctionData.countryOfOrigin,
        end_date: auctionData.endDate,
        end_time: auctionData.endTime
      };

      // Preparing auction data for submission

      // Validate selling type is one of the allowed values
      if (!['partition', 'whole', 'both'].includes(apiData.selling_type)) {
        // Invalid selling type detected
        toast.error('Invalid selling type. Please select a valid option.');
        toast.dismiss(loadingToast);
        return;
      }

      let response;

      // If there's an image, use the createAuctionWithImage function
      if (auctionData.image) {
        response = await createAuctionWithImage(apiData, auctionData.image);
      } else {
        response = await createAuction(apiData);
      }

      // Dismiss the loading toast
      toast.dismiss(loadingToast);

      if (response.error) {
        // Show error toast
        toast.error('Failed to create auction', {
          description: response.error,
          duration: 5000,
        });
        return;
      }

      if (response.data) {
        // Create a new auction object for the UI
        const newAuction = {
          id: response.data.id.toString(),
          name: response.data.item_name,
          category: auctionData.category,
          subcategory: auctionData.subcategory,
          basePrice: response.data.base_price,
          currentBid: '',
          status: 'pending',
          timeLeft: '7d 0h', // Default to 7 days
          volume: `${response.data.volume} ${response.data.unit}`,
          image: response.data.item_image || '/images/marketplace/categories/plastics.jpg'
        };

        // Add the new auction to the list
        setAuctions([newAuction, ...auctions]);

        // Close the modal
        setIsModalOpen(false);

        // Show success message
        toast.success('Auction created successfully', {
          description: 'Your new auction has been listed.',
          duration: 3000,
        });

        // Refresh the auctions list
        getUserAuctions().then(response => {
          if (response.data) {
            // Convert API auctions to the format expected by the UI
            const convertedAuctions = response.data.map(auction => ({
              id: auction.id.toString(),
              name: auction.item_name,
              category: auction.item_name.split(' ')[0], // Temporary category extraction
              subcategory: '',
              basePrice: auction.base_price,
              currentBid: '', // API doesn't provide highest bid yet
              status: 'active',
              timeLeft: calculateTimeLeft(auction.end_date, auction.end_time),
              volume: `${auction.volume} ${auction.unit}`,
              image: auction.item_image || '/images/marketplace/categories/plastics.jpg' // Fallback image
            }));

            // Update the auctions state with the API data
            setAuctions(convertedAuctions);
          }
        }).catch(_err => {
          // Error handling for auction refresh failures
        });
      }
    } catch (error) {
      // Dismiss the loading toast
      toast.dismiss(loadingToast);

      // Show error toast
      toast.error('Failed to create auction', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        duration: 5000,
      });
    }
  };

  // Handle opening the edit modal
  const handleEditClick = (auction: AuctionData) => {
    setSelectedAuction(auction);
    setIsEditModalOpen(true);
  };

  // Handle edit auction submission
  const handleEditAuction = (updatedAuction: AuctionData) => {
    // In a real app, you would send the updated data to an API
    // For now, we'll just update our local state
    const updatedAuctions = auctions.map(auction =>
      auction.id === updatedAuction.id ? updatedAuction : auction
    );

    setAuctions(updatedAuctions);

    // Close the modal
    setIsEditModalOpen(false);

    // Show success message
    toast.success('Auction updated successfully', {
      description: 'Your changes have been saved.',
      duration: 3000,
    });
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-medium">My Auctions</h1>
        <button
          className="bg-[#FF8A00] text-white py-2 px-4 rounded-md flex items-center text-sm"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} className="mr-2" />
          New Auction
        </button>
      </div>

      {/* Add Auction Modal */}
      <AddAuctionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddAuction}
      />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search auctions..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-100 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <button className="flex items-center px-4 py-2 border border-gray-100 rounded-md bg-white text-sm">
            <Filter size={16} className="mr-2 text-gray-500" />
            Filter
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white border border-gray-100 rounded-md p-6 flex justify-center items-center">
          <Loader2 size={24} className="animate-spin text-[#FF8A00] mr-2" />
          <p className="text-gray-700">Loading your auctions...</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="bg-white border border-red-100 rounded-md p-6 text-center">
          <div className="flex justify-center mb-2">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <p className="text-red-500 font-medium">Error loading your auctions</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Auctions List */}
      {!isLoading && !error && (
        <div>
          {auctions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {auctions
                .filter(auction =>
                  searchTerm === '' ||
                  auction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  auction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (auction.subcategory && auction.subcategory.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map((auction) => (
                <MyAuctionCard
                  key={auction.id}
                  id={auction.id}
                  name={auction.name}
                  category={auction.category}
                  volume={auction.volume}
                  basePrice={auction.basePrice}
                  timeLeft={auction.timeLeft}
                  image={auction.image}
                  onEditClick={() => handleEditClick(auction)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-md p-6 text-center">
              <Package size={32} className="mx-auto mb-3 text-gray-300" />
              <h2 className="text-base font-medium text-gray-800 mb-2">No auctions yet</h2>
              <p className="text-sm text-gray-500 mb-4">You haven&apos;t created any auctions yet. Click the &quot;New Auction&quot; button to get started.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#FF8A00] text-white py-2 px-4 rounded-md inline-flex items-center text-sm"
              >
                <Plus size={16} className="mr-2" />
                Create Your First Auction
              </button>
            </div>
          )}
        </div>
      )}

      {/* Edit Auction Modal */}
      {selectedAuction && (
        <EditAuctionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditAuction}
          auction={selectedAuction}
        />
      )}
    </div>
  );
}


