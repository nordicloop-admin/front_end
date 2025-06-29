"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Clock, User, Package, TrendingUp } from 'lucide-react';
import { getAdminBid, AdminBid } from '@/services/bids';

export default function BidDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // State management
  const [bid, setBid] = useState<AdminBid | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bid details
  const fetchBidDetails = async () => {
    if (!id || typeof id !== 'string') return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await getAdminBid(id);

      if (response.data) {
        setBid(response.data);
      } else {
        setError(response.error || 'Failed to fetch bid details');
      }
    } catch (err) {
      setError('An unexpected error occurred while fetching bid details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBidDetails();
  }, [id]);

  // Format bid amount
  const formatBidAmount = (amount: number) => {
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
      case 'outbid':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'won':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
          <span className="text-gray-500">Loading bid details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-6">
        <div className="text-red-800">{error}</div>
        <button
          onClick={fetchBidDetails}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!bid) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Bid not found</div>
        <Link
          href="/admin/bids"
          className="mt-4 inline-flex items-center px-4 py-2 bg-[#FF8A00] text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bids
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
            href="/admin/bids"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Bids
          </Link>
          <h1 className="text-2xl font-bold">Bid Details</h1>
        </div>
        <button
          onClick={fetchBidDetails}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Bid Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bid Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-[#FF8A00]" />
                Bid Overview
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Bid ID
                  </label>
                  <div className="text-lg font-semibold">{bid.id}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Status
                  </label>
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeColor(bid.status)}`}>
                    {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Bid Amount
                  </label>
                  <div className="text-2xl font-bold text-[#FF8A00]">
                    {formatBidAmount(bid.bidAmount)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Volume & Unit
                  </label>
                  <div className="text-lg font-semibold">
                    {formatBidAmount(bid.volume)} {bid.unit}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Bid Date
                  </label>
                  <div className="flex items-center text-gray-900">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    {formatDate(bid.bidDate)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Item Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center">
                <Package className="h-5 w-5 mr-2 text-[#FF8A00]" />
                Item Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Item ID
                  </label>
                  <div className="text-sm text-gray-900">{bid.itemId}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Item Name
                  </label>
                  <div className="text-sm font-medium text-gray-900">{bid.itemName}</div>
                </div>
                <div className="md:col-span-2">
                  <Link
                    href={`/admin/marketplace/${bid.itemId}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#FF8A00] bg-orange-50 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8A00]"
                  >
                    View Item Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Bidder Information */}
        <div className="space-y-6">
          {/* Bidder Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center">
                <User className="h-5 w-5 mr-2 text-[#FF8A00]" />
                Bidder Information
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Name
                  </label>
                  <div className="text-sm font-medium text-gray-900">{bid.bidderName}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email
                  </label>
                  <div className="text-sm text-gray-900">{bid.bidderEmail}</div>
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
                  href={`/admin/bids`}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8A00]"
                >
                  View All Bids
                </Link>
                <Link
                  href={`/admin/marketplace/${bid.itemId}`}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#FF8A00] hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8A00]"
                >
                  View Item
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 