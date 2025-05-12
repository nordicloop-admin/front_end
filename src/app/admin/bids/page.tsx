"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, ChevronDown, ChevronUp, Clock } from 'lucide-react';

// Mock data for bids
const mockBids = [
  {
    id: '1',
    itemId: '1',
    itemName: 'PPA Thermocomp UFW49RSC (Black)',
    itemImage: '/images/marketplace/categories/plastics.jpg',
    bidAmount: '5,250,000',
    previousBid: '5,150,000',
    bidderName: 'Erik Johansson',
    bidderCompany: 'Eco Solutions AB',
    bidderEmail: 'erik@ecosolutions.se',
    status: 'active',
    isHighest: true,
    createdAt: '2023-05-15 14:30',
    expiresAt: '2023-05-18 14:30',
    timeLeft: '2d 4h',
    needsReview: false
  },
  {
    id: '2',
    itemId: '3',
    itemName: 'Aluminum Scrap 6061',
    itemImage: '/images/marketplace/categories/metals.jpg',
    bidAmount: '7,500,000',
    previousBid: '7,400,000',
    bidderName: 'Astrid Olsen',
    bidderCompany: 'Green Tech Norway',
    bidderEmail: 'astrid@greentech.no',
    status: 'active',
    isHighest: true,
    createdAt: '2023-05-16 10:15',
    expiresAt: '2023-05-19 10:15',
    timeLeft: '3d 6h',
    needsReview: false
  },
  {
    id: '3',
    itemId: '5',
    itemName: 'Clear Glass Cullet',
    itemImage: '/images/marketplace/categories/glass.jpg',
    bidAmount: '3,900,000',
    previousBid: '3,850,000',
    bidderName: 'Mikko Virtanen',
    bidderCompany: 'Circular Materials Oy',
    bidderEmail: 'mikko@circularmaterials.fi',
    status: 'active',
    isHighest: true,
    createdAt: '2023-05-17 09:45',
    expiresAt: '2023-05-21 09:45',
    timeLeft: '4d 2h',
    needsReview: false
  },
  {
    id: '4',
    itemId: '1',
    itemName: 'PPA Thermocomp UFW49RSC (Black)',
    itemImage: '/images/marketplace/categories/plastics.jpg',
    bidAmount: '5,150,000',
    previousBid: '5,100,000',
    bidderName: 'Mikko Virtanen',
    bidderCompany: 'Circular Materials Oy',
    bidderEmail: 'mikko@circularmaterials.fi',
    status: 'outbid',
    isHighest: false,
    createdAt: '2023-05-14 16:20',
    expiresAt: '2023-05-18 14:30',
    timeLeft: '2d 4h',
    needsReview: false
  },
  {
    id: '5',
    itemId: '7',
    itemName: 'Reclaimed Pine Lumber',
    itemImage: '/images/marketplace/categories/wood.jpg',
    bidAmount: '4,300,000',
    previousBid: '4,250,000',
    bidderName: 'Erik Johansson',
    bidderCompany: 'Eco Solutions AB',
    bidderEmail: 'erik@ecosolutions.se',
    status: 'pending',
    isHighest: true,
    createdAt: '2023-05-18 08:30',
    expiresAt: '2023-05-20 22:30',
    timeLeft: '2d 22h',
    needsReview: true
  },
  {
    id: '6',
    itemId: '8',
    itemName: 'Recycled Cotton Fabric',
    itemImage: '/images/marketplace/categories/textiles.jpg',
    bidAmount: '3,950,000',
    previousBid: '3,900,000',
    bidderName: 'Astrid Olsen',
    bidderCompany: 'Green Tech Norway',
    bidderEmail: 'astrid@greentech.no',
    status: 'pending',
    isHighest: true,
    createdAt: '2023-05-18 11:45',
    expiresAt: '2023-05-25 14:30',
    timeLeft: '7d 14h',
    needsReview: true
  }
];

export default function BidsPage() {
  const [bids, setBids] = useState(mockBids);
  const [filteredBids, setFilteredBids] = useState(mockBids);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  
  // Filter bids based on search term and status
  useEffect(() => {
    let result = bids;
    
    if (searchTerm) {
      result = result.filter(bid => 
        bid.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.bidderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.bidderCompany.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedStatus !== 'all') {
      result = result.filter(bid => bid.status === selectedStatus);
    }
    
    setFilteredBids(result);
  }, [searchTerm, selectedStatus, bids]);
  
  // Handle bid approval
  const handleBidApproval = (bidId: string, approved: boolean) => {
    const updatedBids = bids.map(bid => 
      bid.id === bidId ? { 
        ...bid, 
        status: approved ? 'active' : 'rejected',
        needsReview: false
      } : bid
    );
    setBids(updatedBids);
  };
  
  // Handle sort
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
    
    const sortedBids = [...filteredBids].sort((a, b) => {
      if (a[key as keyof typeof a] < b[key as keyof typeof b]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key as keyof typeof a] > b[key as keyof typeof b]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredBids(sortedBids);
  };
  
  // Get sort indicator
  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    
    return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  // Count bids that need review
  const pendingReviewCount = bids.filter(bid => bid.needsReview).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Bids Management</h1>
          {pendingReviewCount > 0 && (
            <span className="ml-3 bg-[#FF8A00] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {pendingReviewCount}
            </span>
          )}
        </div>
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
              placeholder="Search bids..."
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
              <option value="pending">Pending Review</option>
              <option value="outbid">Outbid</option>
              <option value="rejected">Rejected</option>
              <option value="won">Won</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Bids Table */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort('itemName')}>
                    Item
                    {getSortIndicator('itemName')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort('bidAmount')}>
                    Bid Amount
                    {getSortIndicator('bidAmount')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort('bidderName')}>
                    Bidder
                    {getSortIndicator('bidderName')}
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
                    Time
                    {getSortIndicator('createdAt')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBids.length > 0 ? (
                filteredBids.map((bid) => (
                  <tr key={bid.id} className={bid.needsReview ? "bg-yellow-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          <Image
                            src={bid.itemImage}
                            alt={bid.itemName}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{bid.itemName}</div>
                          <Link href={`/admin/marketplace/${bid.itemId}`} className="text-xs text-blue-600 hover:text-blue-900">
                            View Item
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{bid.bidAmount}</div>
                      {bid.previousBid && (
                        <div className="text-xs text-gray-500">Previous: {bid.previousBid}</div>
                      )}
                      {bid.isHighest && (
                        <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                          Highest
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{bid.bidderName}</div>
                      <div className="text-xs text-gray-500">{bid.bidderCompany}</div>
                      <div className="text-xs text-gray-500">{bid.bidderEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${bid.status === 'active' ? 'bg-green-100 text-green-800' : 
                          bid.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          bid.status === 'outbid' ? 'bg-gray-100 text-gray-800' :
                          bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'}`}>
                        {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                        {bid.needsReview && " (Review)"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{bid.timeLeft} left</span>
                      </div>
                      <div className="text-xs text-gray-500">Placed: {bid.createdAt}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/admin/bids/${bid.id}`} className="text-blue-600 hover:text-blue-900">
                          Details
                        </Link>
                        {bid.needsReview && (
                          <>
                            <button 
                              className="text-green-600 hover:text-green-900"
                              onClick={() => handleBidApproval(bid.id, true)}
                            >
                              Approve
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleBidApproval(bid.id, false)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No bids found
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
