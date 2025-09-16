"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Loader2, AlertCircle, ArrowRight, Calendar } from 'lucide-react';
import { verifyCheckoutSession } from '@/services/subscriptionPayments';
import { getUserSubscription } from '@/services/userSubscription';

export default function SubscriptionSuccessPage() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setIsVerifying(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        // Verify the checkout session
        const verificationResponse = await verifyCheckoutSession(sessionId);
        
        if (verificationResponse.error || !verificationResponse.data) {
          setError(verificationResponse.error || 'Failed to verify payment');
          return;
        }

        const verification = verificationResponse.data;

        if (verification.success && verification.payment_status === 'paid') {
          setVerificationSuccess(true);
          
          // Wait a moment for webhook to process, then fetch updated subscription
          setTimeout(async () => {
            try {
              const subscriptionResponse = await getUserSubscription();
              if (subscriptionResponse.data) {
                setSubscriptionDetails(subscriptionResponse.data);
              }
            } catch (_error) {
              // Don't fail the whole process if subscription fetch fails
            }
          }, 2000);
        } else {
          setError(verification.message || 'Payment was not successful');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to verify payment');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (_e) {
      return dateString;
    }
  };

  const getPlanDisplayName = (planType: string): string => {
    switch (planType) {
      case 'free': return 'Free Plan';
      case 'standard': return 'Standard Plan';
      case 'premium': return 'Premium Plan';
      default: return planType;
    }
  };

  const getPlanPrice = (planType: string): string => {
    switch (planType) {
      case 'free': return 'Free';
      case 'standard': return '799 SEK/month';
      case 'premium': return '999 SEK/month';
      default: return '';
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center max-w-md w-full">
          <Loader2 className="w-16 h-16 text-[#FF8A00] mx-auto mb-4 animate-spin" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Verifying Payment
          </h1>
          <p className="text-gray-600">
            Please wait while we confirm your subscription payment...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Payment Verification Failed
          </h1>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <div className="space-y-3">
            <Link
              href="/dashboard/subscriptions"
              className="block bg-[#FF8A00] text-white px-6 py-2 rounded-md hover:bg-[#e67a00] transition-colors"
            >
              Back to Subscriptions
            </Link>
            <Link
              href="/support"
              className="block text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (verificationSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center max-w-lg w-full">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Subscription Activated!
          </h1>
          <p className="text-gray-600 mb-6">
            Your payment was processed successfully and your subscription is now active.
          </p>

          {/* Subscription Details */}
          {subscriptionDetails && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-medium text-gray-900 mb-4">Subscription Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium">
                    {getPlanDisplayName(subscriptionDetails.plan)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">
                    {getPlanPrice(subscriptionDetails.plan)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">Active</span>
                </div>
                {subscriptionDetails.start_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Started:</span>
                    <span className="font-medium">
                      {formatDate(subscriptionDetails.start_date)}
                    </span>
                  </div>
                )}
                {subscriptionDetails.end_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Billing:</span>
                    <span className="font-medium">
                      {formatDate(subscriptionDetails.end_date)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
              <div className="text-left">
                <h4 className="font-medium text-blue-900 mb-1">What&apos;s Next?</h4>
                <p className="text-sm text-blue-700">
                  Your subscription is now active and all features are available. 
                  You can manage your subscription settings from your dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block bg-[#FF8A00] text-white px-6 py-3 rounded-md hover:bg-[#e67a00] transition-colors font-medium"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 inline ml-2" />
            </Link>
            <div className="flex space-x-3">
              <Link
                href="/dashboard/subscriptions"
                className="flex-1 text-gray-600 hover:text-gray-900 transition-colors py-2"
              >
                Manage Subscription
              </Link>
              <Link
                href="/marketplace"
                className="flex-1 text-gray-600 hover:text-gray-900 transition-colors py-2"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
