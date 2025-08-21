"use client";

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { CreditCard, Loader2 } from 'lucide-react';
import { PaymentIntent, confirmPaymentCompletion } from '@/services/payments';

interface StripePaymentFormProps {
  clientSecret: string;
  paymentIntent: PaymentIntent;
  onPaymentSuccess: (paymentIntent: PaymentIntent) => void;
  onPaymentError: (error: string) => void;
  className?: string;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: false,
};

export default function StripePaymentForm({
  clientSecret,
  paymentIntent,
  onPaymentSuccess,
  onPaymentError,
  className = ''
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error('Payment system not ready', {
        description: 'Please wait a moment and try again'
      });
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error('Card element not found');
      return;
    }

    setIsProcessing(true);
    setCardError(null);

    try {
      // Confirm the payment with Stripe
      const { error, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          }
        }
      );

      if (error) {
        console.error('Payment confirmation error:', error);
        const errorMessage = error.message || 'Payment failed';
        setCardError(errorMessage);
        onPaymentError(errorMessage);
        toast.error('Payment failed', {
          description: errorMessage
        });
      } else if (confirmedPaymentIntent && confirmedPaymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', confirmedPaymentIntent);

        // Update the payment intent with the confirmed status
        const updatedPaymentIntent = {
          ...paymentIntent,
          status: 'succeeded' as const,
          stripe_payment_intent_id: confirmedPaymentIntent.id
        };

        // Call backend to confirm payment completion (fallback for webhook)
        try {
          const confirmationResult = await confirmPaymentCompletion(paymentIntent.id);
          if (confirmationResult.success) {
            console.log('Payment completion confirmed with backend');
            if (confirmationResult.already_processed) {
              console.log('Payment was already processed by webhook');
            }
          } else {
            console.warn('Backend confirmation failed:', confirmationResult.message);
            // Still proceed with frontend success - webhook might handle it
          }
        } catch (error) {
          console.warn('Error confirming payment with backend:', error);
          // Still proceed with frontend success - webhook might handle it
        }

        onPaymentSuccess(updatedPaymentIntent);
        toast.success('Payment successful!', {
          description: 'Your payment has been processed successfully'
        });
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      setCardError(errorMessage);
      onPaymentError(errorMessage);
      toast.error('Payment failed', {
        description: errorMessage
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardChange = (event: any) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError(null);
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-center mb-4">
        <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="border border-gray-300 rounded-md p-3 bg-white">
            <CardElement
              options={cardElementOptions}
              onChange={handleCardChange}
            />
          </div>
          {cardError && (
            <p className="mt-2 text-sm text-red-600">{cardError}</p>
          )}
        </div>

        <div className="bg-gray-50 rounded-md p-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-medium text-gray-900">
              {paymentIntent.total_amount} {paymentIntent.currency?.toUpperCase() || 'SEK'}
            </span>
          </div>
          {paymentIntent.commission_amount > 0 && (
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-gray-600">Platform Fee:</span>
              <span className="text-gray-600">
                {paymentIntent.commission_amount} {paymentIntent.currency?.toUpperCase() || 'SEK'}
              </span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full flex items-center justify-center px-6 py-3 bg-[#FF8A00] text-white font-medium rounded-lg hover:bg-[#e67c00] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Complete Payment
            </>
          )}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Your payment information is secure and encrypted.</p>
        <p>Powered by Stripe</p>
      </div>
    </div>
  );
}
