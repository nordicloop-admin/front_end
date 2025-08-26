/**
 * Bid service for handling bid creation and management
 * Based on Nordic Loop Bidding System API
 */
import { apiPost, apiGet, apiPut, apiDelete, ApiResponse } from './api';

/**
 * Interface for bid creation data
 */
export interface BidCreateData {
  ad: number;                          // Ad ID (required)
  bid_price_per_unit: string;          // Bid price per unit (required)
  volume_requested: string;            // Volume requested (required)
  volume_type?: 'partial' | 'full';    // Volume type (optional, defaults to "partial")
  notes?: string;                      // Optional notes
  max_auto_bid_price?: string;         // Auto-bidding max price (optional)
}

/**
 * Interface for bid update data
 */
export interface BidUpdateData {
  bid_price_per_unit?: string;         // New bid price
  volume_requested?: string;           // New volume (optional)
  notes?: string;                      // Updated notes (optional)
  max_auto_bid_price?: string;         // New auto-bid limit (optional)
}

/**
 * Interface for pagination parameters
 */
export interface BidPaginationParams {
  page?: number;
  page_size?: number;
  status?: string;                     // Filter by bid status
  ad_id?: number;                      // Filter by specific ad ID
}

/**
 * Interface for bid search parameters
 */
export interface BidSearchParams extends BidPaginationParams {
  ad_title?: string;                   // Search by ad title
  category?: string;                   // Filter by material category
  min_price?: string;                  // Minimum bid price
  max_price?: string;                  // Maximum bid price
  user_id?: number;                    // Specific user's bids
}

/**
 * Interface for bid item data (from the API response)
 */
export interface BidItem {
  id: number;
  ad_id: number;
  ad_title: string;
  bidder_name: string;
  company_name?: string;
  bid_price_per_unit: string;
  volume_requested: string;
  total_bid_value: string;
  status: string;
  created_at: string;
  updated_at: string;
  // Optional fields that may be present in some responses
  currency?: string;
  unit?: string;
  is_winning?: boolean;
  rank?: number;
  volume_type?: string;
  is_auto_bid?: boolean;
  max_auto_bid_price?: string | null;
  notes?: string | null;
  // Additional fields for winning bids
  ad_user_email?: string;
  ad_category?: string;
  ad_location?: string;
}

/**
 * Interface for platform statistics
 */
export interface PlatformStatistics {
  total_bids: number;
  active_bids: number;
  total_bidders: number;
}

/**
 * Interface for bid statistics (for specific ad)
 */
export interface BidStatistics {
  total_bids: number;
  highest_bid: number;
  lowest_bid: number;
  average_bid: number;
  total_volume_requested: number;
  unique_bidders: number;
  current_highest_bid?: {
    bid_price_per_unit: number;
    total_bid_value: number;
    volume_requested: number;
    bidder: string;
    timestamp: string;
  };
}

/**
 * Interface for ad info (in bid responses)
 */
export interface AdInfo {
  id: number;
  title: string;
  starting_bid_price: number;
  reserve_price?: number;
  available_quantity: number;
  currency: string;
  auction_end_date?: string;
}

/**
 * Interface for paginated bid response
 */
export interface PaginatedBidResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BidItem[];
  page_size: number;
  total_pages: number;
  current_page: number;
  platform_statistics?: PlatformStatistics;
  bid_statistics?: BidStatistics;
  ad_info?: AdInfo;
}

/**
 * Interface for paginated bid result with extracted data
 */
export interface PaginatedBidResult {
  bids: BidItem[];
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
    page_size: number;
    total_pages: number;
    current_page: number;
  };
  statistics?: PlatformStatistics;
  bidStatistics?: BidStatistics;
  adInfo?: AdInfo;
}

/**
 * Interface for bid creation response
 */
export interface BidCreateResponse {
  message: string;
  bid: BidItem;
}

/**
 * Interface for bid update response
 */
export interface BidUpdateResponse {
  message: string;
  bid: BidItem;
}

/**
 * Interface for bid history entry
 */
export interface BidHistoryEntry {
  id: number;
  previous_price: string | null;
  new_price: string;
  previous_volume: string | null;
  new_volume: string;
  change_reason: string;
  timestamp: string;
}

/**
 * Interface for bid error response
 */
export interface BidErrorResponse {
  error: string;
  details?: Record<string, string[]>;
}

/**
 * Interface for user bids response
 */
