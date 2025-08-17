import { apiGet, apiPost } from './api';
import {
  mockPaymentStats,
  mockPendingPayouts,
  mockUserStripeAccount,
  mockPaymentIntents,
  mockTransactions,
  mockPayoutSchedules,
  mockUserPaymentSummary
} from './mockPayments';

// Flag to enable/disable mock data (set to true when backend is unavailable)
const USE_MOCK_DATA = true;

// Types for payment-related data
export interface StripeAccount {
  id: string;
  user_id: number;
  stripe_account_id: string;
  account_status: 'pending' | 'active' | 'restricted' | 'inactive';
  bank_account_last4?: string;
  bank_name?: string;
  bank_country?: string;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface BankAccountSetup {
  account_holder_name: string;
  account_number: string;
  routing_number?: string;
  bank_name: string;
  bank_country?: string;
  currency?: string;
}

export interface PaymentIntent {
  id: string;
  stripe_payment_intent_id: string;
  bid_id: number;
  buyer_id: number;
  seller_id: number;
  total_amount: string;
  commission_amount: string;
  seller_amount: string;
  commission_rate: string;
  status: string;
  currency: string;
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
}

export interface Transaction {
  id: string;
  payment_intent_id: string;
  transaction_type: 'payment' | 'commission' | 'payout' | 'refund';
  amount: string;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'canceled';
  from_user_id?: number;
  to_user_id?: number;
  description?: string;
  created_at: string;
  updated_at: string;
  processed_at?: string;
}

export interface PayoutSchedule {
  id: string;
  seller_id: number;
  total_amount: string;
  currency: string;
  status: 'scheduled' | 'processing' | 'completed' | 'failed' | 'canceled';
  scheduled_date: string;
  processed_date?: string;
  stripe_payout_id?: string;
  created_by_id?: number;
  processed_by_id?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentStats {
  total_payments: string;
  total_commission: string;
  pending_payouts: string;
  active_sellers: number;
  recent_transactions: number;
  commission_rate_breakdown: {
    [rate: string]: string;
  };
}

export interface UserPaymentSummary {
  total_received: string;
  pending_payouts: string;
  total_sales: string;
  commission_paid: string;
  currency: string;
}

// User payment services
export const setupBankAccount = async (bankAccountData: BankAccountSetup): Promise<{
  success: boolean;
  message: string;
  stripe_account?: StripeAccount;
}> => {
  const response = await apiPost('/payments/bank-account/', bankAccountData, true);
  return response.data || { success: false, message: response.error || 'Failed to setup bank account' };
};

export const getUserStripeAccount = async (): Promise<StripeAccount> => {
  if (USE_MOCK_DATA) {
    return mockUserStripeAccount;
  }

  const response = await apiGet<StripeAccount>('/payments/bank-account/', true);
  if (response.data) {
    return response.data;
  }
  throw new Error(response.error || 'Failed to get stripe account');
};

export const createPaymentIntent = async (bidId: number, returnUrl?: string): Promise<{
  success: boolean;
  payment_intent?: PaymentIntent;
  client_secret?: string;
  message: string;
}> => {
  const response = await apiPost('/payments/payment-intent/', {
    bid_id: bidId,
    return_url: returnUrl
  }, true);
  return response.data || { success: false, message: response.error || 'Failed to create payment intent' };
};

export const getUserPaymentIntents = async (): Promise<PaymentIntent[]> => {
  if (USE_MOCK_DATA) {
    return mockPaymentIntents;
  }

  const response = await apiGet<PaymentIntent[]>('/payments/payment-intent/', true);
  return response.data || [];
};

export const getUserTransactions = async (): Promise<Transaction[]> => {
  if (USE_MOCK_DATA) {
    return mockTransactions;
  }

  const response = await apiGet<Transaction[]>('/payments/transactions/', true);
  return response.data || [];
};

export const getUserPayoutSchedules = async (): Promise<PayoutSchedule[]> => {
  if (USE_MOCK_DATA) {
    return mockPayoutSchedules;
  }

  const response = await apiGet<PayoutSchedule[]>('/payments/payouts/', true);
  return response.data || [];
};

export const getUserPaymentSummary = async (): Promise<UserPaymentSummary> => {
  if (USE_MOCK_DATA) {
    return mockUserPaymentSummary;
  }

  const response = await apiGet<UserPaymentSummary>('/payments/summary/', true);
  if (response.data) {
    return response.data;
  }
  throw new Error(response.error || 'Failed to get payment summary');
};

// Admin payment services
export const getPaymentStats = async (startDate?: string, endDate?: string): Promise<PaymentStats> => {
  if (USE_MOCK_DATA) {
    return mockPaymentStats;
  }

  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);

