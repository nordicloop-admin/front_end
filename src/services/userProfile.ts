import { apiGet, apiPatch, apiPost } from './api';

// Import or recreate ApiResponse type
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

// Types
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
  phone?: string; // Optional phone field
}

export interface ProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface PasswordChangeResponse {
  message: string;
}

// Get user profile
export async function getUserProfile(): Promise<ApiResponse<UserProfile>> {
  return await apiGet<UserProfile>('/users/profile/', true);
}

// Response type for profile update
interface ProfileUpdateResponse {
  message: string;
  user: UserProfile;
}

// Update user profile
export async function updateUserProfile(data: ProfileUpdateRequest): Promise<ApiResponse<UserProfile>> {
  const response = await apiPatch<ProfileUpdateResponse>('/users/profile/', data, true);
  
  // If the response is successful and contains the nested user data, extract it
  if (response.data && response.data.user) {
    return {
      data: response.data.user,
      error: response.error,
      status: response.status
    };
  }
  
  return response as ApiResponse<UserProfile>;
}

/**
 * Change user password
 * @param data Password change request data
 * @returns API response with success message
 */
export async function changePassword(data: PasswordChangeRequest): Promise<ApiResponse<PasswordChangeResponse>> {
  try {
    const response = await apiPost<PasswordChangeResponse>('/users/change-password/', data, true);
    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while changing password',
      status: 500
    };
  }
}
