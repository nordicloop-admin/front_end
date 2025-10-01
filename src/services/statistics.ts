/**
 * Statistics service for handling platform statistics
 */
import { apiGet } from './api';

/**
 * Interface for platform statistics response
 */
export interface PlatformStatistics {
  total_bids: number;
  total_companies: number;
  total_users: number;
  pending_companies: number;
  active_bids: number;
  winning_bids: number;
}

/**
 * Interface for total bids count response
 */
export interface TotalBidsResponse {
  total_bids: number;
}

/**
 * Interface for recent bid in user dashboard statistics
 */
export interface RecentBid {
  id: number;
  status: string;
  price: number;
  created_at: string;
  ad_id: number;
}

/**
 * Interface for recent ad in user dashboard statistics
 */
export interface RecentAd {
  id: number;
  title: string;
  status: string;
  created_at: string;
  bids_count: number;
}

/**
 * Interface for user dashboard statistics response
 */
export interface UserDashboardStatistics {
  user_id: number;
  username: string;
  active_bids: number;
  winning_bids: number;
  total_bids: number;
  active_ads: number;
  recent_bids: RecentBid[];
  recent_ads: RecentAd[];
  company_id: number;
  company_name: string;
  subscription: string;
  verification_status: string;
  is_verified: boolean;
  pending_verification: boolean;
  verification_message: string;
  // Payment related additions
  payment?: {
    account_id: string | null;
    onboarding_complete: boolean;
    capabilities_complete: boolean;
    payment_ready: boolean;
    last_payment_check: string | null;
  };
  payment_state?: 'not_started' | 'in_progress' | 'capabilities_pending' | 'finalizing' | 'ready';
}

/**
 * Fetch platform statistics
 * @returns The API response with platform statistics
 */
export async function getPlatformStatistics() {
  try {
    // This endpoint requires authentication
    const response = await apiGet<PlatformStatistics>('/base/stats/', true);

    if (response.error) {
      return {
        data: null,
        error: response.error,
        status: response.status
      };
    }

    return {
      data: response.data,
      error: null,
      status: response.status
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching platform statistics',
      status: 500
    };
  }
}

/**
 * Fetch user dashboard statistics
 * @returns The API response with user dashboard statistics
 */
export async function getUserDashboardStatistics() {
  try {
    // This endpoint requires authentication
    const response = await apiGet<UserDashboardStatistics>('/base/dashboard/stats/', true);

    if (response.error) {
      return {
        data: null,
        error: response.error,
        status: response.status
      };
    }

    return {
      data: response.data,
      error: null,
      status: response.status
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching dashboard statistics',
      status: 500
    };
  }
}

/**
 * Get total bids count
 * @returns The API response with the total number of bids
 */
export async function getTotalBidsCount() {
  try {
    // This endpoint requires authentication
    const response = await apiGet<TotalBidsResponse>('/base/bids/count/', true);

    if (response.error) {
      return {
        data: null,
        error: response.error,
        status: response.status
      };
    }

    return {
      data: response.data,
      error: null,
      status: response.status
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching total bids count',
      status: 500
    };
  }
} 