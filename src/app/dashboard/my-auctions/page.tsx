"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, Clock, ArrowUpRight, Filter, Search, Plus } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import AddAuctionModal, { AuctionFormData } from '@/components/auctions/AddAuctionModal';
import EditAuctionModal, { AuctionData } from '@/components/auctions/EditAuctionModal';
import { createAuction, createAuctionWithImage } from '@/services/auction';

// Mock data for auctions
const myAuctions = [
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
    image: '/images/marketplace/categories/plastics.jpg'
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
    image: '/images/marketplace/categories/metals.jpg'
  }
];

export default function MyAuctions() {
  const [auctions, setAuctions] = useState(myAuctions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<AuctionData | null>(null);

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

      console.log('Creating auction with data:', apiData);

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
          />
        </div>

        <div className="flex items-center">
          <button className="flex items-center px-4 py-2 border border-gray-100 rounded-md bg-white text-sm">
            <Filter size={16} className="mr-2 text-gray-500" />
            Filter
          </button>
        </div>
      </div>

      {/* Auctions List */}
      <div className="space-y-4">
        {auctions.length > 0 ? (
          auctions.map((auction) => (
          <div key={auction.id} className="bg-white border border-gray-100 rounded-md p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-[120px] h-[100px] relative rounded-md overflow-hidden">
                <Image
                  src={auction.image}
                  alt={auction.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-base font-medium text-gray-900">{auction.name}</h2>
                    <div className="text-xs text-gray-500 mt-1">
                      Category: {auction.category}
                      {auction.subcategory && <span> • {auction.subcategory}</span>}
                    </div>
                    <div className="text-xs text-gray-500">Volume: {auction.volume}</div>
                  </div>

                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={14} className="mr-1" />
                    <span>{auction.timeLeft} left</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500">Current bid</div>
                    <div className="text-base font-medium text-[#FF8A00]">{auction.currentBid}</div>
                  </div>

                  <div className="mt-2 md:mt-0 flex space-x-2">
                    <button
                      onClick={() => handleEditClick(auction)}
                      className="px-3 py-1.5 border border-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </button>
                    <Link
                      href={`/dashboard/my-auctions/${auction.id}`}
                      className="px-3 py-1.5 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors flex items-center"
                    >
                      View Details
                      <ArrowUpRight size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
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


