"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Clock,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import {
  getPaymentStats,
  getPendingPayouts,
  createPayoutSchedules,
  processPayouts,
  getAdminPaymentIntents,
  getAdminTransactions,
  PaymentStats,
  PaymentIntent,
  AdminTransaction,
  formatCurrency,
  getStatusBadgeColor,
  PendingPayout
} from '@/services/payments';

interface AdminPaymentDashboardProps {
  className?: string;
}

type TabType = 'overview' | 'payment-intents' | 'transactions';

export default function AdminPaymentDashboard({ className = '' }: AdminPaymentDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [pendingPayouts, setPendingPayouts] = useState<any>(null);
  const [paymentIntents, setPaymentIntents] = useState<PaymentIntent[]>([]);
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSellers, setSelectedSellers] = useState<number[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<Record<number, string[]>>({}); // seller_id -> transaction_ids
  const [expandedSellers, setExpandedSellers] = useState<Set<number>>(new Set());
  const [scheduledDate, setScheduledDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isCreatingSchedule, setIsCreatingSchedule] = useState(false);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Pagination states
  const [paymentIntentsPage, setPaymentIntentsPage] = useState(1);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const itemsPerPage = 10;

  // Separate loading functions for each tab
  const loadOverviewData = useCallback(async () => {
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

      const [statsData, pendingData] = await Promise.all([
        getPaymentStats(startDate),
        getPendingPayouts()
      ]);

      setStats(statsData);
      setPendingPayouts(pendingData);
    } catch (error) {
      toast.error('Failed to load overview data', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  const loadPaymentIntentsData = useCallback(async () => {
    try {
      setIsLoading(true);
      const paymentIntentsData = await getAdminPaymentIntents();
      // Ensure paymentIntentsData is an array
      setPaymentIntents(Array.isArray(paymentIntentsData) ? paymentIntentsData : []);
    } catch (error) {
      setPaymentIntents([]); // Reset to empty array on error
      toast.error('Failed to load payment intents', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadTransactionsData = useCallback(async () => {
    try {
      setIsLoading(true);
      const transactionsData = await getAdminTransactions();
      // Ensure transactionsData is an array
      setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
    } catch (error) {
      setTransactions([]); // Reset to empty array on error
      toast.error('Failed to load transactions', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only load overview data initially
    if (activeTab === 'overview') {
      loadOverviewData();
    }
  }, [dateRange, loadOverviewData, activeTab]);

  // Handle tab changes with lazy loading
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    
    // Load data only when tab is clicked
    switch (tab) {
      case 'overview':
        if (!stats || !pendingPayouts) {
          loadOverviewData();
        }
        break;
      case 'payment-intents':
        if (!Array.isArray(paymentIntents) || paymentIntents.length === 0) {
          loadPaymentIntentsData();
        }
        break;
      case 'transactions':
        if (!Array.isArray(transactions) || transactions.length === 0) {
          loadTransactionsData();
        }
        break;
    }
  };

  const toggleSellerExpanded = (sellerId: number) => {
    setExpandedSellers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sellerId)) {
        newSet.delete(sellerId);
      } else {
        newSet.add(sellerId);
      }
      return newSet;
    });
  };

  const handleSellerTotalToggle = (sellerId: number, payout: PendingPayout) => {
    // Toggle entire seller (all transactions)
    if (selectedSellers.includes(sellerId)) {
      // Deselect seller and all transactions
      setSelectedSellers(prev => prev.filter(id => id !== sellerId));
      setSelectedTransactions(prev => {
        const newState = { ...prev };
        delete newState[sellerId];
        return newState;
      });
    } else {
      // Select seller with all transactions
      setSelectedSellers(prev => [...prev, sellerId]);
      if (payout.transactions && payout.transactions.length > 0) {
        setSelectedTransactions(prev => ({
          ...prev,
          [sellerId]: payout.transactions!.map(t => t.id)
        }));
      }
    }
  };

  const handleTransactionToggle = (sellerId: number, transactionId: string, payout: PendingPayout) => {
    setSelectedTransactions(prev => {
      const sellerTransactions = prev[sellerId] || [];
      const isSelected = sellerTransactions.includes(transactionId);
      
      let newSellerTransactions: string[];
      if (isSelected) {
        // Deselect transaction
        newSellerTransactions = sellerTransactions.filter(id => id !== transactionId);
      } else {
        // Select transaction
        newSellerTransactions = [...sellerTransactions, transactionId];
      }

      const newState = {
        ...prev,
        [sellerId]: newSellerTransactions
      };

      // If all transactions are selected, also select the seller
      // If no transactions are selected, deselect the seller
      const allTransactionIds = payout.transactions?.map(t => t.id) || [];
      if (newSellerTransactions.length === allTransactionIds.length && allTransactionIds.length > 0) {
        if (!selectedSellers.includes(sellerId)) {
          setSelectedSellers(prev => [...prev, sellerId]);
        }
      } else if (newSellerTransactions.length === 0) {
        setSelectedSellers(prev => prev.filter(id => id !== sellerId));
        delete newState[sellerId];
      } else {
        // Partial selection - keep seller selected
        if (!selectedSellers.includes(sellerId)) {
          setSelectedSellers(prev => [...prev, sellerId]);
        }
      }

      return newState;
    });
  };

  const handleSelectAll = () => {
    if (!pendingPayouts?.pending_payouts) return;
    
    if (selectedSellers.length === pendingPayouts.pending_payouts.length) {
      // Deselect all
      setSelectedSellers([]);
      setSelectedTransactions({});
    } else {
      // Select all sellers with all their transactions
      const allSellers = pendingPayouts.pending_payouts.map((p: PendingPayout) => p.seller.id);
      setSelectedSellers(allSellers);
      
      const allTransactions: Record<number, string[]> = {};
      pendingPayouts.pending_payouts.forEach((p: PendingPayout) => {
        if (p.transactions && p.transactions.length > 0) {
          allTransactions[p.seller.id] = p.transactions.map(t => t.id);
        }
      });
      setSelectedTransactions(allTransactions);
    }
  };

  const handleCreatePayoutSchedule = async () => {
    if (selectedSellers.length === 0) {
      toast.error('Please select at least one seller or transaction');
      return;
    }

    if (!scheduledDate) {
      toast.error('Please select a scheduled date');
      return;
    }

    setIsCreatingSchedule(true);

    try {
      // Build transaction_ids map: convert seller IDs (numbers) to strings for the API
      const transactionIdsMap: Record<string, string[]> = {};
      selectedSellers.forEach(sellerId => {
        const transactionIds = selectedTransactions[sellerId];
        if (transactionIds && transactionIds.length > 0) {
          transactionIdsMap[sellerId.toString()] = transactionIds;
        }
      });

      const result = await createPayoutSchedules({
        seller_ids: selectedSellers,
        scheduled_date: scheduledDate,
        notes: notes,
        transaction_ids: Object.keys(transactionIdsMap).length > 0 ? transactionIdsMap : undefined
      });

      if (result.success) {
        toast.success('Payout schedules created successfully', {
          description: `Created ${result.created_schedules.length} payout schedules`
        });
        setSelectedSellers([]);
        setSelectedTransactions({});
        setScheduledDate('');
        setNotes('');
        loadOverviewData(); // Refresh data
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

  const handleDirectPayout = async (sellerId: number) => {
    if (!confirm('Are you sure you want to process this payout immediately?')) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Create immediate payout schedule (today's date)
      const today = new Date().toISOString().split('T')[0];
      const result = await createPayoutSchedules({
        seller_ids: [sellerId],
        scheduled_date: today,
        notes: 'Direct payout - processed immediately'
      });

      if (result.success && result.created_schedules.length > 0) {
        // Process the payout immediately
        const processResult = await processPayouts({
          payout_schedule_ids: result.created_schedules.map(s => s.id),
          force_process: true
        });

        if (processResult.success) {
          toast.success('Payout processed successfully', {
            description: 'Payment has been sent to the seller'
          });
          loadOverviewData(); // Refresh data
        } else {
          toast.error('Failed to process payout', {
            description: processResult.message
          });
        }
      } else {
        toast.error('Failed to create payout schedule', {
          description: result.message
        });
      }
    } catch (error) {
      toast.error('Failed to process direct payout', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsLoading(false);
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
            onClick={() => handleTabChange('overview')}
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
            onClick={() => handleTabChange('payment-intents')}
            className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'payment-intents'
                ? 'border-[#FF8A00] text-[#FF8A00]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <TrendingUp size={16} className="mr-2" />
            Payment Intents
          </button>
          <button
            onClick={() => handleTabChange('transactions')}
            className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'transactions'
                ? 'border-[#FF8A00] text-[#FF8A00]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <TrendingUp size={16} className="mr-2" />
            Transactions
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
                  {pendingPayouts.pending_payouts?.map((payout: PendingPayout) => {
                    const isExpanded = expandedSellers.has(payout.seller.id);
                    const isSellerSelected = selectedSellers.includes(payout.seller.id);
                    const selectedTransactionIds = selectedTransactions[payout.seller.id] || [];
                    const hasTransactions = payout.transactions && payout.transactions.length > 0;
                    const allTransactionsSelected = hasTransactions && 
                      selectedTransactionIds.length === payout.transactions!.length &&
                      payout.transactions!.length > 0;
                    const someTransactionsSelected = selectedTransactionIds.length > 0 && 
                      selectedTransactionIds.length < (payout.transactions?.length || 0);

                    return (
                      <div
                        key={payout.seller.id}
                        className="border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between p-3">
                          <div className="flex items-center space-x-3 flex-1">
                            <input
                              type="checkbox"
                              checked={isSellerSelected && allTransactionsSelected}
                              ref={(input) => {
                                if (input) input.indeterminate = someTransactionsSelected;
                              }}
                              onChange={() => handleSellerTotalToggle(payout.seller.id, payout)}
                              className="w-4 h-4 text-[#FF8A00] border-gray-300 rounded focus:ring-[#FF8A00]"
                            />
                            {hasTransactions && (
                              <button
                                onClick={() => toggleSellerExpanded(payout.seller.id)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                aria-label={isExpanded ? 'Collapse' : 'Expand'}
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-gray-600" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-600" />
                                )}
                              </button>
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{payout.seller.name || payout.seller.email}</p>
                              <p className="text-sm text-gray-600">{payout.seller.email}</p>
                              <p className="text-sm text-gray-600">
                                {payout.transaction_count} transaction{payout.transaction_count !== 1 ? 's' : ''}
                                {' • '}
                                Oldest: {new Date(payout.oldest_transaction).toLocaleDateString()}
                                {someTransactionsSelected && (
                                  <span className="ml-2 text-[#FF8A00]">
                                    ({selectedTransactionIds.length} of {payout.transaction_count} selected)
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                {formatCurrency(parseFloat(payout.total_amount), 'SEK')}
                              </p>
                              {someTransactionsSelected && (
                                <p className="text-xs text-[#FF8A00]">
                                  {formatCurrency(
                                    payout.transactions
                                      ?.filter(t => selectedTransactionIds.includes(t.id))
                                      .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0,
                                    'SEK'
                                  )} selected
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => handleDirectPayout(payout.seller.id)}
                              className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                              Pay Now
                            </button>
                          </div>
                        </div>
                        
                        {/* Expanded Transaction List */}
                        {isExpanded && hasTransactions && (
                          <div className="border-t border-gray-200 bg-gray-50">
                            <div className="p-3 space-y-2">
                              <p className="text-xs font-medium text-gray-700 mb-2">Select individual transactions:</p>
                              {payout.transactions!.map((transaction) => {
                                const isTransactionSelected = selectedTransactionIds.includes(transaction.id);
                                return (
                                  <div
                                    key={transaction.id}
                                    className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 hover:bg-gray-50"
                                  >
                                    <div className="flex items-center space-x-3 flex-1">
                                      <input
                                        type="checkbox"
                                        checked={isTransactionSelected}
                                        onChange={() => handleTransactionToggle(payout.seller.id, transaction.id, payout)}
                                        className="w-4 h-4 text-[#FF8A00] border-gray-300 rounded focus:ring-[#FF8A00]"
                                      />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                          {transaction.auction_title || `Transaction ${transaction.id.slice(-8)}`}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                          {new Date(transaction.created_at).toLocaleDateString()}
                                          {transaction.description && ` • ${transaction.description}`}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-medium text-gray-900">
                                        {formatCurrency(parseFloat(transaction.amount), transaction.currency)}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
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

      {/* Payment Intents Tab */}
      {activeTab === 'payment-intents' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Payment Intents</h2>
            <div className="text-sm text-gray-600">
              {Array.isArray(paymentIntents) ? paymentIntents.length : 0} payment intent{(Array.isArray(paymentIntents) ? paymentIntents.length : 0) !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="overflow-x-auto mb-6">
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
                    Seller Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
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
                {(Array.isArray(paymentIntents) ? paymentIntents : [])
                  .slice((paymentIntentsPage - 1) * itemsPerPage, paymentIntentsPage * itemsPerPage)
                  .map((payment) => (
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
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="font-medium">{payment.seller_company_name || 'Unknown Company'}</div>
                        <div className="text-xs text-gray-500">{payment.seller_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatCurrency(parseFloat(payment.total_amount), payment.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#FF8A00] font-medium">
                        {formatCurrency(parseFloat(payment.commission_amount), payment.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        {formatCurrency(parseFloat(payment.seller_amount), payment.currency)}
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

          {/* Pagination for Payment Intents */}
          <Pagination
            currentPage={paymentIntentsPage}
            totalPages={Math.ceil((Array.isArray(paymentIntents) ? paymentIntents.length : 0) / itemsPerPage)}
            totalItems={Array.isArray(paymentIntents) ? paymentIntents.length : 0}
            itemsPerPage={itemsPerPage}
            onPageChange={setPaymentIntentsPage}
          />
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Transaction Details</h2>
            <div className="text-sm text-gray-600">
              {Array.isArray(transactions) ? transactions.length : 0} transaction{(Array.isArray(transactions) ? transactions.length : 0) !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="overflow-x-auto mb-6">
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
                    From Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To Company
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
                {(Array.isArray(transactions) ? transactions : [])
                  .slice((transactionsPage - 1) * itemsPerPage, transactionsPage * itemsPerPage)
                  .map((transaction) => {
                    // Helper function to get company names based on transaction type and direction
                    const getFromCompanyInfo = () => {
                      // For payment transactions: buyer is paying (FROM buyer TO platform)
                      if (transaction.transaction_type === 'payment') {
                        // Try direct fields first
                        if (transaction.buyer_company_name && transaction.from_user_email) {
                          return {
                            company: transaction.buyer_company_name,
                            email: transaction.from_user_email
                          };
                        }
                        // Fallback to payment_intent_details
                        if (transaction.payment_intent_details) {
                          return {
                            company: transaction.payment_intent_details.buyer_company_name || 'Unknown Company',
                            email: transaction.payment_intent_details.buyer_email || 'No email'
                          };
                        }
                      }
                      // For payout transactions: platform is paying out (FROM platform TO seller)
                      // So FROM should be platform/empty for payouts
                      return {
                        company: 'NordicLoop Platform',
                        email: 'platform@nordicloop.com'
                      };
                    };

                    const getToCompanyInfo = () => {
                      // For payout transactions: money goes to seller (FROM platform TO seller)
                      if (transaction.transaction_type === 'payout') {
                        // Try direct fields first
                        if (transaction.seller_company_name && transaction.to_user_email) {
                          return {
                            company: transaction.seller_company_name,
                            email: transaction.to_user_email
                          };
                        }
                        // Fallback to payment_intent_details
                        if (transaction.payment_intent_details) {
                          return {
                            company: transaction.payment_intent_details.seller_company_name || 'Unknown Company',
                            email: transaction.payment_intent_details.seller_email || 'No email'
                          };
                        }
                      }
                      // For payment transactions: money goes to platform (FROM buyer TO platform)
                      // So TO should be platform for payments
                      return {
                        company: 'NordicLoop Platform',
                        email: 'platform@nordicloop.com'
                      };
                    };

                    const fromCompany = getFromCompanyInfo();
                    const toCompany = getToCompanyInfo();

                    return (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.id.slice(-8)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">{transaction.auction_title || 'Unknown Auction'}</div>
                          <div className="text-xs text-gray-500">Transaction ID: {transaction.id.slice(-8)}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium text-blue-600">{fromCompany.company}</div>
                          <div className="text-xs text-gray-500">{fromCompany.email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium text-green-600">{toCompany.company}</div>
                          <div className="text-xs text-gray-500">{toCompany.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {(() => {
                            const getBadgeColor = () => {
                              if (transaction.transaction_type === 'commission') {
                                return 'bg-orange-100 text-orange-800';
                              } else if (transaction.transaction_type === 'payout') {
                                return 'bg-green-100 text-green-800';
                              }
                              return 'bg-blue-100 text-blue-800';
                            };
                            
                            return (
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBadgeColor()}`}>
                                {transaction.transaction_type}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {(() => {
                            const getAmountColor = () => {
                              if (transaction.transaction_type === 'commission') {
                                return 'text-[#FF8A00]';
                              } else if (transaction.transaction_type === 'payout') {
                                return 'text-green-600';
                              }
                              return 'text-gray-900';
                            };
                            
                            return (
                              <span className={getAmountColor()}>
                                {formatCurrency(Number.parseFloat(transaction.amount), transaction.currency)}
                              </span>
                            );
                          })()}
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
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Pagination for Transactions */}
          <Pagination
            currentPage={transactionsPage}
            totalPages={Math.ceil((Array.isArray(transactions) ? transactions.length : 0) / itemsPerPage)}
            totalItems={Array.isArray(transactions) ? transactions.length : 0}
            itemsPerPage={itemsPerPage}
            onPageChange={setTransactionsPage}
          />
        </div>
      )}
    </div>
  );
}
