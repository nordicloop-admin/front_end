"use client";

import React from 'react';
import Link from 'next/link';

export default function MyAuctions() {
  const [auctions, setAuctions] = useState<AuctionData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<AuctionData | null>(null);

  // State for API auctions
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate time left for an auction
  const calculateTimeLeft = (endDate: string, endTime: string) => {
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

  // Fetch user auctions from the API
  useEffect(() => {
    const fetchUserAuctions = async () => {
      setIsLoading(true);

      try {
        const response = await getUserAuctions();

        if (response.error) {
          // Error handling for user auctions fetch failures

          // Check if it's an authentication error
          if (response.status === 401) {
            setError('Authentication required. Please log in to view your auctions.');
          } else {
            setError(response.error);
          }
        } else if (response.data) {
          // Successfully fetched user auctions

          // Convert API auctions to the format expected by the UI
          const convertedAuctions = response.data.map(auction => ({
            id: auction.id.toString(),
            name: auction.title || `${auction.category_name} - ${auction.subcategory_name}`,
            category: auction.category_name,
            subcategory: auction.subcategory_name,
            basePrice: auction.starting_bid_price || auction.total_starting_value,
            currentBid: '', // API doesn't provide highest bid yet
            status: auction.is_active ? 'active' : 'inactive',
            timeLeft: 'Available', // API doesn't provide end date/time in this format
            volume: auction.available_quantity ? `${auction.available_quantity} ${auction.unit_of_measurement}` : 'N/A',
            image: auction.material_image || '/images/marketplace/categories/plastics.jpg' // Fallback image
          }));

          // Update the auctions state with the API data
          setAuctions(convertedAuctions);
        } else {
          // No user auctions data available
          // Don't set error here, just keep the mock data
        }
      } catch (err) {
        // Error handling for overall fetch process
        setError(err instanceof Error ? err.message : 'Failed to fetch your auctions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAuctions();
  }, []);

  const handleAddAuction = async (auctionData: AuctionFormData) => {
    // Show loading toast
    const loadingToast = toast.loading('Creating auction...');

    try {
      // Prepare the data for the API
      const apiData = {
        item_name: auctionData.name,
        category: auctionData.category,
        subcategory: auctionData.subcategory,
        description: auctionData.description,
        base_price: auctionData.basePrice,
        price_per_partition: auctionData.pricePerPartition,
        volume: auctionData.volume,
        unit: auctionData.unit,
        selling_type: auctionData.sellingType,
        country_of_origin: auctionData.countryOfOrigin,
        end_date: auctionData.endDate,
        end_time: auctionData.endTime
      };

      // Preparing auction data for submission

      // Validate selling type is one of the allowed values
      if (!['partition', 'whole', 'both'].includes(apiData.selling_type)) {
        // Invalid selling type detected
        toast.error('Invalid selling type. Please select a valid option.');
        toast.dismiss(loadingToast);
        return;
      }

      let response;

      // If there's an image, use the createAuctionWithImage function
      if (auctionData.image) {
        response = await createAuctionWithImage(apiData, auctionData.image);
      } else {
        response = await createAuction(apiData);
      }

      // Dismiss the loading toast
      toast.dismiss(loadingToast);

      if (response.error) {
        // Show error toast
        toast.error('Failed to create auction', {
          description: response.error,
          duration: 5000,
        });
        return;
      }

      if (response.data) {
        // Create a new auction object for the UI
        const newAuction = {
          id: response.data.id.toString(),
          name: response.data.title || `${response.data.category_name} - ${response.data.subcategory_name}`,
          category: response.data.category_name,
          subcategory: response.data.subcategory_name,
          basePrice: response.data.starting_bid_price || response.data.total_starting_value,
          currentBid: '',
          status: response.data.is_active ? 'active' : 'inactive',
          timeLeft: 'Available', // API doesn't provide end date/time in this format
          volume: response.data.available_quantity ? `${response.data.available_quantity} ${response.data.unit_of_measurement}` : 'N/A',
          image: response.data.material_image || '/images/marketplace/categories/plastics.jpg' // Fallback image
        };

        // Add the new auction to the list
        setAuctions([newAuction, ...auctions]);

        // Close the modal
        setIsModalOpen(false);

        // Show success message
        toast.success('Auction created successfully', {
          description: 'Your new auction has been listed.',
          duration: 3000,
        });

        // Refresh the auctions list
        getUserAuctions().then(response => {
          if (response.data) {
            // Convert API auctions to the format expected by the UI
            const convertedAuctions = response.data.map(auction => ({
              id: auction.id.toString(),
              name: auction.title || `${auction.category_name} - ${auction.subcategory_name}`,
              category: auction.category_name,
              subcategory: auction.subcategory_name,
              basePrice: auction.starting_bid_price || auction.total_starting_value,
              currentBid: '', // API doesn't provide highest bid yet
              status: auction.is_active ? 'active' : 'inactive',
              timeLeft: 'Available', // API doesn't provide end date/time in this format
              volume: auction.available_quantity ? `${auction.available_quantity} ${auction.unit_of_measurement}` : 'N/A',
              image: auction.material_image || '/images/marketplace/categories/plastics.jpg' // Fallback image
            }));

            // Update the auctions state with the API data
            setAuctions(convertedAuctions);
          }
        }).catch(_err => {
          // Error handling for auction refresh failures
        });
      }
    } catch (error) {
      // Dismiss the loading toast
      toast.dismiss(loadingToast);

      // Show error toast
      toast.error('Failed to create auction', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        duration: 5000,
      });
    }
  };

  // Handle opening the edit modal
  const handleEditClick = (auction: AuctionData) => {
    setSelectedAuction(auction);
    setIsEditModalOpen(true);
  };

  // Handle edit auction submission
  const handleEditAuction = (updatedAuction: AuctionData) => {
    // In a real app, you would send the updated data to an API
    // For now, we'll just update our local state
    const updatedAuctions = auctions.map(auction =>
      auction.id === updatedAuction.id ? updatedAuction : auction
    );

    setAuctions(updatedAuctions);

    // Close the modal
    setIsEditModalOpen(false);

    // Show success message
    toast.success('Auction updated successfully', {
      description: 'Your changes have been saved.',
      duration: 3000,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Auctions</h1>
      <div className="bg-white p-8 rounded-md border border-gray-200">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">This page is under development.</p>
          <Link href="/dashboard" className="text-[#FF8A00] hover:text-[#e67e00]">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
