/**
 * Auction service for handling auction creation and management
 */
import { apiPost, apiGet, apiPut, apiDelete } from './api';
import { getAccessToken } from './auth';

/**
 * Interface for category data
 */
export interface Category {
  id: number;
  name: string;
  subcategories: Subcategory[];
}

/**
 * Interface for subcategory data
 */
export interface Subcategory {
  id: number;
  name: string;
}

/**
 * Interface for auction creation data
 */
export interface AuctionCreateData {
  item_name: string;
  category: string;
  subcategory: string;
  description: string;
  base_price: string;
  price_per_partition: string;
  volume: string;
  unit: string;
  selling_type: 'partition' | 'whole' | 'both';
  country_of_origin: string;
  end_date: string;
  end_time: string;
  item_image?: File;
}

/**
 * Interface for auction creation response
 */
export interface AuctionCreateResponse {
  id: number;
  item_name: string;
  description: string;
  base_price: string;
  price_per_partition: string;
  volume: string;
  unit: string;
  selling_type: string;
  country_of_origin: string;
  end_date: string;
  end_time: string;
  item_image: string | null;
}

/**
 * Create a new auction
 * @param auctionData The auction data
 * @returns The API response with the created auction
 */
export async function createAuction(auctionData: AuctionCreateData) {
  try {
    // Create auction requires authentication
    const response = await apiPost<AuctionCreateResponse>('/ads/create/', auctionData, true);

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred during auction creation',
      status: 500
    };
  }
}

/**
 * Create a new auction with image upload
 * @param auctionData The auction data
 * @param image The image file
 * @returns The API response with the created auction
 */