  const response = await apiGet<PaymentStats>(`/payments/admin/stats/?${params.toString()}`, true);
  if (response.data) {
    return response.data;
  }
  throw new Error(response.error || 'Failed to get payment stats');
};

export const getPendingPayouts = async (): Promise<{
  success: boolean;
  pending_payouts: Array<{
    seller: any;
    total_amount: string;
    transaction_count: number;
    oldest_transaction: string;
  }>;
  total_sellers: number;
  total_amount: string;
}> => {
  if (USE_MOCK_DATA) {
    return mockPendingPayouts;
  }

  const response = await apiGet<{
    success: boolean;
    pending_payouts: Array<{
      seller: any;
      total_amount: string;
      transaction_count: number;
      oldest_transaction: string;
    }>;
    total_sellers: number;
    total_amount: string;
  }>('/payments/admin/pending-payouts/', true);

  if (response.data) {
    return response.data;
  }
  throw new Error(response.error || 'Failed to get pending payouts');
};

export const createPayoutSchedules = async (data: {
  seller_ids: number[];
  scheduled_date: string;
  notes?: string;
}): Promise<{
  success: boolean;
  created_schedules: PayoutSchedule[];
  errors: string[];
  message: string;
}> => {
  const response = await apiPost('/payments/admin/payout-schedules/', data, true);
  return response.data || { success: false, created_schedules: [], errors: [response.error || 'Failed to create payout schedules'], message: response.error || 'Failed to create payout schedules' };
};

export const getAllPayoutSchedules = async (): Promise<PayoutSchedule[]> => {
  if (USE_MOCK_DATA) {
    return mockPayoutSchedules;
  }

  const response = await apiGet<PayoutSchedule[]>('/payments/admin/payout-schedules/', true);
  return response.data || [];
};

export const processPayouts = async (data: {
  payout_schedule_ids: string[];
  force_process?: boolean;
}): Promise<{
  success: boolean;
  processed_payouts: PayoutSchedule[];
  errors: string[];
  message: string;
}> => {
  const response = await apiPost('/payments/admin/process-payouts/', data, true);
  return response.data || { success: false, processed_payouts: [], errors: [response.error || 'Failed to process payouts'], message: response.error || 'Failed to process payouts' };
};

// Utility functions
export const formatCurrency = (amount: string | number, currency: string = 'SEK'): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: currency,
  }).format(numAmount);
};

export const getCommissionRate = (planType: string): string => {
  switch (planType) {
    case 'free': return '9%';
    case 'standard': return '7%';
    case 'premium': return '0%';
    default: return '9%';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'succeeded':
    case 'completed':
    case 'active':
      return 'text-green-600';
    case 'pending':
    case 'scheduled':
      return 'text-yellow-600';
    case 'failed':
    case 'canceled':
    case 'restricted':
      return 'text-red-600';
    case 'processing':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
};

export const getStatusBadgeColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'succeeded':
    case 'completed':
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'pending':
    case 'scheduled':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
    case 'canceled':
    case 'restricted':
      return 'bg-red-100 text-red-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
