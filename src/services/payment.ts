/**
 * Payment service for handling Stripe Connect payment setup
 */
import { apiGet, apiPost } from './api';

/**
 * Interface for account status response
 */
export interface AccountStatusResponse {
  company_id: number;
  company_name: string;
  payment_ready: boolean;
  stripe_onboarding_complete: boolean;
  stripe_capabilities_complete: boolean;
  account_info: {
    exists: boolean;
    account_id: string | null;
    charges_enabled: boolean;
    payouts_enabled: boolean;
    details_submitted: boolean;
    requirements: string[];
    capabilities: {
      card_payments?: string;
      transfers?: string;
    };
    country?: string;
    email?: string;
    type?: string;
  };
}

/**
 * Interface for account creation response
 */
export interface AccountCreateResponse {
  message: string;
  account_id: string;
  onboarding_url: string;
}

/**
 * Interface for onboarding link response
 */
export interface OnboardingLinkResponse {
  message: string;
  onboarding_url: string;
}

/**
 * Interface for dashboard link response
 */
export interface DashboardLinkResponse {
  message: string;
  dashboard_url: string;
}

/**
 * Get the current Stripe account status
 * @returns The API response with account status
 */
export async function getAccountStatus() {
  try {
    const response = await apiGet<AccountStatusResponse>('/company/payments/account-status/', true);
    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching account status',
      status: 500
    };
  }
}

/**
 * Create a new Stripe Express account
 * @returns The API response with account creation details and onboarding URL
 */
export async function createPaymentAccount() {
  try {
    const response = await apiPost<AccountCreateResponse>('/company/payments/create-account/', {}, true);
    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while creating payment account',
      status: 500
    };
  }
}

/**
 * Create a new onboarding link for existing account
 * @returns The API response with onboarding URL
 */
export async function createOnboardingLink() {
  try {
    const response = await apiPost<OnboardingLinkResponse>('/company/payments/create-onboarding-link/', {}, true);
    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while creating onboarding link',
      status: 500
    };
  }
}

/**
 * Get Stripe dashboard link for managing account
 * @returns The API response with dashboard URL
 */
export async function getDashboardLink() {
  try {
    const response = await apiPost<DashboardLinkResponse>('/company/payments/dashboard-link/', {}, true);
    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while getting dashboard link',
      status: 500
    };
  }
}