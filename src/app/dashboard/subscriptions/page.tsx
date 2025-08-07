"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, X, Calendar, ArrowRight, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { getUserSubscription, updateUserSubscription, createUserSubscription, UserSubscription } from '@/services/userSubscription';
import { getUserProfile, UserProfile } from '@/services/userProfile';
import { getPricingData, PricingData, PricingPlan } from '@/services/pricing';

// Helper function to get commission rate from plan type
const getCommissionRate = (planType: string): string => {
  switch (planType) {
    case 'free': return '9%';
    case 'standard': return '7%';
    case 'premium': return '0%';
    default: return '9%';
  }
};

export default function Subscriptions() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);

  // Fetch subscription data, user profile, and pricing data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all data in parallel
        const [profileResponse, subscriptionResponse, pricingResponse] = await Promise.all([
          getUserProfile(),
          getUserSubscription(),
          getPricingData()
        ]);

        // Handle user profile
        if (profileResponse.error) {
          setError(profileResponse.error);
        } else if (profileResponse.data) {
          setUserProfile(profileResponse.data);
        }

        // Handle subscription
        if (subscriptionResponse.error) {
          // Check if the error is due to no subscription found
          if (subscriptionResponse.status === 404 ||
              subscriptionResponse.error.includes('not found') ||
              subscriptionResponse.error.includes('No subscription')) {
            setHasSubscription(false);
          } else {
            setError(subscriptionResponse.error);
          }
        } else if (subscriptionResponse.data) {
          setSubscription(subscriptionResponse.data);
          setHasSubscription(true);
        }

        // Handle pricing data
        if (pricingResponse.error) {
          setError(pricingResponse.error);
        } else if (pricingResponse.data?.success) {
          setPricingData(pricingResponse.data.data);
        }
      } catch (_error) {
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle plan change (upgrade or create new)
  const handlePlanChange = async (planId: string) => {
    // If updating or trying to select the current plan, do nothing
    if (isUpdating || (subscription && subscription.plan === planId)) return;
    
    try {
      setIsUpdating(true);
      setError(null);
      setUpdateSuccess(false);
      
      let response;
      
      // If user has no subscription, create a new one
      if (!hasSubscription) {
        // Get current date and one year from now
        const today = new Date();
        const nextYear = new Date(today);
        nextYear.setFullYear(today.getFullYear() + 1);
        
        // Format dates as YYYY-MM-DD
        const formatDate = (date: Date) => {
          return date.toISOString().split('T')[0];
        };
        
        const startDate = formatDate(today);
        const endDate = formatDate(nextYear);
        
        // Create subscription with required format
        const createData = {
          plan: planId,
          status: 'active',
          start_date: startDate,
          end_date: endDate,
          auto_renew: true,
          last_payment: startDate,
          amount: planId === 'free' ? '0' : planId === 'standard' ? '599' : '799',
          // Use user profile information for contact details if available
          contact_name: userProfile ? `${userProfile.first_name} ${userProfile.last_name}`.trim() : '',
          contact_email: userProfile ? userProfile.email : ''
        };
        
        response = await createUserSubscription(createData);
      } else if (subscription) {
        // Otherwise update the existing subscription
        const updateData = {
          plan: planId,
          auto_renew: subscription.auto_renew,
          payment_method: subscription.payment_method,
          contact_name: subscription.contact_name,
          contact_email: subscription.contact_email
        };
        
        response = await updateUserSubscription(updateData);
      }
      
      if (response?.error) {
        setError(response.error);
      } else if (response?.data) {
        setSubscription(response.data.subscription);
        setHasSubscription(true);
        setUpdateSuccess(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      }
    } catch (_error) {
      setError('Failed to update subscription');
    } finally {
      setIsUpdating(false);
    }
  };

  // Format date string
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
  return (
    <div className="p-5">
      <h1 className="text-xl font-medium mb-5">Subscription Plans</h1>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-md mb-5">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={16} />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Success message */}
      {updateSuccess && (
        <div className="p-4 bg-green-50 border border-green-100 rounded-md mb-5">
          <div className="flex items-center">
            <CheckCircle className="text-green-500 mr-2" size={16} />
            <p className="text-sm text-green-700">
              {hasSubscription ? 'Subscription updated successfully!' : 'Subscription created successfully!'}
            </p>
          </div>
        </div>
      )}
      
      {/* No subscription message */}
      {hasSubscription === false && !isLoading && (
        <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-md mb-5">
          <div className="flex items-center">
            <AlertCircle className="text-yellow-500 mr-2" size={16} />
            <p className="text-sm text-yellow-700">No subscription found for this company. Please select a plan below.</p>
          </div>
        </div>
      )}

      {/* Current Subscription */}
      <div className="bg-white border border-gray-100 rounded-md p-4 mb-6">
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#FF8A00]"></div>
          </div>
        ) : subscription ? (
          <>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-sm font-medium text-gray-700">Current Plan</h2>
                <div className="text-base font-medium mt-1">{subscription.plan_display}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {subscription.plan === 'premium' ? 'No commission fees on trades' :
                   `Commission rate: ${getCommissionRate(subscription.plan)} on all trades`}
                </div>
              </div>

              <div className={`text-xs px-2 py-1 rounded-full ${
                subscription.status === 'active' ? 'bg-green-100 text-green-800' : 
                subscription.status === 'expired' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {subscription.status_display}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="text-xs text-gray-500 flex items-center">
                <Calendar size={14} className="mr-1" />
                Next billing date: {subscription.end_date ? formatDate(subscription.end_date) : 'N/A'}
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-xs text-gray-500">
                  Auto-renew: {subscription.auto_renew ? (
                    <span className="text-green-600 font-medium">Enabled</span>
                  ) : (
                    <span className="text-red-600 font-medium">Disabled</span>
                  )}
                </div>
                <Link href="/dashboard/subscriptions/payment" className="text-[#FF8A00] hover:text-[#e67e00] text-xs font-medium">
                  Manage Payment Methods
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No subscription information available
          </div>
        )}
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {!pricingData ? (
          // Loading state for pricing plans
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white border border-gray-100 rounded-md p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2 mb-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-3 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))
        ) : (
          pricingData.pricing_plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white border rounded-md p-4 ${
              subscription && subscription.plan === plan.plan_type
                ? 'border-[#FF8A00] ring-1 ring-[#FF8A00]'
                : 'border-gray-100'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-base font-medium">{plan.name}</h3>
              {subscription && subscription.plan === plan.plan_type && (
                <span className="bg-[#FF8A00] text-white text-xs px-2 py-0.5 rounded-full">
                  Current
                </span>
              )}
            </div>

            <div className="flex items-baseline mb-3">
              <span className="text-xl font-bold">
                {plan.price === 0 ? 'Free' : `${plan.price} ${plan.currency}`}
              </span>
              <span className="text-xs text-gray-500 ml-1">/month</span>
            </div>

            <div className="text-xs text-gray-500 mb-4">
              Commission rate: {getCommissionRate(plan.plan_type)} on all trades
            </div>

            <div className="space-y-2 mb-4">
              {plan.features.map((feature) => (
                <div key={feature.id} className="flex items-start">
                  {feature.is_included ? (
                    <Check size={14} className={`mr-2 mt-0.5 flex-shrink-0 ${
                      feature.is_highlighted ? 'text-[#FF8A00]' : 'text-green-500'
                    }`} />
                  ) : (
                    <X size={14} className="text-gray-300 mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <span className={`text-xs ${
                    feature.is_included
                      ? feature.is_highlighted
                        ? 'text-gray-900 font-medium'
                        : 'text-gray-700'
                      : 'text-gray-400 line-through'
                  }`}>
                    {feature.feature_text}
                  </span>
                </div>
              ))}
            </div>

            <button
              className={`w-full py-2 rounded-md text-sm ${
                (subscription && subscription.plan === plan.plan_type) || isUpdating
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#FF8A00] text-white hover:bg-[#e67e00] transition-colors'
              }`}
              disabled={(subscription && subscription.plan === plan.plan_type) || isUpdating}
              onClick={() => handlePlanChange(plan.plan_type)}
            >
              {isUpdating ? (
                <span className="flex items-center justify-center">
                  <RefreshCw size={14} className="animate-spin mr-2" />
                  {hasSubscription ? 'Updating...' : 'Creating...'}
                </span>
              ) : subscription && subscription.plan === plan.plan_type ? (
                'Current Plan'
              ) : hasSubscription ? (
                'Upgrade'
              ) : (
                'Select Plan'
              )}
            </button>
          </div>
        ))
        )}
      </div>

      {/* Billing History - Only show if user has a subscription */}
      {hasSubscription && (
        <div className="bg-white border border-gray-100 rounded-md p-4">
          <h2 className="text-sm font-medium text-gray-700 mb-3">Billing History</h2>

          <div className="border-t border-gray-100 py-4 text-center">
            {isLoading ? (
              <div className="flex items-center justify-center p-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#FF8A00]"></div>
              </div>
            ) : subscription ? (
              <>
                <p className="text-sm text-gray-500">
                  {subscription.last_payment ? (
                    <>Last payment: {formatDate(subscription.last_payment)} - {subscription.amount}</>
                  ) : (
                    <>No billing history available for {subscription.plan_display}.</>
                  )}
                </p>
                <Link
                  href="/dashboard/subscriptions/billing"
                  className="text-[#FF8A00] hover:text-[#e67e00] text-xs font-medium flex items-center justify-center mt-2"
                >
                  View all transactions <ArrowRight size={12} className="ml-1" />
                </Link>
              </>
            ) : (
              <p className="text-sm text-gray-500">No billing history available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
