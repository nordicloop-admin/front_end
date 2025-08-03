"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Loader2, AlertCircle } from 'lucide-react';
// import { SlidersHorizontal } from '@/components/ui/Icons';
import { CategoryFilter } from '@/components/marketplace/CategoryFilter';
import { LocationFilter } from '@/components/marketplace/LocationFilter';
import { TimeFilter } from '@/components/marketplace/TimeFilter';
import { FormFilter } from '@/components/marketplace/FormFilter';
import { QuantityFilter } from '@/components/marketplace/QuantityFilter';
import { BrokerFilter } from '@/components/marketplace/BrokerFilter';
import { OriginFilter } from '@/components/marketplace/OriginFilter';
import { ContaminationFilter } from '@/components/marketplace/ContaminationFilter';
import { SortDropdown } from '@/components/marketplace/SortDropdown';
import { getAuctions, AuctionItem, PaginatedAuctionResult } from '@/services/auction';
import Pagination from '@/components/ui/Pagination';
import { getFullImageUrl } from '@/utils/imageUtils';
import { getCategoryImage } from '@/utils/categoryImages';

// Mock data for marketplace items
const _marketplaceItems = [
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
const ProductCard = ({ item }: { item: any }) => {
  const handleItemClick = () => {
    window.location.href = `/dashboard/auctions/${item.id}`;
  };

  const handleBidClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event
    window.location.href = `/dashboard/auctions/${item.id}`;
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
          onError={(e) => {
            // Fallback to category image on error
            const target = e.target as HTMLImageElement;
            target.src = getCategoryImage(item.category);
          }}
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
  const [selectedBrokerFilter, setSelectedBrokerFilter] = useState('all');
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [selectedContamination, setSelectedContamination] = useState('');

  // Filter state for API calls
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subcategoryIds, setSubcategoryIds] = useState<number[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  // State for API auctions and pagination
  const [apiAuctions, setApiAuctions] = useState<AuctionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12); // Show more items per page for marketplace
  const [paginationData, setPaginationData] = useState({
    count: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 12
  });

  // Helper function to toggle form selection
  const toggleFormSelection = (form: string) => {
    if (selectedForms.includes(form)) {
      setSelectedForms(selectedForms.filter(f => f !== form));
    } else {
      setSelectedForms([...selectedForms, form]);
    }
  };

  // Filter callback functions
  const handleCategoryChange = (categoryId: number | null, subcategoryIds: number[]) => {
    setCategoryId(categoryId);
    setSubcategoryIds(subcategoryIds);
  };

  const handleLocationChange = (countries: string[]) => {
    setSelectedCountries(countries);
  };

  const handleOriginChange = (origin: string | null) => {
    setSelectedOrigin(origin || '');
  };

  const handleContaminationChange = (contamination: string | null) => {
    setSelectedContamination(contamination || '');
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

  // Fetch auctions from API
  const fetchAuctions = async (page: number = 1, size: number = 12) => {
    setIsLoading(true);
    setError(null);

    try {
      const filterParams = {
        exclude_brokers: selectedBrokerFilter === 'exclude_brokers',
        only_brokers: selectedBrokerFilter === 'only_brokers',
        category: categoryId || undefined,
        subcategory: subcategoryIds.length === 1 ? subcategoryIds[0] : undefined,
        origin: selectedOrigin || undefined,
        contamination: selectedContamination || undefined,
        country: selectedCountries.length > 0 ? selectedCountries[0] : undefined, // API supports single country
      };

      const response = await getAuctions({
        page,
        page_size: size,
        ...filterParams
      });

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        const result = response.data as PaginatedAuctionResult;
        setApiAuctions(result.auctions);
        setPaginationData({
          count: result.pagination.count,
          totalPages: result.pagination.total_pages,
          currentPage: result.pagination.current_page,
          pageSize: result.pagination.page_size
        });
      } else {
        setError('No auctions found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch auctions');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and refetch when filters change
  useEffect(() => {
    fetchAuctions(currentPage, pageSize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, selectedBrokerFilter, categoryId, subcategoryIds, selectedOrigin, selectedContamination, selectedCountries]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

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
    image: auction.material_image ? getFullImageUrl(auction.material_image) : getCategoryImage(auction.category_name)
  }));

  // Since we're now using server-side filtering, we use the API results directly
  // The server already filters based on category, location, origin, contamination, etc.
  const filteredAuctions = convertedAuctions;

  return (
    <div className="py-8 px-4 md:px-8 max-w-7xl mx-auto">

      {/* Marketplace Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold">Available Ads</h1>
          <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm">
            {paginationData.count}
          </span>
        </div>

        <div className="flex w-full sm:w-auto space-x-3">
          {/* Sort Dropdown */}
          <div className="relative w-full sm:w-auto">
            <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
          </div>
        </div>
      </div>

      {/* Materials Filter Dropdown */}
      <div className="mb-6">
        <div className="flex items-center space-x-0 overflow-x-auto border-t border-b border-gray-200">
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          <LocationFilter
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            onLocationChange={handleLocationChange}
          />

          <OriginFilter
            selectedOrigin={selectedOrigin}
            setOrigin={setSelectedOrigin}
            onOriginChange={handleOriginChange}
          />

          <ContaminationFilter
            selectedContamination={selectedContamination}
            setContamination={setSelectedContamination}
            onContaminationChange={handleContaminationChange}
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

          <BrokerFilter
            selectedBrokerFilter={selectedBrokerFilter}
            setBrokerFilter={setSelectedBrokerFilter}
          />

          <TimeFilter
            selectedDateFilter={selectedDateFilter}
            setSelectedDateFilter={setSelectedDateFilter}
          />
        </div>
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
            onClick={() => fetchAuctions(currentPage, pageSize)}
            className="mt-4 px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {filteredAuctions.length > 0 ? (
              filteredAuctions.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">No auctions match your filters.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All materials');
                    setSelectedLocation('All Locations');
                    setSelectedForms([]);
                    setSelectedDateFilter('All time');
                    setSelectedBrokerFilter('all');
                    setSelectedOrigin('');
                    setSelectedContamination('');
                    setCategoryId(null);
                    setSubcategoryIds([]);
                    setSelectedCountries([]);
                  }}
                  className="mt-2 text-[#FF8A00] hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {apiAuctions.length > 0 && (
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
      )}
    </div>
  );
};

export default MarketplacePage;