export interface UserBidsResponse {
  user_id?: number;
  total_bids?: number;
  bids: UserBidItem[];
  pagination?: {
    count: number;
    next: string | null;
    previous: string | null;
    page_size: number;
    total_pages: number;
    current_page: number;
  };
  statistics?: {
    total_bids: number;
    active_bids: number;
    total_bidders: number;
  };
}

/**
 * Interface for user bid item
 */
export interface UserBidItem {
  id: number;
  ad_id: number;
  ad_title: string;
  bidder_name: string;
  bid_price_per_unit: string;
  volume_requested: string;
  total_bid_value: string;
  status: string;
  created_at: string;
  updated_at: string;
}

/**
 * Utility function to extract minimum bid amount from error message
 * @param errorMessage The error message from the API
 * @returns The minimum bid amount if found, null otherwise
 */
export function extractMinimumBidFromError(errorMessage: string): { amount: number; currency: string } | null {
  // Pattern to match "Bid price must be at least X.XX EUR" or similar
  const pattern = /bid price must be at least ([\d,.]+)\s*([A-Z]{3})/i;
  const match = errorMessage.match(pattern);
  
  if (match) {
    const amount = parseFloat(match[1].replace(/,/g, ''));
    const currency = match[2].toUpperCase();
    return { amount, currency };
  }
  
  return null;
}

/**
 * Create a new bid
 * @param bidData The bid data
 * @returns The API response with the created bid
 */
export async function createBid(bidData: BidCreateData) {
  try {
    // Create bid requires authentication
    const response = await apiPost<BidCreateResponse | BidErrorResponse>('/bids/create/', bidData, true);

    // If the response has an error status, format it properly
    if (response.error || (response.status && response.status >= 400)) {
      // Extract clean error message from API response
      let errorMessage = response.error || 'Failed to create bid';

      // Handle specific error format: "Failed to place bid: ['You cannot bid on your own ad.']"
      if (typeof response.data === 'object' && response.data !== null) {
        if ('error' in response.data) {
          const apiError = response.data.error;
          if (typeof apiError === 'string') {
            // Handle Django ValidationError format: "Failed to place bid: {'field': ErrorDetail(string='message', code='...')}"
            const validationErrorMatch = apiError.match(/ErrorDetail\(string='([^']+)'/);
            if (validationErrorMatch && validationErrorMatch[1]) {
              errorMessage = validationErrorMatch[1];
            } else {
              // Extract message from "Failed to place bid: ['Error message']" format
              const listMatch = apiError.match(/\['(.+?)'\]/);
              if (listMatch && listMatch[1]) {
                errorMessage = listMatch[1];
              } else {
                // Handle simple field validation errors like "{'bid_price_per_unit': 'Error message'}"
                const fieldErrorMatch = apiError.match(/'([^']+)'/g);
                if (fieldErrorMatch && fieldErrorMatch.length >= 2) {
                  // Take the second match which should be the error message
                  errorMessage = fieldErrorMatch[1].replace(/'/g, '');
                } else {
                  errorMessage = apiError;
                }
              }
            }
          }
        }

        // Handle validation errors in 'details' field
        if ('details' in response.data && typeof response.data.details === 'object') {
          const details = response.data.details;
          // Extract first error message from validation details
          for (const field in details) {
            if (Array.isArray(details[field]) && details[field].length > 0) {
              errorMessage = details[field][0];
              break;
            }
          }
        }
      }

      return {
        data: null,
        error: errorMessage,
        status: response.status || 500
      };
    }

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred during bid creation',
      status: 500
    };
  }
}

/**
 * Get all bids with pagination (platform-wide)
 * @param params Pagination and filter parameters
 * @returns The API response with the bids and pagination info
 */
