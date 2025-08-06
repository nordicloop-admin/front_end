"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, RefreshCw, Clock, User, Package, Building, MapPin, AlertCircle, ChevronDown, Bell, X } from 'lucide-react';
import { getAdminAuction, AdminAuction, updateAuctionStatus } from '@/services/auctions';
import { getAuctionBids } from '@/services/bid';
import { getCategoryImage } from '@/utils/categoryImages';
import { toast } from 'sonner';
import { adminAdsService } from '@/services/adminAds';
import { createNotification, type CreateNotificationRequest } from '@/services/notifications';

export default function AuctionDetailPage() {
  const _router = useRouter();
  const { id } = useParams();
  
  // State management
  const [auction, setAuction] = useState<AdminAuction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [bidLoading, setBidLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Notification modal state
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'auction',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent'
  });

  // Fetch auction details
  const fetchAuctionDetails = useCallback(async () => {
    if (!id || typeof id !== 'string') return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await getAdminAuction(id);

      if (response.data) {
        setAuction(response.data);
        
        // Fetch bids for this auction
        setBidLoading(true);
        try {
          const bidsResponse = await getAuctionBids(parseInt(id as string));
          if (!bidsResponse.error && bidsResponse.data) {
            setBids(bidsResponse.data.bids || []);
          }
        } catch (_err) {
          // Failed to fetch bids - silently handle this error
        } finally {
          setBidLoading(false);
        }
      } else {
        setError(response.error || 'Failed to fetch auction details');
      }
    } catch (_err) {
      setError('An unexpected error occurred while fetching auction details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAuctionDetails();
  }, [fetchAuctionDetails]);

  // Format price
  const formatPrice = (amount: number | string) => {
    if (typeof amount === 'string') {
      return amount;
    }
    
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
    if (!auction || !id) return;
    
    setIsUpdatingStatus(true);
    
    try {
      let response;
      
      if (newStatus === 'active') {
        // Use adminAdsService for approval
        response = await adminAdsService.approveAd(parseInt(id.toString()));
        
        if (response.error || !response.success) {
          toast.error('Failed to approve ad', {
            description: response.error || 'An error occurred during approval',
          });
        } else {
          toast.success('Ad approved successfully', {
            description: response.message || 'The ad has been approved and activated',
          });
          
          // Update local state with data from response
          if (response.data?.ad) {
            setAuction({
              ...auction,
              status: response.data.ad.status as 'active',
              suspended_by_admin: response.data.ad.suspended_by_admin
            });
          } else {
            // Fallback if response doesn't contain expected data
            setAuction({
              ...auction,
              status: 'active',
              suspended_by_admin: false
            });
          }
          
          // Refresh auction details to get the latest data
          fetchAuctionDetails();
        }
      } else if (newStatus === 'suspended') {
        // Use adminAdsService for suspension
        response = await adminAdsService.suspendAd(parseInt(id.toString()));
        
        if (response.error || !response.success) {
          toast.error('Failed to suspend ad', {
            description: response.error || 'An error occurred during suspension',
          });
        } else {
          toast.success('Ad suspended successfully', {
            description: response.message || 'The ad has been suspended',
          });
          
          // Update local state with data from response
          if (response.data?.ad) {
            setAuction({
              ...auction,
              status: response.data.ad.status as 'suspended',
              suspended_by_admin: response.data.ad.suspended_by_admin
            });
          } else {
            // Fallback if response doesn't contain expected data
            setAuction({
              ...auction,
              status: 'suspended',
              suspended_by_admin: true
            });
          }
          
          // Refresh auction details to get the latest data
          fetchAuctionDetails();
        }
      } else {
        // Use regular auction status update for other statuses
        response = await updateAuctionStatus(id.toString(), newStatus);
        
        if (response.error) {
          toast.error('Failed to update status', {
            description: response.error,
          });
        } else {
          toast.success('Auction status updated', {
            description: `The auction status has been updated to ${newStatus}`,
          });
          
          // Update local state
          setAuction({
            ...auction,
            status: newStatus as 'pending' | 'active' | 'closed' | 'suspended'
          });
        }
      }
    } catch (_err) {
      toast.error('Failed to update status', {
        description: 'An unexpected error occurred',
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle notification sending
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auction) return;

    setSendingNotification(true);
    try {
      const notificationData: CreateNotificationRequest = {
        title: notificationForm.title,
        message: notificationForm.message,
        type: notificationForm.type,
        priority: notificationForm.priority,
        // Note: This would need backend support to send to auction creator and bidders
        // For now, we'll send a general notification
      };

      const response = await createNotification(notificationData);

      if (response.error) {
        toast.error('Failed to send notification', {
          description: response.error,
        });
      } else {
        toast.success('Notification sent successfully', {
          description: 'The notification has been sent to relevant users',
        });
        setNotificationForm({
          title: '',
          message: '',
          type: 'auction',
          priority: 'normal'
        });
        setShowNotificationModal(false);
      }
    } catch (_err) {
      toast.error('Failed to send notification', {
        description: 'An unexpected error occurred',
      });
    } finally {
      setSendingNotification(false);
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'closed':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'suspended':
        return 'bg-red-50 text-red-700 border-red-200';
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
        <AlertCircle size={24} className="mx-auto text-gray-400 mb-2" />
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
    <>
    <div className="min-h-screen bg-gray-50 -mx-5">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-full mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/admin/auctions"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span className="font-medium">Back to Auctions</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-md text-sm font-medium border ${getStatusBadgeColor(auction.status)}`}>
                {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
              </span>
              
              <div className="relative">
                <select 
                  className="appearance-none bg-white pl-3 pr-8 py-1.5 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                  value={auction.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  disabled={isUpdatingStatus}
                >
                  <option value={auction.status}>Change Status</option>
                  <option value="active">Set to Active</option>
                  <option value="pending">Set to Pending</option>
                  <option value="closed">Set to Closed</option>
                  <option value="suspended">Set to Suspended</option>
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
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          <div className="grid grid-cols-1 xl:grid-cols-5">
            {/* Image Section - Takes more space */}
            <div className="relative h-80 xl:h-[500px] xl:col-span-3">
              {auction.image ? (
                <Image
                  src={auction.image}
                  alt={auction.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback to category image on error
                    const target = e.target as HTMLImageElement;
                    target.src = getCategoryImage(auction.category);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Package size={64} className="text-gray-400" />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="bg-white px-3 py-1 rounded-md text-sm font-medium text-gray-900 shadow-sm">
                  {auction.category}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <div className="bg-black/70 px-3 py-2 rounded-md text-white flex items-center space-x-2">
                  <Clock size={16} />
                  <span className="text-sm font-medium">{auction.endDate ? new Date(auction.endDate) > new Date() ? 'Active' : 'Ended' : 'No End Date'}</span>
                </div>
              </div>
            </div>

            {/* Content Section - Takes remaining space */}
            <div className="p-8 xl:col-span-2">
              <div className="mb-6">
                <h1 className="text-xl font-medium text-gray-900 mb-2">{auction.name}</h1>
                
                <div className="flex items-center text-gray-600 text-sm">
                  <Building className="w-4 h-4 mr-2" />
                  <span>Posted by <span className="font-medium text-gray-900">{auction.seller}</span></span>
                  {auction.company && <span className="ml-1">from {auction.company}</span>}
                </div>
              </div>

              {/* Key Information Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-md p-4">
                  <div className="text-sm text-gray-500 mb-1">
                    {auction.highestBid > auction.basePrice ? 'Current Highest Bid' : 'Starting Price'}
                  </div>
                  <div className="text-lg font-semibold text-[#FF8A00]">
                    {formatPrice(auction.highestBid > auction.basePrice ? auction.highestBid : auction.basePrice)}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-md p-4">
                  <div className="text-sm text-gray-500 mb-1 flex items-center">
                    <Package className="w-4 h-4 mr-1" />
                    Volume
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {auction.volume}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-md p-4">
                  <div className="text-sm text-gray-500 mb-1 flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    Seller
                  </div>
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {auction.seller || 'Unknown Seller'}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-md p-4">
                  <div className="text-sm text-gray-500 mb-1 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Origin
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {auction.countryOfOrigin}
                  </div>
                </div>
              </div>

              {/* Admin Quick Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => handleStatusUpdate('active')}
                  disabled={auction.status === 'active' || isUpdatingStatus}
                  className="w-full flex items-center justify-center px-4 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 hover:bg-green-50 hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingStatus ? 'Updating...' : 'Approve & Activate'}
                </button>
                
                <button
                  onClick={() => handleStatusUpdate('suspended')}
                  disabled={auction.status === 'suspended' || isUpdatingStatus}
                  className="w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingStatus ? 'Updating...' : 'Suspend Auction'}
                </button>

                <button
                  onClick={fetchAuctionDetails}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw size={14} className="mr-2" />
                  Refresh Data
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-sm font-medium text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{auction.description || 'No description available.'}</p>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-sm font-medium text-gray-900 mb-4">Specifications</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Category</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{auction.category}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Volume</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{auction.volume}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Base Price</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{formatPrice(auction.basePrice)}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Location</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{auction.location || auction.countryOfOrigin}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Status</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Created Date</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{formatDate(auction.createdAt)}</div>
                </div>
                {auction.endDate && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="text-gray-600 text-sm">End Date</div>
                    <div className="text-gray-900 font-medium text-sm text-right">{formatDate(auction.endDate)}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Bid History */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-sm font-medium text-gray-900 mb-4">Bid History</h2>
              {bidLoading ? (
                <div className="flex items-center justify-center p-6">
                  <RefreshCw className="h-5 w-5 animate-spin text-gray-400 mr-2" />
                  <span className="text-gray-500">Loading bids...</span>
                </div>
              ) : bids.length === 0 ? (
                <div className="text-center py-8 border border-gray-200 rounded-md bg-gray-50">
                  <Package size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">No bids placed yet</p>
                </div>
              ) : (
                <div className="overflow-hidden border border-gray-200 rounded-md">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Bidder</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bids.map((bid, index) => (
                        <tr key={bid.id || index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <User size={14} className="text-gray-500" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{bid.bidder_name || 'Anonymous'}</p>
                                <p className="text-xs text-gray-500">{bid.bidder_email || 'No email'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-[#FF8A00]">{formatPrice(bid.bid_price_per_unit)}</div>
                            {index === 0 && <div className="text-xs text-green-500">Highest bid</div>}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(bid.created_at)}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              index === 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {index === 0 ? 'Winning' : 'Outbid'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                            <Link
                              href={`/admin/bids/${bid.id}`}
                              className="text-[#FF8A00] hover:text-orange-700"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Admin Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Admin Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleStatusUpdate('active')}
                  disabled={auction.status === 'active' || isUpdatingStatus}
                  className="w-full py-2 rounded-md font-medium transition-colors text-sm border border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Approve & Activate
                </button>
                <button
                  onClick={() => handleStatusUpdate('suspended')}
                  disabled={auction.status === 'suspended' || isUpdatingStatus}
                  className="w-full py-2 rounded-md font-medium transition-colors text-sm border border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suspend Auction
                </button>
                <button
                  onClick={() => handleStatusUpdate('closed')}
                  disabled={auction.status === 'closed' || isUpdatingStatus}
                  className="w-full py-2 rounded-md font-medium transition-colors text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Close Auction
                </button>
                <button
                  onClick={() => fetchAuctionDetails()}
                  disabled={isUpdatingStatus}
                  className="w-full py-2 rounded-md font-medium transition-colors text-sm border border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 mr-1" /> Refresh Data
                </button>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Seller Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Building className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{auction.seller || 'Unknown Seller'}</div>
                    {auction.company && (
                      <div className="text-gray-600 text-xs">{auction.company}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{auction.countryOfOrigin}</span>
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Admin Notes</h3>
              <textarea
                placeholder="Add private notes about this auction (only visible to admins)"
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
              ></textarea>
              <button className="mt-2 px-4 py-2 bg-[#FF8A00] text-white rounded-md hover:bg-orange-600 transition-colors">
                Save Notes
              </button>
            </div>

            {/* Admin Communication */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Admin Communication</h3>
              <p className="text-sm text-gray-600 mb-4">Send notifications to auction creator and bidders</p>
              <button
                onClick={() => setShowNotificationModal(true)}
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#FF8A00] border border-[#FF8A00] rounded-md hover:bg-[#e67700] transition-colors"
              >
                <Bell size={16} className="mr-2" />
                Send Notification
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Notification Modal */}
    {showNotificationModal && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-md mx-4">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Send Notification</h3>
            <button
              onClick={() => setShowNotificationModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <form onSubmit={handleSendNotification}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target
                  </label>
                  <input
                    type="text"
                    value={`Auction: ${auction?.name} (Creator & Bidders)`}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={notificationForm.title}
                    onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                    required
                    placeholder="Notification title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={notificationForm.message}
                    onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                    required
                    placeholder="Enter your notification message"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={notificationForm.type}
                      onChange={(e) => setNotificationForm({ ...notificationForm, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                    >
                      <option value="auction">Auction</option>
                      <option value="system">System</option>
                      <option value="alert">Alert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={notificationForm.priority}
                      onChange={(e) => setNotificationForm({ ...notificationForm, priority: e.target.value as 'low' | 'normal' | 'high' | 'urgent' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNotificationModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingNotification}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#FF8A00] rounded-md hover:bg-[#e67700] disabled:opacity-50 flex items-center"
                >
                  {sendingNotification ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Bell size={16} className="mr-2" />
                      Send Notification
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
    </>
  );
}