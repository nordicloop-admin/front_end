"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, ChevronDown, ChevronUp, CreditCard, Clock, AlertCircle } from 'lucide-react';

// Mock data for subscriptions
const mockSubscriptions = [
  {
    id: '1',
    companyId: '1',
    companyName: 'Eco Solutions AB',
    plan: 'premium',
    status: 'active',
    startDate: '2023-01-15',
    endDate: '2024-01-15',
    autoRenew: true,
    paymentMethod: 'credit_card',
    lastPayment: '2023-01-15',
    amount: '799 SEK',
    contactName: 'Erik Johansson',
    contactEmail: 'erik@ecosolutions.se'
  },
  {
    id: '2',
    companyId: '2',
    companyName: 'Green Tech Norway',
    plan: 'standard',
    status: 'active',
    startDate: '2023-02-20',
    endDate: '2024-02-20',
    autoRenew: true,
    paymentMethod: 'invoice',
    lastPayment: '2023-02-20',
    amount: '599 SEK',
    contactName: 'Astrid Olsen',
    contactEmail: 'astrid@greentech.no'
  },
  {
    id: '3',
    companyId: '3',
    companyName: 'Circular Materials Oy',
    plan: 'free',
    status: 'active',
    startDate: '2023-03-10',
    endDate: null,
    autoRenew: false,
    paymentMethod: null,
    lastPayment: null,
    amount: '0 SEK',
    contactName: 'Mikko Virtanen',
    contactEmail: 'mikko@circularmaterials.fi'
  },
  {
    id: '4',
    companyId: '4',
    companyName: 'Sustainable Textiles AB',
    plan: 'standard',
    status: 'expired',
    startDate: '2022-11-05',
    endDate: '2023-11-05',
    autoRenew: false,
    paymentMethod: 'credit_card',
    lastPayment: '2022-11-05',
    amount: '599 SEK',
    contactName: 'Sofia Lindberg',
    contactEmail: 'sofia@sustainabletextiles.se'
  },
  {
    id: '5',
    companyId: '5',
    companyName: 'Nordic Recyclers',
    plan: 'premium',
    status: 'payment_failed',
    startDate: '2023-04-15',
    endDate: '2024-04-15',
    autoRenew: true,
    paymentMethod: 'credit_card',
    lastPayment: '2023-04-15',
    amount: '799 SEK',
    contactName: 'Lars Nielsen',
    contactEmail: 'lars@nordicrecyclers.dk'
  }
];

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
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState(mockSubscriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [showPlanDetails, setShowPlanDetails] = useState<string | null>(null);
  
  // Filter subscriptions based on search term, plan, and status
  useEffect(() => {
    let result = subscriptions;
    
    if (searchTerm) {
      result = result.filter(subscription => 
        subscription.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedPlan !== 'all') {
      result = result.filter(subscription => subscription.plan === selectedPlan);
    }
    
    if (selectedStatus !== 'all') {
      result = result.filter(subscription => subscription.status === selectedStatus);
    }
    
    setFilteredSubscriptions(result);
  }, [searchTerm, selectedPlan, selectedStatus, subscriptions]);
  
  // Handle subscription status change
  const handleStatusChange = (subscriptionId: string, newStatus: string) => {
    const updatedSubscriptions = subscriptions.map(subscription => 
      subscription.id === subscriptionId ? { ...subscription, status: newStatus } : subscription
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
    
    const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
      if (a[key as keyof typeof a] < b[key as keyof typeof b]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key as keyof typeof a] > b[key as keyof typeof b]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredSubscriptions(sortedSubscriptions);
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscription Management</h1>
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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
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
              onChange={(e) => setSelectedStatus(e.target.value)}
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
              {filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((subscription) => (
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
                          <div className="text-xs text-gray-500">
                            Last payment: {subscription.lastPayment} ({subscription.amount})
                          </div>
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
                            onClick={() => handleStatusChange(subscription.id, 'active')}
                          >
                            Resolve
                          </button>
                        )}
                        {subscription.status === 'active' && (
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleStatusChange(subscription.id, 'cancelled')}
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
                  <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No subscriptions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
