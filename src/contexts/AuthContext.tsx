"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/auth';
import {
  login as loginService,
  logout as logoutService,
  signup as signupService,
  getUser,
  isAuthenticated
} from '@/services/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the user is already authenticated
    const user = getUser();
    if (user) {
      setUser(user);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await loginService({ email, password });

      if (response.data) {
        // Create a user object from the response data
        const user: User = {
          email: response.data.email,
          username: response.data.username,
          firstName: response.data.first_name || response.data.username.split(' ')[0] || 'User'
        };

        setUser(user);
        return { success: true };
      }

      return { success: false, error: response.error || 'Login failed' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // Log the signup attempt for debugging (remove in production)
      // console.log('Attempting signup with email:', email);

      const response = await signupService({ email, password });

      // Log the response for debugging (remove in production)
      // console.log('Signup response:', response);

      if (response.data && response.data.user) {
        // If we have user data from signup, we need to login to get tokens
        // First, store the user temporarily
        const tempUser = response.data.user;

        // Now attempt to login with the same credentials
        const loginResponse = await login(email, password);

        if (loginResponse.success) {
          // Login successful, we're already authenticated
          return { success: true };
        } else {
          // If login fails, we'll still set the user from signup
          // but we won't have tokens, so the user will need to login manually
          setUser(tempUser);

          return {
            success: true,
            message: 'Account created successfully. Please login to continue.'
          };
        }
      }

      // If there's an error in the response, return it with more details
      if (response.error) {
        return {
          success: false,
          error: `Signup failed: ${response.error} (Status: ${response.status})`
        };
      }

      return { success: false, error: 'Signup failed: Unknown error' };
    } catch (error) {
      // Log the error for debugging (remove in production)
      // console.error('Signup exception:', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Signup failed: Unexpected error'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: isAuthenticated(),
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
