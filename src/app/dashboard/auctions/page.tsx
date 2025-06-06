"use client";

import React from 'react';
import Link from 'next/link';

export default function Auctions() {
  const [selectedCategory, setSelectedCategory] = useState('All materials');
  const [searchTerm, setSearchTerm] = useState('');
  const { selectedAuction, isModalOpen, openBidModal, closeBidModal, submitBid } = useBidding();

  // State for API auctions
  const [apiAuctions, setApiAuctions] = useState<AuctionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch auctions from API
  useEffect(() => {
    const fetchAuctions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getAuctions();

        if (response.error) {
          // Error handling for auction fetch failures

          // Check if it's an authentication error
          if (response.status === 401) {
            setError('Authentication required. Please log in to view auctions.');
          } else {
            setError(response.error);
          }
        } else if (response.data) {
          // Successfully fetched auctions
          setApiAuctions(response.data);
        } else {
          // No auction data available
          setError('No auctions found');
        }
      } catch (err) {
        // Handle unexpected errors
        setError(err instanceof Error ? err.message : 'Failed to fetch auctions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuctions();
  }, []);

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

  // Convert API auctions to the format expected by the UI
  const convertedAuctions = apiAuctions.map(auction => ({
    id: auction.id.toString(),
    name: auction.title || `${auction.category_name} - ${auction.subcategory_name}`,
    category: auction.category_name,
    basePrice: auction.starting_bid_price || auction.total_starting_value,
    highestBid: null, // API doesn't provide highest bid yet
    timeLeft: 'Available', // API doesn't provide end date/time in this format
    volume: auction.available_quantity ? `${auction.available_quantity} ${auction.unit_of_measurement}` : 'N/A',
    seller: 'Unknown', // API doesn't provide seller info yet
    countryOfOrigin: auction.location_summary || 'Unknown',
    image: auction.material_image || '/images/marketplace/categories/plastics.jpg' // Fallback image
  }));

  // Use API auctions if available, otherwise fall back to mock data
  const auctionsToDisplay = apiAuctions.length > 0 ? convertedAuctions : marketplaceAuctions;

  // Filter auctions based on search term and category
  const filteredAuctions = auctionsToDisplay.filter(auction => {
    const matchesSearch = searchTerm === '' ||
      auction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (auction.seller && auction.seller.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (auction.category && auction.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'All materials' ||
      (auction.category && auction.category === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Auctions</h1>
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
