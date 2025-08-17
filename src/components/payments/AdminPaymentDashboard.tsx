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
  PaymentStats, 
  formatCurrency 
} from '@/services/payments';

interface AdminPaymentDashboardProps {
  className?: string;
}

export default function AdminPaymentDashboard({ className = '' }: AdminPaymentDashboardProps) {
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [pendingPayouts, setPendingPayouts] = useState<any>(null);
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

      const [statsData, pendingData] = await Promise.all([
        getPaymentStats(startDate),
        getPendingPayouts()
      ]);

      setStats(statsData);
      setPendingPayouts(pendingData);
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
                  className="w-full bg-[#FF8A00] text-white py-2 px-4 rounded-md hover:bg-[#e67c00] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCreatingSchedule ? 'Creating...' : 'Create Schedule'}
                </button>
              </div>
            </div>
          </div>

          {/* Sellers List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Sellers with Pending Payouts</h4>
              <button
                onClick={handleSelectAll}
                className="text-sm text-[#FF8A00] hover:text-[#e67c00] font-medium"
              >
                {selectedSellers.length === pendingPayouts.pending_payouts?.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {pendingPayouts.pending_payouts?.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-4" />
                <p className="text-gray-500">No pending payouts</p>
                <p className="text-sm text-gray-400 mt-1">All sellers have been paid up to date</p>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
