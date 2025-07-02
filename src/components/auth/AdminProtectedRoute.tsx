"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * A component that protects admin routes that require authentication and admin role
 * If the user is not authenticated, they will be redirected to the login page
 * If the user is authenticated but not an admin, they will be redirected to the dashboard
 */
export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If the user is not authenticated and not loading, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // If the user is authenticated but not an admin, redirect to dashboard
    if (!isLoading && isAuthenticated && user && user.role !== 'Admin') {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, isLoading, user, router]);

  // If loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF8A00]"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or not admin, don't render children (will redirect in useEffect)
  if (!isAuthenticated || !user || user.role !== 'Admin') {
    return null;
  }

  // If authenticated and admin, render children
  return <>{children}</>;
} 