export async function getAllBids(params?: BidPaginationParams) {
  try {
    // Build query string for pagination and filters
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
    if (params?.status) queryParams.set('status', params.status);
    if (params?.ad_id) queryParams.set('ad_id', params.ad_id.toString());
    
    const endpoint = `/bids/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    // Get bids requires authentication
    const response = await apiGet<PaginatedBidResponse>(endpoint, true);

    if (response.error) {
      return {
        data: null,
        error: response.error,
        status: response.status
      };
    }

    // Return both bids and pagination metadata
    const result: PaginatedBidResult = {
      bids: response.data?.results || [],
      pagination: {
        count: response.data?.count || 0,
        next: response.data?.next || null,
        previous: response.data?.previous || null,
        page_size: response.data?.page_size || 10,
        total_pages: response.data?.total_pages || 1,
        current_page: response.data?.current_page || 1
      },
      statistics: response.data?.platform_statistics
    };

    return {
      data: result,
      error: null,
      status: response.status
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching bids',
      status: 500
    };
  }
}

/**
 * Get all bids for a specific ad
 * @param adId The ad ID
 * @param params Optional pagination parameters
 * @returns The API response with the bids for the ad
 */
export async function getAdBids(adId: number, params?: BidPaginationParams) {
  try {
    // Build query string for pagination
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.page_size) queryParams.set('page_size', params.page_size.toString());

    const endpoint = `/bids/ad/${adId}/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    // Get bids does not require authentication (AllowAny permission)
    const response = await apiGet<any>(endpoint, false);

    if (response.error) {
      return {
        data: null,
        error: response.error,
        status: response.status
      };
    }

    // The backend returns: { ad_id, ad_title, total_bids, bids }
    // Transform to expected format for compatibility
    const result = {
      bids: response.data?.bids || [],
      total_bids: response.data?.total_bids || 0,
      ad_id: response.data?.ad_id,
      ad_title: response.data?.ad_title,
      // For backward compatibility with paginated format
      results: response.data?.bids || [],
      count: response.data?.total_bids || 0,
      pagination: {
        count: response.data?.total_bids || 0,
        next: null,
        previous: null,
        page_size: response.data?.bids?.length || 0,
        total_pages: 1,
        current_page: 1
      }
    };

    return {
      data: result,
      error: null,
      status: response.status
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching ad bids',
      status: 500
    };
  }
}

/**
 * Get all bids for the current user with pagination
 * @param params Pagination parameters
 * @returns The API response with the user's bids and pagination info
 */
export async function getUserBids(params?: BidPaginationParams) {
  try {
    // Build query string for pagination and filters
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
    if (params?.status) queryParams.set('status', params.status);

    const endpoint = `/bids/my/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    // Get user bids requires authentication
    const response = await apiGet<UserBidsResponse>(endpoint, true);

    if (response.error) {
      return {
        data: null,
        error: response.error,
        status: response.status
      };
    }

    // Map UserBidItem to BidItem format
    const mappedBids: BidItem[] = (response.data?.bids || []).map(bid => ({
      id: bid.id,
      ad_id: bid.ad_id, // Include the ad_id field
      bidder_name: bid.bidder_name,
      ad_title: bid.ad_title,
      bid_price_per_unit: bid.bid_price_per_unit,
      volume_requested: bid.volume_requested,
      total_bid_value: bid.total_bid_value,
      status: bid.status,
      created_at: bid.created_at,
      updated_at: bid.updated_at,
      // Add default values for required BidItem fields
      currency: 'EUR', // Default currency
      unit: 'kg',     // Default unit
      is_winning: bid.status === 'winning',
      rank: bid.status === 'winning' ? 1 : 0
    }));

    // Transform response to match expected format with pagination
    const result: PaginatedBidResult = {
      bids: mappedBids,
      pagination: response.data?.pagination || {
        count: mappedBids.length,
        next: null,
        previous: null,
        page_size: params?.page_size || 10,
        total_pages: Math.ceil(mappedBids.length / (params?.page_size || 10)),
        current_page: params?.page || 1
      },
      statistics: response.data?.statistics || {
        total_bids: mappedBids.length,
        active_bids: mappedBids.filter(bid => bid.status === 'active').length,
        total_bidders: 1
      }
    };

    return {
      data: result,
      error: null,
      status: response.status
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching your bids',
      status: 500
    };
  }
}

/**
 * Get user's winning bids
 * @param params Optional pagination parameters
 * @returns The API response with the user's winning bids
 */
export async function getUserWinningBids(params?: BidPaginationParams) {
  try {
    // Build query string for pagination
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
    
    const endpoint = `/bids/winning/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    // Get user winning bids requires authentication
    const response = await apiGet<PaginatedBidResponse>(endpoint, true);

    if (response.error) {
      return {
        data: null,
        error: response.error,
        status: response.status
      };
    }

    // Return both bids and pagination metadata
    const result: PaginatedBidResult = {
      bids: response.data?.results || [],
      pagination: {
        count: response.data?.count || 0,
        next: response.data?.next || null,
        previous: response.data?.previous || null,
        page_size: response.data?.page_size || 10,
        total_pages: response.data?.total_pages || 1,
        current_page: response.data?.current_page || 1
      }
    };

    return {
      data: result,
      error: null,
      status: response.status
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching your winning bids',
      status: 500
    };
  }
}

