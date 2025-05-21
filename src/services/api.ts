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
 * Get headers for API requests
 * @param requiresAuth Whether the request requires authentication
 * @param token Optional authentication token
 * @returns The headers with authorization if required and token is available
 */
function getHeaders(requiresAuth: boolean = false, token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Only add authorization header if the endpoint requires authentication
  if (requiresAuth) {
    // Use provided token or get from storage
    const authToken = token || getAccessToken();

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
  }

  return headers;
}

/**
 * Make a GET request to the API
 * @param endpoint The API endpoint to call
 * @param requiresAuth Whether the request requires authentication
 * @param token Optional authentication token
 * @returns The API response
 */
export async function apiGet<T>(
  endpoint: string,
  requiresAuth: boolean = false,
  token?: string
): Promise<ApiResponse<T>> {
  try {
    const headers = getHeaders(requiresAuth, token);
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    // Handle different content types
    let data;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      // Non-JSON response handling (removed console.log for production)

      try {
        // Try to parse it anyway in case the content-type header is wrong
        data = JSON.parse(text);
      } catch (_e) {
        // If it's not JSON, create an error message
        return {
          data: null,
          error: `Server returned non-JSON response: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`,
          status: response.status,
        };
      }
    }

    if (!response.ok) {
      // For error responses, try to extract a meaningful error message
      const errorMessage = data.message || data.error || data.detail ||
                          (typeof data === 'string' ? data : 'An error occurred');

      return {
        data: null,
        error: errorMessage,
        status: response.status,
      };
    }

    return {
      data: data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    // Error handling (removed console.error for production)
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
 * @param requiresAuth Whether the request requires authentication
 * @param token Optional authentication token
 * @returns The API response
 */
export async function apiPost<T>(
  endpoint: string,
  body: any,
  requiresAuth: boolean = false,
  token?: string
): Promise<ApiResponse<T>> {
  try {
    const headers = getHeaders(requiresAuth, token);
    const url = `${API_BASE_URL}${endpoint}`;

    // Log the request for debugging (remove in production)
    // console.log(`API POST Request to ${url}:`, { headers, body });

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    // Log the raw response for debugging (remove in production)
    // console.log(`API Response from ${url}:`, { status: response.status, statusText: response.statusText });

    let data;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      // Log non-JSON response for debugging (remove in production)
      // console.log(`Non-JSON response from ${url}:`, text);

      try {
        // Try to parse it anyway in case the content-type header is wrong
        data = JSON.parse(text);
      } catch (_e) {
        // If it's not JSON, create an error message
        return {
          data: null,
          error: `Server returned non-JSON response: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`,
          status: response.status,
        };
      }
    }

    // Log the parsed data for debugging (remove in production)
    // console.log(`Parsed data from ${url}:`, data);

    if (!response.ok) {
      // For error responses, try to extract a meaningful error message
      const errorMessage = data.message || data.error || data.detail ||
                          (typeof data === 'string' ? data : 'An error occurred');

      return {
        data: null,
        error: errorMessage,
        status: response.status,
      };
    }

    return {
      data: data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    // Log the error for debugging (remove in production)
    // console.error('API error:', error);

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
 * @param requiresAuth Whether the request requires authentication
 * @param token Optional authentication token
 * @returns The API response
 */
export async function apiPut<T>(
  endpoint: string,
  body: any,
  requiresAuth: boolean = true,
  token?: string
): Promise<ApiResponse<T>> {
  try {
    const headers = getHeaders(requiresAuth, token);

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
 * @param requiresAuth Whether the request requires authentication
 * @param token Optional authentication token
 * @returns The API response
 */
export async function apiDelete<T>(
  endpoint: string,
  requiresAuth: boolean = true,
  token?: string
): Promise<ApiResponse<T>> {
  try {
    const headers = getHeaders(requiresAuth, token);

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
