"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { X, ArrowRight, AlertCircle } from 'lucide-react';

interface PlaceBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bidAmount: string, bidVolume?: string) => void;
  auction: {
    id: string;
    name: string;
    category: string;
    basePrice: string;
    highestBid: string | null;
    timeLeft: string;
    volume: string;
    countryOfOrigin: string;
  };
}

export default function PlaceBidModal({ isOpen, onClose, onSubmit, auction }: PlaceBidModalProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [bidVolume, setBidVolume] = useState('');
  const [error, setError] = useState('');
  const [volumeError, setVolumeError] = useState('');

  // Format price string to number (remove commas)
  const formatPrice = useCallback((price: string): number => {
    return Number(price.replace(/,/g, ''));
  }, []);

  // Calculate minimum bid (5% higher than current highest bid or base price)
  const calculateMinimumBid = useCallback((): number => {
    const currentPrice = auction.highestBid
      ? formatPrice(auction.highestBid)
      : formatPrice(auction.basePrice);
    return Math.ceil(currentPrice * 1.05);
  }, [auction, formatPrice]);

  // Format number to price string with commas
  const formatNumberToPrice = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Extract volume value from auction.volume (e.g., "100 kg" -> "100")
  const extractVolumeValue = useCallback((volumeString: string): string => {
    const match = volumeString.match(/^(\d+(\.\d+)?)/);
    return match ? match[1] : '';
  }, []);

  // Set initial bid amount and volume when modal opens
  useEffect(() => {
    if (isOpen) {
      const minBid = calculateMinimumBid();
      setBidAmount(formatNumberToPrice(minBid));

      // Extract volume from auction.volume (e.g., "100 kg" -> "100")
      const volumeValue = extractVolumeValue(auction.volume);
      setBidVolume(volumeValue);

      setError('');
      setVolumeError('');
    }
  }, [isOpen, auction, calculateMinimumBid, extractVolumeValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    // Validate bid amount
    const minBid = calculateMinimumBid();
    const currentBid = formatPrice(bidAmount);

    if (currentBid < minBid) {
      setError(`Bid must be at least ${formatNumberToPrice(minBid)}`);
      hasError = true;
    }

    // Validate bid volume
    if (bidVolume) {
      const volumeValue = parseFloat(bidVolume);
      const maxVolume = parseFloat(extractVolumeValue(auction.volume));

      if (isNaN(volumeValue) || volumeValue <= 0) {
        setVolumeError('Volume must be a positive number');
        hasError = true;
      } else if (volumeValue > maxVolume) {
        setVolumeError(`Volume cannot exceed ${maxVolume}`);
        hasError = true;
      }
    }

    if (hasError) {
      return;
    }

    onSubmit(bidAmount, bidVolume);
  };

  if (!isOpen) return null;

  const minBid = formatNumberToPrice(calculateMinimumBid());
  const currentPrice = auction.highestBid || auction.basePrice;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-md max-w-md w-full">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-lg font-medium">Place a Bid</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-4">
            <h3 className="font-medium text-gray-900">{auction.name}</h3>
            <div className="text-sm text-gray-500 mt-1">
              {auction.category} • {auction.volume} • {auction.countryOfOrigin}
            </div>
          </div>

          <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-md">
            <div>
              <div className="text-xs text-gray-500">
                {auction.highestBid ? 'Current highest bid' : 'Base price'}
              </div>
              <div className="text-base font-medium">{currentPrice}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Time left</div>
              <div className="text-base font-medium">{auction.timeLeft}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Bid (SEK)
                </label>
                <input
                  type="text"
                  id="bidAmount"
                  value={bidAmount}
                  onChange={(e) => {
                    // Only allow numbers and commas
                    const value = e.target.value.replace(/[^\d,]/g, '');
                    setBidAmount(value);
                    setError('');
                  }}
                  className={`w-full px-3 py-2 border ${error ? 'border-red-300' : 'border-gray-100'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm`}
                  required
                />
                {error && (
                  <div className="mt-1 text-xs text-red-500 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {error}
                  </div>
                )}
                <div className="mt-1 text-xs text-gray-500">
                  Minimum bid: {minBid}
                </div>
              </div>

              <div>
                <label htmlFor="bidVolume" className="block text-sm font-medium text-gray-700 mb-1">
                  Volume (in {auction.volume.split(' ')[1] || 'units'})
                </label>
                <input
                  type="text"
                  id="bidVolume"
                  value={bidVolume}
                  onChange={(e) => {
                    // Only allow numbers and decimal point
                    const value = e.target.value.replace(/[^\d.]/g, '');
                    setBidVolume(value);
                    setVolumeError('');
                  }}
                  className={`w-full px-3 py-2 border ${volumeError ? 'border-red-300' : 'border-gray-100'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm`}
                />
                {volumeError && (
                  <div className="mt-1 text-xs text-red-500 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {volumeError}
                  </div>
                )}
                <div className="mt-1 text-xs text-gray-500">
                  Maximum volume: {extractVolumeValue(auction.volume)} {auction.volume.split(' ')[1] || 'units'}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-[#FF8A00] text-white rounded-md text-sm hover:bg-[#e67e00] transition-colors flex items-center"
              >
                Place Bid
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </form>

          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle size={16} className="text-blue-500" />
              </div>
              <div className="ml-3">
                <div className="text-xs text-blue-700">
                  By placing a bid, you agree to the terms and conditions of Nordic Loop&apos;s auction system. Your bid is binding and cannot be withdrawn.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
