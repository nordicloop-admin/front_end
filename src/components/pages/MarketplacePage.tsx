"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { SlidersHorizontal } from '@/components/ui/Icons';
import { CategoryFilter } from '@/components/marketplace/CategoryFilter';
import { LocationFilter } from '@/components/marketplace/LocationFilter';
import { TimeFilter } from '@/components/marketplace/TimeFilter';
import { FormFilter } from '@/components/marketplace/FormFilter';
import { QuantityFilter } from '@/components/marketplace/QuantityFilter';
import { SortDropdown } from '@/components/marketplace/SortDropdown';



// Mock data for marketplace items
const marketplaceItems = [
  {
    id: 1,
    category: 'Plastics',
    name: 'PPA Thermocomp UFW49RSC (Black)',
    basePrice: '5 013 008',
    highestBid: '5 250 000',
    timeLeft: '2d 4h',
    volume: '500 kg',
    countryOfOrigin: 'Sweden',
    image: '/images/marketplace/categories/plastics.jpg'
  },
  {
    id: 2,
    category: 'Plastics',
    name: 'PPA Thermocomp UFW49RSC (White)',
    basePrice: '4 850 000',
    highestBid: null,
    timeLeft: '5d 12h',
    volume: '750 kg',
    countryOfOrigin: 'Norway',
    image: '/images/marketplace/categories/plastics-alt.jpg'
  },
  {
    id: 3,
    category: 'Plastics',
    name: 'PPA Thermocomp UFW49RSC (Clear)',
    basePrice: '4 975 500',
    highestBid: '5 100 000',
    timeLeft: '1d 8h',
    volume: '600 kg',
    countryOfOrigin: 'Denmark',
    image: '/images/marketplace/categories/plastics.jpg'
  },
  {
    id: 4,
    category: 'Metals',
    name: 'Aluminum Scrap 6061',
    basePrice: '7 250 000',
    highestBid: '7 500 000',
    timeLeft: '3d 6h',
    volume: '1200 kg',
    countryOfOrigin: 'Finland',
    image: '/images/marketplace/categories/metals.jpg'
  },
  {
    id: 5,
    category: 'Paper',
    name: 'Recycled Cardboard Sheets',
    basePrice: '2 500 000',
    highestBid: null,
    timeLeft: '6d 18h',
    volume: '850 kg',
    countryOfOrigin: 'Sweden',
    image: '/images/marketplace/categories/paper.jpg'
  },
  {
    id: 6,
    category: 'Glass',
    name: 'Clear Glass Cullet',
    basePrice: '3 750 000',
    highestBid: '3 900 000',
    timeLeft: '4d 2h',
    volume: '1500 kg',
    countryOfOrigin: 'Norway',
    image: '/images/marketplace/categories/glass.jpg'
  },
  {
    id: 7,
    category: 'Wood',
    name: 'Reclaimed Pine Lumber',
    basePrice: '4 125 000',
    highestBid: '4 250 000',
    timeLeft: '2d 22h',
    volume: '950 kg',
    countryOfOrigin: 'Denmark',
    image: '/images/marketplace/categories/wood.jpg'
  },
  {
    id: 8,
    category: 'Textiles',
    name: 'Recycled Cotton Fabric',
    basePrice: '3 900 000',
    highestBid: null,
    timeLeft: '7d 14h',
    volume: '350 kg',
    countryOfOrigin: 'Finland',
    image: '/images/marketplace/categories/textiles.jpg'
  },
];

// Product Card Component
const ProductCard = ({ item }: { item: typeof marketplaceItems[0] }) => {
  const handleItemClick = () => {
    window.location.href = '/coming-soon';
  };

  const handleBidClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event
    alert('Bidding functionality coming soon!');
  };

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      onClick={handleItemClick}
    >
      <div className="relative h-48 w-full">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 hover:scale-105"
          priority={item.id <= 4} // Prioritize loading the first 4 images
        />
        <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium">
          {item.category}
        </div>
        {/* Time left badge */}
        <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-medium text-white">
          {item.timeLeft} left
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-2 h-12">{item.name}</h3>

        {/* Country of origin and volume */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <div>
            <span>Origin: {item.countryOfOrigin}</span>
          </div>
          <div>
            <span>Volume: {item.volume}</span>
          </div>
        </div>

        {/* Price information */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {item.highestBid ? 'Highest Bid' : 'Base Price'}
          </span>
          <span className="font-semibold text-blue-600">
            {item.highestBid || item.basePrice}
          </span>
        </div>

        {/* Bid button */}
        <button
          className="mt-3 w-full bg-[#FF8A00] text-white py-2 rounded hover:bg-[#e67e00] transition-colors text-sm font-medium"
          onClick={handleBidClick}
        >
          Place Bid
        </button>
      </div>
    </div>
  );
};

