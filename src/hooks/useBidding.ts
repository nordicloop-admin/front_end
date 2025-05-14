import { useState } from 'react';
import { toast } from 'sonner';

interface Auction {
  id: string;
  name: string;
  category: string;
  basePrice: string;
  highestBid: string | null;
  timeLeft: string;
  volume: string;
  countryOfOrigin: string;
}

interface UseBiddingReturn {
  selectedAuction: Auction | null;
  isModalOpen: boolean;
  openBidModal: (auction: Auction) => void;
  closeBidModal: () => void;
  submitBid: (bidAmount: string) => Promise<void>;
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

  const submitBid = async (bidAmount: string): Promise<void> => {
    if (!selectedAuction) return;

    try {
      // Show loading toast
      const loadingToast = toast.loading('Processing your bid...');

      // Make API call to submit the bid
      const response = await fetch('/api/bids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auctionId: selectedAuction.id,
          bidAmount: bidAmount.replace(/,/g, ''),
        }),
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to place bid');
      }

      const data = await response.json();

      // Show success message
      toast.success(`Bid of ${bidAmount} SEK placed successfully`, {
        description: `Your bid for ${selectedAuction.name} has been recorded.`,
        duration: 5000,
      });

      // Close the modal
      setIsModalOpen(false);

    } catch (error) {
      // Show error message
      toast.error('Failed to place bid', {
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
