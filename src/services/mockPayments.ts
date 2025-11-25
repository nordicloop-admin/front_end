// Commented out unused imports to satisfy ESLint
// import { apiGet, apiPost } from './api';
import {
  PaymentStats,
  PaymentIntent,
  Transaction,
  PayoutSchedule,
  StripeAccount,
  UserPaymentSummary
} from './payments';

// Mock data for development and testing
export const mockUserStripeAccount: StripeAccount = {
  id: "acct_test_123456",
  user_id: 1,
  stripe_account_id: "acct_test_123456",
  account_status: "active",
  bank_account_last4: "3456",
  bank_name: "Nordea Bank",
  bank_country: "SE",
  charges_enabled: true,
  payouts_enabled: true,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-15T00:00:00Z"
};

// Mock payment intents data
export const mockPaymentIntents: PaymentIntent[] = [
  {
    id: "pi_1",
    stripe_payment_intent_id: "pi_test_steel_123456",
    bid_id: 1,
    buyer_id: 1,
    seller_id: 2,
    total_amount: "1500.00",
    commission_amount: "135.00",
    seller_amount: "1365.00",
    commission_rate: "9.0",
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
    seller_email: "seller@recyclingsolutions.se"
  },
  {
    id: "pi_2",
    stripe_payment_intent_id: "pi_test_aluminum_789012",
    bid_id: 2,
    buyer_id: 2,
    seller_id: 3,
    total_amount: "2800.00",
    commission_amount: "252.00",
    seller_amount: "2548.00",
    commission_rate: "9.0",
    status: "succeeded",
    currency: "SEK",
    created_at: "2024-01-12T14:00:00Z",
    updated_at: "2024-01-12T14:30:00Z",
    confirmed_at: "2024-01-12T14:30:00Z",
    auction_title: "Premium Aluminum Scrap",
    auction_id: 2,
    buyer_company_name: "Aluminum Works AB",
    seller_company_name: "Metal Recycling Ltd",
    buyer_email: "procurement@aluminumworks.se",
    seller_email: "sales@metalrecycling.se"
  },
  {
    id: "pi_3",
    stripe_payment_intent_id: "pi_test_copper_345678",
    bid_id: 3,
    buyer_id: 3,
    seller_id: 2,
    total_amount: "750.00",
    commission_amount: "67.50",
    seller_amount: "682.50",
    commission_rate: "9.0",
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
    seller_email: "seller@recyclingsolutions.se"
  },
  {
    id: "pi_4",
    stripe_payment_intent_id: "pi_test_mixed_901234",
    bid_id: 4,
    buyer_id: 1,
    seller_id: 4,
    total_amount: "1200.00",
    commission_amount: "108.00",
    seller_amount: "1092.00",
    commission_rate: "9.0",
    status: "processing",
    currency: "SEK",
    created_at: "2024-01-13T12:00:00Z",
    updated_at: "2024-01-13T12:30:00Z",
    auction_title: "Mixed Metal Scrap Lot",
    auction_id: 4,
    buyer_company_name: "Nordic Steel AB",
    seller_company_name: "Industrial Waste Solutions",
    buyer_email: "buyer@nordicsteel.se",
    seller_email: "contact@industrialwaste.se"
  }
];

