"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';
import {
  getPaymentStats,
  getPendingPayouts,
  createPayoutSchedules,
  processPayouts,
  getUserPaymentIntents,
  getUserTransactions,
  PaymentStats,
  PaymentIntent,
  Transaction,
  formatCurrency,
  getStatusBadgeColor
} from '@/services/payments';

interface AdminPaymentDashboardProps {
  className?: string;
}

type TabType = 'overview' | 'transactions';

export default function AdminPaymentDashboard({ className = '' }: AdminPaymentDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [pendingPayouts, setPendingPayouts] = useState<any>(null);
  const [paymentIntents, setPaymentIntents] = useState<PaymentIntent[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSellers, setSelectedSellers] = useState<number[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isCreatingSchedule, setIsCreatingSchedule] = useState(false);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Calculate date range
      let startDate: string | undefined;
      if (dateRange !== 'all') {
        const days = parseInt(dateRange.replace('d', ''));
        const date = new Date();
        date.setDate(date.getDate() - days);
        startDate = date.toISOString().split('T')[0];
      }

      const [statsData, pendingData, paymentIntentsData, transactionsData] = await Promise.all([
        getPaymentStats(startDate),
        getPendingPayouts(),
        getUserPaymentIntents(),
        getUserTransactions()
      ]);

      setStats(statsData);
      setPendingPayouts(pendingData);
      setPaymentIntents(paymentIntentsData);
      setTransactions(transactionsData);
    } catch (error) {
      toast.error('Failed to load dashboard data', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSellerToggle = (sellerId: number) => {
    setSelectedSellers(prev => 
      prev.includes(sellerId) 
        ? prev.filter(id => id !== sellerId)
        : [...prev, sellerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSellers.length === pendingPayouts?.pending_payouts?.length) {
      setSelectedSellers([]);
    } else {
      setSelectedSellers(pendingPayouts?.pending_payouts?.map((p: any) => p.seller.id) || []);
    }
  };

  const handleCreatePayoutSchedule = async () => {
    if (selectedSellers.length === 0) {
      toast.error('Please select at least one seller');
      return;
    }

    if (!scheduledDate) {
      toast.error('Please select a scheduled date');
      return;
    }

    setIsCreatingSchedule(true);

    try {
      const result = await createPayoutSchedules({
        seller_ids: selectedSellers,
        scheduled_date: scheduledDate,
        notes: notes
      });

      if (result.success) {
        toast.success('Payout schedules created successfully', {
          description: `Created ${result.created_schedules.length} payout schedules`
        });
        setSelectedSellers([]);
        setScheduledDate('');
        setNotes('');
        loadDashboardData(); // Refresh data
      } else {
        toast.error('Failed to create payout schedules', {
          description: result.message
        });
      }
    } catch (error) {
      toast.error('Failed to create payout schedules', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsCreatingSchedule(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF8A00]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Payment Dashboard</h1>
        <div className="flex items-center space-x-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#FF8A00] text-[#FF8A00]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <DollarSign size={16} className="mr-2" />
            Overview & Payouts
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'transactions'
                ? 'border-[#FF8A00] text-[#FF8A00]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <TrendingUp size={16} className="mr-2" />
            All Transactions
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Total Payments</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(parseFloat(stats.total_payments), 'SEK')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-[#FF8A00] mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Commission Earned</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(parseFloat(stats.total_commission), 'SEK')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Pending Payouts</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(parseFloat(stats.pending_payouts), 'SEK')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Active Sellers</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.active_sellers}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pending Payouts Management */}
          {pendingPayouts && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Pending Payouts Management</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{pendingPayouts.total_sellers} sellers</span>
                  <span>•</span>
                  <span>{formatCurrency(parseFloat(pendingPayouts.total_amount))} total</span>
                </div>
              </div>

              {/* Create Payout Schedule Form */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-4">Create Payout Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Scheduled Date
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (optional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Monthly payout batch"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="text-sm text-gray-600">
                      {selectedSellers.length} seller{selectedSellers.length !== 1 ? 's' : ''} selected
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleCreatePayoutSchedule}
                      disabled={isCreatingSchedule || selectedSellers.length === 0 || !scheduledDate}
                      className="w-full bg-[#FF8A00] text-white px-4 py-2 rounded-md hover:bg-[#E67A00] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {isCreatingSchedule ? 'Creating...' : 'Create Schedule'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sellers List */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Sellers with Pending Payouts</h3>
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-[#FF8A00] hover:text-[#E67A00] font-medium"
                >
                  {selectedSellers.length === pendingPayouts.pending_payouts?.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {pendingPayouts.pending_payouts?.length > 0 ? (
                <div className="space-y-2">
                  {pendingPayouts.pending_payouts?.map((payout: any) => (
                    <div
                      key={payout.seller.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedSellers.includes(payout.seller.id)}
                          onChange={() => handleSellerToggle(payout.seller.id)}
                          className="w-4 h-4 text-[#FF8A00] border-gray-300 rounded focus:ring-[#FF8A00]"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{payout.seller.email}</p>
                          <p className="text-sm text-gray-600">
                            {payout.transaction_count} transaction{payout.transaction_count !== 1 ? 's' : ''}
                            {' • '}
                            Oldest: {new Date(payout.oldest_transaction).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(parseFloat(payout.total_amount))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No pending payouts found
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">All Transactions</h2>
            <div className="text-sm text-gray-600">
              {paymentIntents.length} payment{paymentIntents.length !== 1 ? 's' : ''} • {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Payment Intents Table */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Intents</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Auction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Buyer Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commission Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seller Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentIntents.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.stripe_payment_intent_id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="font-medium">{payment.auction_title || `Auction #${payment.auction_id || payment.bid_id}`}</div>
                        <div className="text-xs text-gray-500">ID: #{payment.auction_id || payment.bid_id}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="font-medium">{payment.buyer_company_name || 'Unknown Company'}</div>
                        <div className="text-xs text-gray-500">{payment.buyer_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatCurrency(parseFloat(payment.total_amount))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#FF8A00] font-medium">
                        {formatCurrency(parseFloat(payment.commission_amount))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {parseFloat(payment.commission_rate)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        {formatCurrency(parseFloat(payment.seller_amount))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transactions Table */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Auction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Companies
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="font-medium">{transaction.auction_title || `Auction #${transaction.auction_id}`}</div>
                        <div className="text-xs text-gray-500">ID: #{transaction.auction_id}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="text-xs">
                          <div className="font-medium text-blue-600">Buyer: {transaction.buyer_company_name}</div>
                          <div className="font-medium text-green-600">Seller: {transaction.seller_company_name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.transaction_type === 'commission'
                            ? 'bg-orange-100 text-orange-800'
                            : transaction.transaction_type === 'payout'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {transaction.transaction_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={
                          transaction.transaction_type === 'commission'
                            ? 'text-[#FF8A00]'
                            : transaction.transaction_type === 'payout'
                            ? 'text-green-600'
                            : 'text-gray-900'
                        }>
                          {formatCurrency(parseFloat(transaction.amount))}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
