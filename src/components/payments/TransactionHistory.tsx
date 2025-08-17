"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { History, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
import { getUserTransactions, Transaction, formatCurrency, getStatusColor, getStatusBadgeColor } from '@/services/payments';

interface TransactionHistoryProps {
  className?: string;
}

export default function TransactionHistory({ className = '' }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'payment' | 'commission' | 'payout' | 'refund'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'failed' | 'canceled'>('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await getUserTransactions();
      setTransactions(data);
    } catch (error) {
      toast.error('Failed to load transactions', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionIcon = (type: string, isIncoming: boolean) => {
    switch (type) {
      case 'payment':
        return isIncoming ? (
          <ArrowDownLeft className="w-5 h-5 text-green-600" />
        ) : (
          <ArrowUpRight className="w-5 h-5 text-red-600" />
        );
      case 'commission':
        return <ArrowUpRight className="w-5 h-5 text-orange-600" />;
      case 'payout':
        return <ArrowDownLeft className="w-5 h-5 text-blue-600" />;
      case 'refund':
        return <ArrowDownLeft className="w-5 h-5 text-purple-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTransactionDescription = (transaction: Transaction, isIncoming: boolean) => {
    switch (transaction.transaction_type) {
      case 'payment':
        return isIncoming 
          ? `Payment received from ${transaction.from_user_email || 'buyer'}`
          : `Payment to ${transaction.to_user_email || 'seller'}`;
      case 'commission':
        return 'Platform commission';
      case 'payout':
        return isIncoming 
          ? 'Payout received'
          : 'Payout processed';
      case 'refund':
        return 'Refund processed';
      default:
        return transaction.description || 'Transaction';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter !== 'all' && transaction.transaction_type !== filter) {
      return false;
    }
    if (statusFilter !== 'all' && transaction.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
      case 'canceled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
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
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <History className="w-6 h-6 text-[#FF8A00] mr-3" />
          <h2 className="text-xl font-semibold">Transaction History</h2>
        </div>
        <div className="flex items-center space-x-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="payment">Payments</option>
            <option value="commission">Commission</option>
            <option value="payout">Payouts</option>
            <option value="refund">Refunds</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8">
          <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No transactions found</p>
          <p className="text-sm text-gray-400 mt-1">
            {filter !== 'all' || statusFilter !== 'all' 
              ? 'Try adjusting your filters'
              : 'Your transactions will appear here once you start buying or selling'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => {
            const isIncoming = !!transaction.to_user;
            const amount = parseFloat(transaction.amount);
            
            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getTransactionIcon(transaction.transaction_type, isIncoming)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {getTransactionDescription(transaction, isIncoming)}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {transaction.stripe_transfer_id && (
                        <span className="text-xs text-gray-400 font-mono">
                          {transaction.stripe_transfer_id.slice(-8)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`font-medium ${isIncoming ? 'text-green-600' : 'text-gray-900'}`}>
                      {isIncoming ? '+' : ''}{formatCurrency(amount, transaction.currency)}
                    </p>
                    <div className="flex items-center justify-end space-x-1 mt-1">
                      {getStatusIcon(transaction.status)}
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredTransactions.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Showing {filteredTransactions.length} of {transactions.length} transactions</span>
            <button
              onClick={loadTransactions}
              className="text-[#FF8A00] hover:text-[#e67c00] font-medium"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
