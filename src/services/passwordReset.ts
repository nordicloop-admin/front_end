/**
 * Password reset service for handling forgot password flow
 */
import { apiPost } from './api';

// Interface for API response
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

// Request to initiate password reset
export interface RequestPasswordResetRequest {
  email: string;
}

// Response from password reset request
export interface RequestPasswordResetResponse {
  message: string;
  success: boolean;
}

// Request to verify OTP
export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

// Response from OTP verification
export interface VerifyOtpResponse {
  message: string;
  success: boolean;
  token?: string; // Token to use for password reset
}

// Request to reset password
export interface ResetPasswordRequest {
  email: string;
  token: string;
  new_password: string;
  confirm_password: string;
}

// Response from password reset
export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

/**
 * Request a password reset by sending an OTP to the user's email
 * @param data The request data containing the user's email
 * @returns API response with success message
 */
export async function requestPasswordReset(data: RequestPasswordResetRequest): Promise<ApiResponse<RequestPasswordResetResponse>> {
  try {
    // This is a public endpoint, so we don't need authentication
    const response = await apiPost<RequestPasswordResetResponse>('/users/request-password-reset/', data, false);
    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while requesting password reset',
      status: 500
    };
  }
}

/**
 * Verify the OTP sent to the user's email
 * @param data The request data containing the user's email and OTP
 * @returns API response with success message and token for password reset
 */
export async function verifyOtp(data: VerifyOtpRequest): Promise<ApiResponse<VerifyOtpResponse>> {
  try {
    // This is a public endpoint, so we don't need authentication
    const response = await apiPost<VerifyOtpResponse>('/users/verify-otp/', data, false);
    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while verifying OTP',
      status: 500
    };
  }
}

/**
 * Reset the user's password using the token from OTP verification
 * @param data The request data containing the new password and token
 * @returns API response with success message
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<ResetPasswordResponse>> {
  try {
    // This is a public endpoint, so we don't need authentication
    const response = await apiPost<ResetPasswordResponse>('/users/reset-password/', data, false);
    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while resetting password',
      status: 500
    };
  }
}
