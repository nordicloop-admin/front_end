"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { X, ArrowRight, AlertCircle, ToggleLeft, ToggleRight, Info } from 'lucide-react';

interface PlaceBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    bidAmount: string;
    bidVolume?: string;
    volumeType?: 'partial' | 'full';
    notes?: string;
    maxAutoBidPrice?: string;
  }) => void;
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
  initialBidAmount?: string; // Optional initial bid amount to prefill
}

export default function PlaceBidModal({ isOpen, onClose, onSubmit, auction, initialBidAmount }: PlaceBidModalProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [bidVolume, setBidVolume] = useState('');
  const [volumeType, setVolumeType] = useState<'partial' | 'full'>('partial');
  const [notes, setNotes] = useState('');
  const [maxAutoBidPrice, setMaxAutoBidPrice] = useState('');
  const [isAutoBidEnabled, setIsAutoBidEnabled] = useState(false);
  const [error, setError] = useState('');
  const [volumeError, setVolumeError] = useState('');
  const [autoBidError, setAutoBidError] = useState('');

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

  // Extract unit from auction.volume (e.g., "100 kg" -> "kg")
  const extractVolumeUnit = useCallback((volumeString: string): string => {
    const parts = volumeString.split(' ');
    return parts.length > 1 ? parts[1] : 'units';
  }, []);

  // Set initial bid amount and volume when modal opens
  useEffect(() => {
    if (isOpen) {
      // Use initialBidAmount if provided, otherwise calculate minimum bid
      if (initialBidAmount) {
        // Format the initial bid amount with commas
        const formattedInitialBid = formatNumberToPrice(parseFloat(initialBidAmount));
        setBidAmount(formattedInitialBid);
      } else {
        const minBid = calculateMinimumBid();
        setBidAmount(formatNumberToPrice(minBid));
      }

      // Extract volume from auction.volume (e.g., "100 kg" -> "100")
      const volumeValue = extractVolumeValue(auction.volume);
      setBidVolume(volumeValue);

      // Reset all form states
      setVolumeType('partial');
      setNotes('');
      setMaxAutoBidPrice('');
      setIsAutoBidEnabled(false);
      setError('');
      setVolumeError('');
      setAutoBidError('');
    }
  }, [isOpen, auction, calculateMinimumBid, extractVolumeValue, initialBidAmount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    // Validate bid amount
    const minBid = calculateMinimumBid();
    const currentBid = formatPrice(bidAmount);

    if (currentBid < minBid) {
      setError(`Bid must be at least ${formatNumberToPrice(minBid)}`);
      hasError = true;
    } else if (currentBid <= 0) {
      setError('Bid amount must be greater than 0');
      hasError = true;
    }

    // Validate bid volume
    if (bidVolume) {
      const volumeValue = parseFloat(bidVolume);
      const maxVolume = parseFloat(extractVolumeValue(auction.volume));
      const volumeUnit = extractVolumeUnit(auction.volume);

      if (isNaN(volumeValue) || volumeValue <= 0) {
        setVolumeError('Volume must be a positive number');
        hasError = true;
      } else if (volumeValue > maxVolume) {
        setVolumeError(`Volume cannot exceed ${maxVolume} ${volumeUnit}`);
        hasError = true;
      }
    }

    // Validate auto-bid price if enabled
    if (isAutoBidEnabled && maxAutoBidPrice) {
      const autoBidPrice = formatPrice(maxAutoBidPrice);
      const currentBidPrice = formatPrice(bidAmount);

      if (autoBidPrice <= currentBidPrice) {
        setAutoBidError('Auto-bid maximum must be higher than your current bid');
        hasError = true;
      }
    } else if (isAutoBidEnabled && !maxAutoBidPrice) {
      setAutoBidError('Please enter a maximum auto-bid price');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Submit the bid with all the data
    onSubmit({
      bidAmount,
      bidVolume: bidVolume || undefined,
      volumeType,
      notes: notes.trim() || undefined,
      maxAutoBidPrice: isAutoBidEnabled ? maxAutoBidPrice : undefined,
    });
  };

  if (!isOpen) return null;

  const minBid = formatNumberToPrice(calculateMinimumBid());
  const currentPrice = auction.highestBid || auction.basePrice;
  const volumeUnit = extractVolumeUnit(auction.volume);
  const maxVolume = extractVolumeValue(auction.volume);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-md max-w-lg w-full max-h-[90vh] overflow-y-auto">
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

          <div className="flex justify-between items-center mb-6 p-3 bg-gray-50 rounded-md">
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
            {/* Bid Amount */}
            <div className="mb-4">
              <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Your Bid Amount
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
                <div className="mt-1 text-xs text-red-500 flex items-start">
                  <AlertCircle size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                  <div className="whitespace-pre-line">{error}</div>
                </div>
              )}
              <div className="mt-1 text-xs text-gray-500">
                Minimum bid: {minBid} (price per unit)
              </div>
            </div>

            {/* Volume Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Volume Requested
              </label>
              
              {/* Volume Type Toggle */}
              <div className="flex items-center space-x-4 mb-2">
                <button
                  type="button"
                  onClick={() => setVolumeType('partial')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    volumeType === 'partial'
                      ? 'bg-[#FF8A00] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Partial
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVolumeType('full');
                    setBidVolume(maxVolume);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    volumeType === 'full'
                      ? 'bg-[#FF8A00] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Full Volume
                </button>
              </div>

              {/* Volume Input */}
              <input
                type="text"
                value={bidVolume}
                onChange={(e) => {
                  // Only allow numbers and decimal point
                  const value = e.target.value.replace(/[^\d.]/g, '');
                  setBidVolume(value);
                  setVolumeError('');
                }}
                placeholder={`Enter volume in ${volumeUnit}`}
                className={`w-full px-3 py-2 border ${volumeError ? 'border-red-300' : 'border-gray-100'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm`}
                disabled={volumeType === 'full'}
              />
              {volumeError && (
                <div className="mt-1 text-xs text-red-500 flex items-start">
                  <AlertCircle size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                  <div className="whitespace-pre-line">{volumeError}</div>
                </div>
              )}
              <div className="mt-1 text-xs text-gray-500">
                Available: {maxVolume} {volumeUnit}
              </div>
            </div>

            {/* Auto-bidding Section */}
            <div className="mb-4 p-3 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <label htmlFor="autoBid" className="text-sm font-medium text-gray-700">
                    Auto-bidding
                  </label>
                  <div className="ml-2 group relative">
                    <Info size={14} className="text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      We&apos;ll bid for you automatically when outbid
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAutoBidEnabled(!isAutoBidEnabled);
                    if (!isAutoBidEnabled) {
                      setMaxAutoBidPrice('');
                      setAutoBidError('');
                    }
                  }}
                  className="flex items-center"
                >
                  {isAutoBidEnabled ? (
                    <ToggleRight size={20} className="text-[#FF8A00]" />
                  ) : (
                    <ToggleLeft size={20} className="text-gray-400" />
                  )}
                </button>
              </div>

              {isAutoBidEnabled && (
                <div>
                  <label htmlFor="maxAutoBidPrice" className="block text-xs text-gray-600 mb-1">
                    Maximum auto-bid price
                  </label>
                  <input
                    type="text"
                    id="maxAutoBidPrice"
                    value={maxAutoBidPrice}
                    onChange={(e) => {
                      // Only allow numbers and commas
                      const value = e.target.value.replace(/[^\d,]/g, '');
                      setMaxAutoBidPrice(value);
                      setAutoBidError('');
                    }}
                    placeholder="Enter maximum price"
                    className={`w-full px-3 py-2 border ${autoBidError ? 'border-red-300' : 'border-gray-100'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm`}
                  />
                  {autoBidError && (
                    <div className="mt-1 text-xs text-red-500 flex items-start">
                      <AlertCircle size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                      <div className="whitespace-pre-line">{autoBidError}</div>
                    </div>
                  )}
                  <div className="mt-1 text-xs text-gray-500">
                    We&apos;ll stop bidding when this price is reached
                  </div>
                </div>
              )}
            </div>

            {/* Notes Section */}
            <div className="mb-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about your bid..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm resize-none"
                maxLength={500}
              />
              <div className="mt-1 text-xs text-gray-500">
                {notes.length}/500 characters
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
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

          {/* Terms Notice */}
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle size={16} className="text-blue-500" />
              </div>
              <div className="ml-3">
                <div className="text-xs text-blue-700">
                  By placing a bid, you agree to the terms and conditions of Nordic Loop&apos;s auction system. 
                  Your bid is binding and subject to the auction rules.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
