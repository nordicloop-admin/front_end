"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getRecentAuctions, AuctionItem } from '@/services/auction';
import { getFullImageUrl } from '@/utils/imageUtils';
import { getCategoryImage } from '@/utils/categoryImages';
import { formatTimeRemaining } from '@/utils/timeUtils';

interface HomeAuctionCardProps {
  auction: AuctionItem;
}

const HomeAuctionCard: React.FC<HomeAuctionCardProps> = ({ auction }) => {
  const timeLeft = formatTimeRemaining(auction.time_remaining || null);
  const imageSrc = auction.material_image ? getFullImageUrl(auction.material_image) : getCategoryImage(auction.category_name);
  const unit = auction.unit_of_measurement || '';

  // Highest bid overrides base price display if present
  const basePriceNum = auction.base_price ?? (auction.starting_bid_price ? parseFloat(auction.starting_bid_price) : null);
  const highestBidNum = auction.highest_bid_price ?? null;
  const displayPrice = highestBidNum !== null ? highestBidNum : basePriceNum;
  const currency = auction.currency || 'EUR';

  const priceDisplay = displayPrice !== null ? `${displayPrice.toLocaleString('sv-SE')} ${currency}` : '—';

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer" onClick={() => window.location.href = `/dashboard/auctions/${auction.id}`}>      <div className="relative h-40 w-full">
        <Image
          src={imageSrc}
          alt={auction.title || auction.category_name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover"
        />
        <div className="absolute top-2 left-2 bg-white/85 px-2 py-1 rounded text-xs font-medium">{auction.category_name}</div>
        {timeLeft && (
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">{timeLeft} left</div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-10">{auction.title || `${auction.category_name} - ${auction.subcategory_name}`}</h3>
        <div className="mt-1 flex justify-between text-[11px] text-gray-500">
          <span>{auction.location_summary || 'Unknown origin'}</span>
          <span>{auction.available_quantity ? `${auction.available_quantity} ${unit}` : 'N/A'}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] text-gray-500">{highestBidNum !== null ? 'Highest Bid' : 'Base Price'}</span>
          <span className="text-sm font-semibold text-[#FF8A00]" title={priceDisplay}>{priceDisplay}</span>
        </div>
      </div>
    </div>
  );
};

const HomeRecentAuctionsSection: React.FC = () => {
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecent = async () => {
      setLoading(true);
      setError(null);
      const response = await getRecentAuctions();
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setAuctions(response.data);
      }
      setLoading(false);
    };
    fetchRecent();
    // Determine mobile viewport
    const checkMobile = () => setIsMobile(window.innerWidth < 640); // Tailwind sm breakpoint
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="py-10">
      <div className="mx-7 md:max-w-[86%] md:mx-auto">
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1E2A36]">Recently Added Auctions<span className="text-[#FF8A00]">.</span></h2>
          <Link href="/market-place" className="text-sm font-medium text-[#FF8A00] hover:underline">View More →</Link>
        </div>
        {loading && (
          <div className="bg-white border border-gray-200 rounded-md p-6 text-center text-sm text-gray-600">Loading recent auctions...</div>
        )}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center text-sm text-red-600">Failed to load recent auctions: {error}</div>
        )}
        {!loading && !error && auctions.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-md p-6 text-center text-sm text-gray-600">No recent auctions available.</div>
        )}
        {!loading && !error && auctions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(isMobile ? auctions.slice(0, 8) : auctions).map(a => <HomeAuctionCard key={a.id} auction={a} />)}
          </div>
        )}
        <div className="mt-8 flex justify-center">
          <Link href="/market-place" className="bg-[#FF8A00] text-white px-8 py-3 rounded-md hover:bg-[#e67e00] transition-colors text-sm font-medium">View Marketplace</Link>
        </div>
      </div>
      </div>
    </section>
  );
};

export default HomeRecentAuctionsSection;
