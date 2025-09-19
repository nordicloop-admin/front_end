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
    last_payment: string | null;
    next_billing_date: string | null;
    amount: string;
    contact_name: string;
    contact_email: string;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    cancel_at_period_end: boolean;
    canceled_at: string | null;
    trial_end: string | null;
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
 * Handle subscription plan changes with improved Stripe payment integration
 * Now supports proper plan upgrades, downgrades, and proration
 */
export async function changeSubscriptionPlan(
  newPlanType: 'free' | 'standard' | 'premium'
): Promise<{
  success: boolean;
  redirect_url?: string;
  message: string;
  is_free_plan?: boolean;
  prorated?: boolean;
  session_id?: string;
}> {
  try {
    // Use the new plan change endpoint
    const response = await apiPost<{
      success: boolean;
      message: string;
      redirect_url?: string;
      is_free_plan?: boolean;
      prorated?: boolean;
      session_id?: string;
    }>(
      '/payments/subscriptions/change-plan/',
      { plan_type: newPlanType },
      true
    );

    if (response.error || !response.data) {
      return {
        success: false,
        message: response.error || 'Failed to change subscription plan'
      };
    }

    const result = response.data;
    
    if (result.success) {
      return {
        success: true,
        message: result.message,
        redirect_url: result.redirect_url,
        is_free_plan: result.is_free_plan,
        prorated: result.prorated,
        session_id: result.session_id
      };
    } else {
      return {
        success: false,
        message: result.message || 'Failed to change subscription plan'
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
 * Check if subscription is currently active and usable
 */
export function isSubscriptionActive(subscription: SubscriptionStatusResponse['subscription']): boolean {
  if (!subscription) return false;
  return subscription.status === 'active' || subscription.status === 'trialing';
}

/**
 * Check if subscription is scheduled for cancellation
 */
export function isSubscriptionCanceling(subscription: SubscriptionStatusResponse['subscription']): boolean {
  if (!subscription) return false;
  return subscription.cancel_at_period_end === true;
}

/**
 * Check if subscription has payment issues
 */
export function hasPaymentIssues(subscription: SubscriptionStatusResponse['subscription']): boolean {
  if (!subscription) return false;
  return subscription.status === 'past_due' || subscription.status === 'payment_failed';
}

/**
 * Get user-friendly subscription status text
 */
export function getSubscriptionStatusText(subscription: SubscriptionStatusResponse['subscription']): string {
  if (!subscription) return 'No subscription';
  
  switch (subscription.status) {
    case 'active':
      if (subscription.cancel_at_period_end) {
        return `Active until ${subscription.end_date}`;
      }
      return 'Active';
    case 'trialing':
      return `Trial until ${subscription.trial_end}`;
    case 'past_due':
      return 'Payment overdue';
    case 'payment_failed':
      return 'Payment failed';
    case 'canceled':
      return 'Canceled';
    case 'expired':
      return 'Expired';
    default:
      return subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1);
  }
}

/**
 * Get days until next billing or cancellation
 */
export function getDaysUntilNextBilling(subscription: SubscriptionStatusResponse['subscription']): number | null {
  if (!subscription) return null;
  
  const targetDate = subscription.cancel_at_period_end 
    ? subscription.end_date 
    : subscription.next_billing_date;
    
  if (!targetDate) return null;
  
  const today = new Date();
  const billing = new Date(targetDate);
  const diffTime = billing.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
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
