"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Clock, Building, MapPin, Package, ArrowUpRight, AlertCircle } from 'lucide-react';
import PlaceBidModal from '@/components/auctions/PlaceBidModal';
import useBidding from '@/hooks/useBidding';
import { getAuctionById, getAdDetails } from '@/services/auction';
import { getAuctionBids } from '@/services/bid';

// Mock data for marketplace auctions
const marketplaceAuctions = [
  {
    id: '1',
    name: 'PPA Thermocomp UFW49RSC (Black)',
    category: 'Plastics',
    basePrice: '5,013,008',
    highestBid: '5,250,000',
    timeLeft: '2d 4h',
    volume: '500 kg',
    seller: 'Eco Solutions AB',
    countryOfOrigin: 'Sweden',
    image: '/images/marketplace/categories/plastics.jpg',
    description: 'High-quality recycled PPA Thermocomp material in black color. This material has been processed and tested to meet industry standards. Suitable for automotive and industrial applications.',
    bidHistory: [
      { bidder: 'Company A', amount: '5,250,000', date: '2023-06-14T15:30:00Z' },
      { bidder: 'Company B', amount: '5,150,000', date: '2023-06-14T12:15:00Z' },
      { bidder: 'Company C', amount: '5,100,000', date: '2023-06-13T09:45:00Z' },
    ],
    specifications: [
      { name: 'Material Type', value: 'PPA Thermocomp' },
      { name: 'Color', value: 'Black' },
      { name: 'Grade', value: 'UFW49RSC' },
      { name: 'Quantity', value: '500 kg' },
      { name: 'Packaging', value: 'Bulk bags' },
      { name: 'Recycled Content', value: '100%' },
      { name: 'Certification', value: 'ISO 14001' },
    ]
  },
  {
    id: '2',
    name: 'PPA Thermocomp UFW49RSC (White)',
    category: 'Plastics',
    basePrice: '4,850,000',
    highestBid: null,
    timeLeft: '5d 12h',
    volume: '750 kg',
    seller: 'Green Tech Norway',
    countryOfOrigin: 'Norway',
    image: '/images/marketplace/categories/plastics-alt.jpg',
    description: 'Premium recycled PPA Thermocomp material in white color. This material has been carefully processed to maintain color consistency and quality. Ideal for consumer products and medical applications.',
    bidHistory: [],
    specifications: [
      { name: 'Material Type', value: 'PPA Thermocomp' },
      { name: 'Color', value: 'White' },
      { name: 'Grade', value: 'UFW49RSC' },
      { name: 'Quantity', value: '750 kg' },
      { name: 'Packaging', value: 'Bulk bags' },
      { name: 'Recycled Content', value: '100%' },
      { name: 'Certification', value: 'ISO 14001' },
    ]
  },
  {
    id: '3',
    name: 'Aluminum Scrap 6061',
    category: 'Metals',
    basePrice: '7,250,000',
    highestBid: '7,500,000',
    timeLeft: '3d 6h',
    volume: '1200 kg',
    seller: 'Circular Materials Oy',
    countryOfOrigin: 'Finland',
    image: '/images/marketplace/categories/metals.jpg',
    description: 'High-grade aluminum scrap 6061 alloy. Clean and sorted material suitable for recycling and manufacturing. This material has been tested for purity and meets industry standards.',
    bidHistory: [
      { bidder: 'Company D', amount: '7,500,000', date: '2023-06-15T10:30:00Z' },
      { bidder: 'Company E', amount: '7,400,000', date: '2023-06-14T14:45:00Z' },
      { bidder: 'Company F', amount: '7,300,000', date: '2023-06-14T08:20:00Z' },
    ],
    specifications: [
      { name: 'Material Type', value: 'Aluminum' },
      { name: 'Grade', value: '6061' },
      { name: 'Form', value: 'Scrap' },
      { name: 'Quantity', value: '1200 kg' },
      { name: 'Packaging', value: 'Pallets' },
      { name: 'Purity', value: '98%' },
      { name: 'Certification', value: 'ISO 9001' },
    ]
  },
  {
    id: '4',
    name: 'Recycled Cardboard Sheets',
    category: 'Paper',
    basePrice: '2,500,000',
    highestBid: null,
    timeLeft: '6d 18h',
    volume: '850 kg',
    seller: 'Eco Solutions AB',
    countryOfOrigin: 'Sweden',
    image: '/images/marketplace/categories/paper.jpg',
    description: 'High-quality recycled cardboard sheets suitable for packaging and manufacturing. These sheets have been processed to maintain structural integrity and are free from contaminants.',
    bidHistory: [],
    specifications: [
      { name: 'Material Type', value: 'Cardboard' },
      { name: 'Thickness', value: '2mm' },
      { name: 'Quantity', value: '850 kg' },
      { name: 'Packaging', value: 'Flat stacks' },
      { name: 'Recycled Content', value: '100%' },
      { name: 'Certification', value: 'FSC' },
    ]
  }
];

