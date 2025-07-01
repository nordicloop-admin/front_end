"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Clock, User, Package, TrendingUp, AlertCircle, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import { getAdminBid, AdminBid, updateBidStatus } from '@/services/bids';
import { toast } from 'sonner';

export default function BidDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  
  // State management
  const [bid, setBid] = useState<AdminBid | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Fetch bid details
  const fetchBidDetails = useCallback(async () => {
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
    } catch (_err) {
      setError('An unexpected error occurred while fetching bid details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBidDetails();
  }, [fetchBidDetails]);

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

  // Handle status update
  const handleStatusUpdate = async (newStatus: string) => {
    if (!bid || !id) return;
    
    setIsUpdatingStatus(true);
    
    try {
      const response = await updateBidStatus(id.toString(), newStatus);
      
      if (response.error) {
        toast.error('Failed to update status', {
          description: response.error,
        });
      } else {
        toast.success('Bid status updated', {
          description: `The bid status has been updated to ${newStatus}`,
        });
        
        // Update local state
        setBid({
          ...bid,
          status: newStatus
        });
      }
    } catch (err) {
      toast.error('Failed to update status', {
        description: 'An unexpected error occurred',
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'outbid':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'won':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF8A00]"></div>
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
        <AlertCircle size={24} className="mx-auto text-gray-400 mb-2" />
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
    <div className="min-h-screen bg-gray-50 -mx-5">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-full mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/admin/bids"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span className="font-medium">Back to Bids</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-md text-sm font-medium border ${getStatusBadgeColor(bid.status)}`}>
                {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
              </span>
              
              <div className="relative">
                <select 
                  className="appearance-none bg-white pl-3 pr-8 py-1.5 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                  value={bid.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  disabled={isUpdatingStatus}
                >
                  <option value={bid.status}>Change Status</option>
                  <option value="active">Set to Active</option>
                  <option value="pending">Set to Pending</option>
                  <option value="outbid">Set to Outbid</option>
                  <option value="rejected">Set to Rejected</option>
                  <option value="won">Set to Won</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-6 lg:px-12 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="mb-6">
              <h1 className="text-xl font-medium text-gray-900">Bid for {bid.itemName}</h1>
              
              <div className="flex items-center text-gray-600 text-sm mt-2">
                <User className="w-4 h-4 mr-2" />
                <span>Placed by <span className="font-medium text-gray-900">{bid.bidderName}</span></span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="border border-gray-200 rounded-md p-4">
              <div className="text-sm text-gray-500 mb-1">Bid Amount</div>
              <div className="text-lg font-semibold text-[#FF8A00]">{formatBidAmount(bid.bidAmount)}</div>
            </div>
            
            <div className="border border-gray-200 rounded-md p-4">
              <div className="text-sm text-gray-500 mb-1 flex items-center">
                <Package className="w-4 h-4 mr-2" />
                Volume
              </div>
              <div className="text-lg font-semibold text-gray-900">{formatBidAmount(bid.volume)} {bid.unit}</div>
            </div>
            
            <div className="border border-gray-200 rounded-md p-4">
              <div className="text-sm text-gray-500 mb-1 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Bidder
              </div>
              <div className="text-lg font-semibold text-gray-900">{bid.bidderName}</div>
              <div className="text-sm text-gray-500">{bid.bidderEmail}</div>
            </div>
          </div>
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Bid Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-sm font-medium text-gray-900 mb-4">Bid Details</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Bid Amount</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{formatBidAmount(bid.bidAmount)}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Volume</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{formatBidAmount(bid.volume)} {bid.unit}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Status</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Bid Date</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{formatDate(bid.bidDate)}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Item</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{bid.itemName}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Item ID</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{bid.itemId}</div>
                </div>
              </div>
              
              {bid.message && (
                <div className="mt-6">
                  <h3 className="text-md font-semibold mb-2">Bidder Message</h3>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-100 text-gray-700">
                    {bid.message}
                  </div>
                </div>
              )}
            </div>
            
            {/* Item Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-medium text-gray-900">Item Information</h2>
                <Link
                  href={`/admin/auctions/${bid.itemId}`}
                  className="text-[#FF8A00] text-sm hover:text-orange-700 font-medium"
                >
                  View Item Details
                </Link>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-md border border-gray-100">
                <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center mr-4">
                  <Package size={24} className="text-gray-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{bid.itemName}</h3>
                  <p className="text-sm text-gray-500">ID: {bid.itemId}</p>
                </div>
              </div>
            </div>
            
            {/* Bidder Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-medium text-gray-900">Bidder Information</h2>
                <Link
                  href={`/admin/users/${bid.bidderId}`}
                  className="text-[#FF8A00] text-sm hover:text-orange-700 font-medium"
                >
                  View Bidder Profile
                </Link>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Name</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{bid.bidderName}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Email</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{bid.bidderEmail}</div>
                </div>
                {bid.bidderCompany && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="text-gray-600 text-sm">Company</div>
                    <div className="text-gray-900 font-medium text-sm text-right">{bid.bidderCompany}</div>
                  </div>
                )}
                {bid.bidderPhone && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="text-gray-600 text-sm">Phone</div>
                    <div className="text-gray-900 font-medium text-sm text-right">{bid.bidderPhone}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Admin Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Admin Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleStatusUpdate('active')}
                  disabled={bid.status === 'active' || isUpdatingStatus}
                  className="w-full py-2 rounded-md font-medium transition-colors text-sm border border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Approve Bid
                </button>
                <button
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={bid.status === 'rejected' || isUpdatingStatus}
                  className="w-full py-2 rounded-md font-medium transition-colors text-sm border border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject Bid
                </button>
                <button
                  onClick={() => handleStatusUpdate('won')}
                  disabled={bid.status === 'won' || isUpdatingStatus}
                  className="w-full py-2 rounded-md font-medium transition-colors text-sm border border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mark as Won
                </button>
              </div>
            </div>
            
            {/* Bid Status History */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Status Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    bid.status === 'active' ? 'bg-green-100 text-green-800' :
                    bid.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    bid.status === 'outbid' ? 'bg-gray-100 text-gray-800' :
                    bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    bid.status === 'won' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Bid Date</span>
                  <span className="font-medium text-gray-900">{formatDate(bid.bidDate)}</span>
                </div>
              </div>
            </div>
            
            {/* Admin Notes */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Admin Notes</h3>
              <textarea
                placeholder="Add private notes about this bid (only visible to admins)"
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
              ></textarea>
              <button className="mt-2 w-full px-4 py-2 bg-[#FF8A00] text-white rounded-md hover:bg-orange-600 transition-colors">
                Save Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 