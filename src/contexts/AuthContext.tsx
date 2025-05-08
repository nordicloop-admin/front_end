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
        setUser(response.data.user);
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
      const response = await signupService({ email, password });

      if (response.data) {
        setUser(response.data.user);
        return { success: true };
      }

      return { success: false, error: response.error || 'Signup failed' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Signup failed'
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