export async function createAuctionWithImage(auctionData: Omit<AuctionCreateData, 'item_image'>, image: File) {
  try {
    // For file uploads, we need to use FormData
    const formData = new FormData();

    // Add all auction data to the form
    Object.entries(auctionData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Add the image file
    formData.append('item_image', image);

    // Get the access token
    const token = getAccessToken();

    if (!token) {
      return {
        data: null,
        error: 'Authentication required',
        status: 401
      };
    }

    // Make the request with FormData
    const response = await fetch(`https://nordic-loop-platform.onrender.com/api/ads/create/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();

    return {
      data: response.ok ? data : null,
      error: response.ok ? null : data.message || data.error || data.detail || 'An error occurred',
      status: response.status
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred during auction creation',
      status: 500
    };
  }
}

/**
 * Fetch all categories and subcategories
 * @returns The API response with the categories
 */
export async function getCategories() {
  try {
    const response = await apiGet<Category[]>('/category/', false);

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching categories',
      status: 500
    };
  }
}

/**
 * Fetch categories for public use (same as getCategories but explicit about being public)
 * @returns The API response with categories and subcategories
 */
export async function getCategoriesPublic() {
  return getCategories();
}

/**
 * Interface for auction item data
 */
export interface AuctionItem {
  id: number;
  title: string | null;
  category_name: string;
  subcategory_name: string;
  available_quantity: string | null;
  unit_of_measurement: string;
  starting_bid_price: string | null;
  currency: string;
  location_summary: string | null;
  total_starting_value: string;
  material_image: string | null;
  created_at: string;
  is_active: boolean;
  is_complete: boolean;
}

/**
 * Interface for paginated auction response
 */
export interface PaginatedAuctionResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AuctionItem[];
  page_size: number;
  total_pages: number;
  current_page: number;
}

/**
 * Interface for pagination parameters
 */
export interface PaginationParams {
  page?: number;
  page_size?: number;
}

/**
 * Interface for paginated auction response with extracted data
 */
export interface PaginatedAuctionResult {
  auctions: AuctionItem[];
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
    page_size: number;
    total_pages: number;
    current_page: number;
  };
}

/**
 * Fetch all auctions with pagination
 * @param params Pagination parameters
 * @returns The API response with the auctions and pagination info
 */
export async function getAuctions(params?: PaginationParams) {
  try {
    // Build query string for pagination
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
    
    const endpoint = `/ads/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    // Public endpoint - no authentication required for the /ads/ endpoint
    const response = await apiGet<PaginatedAuctionResponse>(endpoint, false);

    if (response.error) {
      return {
        data: null,
        error: response.error,
        status: response.status
      };
    }

    // Return both auctions and pagination metadata
    const result: PaginatedAuctionResult = {
      auctions: response.data?.results || [],
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
      error: error instanceof Error ? error.message : 'An error occurred while fetching auctions',
      status: 500
    };
  }
}

/**
 * Fetch auctions created by the current user with pagination
 * @param params Pagination parameters
 * @returns The API response with the user's auctions and pagination info
 */
export async function getUserAuctions(params?: PaginationParams) {
  try {
    // Build query string for pagination
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
    
    const endpoint = `/ads/user/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    // This endpoint requires authentication
    const response = await apiGet<PaginatedAuctionResponse>(endpoint, true);

    if (response.error) {
      return {
        data: null,
        error: response.error,
        status: response.status
      };
    }

    // Return both auctions and pagination metadata
    const result: PaginatedAuctionResult = {
      auctions: response.data?.results || [],
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
      error: error instanceof Error ? error.message : 'An error occurred while fetching your auctions',
      status: 500
    };
  }
}

/**
 * Fetch a single auction by ID
 * @param auctionId The ID of the auction to fetch
 * @returns The API response with the auction details
 */
export async function getAuctionById(auctionId: string | number) {
  try {
    // This endpoint requires authentication
    const response = await apiGet<AuctionItem>(`/ads/${auctionId}/`, true);

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
 * Interface for auction update data
 */
export interface AuctionUpdateData {
  item_name?: string;
  category?: string;
  subcategory?: string;
  description?: string;
  base_price?: string;
  price_per_partition?: string;
  volume?: string;
  unit?: string;
  selling_type?: 'partition' | 'whole' | 'both';
  country_of_origin?: string;
  end_date?: string;
  end_time?: string;
}

/**
 * Update an existing auction
 * @param auctionId The ID of the auction to update
 * @param auctionData The updated auction data
 * @returns The API response with the updated auction
 */
export async function updateAuction(auctionId: string | number, auctionData: AuctionUpdateData) {
  try {
    // Update auction requires authentication
    const response = await apiPut<AuctionItem>(`/ads/${auctionId}/update/`, auctionData, true);

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while updating the auction',
      status: 500
    };
  }
}

/**
 * Delete an auction
 * @param auctionId The ID of the auction to delete
 * @returns The API response
 */
export async function deleteAuction(auctionId: string | number) {
  try {
    // Delete auction requires authentication
    // Use /ads/{id}/ with DELETE method as per API specification
    // API now returns JSON response with message and deleted_ad details
    const response = await apiDelete<{
      message: string;
      deleted_ad: {
        id: number;
        title: string;
      };
    }>(`/ads/${auctionId}/`, true);

    if (response.error) {
      return {
        data: null,
        error: response.error,
        status: response.status || 500
      };
    }

    // Success: Return the response data with success flag
    return {
      data: { 
        success: true, 
        message: response.data?.message || 'Ad deleted successfully',
        deletedAd: response.data?.deleted_ad
      },
      error: null,
      status: response.status || 200
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while deleting the auction',
      status: 500
    };
  }
}

/**
 * Fetch complete ad details by ID (new enhanced endpoint)
 * @param adId The ID of the ad to fetch
 * @returns The API response with complete ad details
 */
export async function getAdDetails(adId: string | number) {
  try {
    // This endpoint requires authentication and provides complete ad details
    const response = await apiGet<{
      message: string;
      data: {
        id: number;
        posted_by: string;
        company_name: string;
        category_name: string;
        subcategory_name: string;
        specific_material: string;
        packaging: string;
        packaging_display: string;
        material_frequency: string;
        material_frequency_display: string;
        specification: any;
        additional_specifications: string | null;
        origin: string | null;
        origin_display: string | null;
        contamination: string | null;
        contamination_display: string | null;
        additives: string | null;
        additives_display: string | null;
        storage_conditions: string | null;
        storage_conditions_display: string | null;
        processing_methods: string[];
        processing_methods_display: string[];
        location: any;
        location_summary: string | null;
        pickup_available: boolean;
        delivery_options: string[];
        delivery_options_display: string[];
        available_quantity: number | null;
        unit_of_measurement: string;
        unit_of_measurement_display: string;
        minimum_order_quantity: string;
        starting_bid_price: number | null;
        currency: string;
        currency_display: string;
        auction_duration: number;
        auction_duration_display: string;
        reserve_price: number | null;
        total_starting_value: string;
        title: string | null;
        description: string | null;
        keywords: string | null;
        material_image: string | null;
        is_active: boolean;
        current_step: number;
        is_complete: boolean;
        created_at: string;
        updated_at: string;
        auction_start_date: string | null;
        auction_end_date: string | null;
        step_completion_status: Record<string, boolean>;
        auction_status: string;
        time_remaining: string | null;
      };
    }>(`/ads/${adId}/`, true);

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching ad details',
      status: 500
    };
  }
}

/**
 * Activate/publish an ad to make it visible and available for bidding
 * @param adId The ID of the ad to activate
 * @returns The API response
 */
export async function activateAd(adId: string | number) {
  try {
    // Activate ad requires authentication
    const response = await apiPost<{
      message: string;
      ad: {
        id: number;
        title: string;
        is_active: boolean;
        is_complete: boolean;
        auction_start_date: string;
        auction_end_date: string;
        auction_duration_display: string;
      };
    }>(`/ads/${adId}/activate/`, {}, true);

    if (response.error) {
      return {
        data: null,
        error: response.error,
        status: response.status || 500
      };
    }

    // Success: Return the response data
    return {
      data: response.data,
      error: null,
      status: response.status || 200
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while activating the ad',
      status: 500
    };
  }
}

/**
 * Deactivate/unpublish an ad to make it invisible and stop bidding
 * @param adId The ID of the ad to deactivate
 * @returns The API response
 */
export async function deactivateAd(adId: string | number) {
  try {
    // Deactivate ad requires authentication
    const response = await apiPost<{
      message: string;
      ad: {
        id: number;
        title: string;
        is_active: boolean;
        is_complete: boolean;
      };
    }>(`/ads/${adId}/deactivate/`, {}, true);

    if (response.error) {
      return {
        data: null,
        error: response.error,
        status: response.status || 500
      };
    }

    // Success: Return the response data
    return {
      data: response.data,
      error: null,
      status: response.status || 200
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while deactivating the ad',
      status: 500
    };
  }
}