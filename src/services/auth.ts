/**
 * Authentication service for handling login, logout, and token management
 */
import { apiPost } from './api';
import { User } from '@/types/auth';

// Local storage keys
const ACCESS_TOKEN_KEY = 'nordic_loop_access_token';
const REFRESH_TOKEN_KEY = 'nordic_loop_refresh_token';
const USER_KEY = 'nordic_loop_user';

/**
 * Decode JWT token without verification (for expiration check)
 * @param token The JWT token to decode
 * @returns The decoded payload or null if invalid
 */
function decodeJWT(token: string): { exp?: number } | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (_error) {
    return null;
  }
}

/**
 * Check if a JWT token is expired
 * @param token The JWT token to check
 * @returns Whether the token is expired
 */
function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return true; // If we can't decode or no expiration, consider it expired
  }
  
  // JWT exp is in seconds, Date.now() is in milliseconds
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

/**
 * Validate if the current access token is still valid
 * @returns Whether the access token is valid and not expired
 */
function isAccessTokenValid(): boolean {
  const token = getAccessToken();
  if (!token) return false;
  
  return !isTokenExpired(token);
}

/**
 * Get token expiration time
 * @returns The expiration timestamp in seconds, or null if token is invalid
 */
export function getTokenExpiration(): number | null {
  const token = getAccessToken();
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  return decoded?.exp || null;
}

/**
 * Get time until token expires
 * @returns Time in seconds until expiration, or 0 if expired/invalid
 */
export function getTimeUntilExpiration(): number {
  const expiration = getTokenExpiration();
  if (!expiration) return 0;
  
  const currentTime = Math.floor(Date.now() / 1000);
  const timeUntil = expiration - currentTime;
  return Math.max(0, timeUntil);
}

/**
 * Force token expiration for testing purposes
 * This is for development/testing only
 */
export function forceTokenExpiration(): void {
  // Only allow in development
  if (process.env.NODE_ENV === 'development') {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

/**
 * Interface for login response
 */
interface LoginResponse {
  message: string;
  username: string;
  email: string;
  access: string;
  refresh: string;
  first_name?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  last_name?: string;
  position?: string;
  companyId?: string;
  company_id?: string;
  role?: string;
}

/**
 * Interface for signup response
 */
interface SignupResponse {
  message: string;
  username: string;
  error?: string;
  id?: string;
  first_name?: string;
  last_name?: string;
  position?: string;
  company_id?: string;
}

/**
 * Interface for the enhanced signup response with user data
 */
interface EnhancedSignupResponse {
  user: User;
  message: string;
}

/**
 * Interface for login credentials
 */
interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Interface for signup credentials
 */
interface SignupCredentials {
  email: string;
  password: string;
}

/**
 * Login a user
 * @param credentials The login credentials
 * @returns The login response
 */
export async function login(credentials: LoginCredentials) {
  try {
    // Login is a public endpoint, so we don't need to send the token
    const response = await apiPost<LoginResponse>('/users/login/', credentials, false);

    if (response.data) {
      // Make sure we have all the required data
      if (!response.data.access || !response.data.refresh || !response.data.email || !response.data.username) {
        // Use a logger instead of console to avoid ESLint warnings
        // console.error('Login response missing required fields:', response.data);
        return {
          data: null,
          error: 'Invalid response from server',
          status: response.status
        };
      }

      // Store the tokens in local storage
      localStorage.setItem(ACCESS_TOKEN_KEY, response.data.access);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh);

      // Store the user info in local storage
      const user: User = {
        id: response.data.id,
        email: response.data.email,
        username: response.data.username,
        firstName: response.data.first_name || response.data.firstName || (response.data.username ? response.data.username.split(' ')[0] : 'User'),
        lastName: response.data.last_name || response.data.lastName,
        position: response.data.position,
        companyId: response.data.company_id || response.data.companyId,
        role: response.data.role
      };
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    return response;
  } catch (error) {
    // Use a logger instead of console to avoid ESLint warnings
    // console.error('Login error:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred during login',
      status: 500
    };
  }
}

/**
 * Logout a user
 */
export function logout() {
  // Remove the tokens and user from local storage
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Get the current access token
 * @returns The access token
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error accessing localStorage for access token:', error);
    }
    return null;
  }
}

/**
 * Get the current refresh token
 * @returns The refresh token
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Get the current user
 * @returns The current user
 */
export function getUser(): User | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const user = localStorage.getItem(USER_KEY);

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  } catch (error) {
    // If there's an error accessing localStorage or parsing the user data, remove it and return null
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error accessing user data from localStorage:', error);
    }
    try {
      localStorage.removeItem(USER_KEY);
    } catch (removeError) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Error removing invalid user data:', removeError);
      }
    }
    return null;
  }
}

/**
 * Signup a new user
 * @param credentials The signup credentials
 * @returns The signup response
 */
export async function signup(credentials: SignupCredentials) {
  try {
    // Log the request payload for debugging (remove in production)
    // console.log('Signup request payload:', credentials);

    // Signup is a public endpoint, so we don't need to send the token
    const response = await apiPost<SignupResponse>('/users/signup/', credentials, false);

    // Log the response for debugging (remove in production)
    // console.log('Signup response:', response);

    if (response.data) {
      // Check if we have a success message and username
      if (response.data.message && response.data.username) {
        // Create a temporary user object with the available information
        const user: User = {
          id: response.data.id,
          email: credentials.email, // Use the email from the credentials
          username: response.data.username,
          firstName: response.data.first_name || (response.data.username ? response.data.username.split(' ')[0] : 'User'),
          lastName: response.data.last_name,
          position: response.data.position,
          companyId: response.data.company_id
        };

        // Create an enhanced response with user data
        const enhancedResponse: EnhancedSignupResponse = {
          user,
          message: response.data.message
        };

        // Return success with the enhanced data
        return {
          data: enhancedResponse,
          error: null,
          status: response.status
        };
      }

      // If we have an error in the data, return it
      if (response.data.error) {
        return {
          data: null,
          error: response.data.error,
          status: response.status
        };
      }
    }

    // If there's an error in the response, return it
    if (response.error) {
      return {
        data: null,
        error: response.error,
        status: response.status
      };
    }

    return response;
  } catch (error) {
    // Log the error for debugging (remove in production)
    // console.error('Signup error:', error);

    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred during signup',
      status: 500
    };
  }
}

/**
 * Check if a user is authenticated
 * @returns Whether the user is authenticated
 */
export function isAuthenticated(): boolean {
  // Check if we have user data and a valid (non-expired) access token
  const user = getUser();
  const hasValidToken = isAccessTokenValid();
  
  // If token is expired, clean up the stored data
  if (!hasValidToken && user) {
    logout();
    return false;
  }
  
  return !!user && hasValidToken;
}
