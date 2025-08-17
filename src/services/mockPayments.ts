// Mock payment data for testing the payment dashboard
// This provides realistic sample data when the backend isn't available

import { PaymentStats, PaymentIntent, Transaction, PayoutSchedule, StripeAccount, UserPaymentSummary } from './payments';

// Mock data for karera@gmail.com user
export const mockPaymentStats: PaymentStats = {
  total_payments: "7300.00",
  total_commission: "398.50",
  pending_payouts: "3700.00",
  active_sellers: 1,
  recent_transactions: 4,
  commission_rate_breakdown: {
    "0%": "2250.00",
    "7%": "2800.00", 
    "9%": "2250.00"
  }
};

export const mockPendingPayouts = {
  success: true,
  pending_payouts: [
    {
      seller: {
        id: 1,
        email: "karera@gmail.com",
        first_name: "Karera",
        last_name: "User",
        company_name: "Test Company"
      },
      total_amount: "3700.00",
      transaction_count: 3,
      oldest_transaction: "2024-01-10T10:00:00Z"
    }
  ],
  total_sellers: 1,
  total_amount: "3700.00"
};

export const mockUserStripeAccount: StripeAccount = {
  id: "stripe-account-1",
  user_id: 1,
  stripe_account_id: "acct_test_karera_1234",
  account_status: "active",
  bank_account_last4: "1234",
  bank_name: "Swedbank",
  bank_country: "SE",
  charges_enabled: true,
  payouts_enabled: true,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-15T00:00:00Z"
};

export const mockPaymentIntents: PaymentIntent[] = [
  {
    id: "pi-1",
    stripe_payment_intent_id: "pi_test_steel_123456",
    bid_id: 1,
    buyer_id: 2,
    seller_id: 1,
    total_amount: "1500.00",
    commission_amount: "135.00",
    seller_amount: "1365.00",
    commission_rate: "9.00",
    status: "succeeded",
    currency: "SEK",
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-10T10:30:00Z",
    confirmed_at: "2024-01-10T10:30:00Z",
    auction_title: "High-Grade Steel Scrap",
    auction_id: 1,
    buyer_company_name: "Nordic Steel AB",
    seller_company_name: "Recycling Solutions Ltd",
    buyer_email: "buyer@nordicsteel.se",
    seller_email: "karera@gmail.com"
  },
  {
    id: "pi-2",
    stripe_payment_intent_id: "pi_test_aluminum_789012",
    bid_id: 2,
    buyer_id: 3,
    seller_id: 1,
    total_amount: "2800.00",
    commission_amount: "196.00",
    seller_amount: "2604.00",
    commission_rate: "7.00",
    status: "succeeded",
    currency: "SEK",
    created_at: "2024-01-12T14:00:00Z",
    updated_at: "2024-01-12T14:30:00Z",
    confirmed_at: "2024-01-12T14:30:00Z",
    auction_title: "Premium Aluminum Scrap",
    auction_id: 2,
    buyer_company_name: "Aluminum Works AB",
    seller_company_name: "Recycling Solutions Ltd",
    buyer_email: "procurement@aluminumworks.se",
    seller_email: "karera@gmail.com"
  },
  {
    id: "pi-3",
    stripe_payment_intent_id: "pi_test_copper_345678",
    bid_id: 3,
    buyer_id: 4,
    seller_id: 1,
    total_amount: "2250.00",
    commission_amount: "0.00",
    seller_amount: "2250.00",
    commission_rate: "0.00",
    status: "succeeded",
    currency: "SEK",
    created_at: "2024-01-14T16:00:00Z",
    updated_at: "2024-01-14T16:30:00Z",
    confirmed_at: "2024-01-14T16:30:00Z",
    auction_title: "Pure Copper Wire Scrap",
    auction_id: 3,
    buyer_company_name: "Copper Industries AB",
    seller_company_name: "Recycling Solutions Ltd",
    buyer_email: "orders@copperindustries.se",
    seller_email: "karera@gmail.com"
  },
  {
    id: "pi-4",
    stripe_payment_intent_id: "pi_test_mixed_901234",
    bid_id: 4,
    buyer_id: 2,
    seller_id: 1,
    total_amount: "750.00",
    commission_amount: "67.50",
    seller_amount: "682.50",
    commission_rate: "9.00",
    status: "succeeded",
    currency: "SEK",
    created_at: "2024-01-13T12:00:00Z",
    updated_at: "2024-01-13T12:30:00Z",
    confirmed_at: "2024-01-13T12:30:00Z",
    auction_title: "Mixed Metal Scrap Lot",
    auction_id: 4,
    buyer_company_name: "Nordic Steel AB",
    seller_company_name: "Recycling Solutions Ltd",
    buyer_email: "buyer@nordicsteel.se",
    seller_email: "karera@gmail.com"
  }
];

