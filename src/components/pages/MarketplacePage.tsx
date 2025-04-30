"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

// Mock data for marketplace items
const marketplaceItems = [
  {
    id: 1,
    category: 'Plastic',
    name: 'PPA Thermocomp UFW49RSC (Black)',
    basePrice: '5 013 008',
    image: '/images/marketplace/plastic1.jpg'
  },
  {
    id: 2,
    category: 'Plastic',
    name: 'PPA Thermocomp UFW49RSC (Black)',
    basePrice: '5 013 008',
    image: '/images/marketplace/plastic2.jpg'
  },
  {
    id: 3,
    category: 'Plastic',
    name: 'PPA Thermocomp UFW49RSC (Black)',
    basePrice: '5 013 008',
    image: '/images/marketplace/plastic3.jpg'
  },
  {
    id: 4,
    category: 'Plastic',
    name: 'PPA Thermocomp UFW49RSC (Black)',
    basePrice: '5 013 008',
    image: '/images/marketplace/plastic1.jpg'
  },
  {
    id: 5,
    category: 'Plastic',
    name: 'PPA Thermocomp UFW49RSC (Black)',
    basePrice: '5 013 008',
    image: '/images/marketplace/plastic1.jpg'
  },
  {
    id: 6,
    category: 'Plastic',
    name: 'PPA Thermocomp UFW49RSC (Black)',
    basePrice: '5 013 008',
    image: '/images/marketplace/plastic2.jpg'
  },
  {
    id: 7,
    category: 'Plastic',
    name: 'PPA Thermocomp UFW49RSC (Black)',
    basePrice: '5 013 008',
    image: '/images/marketplace/plastic3.jpg'
  },
  {
    id: 8,
    category: 'Plastic',
    name: 'PPA Thermocomp UFW49RSC (Black)',
    basePrice: '5 013 008',
    image: '/images/marketplace/plastic1.jpg'
  },
];

// Product Card Component
const ProductCard = ({ item }: { item: typeof marketplaceItems[0] }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={item.image}
          alt={item.name}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform hover:scale-105"
        />
      </div>
      <div className="p-4">
        <span className="text-sm text-gray-600">{item.category}</span>
        <h3 className="font-medium text-gray-900 mt-1">{item.name}</h3>
        <div className="mt-3 flex items-center">
          <span className="text-xs text-gray-500">Base Price</span>
          <span className="ml-2 font-semibold">{item.basePrice}</span>
        </div>
      </div>
    </div>
  );
};

const MarketplacePage = () => {
  const [sortOption, setSortOption] = useState('Recently');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  return (
    <div className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Marketplace Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold">Available Ads</h1>
          <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm">30</span>
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
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {marketplaceItems.map((item) => (
          <Link href="/coming-soon" key={item.id}>
            <ProductCard item={item} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MarketplacePage;
