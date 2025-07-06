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