const MarketplacePage = () => {
  const [sortOption, setSortOption] = useState('Recently');
  const [selectedCategory, setSelectedCategory] = useState('All materials');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState('All time');
  const [minQuantity, setMinQuantity] = useState(0);
  const [maxQuantity, setMaxQuantity] = useState(10000);

  // Helper function to toggle form selection
  const toggleFormSelection = (form: string) => {
    if (selectedForms.includes(form)) {
      setSelectedForms(selectedForms.filter(f => f !== form));
    } else {
      setSelectedForms([...selectedForms, form]);
    }
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

  // Fetch auctions from API
  useEffect(() => {
    const fetchAuctions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getAuctions();

        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setApiAuctions(response.data);
        } else {
          setError('No auctions found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch auctions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  // Convert API auctions to the format expected by the UI
  const convertedAuctions = apiAuctions.map(auction => ({
    id: auction.id.toString(),
    name: auction.title || `${auction.category_name} - ${auction.subcategory_name}`,
    category: auction.category_name,
    basePrice: auction.starting_bid_price || auction.total_starting_value,
    highestBid: null, // API doesn't provide highest bid yet
    timeLeft: 'Available', // API doesn't provide end date/time in this format
    volume: auction.available_quantity ? `${auction.available_quantity} ${auction.unit_of_measurement}` : 'N/A',
    countryOfOrigin: auction.location_summary || 'Unknown',
    image: auction.material_image || '/images/marketplace/categories/plastics.jpg' // Fallback image
  }));

  // Filter auctions based on search term and category
  const filteredAuctions = convertedAuctions.filter(auction => {
    const matchesCategory = selectedCategory === 'All materials' ||
      (auction.category && auction.category === selectedCategory);

    const matchesLocation = selectedLocation === 'All Locations' ||
      (auction.countryOfOrigin && auction.countryOfOrigin === selectedLocation);

    return matchesCategory && matchesLocation;
  });

  return (
    <div className="py-8 px-4 md:px-8 max-w-7xl mx-auto">

      {/* Marketplace Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold">Available Ads</h1>
          <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm">
            {selectedCategory === 'All materials'
              ? marketplaceItems.length
              : marketplaceItems.filter(item => item.category === selectedCategory).length}
          </span>
        </div>

        <div className="flex w-full sm:w-auto space-x-3">
          {/* Sort Dropdown */}
          <div className="relative w-full sm:w-auto">
            <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
          </div>

          {/* Categories Button */}
          <button className="flex items-center px-4 py-2 bg-gray-100 rounded-md">
            <SlidersHorizontal size={16} className="mr-2" />
            <span>Categories</span>
          </button>
        </div>
      </div>

      {/* Materials Filter Dropdown */}
      <div className="mb-6">
        <div className="flex items-center space-x-0 overflow-x-auto border-t border-b border-gray-200">
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <LocationFilter
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />

          <QuantityFilter
            minQuantity={minQuantity}
            maxQuantity={maxQuantity}
            setMinQuantity={setMinQuantity}
            setMaxQuantity={setMaxQuantity}
          />

          <FormFilter
            selectedForms={selectedForms}
            toggleFormSelection={toggleFormSelection}
          />

          <TimeFilter
            selectedDateFilter={selectedDateFilter}
            setSelectedDateFilter={setSelectedDateFilter}
          />

        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {marketplaceItems
          .filter(item => selectedCategory === 'All materials' ? true : item.category === selectedCategory)
          .map((item) => (
            <div key={item.id} className="cursor-pointer">
              <ProductCard item={item} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default MarketplacePage;
