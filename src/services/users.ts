/**
 * Users service for handling admin user management
 */
import { apiGet } from './api';

/**
 * Interface for admin user list response
 */
interface AdminUserListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminUser[];
  page_size: number;
  total_pages: number;
  current_page: number;
}

/**
 * Interface for admin user data
 */
interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  joinDate: string;
}

/**
 * Interface for admin user query parameters
 */
interface AdminUserParams {
  search?: string;
  company?: string;
  is_active?: boolean;
  page?: number;
  page_size?: number;
}

/**
 * Get users list for admin with filtering and pagination
 * @param params Query parameters for filtering and pagination
 * @returns The users list response
 */
export async function getAdminUsers(params: AdminUserParams = {}) {
  try {
    // Build query string
    const queryParams = new URLSearchParams();
    
    if (params.search) {
      queryParams.append('search', params.search);
    }
    
    if (params.company) {
      queryParams.append('company', params.company);
    }
    
    if (params.is_active !== undefined) {
      queryParams.append('is_active', params.is_active.toString());
    }
    
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    
    if (params.page_size) {
      queryParams.append('page_size', params.page_size.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = `/users/admin/users/${queryString ? `?${queryString}` : ''}`;

    const response = await apiGet<AdminUserListResponse>(endpoint, true);

    // Transform the response to match frontend expectations if needed
    if (response.data?.results) {
      response.data.results = response.data.results.map(user => ({
        ...user,
        // Map any backend field names to frontend field names if needed
        // The user specified not to change models, so we should exclude fields not in our model
      }));
    }

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching users',
      status: 500
    };
  }
}

/**
 * Get a specific user by ID for admin
 * @param userId The user ID
 * @returns The user data
 */
export async function getAdminUser(userId: string) {
  try {
    const response = await apiGet<AdminUser>(`/users/admin/users/${userId}/`, true);

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching user details',
      status: 500
    };
  }
}

// Export types for use in components
export type { AdminUser, AdminUserListResponse, AdminUserParams }; 