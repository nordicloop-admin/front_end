"use client";

import React, { useState, useEffect } from 'react';
import { Package, Filter, Search, Plus, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import EditAuctionModal, { AuctionData } from '@/components/auctions/EditAuctionModal';
import MyAuctionCard from '@/components/auctions/MyAuctionCard';
import { getUserAuctions, PaginatedAuctionResult } from '@/services/auction';
import Pagination from '@/components/ui/Pagination';
import Link from 'next/link';



export default function MyAuctions() {
  const [auctions, setAuctions] = useState<AuctionData[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<AuctionData | null>(null);

  // State for API auctions and pagination
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginationData, setPaginationData] = useState({
    count: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10
  });

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
  const fetchUserAuctions = async (page: number = 1, size: number = 10) => {
    setIsLoading(true);

    try {
      const response = await getUserAuctions({ page, page_size: size });

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
        const result = response.data as PaginatedAuctionResult;

        // Convert API auctions to the format expected by the UI
        const convertedAuctions = result.auctions.map(auction => ({
          id: auction.id.toString(),
          name: auction.title || `${auction.category_name} - ${auction.subcategory_name}`,
          category: auction.category_name,
          subcategory: auction.subcategory_name,
          basePrice: auction.starting_bid_price || auction.total_starting_value,
          currentBid: '', // API doesn't provide highest bid yet
          status: auction.is_active ? 'active' : 'inactive',
          timeLeft: 'Available', // API doesn't provide end date/time in this format
          volume: auction.available_quantity ? `${auction.available_quantity} ${auction.unit_of_measurement}` : 'N/A',
          image: auction.material_image || '/images/marketplace/categories/plastics.jpg' // Fallback image
        }));

        // Update the auctions state with the API data
        setAuctions(convertedAuctions);
        setPaginationData({
          count: result.pagination.count,
          totalPages: result.pagination.total_pages,
          currentPage: result.pagination.current_page,
          pageSize: result.pagination.page_size
        });
      } else {
        // No user auctions data available
        // Don't set error here, just keep empty state
        setAuctions([]);
        setPaginationData({
          count: 0,
          totalPages: 1,
          currentPage: 1,
          pageSize: 10
        });
      }
    } catch (err) {
      // Error handling for overall fetch process
      setError(err instanceof Error ? err.message : 'Failed to fetch your auctions');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUserAuctions(currentPage, pageSize);
  }, [currentPage, pageSize]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
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

  // Filter auctions based on search term
  const filteredAuctions = auctions.filter(auction =>
    searchTerm === '' ||
    auction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    auction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (auction.subcategory && auction.subcategory.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-medium">My Auctions</h1>
        <Link
          href="/dashboard/auctions/create-alternative"
          className="bg-[#FF8A00] text-white py-2 px-4 rounded-md flex items-center text-sm hover:bg-[#e67e00] transition-colors"
        >
          <Plus size={16} className="mr-2" />
          New Auction
        </Link>
      </div>

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
            onClick={() => fetchUserAuctions(currentPage, pageSize)}
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredAuctions.map((auction) => (
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

              {/* Pagination */}
              {auctions.length > 0 && (
                <Pagination
                  currentPage={paginationData.currentPage}
                  totalPages={paginationData.totalPages}
                  totalCount={paginationData.count}
                  pageSize={paginationData.pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              )}
            </>
          ) : (
            <div className="bg-white border border-gray-100 rounded-md p-6 text-center">
              <Package size={32} className="mx-auto mb-3 text-gray-300" />
              <h2 className="text-base font-medium text-gray-800 mb-2">No auctions yet</h2>
              <p className="text-sm text-gray-500 mb-4">You haven&apos;t created any auctions yet. Click the &quot;New Auction&quot; button to get started.</p>
              <Link
                href="/dashboard/auctions/create-alternative"
                className="bg-[#FF8A00] text-white py-2 px-4 rounded-md inline-flex items-center text-sm hover:bg-[#e67e00] transition-colors"
              >
                <Plus size={16} className="mr-2" />
                Create Your First Auction
              </Link>
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
