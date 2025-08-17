"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Calendar, Clock, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';
import { getUserPayoutSchedules, PayoutSchedule as PayoutScheduleType, formatCurrency, getStatusBadgeColor } from '@/services/payments';

interface PayoutScheduleProps {
  className?: string;
}

export default function PayoutSchedule({ className = '' }: PayoutScheduleProps) {
  const [payoutSchedules, setPayoutSchedules] = useState<PayoutScheduleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'processing' | 'completed' | 'failed'>('all');

  useEffect(() => {
    loadPayoutSchedules();
  }, []);

  const loadPayoutSchedules = async () => {
    try {
      const data = await getUserPayoutSchedules();
      setPayoutSchedules(data);
    } catch (error) {
      toast.error('Failed to load payout schedules', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string, isOverdue: boolean) => {
    if (isOverdue) {
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
    
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'scheduled':
        return <Calendar className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusMessage = (schedule: PayoutScheduleType) => {
    if (schedule.is_overdue) {
      return 'Overdue - Contact support if needed';
    }
    
    switch (schedule.status) {
      case 'scheduled':
        return `Scheduled for ${new Date(schedule.scheduled_date).toLocaleDateString()}`;
      case 'processing':
        return 'Being processed by our payment team';
      case 'completed':
        return `Completed on ${schedule.processed_date ? new Date(schedule.processed_date).toLocaleDateString() : 'N/A'}`;
      case 'failed':
        return 'Failed - Please contact support';
      default:
        return 'Status unknown';
    }
  };

  const filteredSchedules = payoutSchedules.filter(schedule => {
    if (filter === 'all') return true;
    return schedule.status === filter;
  });

  const totalPendingAmount = payoutSchedules
    .filter(s => s.status === 'scheduled' || s.status === 'processing')
    .reduce((sum, s) => sum + parseFloat(s.total_amount), 0);

  const completedAmount = payoutSchedules
    .filter(s => s.status === 'completed')
    .reduce((sum, s) => sum + parseFloat(s.total_amount), 0);

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
          <DollarSign className="w-6 h-6 text-[#FF8A00] mr-3" />
          <h2 className="text-xl font-semibold">Payout Schedule</h2>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-yellow-600 mr-2" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">Pending Payouts</p>
              <p className="text-lg font-bold text-yellow-900">{formatCurrency(totalPendingAmount)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm text-green-800 font-medium">Total Received</p>
              <p className="text-lg font-bold text-green-900">{formatCurrency(completedAmount)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm text-blue-800 font-medium">Total Schedules</p>
              <p className="text-lg font-bold text-blue-900">{payoutSchedules.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payout Schedule List */}
      {filteredSchedules.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No payout schedules found</p>
          <p className="text-sm text-gray-400 mt-1">
            {filter !== 'all' 
              ? 'Try adjusting your filter'
              : 'Your payout schedules will appear here once you make sales'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className={`border rounded-lg p-4 ${
                schedule.is_overdue 
                  ? 'border-red-200 bg-red-50' 
                  : 'border-gray-200 hover:bg-gray-50'
              } transition-colors`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(schedule.status, schedule.is_overdue)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900">
                        {formatCurrency(parseFloat(schedule.total_amount), schedule.currency)}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(schedule.status)}`}>
                        {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                      </span>
                      {schedule.is_overdue && (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                          Overdue
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {getStatusMessage(schedule)}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{schedule.transaction_count} transaction{schedule.transaction_count !== 1 ? 's' : ''}</span>
                      <span>Created {new Date(schedule.created_at).toLocaleDateString()}</span>
                      {schedule.created_by_email && (
                        <span>by {schedule.created_by_email}</span>
                      )}
                    </div>
                    {schedule.notes && (
                      <p className="text-sm text-gray-600 mt-2 italic">
                        Note: {schedule.notes}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Scheduled: {new Date(schedule.scheduled_date).toLocaleDateString()}
                  </p>
                  {schedule.processed_date && (
                    <p className="text-sm text-gray-500">
                      Processed: {new Date(schedule.processed_date).toLocaleDateString()}
                    </p>
                  )}
                  {schedule.stripe_payout_id && (
                    <p className="text-xs text-gray-400 font-mono mt-1">
                      {schedule.stripe_payout_id.slice(-8)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Information Box */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">About Payouts</p>
            <p>
              Payouts are processed manually by our admin team according to the scheduled dates. 
              You'll receive a notification when your payout is processed and the funds are sent to your bank account.
            </p>
          </div>
        </div>
      </div>

      {filteredSchedules.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Showing {filteredSchedules.length} of {payoutSchedules.length} schedules</span>
            <button
              onClick={loadPayoutSchedules}
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
