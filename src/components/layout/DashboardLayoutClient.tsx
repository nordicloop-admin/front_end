"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';
import {
  Home,
  FileText,
  Package,
  User,
  LogOut,
  Megaphone,
  MessageCircle
} from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import { getUserAdsCount } from '@/services/auction';

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userAdsCount, setUserAdsCount] = useState<number>(0);
  // const [unreadChatsCount, setUnreadChatsCount] = useState<number>(0);

  // Check if the screen is mobile
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Fetch user's ad count
  useEffect(() => {
    const fetchUserAdsCount = async () => {
      try {
        const response = await getUserAdsCount();
        if (response.data) {
          setUserAdsCount(response.data.ads_count);
        }
      } catch (_error) {
        // Error handling - silently fail
      }
    };

    fetchUserAdsCount();
  }, []);

  // Fetch unread chats count
  useEffect(() => {
    const fetchUnreadChatsCount = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate with sample data
        // const sampleUnreadCount = 3; // This would come from your API
        // setUnreadChatsCount(sampleUnreadCount);
      } catch (_error) {
        // Error handling - silently fail
      }
    };

    fetchUnreadChatsCount();
  }, []);

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
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40"
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
            href="/"
            className="flex items-center px-4 py-2.5 text-gray-700 hover:text-[#FF8A00]"
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <Home size={18} className="mr-3" />
            <span>Home</span>
          </Link>
          
          <div className="border-t border-gray-100 my-2"></div>
          
          <Link
            href="/dashboard"
            className={`flex items-center px-4 py-2.5 ${pathname === '/dashboard' ? 'text-[#FF8A00] font-medium' : 'text-gray-700 hover:text-[#FF8A00]'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <Home size={18} className="mr-3" />
            <span>Overview</span>
          </Link>

          <Link
            href="/dashboard/my-activity"
            className={`flex items-center px-4 py-2.5 ${pathname === '/dashboard/my-activity' || pathname === '/dashboard/my-auctions' ? 'text-[#FF8A00] font-medium' : 'text-gray-700 hover:text-[#FF8A00]'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <FileText size={18} className="mr-3" />
            <span>My Activity</span>
            {userAdsCount > 0 && (
              <span className="ml-auto bg-[#FF8A00] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {userAdsCount}
              </span>
            )}
          </Link>

          <Link
            href="/dashboard/auctions"
            className={`flex items-center px-4 py-2.5 ${pathname === '/dashboard/auctions' || pathname.startsWith('/dashboard/auctions/') ? 'text-[#FF8A00] font-medium' : 'text-gray-700 hover:text-[#FF8A00]'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <Package size={18} className="mr-3" />
            <span>Marketplace</span>
          </Link>


          <Link
            href="/dashboard/chats"
            className={`flex items-center px-4 py-2.5 ${pathname === '/dashboard/chats' || pathname.startsWith('/dashboard/chats/') ? 'text-[#FF8A00] font-medium' : 'text-gray-700 hover:text-[#FF8A00]'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <MessageCircle size={18} className="mr-3" />
            <span>Chats</span>
            {/* {unreadChatsCount > 0 && (
              <span className="ml-auto bg-[#FF8A00] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadChatsCount}
              </span>
            )} */}
          </Link>

          <Link
            href="/dashboard/notifications"
            className={`flex items-center px-4 py-2.5 ${pathname === '/dashboard/notifications' ? 'text-[#FF8A00] font-medium' : 'text-gray-700 hover:text-[#FF8A00]'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <Megaphone size={18} className="mr-3" />
            <span>Notifications</span>
          </Link>



          <Link
            href="/dashboard/payments"
            className={`flex items-center px-4 py-2.5 ${pathname === '/dashboard/payments' || pathname.startsWith('/dashboard/payments') ? 'text-[#FF8A00] font-medium' : 'text-gray-700 hover:text-[#FF8A00]'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <svg className="h-[18px] w-[18px] mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="4" width="20" height="16" rx="2" stroke={pathname === '/dashboard/payments' || pathname.startsWith('/dashboard/payments') ? "#FF8A00" : "currentColor"} strokeWidth="1.5" />
              <path d="M2 8H22" stroke={pathname === '/dashboard/payments' || pathname.startsWith('/dashboard/payments') ? "#FF8A00" : "currentColor"} strokeWidth="1.5" />
              <circle cx="7" cy="14" r="1" fill={pathname === '/dashboard/payments' || pathname.startsWith('/dashboard/payments') ? "#FF8A00" : "currentColor"} />
            </svg>
            <span>Payments</span>
          </Link>

          <Link
            href="/dashboard/category-subscriptions"
            className={`flex items-center px-4 py-2.5 ${pathname === '/dashboard/category-subscriptions' ? 'text-[#FF8A00] font-medium' : 'text-gray-700 hover:text-[#FF8A00]'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-3"
            >
              <path
                d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M14 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M4 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M14 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <span>Wishlist</span>
          </Link>



          <Link
            href="/dashboard/profile"
            className={`flex items-center px-4 py-2.5 ${pathname === '/dashboard/profile' ? 'text-[#FF8A00] font-medium' : 'text-gray-700 hover:text-[#FF8A00]'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <User size={18} className="mr-3" />
            <span>Profile</span>
          </Link>
        </nav>

        {/* Become Vendor Section */}
        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          {/* <div className="mb-1.5 text-sm font-medium">Become vendor</div>
          <p className="text-xs text-gray-500 mb-3">
            Vendors can sell products and manage a store with a vendor dashboard.
          </p>
          <button className="w-full bg-[#FF8A00] text-white py-2 px-4 rounded-md hover:bg-[#e67e00] transition-colors mb-4 text-sm">
            Become vendor
          </button> */}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full border border-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center text-sm"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <DashboardHeader onMobileMenuToggle={toggleSidebar} showAddAuctionsButton={true} />

        {/* Page Content - This is the scrollable area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
