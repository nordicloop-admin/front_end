import { useState } from 'react';
import { toast } from 'sonner';
import { createBid, updateBid, BidCreateData, BidUpdateData, BidCreateResponse } from '@/services/bid';
import { getAccessToken, isAuthenticated } from '@/services/auth';

interface Auction {
  id: string;
  name: string;
  category: string;
  basePrice: string;
  highestBid: string | null;
  timeLeft: string;
  volume: string;
  countryOfOrigin: string;
  originalBidAmount?: string; // Original bid amount for pre-filling the bid form
  bidId?: number; // ID of the existing bid if updating
}

interface BidSubmissionData {
  bidAmount: string;
  bidVolume?: string;
  volumeType?: 'partial' | 'full';
  notes?: string;
  maxAutoBidPrice?: string;
}

interface UseBiddingReturn {
  selectedAuction: Auction | null;
  isModalOpen: boolean;
  openBidModal: (auction: Auction) => void;
  closeBidModal: () => void;
  submitBid: (data: BidSubmissionData) => Promise<void>;
}

export default function useBidding(): UseBiddingReturn {
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_error, setError] = useState<string | null>(null);

  const openBidModal = (auction: Auction) => {
    setSelectedAuction(auction);
    setIsModalOpen(true);
  };

  const closeBidModal = () => {
    setIsModalOpen(false);
  };

  const submitBid = async (data: BidSubmissionData): Promise<void> => {
    if (!selectedAuction) return;

    try {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        toast.error('Authentication required', {
          description: 'You must be logged in to place a bid.',
          duration: 5000,
        });

        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
        }, 2000);

        return;
      }

      // Get access token for debugging
      const token = getAccessToken();
      if (!token) {
        toast.error('Authentication token missing', {
          description: 'Please log in again to place a bid.',
          duration: 5000,
        });
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading('Processing your bid...');

      // Parse the bid amount (remove commas)
      const parsedAmount = data.bidAmount.replace(/,/g, '');

      // Parse volume if provided
      const parsedVolume = data.bidVolume || '';

      let response;

      // Check if we're updating an existing bid or creating a new one
      if (selectedAuction.bidId) {
        // Prepare bid update data using new API structure
        const updateData: BidUpdateData = {
          bid_price_per_unit: parsedAmount,
        };

        // Add volume if provided
        if (parsedVolume) {
          updateData.volume_requested = parsedVolume;
        }

        // Add notes if provided
        if (data.notes) {
          updateData.notes = data.notes;
        }

        // Add auto-bid max price if provided
        if (data.maxAutoBidPrice) {
          updateData.max_auto_bid_price = data.maxAutoBidPrice.replace(/,/g, '');
        }

        // Make API call to update the bid
        response = await updateBid(selectedAuction.bidId, updateData);
      } else {
        // Prepare bid creation data using new API structure
        const createData: BidCreateData = {
          ad: parseInt(selectedAuction.id),
          bid_price_per_unit: parsedAmount,
          volume_requested: parsedVolume || '1', // Default to 1 if not provided
        };

        // Add volume type if provided
        if (data.volumeType) {
          createData.volume_type = data.volumeType;
        }

        // Add notes if provided
        if (data.notes) {
          createData.notes = data.notes;
        }

        // Add auto-bid max price if provided
        if (data.maxAutoBidPrice) {
          createData.max_auto_bid_price = data.maxAutoBidPrice.replace(/,/g, '');
        }

        // Make API call to create a new bid
        response = await createBid(createData);
      }

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.error) {
        // Check for specific error messages
        if (response.error.includes("You cannot bid on your own ad")) {
          toast.error("Cannot bid on your own auction", {
            description: "You cannot place bids on auctions that you created.",
            duration: 5000,
          });
        } else {
          toast.error(`Failed to ${selectedAuction.bidId ? 'update' : 'place'} bid`, {
            description: response.error,
            duration: 5000,
          });
        }
        setError(response.error);
        return;
      }

      // Extract bid data from response
      const bidResponse = response.data as BidCreateResponse;
      const bidData = bidResponse?.bid;

      // Show success message
      const isUpdate = !!selectedAuction.bidId;
      const currency = bidData?.currency || 'EUR';
      const formatAmount = parseFloat(parsedAmount).toLocaleString();

      toast.success(`Bid of ${formatAmount} ${currency} ${isUpdate ? 'updated' : 'placed'} successfully`, {
        description: `Your bid for ${selectedAuction.name} has been ${isUpdate ? 'updated' : 'recorded'}.`,
        duration: 5000,
      });

      // Show additional info if auto-bidding is enabled
      if (data.maxAutoBidPrice && bidData?.is_auto_bid) {
        const maxAmount = parseFloat(data.maxAutoBidPrice.replace(/,/g, '')).toLocaleString();
        toast.info(`Auto-bidding enabled up to ${maxAmount} ${currency}`, {
          description: 'We will automatically bid for you when outbid.',
          duration: 3000,
        });
      }

      // Show rank information if available
      if (bidData?.rank) {
        const rankMessage = bidData.rank === 1 
          ? 'You are currently the highest bidder!' 
          : `You are ranked #${bidData.rank}`;
        
        toast.info(rankMessage, {
          duration: 3000,
        });
      }

      // Close the modal
      setIsModalOpen(false);

      // Refresh the page to show updated data
      window.location.reload();

    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      
      // Show error message
      const isUpdate = !!selectedAuction?.bidId;
      toast.error(`Failed to ${isUpdate ? 'update' : 'place'} bid`, {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        duration: 5000,
      });
    }
  };

  return {
    selectedAuction,
    isModalOpen,
    openBidModal,
    closeBidModal,
    submitBid,
  };
}
