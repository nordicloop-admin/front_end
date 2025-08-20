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

  // Auto-expand payment processor if autoExpand is true
  useEffect(() => {
    if (autoExpand && paymentStatus === 'pending') {
      setPaymentStatus('processing');
    }
  }, [autoExpand, paymentStatus]);

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
        return <Trophy className="w-6 h-6 text-yellow-600" />;
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
        return 'Congratulations! You won this auction. Complete your payment to finalize the purchase.';
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
        return 'text-yellow-800 bg-yellow-50 border-yellow-200';
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
              {paymentStatus === 'completed' ? 'Payment Completed' : 'Winning Bid - Payment Required'}
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
                <span>{winningBid.ad_category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seller:</span>
                <span>{winningBid.ad_user_email}</span>
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
                <span className="font-medium">{winningBid.bid_price_per_unit} SEK/unit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Volume:</span>
                <span>{winningBid.volume_requested} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Value:</span>
                <span className="font-bold text-lg">
                  {(parseFloat(winningBid.bid_price_per_unit) * parseFloat(winningBid.volume_requested)).toFixed(2)} SEK
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bid Date:</span>
                <span>{new Date(winningBid.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        {paymentStatus === 'pending' && !showPaymentProcessor && (
          <div className="text-center">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Complete Payment</h3>
              <p className="text-gray-600 mb-4">
                Click below to proceed with secure payment processing. Your payment will be held securely 
                until the transaction is complete.
              </p>
              <button
                onClick={handleStartPayment}
                className="inline-flex items-center px-6 py-3 bg-[#FF8A00] text-white font-medium rounded-md hover:bg-[#e67c00] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-2 transition-colors"
              >
                Proceed to Payment
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {showPaymentProcessor && paymentStatus !== 'completed' && (
          <PaymentProcessor
            bidId={winningBid.id}
            bidAmount={winningBid.bid_price_per_unit}
            bidVolume={winningBid.volume_requested}
            sellerEmail={winningBid.ad_user_email}
            winningBid={winningBid}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            className="mt-6"
          />
        )}

        {paymentStatus === 'completed' && (
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
