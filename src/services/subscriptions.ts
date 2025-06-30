/**
 * Subscriptions service for handling admin subscription management
 */
import { apiGet } from './api';

/**
 * Interface for admin subscription list response
 */
interface AdminSubscriptionListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminSubscription[];
  page_size: number;
  total_pages: number;
  current_page: number;
}

/**
 * Interface for admin subscription data
 */
interface AdminSubscription {
  id: string;
  companyId: string;
  companyName: string;
  plan: 'free' | 'standard' | 'premium';
  status: 'active' | 'expired' | 'payment_failed' | 'cancelled';
  startDate: string;
  endDate: string | null;
  autoRenew: boolean;
  paymentMethod: 'credit_card' | 'invoice' | null;
  lastPayment: string | null;
  amount: string;
  contactName: string;
  contactEmail: string;
}

/**
 * Interface for admin subscription query parameters
 */
interface AdminSubscriptionParams {
  search?: string;
  plan?: string;
  status?: string;
  page?: number;
  page_size?: number;
}

/**
 * Get subscriptions list for admin with filtering and pagination
 * @param params Query parameters for filtering and pagination
 * @returns The subscriptions list response
 */
export async function getAdminSubscriptions(params: AdminSubscriptionParams = {}) {
  try {
    // Build query string
    const queryParams = new URLSearchParams();
    
    if (params.search) {
      queryParams.append('search', params.search);
    }
    
    if (params.plan) {
      queryParams.append('plan', params.plan);
    }
    
    if (params.status) {
      queryParams.append('status', params.status);
    }
    
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    
    if (params.page_size) {
      queryParams.append('page_size', params.page_size.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = `/ads/admin/subscriptions/${queryString ? `?${queryString}` : ''}`;

    const response = await apiGet<AdminSubscriptionListResponse>(endpoint, true);

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching subscriptions',
      status: 500
    };
  }
}

/**
 * Get a specific subscription by ID for admin
 * @param subscriptionId The subscription ID
 * @returns The subscription data
 */
export async function getAdminSubscription(subscriptionId: string) {
  try {
    const response = await apiGet<AdminSubscription>(`/ads/admin/subscriptions/${subscriptionId}/`, true);

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching subscription details',
      status: 500
    };
  }
}

// Export types for use in components
export type { AdminSubscription, AdminSubscriptionListResponse, AdminSubscriptionParams }; 