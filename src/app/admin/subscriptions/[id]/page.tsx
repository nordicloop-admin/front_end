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
          className="mt-4 px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 hover:border-red-400 transition-colors"
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
    <div className="min-h-screen bg-gray-50 -mx-5">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-full mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/admin/subscriptions"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span className="font-medium">Back to Subscriptions</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-md text-sm font-medium border ${getStatusBadgeColor(subscription.status)}`}>
                {subscription.status === 'active' ? 'Active' :
                 subscription.status === 'expired' ? 'Expired' :
                 subscription.status === 'payment_failed' ? 'Payment Failed' :
                 'Cancelled'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-6 lg:px-12 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="mb-6">
              <h1 className="text-xl font-medium text-gray-900">{getPlanDisplayName(subscription.plan)} Subscription</h1>
              
              <div className="flex items-center text-gray-600 text-sm">
                <Building className="w-4 h-4 mr-2" />
                <span>For <span className="font-medium text-gray-900">{subscription.companyName}</span></span>
              </div>
            </div>
            <p className="text-gray-500 mt-1">Started on {formatDate(subscription.startDate)} • Subscription ID: #{subscription.id}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="border border-gray-200 rounded-md p-4">
              <div className="text-sm text-gray-500 mb-1">Monthly Amount</div>
              <div className="text-lg font-semibold text-[#FF8A00]">{subscription.amount}</div>
            </div>
            
            <div className="border border-gray-200 rounded-md p-4">
              <div className="text-sm text-gray-500 mb-1 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Plan Type
              </div>
              <div className="text-lg font-semibold text-gray-900">{getPlanDisplayName(subscription.plan)}</div>
            </div>
            
            <div className="border border-gray-200 rounded-md p-4">
              <div className="text-sm text-gray-500 mb-1 flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Company
              </div>
              <div className="text-lg font-semibold text-gray-900">{subscription.companyName}</div>
              <div className="text-sm text-gray-500">{subscription.contactEmail}</div>
            </div>
          </div>
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Subscription Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-sm font-medium text-gray-900 mb-4">Subscription Details</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Plan</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{getPlanDisplayName(subscription.plan)}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Status</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{subscription.status === 'active' ? 'Active' : subscription.status === 'expired' ? 'Expired' : subscription.status === 'payment_failed' ? 'Payment Failed' : 'Cancelled'}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Amount</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{subscription.amount}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Auto Renewal</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{subscription.autoRenew ? 'Yes' : 'No'}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Start Date</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{formatDate(subscription.startDate)}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">End Date</div>
                  <div className="text-gray-900 font-medium text-sm text-right">{subscription.endDate ? formatDate(subscription.endDate) : 'No end date'}</div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-sm font-medium text-gray-900 mb-4">Payment Information</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Payment Method</div>
                  <div className="text-gray-900 font-medium text-sm text-right">
                    {subscription.paymentMethod ? (subscription.paymentMethod === 'credit_card' ? 'Credit Card' : 'Invoice') : 'No payment method'}
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600 text-sm">Last Payment</div>
                  <div className="text-gray-900 font-medium text-sm text-right">
                    {subscription.lastPayment ? formatDate(subscription.lastPayment) : 'No payments yet'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Company Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-medium text-gray-900">Company Information</h2>
                <Link
                  href={`/admin/companies/${subscription.companyId}`}
                  className="text-[#FF8A00] text-sm hover:text-orange-700 font-medium"
                >
                  View Company Details
                </Link>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-md border border-gray-100">
                <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center mr-4">
                  <Building size={24} className="text-gray-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{subscription.companyName}</h3>
                  <p className="text-sm text-gray-500">ID: {subscription.companyId}</p>
                  <p className="text-sm text-gray-500">{subscription.contactEmail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Status Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Status Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                    subscription.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                    subscription.status === 'payment_failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {subscription.status === 'active' ? 'Active' :
                     subscription.status === 'expired' ? 'Expired' :
                     subscription.status === 'payment_failed' ? 'Payment Failed' :
                     'Cancelled'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Start Date</span>
                  <span className="font-medium text-gray-900">{formatDate(subscription.startDate)}</span>
                </div>
                {subscription.endDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">End Date</span>
                    <span className="font-medium text-gray-900">{formatDate(subscription.endDate)}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Contact Name</span>
                  <span className="font-medium text-gray-900">{subscription.contactName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium text-gray-900">{subscription.contactEmail}</span>
                </div>
              </div>
            </div>
            
            {/* Admin Notes */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Admin Notes</h3>
              <textarea
                placeholder="Add private notes about this subscription (only visible to admins)"
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
              ></textarea>
              <button className="mt-2 w-full px-4 py-2 bg-[#FF8A00] text-white rounded-md hover:bg-orange-600 transition-colors">
                Save Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 