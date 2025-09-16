"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, AlertCircle, ToggleLeft, ToggleRight, Info } from 'lucide-react';
import Modal from '@/components/ui/modal';
import PaymentMethodSelector from '@/components/payments/PaymentMethodSelector';

interface PlaceBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    bidAmount: string;
    bidVolume?: string;
    volumeType?: 'partial' | 'full';
    notes?: string;
    maxAutoBidPrice?: string;
    paymentMethodId: string;
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
    currency?: string; // Add currency field
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
  const [bidAmountInputError, setBidAmountInputError] = useState('');
  const [volumeInputError, setVolumeInputError] = useState('');
  const [maxAutoBidInputError, setMaxAutoBidInputError] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [paymentMethodError, setPaymentMethodError] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Validate that input is a positive integer
  const validateIntegerInput = useCallback((value: string, fieldName: string): { isValid: boolean; error: string } => {
    if (value === '') {
      return { isValid: true, error: '' };
    }
    
    // Check if contains only digits
    if (!/^\d+$/.test(value)) {
      return { isValid: false, error: `${fieldName} must contain only numbers (no decimals, letters, or special characters)` };
    }
    
    const numValue = parseInt(value, 10);
    if (numValue <= 0) {
      return { isValid: false, error: `${fieldName} must be greater than 0` };
    }
    
    return { isValid: true, error: '' };
  }, []);

  // Format price string to number (handles both formatted and plain numbers)
  const formatPrice = useCallback((price: string): number => {
    return Number(price.replace(/,/g, ''));
  }, []);

  // Calculate minimum bid - use highest bid if available, otherwise use base price as minimum
  const calculateMinimumBid = useCallback((): number => {
    // Enhanced price parsing function
    const parsePrice = (priceValue: any): number => {
      if (typeof priceValue === 'number') {
        return isNaN(priceValue) ? 0 : priceValue;
      }
      
      if (typeof priceValue === 'string') {
        // Remove all non-digit characters except decimal points and commas
        let cleanedValue = priceValue.replace(/[^\d.,]/g, '');
        
        // Handle Swedish number format (1 000,50) and international format (1,000.50)
        if (cleanedValue.includes(',') && cleanedValue.includes('.')) {
          // Assume format is 1,000.50 (comma as thousands separator)
          cleanedValue = cleanedValue.replace(/,/g, '');
        } else if (cleanedValue.includes(',') && !cleanedValue.includes('.')) {
          // Could be 1000,50 (comma as decimal) or 1,000 (comma as thousands)
          const commaIndex = cleanedValue.lastIndexOf(',');
          const afterComma = cleanedValue.substring(commaIndex + 1);
          
          // If only 1-2 digits after comma, it's likely decimal
          if (afterComma.length <= 2) {
            cleanedValue = cleanedValue.replace(',', '.');
          } else {
            cleanedValue = cleanedValue.replace(/,/g, '');
          }
        }
        
        const parsed = parseFloat(cleanedValue);
        return isNaN(parsed) ? 0 : parsed;
      }
      
      return 0;
    };

    // Check if there's a highest bid in the auction data
    if (auction.highestBid) {
      const highestBidAmount = parsePrice(auction.highestBid);
      if (highestBidAmount > 0) {
        // 5% higher than current highest bid
        return Math.ceil(highestBidAmount * 1.05);
      }
    }

    // If no highest bid, use base price as the minimum (no markup)
    const basePrice = parsePrice(auction.basePrice);
    if (basePrice > 0) {
      return basePrice;
    }

    // Fallback minimum
    return 50;
  }, [auction.highestBid, auction.basePrice]);

  // Extract volume value from auction.volume (e.g., "100 kg" -> "100")
  const extractVolumeValue = useCallback((volumeString: string): string => {
    const match = volumeString.match(/^(\d+)/); // Changed to only match integers
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
      // Reset all form states first
      setVolumeType('partial');
      setNotes('');
      setMaxAutoBidPrice('');
      setIsAutoBidEnabled(false);
      setError('');
      setVolumeError('');
      setAutoBidError('');
      setBidAmountInputError('');
      setVolumeInputError('');
      setMaxAutoBidInputError('');
      setPaymentMethodId('');
      setPaymentMethodError('');
      setIsProcessingPayment(false);

      // Extract volume from auction.volume (e.g., "100 kg" -> "100")
      const volumeValue = extractVolumeValue(auction.volume);
      setBidVolume(volumeValue);

      // Set bid amount using auction data only
      if (initialBidAmount) {
        // Use the raw number without comma formatting
        setBidAmount(Math.floor(parseFloat(initialBidAmount)).toString());
      } else {
        const minBid = calculateMinimumBid();
        setBidAmount(minBid.toString());
      }
    }
  }, [isOpen, auction, calculateMinimumBid, extractVolumeValue, initialBidAmount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    // Validate bid amount
    const minBid = calculateMinimumBid();
    const currentBid = formatPrice(bidAmount);

    if (currentBid < minBid) {
      setError(`Bid must be at least ${minBid}`);
      hasError = true;
    } else if (currentBid <= 0) {
      setError('Bid amount must be greater than 0');
      hasError = true;
    }

    // Validate bid volume
    if (bidVolume) {
      const volumeValidation = validateIntegerInput(bidVolume, 'Volume');
      if (!volumeValidation.isValid) {
        setVolumeError(volumeValidation.error);
        hasError = true;
      } else {
        const volumeValue = parseInt(bidVolume, 10);
        const maxVolume = parseInt(extractVolumeValue(auction.volume), 10);
        const volumeUnit = extractVolumeUnit(auction.volume);

        if (volumeValue > maxVolume) {
          setVolumeError(`Volume cannot exceed ${maxVolume} ${volumeUnit}`);
          hasError = true;
        }
      }
    }

    // Validate auto-bid price if enabled
    if (isAutoBidEnabled && maxAutoBidPrice && !maxAutoBidInputError) {
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

    // Validate payment method
    if (!paymentMethodId) {
      setPaymentMethodError('Payment method is required to place a bid');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setIsProcessingPayment(true);

    // Submit the bid with all the data
    onSubmit({
      bidAmount,
      bidVolume: bidVolume || undefined,
      volumeType,
      notes: notes.trim() || undefined,
      maxAutoBidPrice: isAutoBidEnabled ? maxAutoBidPrice : undefined,
      paymentMethodId,
    });
    
    // Reset processing state when complete
    setIsProcessingPayment(false);
  };

  if (!isOpen) return null;

  const minBid = calculateMinimumBid().toString();
  
  // Determine current price to display using auction data only
  const getCurrentPriceDisplay = (): { price: string; label: string; isLoading: boolean } => {
    // If there's a highest bid, show it
    if (auction.highestBid && auction.highestBid !== '0' && auction.highestBid !== '0.000') {
      return { 
        price: auction.highestBid, // Use as-is since it already includes currency 
        label: 'Current highest bid', 
        isLoading: false 
      };
    } else {
      // Show base price if no highest bid
      const basePrice = auction.basePrice || '0';
      return { 
        price: basePrice, // Use as-is since it already includes currency
        label: 'Base price', 
        isLoading: false 
      };
    }
  };
  
  const currentPriceInfo = getCurrentPriceDisplay();
  const volumeUnit = extractVolumeUnit(auction.volume);
  const maxVolume = extractVolumeValue(auction.volume);
  
  // Check if form has validation errors
  const hasValidationErrors = !!(
    bidAmountInputError || 
    volumeInputError || 
    maxAutoBidInputError ||
    (isAutoBidEnabled && !maxAutoBidPrice) ||
    !bidAmount ||
    !bidVolume ||
    !paymentMethodId
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Place a Bid"
      maxWidth="lg"
    >

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
                {currentPriceInfo.label}
              </div>
              <div className={`text-base font-medium ${currentPriceInfo.isLoading ? 'text-gray-400' : ''}`}>
                {currentPriceInfo.price}
              </div>
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
                  // Only allow digits (no decimals, commas, or other characters)
                  const value = e.target.value.replace(/[^\d]/g, '');
                  
                  // Validate the input
                  const validation = validateIntegerInput(value, 'Bid amount');
                  
                  setBidAmount(value);
                  setError('');
                  setBidAmountInputError(validation.error);
                }}
                className={`w-full px-3 py-2 border ${error || bidAmountInputError ? 'border-red-300' : 'border-gray-100'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm`}
                required
              />
              {(error || bidAmountInputError) && (
                <div className="mt-1 text-xs text-red-500 flex items-start">
                  <AlertCircle size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                  <div className="whitespace-pre-line">{error || bidAmountInputError}</div>
                </div>
              )}
              <div className="mt-1 text-xs text-gray-500">
                Minimum bid: {minBid} {auction.currency || 'SEK'} (price per unit)
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
                  // Only allow digits (no decimals)
                  const value = e.target.value.replace(/[^\d]/g, '');
                  
                  // Validate the input
                  const validation = validateIntegerInput(value, 'Volume');
                  
                  setBidVolume(value);
                  setVolumeError('');
                  setVolumeInputError(validation.error);
                }}
                placeholder={`Enter volume in ${volumeUnit}`}
                className={`w-full px-3 py-2 border ${volumeError || volumeInputError ? 'border-red-300' : 'border-gray-100'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm`}
                disabled={volumeType === 'full'}
              />
              {(volumeError || volumeInputError) && (
                <div className="mt-1 text-xs text-red-500 flex items-start">
                  <AlertCircle size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                  <div className="whitespace-pre-line">{volumeError || volumeInputError}</div>
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
                      // Only allow digits (no decimals, commas, or other characters)
                      const value = e.target.value.replace(/[^\d]/g, '');
                      
                      // Validate the input
                      const validation = validateIntegerInput(value, 'Maximum auto-bid price');
                      
                      setMaxAutoBidPrice(value);
                      setAutoBidError('');
                      setMaxAutoBidInputError(validation.error);
                    }}
                    placeholder="Enter maximum price"
                    className={`w-full px-3 py-2 border ${autoBidError || maxAutoBidInputError ? 'border-red-300' : 'border-gray-100'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF8A00] text-sm`}
                  />
                  {(autoBidError || maxAutoBidInputError) && (
                    <div className="mt-1 text-xs text-red-500 flex items-start">
                      <AlertCircle size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                      <div className="whitespace-pre-line">{autoBidError || maxAutoBidInputError}</div>
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

            {/* Payment Method Section */}
            <div className="mb-6">
              <PaymentMethodSelector
                onPaymentMethodReady={(paymentMethodId) => {
                  setPaymentMethodId(paymentMethodId);
                  setPaymentMethodError('');
                }}
                onError={(error) => {
                  setPaymentMethodError(error);
                  setPaymentMethodId('');
                }}
                isProcessing={isProcessingPayment}
                className="mb-4"
              />
              {paymentMethodError && (
                <div className="mt-2 text-sm text-red-600 flex items-start">
                  <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>{paymentMethodError}</span>
                </div>
              )}
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
                disabled={hasValidationErrors || isProcessingPayment}
                className={`px-4 py-2 rounded-md text-sm flex items-center transition-colors ${
                  hasValidationErrors || isProcessingPayment
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#FF8A00] text-white hover:bg-[#e67e00]'
                }`}
              >
                {isProcessingPayment ? 'Processing...' : 'Place Bid'}
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
    </Modal>
  );
}
