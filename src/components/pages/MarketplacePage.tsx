"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown, SlidersHorizontal, ChevronRight } from '@/components/ui/Icons';



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
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All materials');
  const [showAllMaterialsDropdown, setShowAllMaterialsDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState('All time');
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [showQuantityPopup, setShowQuantityPopup] = useState(false);
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [showDatePopup, setShowDatePopup] = useState(false);

  // Helper function to toggle form selection
  const toggleFormSelection = (form: string) => {
    if (selectedForms.includes(form)) {
      setSelectedForms(selectedForms.filter(f => f !== form));
    } else {
      setSelectedForms([...selectedForms, form]);
    }
  };


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
              <span className="mr-2 font-medium">{selectedForms.length > 0 ? `Forms (${selectedForms.length})` : 'Form'}</span>
              <ChevronDown size={16} />
            </button>

            {showFormPopup && (
              <div className="fixed top-[120px] left-[400px] w-[450px] bg-white border border-gray-200 shadow-lg z-[9999] rounded-lg">
                <div className="py-6 px-6">
                  <p className="text-gray-700 font-medium mb-4">Applicable to plastic only</p>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    {/* Left Column */}
                    <div>
                      <label className="flex items-start space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-1 form-checkbox h-4 w-4 text-blue-600"
                          checked={selectedForms.includes('regrind')}
                          onChange={() => toggleFormSelection('regrind')}
                        />
                        <span className="text-gray-700">regrind</span>
                      </label>

                      <label className="flex items-start space-x-2 cursor-pointer mt-3">
                        <input
                          type="checkbox"
                          className="mt-1 form-checkbox h-4 w-4 text-blue-600"
                          checked={selectedForms.includes('baled')}
                          onChange={() => toggleFormSelection('baled')}
                        />
                        <span className="text-gray-700">baled</span>
                      </label>

                      <label className="flex items-start space-x-2 cursor-pointer mt-3">
                        <input
                          type="checkbox"
                          className="mt-1 form-checkbox h-4 w-4 text-blue-600"
                          checked={selectedForms.includes('loose')}
                          onChange={() => toggleFormSelection('loose')}
                        />
                        <span className="text-gray-700">loose</span>
                      </label>

                      <label className="flex items-start space-x-2 cursor-pointer mt-3">
                        <input
                          type="checkbox"
                          className="mt-1 form-checkbox h-4 w-4 text-blue-600"
                          checked={selectedForms.includes('ingots')}
                          onChange={() => toggleFormSelection('ingots')}
                        />
                        <span className="text-gray-700">ingots</span>
                      </label>

                      <label className="flex items-start space-x-2 cursor-pointer mt-3">
                        <input
                          type="checkbox"
                          className="mt-1 form-checkbox h-4 w-4 text-blue-600"
                          checked={selectedForms.includes('agglomerate')}
                          onChange={() => toggleFormSelection('agglomerate')}
                        />
                        <span className="text-gray-700">agglomerate</span>
                      </label>
                    </div>

                    {/* Right Column */}
                    <div>
                      <label className="flex items-start space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-1 form-checkbox h-4 w-4 text-blue-600"
                          checked={selectedForms.includes('masterbatch')}
                          onChange={() => toggleFormSelection('masterbatch')}
                        />
                        <span className="text-gray-700">masterbatch</span>
                      </label>

                      <label className="flex items-start space-x-2 cursor-pointer mt-3">
                        <input
                          type="checkbox"
                          className="mt-1 form-checkbox h-4 w-4 text-blue-600"
                          checked={selectedForms.includes('compound')}
                          onChange={() => toggleFormSelection('compound')}
                        />
                        <span className="text-gray-700">compound</span>
                      </label>

                      <label className="flex items-start space-x-2 cursor-pointer mt-3">
                        <input
                          type="checkbox"
                          className="mt-1 form-checkbox h-4 w-4 text-blue-600"
                          checked={selectedForms.includes('powder')}
                          onChange={() => toggleFormSelection('powder')}
                        />
                        <span className="text-gray-700">powder</span>
                      </label>

                      <label className="flex items-start space-x-2 cursor-pointer mt-3">
                        <input
                          type="checkbox"
                          className="mt-1 form-checkbox h-4 w-4 text-blue-600"
                          checked={selectedForms.includes('regranulate/pelletized')}
                          onChange={() => toggleFormSelection('regranulate/pelletized')}
                        />
                        <span className="text-gray-700">regranulate/pelletized</span>
                      </label>

                      <label className="flex items-start space-x-2 cursor-pointer mt-3">
                        <input
                          type="checkbox"
                          className="mt-1 form-checkbox h-4 w-4 text-blue-600"
                          checked={selectedForms.includes('other')}
                          onChange={() => toggleFormSelection('other')}
                        />
                        <span className="text-gray-700">other</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      onClick={() => setShowFormPopup(false)}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Date of Publication Button */}
          <div ref={dateRef} className="relative inline-block">
            <button
              className="flex items-center justify-between px-4 py-3 bg-white min-w-[180px]"
              onClick={() => setShowDatePopup(!showDatePopup)}
            >
              <span className="mr-2 font-medium">{selectedDateFilter}</span>
              <ChevronDown size={16} />
            </button>

            {showDatePopup && (
              <div className="fixed top-[120px] left-[600px] w-[400px] bg-white border border-gray-200 shadow-lg z-[9999] rounded-lg">
                <div className="py-6 px-6 space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="dateFilter"
                      className="form-radio h-5 w-5 text-blue-600"
                      checked={selectedDateFilter === 'Last 24 hours'}
                      onChange={() => {
                        setSelectedDateFilter('Last 24 hours');
                        setShowDatePopup(false);
                      }}
                    />
                    <span className="text-gray-700 text-base">Last 24 hours</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="dateFilter"
                      className="form-radio h-5 w-5 text-blue-600"
                      checked={selectedDateFilter === 'Last 3 days'}
                      onChange={() => {
                        setSelectedDateFilter('Last 3 days');
                        setShowDatePopup(false);
                      }}
                    />
                    <span className="text-gray-700 text-base">Last 3 days</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="dateFilter"
                      className="form-radio h-5 w-5 text-blue-600"
                      checked={selectedDateFilter === 'Last 7 days'}
                      onChange={() => {
                        setSelectedDateFilter('Last 7 days');
                        setShowDatePopup(false);
                      }}
                    />
                    <span className="text-gray-700 text-base">Last 7 days</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="dateFilter"
                      className="form-radio h-5 w-5 text-blue-600"
                      checked={selectedDateFilter === 'Last 30 days'}
                      onChange={() => {
                        setSelectedDateFilter('Last 30 days');
                        setShowDatePopup(false);
                      }}
                    />
                    <span className="text-gray-700 text-base">Last 30 days</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="dateFilter"
                      className="form-radio h-5 w-5 text-blue-600"
                      checked={selectedDateFilter === 'All time'}
                      onChange={() => {
                        setSelectedDateFilter('All time');
                        setShowDatePopup(false);
                      }}
                    />
                    <span className="text-gray-700 text-base">All time</span>
                  </label>
                </div>
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
            <div key={item.id} className="cursor-pointer">
              <ProductCard item={item} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default MarketplacePage;
