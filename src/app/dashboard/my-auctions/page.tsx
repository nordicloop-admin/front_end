"use client";

import React from 'react';
import Link from 'next/link';
import { Package, Clock, ArrowUpRight, Filter, Search, Plus } from 'lucide-react';
import Image from 'next/image';

// Mock data for auctions
const myAuctions = [
  {
    id: '1',
    name: 'PPA Thermocomp UFW49RSC (Black)',
    category: 'Plastics',
    basePrice: '5,013,008',
    currentBid: '5,250,000',
    status: 'active',
    timeLeft: '2d 4h',
    volume: '500 kg',
    image: '/images/marketplace/categories/plastics.jpg'
  },
  {
    id: '2',
    name: 'Aluminum Scrap 6061',
    category: 'Metals',
    basePrice: '7,250,000',
    currentBid: '7,500,000',
    status: 'active',
    timeLeft: '3d 6h',
    volume: '1200 kg',
    image: '/images/marketplace/categories/metals.jpg'
  }
];

export default function MyAuctions() {
  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-medium">My Auctions</h1>
        <button className="bg-[#FF8A00] text-white py-2 px-4 rounded-md flex items-center text-sm">
          <Plus size={16} className="mr-2" />
          New Auction
        </button>
      </div>

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
          />
        </div>

        <div className="flex items-center">
          <button className="flex items-center px-4 py-2 border border-gray-100 rounded-md bg-white text-sm">
            <Filter size={16} className="mr-2 text-gray-500" />
            Filter
          </button>
        </div>
      </div>

      {/* Auctions List */}
      <div className="space-y-4">
        {myAuctions.map((auction) => (
          <div key={auction.id} className="bg-white border border-gray-100 rounded-md p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-[120px] h-[100px] relative rounded-md overflow-hidden">
                <Image
                  src={auction.image}
                  alt={auction.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-base font-medium text-gray-900">{auction.name}</h2>
                    <div className="text-xs text-gray-500 mt-1">Category: {auction.category}</div>
                    <div className="text-xs text-gray-500">Volume: {auction.volume}</div>
                  </div>

                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={14} className="mr-1" />
                    <span>{auction.timeLeft} left</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500">Current bid</div>
                    <div className="text-base font-medium text-[#FF8A00]">{auction.currentBid}</div>
                  </div>

                  <div className="mt-2 md:mt-0 flex space-x-2">
                    <button className="px-3 py-1.5 border border-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Edit
                    </button>
                    <Link
                      href={`/dashboard/my-auctions/${auction.id}`}
                      className="px-3 py-1.5 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors flex items-center"
                    >
                      View Details
                      <ArrowUpRight size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
