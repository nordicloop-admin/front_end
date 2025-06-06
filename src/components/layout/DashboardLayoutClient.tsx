"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Home,
  FileText,
  Package,
  Bell,
  MapPin,
  User,
  Search,
  Menu,
  Plus,
  LogOut,
  ChevronDown
} from 'lucide-react';

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if the screen is mobile
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Debug function to help troubleshoot user data issues
  // To debug user data, uncomment the following code and add useEffect import:
  //
  // import React, { useEffect } from 'react';
  // ...
  // useEffect(() => {
  //   console.log('Current user data:', user);
  // }, [user]);

  const handleLogout = () => {
    // Call the logout function from the auth context
    logout();
    // Redirect to the login page
    router.push('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col z-50 h-full",
          isMobile
            ? `fixed inset-y-0 left-0 w-[250px] transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
            : "w-[190px] flex-shrink-0"
        )}
      >
        {/* Logo */}
        <div className="bg-[#0F1A24] text-white flex items-center justify-center h-[60px] flex-shrink-0">
          <Image
            src="/nordic logo.png"
            alt="Nordic Loop"
            width={120}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-4 overflow-y-auto">
          <Link
            href="/dashboard"
            className={`flex items-center px-4 py-3 ${pathname === '/dashboard' ? 'bg-[#FF8A00] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Overview
          </Link>

          <Link
            href="/dashboard/my-auctions"
            className={`flex items-center px-4 py-3 ${pathname === '/dashboard/my-auctions' ? 'bg-[#FF8A00] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            My Auctions
            <span className="ml-auto bg-gray-200 text-gray-800 rounded-full h-5 w-5 flex items-center justify-center text-xs">2</span>
          </Link>

          <Link
            href="/dashboard/auctions"
            className={`flex items-center px-4 py-3 ${pathname === '/dashboard/auctions' ? 'bg-[#FF8A00] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Auctions
          </Link>

          <Link
            href="/dashboard/subscriptions"
            className={`flex items-center px-4 py-3 ${pathname === '/dashboard/subscriptions' ? 'bg-[#FF8A00] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Subscriptions
          </Link>

          <Link
            href="/dashboard/addresses"
            className={`flex items-center px-4 py-3 ${pathname === '/dashboard/addresses' ? 'bg-[#FF8A00] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Addresses
          </Link>

          <Link
            href="/dashboard/profile"
            className={`flex items-center px-4 py-3 ${pathname === '/dashboard/profile' ? 'bg-[#FF8A00] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </Link>
        </nav>

        {/* Become Vendor Section */}
        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <div className="mb-1.5 text-sm font-medium">Become vendor</div>
          <p className="text-xs text-gray-500 mb-3">
            Vendors can sell products and manage a store with a vendor dashboard.
          </p>
          <button className="w-full bg-[#FF8A00] text-white py-2 px-4 rounded hover:bg-[#e67e00] transition-colors mb-4">
            Become vendor
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 h-[60px] flex items-center justify-between px-4 md:px-6 flex-shrink-0">
          {/* Mobile Menu Toggle */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 mr-2 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
          )}

          {/* Search */}
          <div className={cn(
            "relative",
            isMobile ? "w-full max-w-[160px]" : "w-[300px]"
          )}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={isMobile ? "Search" : "Search something"}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00]"
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4 md:space-x-4">
            {/* Add Auctions Button - Show text only on larger screens */}
            <Link
              href="/dashboard/auctions/create-alternative"
              className="bg-[#FF8A00] text-white py-2 px-3 md:px-4 rounded-md flex items-center ml-3 text-sm hover:bg-[#e67e00] transition-colors"
            >
              <Plus size={16} className="md:mr-2" />
              <span className="hidden md:inline">Add auctions</span>
            </Link>

            {/* Notification Button */}
            <button className="p-2 text-gray-500 hover:text-gray-700 relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            <div className="flex items-center">
              {/* Only show name on larger screens */}
              <span className="hidden md:inline font-medium mr-2">Hello {user?.firstName || user?.username?.split(' ')[0] || 'User'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </header>

        {/* Page Content - This is the scrollable area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
