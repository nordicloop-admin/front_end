"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, RefreshCw, Clock, User, Package, TrendingUp, Globe, Tag } from 'lucide-react';
import { getAdminAuction, AdminAuction } from '@/services/auctions';

export default function AuctionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // State management
  const [auction, setAuction] = useState<AdminAuction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch auction details
  const fetchAuctionDetails = async () => {
    if (!id || typeof id !== 'string') return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await getAdminAuction(id);

      if (response.data) {
        setAuction(response.data);
      } else {
        setError(response.error || 'Failed to fetch auction details');
      }
    } catch (err) {
      setError('An unexpected error occurred while fetching auction details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctionDetails();
  }, [id]);

  // Format price
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
          <span className="text-gray-500">Loading auction details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-6">
        <div className="text-red-800">{error}</div>
        <button
          onClick={fetchAuctionDetails}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Auction not found</div>
        <Link
          href="/admin/auctions"
          className="mt-4 inline-flex items-center px-4 py-2 bg-[#FF8A00] text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Auctions
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/auctions"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Auctions
          </Link>
          <h1 className="text-2xl font-bold">Auction Details</h1>
        </div>
        <button
          onClick={fetchAuctionDetails}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Auction Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Auction Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-[#FF8A00]" />
                Auction Overview
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-start space-x-6">
                {/* Auction Image */}
                <div className="flex-shrink-0">
                  <div className="h-32 w-32 relative">
                    {auction.image ? (
                      <Image
                        src={auction.image}
                        alt={auction.name}
                        fill
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-32 w-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Auction Details */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Auction Name
                    </label>
                    <div className="text-xl font-bold text-gray-900">{auction.name}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Auction ID
                    </label>
                    <div className="text-sm font-medium text-gray-900">{auction.id}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Status
                    </label>
                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeColor(auction.status)}`}>
                      {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Base Price
                    </label>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatPrice(auction.basePrice)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Highest Bid
                    </label>
                    <div className="text-lg font-bold text-green-600">
                      {formatPrice(auction.highestBid)}
                    </div>
                    {auction.highestBid > auction.basePrice && (
                      <div className="text-sm text-green-500">
                        +{formatPrice(auction.highestBid - auction.basePrice)} above base
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Volume
                    </label>
                    <div className="text-sm font-medium text-gray-900">{auction.volume}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Created Date
                    </label>
                    <div className="flex items-center text-gray-900">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {formatDate(auction.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center">
                <Package className="h-5 w-5 mr-2 text-[#FF8A00]" />
                Product Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Category
                  </label>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{auction.category}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Country of Origin
                  </label>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-900">{auction.countryOfOrigin}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Seller Information & Actions */}
        <div className="space-y-6">
          {/* Seller Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center">
                <User className="h-5 w-5 mr-2 text-[#FF8A00]" />
                Seller Information
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Company Name
                  </label>
                  <div className="text-sm font-medium text-gray-900">{auction.seller}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Auction Statistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Auction Statistics</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Bid Increase</span>
                  <span className="text-sm font-medium text-green-600">
                    {auction.highestBid > auction.basePrice 
                      ? `+${(((auction.highestBid - auction.basePrice) / auction.basePrice) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Price Difference</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatPrice(auction.highestBid - auction.basePrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <Link
                  href={`/admin/auctions`}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8A00]"
                >
                  View All Auctions
                </Link>
                <Link
                  href={`/admin/bids?search=${encodeURIComponent(auction.name)}`}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#FF8A00] hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8A00]"
                >
                  View Related Bids
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 