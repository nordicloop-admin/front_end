/**
 * API service for making requests to the backend
 */
import { getAccessToken } from '@/services/auth';

// Base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Validate API URL on client side
if (typeof window !== 'undefined' && !API_BASE_URL && process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.error('NEXT_PUBLIC_API_URL environment variable is not set');
}

/**
 * Interface for API response
 */
export interface ApiResponse<T> {
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
      // Add timeout and error handling
      signal: AbortSignal.timeout(60000), // 60 second timeout (increased for better reliability)
    });

    // Handle different content types
    let data;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();

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
      // For error responses, preserve the full error structure
      // This ensures validation details are available
      const errorMessage = data.message || data.error || data.detail ||
                          (typeof data === 'string' ? data : 'An error occurred');

      return {
        data: data, // Preserve the full error response data
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
    // Handle different types of errors
    let errorMessage = 'An error occurred';
    let status = 500;

    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('signal')) {
        errorMessage = 'Connection timeout - the server is taking too long to respond';
        status = 408;
      } else if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Network error - please check your internet connection';
        status = 0;
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to server - please try again later';
        status = 503;
      } else {
        errorMessage = error.message;
      }
    }

    return {
      data: null,
      error: errorMessage,
      status,
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

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    // Log the raw response for debugging (remove in production)

    let data;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      // Log non-JSON response for debugging (remove in production)

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

    if (!response.ok) {
      // For error responses, preserve the full error structure
      // This ensures validation details are available
      const errorMessage = data.message || data.error || data.detail ||
                          (typeof data === 'string' ? data : 'An error occurred');

      return {
        data: data, // Preserve the full error response data
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
    const url = `${API_BASE_URL}${endpoint}`;



    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    let data;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      
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
      // For error responses, preserve the full error structure
      // This ensures validation details are available
      const errorMessage = data.message || data.error || data.detail ||
                          (typeof data === 'string' ? data : 'An error occurred');

      return {
        data: data, // Preserve the full error response data
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
    
    // For 204 No Content responses, don't try to parse JSON
    if (response.status === 204) {
      return {
        data: null,
        error: null,
        status: response.status,
      };
    }
    
    // Check if there's content to parse
    const contentType = response.headers.get('content-type');
    let data = null;
    
    if (contentType && contentType.includes('application/json')) {
      // Only try to parse JSON if there's JSON content
      const text = await response.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (_e) {
          // If parsing fails, return the error
          return {
            data: null,
            error: 'Failed to parse JSON response',
            status: response.status,
          };
        }
      }
    }

    return {
      data: response.ok ? data : null,
      error: response.ok ? null : (data?.message || 'An error occurred'),
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
 * Make a PUT request with FormData (for file uploads)
 * @param endpoint The API endpoint to call
 * @param formData The FormData object containing files and form fields
 * @param requiresAuth Whether the request requires authentication
 * @param token Optional authentication token
 * @returns The API response
 */
export async function apiPutFormData<T>(
  endpoint: string,
  formData: FormData,
  requiresAuth: boolean = true,
  token?: string
): Promise<ApiResponse<T>> {
  try {
    // For FormData, we don't set Content-Type header as the browser will set it with boundary
    const headers: HeadersInit = {};
    
    if (requiresAuth) {
      const authToken = token || getAccessToken();
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
    }

    const url = `${API_BASE_URL}${endpoint}`;

    // Debug: Log FormData contents properly (FormData can't be JSON.stringified)


    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: formData, // Send FormData directly
    });

    let data;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      
      try {
        data = JSON.parse(text);
      } catch (_e) {
        return {
          data: null,
          error: `Server returned non-JSON response: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`,
          status: response.status,
        };
      }
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || data.detail ||
                          (typeof data === 'string' ? data : 'An error occurred');

      return {
        data: data,
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
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred',
      status: 500,
    };
  }
}

/**
 * Make a PATCH request to the API
 * @param endpoint The API endpoint to call
 * @param body The request body
 * @param requiresAuth Whether the request requires authentication
 * @param token Optional authentication token
 * @returns The API response
 */
export async function apiPatch<T>(
  endpoint: string,
  body: any,
  requiresAuth: boolean = true,
  token?: string
): Promise<ApiResponse<T>> {
  try {
    const headers = getHeaders(requiresAuth, token);
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });

    let data;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      
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
      // For error responses, preserve the full error structure
      // This ensures validation details are available
      const errorMessage = data.message || data.error || data.detail ||
                          (typeof data === 'string' ? data : 'An error occurred');

      return {
        data: data, // Preserve the full error response data
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
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred',
      status: 500,
    };
  }
}
