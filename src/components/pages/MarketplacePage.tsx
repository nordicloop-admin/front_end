"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Loader2, AlertCircle } from 'lucide-react';
// import { SlidersHorizontal } from '@/components/ui/Icons';
import { CategoryFilter } from '@/components/marketplace/CategoryFilter';
import { LocationFilter } from '@/components/marketplace/LocationFilter';

import { BrokerFilter } from '@/components/marketplace/BrokerFilter';
import { OriginFilter } from '@/components/marketplace/OriginFilter';
import { ContaminationFilter } from '@/components/marketplace/ContaminationFilter';

import { getAuctions, AuctionItem, PaginatedAuctionResult } from '@/services/auction';
import Pagination from '@/components/ui/Pagination';
import { getFullImageUrl } from '@/utils/imageUtils';
import { getCategoryImage } from '@/utils/categoryImages';
import { formatTimeRemaining } from '@/utils/timeUtils';

// No mock data - marketplace shows only real data from the database

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
      className="bg-white rounded-lg overflow-hidden border border-gray-200 transition-colors duration-200 hover:border-gray-300 cursor-pointer"
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
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{item.priceLabel}</span>
            <span className="flex items-baseline font-semibold text-[#FF8A00]" title={item.pricePerUnitDisplay + (item.unit ? ` per ${item.unit}` : '')}>
              {item.pricePerUnitDisplay}
              {item.unit && (
                <span className="ml-1 text-[11px] font-medium text-gray-500 lowercase">
                  per {item.unit.replace('_', ' ')}
                </span>
              )}
            </span>
          </div>
          {item.totalValueDisplay && (
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-gray-500">Total Value</span>
              <span className="font-medium text-gray-700" title="Estimated total starting value">
                {item.totalValueDisplay}
              </span>
            </div>
          )}
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
  const [selectedCategory, setSelectedCategory] = useState('All materials');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedBrokerFilter, setSelectedBrokerFilter] = useState('all');
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [selectedContamination, setSelectedContamination] = useState('');

  // Filter state for API calls
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subcategoryIds, setSubcategoryIds] = useState<number[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  
  // Global subcategory selection state - persists across category switches
  const [globalSubcategorySelections, setGlobalSubcategorySelections] = useState<{
    [categoryId: number]: number[];
  }>({});
  
  // Store subcategory names for display purposes
  const [subcategoryNames, setSubcategoryNames] = useState<{
    [subcategoryId: number]: { name: string; categoryName: string };
  }>({});

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



  // Filter callback functions (legacy - kept for backward compatibility)
  const handleCategoryChange = (categoryId: number | null, _subcategoryIds: number[]) => {
    setCategoryId(categoryId);
    // Don't set subcategoryIds here - let global management handle it
  };
  
  // Global subcategory management - this is the main handler
  const handleGlobalSubcategoryChange = (categoryId: number, subcategoryIds: number[], subcategoryData?: { id: number; name: string; categoryName: string }[]) => {
    // Update global selections for this category
    const newGlobalSelections = {
      ...globalSubcategorySelections,
      [categoryId]: subcategoryIds
    };
    
    setGlobalSubcategorySelections(newGlobalSelections);
    
    // Update subcategory names for display
    if (subcategoryData) {
      setSubcategoryNames(prev => {
        const updated = { ...prev };
        subcategoryData.forEach(sub => {
          updated[sub.id] = { name: sub.name, categoryName: sub.categoryName };
        });
        // Remove names for subcategories no longer selected
        Object.keys(updated).forEach(subcatId => {
          const id = parseInt(subcatId);
          const stillSelected = Object.values(newGlobalSelections).flat().includes(id);
          if (!stillSelected) {
            delete updated[id];
          }
        });
        return updated;
      });
    }
    
    // Calculate all selected subcategories across all categories
    const allSelectedSubcategories = Object.values(newGlobalSelections).flat();
    
    // Update the main subcategory list for API calls
    setSubcategoryIds(allSelectedSubcategories);
    
    // Update category ID if we're working with a specific category
    if (categoryId && allSelectedSubcategories.length > 0) {
      setCategoryId(categoryId);
    } else if (allSelectedSubcategories.length === 0) {
      setCategoryId(null);
    }
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
        // Use multiple subcategories - the backend now supports this!
        subcategories: subcategoryIds.length > 0 ? subcategoryIds : undefined,
        origin: selectedOrigin || undefined,
        contamination: selectedContamination || undefined,
        country: selectedCountries.length > 0 ? selectedCountries[0] : undefined, // API supports single country
      };
      
      // API call with aggregated subcategories from all categories
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

  // Sync subcategoryIds with globalSubcategorySelections to ensure consistency
  useEffect(() => {
    const allSelectedSubcategories = Object.values(globalSubcategorySelections).flat();
    
    // Only update if different to avoid infinite loops
    if (JSON.stringify(allSelectedSubcategories.sort()) !== JSON.stringify(subcategoryIds.sort())) {
      setSubcategoryIds(allSelectedSubcategories);
    }
  }, [globalSubcategorySelections, subcategoryIds]);
  
  // Check if any filters are active
  useEffect(() => {
    const hasFilters = 
      selectedCategory !== 'All materials' ||
      selectedLocation !== 'All Locations' ||
      selectedBrokerFilter !== 'all' ||
      selectedOrigin !== '' ||
      selectedContamination !== '' ||
      subcategoryIds.length > 0;
    
    setHasActiveFilters(hasFilters);
  }, [selectedCategory, selectedLocation, selectedBrokerFilter, selectedOrigin, selectedContamination, subcategoryIds]);
  
  // Helper function to get display text for selected subcategories
  const getSelectedSubcategoriesDisplay = () => {
    if (subcategoryIds.length === 0) return 'All materials';
    
    const categoriesWithCounts: { [categoryName: string]: number } = {};
    subcategoryIds.forEach(id => {
      const subcat = subcategoryNames[id];
      if (subcat) {
        categoriesWithCounts[subcat.categoryName] = (categoriesWithCounts[subcat.categoryName] || 0) + 1;
      }
    });
    
    const parts = Object.entries(categoriesWithCounts).map(([categoryName, count]) => 
      `${categoryName} (${count})`
    );
    
    return parts.join(', ');
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
  const _handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Clear all filters function
  const clearAllFilters = () => {
    setSelectedCategory('All materials');
    setSelectedLocation('All Locations');
    setSelectedBrokerFilter('all');
    setSelectedOrigin('');
    setSelectedContamination('');
    setCategoryId(null);
    setSubcategoryIds([]);
    setSelectedCountries([]);
    setCurrentPage(1);
    // Clear global subcategory selections
    setGlobalSubcategorySelections({});
    setSubcategoryNames({});
    // Trigger reset in filter components
    setResetTrigger(prev => prev + 1);
  };

  // Convert API auctions to the format expected by the UI
  const convertedAuctions = apiAuctions.map(auction => {
    const displayTimeLeft = formatTimeRemaining(auction.time_remaining || null);

    const currency = auction.currency || 'EUR';

    const parseNum = (val: any) => {
      if (val === null || val === undefined || val === '') return null;
      const n = typeof val === 'number' ? val : parseFloat(val);
      return isNaN(n) ? null : n;
    };

    const highestBidNum = parseNum(auction.highest_bid_price);
    const basePriceNum = parseNum(auction.base_price) ?? parseNum(auction.starting_bid_price);
    const totalValueNum = parseNum(auction.total_starting_value);

    const formatMoney = (value: number | null, withCurrency: boolean = true) => {
      if (value === null) return '—';
      return `${value.toLocaleString('sv-SE')} ${withCurrency ? currency : ''}`.trim();
    };

    const priceLabel = highestBidNum !== null ? 'Highest Bid' : 'Base Price';
    const pricePerUnit = highestBidNum !== null ? highestBidNum : basePriceNum;
    const unit = auction.unit_of_measurement || '';
  // Display only currency amount (no unit suffix) per request
  const pricePerUnitDisplay = formatMoney(pricePerUnit);
    const totalValueDisplay = totalValueNum ? formatMoney(totalValueNum) : null;

    return {
      id: auction.id.toString(),
      name: auction.title || `${auction.category_name} - ${auction.subcategory_name}`,
      category: auction.category_name,
      timeLeft: displayTimeLeft,
      volume: auction.available_quantity ? `${auction.available_quantity} ${unit}` : 'N/A',
      countryOfOrigin: auction.location_summary || 'Unknown',
      image: auction.material_image ? getFullImageUrl(auction.material_image) : getCategoryImage(auction.category_name),
      priceLabel,
      pricePerUnitDisplay,
      totalValueDisplay,
      currency,
      unit
    };
  });

  // Since we're now using server-side filtering, we use the API results directly
  // The server already filters based on category, location, origin, contamination, etc.
  const filteredAuctions = convertedAuctions;

  return (
  <div className="py-8 mx-7 md:max-w-[86%] md:mx-auto">

      {/* Marketplace Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold">Available Ads</h1>
          <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm">
            {paginationData.count}
          </span>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c-1 0 2 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Materials Filter Dropdown */}
      <div className="mb-6">
        <div className="flex items-center space-x-0 overflow-x-auto border-t border-b border-gray-200">
          <CategoryFilter
            selectedCategory={getSelectedSubcategoriesDisplay()}
            setSelectedCategory={setSelectedCategory}
            onCategoryChange={handleCategoryChange}
            onGlobalSubcategoryChange={handleGlobalSubcategoryChange}
            globalSubcategorySelections={globalSubcategorySelections}
            resetTrigger={resetTrigger}
          />

          <LocationFilter
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            onLocationChange={handleLocationChange}
            resetTrigger={resetTrigger}
          />

          <OriginFilter
            selectedOrigin={selectedOrigin}
            setOrigin={setSelectedOrigin}
            onOriginChange={handleOriginChange}
            resetTrigger={resetTrigger}
          />

          <ContaminationFilter
            selectedContamination={selectedContamination}
            setContamination={setSelectedContamination}
            onContaminationChange={handleContaminationChange}
            resetTrigger={resetTrigger}
          />

          <BrokerFilter
            selectedBrokerFilter={selectedBrokerFilter}
            setBrokerFilter={setSelectedBrokerFilter}
          />
        </div>
      </div>

      {/* Selected subcategories display */}
      {subcategoryIds.length > 0 && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2 flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 mt-0.5 flex-shrink-0">
                <path d="M9 12l2 2 4-4"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
              <div className="text-sm flex-1">
                <p className="font-medium text-blue-800 mb-2">Active Filters ({subcategoryIds.length} subcategories selected)</p>
                <div className="flex flex-wrap gap-2">
                  {subcategoryIds.map(subcatId => {
                    const subcatInfo = subcategoryNames[subcatId];
                    if (!subcatInfo) return null;
                    return (
                      <span
                        key={subcatId}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                      >
                        {subcatInfo.categoryName}: {subcatInfo.name}
                        <button
                          onClick={() => {
                            // Remove this specific subcategory
                            // Find which category this subcategory belongs to and remove it
                            const categoryOfSubcat = Object.entries(globalSubcategorySelections).find(([, subcatIds]) => 
                              subcatIds.includes(subcatId)
                            );
                            if (categoryOfSubcat) {
                              const [catId, subcatIds] = categoryOfSubcat;
                              const newSubcatIds = subcatIds.filter(id => id !== subcatId);
                              handleGlobalSubcategoryChange(parseInt(catId), newSubcatIds);
                            }
                          }}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </span>
                    );
                  })}
                </div>
                <p className="text-blue-700 mt-2 text-xs">Results include all ads matching any of these subcategories. Add more by selecting different categories.</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <div className="col-span-full text-center py-16">
                <div className="flex justify-center mb-6">
                  <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4-4-4m0 4l4 4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">No Active Auctions Found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {apiAuctions.length === 0 ? 
                    "There are currently no active auctions in the marketplace. Check back later or create your own auction to get started!" :
                    "No auctions match your current filter selection. Try adjusting your filters to see more results."
                  }
                </p>
                <div className="flex justify-center gap-4">
                  {apiAuctions.length > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-3 bg-[#FF8A00] text-white rounded-lg font-medium hover:bg-[#e67e00] transition-colors"
                    >
                      Clear All Filters
                    </button>
                  )}
                  <button
                    onClick={() => window.location.href = '/dashboard/auctions/create-alternative'}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      apiAuctions.length === 0 
                        ? 'bg-[#FF8A00] text-white hover:bg-[#e67e00]' 
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Create Auction
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {apiAuctions.length > 0 && (
            <Pagination
              currentPage={paginationData.currentPage}
              totalPages={paginationData.totalPages}
              totalItems={paginationData.count}
              itemsPerPage={paginationData.pageSize}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MarketplacePage;
