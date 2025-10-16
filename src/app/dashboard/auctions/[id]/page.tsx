"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Clock, Building, MapPin, Package, ArrowUpRight, AlertCircle } from 'lucide-react';
import PlaceBidModal from '@/components/auctions/PlaceBidModal';
import useBidding from '@/hooks/useBidding';
import { getAuctionById, getAdDetails } from '@/services/auction';
import { getAuctionBidHistory } from '@/services/bid';
import { getCategoryImage } from '@/utils/categoryImages';
import { getFullImageUrl } from '@/utils/imageUtils';

// No mock data - show proper error when auction not found


export default function AuctionDetail() {
  const params = useParams();
  const router = useRouter();
  const { selectedAuction, isModalOpen, openBidModal, closeBidModal, submitBid } = useBidding();
  const [auction, setAuction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bidHistory, setBidHistory] = useState<any[]>([]);
  const [totalBids, setTotalBids] = useState(0);

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

  // Calculate step completion based on material category
  const calculateStepCompletion = (stepCompletionStatus: any, category: string) => {
    if (!stepCompletionStatus) return { completed: 0, total: 0, percentage: 0 };

    // Check if this is a plastic material
    const isPlastic = category && category.toLowerCase().includes('plastic');

    if (isPlastic) {
      // Plastics use 8 steps (1-8)
      const allSteps = [1, 2, 3, 4, 5, 6, 7, 8];
      const completedSteps = allSteps.filter(step => stepCompletionStatus[step]).length;
      return {
        completed: completedSteps,
        total: 8,
        percentage: (completedSteps / 8) * 100
      };
    } else {
      // Other materials use 4 steps (1, 6, 7, 8)
      const relevantSteps = [1, 6, 7, 8];
      const completedSteps = relevantSteps.filter(step => stepCompletionStatus[step]).length;
      return {
        completed: completedSteps,
        total: 4,
        percentage: (completedSteps / 4) * 100
      };
    }
  };

  // Calculate time left for an auction
  const _calculateTimeLeft = (endDate: string, endTime: string) => {
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

      // Try to fetch enhanced ad details first
      getAdDetails(params.id as string)
        .then(response => {
          if (!response.error && response.data) {
            const adData = response.data.data;
            
            // Format enhanced ad data
            const formattedAuction = {
              id: adData.id.toString(),
              name: adData.title || `${adData.category_name} - ${adData.subcategory_name}`,
              category: adData.category_name,
              subcategory: adData.subcategory_name,
              basePrice: adData.starting_bid_price ? `${adData.starting_bid_price} ${adData.currency}` : adData.total_starting_value,
              highestBid: null, // Will be updated if we fetch bids
              timeLeft: adData.time_remaining || adData.auction_duration_display,
              volume: adData.available_quantity ? `${adData.available_quantity} ${adData.unit_of_measurement_display}` : 'N/A',
              seller: adData.posted_by,
              company: adData.company_name,
              countryOfOrigin: adData.location_summary || 'Unknown',
              image: adData.material_image ? getFullImageUrl(adData.material_image) : getCategoryImage(adData.category_name),
              description: adData.description || adData.specific_material || `${adData.category_name} material available for auction`,
              bidHistory: [],
              
              // Enhanced specifications from the detailed endpoint
              specifications: [
                { name: 'Material Type', value: adData.category_name },
                { name: 'Subcategory', value: adData.subcategory_name },
                { name: 'Specific Material', value: adData.specific_material },
                { name: 'Packaging', value: adData.packaging_display },
                { name: 'Material Frequency', value: adData.material_frequency_display },
                ...(adData.origin_display ? [{ name: 'Origin', value: adData.origin_display }] : []),
                ...(adData.contamination_display ? [{ name: 'Contamination', value: adData.contamination_display }] : []),
                ...(adData.additives_display ? [{ name: 'Additives', value: adData.additives_display }] : []),
                ...(adData.storage_conditions_display ? [{ name: 'Storage Conditions', value: adData.storage_conditions_display }] : []),
                ...(adData.processing_methods_display.length > 0 ? [{ name: 'Processing Methods', value: adData.processing_methods_display.join(', ') }] : []),
                { name: 'Quantity', value: adData.available_quantity ? `${adData.available_quantity} ${adData.unit_of_measurement_display}` : 'N/A' },
                { name: 'Minimum Order', value: `${adData.minimum_order_quantity} ${adData.unit_of_measurement_display}` },
                { name: 'Currency', value: adData.currency_display },
                { name: 'Auction Duration', value: adData.auction_duration_display },
                ...(adData.reserve_price ? [{ name: 'Reserve Price', value: `${adData.reserve_price} ${adData.currency}` }] : []),
                ...(adData.delivery_options_display.length > 0 ? [{ name: 'Delivery Options', value: adData.delivery_options_display.join(', ') }] : []),
                { name: 'Status', value: adData.status },
                { name: 'Completion Status', value: adData.is_complete ? 'Complete' : `Step ${adData.current_step} of 8` }
              ],
              
              // Additional metadata
              createdAt: adData.created_at,
              updatedAt: adData.updated_at,
              isActive: adData.status === 'active',
              auctionStatus: adData.status,
              stepCompletionStatus: adData.step_completion_status,
              keywords: adData.keywords
            };

            setAuction(formattedAuction);

            // Fetch bid history for this auction
            // Fetch bid history for active auctions (regardless of completion status)
            if (adData.status === 'active') {
              getAuctionBidHistory(adData.id)
                .then(bidHistoryResponse => {
                  if (!bidHistoryResponse.error && bidHistoryResponse.data) {
                    const bidHistoryData = bidHistoryResponse.data.bid_history || [];
                    setBidHistory(bidHistoryData);
                    setTotalBids(bidHistoryResponse.data.total_bids || 0);

                    // Update auction with bid history for backward compatibility
                    const formattedBids = bidHistoryData.map((bid: any) => ({
                      bidder: bid.company_name,
                      amount: bid.bid_amount,
                      date: bid.created_at
                    }));

                    setAuction((prevAuction: any) => ({
                      ...prevAuction,
                      bidHistory: formattedBids,
                      highestBid: formattedBids.length > 0 ? `${formattedBids[0].amount} ${adData.currency}` : null
                    }));
                  }
                })
                .catch(_error => {
                  // Error handling for bid history fetch failures
                });
            }
          } else {
            // Fallback to old API if enhanced endpoint fails
            return getAuctionById(params.id as string);
          }
        })
        .then(fallbackResponse => {
          if (fallbackResponse && (fallbackResponse.error || !fallbackResponse.data)) {
            // Both APIs failed, auction not found
            router.push('/dashboard/auctions');
          } else if (fallbackResponse && fallbackResponse.data) {
            // Format fallback API data
            const apiAuction = fallbackResponse.data;
            const formattedAuction = {
              id: apiAuction.id.toString(),
              name: apiAuction.title || `${apiAuction.category_name} - ${apiAuction.subcategory_name}`,
              category: apiAuction.category_name,
              basePrice: apiAuction.starting_bid_price || apiAuction.total_starting_value,
              highestBid: null,
              timeLeft: 'Available',
              volume: apiAuction.available_quantity ? `${apiAuction.available_quantity} ${apiAuction.unit_of_measurement}` : 'N/A',
              seller: 'Unknown Seller',
              countryOfOrigin: apiAuction.location_summary || 'Unknown',
              image: apiAuction.material_image ? getFullImageUrl(apiAuction.material_image) : '/images/marketplace/categories/plastics.jpg',
              description: apiAuction.title || `${apiAuction.category_name} material available for auction`,
              bidHistory: [],
              specifications: [
                { name: 'Material Type', value: apiAuction.category_name },
                { name: 'Subcategory', value: apiAuction.subcategory_name },
                { name: 'Quantity', value: apiAuction.available_quantity ? `${apiAuction.available_quantity} ${apiAuction.unit_of_measurement}` : 'N/A' },
                { name: 'Location', value: apiAuction.location_summary || 'Unknown' },
                { name: 'Currency', value: apiAuction.currency },
                { name: 'Status', value: apiAuction.status === 'active' ? 'Active' : 'Inactive' }
              ]
            };
            setAuction(formattedAuction);
          }
        })
        .catch(_error => {
          // All attempts failed, auction not found
          router.push('/dashboard/auctions');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [params.id, router]);

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
            onClick={() => router.push('/dashboard/auctions')}
            className="mt-4 px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors"
          >
            Back to Auctions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-full mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard/auctions')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span className="font-medium">Back to Auctions</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-md text-sm font-medium border ${
                auction.auctionStatus === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                auction.auctionStatus === 'Draft' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                'bg-gray-50 text-gray-700 border-gray-200'
              }`}>
                {auction.auctionStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-6 lg:px-12 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          <div className="grid grid-cols-1 xl:grid-cols-5">
            {/* Image Section - Takes more space */}
            <div className="relative h-80 xl:h-[500px] xl:col-span-3">
              <Image
                src={auction.image}
                alt={auction.name}
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback to category image on error
                  const target = e.target as HTMLImageElement;
                  target.src = getCategoryImage(auction.category);
                }}
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white px-3 py-1 rounded-md text-sm font-medium text-gray-900 shadow-sm">
                  {auction.category}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <div className="bg-gray-900 px-3 py-2 rounded-md text-white flex items-center space-x-2">
                  <Clock size={16} />
                  <span className="text-sm font-medium">{auction.timeLeft}</span>
                </div>
              </div>
            </div>

            {/* Content Section - Takes remaining space */}
            <div className="p-8 xl:col-span-2">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{auction.name}</h1>
                
                {auction.company && (
                  <div className="flex items-center text-gray-600 text-sm">
                    <Building className="w-4 h-4 mr-2" />
                    <span>Posted by <span className="font-medium text-gray-900">{auction.seller}</span></span>
                    {auction.company && <span className="ml-1">from {auction.company}</span>}
                  </div>
                )}
              </div>

              {/* Key Information Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-md p-4">
                  <div className="text-sm text-gray-500 mb-1">
                    {auction.highestBid ? 'Current Highest Bid' : 'Starting Price'}
                  </div>
                  <div className="text-xl font-bold text-[#FF8A00]">
                    {auction.highestBid || auction.basePrice}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-md p-4">
                  <div className="text-sm text-gray-500 mb-1 flex items-center">
                    <Package className="w-4 h-4 mr-1" />
                    Volume
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {auction.volume}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-md p-4">
                  <div className="text-sm text-gray-500 mb-1 flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    Seller
                  </div>
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {auction.seller || 'Unknown Seller'}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-md p-4">
                  <div className="text-sm text-gray-500 mb-1 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Origin
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {auction.countryOfOrigin}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {auction.stepCompletionStatus && (() => {
                const stepCompletion = calculateStepCompletion(auction.stepCompletionStatus, auction.category);
                return (
                  <div className="border border-gray-200 rounded-md p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Completion Progress</span>
                      <span className="text-sm text-gray-500">
                        {stepCompletion.completed} of {stepCompletion.total} steps
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#FF8A00] h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${stepCompletion.percentage}%`
                        }}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Keywords */}
              {auction.keywords && (
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-700 mb-2">Keywords</div>
                  <div className="flex flex-wrap gap-2">
                    {auction.keywords.split(',').map((keyword: string, index: number) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                        {keyword.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => openBidModal(auction)}
                disabled={auction.auctionStatus === 'Draft' || !auction.isActive}
                className={`w-full py-3 rounded-md font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  auction.auctionStatus === 'Draft' || !auction.isActive
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                    : 'bg-[#FF8A00] text-white hover:bg-[#e67e00] shadow-sm hover:shadow'
                }`}
              >
                {auction.auctionStatus === 'Draft' ? (
                  <span>Draft - Not Available for Bidding</span>
                ) : (
                  <>
                    <span>Place Bid</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{auction.description}</p>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3">
                {auction.specifications.map((spec: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div className="text-gray-600 text-sm">{spec.name}</div>
                    <div className="text-gray-900 font-medium text-sm text-right">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bid History */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Bid History</h2>
                {totalBids > 0 && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {totalBids} bid{totalBids !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {bidHistory.length > 0 ? (
                <div className="overflow-hidden border border-gray-200 rounded-md">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Company</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Bid Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Volume</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total Value</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date & Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bidHistory.map((bid: any) => (
                        <tr key={bid.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">{bid.company_name}</td>
                          <td className="px-4 py-3 text-sm font-medium text-[#FF8A00]">
                            {bid.bid_amount} {bid.currency}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {bid.volume_requested} {auction.unitOfMeasurement || 'unit'}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {bid.total_value} {bid.currency}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{formatDate(bid.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 border border-gray-200 rounded-md bg-gray-50">
                  <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No bids placed yet</p>
                  <p className="text-gray-400 text-xs mt-1">Be the first to bid on this auction!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Auction Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Auction Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium text-gray-900">{auction.category}</span>
                </div>
                {auction.subcategory && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subcategory</span>
                    <span className="font-medium text-gray-900">{auction.subcategory}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Volume</span>
                  <span className="font-medium text-gray-900">{auction.volume}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Time Left</span>
                  <span className="font-medium text-[#FF8A00]">{auction.timeLeft}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Bids</span>
                  <span className="font-medium text-gray-900">{totalBids}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium text-gray-900">{auction.createdAt ? formatDate(auction.createdAt) : 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Building className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{auction.seller || 'Unknown Seller'}</div>
                    {auction.company && (
                      <div className="text-gray-600 text-xs">{auction.company}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{auction.countryOfOrigin}</span>
                </div>
              </div>
            </div>

            {/* Status */}
            {auction.auctionStatus && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Current Status</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      auction.auctionStatus === 'Active' ? 'bg-green-50 text-green-700' :
                      auction.auctionStatus === 'Draft' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      {auction.auctionStatus}
                    </span>
                  </div>
                  {auction.stepCompletionStatus && (() => {
                    const stepCompletion = calculateStepCompletion(auction.stepCompletionStatus, auction.category);
                    return (
                      <div>
                        <div className="text-sm text-gray-600 mb-2">
                          Completion: {stepCompletion.completed}/{stepCompletion.total} steps
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-[#FF8A00] h-1.5 rounded-full transition-all duration-300"
                            style={{
                              width: `${stepCompletion.percentage}%`
                            }}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Additional Info Card for Better Space Utilization */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => openBidModal(auction)}
                  disabled={auction.auctionStatus === 'Draft' || !auction.isActive}
                  className={`w-full py-2 rounded-md font-medium transition-colors text-sm ${
                    auction.auctionStatus === 'Draft' || !auction.isActive
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[#FF8A00] text-white hover:bg-[#e67e00]'
                  }`}
                >
                  {auction.auctionStatus === 'Draft' ? 'Not Available' : 'Place Bid'}
                </button>
                <button className="w-full py-2 bg-gray-50 text-gray-700 rounded-md font-medium hover:bg-gray-100 transition-colors text-sm">
                  Watch Auction
                </button>
                <button className="w-full py-2 bg-gray-50 text-gray-700 rounded-md font-medium hover:bg-gray-100 transition-colors text-sm">
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
