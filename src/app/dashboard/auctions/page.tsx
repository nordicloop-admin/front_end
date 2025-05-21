"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Clock, ArrowUpRight, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import PlaceBidModal from '@/components/auctions/PlaceBidModal';
import useBidding from '@/hooks/useBidding';
import { getAuctions, AuctionItem } from '@/services/auction';

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
    image: '/images/marketplace/categories/plastics.jpg'
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
    image: '/images/marketplace/categories/plastics-alt.jpg'
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
    image: '/images/marketplace/categories/metals.jpg'
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
    image: '/images/marketplace/categories/paper.jpg'
  }
];

// Categories for filter
const categories = [
  'All materials',
  'Plastics',
  'Metals',
  'Paper',
  'Glass',
  'Wood',
  'Textiles'
];

export default function Auctions() {
  const [selectedCategory, setSelectedCategory] = useState('All materials');
  const [searchTerm, setSearchTerm] = useState('');
  const { selectedAuction, isModalOpen, openBidModal, closeBidModal, submitBid } = useBidding();

  // State for API auctions
  const [apiAuctions, setApiAuctions] = useState<AuctionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch auctions from API
  useEffect(() => {
    const fetchAuctions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getAuctions();

        if (response.error) {
          console.error('Error fetching auctions:', response.error, 'Status:', response.status);

          // Check if it's an authentication error
          if (response.status === 401) {
            setError('Authentication required. Please log in to view auctions.');
          } else {
            setError(response.error);
          }
        } else if (response.data) {
          console.log('Auctions fetched successfully:', response.data);
          setApiAuctions(response.data);
        } else {
          console.warn('No auctions data returned from API');
          setError('No auctions found');
        }
      } catch (err) {
        console.error('Error in fetchAuctions:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch auctions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuctions();
  }, []);

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

  // Convert API auctions to the format expected by the UI
  const convertedAuctions = apiAuctions.map(auction => ({
    id: auction.id.toString(),
    name: auction.item_name,
    category: auction.item_name.split(' ')[0], // Temporary category extraction
    basePrice: auction.base_price,
    highestBid: null, // API doesn't provide highest bid yet
    timeLeft: calculateTimeLeft(auction.end_date, auction.end_time),
    volume: `${auction.volume} ${auction.unit}`,
    seller: 'Unknown', // API doesn't provide seller info yet
    countryOfOrigin: auction.country_of_origin,
    image: auction.item_image || '/images/marketplace/categories/plastics.jpg' // Fallback image
  }));

  // Use API auctions if available, otherwise fall back to mock data
  const auctionsToDisplay = apiAuctions.length > 0 ? convertedAuctions : marketplaceAuctions;

  // Filter auctions based on search term and category
  const filteredAuctions = auctionsToDisplay.filter(auction => {
    const matchesSearch = searchTerm === '' ||
      auction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (auction.seller && auction.seller.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (auction.category && auction.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'All materials' ||
      (auction.category && auction.category === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-5">
      <h1 className="text-xl font-medium mb-5">Available Auctions</h1>

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
          <select
            className="px-4 py-2 border border-gray-100 rounded-md bg-white text-sm appearance-none pr-8 relative"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div className="relative right-6 pointer-events-none">
            <Filter size={16} className="text-gray-500" />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-3 py-1 rounded-full text-xs ${
              selectedCategory === category
                ? 'bg-[#FF8A00] text-white'
                : 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white border border-gray-100 rounded-md p-6 flex justify-center items-center">
          <Loader2 size={24} className="animate-spin text-[#FF8A00] mr-2" />
          <p className="text-gray-700">Loading auctions...</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="bg-white border border-red-100 rounded-md p-6 text-center">
          <div className="flex justify-center mb-2">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <p className="text-red-500 font-medium">Error loading auctions</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Auctions Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAuctions.map((auction) => (
            <div key={auction.id} className="bg-white border border-gray-100 rounded-md overflow-hidden">
              <div className="relative h-40 w-full">
                <Image
                  src={auction.image}
                  alt={auction.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs">
                  {auction.category}
                </div>
                <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white flex items-center">
                  <Clock size={12} className="mr-1" />
                  {auction.timeLeft}
                </div>
              </div>

              <div className="p-3">
                <h2 className="text-sm font-medium text-gray-900 line-clamp-1">{auction.name}</h2>

                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <div>Origin: {auction.countryOfOrigin}</div>
                  <div>Volume: {auction.volume}</div>
                </div>

                <div className="mt-2 flex justify-between items-center">
                  <div>
                    <div className="text-xs text-gray-500">
                      {auction.highestBid ? 'Highest Bid' : 'Base Price'}
                    </div>
                    <div className="text-sm font-medium text-[#FF8A00]">
                      {auction.highestBid || auction.basePrice}
                    </div>
                  </div>

                  <button
                    onClick={() => openBidModal(auction)}
                    className="px-3 py-1.5 bg-[#FF8A00] text-white rounded-md text-xs hover:bg-[#e67e00] transition-colors flex items-center"
                  >
                    Place Bid
                    <ArrowUpRight size={12} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && filteredAuctions.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-md p-6 text-center">
          <p className="text-gray-500 text-sm">No auctions found matching your criteria.</p>
        </div>
      )}

      {/* Bid Modal */}
      {selectedAuction && (
        <PlaceBidModal
          isOpen={isModalOpen}
          onClose={closeBidModal}
          onSubmit={submitBid}
          auction={selectedAuction}
        />
      )}
    </div>
  );
}
