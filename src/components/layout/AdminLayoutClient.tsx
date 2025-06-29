"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if the screen is mobile
  const isMobile = useMediaQuery('(max-width: 768px)');

  const _handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
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
          "bg-white border-r border-gray-100 flex flex-col z-50 shadow-sm",
          isMobile
            ? `fixed inset-y-0 left-0 w-[170px] transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
            : "w-[170px]"
        )}
      >
        {/* Logo */}
        <div className="bg-[#0F1A24] text-white flex items-center justify-center h-[60px]">
          <Image
            src="/nordic logo.png"
            alt="Nordic Loop"
            width={100}
            height={35}
            className="object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-6 overflow-y-auto">
          <Link
            href="/admin"
            className={`flex items-center px-4 py-2 ${pathname === '/admin' ? 'text-[#FF8A00] font-medium' : 'text-gray-600 hover:text-[#FF8A00]'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H8V8H4V4Z" stroke={pathname === '/admin' ? "#FF8A00" : "currentColor"} strokeWidth="1.5" />
              <path d="M4 12H8V16H4V12Z" stroke={pathname === '/admin' ? "#FF8A00" : "currentColor"} strokeWidth="1.5" />
              <path d="M12 4H16V8H12V4Z" stroke={pathname === '/admin' ? "#FF8A00" : "currentColor"} strokeWidth="1.5" />
              <path d="M12 12H16V16H12V12Z" stroke={pathname === '/admin' ? "#FF8A00" : "currentColor"} strokeWidth="1.5" />
            </svg>
            <span>Overview</span>
          </Link>

          <Link
            href="/admin/companies"
            className={`flex items-center px-4 py-2 mt-4 ${pathname === '/admin/companies' ? 'text-[#FF8A00] font-medium' : 'text-gray-600 hover:text-[#FF8A00]'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21" stroke={pathname === '/admin/companies' ? "#FF8A00" : "currentColor"} strokeWidth="1.5" />
              <path d="M14 8H10" stroke={pathname === '/admin/companies' ? "#FF8A00" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
              <path d="M14 12H10" stroke={pathname === '/admin/companies' ? "#FF8A00" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
              <path d="M3 21H21" stroke={pathname === '/admin/companies' ? "#FF8A00" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>Companies</span>
          </Link>

          <Link
            href="/admin/auctions"
            className={`flex items-center px-4 py-2 mt-4 ${pathname === '/admin/auctions' || pathname.startsWith('/admin/auctions') ? 'text-[#FF8A00] font-medium' : 'text-gray-600 hover:text-[#FF8A00]'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="16" height="16" rx="1" stroke={pathname === '/admin/auctions' || pathname.startsWith('/admin/auctions') ? "#FF8A00" : "currentColor"} strokeWidth="1.5" />
              <path d="M4 8H20" stroke={pathname === '/admin/auctions' || pathname.startsWith('/admin/auctions') ? "#FF8A00" : "currentColor"} strokeWidth="1.5" />
              <path d="M9 20V8" stroke={pathname === '/admin/auctions' || pathname.startsWith('/admin/auctions') ? "#FF8A00" : "currentColor"} strokeWidth="1.5" />
            </svg>
            <span>Auctions</span>
          </Link>

          <Link
            href="/admin/bids"
            className={`flex items-center px-4 py-2 mt-4 ${pathname === '/admin/bids' ? 'text-[#FF8A00] font-medium' : 'text-gray-600 hover:text-[#FF8A00]'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7H20" stroke={pathname === '/admin/bids' ? "#FF8A00" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
              <path d="M4 12H20" stroke={pathname === '/admin/bids' ? "#FF8A00" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
              <path d="M4 17H20" stroke={pathname === '/admin/bids' ? "#FF8A00" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>Bids</span>
            <span className="ml-auto bg-[#FF8A00] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">2</span>
          </Link>

          <Link
            href="/admin/users"
            className={`flex items-center px-4 py-2 mt-4 ${pathname === '/admin/users' ? 'text-[#FF8A00] font-medium' : 'text-gray-600 hover:text-[#FF8A00]'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" stroke={pathname === '/admin/users' ? "#FF8A00" : "currentColor"} strokeWidth="1.5" />
              <path d="M20 19C20 16.2386 16.4183 14 12 14C7.58172 14 4 16.2386 4 19" stroke={pathname === '/admin/users' ? "#FF8A00" : "currentColor"} strokeWidth="1.5" />
            </svg>
            <span>Users</span>
          </Link>

          <Link
            href="/admin/subscriptions"
            className={`flex items-center px-4 py-2 mt-4 ${pathname === '/admin/subscriptions' ? 'text-[#FF8A00] font-medium' : 'text-gray-600 hover:text-[#FF8A00]'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" stroke={pathname === '/admin/subscriptions' ? "#FF8A00" : "currentColor"} strokeWidth="1.5" />
              <path d="M12 8V12L15 15" stroke={pathname === '/admin/subscriptions' ? "#FF8A00" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>Subscriptions</span>
          </Link>

          <Link
            href="/admin/addresses"
            className={`flex items-center px-4 py-2 mt-4 ${pathname === '/admin/addresses' ? 'text-[#FF8A00] font-medium' : 'text-gray-600 hover:text-[#FF8A00]'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13Z" stroke={pathname === '/admin/addresses' ? "#FF8A00" : "currentColor"} strokeWidth="1.5" />
              <path d="M12 21C16 17 20 13.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 13.4183 8 17 12 21Z" stroke={pathname === '/admin/addresses' ? "#FF8A00" : "currentColor"} strokeWidth="1.5" />
            </svg>
            <span>Addresses</span>
          </Link>

          <Link
            href="/admin/settings"
            className={`flex items-center px-4 py-2 mt-4 ${pathname === '/admin/settings' ? 'text-[#FF8A00] font-medium' : 'text-gray-600 hover:text-[#FF8A00]'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke={pathname === '/admin/settings' ? "#FF8A00" : "currentColor"} strokeWidth="1.5" />
              <path d="M18.7273 14.5454C18.1948 15.5059 18.1436 16.6951 18.5864 17.7048C18.7083 17.9706 18.6433 18.2875 18.4018 18.4716L17.2605 19.3526C17.019 19.5368 16.6873 19.5006 16.4827 19.2713C15.7431 18.4479 14.6863 18.0094 13.5858 18.0661C12.4853 18.1229 11.4807 18.6681 10.8386 19.5558C10.6661 19.8041 10.3511 19.9067 10.0644 19.8229L8.7747 19.4672C8.48799 19.3835 8.29816 19.1264 8.31744 18.8339C8.37949 17.7271 7.9855 16.6464 7.20749 15.8684C6.42948 15.0904 5.34876 14.6964 4.24198 14.7585C3.94947 14.7778 3.69233 14.5879 3.60863 14.3012L3.25294 13.0116C3.16924 12.7248 3.27181 12.4099 3.52008 12.2374C4.40778 11.5952 4.95296 10.5907 5.00975 9.49018C5.06654 8.38968 4.62805 7.33287 3.80466 6.59329C3.57534 6.38866 3.53915 6.05695 3.72333 5.81547L4.60436 4.67418C4.78854 4.4327 5.10544 4.36772 5.37119 4.48959C6.38093 4.93243 7.57012 4.88118 8.53059 4.34866C9.49106 3.81614 10.1408 2.89889 10.3194 1.83278C10.3664 1.54827 10.6046 1.33945 10.8936 1.33333L12.2222 1.30556C12.5112 1.29944 12.7591 1.49911 12.8196 1.78028C13.0369 2.83893 13.7149 3.74252 14.6926 4.25135C15.6702 4.76018 16.8603 4.78452 17.8628 4.32156C18.1258 4.19291 18.4406 4.25389 18.6248 4.49538L19.5058 5.63667C19.69 5.87816 19.6539 6.20987 19.4246 6.41449C18.6012 7.15407 18.1627 8.21088 18.2195 9.31138C18.2762 10.4119 18.8214 11.4164 19.7091 12.0586C19.9574 12.2311 20.06 12.546 19.9763 12.8328L19.6206 14.1224C19.5369 14.4092 19.2798 14.599 18.9873 14.5797C18.8956 14.5752 18.8037 14.5729 18.7118 14.5729C18.7169 14.5637 18.7221 14.5546 18.7273 14.5454Z" stroke={pathname === '/admin/settings' ? "#FF8A00" : "currentColor"} strokeWidth="1.5" />
            </svg>
            <span>Settings</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-[60px] flex items-center justify-between px-4 md:px-6">
          {/* Mobile menu button */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search something"
              />
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">

            {/* Grid View */}
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>

            {/* Notifications */}
            <button className="p-2 text-gray-500 hover:text-gray-700 relative">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 17H9M12 2V4M19.0711 4.92893L17.6569 6.34315M22 12H20M4 12H2M6.34315 6.34315L4.92893 4.92893M12 22C8.13401 22 5 18.866 5 15V10C5 6.13401 8.13401 3 12 3C15.866 3 19 6.13401 19 10V15C19 18.866 15.866 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center">
              <div className="relative">
                <button className="flex items-center focus:outline-none">
                  <span className="text-sm font-medium text-gray-700 mr-2">AI</span>
                  <svg className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
