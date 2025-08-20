"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CreditCard, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { createPaymentIntent, PaymentIntent, formatCurrency, getCommissionRate } from '@/services/payments';
import { getUserSubscription } from '@/services/userSubscription';
import PaymentSuccess from './PaymentSuccess';
import { BidItem } from '@/services/bid';

interface PaymentProcessorProps {
  bidId: number;
  bidAmount: string;
  bidVolume: string;
  sellerEmail: string;
  winningBid?: BidItem;
  onPaymentSuccess?: (paymentIntent: PaymentIntent) => void;
  onPaymentError?: (error: string) => void;
  className?: string;
}

export default function PaymentProcessor({
  bidId,
  bidAmount,
  bidVolume,
  sellerEmail,
  winningBid,
  onPaymentSuccess,
  onPaymentError,
  className = ''
}: PaymentProcessorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  useEffect(() => {
    loadUserSubscription();
    loadStripe();
  }, []);

  const loadUserSubscription = async () => {
    try {
      const subscription = await getUserSubscription();
      setUserSubscription(subscription);
    } catch (error) {
      console.error('Error loading user subscription:', error);
    }
  };

  const loadStripe = async () => {
    // In a real implementation, you would load Stripe.js here
    // For now, we'll simulate the Stripe loading
    console.log('Loading Stripe...');
  };

  const calculatePaymentBreakdown = () => {
    const totalAmount = parseFloat(bidAmount) * parseFloat(bidVolume);
    const planType = userSubscription?.plan || 'free';
    const commissionRate = getCommissionRate(planType);
    const commissionAmount = totalAmount * (parseFloat(commissionRate.replace('%', '')) / 100);
    const sellerAmount = totalAmount - commissionAmount;

    return {
      totalAmount,
      commissionAmount,
      sellerAmount,
      commissionRate,
      planType
    };
  };

  const handleCreatePaymentIntent = async () => {
    setIsLoading(true);
    
    try {
      const result = await createPaymentIntent(bidId);
      
      if (result.success && result.payment_intent && result.client_secret) {
        setPaymentIntent(result.payment_intent);
        setClientSecret(result.client_secret);
        toast.success('Payment initialized', {
          description: 'Please complete your payment below'
        });
      } else {
        const errorMessage = result.message || 'Failed to initialize payment';
        toast.error('Payment initialization failed', {
          description: errorMessage
        });
        onPaymentError?.(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error('Payment initialization failed', {
        description: errorMessage
      });
      onPaymentError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!stripe || !elements || !clientSecret) {
      toast.error('Payment not ready', {
        description: 'Please wait for payment to initialize'
      });
      return;
    }

    setIsLoading(true);

    try {
      // In a real implementation, you would use Stripe Elements here
      // For now, we'll simulate a successful payment
      setTimeout(() => {
        if (paymentIntent) {
          setPaymentCompleted(true);
          toast.success('Payment successful!', {
            description: 'Your payment has been processed successfully'
          });
          onPaymentSuccess?.(paymentIntent);
        }
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      toast.error('Payment failed', {
        description: errorMessage
      });
      onPaymentError?.(errorMessage);
      setIsLoading(false);
    }
  };

  const breakdown = calculatePaymentBreakdown();

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center mb-6">
        <CreditCard className="w-6 h-6 text-[#FF8A00] mr-3" />
        <h2 className="text-xl font-semibold">Complete Payment</h2>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Payment Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Bid Amount:</span>
            <span>{formatCurrency(bidAmount)} per unit</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Volume:</span>
            <span>{bidVolume} units</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-medium">
            <span>Total to Pay:</span>
            <span>{formatCurrency(breakdown.totalAmount)}</span>
          </div>
        </div>
      </div>



      {/* Payment Status */}
      {!paymentIntent && (
        <div className="text-center">
          <button
            onClick={handleCreatePaymentIntent}
            disabled={isLoading}
            className="w-full bg-[#FF8A00] text-white py-3 px-4 rounded-md hover:bg-[#e67c00] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Initializing Payment...
              </div>
            ) : (
              'Initialize Payment'
            )}
          </button>
        </div>
      )}

      {paymentIntent && !clientSecret && (
        <div className="text-center py-4">
          <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-gray-600">Setting up payment...</p>
        </div>
      )}

      {paymentIntent && clientSecret && (
        <div className="space-y-4">
          {/* Payment Status */}
          <div className="flex items-center justify-center py-4">
            {paymentIntent.status === 'succeeded' ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-6 h-6 mr-2" />
                <span className="font-medium">Payment Completed</span>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Payment ready to process</p>
                
                {/* Simulated Stripe Elements would go here */}
                <div className="border border-gray-300 rounded-md p-4 mb-4 bg-gray-50">
                  <p className="text-sm text-gray-500 text-center">
                    [Stripe Payment Elements would appear here]
                  </p>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    Card number, expiry, CVC fields
                  </p>
                </div>

                <button
                  onClick={handlePaymentSubmit}
                  disabled={isLoading}
                  className="w-full bg-[#FF8A00] text-white py-3 px-4 rounded-md hover:bg-[#e67c00] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    `Pay ${formatCurrency(breakdown.totalAmount)}`
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Payment Security Notice */}
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-xs text-green-800">
                <p className="font-medium mb-1">Secure Payment</p>
                <p>Your payment is processed securely by Stripe. Your card information is never stored on our servers.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Success */}
      {paymentCompleted && paymentIntent && winningBid && (
        <PaymentSuccess
          paymentIntent={paymentIntent}
          winningBid={winningBid}
          className="mt-6"
        />
      )}
    </div>
  );
}
