"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, SlidersHorizontal, ChevronRight } from 'lucide-react';



// Mock data for marketplace items
const marketplaceItems = [
  {
    id: 1,
    category: 'Plastics',
    name: 'PPA Thermocomp UFW49RSC (Black)',
    basePrice: '5 013 008',
    image: '/images/marketplace/plastic1.jpg'
  },
  {
    id: 2,
    category: 'Plastics',
    name: 'PPA Thermocomp UFW49RSC (White)',
    basePrice: '4 850 000',
    image: '/images/marketplace/plastic2.jpg'
  },
  {
    id: 3,
    category: 'Plastics',
    name: 'PPA Thermocomp UFW49RSC (Clear)',
    basePrice: '4 975 500',
    image: '/images/marketplace/plastic3.jpg'
  },
  {
    id: 4,
    category: 'Metals',
    name: 'Aluminum Scrap 6061',
    basePrice: '7 250 000',
    image: '/images/marketplace/plastic1.jpg'
  },
  {
    id: 5,
    category: 'Paper',
    name: 'Recycled Cardboard Sheets',
    basePrice: '2 500 000',
    image: '/images/marketplace/plastic2.jpg'
  },
  {
    id: 6,
    category: 'Glass',
    name: 'Clear Glass Cullet',
    basePrice: '3 750 000',
    image: '/images/marketplace/plastic3.jpg'
  },
  {
    id: 7,
    category: 'Wood',
    name: 'Reclaimed Pine Lumber',
    basePrice: '4 125 000',
    image: '/images/marketplace/plastic1.jpg'
  },
  {
    id: 8,
    category: 'Textiles',
    name: 'Recycled Cotton Fabric',
    basePrice: '3 900 000',
    image: '/images/marketplace/plastic2.jpg'
  },
];

// Product Card Component
const ProductCard = ({ item }: { item: typeof marketplaceItems[0] }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={item.image}
          alt={item.name}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium">
          {item.category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-2 h-12">{item.name}</h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-500">Base Price</span>
          <span className="font-semibold text-blue-600">{item.basePrice}</span>
        </div>
      </div>
    </div>
  );
};

