/**
 * Addresses service for handling admin address management
 */
import { apiGet } from './api';

/**
 * Interface for admin address list response
 */
interface AdminAddressListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminAddress[];
  page_size: number;
  total_pages: number;
  current_page: number;
}

/**
 * Interface for admin address data
 */
interface AdminAddress {
  id: string;
  companyId: string;
  companyName: string;
  type: 'business' | 'shipping';
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  country: string;
  isVerified: boolean;
  isPrimary: boolean;
  contactName: string;
  contactPhone: string;
  createdAt: string;
}

/**
 * Interface for admin address query parameters
 */
interface AdminAddressParams {
  search?: string;
  type?: string;
  is_verified?: boolean;
  page?: number;
  page_size?: number;
}

/**
 * Get addresses list for admin with filtering and pagination
 * @param params Query parameters for filtering and pagination
 * @returns The addresses list response
 */
export async function getAdminAddresses(params: AdminAddressParams = {}) {
  try {
    // Build query string
    const queryParams = new URLSearchParams();
    
    if (params.search) {
      queryParams.append('search', params.search);
    }
    
    if (params.type) {
      queryParams.append('type', params.type);
    }
    
    if (params.is_verified !== undefined) {
      queryParams.append('is_verified', params.is_verified.toString());
    }
    
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    
    if (params.page_size) {
      queryParams.append('page_size', params.page_size.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = `/ads/admin/addresses/${queryString ? `?${queryString}` : ''}`;

    const response = await apiGet<AdminAddressListResponse>(endpoint, true);

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching addresses',
      status: 500
    };
  }
}

/**
 * Get a specific address by ID for admin
 * @param addressId The address ID
 * @returns The address data
 */
export async function getAdminAddress(addressId: string) {
  try {
    const response = await apiGet<AdminAddress>(`/ads/admin/addresses/${addressId}/`, true);

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching address details',
      status: 500
    };
  }
}

// Export types for use in components
export type { AdminAddress, AdminAddressListResponse, AdminAddressParams }; 