"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, RefreshCw, Clock, User, Package, Building, MapPin, AlertCircle, ChevronDown, Bell } from 'lucide-react';
import { getAdminAuction, AdminAuction, updateAuctionStatus } from '@/services/auctions';
import { getAuctionBids } from '@/services/bid';
import { getCategoryImage } from '@/utils/categoryImages';
import { toast } from 'sonner';
import { adminAdsService } from '@/services/adminAds';
import { createNotification, type CreateNotificationRequest } from '@/services/notifications';
import Modal from '@/components/ui/modal';

export default function AuctionDetailPage() {
  const _router = useRouter();
  const { id } = useParams();
  
  // State management
  const [auction, setAuction] = useState<AdminAuction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [bidHistory, setBidHistory] = useState<any[]>([]);
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

  // Function to fetch complete bid history for an auction (including historical changes)
  const fetchCompleteBidHistory = async (auctionId: number) => {
    try {
      // First, get all current bids for the auction
      const bidsResponse = await getAuctionBids(auctionId);

      if (bidsResponse.error || !bidsResponse.data) {
        return;
      }

      const currentBids = bidsResponse.data.bids || [];

      // Set current bids for the existing table
      setBids(currentBids);

      // Collect all historical entries
      const allHistoryEntries: any[] = [];

      // For each current bid, fetch its complete history
      for (const bid of currentBids) {
        try {
          // Import API service to use dynamic URL
          const { apiGet } = await import('@/services/api');

          const historyResponse = await apiGet(`/bids/${bid.id}/history/`, true);

          if (!historyResponse.error && historyResponse.data) {
            const bidHistoryData = (historyResponse.data as any).history || [];



            // Format each history entry as a separate row
            bidHistoryData.forEach((entry: any, index: number) => {
              const formattedEntry = {
                bidder: bid.company_name || bid.bidder_name || 'Anonymous',
                bidderEmail: bid.bidder_email || 'No email',
                amount: `${entry.new_price} SEK`,
                totalValue: `${parseFloat(entry.new_price) * parseFloat(entry.new_volume)} SEK`,
                volume: `${entry.new_volume} kg`,
                date: entry.timestamp,
                status: 'active',
                changeReason: entry.change_reason,
                previousAmount: entry.previous_price ? `${entry.previous_price} SEK` : null,
                bidId: bid.id,
                historyIndex: index,
                isLatest: index === 0 // First entry is the latest
              };


              allHistoryEntries.push(formattedEntry);
            });
          } else {

          }
        } catch (_error) {

        }
      }

      // Sort all entries by date (newest first)
      allHistoryEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());



      // Set the complete bid history
      setBidHistory(allHistoryEntries);

    } catch (_error) {

    }
  };

  // Fetch auction details
  const fetchAuctionDetails = useCallback(async () => {
    if (!id || typeof id !== 'string') return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await getAdminAuction(id);

      if (response.data) {
        setAuction(response.data);

        // Fetch complete bid history for this auction
        setBidLoading(true);
        try {
          await fetchCompleteBidHistory(parseInt(id as string));
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

  // Format price with currency
  const formatPrice = (amount: number | string, currency?: string) => {
    if (typeof amount === 'string') {
      // If it's already a string, check if it already contains currency
      if (amount.includes('USD') || amount.includes('SEK') || amount.includes('EUR')) {
        return amount;
      }
      // If it's a string number, parse it and format with currency
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount)) {
        const formattedAmount = new Intl.NumberFormat('en-US', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(numAmount);

        if (currency) {
          return `${formattedAmount} ${currency}`;
        }
        return formattedAmount;
      }
      return amount;
    }

    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);

    // Add currency if available
    if (currency) {
      return `${formattedAmount} ${currency}`;
    }

    return formattedAmount;
  };

  // Format unit display name
  const formatUnit = (unit: string) => {
    // Convert backend unit values to proper display names
    const unitDisplayMap: Record<string, string> = {
      'kg': 'Kilogram',
      'tons': 'Tons',
      'tonnes': 'Tonnes',
      'lbs': 'Pounds',
      'pounds': 'Pounds',
      'pieces': 'Pieces',
      'units': 'Units',
      'bales': 'Bales',
      'containers': 'Containers',
      'm³': 'Cubic Meters',
      'cubic_meters': 'Cubic Meters',
      'liters': 'Liters',
      'gallons': 'Gallons',
      'meters': 'Meters'
    };

    return unitDisplayMap[unit] || unit;
  };

  // Format volume string to ensure proper unit display
  const formatVolume = (volume: string, unit_display?: string) => {
    if (!volume) return 'N/A';

    // If volume already contains a formatted unit, return as is
    if (volume.includes(' ')) {
      const parts = volume.split(' ');
      if (parts.length >= 2) {
        const quantity = parts[0];
        const unit = parts.slice(1).join(' ');
        // Check if unit needs formatting
        const formattedUnit = formatUnit(unit);
        return `${quantity} ${formattedUnit}`;
      }
    }

    // If we have a separate unit_display, use it
    if (unit_display) {
      return `${volume} ${unit_display}`;
    }

    return volume;
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
      // First, get auction details to find the creator
      const auctionResponse = await getAdminAuction(auction.id);
      if (auctionResponse.error || !auctionResponse.data) {
        toast.error('Failed to get auction details');
        return;
      }

      // Get auction creator information
      const _auctionData = auctionResponse.data;

      // Get bidders for this auction
      const bidsResponse = await getAuctionBids(parseInt(auction.id));
      const _bidders = bidsResponse.data?.bids || [];

      // Create notifications for auction creator
      const creatorNotificationData: CreateNotificationRequest = {
        title: `[Admin] ${notificationForm.title}`,
        message: notificationForm.message,
        type: notificationForm.type,
        priority: notificationForm.priority,
        metadata: {
          auction_id: auction.id,
          auction_title: auction.name,
          admin_notification: true
        }
      };

      // Send notification to auction creator (this will need backend support to target specific user)
      const response = await createNotification(creatorNotificationData);

      if (response.error) {
        toast.error('Failed to send notification', {
          description: response.error,
        });
      } else {
        toast.success('Notification sent successfully', {
          description: `Notification sent regarding auction: ${auction.name}`,
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
                    {formatPrice(auction.highestBid > auction.basePrice ? auction.highestBid : auction.basePrice, auction.currency)}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-md p-4">
                  <div className="text-sm text-gray-500 mb-1 flex items-center">
                    <Package className="w-4 h-4 mr-1" />
                    Volume
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatVolume(auction.volume, auction.unit_of_measurement_display)}
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
                {/* Basic Information */}
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Category</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{auction.category}</div>
                </div>
                {auction.subcategory && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="text-gray-600 text-sm">Subcategory</div>
                    <div className="text-gray-900 font-medium text-sm text-right">{auction.subcategory}</div>
                  </div>
                )}
                {auction.specificMaterial && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="text-gray-600 text-sm">Specific Material</div>
                    <div className="text-gray-900 font-medium text-sm text-right">{auction.specificMaterial}</div>
                  </div>
                )}

                {/* Quantity and Pricing */}
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Available Quantity</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{formatVolume(auction.volume, auction.unit_of_measurement_display)}</div>
                </div>
                {auction.minimumOrderQuantity && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="text-gray-600 text-sm">Minimum Order</div>
                    <div className="text-gray-900 font-medium text-sm text-right">{auction.minimumOrderQuantity} {formatUnit(auction.unit_of_measurement_display || auction.unit_of_measurement || '')}</div>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Starting Price</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{formatPrice(auction.basePrice, auction.currency)}</div>
                </div>
                {auction.reservePrice && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="text-gray-600 text-sm">Reserve Price</div>
                    <div className="text-gray-900 font-medium text-sm text-right">{formatPrice(auction.reservePrice, auction.currency)}</div>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Currency</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{auction.currency_display || auction.currency}</div>
                </div>

                {/* Material Properties */}
                {auction.packaging && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="text-gray-600 text-sm">Packaging</div>
                    <div className="text-gray-900 font-medium text-sm text-right">{auction.packaging}</div>
                  </div>
                )}
                {auction.materialFrequency && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="text-gray-600 text-sm">Material Frequency</div>
                    <div className="text-gray-900 font-medium text-sm text-right">{auction.materialFrequency}</div>
                  </div>
                )}
                {auction.origin && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="text-gray-600 text-sm">Origin</div>
                    <div className="text-gray-900 font-medium text-sm text-right">{auction.origin}</div>
                  </div>
                )}
                {auction.contamination && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="text-gray-600 text-sm">Contamination</div>
                    <div className="text-gray-900 font-medium text-sm text-right">{auction.contamination}</div>
                  </div>
                )}
                {auction.additives && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="text-gray-600 text-sm">Additives</div>
                    <div className="text-gray-900 font-medium text-sm text-right">{auction.additives}</div>
                  </div>
                )}
                {auction.storageConditions && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="text-gray-600 text-sm">Storage Conditions</div>
                    <div className="text-gray-900 font-medium text-sm text-right">{auction.storageConditions}</div>
                  </div>
                )}
                {auction.processingMethods && auction.processingMethods.length > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="text-gray-600 text-sm">Processing Methods</div>
                    <div className="text-gray-900 font-medium text-sm text-right">{auction.processingMethods.join(', ')}</div>
                  </div>
                )}

                {/* Location and Delivery */}
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Location</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{auction.location || auction.countryOfOrigin}</div>
                </div>
                {auction.pickupAvailable !== undefined && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="text-gray-600 text-sm">Pickup Available</div>
                    <div className="text-gray-900 font-medium text-sm text-right">{auction.pickupAvailable ? 'Yes' : 'No'}</div>
                  </div>
                )}
                {auction.deliveryOptions && auction.deliveryOptions.length > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="text-gray-600 text-sm">Delivery Options</div>
                    <div className="text-gray-900 font-medium text-sm text-right">{auction.deliveryOptions.join(', ')}</div>
                  </div>
                )}

                {/* Auction Information */}
                {auction.auctionDuration && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="text-gray-600 text-sm">Auction Duration</div>
                    <div className="text-gray-900 font-medium text-sm text-right">{auction.auctionDuration}</div>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Status</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}</div>
                </div>
                {auction.auctionStatus && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="text-gray-600 text-sm">Auction Status</div>
                    <div className="text-gray-900 font-medium text-sm text-right">{auction.auctionStatus}</div>
                  </div>
                )}

                {/* System Information */}
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Created Date</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{formatDate(auction.createdAt)}</div>
                </div>
                {auction.auctionEndDate && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="text-gray-600 text-sm">Auction End Date</div>
                    <div className="text-gray-900 font-medium text-sm text-right">{formatDate(auction.auctionEndDate)}</div>
                  </div>
                )}
                {auction.endDate && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="text-gray-600 text-sm">End Date</div>
                    <div className="text-gray-900 font-medium text-sm text-right">{formatDate(auction.endDate)}</div>
                  </div>
                )}

                {/* Completion Status */}
                {auction.isComplete !== undefined && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="text-gray-600 text-sm">Completion Status</div>
                    <div className="text-gray-900 font-medium text-sm text-right">
                      {auction.isComplete ? 'Complete' : `Step ${auction.currentStep || 'Unknown'} of 8`}
                    </div>
                  </div>
                )}

                {/* Keywords */}
                {auction.keywords && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="text-gray-600 text-sm">Keywords</div>
                    <div className="text-gray-900 font-medium text-sm text-right">{auction.keywords}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Current Bids Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-sm font-medium text-gray-900 mb-4">Current Bids Summary</h2>
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
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Current Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Volume</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total Value</th>
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
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {bid.volume_requested} kg
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                            {formatPrice(bid.total_bid_value)}
                          </td>
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

            {/* Complete Bid History */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-sm font-medium text-gray-900 mb-4">Complete Bid History</h2>
              <p className="text-xs text-gray-500 mb-4">Shows all bid changes including updates and modifications</p>
              {bidLoading ? (
                <div className="flex items-center justify-center p-6">
                  <RefreshCw className="h-5 w-5 animate-spin text-gray-400 mr-2" />
                  <span className="text-gray-500">Loading bid history...</span>
                </div>
              ) : bidHistory.length === 0 ? (
                <div className="text-center py-8 border border-gray-200 rounded-md bg-gray-50">
                  <Package size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">No bid history available</p>
                </div>
              ) : (
                <div className="overflow-hidden border border-gray-200 rounded-md">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Bidder</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price per Unit</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Volume</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total Value</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bidHistory.map((historyEntry: any, index: number) => {
                        const isUpdate = historyEntry.changeReason === 'bid_updated';
                        const isInitial = historyEntry.changeReason === 'bid_placed';

                        return (
                          <tr key={`${historyEntry.bidId}-${historyEntry.historyIndex}-${index}`} className={`hover:bg-gray-50 ${
                            historyEntry.isLatest ? 'bg-green-50' : ''
                          }`}>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                                  <User size={12} className="text-gray-600" />
                                </div>
                                <div>
                                  <div className="font-medium">{historyEntry.bidder}</div>
                                  <div className="text-xs text-gray-500">{historyEntry.bidderEmail}</div>
                                  {historyEntry.isLatest && (
                                    <div className="text-xs text-green-600 font-medium">Current Bid</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                isInitial
                                  ? 'bg-blue-100 text-blue-800'
                                  : isUpdate
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}>
                                {isInitial ? 'Initial Bid' : isUpdate ? 'Updated Bid' : 'Bid'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-[#FF8A00]">{historyEntry.amount}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{historyEntry.volume}</td>
                            <td className="px-4 py-3 text-sm font-medium text-green-600">{historyEntry.totalValue}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{formatDate(historyEntry.date)}</td>
                          </tr>
                        );
                      })}
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
    <Modal
      isOpen={showNotificationModal}
      onClose={() => setShowNotificationModal(false)}
      title="Send Notification"
      maxWidth="md"
    >
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
    </Modal>
    </>
  );
}