export default function AuctionDetail() {
  const params = useParams();
  const router = useRouter();
  const { selectedAuction, isModalOpen, openBidModal, closeBidModal, submitBid } = useBidding();
  const [auction, setAuction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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
              image: adData.material_image || '/images/marketplace/categories/plastics.jpg',
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
                { name: 'Pickup Available', value: adData.pickup_available ? 'Yes' : 'No' },
                ...(adData.delivery_options_display.length > 0 ? [{ name: 'Delivery Options', value: adData.delivery_options_display.join(', ') }] : []),
                { name: 'Status', value: adData.auction_status },
                { name: 'Completion Status', value: adData.is_complete ? 'Complete' : `Step ${adData.current_step} of 8` }
              ],
              
              // Additional metadata
              createdAt: adData.created_at,
              updatedAt: adData.updated_at,
              isActive: adData.is_active,
              auctionStatus: adData.auction_status,
              stepCompletionStatus: adData.step_completion_status,
              keywords: adData.keywords
            };

            setAuction(formattedAuction);

            // Fetch bids for this auction
            if (adData.is_active && adData.is_complete) {
              getAuctionBids(adData.id)
                .then(bidsResponse => {
                  if (!bidsResponse.error && bidsResponse.data && bidsResponse.data.length > 0) {
                    const formattedBids = bidsResponse.data.map(bid => ({
                      bidder: bid.user || 'Anonymous',
                      amount: bid.amount,
                      date: bid.timestamp
                    }));

                    setAuction((prevAuction: any) => ({
                      ...prevAuction,
                      bidHistory: formattedBids,
                      highestBid: formattedBids[0].amount
                    }));
                  }
                })
                .catch(_error => {
                  // Error handling for bids fetch failures
                });
            }
          } else {
            // Fallback to old API if enhanced endpoint fails
            return getAuctionById(params.id as string);
          }
        })
        .then(fallbackResponse => {
          if (fallbackResponse && (fallbackResponse.error || !fallbackResponse.data)) {
            // Both APIs failed, try mock data
            const foundAuction = marketplaceAuctions.find(a => a.id === params.id);

            if (foundAuction) {
              setAuction(foundAuction);
            } else {
              router.push('/dashboard/auctions');
            }
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
              image: apiAuction.material_image || '/images/marketplace/categories/plastics.jpg',
              description: apiAuction.title || `${apiAuction.category_name} material available for auction`,
              bidHistory: [],
              specifications: [
                { name: 'Material Type', value: apiAuction.category_name },
                { name: 'Subcategory', value: apiAuction.subcategory_name },
                { name: 'Quantity', value: apiAuction.available_quantity ? `${apiAuction.available_quantity} ${apiAuction.unit_of_measurement}` : 'N/A' },
                { name: 'Location', value: apiAuction.location_summary || 'Unknown' },
                { name: 'Currency', value: apiAuction.currency },
                { name: 'Status', value: apiAuction.is_active ? 'Active' : 'Inactive' }
              ]
            };
            setAuction(formattedAuction);
          }
        })
        .catch(_error => {
          // All attempts failed, try mock data as last resort
          const foundAuction = marketplaceAuctions.find(a => a.id === params.id);
          if (foundAuction) {
            setAuction(foundAuction);
          } else {
            router.push('/dashboard/auctions');
          }
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
    <div className="p-5">
      <div className="mb-5">
        <button
          onClick={() => router.push('/dashboard/auctions')}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Auctions
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
            <h1 className="text-xl font-medium text-gray-900">{auction.name}</h1>
            
            {/* Enhanced seller information */}
            {auction.company && (
              <div className="mt-2 text-sm text-gray-600">
                Posted by <span className="font-medium">{auction.seller}</span> 
                {auction.company && <span> from {auction.company}</span>}
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">
                  {auction.highestBid ? 'Current Highest Bid' : 'Base Price'}
                </div>
                <div className="text-lg font-medium text-[#FF8A00]">
                  {auction.highestBid || auction.basePrice}
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
                <div className="text-xs text-gray-500">Seller</div>
                <div className="text-sm font-medium flex items-center">
                  <Building size={14} className="mr-1 text-gray-500" />
                  {auction.seller || 'Unknown Seller'}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Origin</div>
                <div className="text-sm font-medium flex items-center">
                  <MapPin size={14} className="mr-1 text-gray-500" />
                  {auction.countryOfOrigin}
                </div>
              </div>
            </div>

            {/* Enhanced status display */}
            {auction.auctionStatus && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    auction.auctionStatus === 'Active' ? 'bg-green-100 text-green-700' :
                    auction.auctionStatus === 'Draft' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {auction.auctionStatus}
                  </span>
                </div>
                {auction.stepCompletionStatus && (
                  <div className="mt-2 text-xs text-gray-500">
                    Steps completed: {Object.values(auction.stepCompletionStatus).filter(Boolean).length} of 8
                  </div>
                )}
              </div>
            )}

            {/* Keywords display */}
            {auction.keywords && (
              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-2">Keywords</div>
                <div className="flex flex-wrap gap-1">
                  {auction.keywords.split(',').map((keyword: string, index: number) => (
                    <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {keyword.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={() => openBidModal(auction)}
                className="w-full py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors flex items-center justify-center"
                disabled={auction.auctionStatus === 'Draft' || !auction.isActive}
              >
                {auction.auctionStatus === 'Draft' ? 'Draft - Not Available for Bidding' : 'Place Bid'}
                {auction.auctionStatus !== 'Draft' && <ArrowUpRight size={16} className="ml-1" />}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 p-6">
          <h2 className="text-lg font-medium mb-3">Description</h2>
          <p className="text-sm text-gray-700">{auction.description}</p>

          <h2 className="text-lg font-medium mt-6 mb-3">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {auction.specifications.map((spec: any, index: number) => (
              <div key={index} className="flex justify-between border-b border-gray-100 py-2">
                <div className="text-sm text-gray-500">{spec.name}</div>
                <div className="text-sm font-medium">{spec.value}</div>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-medium mt-6 mb-3">Bid History</h2>
          {auction.bidHistory.length > 0 ? (
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
                      <td className="px-4 py-3 text-sm">{bid.bidder}</td>
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
              <p className="text-sm text-gray-700 mt-1">Be the first to bid on this auction!</p>
            </div>
          )}
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
