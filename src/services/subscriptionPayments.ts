/**
 * Subscription payment service for handling Stripe subscription payments
 */
import { apiGet, apiPost, ApiResponse } from './api';

export interface SubscriptionCheckoutRequest {
  plan_type: 'free' | 'standard' | 'premium';
}

export interface SubscriptionCheckoutResponse {
  success: boolean;
  checkout_url?: string;
  session_id?: string;
  message: string;
}

export interface SubscriptionStatusResponse {
  success: boolean;
  subscription: {
    plan: string;
    status: string;
    start_date: string;
    end_date: string;
    auto_renew: boolean;
    last_payment: string;
    amount: number;
    contact_name: string;
    contact_email: string;
  } | null;
  has_subscription: boolean;
  message: string;
}

export interface SubscriptionCancelResponse {
  success: boolean;
  message: string;
}

export interface CheckoutVerificationResponse {
  success: boolean;
  payment_status: string;
  subscription_id?: string;
  message: string;
}

/**
 * Create a Stripe checkout session for subscription payment
 */
export async function createSubscriptionCheckout(
  planType: 'free' | 'standard' | 'premium'
): Promise<ApiResponse<SubscriptionCheckoutResponse>> {
  try {
    const response = await apiPost<SubscriptionCheckoutResponse>(
      '/payments/subscriptions/checkout/',
      { plan_type: planType },
      true
    );
    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to create subscription checkout',
      status: 500
    };
  }
}

/**
 * Cancel current subscription
 */
export async function cancelSubscription(): Promise<ApiResponse<SubscriptionCancelResponse>> {
  try {
    const response = await apiPost<SubscriptionCancelResponse>(
      '/payments/subscriptions/cancel/',
      {},
      true
    );
    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to cancel subscription',
      status: 500
    };
  }
}

/**
 * Get current subscription status with payment information
 */
export async function getSubscriptionPaymentStatus(): Promise<ApiResponse<SubscriptionStatusResponse>> {
  try {
    const response = await apiGet<SubscriptionStatusResponse>(
      '/payments/subscriptions/status/',
      true
    );
    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to get subscription status',
      status: 500
    };
  }
}

/**
 * Verify a Stripe checkout session
 */
export async function verifyCheckoutSession(
  sessionId: string
): Promise<ApiResponse<CheckoutVerificationResponse>> {
  try {
    const response = await apiGet<CheckoutVerificationResponse>(
      `/payments/subscriptions/verify-session/?session_id=${sessionId}`,
      true
    );
    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to verify checkout session',
      status: 500
    };
  }
}

/**
 * Handle subscription plan changes with Stripe payment
 * Redirects to Stripe Checkout for paid plans
 */
export async function changeSubscriptionPlan(
  newPlanType: 'free' | 'standard' | 'premium'
): Promise<{
  success: boolean;
  redirect_url?: string;
  message: string;
  is_free_plan?: boolean;
}> {
  try {
    // For free plan, no payment required
    if (newPlanType === 'free') {
      return {
        success: true,
        message: 'Free plan selected - no payment required',
        is_free_plan: true
      };
    }

    // For paid plans, create Stripe checkout session
    const checkoutResponse = await createSubscriptionCheckout(newPlanType);
    
    if (checkoutResponse.error || !checkoutResponse.data) {
      return {
        success: false,
        message: checkoutResponse.error || 'Failed to create checkout session'
      };
    }

    if (checkoutResponse.data.success && checkoutResponse.data.checkout_url) {
      return {
        success: true,
        redirect_url: checkoutResponse.data.checkout_url,
        message: `Redirecting to payment for ${newPlanType} plan...`
      };
    } else {
      return {
        success: false,
        message: checkoutResponse.data.message || 'Failed to create checkout session'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to change subscription plan'
    };
  }
}

/**
 * Get plan pricing information
 */
export function getPlanPricing(): {
  free: { price: number; currency: string };
  standard: { price: number; currency: string };
  premium: { price: number; currency: string };
} {
  return {
    free: { price: 0, currency: 'SEK' },
    standard: { price: 799, currency: 'SEK' },
    premium: { price: 999, currency: 'SEK' }
  };
}

/**
 * Format price for display
 */
export function formatSubscriptionPrice(price: number, currency: string = 'SEK'): string {
  if (price === 0) {
    return 'Free';
  }
  
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

/**
 * Get plan features based on plan type
 */
export function getPlanFeatures(planType: string): string[] {
  switch (planType) {
    case 'free':
      return [
        '5 active ads',
        'Basic search visibility',
        '9% commission on sales',
        'Standard support'
      ];
    case 'standard':
      return [
        '25 active ads',
        'Enhanced search visibility',
        '7% commission on sales',
        'Priority support',
        'Analytics dashboard',
        'Featured listing once per month'
      ];
    case 'premium':
      return [
        'Unlimited active ads',
        'Premium search visibility',
        '0% commission on sales',
        '24/7 priority support',
        'Advanced analytics',
        'Unlimited featured listings',
        'Custom branding options',
        'Priority customer matching'
      ];
    default:
      return [];
  }
}

/**
 * Get commission rate for plan type
 */
export function getCommissionRate(planType: string): string {
  switch (planType) {
    case 'free': return '9%';
    case 'standard': return '7%';
    case 'premium': return '0%';
    default: return '9%';
  }
}