// Mock transactions data that matches the Transaction interface
export const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    transaction_type: "commission",
    amount: "135.00",
    currency: "SEK",
    status: "completed",
    description: "Commission from Steel Scrap auction",
    transaction_date: "2024-01-10T10:30:00Z",
    auction_title: "High-Grade Steel Scrap",
    user_role: "buyer",
    other_party_email: "seller@recyclingsolutions.se",
    other_party_company: "Recycling Solutions Ltd"
  },
  {
    id: "tx-2",
    transaction_type: "commission",
    amount: "252.00",
    currency: "SEK",
    status: "completed",
    description: "Commission from Aluminum Scrap auction",
    transaction_date: "2024-01-12T14:30:00Z",
    auction_title: "Premium Aluminum Scrap",
    user_role: "buyer",
    other_party_email: "sales@metalrecycling.se",
    other_party_company: "Metal Recycling Ltd"
  },
  {
    id: "tx-3",
    transaction_type: "commission",
    amount: "67.50",
    currency: "SEK",
    status: "completed",
    description: "Commission from Copper Wire auction",
    transaction_date: "2024-01-14T16:30:00Z",
    auction_title: "Pure Copper Wire Scrap",
    user_role: "buyer",
    other_party_email: "seller@recyclingsolutions.se",
    other_party_company: "Recycling Solutions Ltd"
  },
  {
    id: "tx-4",
    transaction_type: "payment",
    amount: "1365.00",
    currency: "SEK",
    status: "completed",
    description: "Payment for Steel Scrap auction",
    transaction_date: "2024-01-10T10:30:00Z",
    auction_title: "High-Grade Steel Scrap",
    user_role: "seller",
    other_party_email: "buyer@nordicsteel.se",
    other_party_company: "Nordic Steel AB"
  },
  {
    id: "tx-5",
    transaction_type: "payment",
    amount: "2548.00",
    currency: "SEK",
    status: "completed",
    description: "Payment for Aluminum Scrap auction",
    transaction_date: "2024-01-12T14:30:00Z",
    auction_title: "Premium Aluminum Scrap",
    user_role: "seller",
    other_party_email: "procurement@aluminumworks.se",
    other_party_company: "Aluminum Works AB"
  },
  {
    id: "tx-6",
    transaction_type: "payment",
    amount: "682.50",
    currency: "SEK",
    status: "completed",
    description: "Payment for Copper Wire auction",
    transaction_date: "2024-01-14T16:30:00Z",
    auction_title: "Pure Copper Wire Scrap",
    user_role: "seller",
    other_party_email: "orders@copperindustries.se",
    other_party_company: "Copper Industries AB"
  },
  {
    id: "tx-7",
    transaction_type: "payout",
    amount: "1092.00",
    currency: "SEK",
    status: "pending",
    description: "Pending payout for Mixed Metal auction",
    transaction_date: "2024-01-13T12:30:00Z",
    auction_title: "Mixed Metal Scrap Lot",
    user_role: "seller",
    other_party_email: "buyer@nordicsteel.se",
    other_party_company: "Nordic Steel AB"
  }
];

// Mock payout schedules data
export const mockPayoutSchedules: PayoutSchedule[] = [
  {
    id: "ps_1",
    seller_id: 2,
    total_amount: "2047.50",
    currency: "SEK",
    status: "scheduled",
    scheduled_date: "2024-01-20T00:00:00Z",
    notes: "Regular weekly payout",
    created_at: "2024-01-12T00:00:00Z",
    updated_at: "2024-01-12T00:00:00Z"
  },
  {
    id: "ps_2",
    seller_id: 3,
    total_amount: "2548.00",
    currency: "SEK",
    status: "completed",
    scheduled_date: "2024-01-15T00:00:00Z",
    processed_date: "2024-01-15T10:00:00Z",
    stripe_payout_id: "po_test_12345",
    created_at: "2024-01-10T11:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "ps_3",
    seller_id: 4,
    total_amount: "1092.00",
    currency: "SEK",
    status: "processing",
    scheduled_date: "2024-01-18T00:00:00Z",
    created_at: "2024-01-12T15:00:00Z",
    updated_at: "2024-01-18T09:00:00Z"
  }
];

// Mock payment stats
export const mockPaymentStats: PaymentStats = {
  total_payments: "6250.00",
  total_commission: "562.50",
  pending_payouts: "1092.00",
  active_sellers: 3,
  recent_transactions: 7,
  commission_rate_breakdown: {
    "9%": "6250.00"
  }
};

// Mock pending payouts
export const mockPendingPayouts = {
  success: true,
  pending_payouts: [
    {
      seller: {
        id: 4,
        email: "contact@industrialwaste.se",
        name: "Industrial Waste Solutions"
      },
      total_amount: "1092.00",
      transaction_count: 1,
      oldest_transaction: "2024-01-13T12:30:00Z"
    }
  ],
  total_sellers: 1,
  total_amount: "1092.00"
};

// Mock user payment summary
export const mockUserPaymentSummary: UserPaymentSummary = {
  total_received: "4595.50",
  pending_payouts: "1092.00",
  total_sales: "5687.50",
  commission_paid: "562.50",
  currency: "SEK"
};