/**
 * Search bids with filters
 * @param params Search and filter parameters
 * @returns The API response with filtered bids
 */
export async function searchBids(params: BidSearchParams) {
  try {
    // Build query string for search and filters
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.page_size) queryParams.set('page_size', params.page_size.toString());
    if (params.ad_title) queryParams.set('ad_title', params.ad_title);
    if (params.category) queryParams.set('category', params.category);
    if (params.min_price) queryParams.set('min_price', params.min_price);
    if (params.max_price) queryParams.set('max_price', params.max_price);
    if (params.status) queryParams.set('status', params.status);
    if (params.user_id) queryParams.set('user_id', params.user_id.toString());
    
    const endpoint = `/bids/search/?${queryParams.toString()}`;
    
    // Search bids requires authentication
    const response = await apiGet<PaginatedBidResponse>(endpoint, true);

    if (response.error) {
      return {
        data: null,
        error: response.error,
        status: response.status
      };
    }

    // Return both bids and pagination metadata
    const result: PaginatedBidResult = {
      bids: response.data?.results || [],
      pagination: {
        count: response.data?.count || 0,
        next: response.data?.next || null,
        previous: response.data?.previous || null,
        page_size: response.data?.page_size || 10,
        total_pages: response.data?.total_pages || 1,
        current_page: response.data?.current_page || 1
      }
    };

    return {
      data: result,
      error: null,
      status: response.status
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while searching bids',
      status: 500
    };
  }
}

/**
 * Get a specific bid by ID
 * @param bidId The bid ID
 * @returns The API response with the bid details
 */
export async function getBidById(bidId: number) {
  try {
    // Get bid requires authentication
    const response = await apiGet<BidItem>(`/bids/${bidId}/`, true);

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
 * Update an existing bid
 * @param bidId The ID of the bid to update
 * @param bidData The updated bid data
 * @returns The API response with the updated bid
 */
export async function updateBid(bidId: number, bidData: BidUpdateData) {
  try {
    // Update bid requires authentication
    const response = await apiPut<BidUpdateResponse>(`/bids/${bidId}/update/`, bidData, true);

    // If the response has an error status, format it properly
    if (response.error || (response.status && response.status >= 400)) {
      return {
        data: response.data,
        error: response.error || 'Failed to update bid',
        status: response.status || 500
      };
    }

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while updating your bid',
      status: 500
    };
  }
}

/**
 * Cancel a bid (delete)
 * @param bidId The ID of the bid to cancel
 * @returns The API response
 */
export async function cancelBid(bidId: number) {
  try {
    // Cancel bid requires authentication
    const response = await apiDelete<{ message: string }>(`/bids/${bidId}/delete/`, true);

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while cancelling your bid',
      status: 500
    };
  }
}

/**
 * Get bid history for a specific bid
 * @param bidId The bid ID
 * @returns The API response with bid history
 */
export async function getBidHistory(bidId: number) {
  try {
    // Get bid history requires authentication
    const response = await apiGet<BidHistoryEntry[]>(`/bids/${bidId}/history/`, true);

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching bid history',
      status: 500
    };
  }
}

/**
 * Get bid statistics for a specific ad
 * @param adId The ad ID
 * @returns The API response with bid statistics
 */
export async function getBidStatistics(adId: number) {
  try {
    // Get bid statistics requires authentication
    const response = await apiGet<BidStatistics>(`/bids/ad/${adId}/stats/`, true);

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching bid statistics',
      status: 500
    };
  }
}

/**
 * Close auction for an ad (ad owners only)
 * @param adId The ad ID
 * @returns The API response
 */
export async function closeAuction(adId: number) {
  try {
    // Close auction requires authentication and ad ownership
    const response = await apiPost<{ message: string }>(`/bids/ad/${adId}/close/`, {}, true);

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while closing the auction',
      status: 500
    };
  }
}

// Legacy function for backwards compatibility
export const getAuctionBids = getAdBids;

/**
 * Get detailed bid history for a specific auction with company information
 */
export const getAuctionBidHistory = async (auctionId: number): Promise<ApiResponse<any>> => {
  try {
    const response = await apiGet<any>(`/bids/ad/${auctionId}/history/`, false);
    return response;
  } catch (error) {

    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch auction bid history',
      status: 500
    };
  }
};