export const mockTransactions: Transaction[] = [
  // Commission transactions
  {
    id: "tx-1",
    payment_intent_id: "pi-1",
    transaction_type: "commission",
    amount: "135.00",
    currency: "SEK",
    status: "completed",
    from_user_id: 2,
    to_user_id: null,
    description: "Commission from payment pi_test_steel_123456",
    created_at: "2024-01-10T10:30:00Z",
    updated_at: "2024-01-10T10:30:00Z",
    processed_at: "2024-01-10T10:30:00Z",
    auction_title: "High-Grade Steel Scrap",
    auction_id: 1,
    buyer_company_name: "Nordic Steel AB",
    seller_company_name: "Recycling Solutions Ltd"
  },
  {
    id: "tx-2",
    payment_intent_id: "pi-2",
    transaction_type: "commission",
    amount: "196.00",
    currency: "SEK",
    status: "completed",
    from_user_id: 3,
    to_user_id: null,
    description: "Commission from payment pi_test_aluminum_789012",
    created_at: "2024-01-12T14:30:00Z",
    updated_at: "2024-01-12T14:30:00Z",
    processed_at: "2024-01-12T14:30:00Z",
    auction_title: "Premium Aluminum Scrap",
    auction_id: 2,
    buyer_company_name: "Aluminum Works AB",
    seller_company_name: "Recycling Solutions Ltd"
  },
  {
    id: "tx-3",
    payment_intent_id: "pi-4",
    transaction_type: "commission",
    amount: "67.50",
    currency: "SEK",
    status: "completed",
    from_user_id: 2,
    to_user_id: null,
    description: "Commission from payment pi_test_mixed_901234",
    created_at: "2024-01-13T12:30:00Z",
    updated_at: "2024-01-13T12:30:00Z",
    processed_at: "2024-01-13T12:30:00Z",
    auction_title: "Mixed Metal Scrap Lot",
    auction_id: 4,
    buyer_company_name: "Nordic Steel AB",
    seller_company_name: "Recycling Solutions Ltd"
  },
  // Seller payout transactions
  {
    id: "tx-4",
    payment_intent_id: "pi-1",
    transaction_type: "payout",
    amount: "1365.00",
    currency: "SEK",
    status: "pending",
    from_user_id: null,
    to_user_id: 1,
    description: "Seller payout from payment pi_test_steel_123456",
    created_at: "2024-01-10T10:30:00Z",
    updated_at: "2024-01-10T10:30:00Z",
    processed_at: null,
    auction_title: "High-Grade Steel Scrap",
    auction_id: 1,
    buyer_company_name: "Nordic Steel AB",
    seller_company_name: "Recycling Solutions Ltd"
  },
  {
    id: "tx-5",
    payment_intent_id: "pi-2",
    transaction_type: "payout",
    amount: "2604.00",
    currency: "SEK",
    status: "pending",
    from_user_id: null,
    to_user_id: 1,
    description: "Seller payout from payment pi_test_aluminum_789012",
    created_at: "2024-01-12T14:30:00Z",
    updated_at: "2024-01-12T14:30:00Z",
    processed_at: null,
    auction_title: "Premium Aluminum Scrap",
    auction_id: 2,
    buyer_company_name: "Aluminum Works AB",
    seller_company_name: "Recycling Solutions Ltd"
  },
  {
    id: "tx-6",
    payment_intent_id: "pi-3",
    transaction_type: "payout",
    amount: "2250.00",
    currency: "SEK",
    status: "pending",
    from_user_id: null,
    to_user_id: 1,
    description: "Seller payout from payment pi_test_copper_345678",
    created_at: "2024-01-14T16:30:00Z",
    updated_at: "2024-01-14T16:30:00Z",
    processed_at: null,
    auction_title: "Pure Copper Wire Scrap",
    auction_id: 3,
    buyer_company_name: "Copper Industries AB",
    seller_company_name: "Recycling Solutions Ltd"
  },
  {
    id: "tx-7",
    payment_intent_id: "pi-4",
    transaction_type: "payout",
    amount: "682.50",
    currency: "SEK",
    status: "pending",
    from_user_id: null,
    to_user_id: 1,
    description: "Seller payout from payment pi_test_mixed_901234",
    created_at: "2024-01-13T12:30:00Z",
    updated_at: "2024-01-13T12:30:00Z",
    processed_at: null,
    auction_title: "Mixed Metal Scrap Lot",
    auction_id: 4,
    buyer_company_name: "Nordic Steel AB",
    seller_company_name: "Recycling Solutions Ltd"
  }
];

export const mockPayoutSchedules: PayoutSchedule[] = [
  {
    id: "ps-1",
    seller_id: 1,
    total_amount: "1500.00",
    currency: "SEK",
    status: "completed",
    scheduled_date: "2024-01-08",
    processed_date: "2024-01-12",
    stripe_payout_id: "po_test_completed_123",
    created_by_id: 1,
    processed_by_id: 1,
    notes: "Monthly payout batch - completed",
    created_at: "2024-01-08T00:00:00Z",
    updated_at: "2024-01-12T00:00:00Z"
  },
  {
    id: "ps-2", 
    seller_id: 1,
    total_amount: "2800.00",
    currency: "SEK",
    status: "scheduled",
    scheduled_date: "2024-01-20",
    processed_date: null,
    stripe_payout_id: null,
    created_by_id: 1,
    processed_by_id: null,
    notes: "Upcoming payout batch",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z"
  },
  {
    id: "ps-3",
    seller_id: 1,
    total_amount: "900.00", 
    currency: "SEK",
    status: "scheduled",
    scheduled_date: "2024-01-13",
    processed_date: null,
    stripe_payout_id: null,
    created_by_id: 1,
    processed_by_id: null,
    notes: "Overdue payout - needs attention",
    created_at: "2024-01-12T00:00:00Z",
    updated_at: "2024-01-12T00:00:00Z"
  }
];

export const mockUserPaymentSummary: UserPaymentSummary = {
  total_received: "1500.00",
  pending_payouts: "6901.50",
  total_sales: "7300.00",
  commission_paid: "398.50",
  currency: "SEK"
};
