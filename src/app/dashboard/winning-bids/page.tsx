"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Trophy, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { getUserWinningBids, BidItem } from '@/services/bid';
import WinningBidPayment from '@/components/payments/WinningBidPayment';
import { PaymentIntent } from '@/services/payments';

export default function WinningBidsPage() {
  const [winningBids, setWinningBids] = useState<BidItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWinningBids();
  }, []);

  const loadWinningBids = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getUserWinningBids();
      if (response.error) {
        setError(response.error);
      } else {
        // Filter for only 'won' status bids
        const wonBids = response.data?.filter(bid => bid.status === 'won') || [];
        setWinningBids(wonBids);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load winning bids';
      setError(errorMessage);
      toast.error('Failed to load winning bids', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentComplete = (paymentIntent: PaymentIntent) => {
    toast.success('Payment completed successfully!', {
      description: 'The seller has been notified and will coordinate delivery with you.'
    });
    // Optionally refresh the data or update the specific bid status
    loadWinningBids();
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-100 rounded-md p-8 flex justify-center items-center">
          <Loader2 size={24} className="animate-spin text-[#FF8A00] mr-2" />
          <p className="text-gray-700">Loading your winning bids...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white border border-red-100 rounded-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-lg font-medium text-red-900 mb-2">Error Loading Winning Bids</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadWinningBids}
            className="px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Trophy className="w-6 h-6 text-[#FF8A00] mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Winning Bids</h1>
            <p className="text-gray-600">Complete payments for your winning auction bids</p>
          </div>
        </div>
        <button
          onClick={loadWinningBids}
          className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </button>
      </div>

      {/* Summary Stats */}
      {winningBids.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <Trophy className="w-5 h-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Total Winning Bids</p>
                <p className="text-lg font-bold text-gray-900">{winningBids.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-lg font-bold text-gray-900">
                  {winningBids.reduce((sum, bid) => {
                    const total = parseFloat(bid.bid_price_per_unit) * parseFloat(bid.volume_requested);
                    return sum + total;
                  }, 0).toFixed(2)} SEK
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Bid Value</p>
                <p className="text-lg font-bold text-gray-900">
                  {winningBids.length > 0 ? (
                    winningBids.reduce((sum, bid) => {
                      const total = parseFloat(bid.bid_price_per_unit) * parseFloat(bid.volume_requested);
                      return sum + total;
                    }, 0) / winningBids.length
                  ).toFixed(2) : '0.00'} SEK
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Winning Bids List */}
      {winningBids.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-md p-8 text-center">
          <div className="flex flex-col items-center">
            <Trophy size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Winning Bids Yet</h3>
            <p className="text-gray-500 mb-6">
              You haven't won any auctions yet. Keep bidding to win great deals on materials!
            </p>
            <a
              href="/dashboard/auctions"
              className="px-6 py-2 bg-[#FF8A00] text-white rounded-md hover:bg-[#e67c00] transition-colors"
            >
              Browse Auctions
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {winningBids.map((bid) => (
            <WinningBidPayment
              key={bid.id}
              winningBid={bid}
              onPaymentComplete={handlePaymentComplete}
              className="w-full"
            />
          ))}
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <h3 className="font-medium mb-2">Need Help?</h3>
            <ul className="space-y-1">
              <li>• Payment is required within 48 hours of winning an auction</li>
              <li>• All payments are processed securely through Stripe</li>
              <li>• Commission rates depend on your subscription plan</li>
              <li>• Contact support if you experience any payment issues</li>
              <li>• Sellers will coordinate delivery/pickup after payment confirmation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
