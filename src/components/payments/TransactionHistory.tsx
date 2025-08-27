'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/services/payments';
import Pagination from '@/components/ui/Pagination';
import { 
  getUserTransactions, 
  getUserPaymentIntents, 
  Transaction,
  PaymentIntent 
} from '@/services/payments';
import { History, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';

interface TransactionHistoryProps {
  className?: string;
}

type TabType = 'transactions' | 'payment-intents';
type UserRoleFilter = 'all' | 'buyer' | 'seller';

export default function TransactionHistory({ className = '' }: TransactionHistoryProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('transactions');
  const [userRoleFilter, setUserRoleFilter] = useState<UserRoleFilter>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentIntents, setPaymentIntents] = useState<PaymentIntent[]>([]);

  // Pagination states
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const itemsPerPage = 10;

  // Load transaction data
  const loadTransactionData = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const data = await getUserTransactions();
      setTransactions(data);
    } catch (_err) {
      setError('Failed to load transactions');
      // Error logging removed for production
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load payment intent data
  const loadPaymentData = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const data = await getUserPaymentIntents();
      setPaymentIntents(data);
    } catch (_err) {
      setError('Failed to load payment intents');
      // Error logging removed for production
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Initial load for transactions
  useEffect(() => {
    loadTransactionData();
  }, [user, loadTransactionData]);

  // Handle tab changes with lazy loading
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'payment-intents' && paymentIntents.length === 0) {
      loadPaymentData();
    } else if (tab === 'transactions' && transactions.length === 0) {
      loadTransactionData();
    }
  };

  // Refresh data for active tab
  const refreshData = () => {
    if (activeTab === 'transactions') {
      loadTransactionData();
    } else {
      loadPaymentData();
    }
  };

  // Get transaction description with company names
  const getTransactionDescription = (transaction: Transaction) => {
    if (transaction.type === 'payment') {
      return `Payment for auction: ${transaction.auction_title}`;
    } else if (transaction.type === 'payout') {
      return `Seller payout for auction: ${transaction.auction_title}`;
    } else if (transaction.type === 'commission') {
      return `Commission from auction: ${transaction.auction_title}`;
    }
    return 'Transaction';
  };

  // Filter transactions based on user role
  const filteredTransactions = transactions.filter(transaction => {
    if (userRoleFilter === 'all') return true;
    if (userRoleFilter === 'buyer') {
      // Check if user was the buyer (based on email if available, otherwise show all)
      return transaction.from_user_email === user?.email || !transaction.from_user_email;
    }
    if (userRoleFilter === 'seller') {
      // Check if user was the seller (based on email if available, otherwise show all)
      return transaction.to_user_email === user?.email || !transaction.to_user_email;
    }
    return true;
  });

  // Filter payment intents
  const filteredPaymentIntents = paymentIntents.filter(payment => {
    if (userRoleFilter === 'all') return true;
    if (userRoleFilter === 'buyer') {
      // Check if user was the buyer (based on email if available, otherwise show all)
      return payment.buyer_email === user?.email || !payment.buyer_email;
    }
    if (userRoleFilter === 'seller') {
      // Check if user was the seller (based on email if available, otherwise show all)
      return payment.seller_email === user?.email || !payment.seller_email;
    }
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'succeeded':
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
      case 'canceled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'completed':
      case 'succeeded':
      case 'paid':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'failed':
      case 'canceled':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'pending':
      case 'processing':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Pagination logic
  const paginatedTransactions = filteredTransactions.slice(
    (transactionsPage - 1) * itemsPerPage,
    transactionsPage * itemsPerPage
  );

  const paginatedPaymentIntents = filteredPaymentIntents.slice(
    (paymentsPage - 1) * itemsPerPage,
    paymentsPage * itemsPerPage
  );

  if (isLoading && activeTab === 'transactions' && transactions.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF8A00]"></div>
        </div>
      </div>
    );
  }

  if (isLoading && activeTab === 'payment-intents' && paymentIntents.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF8A00]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <History className="w-6 h-6 text-[#FF8A00] mr-3" />
          <h2 className="text-xl font-semibold">Payment History</h2>
        </div>
        <button
          onClick={refreshData}
          className="px-4 py-2 bg-[#FF8A00] text-white rounded-lg hover:bg-[#e67900] transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => handleTabChange('transactions')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'transactions'
              ? 'bg-white text-[#FF8A00] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Transaction Details
        </button>
        <button
          onClick={() => handleTabChange('payment-intents')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'payment-intents'
              ? 'bg-white text-[#FF8A00] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Payment Intents
        </button>
      </div>

      {/* Role Filter */}
      <div className="mb-4">
        <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Role:
        </label>
          <select
          id="roleFilter"
          value={userRoleFilter}
          onChange={(e) => setUserRoleFilter(e.target.value as UserRoleFilter)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="all">All Transactions</option>
          <option value="buyer">As Buyer</option>
          <option value="seller">As Seller</option>
          </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Transaction Details Tab */}
      {activeTab === 'transactions' && (
        <div>
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No transactions found</p>
        </div>
      ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Auction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {getTransactionDescription(transaction)}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className="capitalize">{transaction.type}</span>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {getStatusIcon(transaction.status)}
                            <span className={`ml-2 ${getStatusBadge(transaction.status)}`}>
                              {transaction.status}
                      </span>
                    </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          #{transaction.auction_id}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>

              {/* Pagination for Transactions */}
              {filteredTransactions.length > itemsPerPage && (
                <div className="mt-6">
                  <Pagination
                    currentPage={transactionsPage}
                    totalPages={Math.ceil(filteredTransactions.length / itemsPerPage)}
                    totalItems={filteredTransactions.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setTransactionsPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Payment Intents Tab */}
      {activeTab === 'payment-intents' && (
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF8A00]"></div>
            </div>
          ) : filteredPaymentIntents.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No payment intents found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Intent ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Auction</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Seller</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPaymentIntents.map((payment) => (
                      <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm font-mono">
                          {payment.stripe_payment_intent_id?.slice(-12) || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">
                          {formatCurrency(payment.amount, payment.currency)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {getStatusIcon(payment.status)}
                            <span className={`ml-2 ${getStatusBadge(payment.status)}`}>
                              {payment.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div>
                            <div className="font-medium">{payment.auction_title}</div>
                            <div className="text-gray-500 text-xs">#{payment.auction_id}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {payment.seller_company_name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination for Payment Intents */}
              {filteredPaymentIntents.length > itemsPerPage && (
                <div className="mt-6">
                  <Pagination
                    currentPage={paymentsPage}
                    totalPages={Math.ceil(filteredPaymentIntents.length / itemsPerPage)}
                    totalItems={filteredPaymentIntents.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setPaymentsPage}
                  />
          </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}