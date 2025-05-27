import { useState } from 'react';
import { toast } from 'sonner';
import { createBid, updateBid, BidCreateData, BidUpdateData, BidErrorResponse } from '@/services/bid';
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

interface UseBiddingReturn {
  selectedAuction: Auction | null;
  isModalOpen: boolean;
  openBidModal: (auction: Auction) => void;
  closeBidModal: () => void;
  submitBid: (bidAmount: string, bidVolume?: string) => Promise<void>;
}

export default function useBidding(): UseBiddingReturn {
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openBidModal = (auction: Auction) => {
    setSelectedAuction(auction);
    setIsModalOpen(true);
  };

  const closeBidModal = () => {
    setIsModalOpen(false);
  };

  const submitBid = async (bidAmount: string, bidVolume?: string): Promise<void> => {
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

      // Parse the bid amount
      const parsedAmount = parseFloat(bidAmount.replace(/,/g, ''));

      // Parse volume if provided
      const parsedVolume = bidVolume ? parseFloat(bidVolume) : undefined;

      let response;

      // Check if we're updating an existing bid or creating a new one
      if (selectedAuction.bidId) {
        // Prepare bid update data
        const updateData: BidUpdateData = {
          amount: parsedAmount,
        };

        // Add volume if provided
        if (parsedVolume) {
          updateData.volume = parsedVolume;
        }

        // Make API call to update the bid
        response = await updateBid(selectedAuction.bidId, updateData);
      } else {
        // Prepare bid creation data
        const createData: BidCreateData = {
          ad_id: parseInt(selectedAuction.id),
          amount: parsedAmount,
        };

        // Add volume if provided
        if (parsedVolume) {
          createData.volume = parsedVolume;
        }

        // Make API call to create a new bid
        response = await createBid(createData);
      }

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.error) {
        // Check if it's a specific error from the API
        if (response.data && 'error' in (response.data as BidErrorResponse)) {
          throw new Error((response.data as BidErrorResponse).error);
        }
        throw new Error(response.error);
      }

      // Show success message
      const isUpdate = !!selectedAuction.bidId;
      toast.success(`Bid of ${bidAmount} SEK ${isUpdate ? 'updated' : 'placed'} successfully`, {
        description: `Your bid for ${selectedAuction.name} has been ${isUpdate ? 'updated' : 'recorded'}.`,
        duration: 5000,
      });

      // Close the modal
      setIsModalOpen(false);

    } catch (error) {
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
