'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/services/payments';
import Pagination from '@/components/ui/Pagination';
import { 
  getUserTransactions, 
  Transaction
} from '@/services/payments';
import { History, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';

interface TransactionHistoryProps {
  className?: string;
}

type UserRoleFilter = 'all' | 'buyer' | 'seller';

export default function TransactionHistory({ className = '' }: TransactionHistoryProps) {
  const { user } = useAuth();
  const [userRoleFilter, setUserRoleFilter] = useState<UserRoleFilter>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Pagination states
  const [transactionsPage, setTransactionsPage] = useState(1);
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

  // Initial load for transactions
  useEffect(() => {
    loadTransactionData();
  }, [user, loadTransactionData]);

  // Refresh data
  const refreshData = () => {
    loadTransactionData();
  };

  // Get transaction description with company names
  const getTransactionDescription = (transaction: Transaction) => {
    return transaction.description || `${transaction.transaction_type} for auction: ${transaction.auction_title}`;
  };

  // Filter transactions based on user role
  const filteredTransactions = transactions.filter(transaction => {
    if (userRoleFilter === 'all') return true;
    return transaction.user_role === userRoleFilter;
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

  if (isLoading && transactions.length === 0) {
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

      {/* Transactions Table */}
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
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Other Party</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {getTransactionDescription(transaction)}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.user_role === 'buyer' 
                              ? 'bg-blue-100 text-blue-800' 
                              : transaction.user_role === 'seller'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {transaction.user_role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">
                          <span className={transaction.user_role === 'buyer' ? 'text-red-600' : 'text-green-600'}>
                            {transaction.user_role === 'buyer' ? '-' : '+'}
                            {formatCurrency(transaction.amount, transaction.currency)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {getStatusIcon(transaction.status)}
                            <span className={`ml-2 ${getStatusBadge(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div>
                            <div className="font-medium text-gray-900">
                              {transaction.other_party_company || 'Unknown Company'}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {transaction.other_party_email || 'N/A'}
                            </div>
                          </div>
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
    </div>
  );
}