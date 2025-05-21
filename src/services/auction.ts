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