const MarketplacePage = () => {
  const [sortOption, setSortOption] = useState('Recently');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All materials');
  const [showAllMaterialsDropdown, setShowAllMaterialsDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [showQuantityPopup, setShowQuantityPopup] = useState(false);
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [showDatePopup, setShowDatePopup] = useState(false);


  const locationRef = useRef<HTMLDivElement>(null);
  const quantityRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const allMaterialsRef = useRef<HTMLDivElement>(null);

  // Close popups when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationPopup(false);
      }
      if (quantityRef.current && !quantityRef.current.contains(event.target as Node)) {
        setShowQuantityPopup(false);
      }
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowFormPopup(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setShowDatePopup(false);
      }
      if (allMaterialsRef.current && !allMaterialsRef.current.contains(event.target as Node)) {
        setShowAllMaterialsDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close other popups when opening a new one
  useEffect(() => {
    if (showAllMaterialsDropdown) {
      setShowLocationPopup(false);
      setShowQuantityPopup(false);
      setShowFormPopup(false);
      setShowDatePopup(false);
    }
  }, [showAllMaterialsDropdown]);

  useEffect(() => {
    if (showLocationPopup) {
      setShowAllMaterialsDropdown(false);
      setShowQuantityPopup(false);
      setShowFormPopup(false);
      setShowDatePopup(false);
    }
  }, [showLocationPopup]);

  useEffect(() => {
    if (showQuantityPopup) {
      setShowAllMaterialsDropdown(false);
      setShowLocationPopup(false);
      setShowFormPopup(false);
      setShowDatePopup(false);
    }
  }, [showQuantityPopup]);

  useEffect(() => {
    if (showFormPopup) {
      setShowAllMaterialsDropdown(false);
      setShowLocationPopup(false);
      setShowQuantityPopup(false);
      setShowDatePopup(false);
    }
  }, [showFormPopup]);

  useEffect(() => {
    if (showDatePopup) {
      setShowAllMaterialsDropdown(false);
      setShowLocationPopup(false);
      setShowQuantityPopup(false);
      setShowFormPopup(false);
    }
  }, [showDatePopup]);

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
            <button
              className="flex items-center justify-between w-full sm:w-40 px-4 py-2 bg-gray-100 rounded-md"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              <span>{sortOption}</span>
              <ChevronDown size={16} />
            </button>

            {showSortDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <ul>
                  {['Recently', 'Price: Low to High', 'Price: High to Low', 'Alphabetical'].map((option) => (
                    <li key={option}>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          setSortOption(option);
                          setShowSortDropdown(false);
                        }}
                      >
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
          <div ref={allMaterialsRef} className="relative inline-block border-r border-gray-200">
            <button
              className="flex items-center justify-between px-4 py-3 bg-white min-w-[180px]"
              onClick={() => setShowAllMaterialsDropdown(!showAllMaterialsDropdown)}
            >
              <span className="mr-2 font-medium">{selectedCategory}</span>
              <ChevronDown size={16} />
            </button>

          {/* Category dropdown */}
          {showAllMaterialsDropdown && (
            <div className="fixed top-[120px] left-[20px] w-[600px] bg-white border border-gray-200 shadow-lg z-[9999] rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 max-h-[400px] overflow-y-auto">
                {/* Left Column */}
                <div>
                  <div className="category-item border-b border-gray-200 py-3 px-4">
                    <button
                      className="w-full text-left hover:text-blue-600 font-medium"
                      onClick={() => {
                        setSelectedCategory('All materials');
                        setShowAllMaterialsDropdown(false);
                      }}
                    >
                      All materials
                    </button>
                  </div>
                  <div className="category-item border-b border-gray-200 py-3 px-4">
                    <button
                      className="w-full text-left hover:text-blue-600 flex justify-between items-center"
                      onClick={() => {
                        setSelectedCategory('Plastics');
                        setShowAllMaterialsDropdown(false);
                      }}
                    >
                      <span>Plastics</span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="category-item border-b border-gray-200 py-3 px-4">
                    <button
                      className="w-full text-left hover:text-blue-600 flex justify-between items-center"
                      onClick={() => {
                        setSelectedCategory('Paper');
                        setShowAllMaterialsDropdown(false);
                      }}
                    >
                      <span>Paper</span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="category-item border-b border-gray-200 py-3 px-4">
                    <button
                      className="w-full text-left hover:text-blue-600 flex justify-between items-center"
                      onClick={() => {
                        setSelectedCategory('Wood');
                        setShowAllMaterialsDropdown(false);
                      }}
                    >
                      <span>Wood</span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="category-item border-b border-gray-200 py-3 px-4">
                    <button
                      className="w-full text-left hover:text-blue-600 flex justify-between items-center"
                      onClick={() => {
                        setSelectedCategory('Glass');
                        setShowAllMaterialsDropdown(false);
                      }}
                    >
                      <span>Glass</span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="category-item border-b border-gray-200 py-3 px-4">
                    <button
                      className="w-full text-left hover:text-blue-600 flex justify-between items-center"
                      onClick={() => {
                        setSelectedCategory('Textiles');
                        setShowAllMaterialsDropdown(false);
                      }}
                    >
                      <span>Textiles</span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="category-item border-b border-gray-200 py-3 px-4">
                    <button
                      className="w-full text-left hover:text-blue-600 flex justify-between items-center"
                      onClick={() => {
                        setSelectedCategory('Building material');
                        setShowAllMaterialsDropdown(false);
                      }}
                    >
                      <span>Building material</span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Right Column */}
                <div className="border-l border-gray-200">
                  <div className="category-item border-b border-gray-200 py-3 px-4">
                    <button
                      className="w-full text-left hover:text-blue-600 flex justify-between items-center"
                      onClick={() => {
                        setSelectedCategory('Metals');
                        setShowAllMaterialsDropdown(false);
                      }}
                    >
                      <span>Metals</span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="category-item border-b border-gray-200 py-3 px-4">
                    <button
                      className="w-full text-left hover:text-blue-600 flex justify-between items-center"
                      onClick={() => {
                        setSelectedCategory('Organic waste');
                        setShowAllMaterialsDropdown(false);
                      }}
                    >
                      <span>Organic waste</span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="category-item border-b border-gray-200 py-3 px-4">
                    <button
                      className="w-full text-left hover:text-blue-600 flex justify-between items-center"
                      onClick={() => {
                        setSelectedCategory('E-waste');
                        setShowAllMaterialsDropdown(false);
                      }}
                    >
                      <span>E-waste</span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="category-item border-b border-gray-200 py-3 px-4">
                    <button
                      className="w-full text-left hover:text-blue-600 flex justify-between items-center"
                      onClick={() => {
                        setSelectedCategory('Machinery and equipment');
                        setShowAllMaterialsDropdown(false);
                      }}
                    >
                      <span>Machinery and equipment</span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="category-item border-b border-gray-200 py-3 px-4">
                    <button
                      className="w-full text-left hover:text-blue-600 flex justify-between items-center"
                      onClick={() => {
                        setSelectedCategory('Chemical substances');
                        setShowAllMaterialsDropdown(false);
                      }}
                    >
                      <span>Chemical substances</span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="category-item border-b border-gray-200 py-3 px-4">
                    <button
                      className="w-full text-left hover:text-blue-600"
                      onClick={() => {
                        setSelectedCategory('Other');
                        setShowAllMaterialsDropdown(false);
                      }}
                    >
                      Other
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>

          {/* Location Button */}
          <div ref={locationRef} className="relative inline-block border-r border-gray-200">
            <button
              className="flex items-center justify-between px-4 py-3 bg-white min-w-[180px]"
              onClick={() => setShowLocationPopup(!showLocationPopup)}
            >
              <span className="mr-2 font-medium">{selectedLocation}</span>
              <ChevronDown size={16} />
            </button>

            {showLocationPopup && (
              <div className="fixed top-[120px] left-[200px] w-[400px] bg-white border border-gray-200 shadow-lg z-[9999] rounded-lg">
                <div className="py-6 px-6 space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="location"
                      className="form-radio h-5 w-5 text-blue-600"
                      checked={selectedLocation === 'Near me'}
                      onChange={() => {
                        setSelectedLocation('Near me');
                        setShowLocationPopup(false);
                      }}
                    />
                    <span className="text-gray-700 text-base">Near me</span>
                  </label>

                  <div className="border-t border-gray-200 pt-4"></div>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="location"
                      className="form-radio h-5 w-5 text-blue-600"
                      checked={selectedLocation === 'Select country'}
                      onChange={() => {
                        setSelectedLocation('Select country');
                        setShowLocationPopup(false);
                      }}
                    />
                    <span className="text-gray-700 text-base">Select country</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Quantity Button */}
          <div ref={quantityRef} className="relative inline-block border-r border-gray-200">
            <button
              className="flex items-center justify-between px-4 py-3 bg-white min-w-[180px]"
              onClick={() => setShowQuantityPopup(!showQuantityPopup)}
            >
              <span className="mr-2 font-medium">Quantity</span>
              <ChevronDown size={16} />
            </button>

            {showQuantityPopup && (
              <div className="absolute top-full left-0 mt-1 w-[200px] bg-white border border-gray-200 shadow-lg z-50 rounded-md">
                <ul className="py-1">
                  <li><button className="w-full text-left px-4 py-2 hover:bg-gray-100">Any Quantity</button></li>
                  <li><button className="w-full text-left px-4 py-2 hover:bg-gray-100">Less than 100 kg</button></li>
                  <li><button className="w-full text-left px-4 py-2 hover:bg-gray-100">100-500 kg</button></li>
                  <li><button className="w-full text-left px-4 py-2 hover:bg-gray-100">500-1000 kg</button></li>
                  <li><button className="w-full text-left px-4 py-2 hover:bg-gray-100">More than 1000 kg</button></li>
                </ul>
              </div>
            )}
          </div>

          {/* Form Button */}
          <div ref={formRef} className="relative inline-block border-r border-gray-200">
            <button
              className="flex items-center justify-between px-4 py-3 bg-white min-w-[180px]"
              onClick={() => setShowFormPopup(!showFormPopup)}
            >
              <span className="mr-2 font-medium">Form</span>
              <ChevronDown size={16} />
            </button>

            {showFormPopup && (
              <div className="absolute top-full left-0 mt-1 w-[200px] bg-white border border-gray-200 shadow-lg z-50 rounded-md">
                <ul className="py-1">
                  <li><button className="w-full text-left px-4 py-2 hover:bg-gray-100">All Forms</button></li>
                  <li><button className="w-full text-left px-4 py-2 hover:bg-gray-100">Granulate</button></li>
                  <li><button className="w-full text-left px-4 py-2 hover:bg-gray-100">Sheet</button></li>
                  <li><button className="w-full text-left px-4 py-2 hover:bg-gray-100">Roll</button></li>
                  <li><button className="w-full text-left px-4 py-2 hover:bg-gray-100">Bulk</button></li>
                </ul>
              </div>
            )}
          </div>

          {/* Date of Publication Button */}
          <div ref={dateRef} className="relative inline-block">
            <button
              className="flex items-center justify-between px-4 py-3 bg-white min-w-[180px]"
              onClick={() => setShowDatePopup(!showDatePopup)}
            >
              <span className="mr-2 font-medium">Date of publication</span>
              <ChevronDown size={16} />
            </button>

            {showDatePopup && (
              <div className="absolute top-full left-0 mt-1 w-[200px] bg-white border border-gray-200 shadow-lg z-50 rounded-md">
                <ul className="py-1">
                  <li><button className="w-full text-left px-4 py-2 hover:bg-gray-100">Any Time</button></li>
                  <li><button className="w-full text-left px-4 py-2 hover:bg-gray-100">Today</button></li>
                  <li><button className="w-full text-left px-4 py-2 hover:bg-gray-100">Last 7 days</button></li>
                  <li><button className="w-full text-left px-4 py-2 hover:bg-gray-100">Last 30 days</button></li>
                  <li><button className="w-full text-left px-4 py-2 hover:bg-gray-100">Last 90 days</button></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {marketplaceItems
          .filter(item => selectedCategory === 'All materials' ? true : item.category === selectedCategory)
          .map((item) => (
            <Link href="/coming-soon" key={item.id}>
              <ProductCard item={item} />
            </Link>
          ))}
      </div>
    </div>
  );
};

export default MarketplacePage;
