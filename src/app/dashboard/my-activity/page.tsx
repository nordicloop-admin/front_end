"use client";

import React, { useState, useEffect } from 'react';
import { Package, Filter, Search, Plus, Loader2, AlertCircle, Trophy, Clock, TrendingUp, RefreshCw } from 'lucide-react';
import Link from 'next/link';

// Import components from existing pages
import { AuctionData } from '@/components/auctions/EditAuctionModal';
import MyAuctionCard from '@/components/auctions/MyAuctionCard';
import { getUserAuctions, PaginatedAuctionResult } from '@/services/auction';
import { getUserBids, getUserWinningBids, cancelBid, BidItem, PaginatedBidResult, BidPaginationParams } from '@/services/bid';
import Pagination from '@/components/ui/Pagination';
import { toast } from 'sonner';
import useBidding from '@/hooks/useBidding';
import PlaceBidModal from '@/components/auctions/PlaceBidModal';

// Interface for tab selection
type ActivityTabType = 'auctions' | 'bids';
type BidTabType = 'all' | 'active' | 'winning' | 'outbid' | 'won' | 'lost' | 'cancelled';

export default function MyActivity() {
  const [activeTab, setActiveTab] = useState<ActivityTabType>('auctions');
  
  // Auction state
  const [auctions, setAuctions] = useState<AuctionData[]>([]);
  const [auctionsLoading, setAuctionsLoading] = useState(false);
  const [auctionsError, setAuctionsError] = useState<string | null>(null);
  const [auctionSearchTerm, setAuctionSearchTerm] = useState('');
  const [auctionCurrentPage, setAuctionCurrentPage] = useState(1);
  const [auctionPageSize] = useState(10);
  const [auctionPaginationData, setAuctionPaginationData] = useState({
    count: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10
  });
  
  // Bid state
  const [bids, setBids] = useState<BidItem[]>([]);
  const [bidsLoading, setBidsLoading] = useState(false);
  const [bidsError, setBidsError] = useState<string | null>(null);
  const [activeBidTab, setActiveBidTab] = useState<BidTabType>('all');
  const [bidCurrentPage, setBidCurrentPage] = useState(1);
  const [bidPageSize] = useState(10);
  const [bidPaginationData, setBidPaginationData] = useState({
    count: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10
  });
  const [bidStatistics, setBidStatistics] = useState({
    total_bids: 0,
    active_bids: 0,
    total_bidders: 0
  });
  
  const { selectedAuction, isModalOpen, openBidModal, closeBidModal, submitBid } = useBidding();

  // Tab configuration for bids
  const bidTabs = [
    { key: 'all' as BidTabType, label: 'All Bids', icon: null },
    { key: 'active' as BidTabType, label: 'Active', icon: Clock },
    { key: 'winning' as BidTabType, label: 'Winning', icon: Trophy },
    { key: 'outbid' as BidTabType, label: 'Outbid', icon: TrendingUp },
    { key: 'won' as BidTabType, label: 'Won', icon: Trophy },
    { key: 'lost' as BidTabType, label: 'Lost', icon: null },
    { key: 'cancelled' as BidTabType, label: 'Cancelled', icon: null }
  ];

  // Fetch user auctions
  const fetchUserAuctions = async (page: number = 1, size: number = 10) => {
    setAuctionsLoading(true);
    setAuctionsError(null);

    try {
      const response = await getUserAuctions({ page, page_size: size });

      if (response.error) {
        if (response.status === 401) {
          setAuctionsError('Authentication required. Please log in to view your auctions.');
        } else {
          setAuctionsError(response.error);
        }
      } else if (response.data) {
        const result = response.data as PaginatedAuctionResult;

        const convertedAuctions = result.auctions.map(auction => {
          // Use the actual status from backend instead of transforming
          const backendStatus = auction.status || (auction.is_active ? 'active' : 'draft');
          
          // Capitalize first letter for display
          const displayStatus = backendStatus.charAt(0).toUpperCase() + backendStatus.slice(1);
          
          return {
            id: auction.id.toString(),
            name: auction.title || `${auction.category_name} - ${auction.subcategory_name}`,
            category: auction.category_name,
            subcategory: auction.subcategory_name,
            basePrice: auction.starting_bid_price || auction.total_starting_value,
            currentBid: '',
            status: backendStatus,
            auctionStatus: displayStatus,
            timeLeft: 'Available',
            volume: auction.available_quantity ? `${auction.available_quantity} ${auction.unit_of_measurement}` : 'N/A',
            image: auction.material_image || '/images/marketplace/categories/plastics.jpg',
            description: auction.title || '',
            keywords: '',
            material_image: auction.material_image || undefined,
            stepCompletionStatus: auction.is_complete ? {
              '1': true, '2': true, '3': true, '4': true, 
              '5': true, '6': true, '7': true, '8': true
            } : {
              '1': false, '2': false, '3': false, '4': false, 
              '5': false, '6': false, '7': false, '8': false
            },
            currentStep: auction.is_complete ? 8 : 1,
            isComplete: auction.is_complete
          };
        });

        setAuctions(convertedAuctions);
        setAuctionPaginationData({
          count: result.pagination.count,
          totalPages: result.pagination.total_pages,
          currentPage: result.pagination.current_page,
          pageSize: result.pagination.page_size
        });
      } else {
        setAuctions([]);
        setAuctionPaginationData({
          count: 0,
          totalPages: 1,
          currentPage: 1,
          pageSize: 10
        });
      }
    } catch (err) {
      setAuctionsError(err instanceof Error ? err.message : 'Failed to fetch your auctions');
    } finally {
      setAuctionsLoading(false);
    }
  };

  // Fetch user bids
  const fetchUserBids = async (page: number = 1, size: number = 10, status?: string) => {
    setBidsLoading(true);
    setBidsError(null);

    try {
      const params: BidPaginationParams = { page, page_size: size };
      if (status && status !== 'all') {
        params.status = status;
      }

      const bidsResponse = status === 'winning' 
        ? await getUserWinningBids(params)
        : await getUserBids(params);

      if (bidsResponse.error) {
        setBidsError(bidsResponse.error);
        return;
      }

      if (!bidsResponse.data || bidsResponse.data.bids.length === 0) {
        setBids([]);
        setBidPaginationData({
          count: 0,
          totalPages: 1,
          currentPage: 1,
          pageSize: size
        });
        setBidStatistics({
          total_bids: 0,
          active_bids: 0,
          total_bidders: 0
        });
        return;
      }

      const result = bidsResponse.data as PaginatedBidResult;
      
      setBidPaginationData({
        count: result.pagination.count,
        totalPages: result.pagination.total_pages,
        currentPage: result.pagination.current_page,
        pageSize: result.pagination.page_size
      });

      if (result.statistics) {
        setBidStatistics(result.statistics);
      }

      setBids(result.bids);
    } catch (error) {
      setBidsError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setBidsLoading(false);
    }
  };

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'auctions') {
      fetchUserAuctions(auctionCurrentPage, auctionPageSize);
    } else if (activeTab === 'bids') {
      const status = activeBidTab === 'all' ? undefined : activeBidTab;
      fetchUserBids(bidCurrentPage, bidPageSize, status);
    }
  }, [activeTab, auctionCurrentPage, auctionPageSize, activeBidTab, bidCurrentPage, bidPageSize]);

  // Handle auction edit click
  const handleEditClick = (auction: AuctionData) => {
    window.location.href = `/dashboard/my-auctions/${auction.id}`;
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

      toast.success('Bid cancelled successfully', {
        description: 'Your bid has been cancelled.',
        duration: 3000,
      });

      const status = activeBidTab === 'all' ? undefined : activeBidTab;
      await fetchUserBids(bidCurrentPage, bidPageSize, status);
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

  // Get status display info for bids
  const getStatusInfo = (status: string, _isWinning: boolean) => {
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

  // Filter auctions based on search term
  const filteredAuctions = auctions.filter(auction =>
    auctionSearchTerm === '' ||
    auction.name.toLowerCase().includes(auctionSearchTerm.toLowerCase()) ||
    auction.category.toLowerCase().includes(auctionSearchTerm.toLowerCase()) ||
    (auction.subcategory && auction.subcategory.toLowerCase().includes(auctionSearchTerm.toLowerCase()))
  );

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-medium">My Activity</h1>
        {activeTab === 'auctions' && (
          <Link
            href="/dashboard/auctions/create-alternative"
            className="bg-[#FF8A00] text-white py-2 px-4 rounded-md flex items-center text-sm hover:bg-[#e67e00] transition-colors"
          >
            <Plus size={16} className="mr-2" />
            New Auction
          </Link>
        )}
        {activeTab === 'bids' && bidStatistics.total_bids > 0 && (
          <div className="flex gap-4 text-sm text-gray-600">
            <div>Total: <span className="font-medium">{bidStatistics.total_bids}</span></div>
            <div>Active: <span className="font-medium">{bidStatistics.active_bids}</span></div>
          </div>
        )}
      </div>

      {/* Main Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('auctions')}
            className={`whitespace-nowrap flex items-center py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'auctions'
                ? 'border-[#FF8A00] text-[#FF8A00]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package size={16} className="mr-2" />
            My Auctions
          </button>
          <button
            onClick={() => setActiveTab('bids')}
            className={`whitespace-nowrap flex items-center py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bids'
                ? 'border-[#FF8A00] text-[#FF8A00]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <path
                d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M3 12H9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M15 12H21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M7 5H17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M7 19H17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            My Bids
          </button>
        </nav>
      </div>

      {/* Content for Auctions Tab */}
      {activeTab === 'auctions' && (
        <>
          {/* Filters for Auctions */}
          <div className="flex flex-col md:flex-row gap-3 mb-5">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search auctions..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-100 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
                value={auctionSearchTerm}
                onChange={(e) => setAuctionSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <button className="flex items-center px-4 py-2 border border-gray-100 rounded-md bg-white text-sm">
                <Filter size={16} className="mr-2 text-gray-500" />
                Filter
              </button>
            </div>
          </div>

          {/* Loading State for Auctions */}
          {auctionsLoading && (
            <div className="bg-white border border-gray-100 rounded-md p-6 flex justify-center items-center">
              <Loader2 size={24} className="animate-spin text-[#FF8A00] mr-2" />
              <p className="text-gray-700">Loading your auctions...</p>
            </div>
          )}

          {/* Error State for Auctions */}
          {!auctionsLoading && auctionsError && (
            <div className="bg-white border border-red-100 rounded-md p-6 text-center">
              <div className="flex justify-center mb-2">
                <AlertCircle size={24} className="text-red-500" />
              </div>
              <p className="text-red-500 font-medium">Error loading your auctions</p>
              <p className="text-gray-500 text-sm mt-1">{auctionsError}</p>
              <button
                onClick={() => fetchUserAuctions(auctionCurrentPage, auctionPageSize)}
                className="mt-4 px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Auctions List */}
          {!auctionsLoading && !auctionsError && (
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
                        status={auction.status}
                        auctionStatus={auction.auctionStatus}
                        onEditClick={() => handleEditClick(auction)}
                      />
                    ))}
                  </div>

                  {/* Pagination for Auctions */}
                  {auctions.length > 0 && (
                    <Pagination
                      currentPage={auctionPaginationData.currentPage}
                      totalPages={auctionPaginationData.totalPages}
                      totalItems={auctionPaginationData.count}
                      itemsPerPage={auctionPaginationData.pageSize}
                      onPageChange={setAuctionCurrentPage}
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
        </>
      )}

      {/* Content for Bids Tab */}
      {activeTab === 'bids' && (
        <>
          {/* Sub-tabs for Bids */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {bidTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveBidTab(tab.key)}
                    className={`whitespace-nowrap flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      activeBidTab === tab.key
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

          {/* Refresh Button for Bids */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                const status = activeBidTab === 'all' ? undefined : activeBidTab;
                fetchUserBids(bidCurrentPage, bidPageSize, status);
              }}
              className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={14} className="mr-1" />
              Refresh
            </button>
          </div>

          {/* Loading State for Bids */}
          {bidsLoading ? (
            <div className="bg-white border border-gray-100 rounded-md p-6 flex justify-center items-center">
              <Loader2 size={24} className="animate-spin text-[#FF8A00] mr-2" />
              <p className="text-gray-700">Loading your bids...</p>
            </div>
          ) : bidsError ? (
            <div className="bg-white border border-red-100 rounded-md p-6 text-center">
              <div className="flex justify-center mb-2">
                <AlertCircle size={24} className="text-red-500" />
              </div>
              <p className="text-red-500 font-medium">Error loading bids</p>
              <p className="text-gray-500 text-sm mt-1">{bidsError}</p>
              <button
                onClick={() => {
                  const status = activeBidTab === 'all' ? undefined : activeBidTab;
                  fetchUserBids(bidCurrentPage, bidPageSize, status);
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
                  const statusInfo = getStatusInfo(bid.status, bid.is_winning || false);
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

              {/* Pagination for Bids */}
              <Pagination
                currentPage={bidPaginationData.currentPage}
                totalPages={bidPaginationData.totalPages}
                totalItems={bidPaginationData.count}
                itemsPerPage={bidPaginationData.pageSize}
                onPageChange={setBidCurrentPage}
              />
            </>
          ) : (
            <div className="bg-white border border-gray-100 rounded-md p-6 text-center">
              <div className="flex flex-col items-center">
                <AlertCircle size={24} className="text-gray-400 mb-2" />
                <h3 className="text-base font-medium text-gray-900">
                  {activeBidTab === 'all' ? 'No bids yet' : `No ${activeBidTab} bids`}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {activeBidTab === 'all' 
                    ? "You haven't placed any bids on auctions yet." 
                    : `You don't have any ${activeBidTab} bids at the moment.`
                  }
                </p>
                <Link
                  href="/dashboard/auctions"
                  className="mt-4 px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors"
                >
                  Browse Marketplace
                </Link>
              </div>
            </div>
          )}
        </>
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

