"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Clock, Package, User, Calendar, AlertCircle, Edit, Trash2, Play, Pause } from 'lucide-react';
import { toast } from 'sonner';
import EditAuctionModal, { AuctionData } from '@/components/auctions/EditAuctionModal';
import { getAuctionById, deleteAuction, getAdDetails, activateAd, deactivateAd } from '@/services/auction';
import { getAuctionBids } from '@/services/bid';
import { getCategoryImage } from '@/utils/categoryImages';
import { getFullImageUrl } from '@/utils/imageUtils';
import Modal from '@/components/ui/modal';

// Mock data for auctions (not used but kept for reference)
const _myAuctions = [
  {
    id: '1',
    name: 'PPA Thermocomp UFW49RSC (Black)',
    category: 'Plastics',
    subcategory: 'PP (Polypropylene)',
    basePrice: '5,013,008',
    currentBid: '5,250,000',
    status: 'active',
    timeLeft: '2d 4h',
    volume: '500 kg',
    image: '/images/marketplace/categories/plastics.jpg',
    description: 'High-quality recycled PPA Thermocomp material in black color. This material has been processed and tested to meet industry standards. Suitable for automotive and industrial applications.',
    createdAt: '2023-06-10T10:30:00Z',
    bidHistory: [
      { bidder: 'Company A', amount: '5,250,000', date: '2023-06-14T15:30:00Z' },
      { bidder: 'Company B', amount: '5,150,000', date: '2023-06-14T12:15:00Z' },
      { bidder: 'Company C', amount: '5,100,000', date: '2023-06-13T09:45:00Z' },
    ]
  },
  {
    id: '2',
    name: 'Aluminum Scrap 6061',
    category: 'Metals',
    subcategory: 'Aluminum',
    basePrice: '7,250,000',
    currentBid: '7,500,000',
    status: 'active',
    timeLeft: '3d 6h',
    volume: '1200 kg',
    image: '/images/marketplace/categories/metals.jpg',
    description: 'High-grade aluminum scrap 6061 alloy. Clean and sorted material suitable for recycling and manufacturing. This material has been tested for purity and meets industry standards.',
    createdAt: '2023-06-12T14:45:00Z',
    bidHistory: [
      { bidder: 'Company D', amount: '7,500,000', date: '2023-06-15T10:30:00Z' },
      { bidder: 'Company E', amount: '7,400,000', date: '2023-06-14T14:45:00Z' },
      { bidder: 'Company F', amount: '7,300,000', date: '2023-06-14T08:20:00Z' },
    ]
  }
];

