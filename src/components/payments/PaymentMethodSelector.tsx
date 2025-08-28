"use client";

import React, { useState } from 'react';
import { CreditCard, AlertCircle, Shield } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentMethodSelectorProps {
  onPaymentMethodReady: (paymentMethodId: string) => void;
  onError: (error: string) => void;
  isProcessing?: boolean;
  className?: string;
}

interface CardFormProps {
  onPaymentMethodReady: (paymentMethodId: string) => void;
  onError: (error: string) => void;
  isProcessing?: boolean;
}

function CardForm({ onPaymentMethodReady, onError, isProcessing }: CardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [_isReady, setIsReady] = useState(false);

  const handleCardChange = async (event: any) => {
    if (event.complete && stripe && elements) {
      setIsReady(true);
      
      try {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        // Create payment method
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

        if (error) {
          onError(error.message || 'Failed to create payment method');
          setIsReady(false);
        } else if (paymentMethod) {
          onPaymentMethodReady(paymentMethod.id);
        }
      } catch (_err) {
        onError('Error creating payment method');
        setIsReady(false);
      }
    } else if (event.error) {
      onError(event.error.message);
      setIsReady(false);
    } else {
      setIsReady(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '12px',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: false,
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
          <span className="font-medium text-gray-900">Card Information</span>
        </div>
        
        <div className="border border-gray-300 rounded-md p-3 focus-within:border-[#FF8A00] focus-within:ring-1 focus-within:ring-[#FF8A00]">
          <CardElement
            options={cardElementOptions}
            onChange={handleCardChange}
          />
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-start">
          <Shield className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">Secure Pre-Authorization</p>
            <p>
              We&apos;ll place a temporary hold on your card for the bid amount. 
              You&apos;ll only be charged if you win the auction. 
              If you don&apos;t win, the hold will be automatically released.
            </p>
          </div>
        </div>
      </div>

      {isProcessing && (
        <div className="text-center py-2">
          <div className="inline-flex items-center text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#FF8A00] mr-2"></div>
            Processing payment authorization...
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentMethodSelector({ 
  onPaymentMethodReady, 
  onError, 
  isProcessing = false,
  className = '' 
}: PaymentMethodSelectorProps) {
  const [error, setError] = useState<string>('');

  const handlePaymentMethodReady = (paymentMethodId: string) => {
    setError('');
    onPaymentMethodReady(paymentMethodId);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    onError(errorMessage);
  };

  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Authorization</h3>
        <p className="text-sm text-gray-600">
          To place a bid, we need to pre-authorize your payment method. 
          This ensures funds are available if you win the auction.
        </p>
      </div>

      <Elements stripe={stripePromise}>
        <CardForm 
          onPaymentMethodReady={handlePaymentMethodReady}
          onError={handleError}
          isProcessing={isProcessing}
        />
      </Elements>

      {error && (
        <div className="mt-3 text-sm text-red-600 flex items-start">
          <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

