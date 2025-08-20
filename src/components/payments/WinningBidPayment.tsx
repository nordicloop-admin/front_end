"use client";

import React, { useState, useEffect } from 'react';
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
        return <Trophy className="w-6 h-6 text-[#FF8A00]" />;
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
        return 'text-[#FF8A00] bg-orange-50 border-orange-200';
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
                ? '✅ Payment Completed'
                : '🏆 Winning Bid - Payment Required'}
            </h3>
            <p className="text-sm mt-1">{getStatusMessage()}</p>
          </div>
        </div>
      </div>

      {/* Bid Details */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Auction Info */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Auction Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Material:</span>
                <span className="font-medium">{winningBid.ad_title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span>{winningBid.ad_category || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seller:</span>
                <span>{winningBid.ad_user_email || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span>{winningBid.ad_location || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* Bid Info */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Your Winning Bid</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Bid Amount:</span>
                <span className="font-medium">
                  {winningBid.bid_price_per_unit} {winningBid.currency || 'SEK'}/{winningBid.unit || 'unit'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Volume:</span>
                <span>{winningBid.volume_requested} {winningBid.unit || 'units'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Value:</span>
                <span className="font-bold text-lg">
                  {winningBid.total_bid_value} {winningBid.currency || 'SEK'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bid Date:</span>
                <span>{new Date(winningBid.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section - Enhanced for Better Visibility */}
        {paymentStatus === 'pending' && !showPaymentProcessor && winningBid.status !== 'paid' && (
          <div className="border-t border-gray-200 pt-6">
            {/* Prominent Payment Call-to-Action */}
            <div className="bg-gradient-to-r from-[#FF8A00] to-[#FF9500] rounded-xl p-8 text-center text-white mb-6 shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 rounded-full p-3">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">🎉 Congratulations! You Won!</h3>
              <p className="text-white/90 mb-6 text-lg">
                Complete your payment now to secure this winning bid
              </p>
              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <div className="text-3xl font-bold mb-1">
                  {winningBid.total_bid_value} {winningBid.currency || 'SEK'}
                </div>
                <div className="text-white/80 text-sm">
                  Total Amount Due
                </div>
              </div>
              <button
                onClick={handleStartPayment}
                className="inline-flex items-center px-8 py-4 bg-white text-[#FF8A00] font-bold text-lg rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <CreditCard className="w-6 h-6 mr-3" />
                Pay Now - Secure Payment
                <ArrowRight className="w-6 h-6 ml-3" />
              </button>
              <p className="text-white/70 text-sm mt-4">
                🔒 Secure payment powered by Stripe • Money-back guarantee
              </p>
            </div>

            {/* Payment Details */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Payment Information</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Payment is processed securely through Stripe</li>
                    <li>• Funds are held until delivery is confirmed</li>
                    <li>• You have 48 hours to complete payment</li>
                    <li>• The seller will be notified once payment is received</li>
                  </ul>
                </div>
              </div>
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
          <div className="bg-green-50 rounded-lg p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-green-900 mb-2">Payment Successful!</h3>
            <p className="text-green-800 mb-4">
              Your payment has been processed successfully. The seller has been notified and will 
              receive their payout according to our payment schedule.
            </p>
            <div className="bg-white rounded-md p-4 text-left">
              <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• The seller will be notified of your payment</li>
                <li>• You'll receive a payment confirmation email</li>
                <li>• The seller will coordinate delivery/pickup with you</li>
                <li>• Seller payout will be processed according to schedule</li>
              </ul>
            </div>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="bg-red-50 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">Payment Failed</h3>
            <p className="text-red-800 mb-4">
              We couldn't process your payment. Please check your payment method and try again.
            </p>
            <button
              onClick={() => {
                setPaymentStatus('pending');
                setShowPaymentProcessor(false);
              }}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Important Notice */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Important Information</p>
              <ul className="space-y-1">
                <li>• Payment is required within 48 hours of winning the auction</li>
                <li>• Commission rates are based on your subscription plan</li>
                <li>• All payments are processed securely through Stripe</li>
                <li>• Contact support if you experience any issues</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
