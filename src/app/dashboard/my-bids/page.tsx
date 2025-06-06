"use client";

import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader2, Trophy, Clock, TrendingUp, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { getUserBids, getUserWinningBids, cancelBid, BidItem, PaginatedBidResult, BidPaginationParams } from '@/services/bid';
import { toast } from 'sonner';
import useBidding from '@/hooks/useBidding';
import PlaceBidModal from '@/components/auctions/PlaceBidModal';
import Pagination from '@/components/ui/Pagination';

// Interface for tab selection
type TabType = 'all' | 'active' | 'winning' | 'outbid' | 'won' | 'lost' | 'cancelled';

export default function MyBids() {
  const [bids, setBids] = useState<BidItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginationData, setPaginationData] = useState({
    count: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10
  });
  const [statistics, setStatistics] = useState({
    total_bids: 0,
    active_bids: 0,
    total_bidders: 0
  });
  const { selectedAuction, isModalOpen, openBidModal, closeBidModal, submitBid } = useBidding();

  // Tab configuration
  const tabs = [
    { key: 'all' as TabType, label: 'All Bids', icon: null },
    { key: 'active' as TabType, label: 'Active', icon: Clock },
    { key: 'winning' as TabType, label: 'Winning', icon: Trophy },
    { key: 'outbid' as TabType, label: 'Outbid', icon: TrendingUp },
    { key: 'won' as TabType, label: 'Won', icon: Trophy },
    { key: 'lost' as TabType, label: 'Lost', icon: null },
    { key: 'cancelled' as TabType, label: 'Cancelled', icon: null }
  ];

  // Fetch user bids from API with pagination and filtering
  const fetchUserBids = async (page: number = 1, size: number = 10, status?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const params: BidPaginationParams = { page, page_size: size };
      if (status && status !== 'all') {
        params.status = status;
      }

      // Special case for winning bids
      const bidsResponse = status === 'winning' 
        ? await getUserWinningBids(params)
        : await getUserBids(params);

      if (bidsResponse.error) {
        setError(bidsResponse.error);
        return;
      }

      if (!bidsResponse.data || bidsResponse.data.bids.length === 0) {
        setBids([]);
        setPaginationData({
          count: 0,
          totalPages: 1,
          currentPage: 1,
          pageSize: size
        });
        setStatistics({
          total_bids: 0,
          active_bids: 0,
          total_bidders: 0
        });
        return;
      }

      const result = bidsResponse.data as PaginatedBidResult;
      
      // Update pagination data
      setPaginationData({
        count: result.pagination.count,
        totalPages: result.pagination.total_pages,
        currentPage: result.pagination.current_page,
        pageSize: result.pagination.page_size
      });

      // Update statistics
      if (result.statistics) {
        setStatistics(result.statistics);
      }

      setBids(result.bids);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and refetch when tab or pagination changes
  useEffect(() => {
    const status = activeTab === 'all' ? undefined : activeTab;
    fetchUserBids(currentPage, pageSize, status);
  }, [activeTab, currentPage, pageSize]);

  // Handle tab change
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Handle bid cancellation
  const handleCancelBid = async (bidId: number) => {
    if (!confirm('Are you sure you want to cancel this bid?')) {
      return;
    }

    const loadingToast = toast.loading('Cancelling bid...');

    try {
      const response = await cancelBid(bidId);

      toast.dismiss(loadingToast);

      if (response.error) {
        toast.error('Failed to cancel bid', {
          description: response.error,
          duration: 5000,
        });
        return;
      }

      // Show success message
      toast.success('Bid cancelled successfully', {
        description: 'Your bid has been cancelled.',
        duration: 3000,
      });

      // Refresh the bids list
      const status = activeTab === 'all' ? undefined : activeTab;
      await fetchUserBids(currentPage, pageSize, status);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to cancel bid', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        duration: 5000,
      });
    }
  };

  // Handle bid update
  const handleUpdateBid = (bid: BidItem) => {
    // Open bid modal with current bid data
    openBidModal({
      id: bid.id.toString(),
      name: bid.ad_title,
      category: bid.ad_title.split(' ')[0] || 'Unknown',
      basePrice: bid.bid_price_per_unit,
      highestBid: bid.bid_price_per_unit,
      timeLeft: 'Available',
      volume: `${bid.volume_requested} ${bid.unit}`,
      countryOfOrigin: 'Unknown',
      originalBidAmount: bid.bid_price_per_unit,
      bidId: bid.id
    });
  };

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

  // Get status display info
  const getStatusInfo = (status: string, isWinning: boolean) => {
    const statusMap = {
      'active': { color: 'bg-blue-100 text-blue-800', label: 'Active' },
      'winning': { color: 'bg-green-100 text-green-800', label: 'Winning' },
      'Highest_bid': { color: 'bg-green-100 text-green-800', label: 'Highest Bid' },
      'outbid': { color: 'bg-red-100 text-red-800', label: 'Outbid' },
      'Outbid': { color: 'bg-red-100 text-red-800', label: 'Outbid' },
      'won': { color: 'bg-emerald-100 text-emerald-800', label: 'Won' },
      'lost': { color: 'bg-gray-100 text-gray-800', label: 'Lost' },
      'cancelled': { color: 'bg-gray-100 text-gray-800', label: 'Cancelled' }
    };

    const normalizedStatus = status.toLowerCase();
    return statusMap[normalizedStatus as keyof typeof statusMap] || 
           { color: 'bg-gray-100 text-gray-800', label: status };
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-medium">My Bids</h1>
        {/* Statistics */}
        {statistics.total_bids > 0 && (
          <div className="flex gap-4 text-sm text-gray-600">
            <div>Total: <span className="font-medium">{statistics.total_bids}</span></div>
            <div>Active: <span className="font-medium">{statistics.active_bids}</span></div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`whitespace-nowrap flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-[#FF8A00] text-[#FF8A00]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {Icon && <Icon size={16} className="mr-1" />}
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            const status = activeTab === 'all' ? undefined : activeTab;
            fetchUserBids(currentPage, pageSize, status);
          }}
          className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={14} className="mr-1" />
          Refresh
        </button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="bg-white border border-gray-100 rounded-md p-6 flex justify-center items-center">
          <Loader2 size={24} className="animate-spin text-[#FF8A00] mr-2" />
          <p className="text-gray-700">Loading your bids...</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-red-100 rounded-md p-6 text-center">
          <div className="flex justify-center mb-2">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <p className="text-red-500 font-medium">Error loading bids</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
          <button
            onClick={() => {
              const status = activeTab === 'all' ? undefined : activeTab;
              fetchUserBids(currentPage, pageSize, status);
            }}
            className="mt-4 px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : bids.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {bids.map((bid) => {
              const statusInfo = getStatusInfo(bid.status, bid.is_winning);
              return (
                <div key={bid.id} className="bg-white border border-gray-100 rounded-md overflow-hidden hover:shadow-sm transition-shadow">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-gray-900 line-clamp-2 flex-1 mr-2">{bid.ad_title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Your Bid:</span>
                        <span className="font-medium text-[#FF8A00]">
                          {parseFloat(bid.bid_price_per_unit).toLocaleString()} {bid.currency}
                        </span>
                      </div>
                      {bid.total_bid_value && (
                        <div className="flex justify-between">
                          <span>Total Value:</span>
                          <span className="font-medium">
                            {parseFloat(bid.total_bid_value).toLocaleString()} {bid.currency}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Volume:</span>
                        <span>{bid.volume_requested} {bid.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rank:</span>
                        <span className={`font-medium ${bid.rank === 1 ? 'text-green-600' : 'text-gray-600'}`}>
                          #{bid.rank}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bid Date:</span>
                        <span>{formatDate(bid.created_at)}</span>
                      </div>
                      {bid.volume_type && (
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="capitalize">{bid.volume_type}</span>
                        </div>
                      )}
                      {bid.is_auto_bid && (
                        <div className="flex justify-between">
                          <span>Auto-bid:</span>
                          <span className="text-blue-600">Active</span>
                        </div>
                      )}
                      {bid.max_auto_bid_price && (
                        <div className="flex justify-between">
                          <span>Max Auto:</span>
                          <span>{parseFloat(bid.max_auto_bid_price).toLocaleString()} {bid.currency}</span>
                        </div>
                      )}
                    </div>

                    {bid.is_winning && (
                      <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                        🎉 You are currently the highest bidder!
                      </div>
                    )}

                    {bid.notes && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                        <strong>Note:</strong> {bid.notes}
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      <Link
                        href={`/dashboard/auctions/${bid.id}`}
                        className="flex-1 text-center px-3 py-2 border border-gray-200 text-gray-700 rounded text-xs hover:bg-gray-50 transition-colors"
                      >
                        View Ad
                      </Link>
                      {(bid.status === 'active' || bid.status === 'winning' || bid.status === 'Highest_bid') && (
                        <>
                          <button
                            onClick={() => handleUpdateBid(bid)}
                            className="flex-1 px-3 py-2 bg-[#FF8A00] text-white rounded text-xs hover:bg-[#e67e00] transition-colors"
                          >
                            Update Bid
                          </button>
                          <button
                            onClick={() => handleCancelBid(bid.id)}
                            className="px-3 py-2 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={paginationData.currentPage}
            totalPages={paginationData.totalPages}
            totalCount={paginationData.count}
            pageSize={paginationData.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      ) : (
        <div className="bg-white border border-gray-100 rounded-md p-6 text-center">
          <div className="flex flex-col items-center">
            <AlertCircle size={24} className="text-gray-400 mb-2" />
            <h3 className="text-base font-medium text-gray-900">
              {activeTab === 'all' ? 'No bids yet' : `No ${activeTab} bids`}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              {activeTab === 'all' 
                ? "You haven't placed any bids on auctions yet." 
                : `You don't have any ${activeTab} bids at the moment.`
              }
            </p>
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
          initialBidAmount={selectedAuction.originalBidAmount}
        />
      )}
    </div>
  );
}
