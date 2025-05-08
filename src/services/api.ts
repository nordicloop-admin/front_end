/**
 * API service for making requests to the backend
 */
import { getAccessToken } from '@/services/auth';

// Base URL for the API
const API_BASE_URL = 'https://nordic-loop-platform.onrender.com/api';

/**
 * Interface for API response
 */
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * Get authorization headers
 * @param token Optional authentication token
 * @returns The headers with authorization if token is provided
 */
function getAuthHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Use provided token or get from storage
  const authToken = token || getAccessToken();

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return headers;
}

/**
 * Make a GET request to the API
 * @param endpoint The API endpoint to call
 * @param token Optional authentication token
 * @returns The API response
 */
export async function apiGet<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
  try {
    const headers = getAuthHeaders(token);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    return {
      data: response.ok ? data : null,
      error: response.ok ? null : data.message || 'An error occurred',
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred',
      status: 500,
    };
  }
}

/**
 * Make a POST request to the API
 * @param endpoint The API endpoint to call
 * @param body The request body
 * @param token Optional authentication token
 * @returns The API response
 */
export async function apiPost<T>(endpoint: string, body: any, token?: string): Promise<ApiResponse<T>> {
  try {
    const headers = getAuthHeaders(token);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return {
      data: response.ok ? data : null,
      error: response.ok ? null : data.message || 'An error occurred',
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred',
      status: 500,
    };
  }
}

/**
 * Make a PUT request to the API
 * @param endpoint The API endpoint to call
 * @param body The request body
 * @param token Optional authentication token
 * @returns The API response
 */
export async function apiPut<T>(endpoint: string, body: any, token?: string): Promise<ApiResponse<T>> {
  try {
    const headers = getAuthHeaders(token);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return {
      data: response.ok ? data : null,
      error: response.ok ? null : data.message || 'An error occurred',
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred',
      status: 500,
    };
  }
}

/**
 * Make a DELETE request to the API
 * @param endpoint The API endpoint to call
 * @param token Optional authentication token
 * @returns The API response
 */
export async function apiDelete<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
  try {
    const headers = getAuthHeaders(token);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    const data = await response.json();

    return {
      data: response.ok ? data : null,
      error: response.ok ? null : data.message || 'An error occurred',
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred',
      status: 500,
    };
  }
}
