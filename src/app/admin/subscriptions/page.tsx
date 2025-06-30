"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, ChevronDown, ChevronUp, CreditCard, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { getAdminSubscriptions, AdminSubscription } from '@/services/subscriptions';

// Subscription plan details
const subscriptionPlans = [
  {
    id: 'free',
    name: 'Free Plan',
    price: '0 SEK',
    features: [
      'Limited marketplace listings',
      'Limited monthly auctions',
      'Basic reporting',
      'Participation in discussion forums',
      '9% commission fee on trades'
    ]
  },
  {
    id: 'standard',
    name: 'Standard Plan',
    price: '599 SEK',
    features: [
      'Unlimited marketplace listings',
      'Unlimited monthly auctions',
      'Advanced reporting',
      'Participation in discussion forums',
      '7% commission fee on trades'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: '799 SEK',
    features: [
      'No commission fees on trades',
      'Advanced sample request functionality',
      'Access to contact information',
      'Priority listing and access',
      'Unlimited marketplace listings',
      'Unlimited monthly auctions',
      'Advanced reporting',
      'Participation in discussion forums'
    ]
  }
];

export default function SubscriptionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10
  });

  // URL state management for filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedPlan, setSelectedPlan] = useState(searchParams.get('plan') || 'all');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

  // UI state
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [showPlanDetails, setShowPlanDetails] = useState<string | null>(null);

  // Debounce search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update URL when filters change
  const updateURL = useCallback((search: string, plan: string, status: string, page: number) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (plan && plan !== 'all') params.set('plan', plan);
    if (status && status !== 'all') params.set('status', status);
    if (page > 1) params.set('page', page.toString());
    
    const newURL = `/admin/subscriptions${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newURL);
  }, [router]);

  // Fetch subscriptions from API
  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        search: debouncedSearchTerm || undefined,
        plan: selectedPlan !== 'all' ? selectedPlan : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        page: currentPage,
        page_size: pagination.pageSize
      };

      const response = await getAdminSubscriptions(params);

      if (response.data) {
        setSubscriptions(response.data.results);
        setPagination({
          count: response.data.count,
          totalPages: response.data.total_pages,
          currentPage: response.data.current_page,
          pageSize: response.data.page_size
        });
      } else {
        setError(response.error || 'Failed to fetch subscriptions');
      }
    } catch (_err) {
      setError('An unexpected error occurred while fetching subscriptions');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, selectedPlan, selectedStatus, currentPage, pagination.pageSize]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Update URL when filters change
  useEffect(() => {
    updateURL(debouncedSearchTerm, selectedPlan, selectedStatus, currentPage);
  }, [debouncedSearchTerm, selectedPlan, selectedStatus, currentPage, updateURL]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle plan filter change
  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlan(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle status filter change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle subscription status change (placeholder for now)
  const handleSubscriptionStatusChange = (subscriptionId: string, newStatus: string) => {
    // TODO: Implement API call to update subscription status
    // For now, update local state
    const updatedSubscriptions = subscriptions.map(subscription =>
      subscription.id === subscriptionId ? { ...subscription, status: newStatus as AdminSubscription['status'] } : subscription
    );
    setSubscriptions(updatedSubscriptions);
  };

  // Handle sort
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';

    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    setSortConfig({ key, direction });

    const sortedSubscriptions = [...subscriptions].sort((a, b) => {
      const aValue = a[key as keyof AdminSubscription];
      const bValue = b[key as keyof AdminSubscription];

      // Handle null or undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return direction === 'ascending' ? -1 : 1;
      if (bValue == null) return direction === 'ascending' ? 1 : -1;

      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setSubscriptions(sortedSubscriptions);
  };

  // Get sort indicator
  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }

    return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  // Toggle plan details
  const togglePlanDetails = (planId: string) => {
    if (showPlanDetails === planId) {
      setShowPlanDetails(null);
    } else {
      setShowPlanDetails(planId);
    }
  };

  // Count subscriptions that need attention
  const failedPaymentCount = subscriptions.filter(subscription => subscription.status === 'payment_failed').length;

  // Generate pagination
  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50"
        >
          Previous
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium border ${
            i === currentPage
              ? 'bg-[#FF8A00] text-white border-[#FF8A00]'
              : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (currentPage < pagination.totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50"
        >
          Next
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * pagination.pageSize) + 1} to {Math.min(currentPage * pagination.pageSize, pagination.count)} of {pagination.count} results
        </div>
        <div className="flex">{pages}</div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Subscription Management</h1>
          {failedPaymentCount > 0 && (
            <span className="ml-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {failedPaymentCount}
            </span>
          )}
        </div>
        <button
          onClick={fetchSubscriptions}
          disabled={loading}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {subscriptionPlans.map((plan) => (
          <div key={plan.id} className="bg-white p-4 rounded-md shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium">{plan.name}</h3>
              <span className="text-lg font-bold">{plan.price}</span>
            </div>
            <div className="text-sm text-gray-500 mb-2">
              {plan.features.length} features
            </div>
            <button
              className="text-[#FF8A00] text-sm font-medium hover:text-[#e67e00] focus:outline-none"
              onClick={() => togglePlanDetails(plan.id)}
            >
              {showPlanDetails === plan.id ? 'Hide details' : 'View details'}
            </button>
            {showPlanDetails === plan.id && (
              <ul className="mt-2 space-y-1">
                {plan.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="mr-2 text-[#FF8A00]">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search companies or contacts..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
              value={selectedPlan}
              onChange={handlePlanChange}
            >
              <option value="all">All Plans</option>
              <option value="free">Free Plan</option>
              <option value="standard">Standard Plan</option>
              <option value="premium">Premium Plan</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="payment_failed">Payment Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {/* Subscriptions Table */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort('companyName')}>
                    Company
                    {getSortIndicator('companyName')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort('plan')}>
                    Plan
                    {getSortIndicator('plan')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort('status')}>
                    Status
                    {getSortIndicator('status')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort('startDate')}>
                    Period
                    {getSortIndicator('startDate')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort('amount')}>
                    Payment
                    {getSortIndicator('amount')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
                      <span className="text-gray-500">Loading subscriptions...</span>
                    </div>
                  </td>
                </tr>
              ) : subscriptions.length > 0 ? (
                subscriptions.map((subscription) => (
                  <tr key={subscription.id} className={subscription.status === 'payment_failed' ? "bg-red-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{subscription.companyName}</div>
                      <div className="text-xs text-gray-500">
                        Contact: {subscription.contactName} ({subscription.contactEmail})
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {subscription.plan === 'premium' ? 'Premium Plan' :
                         subscription.plan === 'standard' ? 'Standard Plan' : 'Free Plan'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {subscription.autoRenew ? 'Auto-renews' : 'No auto-renewal'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                          subscription.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                          subscription.status === 'payment_failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {subscription.status === 'active' ? 'Active' :
                         subscription.status === 'expired' ? 'Expired' :
                         subscription.status === 'payment_failed' ? 'Payment Failed' :
                         'Cancelled'}
                      </span>
                      {subscription.status === 'payment_failed' && (
                        <div className="flex items-center text-xs text-red-600 mt-1">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Requires attention
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        <span>
                          {subscription.startDate}
                          {subscription.endDate ? ` to ${subscription.endDate}` : ' (No end date)'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subscription.paymentMethod ? (
                        <div>
                          <div className="flex items-center text-sm text-gray-900">
                            {subscription.paymentMethod === 'credit_card' ? (
                              <CreditCard className="h-4 w-4 mr-1 text-gray-400" />
                            ) : (
                              <span className="h-4 w-4 mr-1 flex items-center justify-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                              </span>
                            )}
                            <span>
                              {subscription.paymentMethod === 'credit_card' ? 'Credit Card' : 'Invoice'}
                            </span>
                          </div>
                          {subscription.lastPayment && (
                            <div className="text-xs text-gray-500">
                              Last payment: {subscription.lastPayment} ({subscription.amount})
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No payment required</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/admin/subscriptions/${subscription.id}`} className="text-blue-600 hover:text-blue-900">
                          Details
                        </Link>
                        <Link href={`/admin/companies/${subscription.companyId}`} className="text-indigo-600 hover:text-indigo-900">
                          View Company
                        </Link>
                        {subscription.status === 'payment_failed' && (
                          <button
                            className="text-green-600 hover:text-green-900"
                            onClick={() => handleSubscriptionStatusChange(subscription.id, 'active')}
                          >
                            Resolve
                          </button>
                        )}
                        {subscription.status === 'active' && (
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleSubscriptionStatusChange(subscription.id, 'cancelled')}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="text-gray-500">
                      {searchTerm || selectedPlan !== 'all' || selectedStatus !== 'all'
                        ? 'No subscriptions found matching your criteria'
                        : 'No subscriptions available'}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
}
