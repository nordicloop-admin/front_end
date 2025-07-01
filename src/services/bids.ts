/**
 * Bids service for handling admin bid management
 */
import { apiGet, apiPut } from './api';

/**
 * Interface for admin bid list response
 */
interface AdminBidListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminBid[];
  page_size: number;
  total_pages: number;
  current_page: number;
}

/**
 * Interface for admin bid data
 */
interface AdminBid {
  id: string;
  itemId: string;
  itemName: string;
  bidderName: string;
  bidderEmail: string;
  bidAmount: number;
  volume: number;
  unit: string;
  status: 'active' | 'pending' | 'outbid' | 'rejected' | 'won';
  bidDate: string;
  bidderCompany?: string;
  bidderPhone?: string;
  bidderId?: string;
  message?: string;
}

/**
 * Interface for admin bid query parameters
 */
interface AdminBidParams {
  search?: string;
  status?: string;
  page?: number;
  page_size?: number;
}

/**
 * Get bids list for admin with filtering and pagination
 * @param params Query parameters for filtering and pagination
 * @returns The bids list response
 */
export async function getAdminBids(params: AdminBidParams = {}) {
  try {
    // Build query string
    const queryParams = new URLSearchParams();
    
    if (params.search) {
      queryParams.append('search', params.search);
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
    const endpoint = `/bids/admin/bids/${queryString ? `?${queryString}` : ''}`;

    const response = await apiGet<AdminBidListResponse>(endpoint, true);

    // Transform the response to match frontend expectations if needed
    if (response.data?.results) {
      response.data.results = response.data.results.map(bid => ({
        ...bid,
        // Map any backend field names to frontend field names if needed
        // The user specified not to change models, so we should exclude fields not in our model
      }));
    }

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching bids',
      status: 500
    };
  }
}

/**
 * Get a specific bid by ID for admin
 * @param bidId The bid ID
 * @returns The bid data
 */
export async function getAdminBid(bidId: string) {
  try {
    const response = await apiGet<AdminBid>(`/bids/admin/bids/${bidId}/`, true);

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching bid details',
      status: 500
    };
  }
}

/**
 * Update the status of a bid
 * @param bidId The bid ID to update
 * @param newStatus The new status for the bid
 * @returns Response with updated bid or error
 */
export async function updateBidStatus(bidId: string, newStatus: string) {
  try {
    const response = await apiPut<AdminBid>(
      `/bids/admin/bids/${bidId}/status/`,
      { status: newStatus },
      true
    );

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while updating bid status',
      status: 500
    };
  }
}

// Export types for use in components
export type { AdminBid, AdminBidListResponse, AdminBidParams }; 