export default function AuctionDetail() {
  const params = useParams();
  const router = useRouter();
  const [auction, setAuction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to fetch complete bid history for an auction (including historical changes)
  const fetchCompleteBidHistory = async (auctionId: number) => {
    try {
      // First, get all current bids for the auction
      const bidsResponse = await getAuctionBids(auctionId);

      if (bidsResponse.error || !bidsResponse.data) {
        return;
      }

      const currentBids = bidsResponse.data.bids || [];
      const totalBids = bidsResponse.data.total_bids || currentBids.length;

      // Collect all historical entries
      const allHistoryEntries: any[] = [];

      // For each current bid, fetch its complete history
      for (const bid of currentBids) {
        try {
          // Import API service to use dynamic URL
          const { apiGet } = await import('@/services/api');

          const historyResponse = await apiGet(`/bids/${bid.id}/history/`, true);

          if (!historyResponse.error && historyResponse.data) {
            const bidHistory = (historyResponse.data as any).history || [];



            // Format each history entry as a separate row
            bidHistory.forEach((entry: any, index: number) => {
              const formattedEntry = {
                bidder: bid.company_name || bid.bidder_name || 'Anonymous',
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



      // Update auction state with complete bid history
      setAuction((prevAuction: any) => ({
        ...prevAuction,
        bidHistory: allHistoryEntries,
        totalBids: totalBids,
        currentBid: allHistoryEntries.length > 0 ? allHistoryEntries[0].amount : null,
        highestBid: allHistoryEntries.length > 0 ? allHistoryEntries[0].amount : null
      }));

    } catch (_error) {

    }
  };

  // Calculate step completion based on material category
  const calculateStepCompletion = (stepCompletionStatus: any, category: string) => {
    if (!stepCompletionStatus) return { completed: 0, total: 0, percentage: 0 };

    // Check if this is a plastic material
    const isPlastic = category && category.toLowerCase().includes('plastic');

    if (isPlastic) {
      // Plastics use 8 steps (1-8)
      const allSteps = [1, 2, 3, 4, 5, 6, 7, 8];
      const completedSteps = allSteps.filter(step => stepCompletionStatus[step]).length;
      return {
        completed: completedSteps,
        total: 8,
        percentage: (completedSteps / 8) * 100
      };
    } else {
      // Other materials use 4 steps (1, 6, 7, 8)
      const relevantSteps = [1, 6, 7, 8];
      const completedSteps = relevantSteps.filter(step => stepCompletionStatus[step]).length;
      return {
        completed: completedSteps,
        total: 4,
        percentage: (completedSteps / 4) * 100
      };
    }
  };

  // Calculate time left for an auction
  const _calculateTimeLeft = (endDate: string, endTime: string) => {
    const now = new Date();
    const end = new Date(`${endDate}T${endTime}`);

    if (end <= now) {
      return 'Ended';
    }

    const diffMs = end.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return `${diffDays}d ${diffHours}h`;
  };

  // Fetch auction data
  useEffect(() => {
    if (params.id) {
      setIsLoading(true);

      // Try to fetch enhanced ad details first
      getAdDetails(params.id as string)
        .then(response => {
          if (!response.error && response.data) {
            const adData = response.data.data;
            
            // Format enhanced ad data for my auctions
            const formattedAuction = {
              id: adData.id.toString(),
              name: adData.title || `${adData.category_name} - ${adData.subcategory_name}`,
              category: adData.category_name,
              subcategory: adData.subcategory_name,
              basePrice: adData.starting_bid_price ? `${adData.starting_bid_price} ${adData.currency}` : adData.total_starting_value,
              currentBid: '', // Will be updated if we fetch bids
              status: adData.status || (adData.is_active ? 'active' : 'draft'),
              timeLeft: adData.time_remaining || adData.auction_duration_display,
              volume: adData.available_quantity ? `${adData.available_quantity} ${adData.unit_of_measurement_display}` : 'N/A',
              image: adData.material_image ? getFullImageUrl(adData.material_image) : getCategoryImage(adData.category_name),
              description: adData.description || adData.specific_material || `${adData.category_name} material available for auction`,
              createdAt: adData.created_at,
              bidHistory: [],
              
              // Enhanced data
              company: adData.company_name,
              seller: adData.posted_by,
              auctionStatus: adData.auction_status,
              stepCompletionStatus: adData.step_completion_status,
              isComplete: adData.is_complete,
              currentStep: adData.current_step,
              keywords: adData.keywords,
              specifications: [
                { name: 'Material Type', value: adData.category_name },
                { name: 'Subcategory', value: adData.subcategory_name },
                { name: 'Specific Material', value: adData.specific_material },
                { name: 'Packaging', value: adData.packaging_display },
                { name: 'Material Frequency', value: adData.material_frequency_display },
                ...(adData.origin_display ? [{ name: 'Origin', value: adData.origin_display }] : []),
                ...(adData.contamination_display ? [{ name: 'Contamination', value: adData.contamination_display }] : []),
                ...(adData.additives_display ? [{ name: 'Additives', value: adData.additives_display }] : []),
                ...(adData.storage_conditions_display ? [{ name: 'Storage Conditions', value: adData.storage_conditions_display }] : []),
                ...(adData.processing_methods_display.length > 0 ? [{ name: 'Processing Methods', value: adData.processing_methods_display.join(', ') }] : []),
                { name: 'Quantity', value: adData.available_quantity ? `${adData.available_quantity} ${adData.unit_of_measurement_display}` : 'N/A' },
                { name: 'Minimum Order', value: `${adData.minimum_order_quantity} ${adData.unit_of_measurement_display}` },
                { name: 'Currency', value: adData.currency_display },
                { name: 'Auction Duration', value: adData.auction_duration_display },
                ...(adData.reserve_price ? [{ name: 'Reserve Price', value: `${adData.reserve_price} ${adData.currency}` }] : []),
                { name: 'Pickup Available', value: adData.pickup_available ? 'Yes' : 'No' },
                ...(adData.delivery_options_display.length > 0 ? [{ name: 'Delivery Options', value: adData.delivery_options_display.join(', ') }] : []),
                { name: 'Status', value: adData.auction_status },
                { name: 'Completion Status', value: adData.is_complete ? 'Complete' : `Step ${adData.current_step} of ${calculateStepCompletion(adData.step_completion_status, adData.category_name).total}` }
              ]
            };

            setAuction(formattedAuction);

            // Fetch complete bid history for this auction
            fetchCompleteBidHistory(adData.id);
          } else {
            // Fallback to old API if enhanced endpoint fails
            return getAuctionById(params.id as string);
          }
        })
        .then(fallbackResponse => {
          if (fallbackResponse && fallbackResponse.error) {
            router.push('/dashboard/my-auctions');
            return;
          }

          if (fallbackResponse && fallbackResponse.data) {
            // Format fallback API data
            const apiAuction = fallbackResponse.data;
            const formattedAuction = {
              id: apiAuction.id.toString(),
              name: apiAuction.title || `${apiAuction.category_name} - ${apiAuction.subcategory_name}`,
              category: apiAuction.category_name,
              subcategory: apiAuction.subcategory_name,
              basePrice: apiAuction.starting_bid_price || apiAuction.total_starting_value,
              currentBid: '',
              status: apiAuction.status || (apiAuction.is_active ? 'active' : 'draft'),
              timeLeft: 'Available',
              volume: apiAuction.available_quantity ? `${apiAuction.available_quantity} ${apiAuction.unit_of_measurement}` : 'N/A',
              image: apiAuction.material_image ? getFullImageUrl(apiAuction.material_image) : getCategoryImage(apiAuction.category_name),
              description: apiAuction.title || `${apiAuction.category_name} material available for auction`,
              createdAt: apiAuction.created_at,
              bidHistory: []
            };
            setAuction(formattedAuction);

            // Also fetch complete bid history for fallback path
            fetchCompleteBidHistory(apiAuction.id);
          }
        })
        .catch(_error => {
          router.push('/dashboard/my-auctions');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [params.id, router]);

  // Handle edit auction - Reload data after successful edit
  const handleEditAuction = async (updatedAuction: AuctionData) => {
    try {
      // Update local state with the new data
      setAuction({
        ...auction,
        ...updatedAuction
      });

      // Close the modal
      setIsEditModalOpen(false);

      // Show success message
      toast.success('Auction updated successfully!', {
        description: 'Your changes have been saved.',
        duration: 3000,
      });

      // Reload the auction data from backend to get fresh data
      try {
        const response = await fetch(`/api/ads/${params.id}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            // Convert backend data to AuctionData format
            const backendData = result.data;
            const refreshedAuction: AuctionData = {
              id: backendData.id.toString(),
              name: backendData.title || backendData.category_name || 'Untitled Auction',
              category: backendData.category_name || '',
              subcategory: backendData.subcategory_name || '',
              description: backendData.description || '',
              basePrice: backendData.starting_bid_price ?
                `${backendData.starting_bid_price} ${backendData.currency || 'SEK'}` :
                'Not set',
              volume: backendData.available_quantity && backendData.unit_of_measurement ?
                `${backendData.available_quantity} ${backendData.unit_of_measurement}` :
                'Not set',
              timeLeft: 'Active', // You might want to calculate this properly
              image: backendData.material_image || '/images/placeholder-material.jpg',
              keywords: backendData.keywords || '',
              status: backendData.status || 'active',
              auctionStatus: backendData.auction_status || 'Active',
              specifications: [
                { name: 'Material Type', value: backendData.category_name || 'Not specified' },
                { name: 'Volume', value: backendData.available_quantity && backendData.unit_of_measurement ?
                  `${backendData.available_quantity} ${backendData.unit_of_measurement}` : 'Not set' },
                { name: 'Base Price', value: backendData.starting_bid_price ?
                  `${backendData.starting_bid_price} ${backendData.currency || 'SEK'}` : 'Not set' }
              ]
            };

            setAuction(refreshedAuction);

          }
        } else {

        }
      } catch (_reloadError) {

        // Don't show error to user, edit was successful
      }

    } catch (error) {
      // Show error toast
      toast.error('Failed to update auction', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        duration: 5000,
      });
    }
  };

  // Handle delete auction
  const handleDeleteAuction = async () => {
    // Show loading toast
    const loadingToast = toast.loading('Deleting auction...');

    try {
      // Send delete request to API
      const response = await deleteAuction(params.id as string);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Check for successful deletion
      if (!response.error && response.data?.success) {
        // Show success message with details from backend
        const deletedTitle = response.data.deletedAd?.title || auction.name;
        toast.success(response.data.message || 'Auction deleted successfully', {
          description: `"${deletedTitle}" has been removed from your listings.`,
          duration: 3000,
        });

        // Redirect to auctions list
        router.push('/dashboard/my-auctions');
        return;
      }

      if (response.error) {
        // Show error toast
        toast.error('Failed to delete auction', {
          description: response.error,
          duration: 5000,
        });
        return;
      }

      // Fallback error (shouldn't reach here)
      toast.error('Failed to delete auction', {
        description: 'An unexpected error occurred',
        duration: 5000,
      });

    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show error toast
      toast.error('Failed to delete auction', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        duration: 5000,
      });
    }
  };

  // Handle activate/publish auction
  const handleActivateAuction = async () => {
    // Show loading toast
    const loadingToast = toast.loading('Publishing auction...');

    try {


      // Send activate request to API
      const response = await activateAd(params.id as string);


      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Check for successful activation
      if (!response.error && response.data) {
        // Update local auction state
        setAuction((prevAuction: any) => ({
          ...prevAuction,
          status: 'active',
          auctionStatus: 'Active',
          timeLeft: response.data!.ad.auction_duration_display
        }));

        // Show success message
        toast.success(response.data.message || 'Auction published successfully', {
          description: 'Your auction is now live and visible to buyers.',
          duration: 3000,
        });
        return;
      }

      if (response.error) {
        // Show error toast
        toast.error('Failed to publish auction', {
          description: response.error,
          duration: 5000,
        });
        return;
      }

      // Fallback error
      toast.error('Failed to publish auction', {
        description: 'An unexpected error occurred',
        duration: 5000,
      });

    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show error toast
      toast.error('Failed to publish auction', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        duration: 5000,
      });
    }
  };

  // Handle deactivate/unpublish auction
  const handleDeactivateAuction = async () => {
    // Show loading toast
    const loadingToast = toast.loading('Unpublishing auction...');

    try {

      // Send deactivate request to API
      const response = await deactivateAd(params.id as string);


      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Check for successful deactivation
      if (!response.error && response.data) {
        // Update local auction state
        setAuction((prevAuction: any) => ({
          ...prevAuction,
          status: 'inactive',
          auctionStatus: 'Draft',
          timeLeft: 'Not Started'
        }));

        // Show success message
        toast.success(response.data.message || 'Auction unpublished successfully', {
          description: 'Your auction is no longer visible to buyers.',
          duration: 3000,
        });
        return;
      }

      if (response.error) {
        // Show error toast
        toast.error('Failed to unpublish auction', {
          description: response.error,
          duration: 5000,
        });
        return;
      }

      // Fallback error
      toast.error('Failed to unpublish auction', {
        description: 'An unexpected error occurred',
        duration: 5000,
      });

    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show error toast
      toast.error('Failed to unpublish auction', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        duration: 5000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-5 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF8A00]"></div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="p-5">
        <div className="bg-white border border-gray-100 rounded-md p-6 text-center">
          <AlertCircle size={24} className="mx-auto text-gray-400 mb-2" />
          <h2 className="text-lg font-medium text-gray-900">Auction not found</h2>
          <p className="text-gray-500 mt-1">The auction you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <button
            onClick={() => router.push('/dashboard/my-auctions')}
            className="mt-4 px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors"
          >
            Back to My Auctions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-full mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard/my-auctions')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span className="font-medium">Back to My Auctions</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-md text-sm font-medium border ${
                auction.auctionStatus === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                auction.auctionStatus === 'Draft' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                auction.auctionStatus === 'Suspended' || auction.status === 'suspended' ? 'bg-red-50 text-red-700 border-red-200' :
                auction.auctionStatus === 'Completed' || auction.status === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                auction.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'
              }`}>
                {auction.auctionStatus || (auction.status === 'active' ? 'Active' : 'Inactive')}
              </span>
              
              {/* Clean Action Layout */}
              <div className="space-y-4">
                {/* Primary Action Only */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      auction.status === 'active' || auction.auctionStatus === 'Active' 
                        ? 'bg-emerald-400 animate-pulse' 
                        : auction.isComplete 
                          ? 'bg-amber-400' 
                          : 'bg-gray-400'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-600">
                      {auction.status === 'suspended' || auction.auctionStatus === 'Suspended'
                        ? 'Suspended'
                        : auction.status === 'active' || auction.auctionStatus === 'Active' 
                          ? 'Live' 
                          : auction.isComplete 
                            ? 'Ready to Publish' 
                            : 'Draft'
                      }
                    </span>
                  </div>

                  {/* Primary Action Button - Added proper spacing */}
                  <div className="flex items-center ml-6">
                    {auction.isComplete && (
                      <>
                        {/* Only show publish/hide buttons for non-final statuses */}
                        {!['completed', 'won', 'closed', 'ended'].includes(auction.status) && 
                         !['Completed', 'Won', 'Closed', 'Ended'].includes(auction.auctionStatus) && (
                          <>
                            {auction.status !== 'active' && auction.auctionStatus !== 'Active' ? (
                              <button
                                onClick={handleActivateAuction}
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-md transition-colors flex items-center space-x-1.5"
                              >
                                <Play className="w-3.5 h-3.5" />
                                <span>Publish</span>
                              </button>
                            ) : (
                              <button
                                onClick={handleDeactivateAuction}
                                className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white text-sm font-medium rounded-md transition-colors flex items-center space-x-1.5"
                              >
                                <Pause className="w-3.5 h-3.5" />
                                <span>Hide</span>
                              </button>
                            )}
                          </>
                        )}
                        
                        {/* Show status message for completed auctions */}
                        {(['completed', 'won', 'closed', 'ended'].includes(auction.status) || 
                          ['Completed', 'Won', 'Closed', 'Ended'].includes(auction.auctionStatus)) && (
                          <div className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-md flex items-center space-x-1.5">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span>Auction {auction.status === 'won' || auction.auctionStatus === 'Won' ? 'Won' : 'Completed'}</span>
                          </div>
                        )}
                      </>
                    )}

                    {/* Continue Setup Button (for incomplete auctions) */}
                    {!auction.isComplete && (
                      <button className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 text-sm font-medium rounded-md transition-colors flex items-center space-x-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Continue Setup</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Setup Progress (for incomplete auctions) */}
                {!auction.isComplete && auction.stepCompletionStatus && (() => {
                  const stepCompletion = calculateStepCompletion(auction.stepCompletionStatus, auction.category);
                  return (
                    <div className="text-xs text-gray-500">
                      Progress: {stepCompletion.completed}/{stepCompletion.total} steps completed
                    </div>
                  );
                })()}
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
              <div className="absolute top-4 left-4">
                <span className="bg-white px-3 py-1 rounded-md text-sm font-medium text-gray-900 shadow-sm">
                  {auction.category}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <div className="bg-gray-900 px-3 py-2 rounded-md text-white flex items-center space-x-2">
                  <Clock size={16} />
                  <span className="text-sm font-medium">{auction.timeLeft}</span>
                </div>
              </div>
            </div>

            {/* Content Section - Takes remaining space */}
            <div className="p-8 xl:col-span-2">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{auction.name}</h1>
                
                {auction.subcategory && (
                  <div className="text-gray-600 mb-4">
                    <span className="bg-gray-100 px-3 py-1 rounded-md text-sm font-medium">
                      {auction.subcategory}
                    </span>
                  </div>
                )}
              </div>

              {/* Key Information Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-md p-4">
                  <div className="text-sm text-gray-500 mb-1">
                    {auction.currentBid ? 'Current Highest Bid' : 'Starting Price'}
                  </div>
                  <div className="text-xl font-bold text-[#FF8A00]">
                    {auction.currentBid || auction.basePrice}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-md p-4">
                  <div className="text-sm text-gray-500 mb-1 flex items-center">
                    <Package className="w-4 h-4 mr-1" />
                    Volume
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {auction.volume}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-md p-4">
                  <div className="text-sm text-gray-500 mb-1 flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    Total Bids
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {auction.totalBids || (auction.bidHistory ? auction.bidHistory.length : 0)}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-md p-4">
                  <div className="text-sm text-gray-500 mb-1 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Created
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(auction.createdAt)}
                  </div>
                </div>
              </div>

              {/* Progress Status */}
              {auction.stepCompletionStatus && (() => {
                const stepCompletion = calculateStepCompletion(auction.stepCompletionStatus, auction.category);
                return (
                  <div className="border border-gray-200 rounded-md p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Completion Progress</span>
                      <span className="text-sm text-gray-500">
                        {stepCompletion.completed} of {stepCompletion.total} steps
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-[#FF8A00] h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${stepCompletion.percentage}%`
                        }}
                      />
                    </div>
                  {!auction.isComplete && (
                    <div className="text-xs text-gray-500">
                      Next: Complete step {auction.currentStep}
                    </div>
                  )}
                </div>
                );
              })()}

              {/* Keywords */}
              {auction.keywords && (
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-700 mb-2">Keywords</div>
                  <div className="flex flex-wrap gap-2">
                    {auction.keywords.split(',').map((keyword: string, index: number) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                        {keyword.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Management Actions - Subtle & Elegant */}
              <div className="mb-6">
                <div className="flex items-center space-x-4 text-sm">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-gray-500 hover:text-gray-700 transition-colors flex items-center space-x-1.5"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  
                  <button
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="text-gray-500 hover:text-red-500 transition-colors flex items-center space-x-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{auction.description}</p>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3">
                {auction.specifications && auction.specifications.map((spec: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div className="text-gray-600 text-sm">{spec.name}</div>
                    <div className="text-gray-900 font-medium text-sm text-right">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bid History */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Bid History</h2>
              {auction.bidHistory && auction.bidHistory.length > 0 ? (
                <div className="overflow-hidden border border-gray-200 rounded-md">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Company</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price per Unit</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Volume</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total Value</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {auction.bidHistory.map((bid: any, index: number) => {
                        const isUpdate = bid.changeReason === 'bid_updated';
                        const isInitial = bid.changeReason === 'bid_placed';

                        return (
                          <tr key={`${bid.bidId}-${bid.historyIndex}-${index}`} className={`hover:bg-gray-50 ${
                            bid.isLatest ? 'bg-green-50' : ''
                          }`}>
                            <td className="px-4 py-3 text-sm text-gray-900 flex items-center">
                              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                                <User className="w-3 h-3 text-gray-600" />
                              </div>
                              <div>
                                <div className="font-medium">{bid.bidder}</div>
                                {bid.isLatest && (
                                  <div className="text-xs text-green-600 font-medium">Current Bid</div>
                                )}
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
                            <td className="px-4 py-3 text-sm font-medium text-[#FF8A00]">{bid.amount}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{bid.volume}</td>
                            <td className="px-4 py-3 text-sm font-medium text-green-600">{bid.totalValue}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{formatDate(bid.date)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 border border-gray-200 rounded-md bg-gray-50">
                  <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No bids placed yet</p>
                  <p className="text-gray-400 text-xs mt-1">Your auction is waiting for the first bid!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Actions - Minimal Sidebar */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
              
              <div className="space-y-4">
                {/* Status Indicator */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      auction.status === 'active' || auction.auctionStatus === 'Active' 
                        ? 'bg-emerald-400 animate-pulse' 
                        : auction.isComplete 
                          ? 'bg-amber-400' 
                          : 'bg-gray-400'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">
                      {auction.status === 'active' || auction.auctionStatus === 'Active' 
                        ? 'Live' 
                        : auction.isComplete 
                          ? 'Ready' 
                          : 'Draft'
                      }
                    </span>
                  </div>
                  {auction.isComplete && (
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md">
                      Complete
                    </span>
                  )}
                </div>

                {/* Progress for incomplete auctions */}
                {!auction.isComplete && auction.stepCompletionStatus && (() => {
                  const stepCompletion = calculateStepCompletion(auction.stepCompletionStatus, auction.category);
                  return (
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>Progress</span>
                        <span>{stepCompletion.completed}/{stepCompletion.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-amber-400 h-1.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${stepCompletion.percentage}%`
                          }}
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Auction Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Auction Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium text-gray-900">{auction.category}</span>
                </div>
                {auction.subcategory && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subcategory</span>
                    <span className="font-medium text-gray-900">{auction.subcategory}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Volume</span>
                  <span className="font-medium text-gray-900">{auction.volume}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Time Left</span>
                  <span className="font-medium text-[#FF8A00]">{auction.timeLeft}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Bids</span>
                  <span className="font-medium text-gray-900">
                    {auction.totalBids || (auction.bidHistory ? auction.bidHistory.length : 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Status</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    auction.auctionStatus === 'Active' ? 'bg-green-50 text-green-700' :
                    auction.auctionStatus === 'Draft' ? 'bg-yellow-50 text-yellow-700' :
                    auction.auctionStatus === 'Suspended' ? 'bg-red-50 text-red-700' :
                    auction.auctionStatus === 'Completed' ? 'bg-blue-50 text-blue-700' :
                    'bg-gray-50 text-gray-700'
                  }`}>
                    {auction.auctionStatus || (auction.status === 'suspended' ? 'Suspended' : auction.status === 'active' ? 'Active' : 'Inactive')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium text-gray-900">{formatDate(auction.createdAt)}</span>
                </div>
                {auction.stepCompletionStatus && (() => {
                  const stepCompletion = calculateStepCompletion(auction.stepCompletionStatus, auction.category);
                  return (
                    <div>
                      <div className="text-sm text-gray-600 mb-2">
                        Completion: {stepCompletion.completed}/{stepCompletion.total} steps
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-[#FF8A00] h-1.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${stepCompletion.percentage}%`
                          }}
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Analytics Card for Better Space Utilization */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Views</span>
                  <span className="font-medium text-gray-900">--</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Watchers</span>
                  <span className="font-medium text-gray-900">--</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Inquiries</span>
                  <span className="font-medium text-gray-900">--</span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Analytics will be available once your auction is active
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Auction Modal */}
      {auction && (
        <EditAuctionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditAuction}
          auction={auction}
          materialType={auction.category?.toLowerCase()}
        />
      )}

      {/* Clean Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        maxWidth="md"
        showCloseButton={false}
      >
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Delete Auction</h2>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Are you sure you want to delete this auction? This action cannot be undone and all associated bids will be lost.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="flex-1 py-2 px-4 border border-gray-200 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAuction}
                  className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
      </Modal>
    </div>
  );
}
