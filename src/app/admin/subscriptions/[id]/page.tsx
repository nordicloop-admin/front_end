"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Building, CreditCard, Calendar, User, DollarSign, Clock, AlertCircle, Check, X } from 'lucide-react';
import { getAdminSubscription, AdminSubscription } from '@/services/subscriptions';

export default function SubscriptionDetailPage() {
  const { id } = useParams();
  
  // State management
  const [subscription, setSubscription] = useState<AdminSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch subscription details
  const fetchSubscriptionDetails = useCallback(async () => {
    if (!id || typeof id !== 'string') return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await getAdminSubscription(id);

      if (response.data) {
        setSubscription(response.data);
      } else {
        setError(response.error || 'Failed to fetch subscription details');
      }
    } catch (_err) {
      setError('An unexpected error occurred while fetching subscription details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSubscriptionDetails();
  }, [fetchSubscriptionDetails]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      case 'payment_failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get plan display name
  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'premium':
        return 'Premium Plan';
      case 'standard':
        return 'Standard Plan';
      case 'free':
        return 'Free Plan';
      default:
        return plan;
    }
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method: string | null) => {
    if (method === 'credit_card') {
      return <CreditCard className="h-5 w-5 text-[#FF8A00]" />;
    } else if (method === 'invoice') {
      return (
        <svg className="h-5 w-5 text-[#FF8A00]" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
          <span className="text-gray-500">Loading subscription details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-6">
        <div className="text-red-800">{error}</div>
        <button
          onClick={fetchSubscriptionDetails}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Subscription not found</div>
        <Link
          href="/admin/subscriptions"
          className="mt-4 inline-flex items-center px-4 py-2 bg-[#FF8A00] text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Subscriptions
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/subscriptions"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Subscriptions
          </Link>
          <h1 className="text-2xl font-bold">Subscription Details</h1>
        </div>
        <button
          onClick={fetchSubscriptionDetails}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Subscription Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subscription Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-[#FF8A00]" />
                Subscription Overview
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Subscription ID
                  </label>
                  <div className="text-sm font-medium text-gray-900">{subscription.id}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Plan
                  </label>
                  <div className="text-lg font-bold text-gray-900">{getPlanDisplayName(subscription.plan)}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Status
                  </label>
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeColor(subscription.status)}`}>
                    {subscription.status === 'active' ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Active
                      </>
                    ) : subscription.status === 'expired' ? (
                      <>
                        <Clock className="h-4 w-4 mr-1" />
                        Expired
                      </>
                    ) : subscription.status === 'payment_failed' ? (
                      <>
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Payment Failed
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 mr-1" />
                        Cancelled
                      </>
                    )}
                  </span>
                  {subscription.status === 'payment_failed' && (
                    <div className="text-xs text-red-600 mt-1">Requires immediate attention</div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Amount
                  </label>
                  <div className="text-lg font-semibold text-gray-900">{subscription.amount}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Auto Renewal
                  </label>
                  <div className="flex items-center">
                    {subscription.autoRenew ? (
                      <>
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm text-green-600">Enabled</span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">Disabled</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Start Date
                  </label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-900">{formatDate(subscription.startDate)}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    End Date
                  </label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {subscription.endDate ? formatDate(subscription.endDate) : 'No end date'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-[#FF8A00]" />
                Payment Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Payment Method
                  </label>
                  {subscription.paymentMethod ? (
                    <div className="flex items-center">
                      {getPaymentMethodIcon(subscription.paymentMethod)}
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {subscription.paymentMethod === 'credit_card' ? 'Credit Card' : 'Invoice'}
                      </span>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No payment method</div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Last Payment
                  </label>
                  <div className="text-sm text-gray-900">
                    {subscription.lastPayment ? formatDate(subscription.lastPayment) : 'No payments yet'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Company Information & Actions */}
        <div className="space-y-6">
          {/* Company Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center">
                <Building className="h-5 w-5 mr-2 text-[#FF8A00]" />
                Company Information
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Company Name
                  </label>
                  <div className="text-sm font-medium text-gray-900">{subscription.companyName}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Company ID
                  </label>
                  <div className="text-sm text-gray-900">{subscription.companyId}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center">
                <User className="h-5 w-5 mr-2 text-[#FF8A00]" />
                Contact Information
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Contact Name
                  </label>
                  <div className="text-sm font-medium text-gray-900">{subscription.contactName}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Contact Email
                  </label>
                  <div className="text-sm text-gray-900">{subscription.contactEmail}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Subscription Summary</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Plan</span>
                  <span className="text-sm font-medium text-gray-900">{getPlanDisplayName(subscription.plan)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`text-sm font-medium ${
                    subscription.status === 'active' ? 'text-green-600' :
                    subscription.status === 'payment_failed' ? 'text-red-600' :
                    subscription.status === 'expired' ? 'text-gray-600' :
                    'text-yellow-600'
                  }`}>
                    {subscription.status === 'active' ? 'Active' :
                     subscription.status === 'expired' ? 'Expired' :
                     subscription.status === 'payment_failed' ? 'Payment Failed' :
                     'Cancelled'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Auto Renewal</span>
                  <span className="text-sm font-medium text-gray-900">
                    {subscription.autoRenew ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Monthly Cost</span>
                  <span className="text-sm font-medium text-gray-900">{subscription.amount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <Link
                  href={`/admin/companies/${subscription.companyId}`}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8A00]"
                >
                  View Company Details
                </Link>
                <Link
                  href={`/admin/subscriptions`}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#FF8A00] hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8A00]"
                >
                  View All Subscriptions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 