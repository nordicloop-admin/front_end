/**
 * Auctions service for handling admin auction management
 */
import { apiGet, apiPut } from './api';

/**
 * Interface for admin auction list response
 */
interface AdminAuctionListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminAuction[];
  page_size: number;
  total_pages: number;
  current_page: number;
}

/**
 * Interface for admin auction data
 */
interface AdminAuction {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  highestBid: number;
  status: 'active' | 'pending' | 'closed' | 'suspended';
  volume: string;
  seller: string;
  countryOfOrigin: string;
  createdAt: string;
  image: string;
  description?: string;
  company?: string;
  location?: string;
  endDate?: string;
  suspended_by_admin?: boolean;
}

/**
 * Interface for admin auction query parameters
 */
interface AdminAuctionParams {
  search?: string;
  status?: string;
  page?: number;
  page_size?: number;
}

/**
 * Get auctions list for admin with filtering and pagination
 * @param params Query parameters for filtering and pagination
 * @returns The auctions list response
 */
export async function getAdminAuctions(params: AdminAuctionParams = {}) {
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
    const endpoint = `/ads/admin/auctions/${queryString ? `?${queryString}` : ''}`;

    const response = await apiGet<AdminAuctionListResponse>(endpoint, true);

    // Transform the response to match frontend expectations if needed
    if (response.data?.results) {
      response.data.results = response.data.results.map(auction => ({
        ...auction,
        // Map any backend field names to frontend field names if needed
        // The user specified not to change models, so we should exclude fields not in our model
      }));
    }

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching auctions',
      status: 500
    };
  }
}

/**
 * Get a specific auction by ID for admin
 * @param auctionId The auction ID
 * @returns The auction data
 */
export async function getAdminAuction(auctionId: string) {
  try {
    const response = await apiGet<AdminAuction>(`/ads/admin/auctions/${auctionId}/`, true);

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching auction details',
      status: 500
    };
  }
}

/**
 * Update the status of an auction
 * @param auctionId The auction ID to update
 * @param newStatus The new status for the auction
 * @returns Response with updated auction or error
 */
export async function updateAuctionStatus(auctionId: string, newStatus: string) {
  try {
    const response = await apiPut<AdminAuction>(
      `/ads/admin/auctions/${auctionId}/status/`,
      { status: newStatus },
      true
    );

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while updating auction status',
      status: 500
    };
  }
}

// Export types for use in components
export type { AdminAuction, AdminAuctionListResponse, AdminAuctionParams }; 