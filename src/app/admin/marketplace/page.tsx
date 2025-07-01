"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';

// Mock data for marketplace listings
const mockListings = [
  {
    id: '1',
    name: 'PPA Thermocomp UFW49RSC (Black)',
    category: 'Plastics',
    basePrice: '5,013,008',
    highestBid: '5,250,000',
    status: 'active',
    timeLeft: '2d 4h',
    volume: '500 kg',
    seller: 'Eco Solutions AB',
    countryOfOrigin: 'Sweden',
    createdAt: '2023-05-15',
    image: '/images/marketplace/categories/plastics.jpg'
  },
  {
    id: '2',
    name: 'PPA Thermocomp UFW49RSC (White)',
    category: 'Plastics',
    basePrice: '4,850,000',
    highestBid: null,
    status: 'pending',
    timeLeft: '5d 12h',
    volume: '750 kg',
    seller: 'Green Tech Norway',
    countryOfOrigin: 'Norway',
    createdAt: '2023-06-20',
    image: '/images/marketplace/categories/plastics-alt.jpg'
  },
  {
    id: '3',
    name: 'Aluminum Scrap 6061',
    category: 'Metals',
    basePrice: '7,250,000',
    highestBid: '7,500,000',
    status: 'active',
    timeLeft: '3d 6h',
    volume: '1200 kg',
    seller: 'Circular Materials Oy',
    countryOfOrigin: 'Finland',
    createdAt: '2023-07-05',
    image: '/images/marketplace/categories/metals.jpg'
  },
  {
    id: '4',
    name: 'Recycled Cardboard Sheets',
    category: 'Paper',
    basePrice: '2,500,000',
    highestBid: null,
    status: 'inactive',
    timeLeft: '0d 0h',
    volume: '850 kg',
    seller: 'Eco Solutions AB',
    countryOfOrigin: 'Sweden',
    createdAt: '2023-08-10',
    image: '/images/marketplace/categories/paper.jpg'
  },
  {
    id: '5',
    name: 'Clear Glass Cullet',
    category: 'Glass',
    basePrice: '3,750,000',
    highestBid: '3,900,000',
    status: 'active',
    timeLeft: '4d 2h',
    volume: '1500 kg',
    seller: 'Green Tech Norway',
    countryOfOrigin: 'Norway',
    createdAt: '2023-09-15',
    image: '/images/marketplace/categories/glass.jpg'
  }
];

export default function MarketplacePage() {
  const [listings, setListings] = useState(mockListings);
  const [filteredListings, setFilteredListings] = useState(mockListings);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);

  // Filter listings based on search term and status
  useEffect(() => {
    let result = listings;

    if (searchTerm) {
      result = result.filter(listing =>
        listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.seller.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      result = result.filter(listing => listing.status === selectedStatus);
    }

    setFilteredListings(result);
  }, [searchTerm, selectedStatus, listings]);

  // Handle status change
  const handleStatusChange = (listingId: string, newStatus: string) => {
    const updatedListings = listings.map(listing =>
      listing.id === listingId ? { ...listing, status: newStatus } : listing
    );
    setListings(updatedListings);
  };

  // Handle sort
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';

    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    setSortConfig({ key, direction });

    const sortedListings = [...filteredListings].sort((a, b) => {
      const aValue = a[key as keyof typeof a];
      const bValue = b[key as keyof typeof b];

      // Handle null or undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return direction === 'ascending' ? -1 : 1;
      if (bValue == null) return direction === 'ascending' ? 1 : -1;

      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setFilteredListings(sortedListings);
  };

  // Get sort indicator
  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }

    return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">Marketplace Management</h1>
        <Link
          href="/admin/marketplace/new"
          className="bg-[#FF8A00] text-white px-4 py-2 rounded-md hover:bg-[#e67e00] transition-colors text-sm"
        >
          Add New Listing
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search listings..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort('name')}>
                    Listing
                    {getSortIndicator('name')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort('category')}>
                    Category
                    {getSortIndicator('category')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort('seller')}>
                    Seller
                    {getSortIndicator('seller')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort('status')}>
                    Status
                    {getSortIndicator('status')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort('createdAt')}>
                    Created
                    {getSortIndicator('createdAt')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredListings.length > 0 ? (
                filteredListings.map((listing) => (
                  <tr key={listing.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          <Image
                            src={listing.image}
                            alt={listing.name}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{listing.name}</div>
                          <div className="text-sm text-gray-500">
                            {listing.highestBid ? `Highest Bid: ${listing.highestBid}` : `Base Price: ${listing.basePrice}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{listing.category}</div>
                      <div className="text-sm text-gray-500">{listing.volume}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{listing.seller}</div>
                      <div className="text-sm text-gray-500">{listing.countryOfOrigin}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${listing.status === 'active' ? 'bg-green-100 text-green-800' :
                          listing.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {listing.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/admin/marketplace/${listing.id}`} className="text-blue-600 hover:text-blue-900">
                          View
                        </Link>
                        <Link href={`/admin/marketplace/${listing.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleStatusChange(listing.id, listing.status === 'active' ? 'inactive' : 'active')}
                        >
                          {listing.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No listings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
