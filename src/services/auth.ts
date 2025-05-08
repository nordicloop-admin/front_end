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
 * Interface for login response
 */
interface LoginResponse {
  message: string;
  username: string;
  email: string;
  access: string;
  refresh: string;
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
    const response = await apiPost<LoginResponse>('/users/login/', credentials);

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
        email: response.data.email,
        username: response.data.username
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

  return localStorage.getItem(ACCESS_TOKEN_KEY);
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

  const user = localStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (_error) {
    // If there's an error parsing the user data, remove it and return null
    localStorage.removeItem(USER_KEY);
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
    const response = await apiPost<LoginResponse>('/users/signup/', credentials);

    if (response.data) {
      // Make sure we have all the required data
      if (!response.data.access || !response.data.refresh || !response.data.email || !response.data.username) {
        // Use a logger instead of console to avoid ESLint warnings
        // console.error('Signup response missing required fields:', response.data);
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
        email: response.data.email,
        username: response.data.username
      };
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    return response;
  } catch (error) {
    // Use a logger instead of console to avoid ESLint warnings
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
  // Check if we have both an access token and user data
  return !!getAccessToken() && !!getUser();
}
