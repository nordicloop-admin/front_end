"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Trophy, CreditCard, AlertCircle, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { BidItem } from '@/services/bid';
import PaymentProcessor from './PaymentProcessor';
import { PaymentIntent } from '@/services/payments';

interface WinningBidPaymentProps {
  winningBid: BidItem;
  onPaymentComplete?: (paymentIntent: PaymentIntent) => void;
  className?: string;
  autoExpand?: boolean;
}

export default function WinningBidPayment({
  winningBid,
  onPaymentComplete,
  className = '',
  autoExpand = false
}: WinningBidPaymentProps) {
  const [showPaymentProcessor, setShowPaymentProcessor] = useState(autoExpand);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');

  const handleStartPayment = () => {
    setShowPaymentProcessor(true);
    setPaymentStatus('processing');
  };

  // Auto-expand payment processor if autoExpand is true and payment is needed
  useEffect(() => {
    if (autoExpand && paymentStatus === 'pending' && winningBid.status !== 'paid') {
      setPaymentStatus('processing');
    }
  }, [autoExpand, paymentStatus, winningBid.status]);

  // Set initial payment status based on bid status
  useEffect(() => {
    if (winningBid.status === 'paid') {
      setPaymentStatus('completed');
    }
  }, [winningBid.status]);

  const handlePaymentSuccess = (paymentIntent: PaymentIntent) => {
    setPaymentStatus('completed');
    toast.success('Payment completed successfully!', {
      description: 'Your payment has been processed and the seller will be notified.'
    });
    onPaymentComplete?.(paymentIntent);
  };

  const handlePaymentError = (error: string) => {
    setPaymentStatus('failed');
    toast.error('Payment failed', {
      description: error
    });
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'processing':
        return <Clock className="w-6 h-6 text-blue-600" />;
      case 'failed':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Trophy className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'completed':
        return 'Payment completed! The seller will receive their payout according to schedule.';
      case 'processing':
        return 'Processing your payment...';
      case 'failed':
        return 'Payment failed. Please try again or contact support.';
      default:
        return winningBid.status === 'paid'
          ? 'Payment completed! The seller has been notified and will coordinate delivery.'
          : 'Congratulations! You won this auction. Complete your payment to finalize the purchase.';
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'completed':
        return 'text-green-800 bg-green-50 border-green-200';
      case 'processing':
        return 'text-blue-800 bg-blue-50 border-blue-200';
      case 'failed':
        return 'text-red-800 bg-red-50 border-red-200';
      default:
        return 'text-gray-800 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className={`p-4 border-b ${getStatusColor()}`}>
        <div className="flex items-center">
          {getStatusIcon()}
          <div className="ml-3">
            <h3 className="font-semibold">
              {paymentStatus === 'completed' || winningBid.status === 'paid'
                ? 'Payment Completed'
                : 'Payment Required'}
            </h3>
            <p className="text-sm mt-1">{getStatusMessage()}</p>
          </div>
        </div>
      </div>

      {/* Compact Bid Details */}
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          {/* Left: Auction Info */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{winningBid.ad_title}</h3>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>{winningBid.ad_category || 'Category not specified'}</span>
              <span>•</span>
              <span>{winningBid.ad_location || 'Location not specified'}</span>
            </div>
          </div>

          {/* Right: Bid Summary */}
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              {winningBid.total_bid_value} {winningBid.currency || 'SEK'}
            </div>
            <div className="text-sm text-gray-600">
              {winningBid.bid_price_per_unit} {winningBid.currency || 'SEK'}/{winningBid.unit || 'unit'} × {winningBid.volume_requested} {winningBid.unit || 'units'}
            </div>
          </div>
        </div>

        {/* Compact Payment Section */}
        {paymentStatus === 'pending' && !showPaymentProcessor && winningBid.status !== 'paid' && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="bg-gray-600 rounded-full p-2 mr-3">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Payment Required</h4>
                  <p className="text-sm text-gray-600">Complete payment within 48 hours</p>
                </div>
              </div>
              <button
                onClick={handleStartPayment}
                className="inline-flex items-center px-6 py-2 bg-[#FF8A00] text-white font-medium rounded-lg hover:bg-[#e67c00] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-2 transition-colors"
              >
                Pay Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {showPaymentProcessor && paymentStatus !== 'completed' && winningBid.status !== 'paid' && (
          <PaymentProcessor
            bidId={winningBid.id}
            bidAmount={winningBid.bid_price_per_unit}
            bidVolume={winningBid.volume_requested}
            sellerEmail={winningBid.ad_user_email || ''}
            winningBid={winningBid}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            className="mt-6"
          />
        )}

        {(paymentStatus === 'completed' || winningBid.status === 'paid') && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-900">Payment Completed</h4>
                <p className="text-sm text-green-800">The seller has been notified and will coordinate delivery.</p>
              </div>
              <Link
                href="/dashboard/payments"
                className="inline-flex items-center px-4 py-2 text-sm bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
              >
                View History
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <div>
                  <h4 className="font-semibold text-red-900">Payment Failed</h4>
                  <p className="text-sm text-red-800">Please check your payment method and try again.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPaymentStatus('pending');
                  setShowPaymentProcessor(false);
                }}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
