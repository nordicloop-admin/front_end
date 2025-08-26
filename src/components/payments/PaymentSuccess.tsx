"use client";

import React from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowRight, CreditCard, FileText, MessageCircle } from 'lucide-react';
import { PaymentIntent } from '@/services/payments';
import { BidItem } from '@/services/bid';

interface PaymentSuccessProps {
  paymentIntent: PaymentIntent;
  winningBid: BidItem;
  className?: string;
}

export default function PaymentSuccess({ 
  paymentIntent, 
  winningBid, 
  className = '' 
}: PaymentSuccessProps) {
  const totalAmount = parseFloat(paymentIntent.total_amount);
  const commissionAmount = parseFloat(paymentIntent.commission_amount);
  const sellerAmount = parseFloat(paymentIntent.seller_amount);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Success Header */}
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600">
          Your payment has been processed successfully. The seller has been notified.
        </p>
      </div>

      {/* Payment Details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Payment Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Auction:</span>
            <span className="font-medium">{winningBid.ad_title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Volume:</span>
            <span>{winningBid.volume_requested} {winningBid.unit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Price per unit:</span>
            <span>{winningBid.bid_price_per_unit} {winningBid.currency}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>{totalAmount.toFixed(2)} {paymentIntent.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platform fee:</span>
              <span>{commissionAmount.toFixed(2)} {paymentIntent.currency}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total paid:</span>
              <span>{totalAmount.toFixed(2)} {paymentIntent.currency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Information */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Seller Information</h3>
        <p className="text-sm text-gray-700 mb-2">
          <strong>Seller:</strong> {paymentIntent.seller_company_name || paymentIntent.seller_email}
        </p>
        <p className="text-sm text-gray-600">
          The seller will receive <strong>{sellerAmount.toFixed(2)} {paymentIntent.currency}</strong> 
          {' '}after platform fees and will coordinate delivery/pickup with you directly.
        </p>
      </div>

      {/* Next Steps */}
      <div className="bg-amber-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• You&apos;ll receive a payment confirmation email shortly</li>
          <li>• The seller has been notified of your payment</li>
          <li>• The seller will contact you to arrange delivery/pickup</li>
          <li>• You can view this transaction in your payment history</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/dashboard/payments"
          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-[#FF8A00] text-white font-medium rounded-md hover:bg-[#e67c00] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-2 transition-colors"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          View Payment History
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
        
        <Link
          href="/dashboard/my-bids"
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-2 transition-colors"
        >
          <FileText className="w-4 h-4 mr-2" />
          View All Bids
        </Link>
      </div>

      {/* Support Information */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-start">
          <MessageCircle className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">Need help?</p>
            <p>
              If you have any questions about your payment or need assistance with delivery coordination, 
              please contact our support team.
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Reference */}
      <div className="mt-4 p-3 bg-gray-100 rounded text-center">
        <p className="text-xs text-gray-500">
          Transaction ID: {paymentIntent.stripe_payment_intent_id}
        </p>
        <p className="text-xs text-gray-500">
          Payment processed on {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
