import { apiGet, apiPut } from './api';

// Define the ApiResponse interface for consistency
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

// User Profile interface
export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  name: string;
  company: number;
  company_name: string;
  role: string;
  role_display: string;
  can_place_ads: boolean;
  can_place_bids: boolean;
  date_joined: string;
}

// Profile update request interface
export interface ProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
}

/**
 * Get the current user's profile
 * @returns Promise with user profile data
 */
export async function getUserProfile(): Promise<ApiResponse<UserProfile>> {
  return await apiGet<UserProfile>('/users/profile/', true);
}

/**
 * Update the current user's profile
 * @param data Profile data to update
 * @returns Promise with updated user profile
 */
export async function updateUserProfile(data: ProfileUpdateRequest): Promise<ApiResponse<UserProfile>> {
  return await apiPut<UserProfile>('/users/profile/', data, true);
}
