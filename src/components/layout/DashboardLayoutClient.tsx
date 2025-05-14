"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';
import AddAuctionModal, { AuctionFormData } from '@/components/auctions/AddAuctionModal';
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleAddAuction = (_auctionData: AuctionFormData) => {
    // In a real app, this would send the data to an API
    // For now, we'll just close the modal and redirect to My Auctions
    setIsModalOpen(false);

    // If we're not already on the My Auctions page, redirect there
    if (pathname !== '/dashboard/my-auctions') {
      router.push('/dashboard/my-auctions');
    }
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
          "bg-white border-r border-gray-200 flex flex-col z-50",
          isMobile
            ? `fixed inset-y-0 left-0 w-[250px] transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
            : "w-[190px]"
        )}
      >
        {/* Logo */}
        <div className="bg-[#0F1A24] text-white flex items-center justify-center h-[60px]">
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
            className={`flex items-center px-4 py-2.5 ${pathname === '/dashboard' ? 'text-[#FF8A00] font-medium' : 'text-gray-700 hover:text-[#FF8A00]'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <Home size={18} className="mr-3" />
            <span>Overview</span>
          </Link>

          <Link
            href="/dashboard/my-auctions"
            className={`flex items-center px-4 py-2.5 ${pathname === '/dashboard/my-auctions' ? 'text-[#FF8A00] font-medium' : 'text-gray-700 hover:text-[#FF8A00]'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <FileText size={18} className="mr-3" />
            <span>My Auctions</span>
            <span className="ml-auto bg-[#FF8A00] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">2</span>
          </Link>

          <Link
            href="/dashboard/auctions"
            className={`flex items-center px-4 py-2.5 ${pathname === '/dashboard/auctions' || pathname.startsWith('/dashboard/auctions/') ? 'text-[#FF8A00] font-medium' : 'text-gray-700 hover:text-[#FF8A00]'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <Package size={18} className="mr-3" />
            <span>Auctions</span>
          </Link>

          <Link
            href="/dashboard/my-bids"
            className={`flex items-center px-4 py-2.5 ${pathname === '/dashboard/my-bids' ? 'text-[#FF8A00] font-medium' : 'text-gray-700 hover:text-[#FF8A00]'}`}
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
                d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M3 12H9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M15 12H21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M7 5H17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M7 19H17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span>My Bids</span>
          </Link>

          <Link
            href="/dashboard/subscriptions"
            className={`flex items-center px-4 py-2.5 ${pathname === '/dashboard/subscriptions' ? 'text-[#FF8A00] font-medium' : 'text-gray-700 hover:text-[#FF8A00]'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <Bell size={18} className="mr-3" />
            <span>Subscriptions</span>
          </Link>

          <Link
            href="/dashboard/addresses"
            className={`flex items-center px-4 py-2.5 ${pathname === '/dashboard/addresses' ? 'text-[#FF8A00] font-medium' : 'text-gray-700 hover:text-[#FF8A00]'}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <MapPin size={18} className="mr-3" />
            <span>Addresses</span>
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
        <div className="p-4 border-t border-gray-100">
          <div className="mb-1.5 text-sm font-medium">Become vendor</div>
          <p className="text-xs text-gray-500 mb-3">
            Vendors can sell products and manage a store with a vendor dashboard.
          </p>
          <button className="w-full bg-[#FF8A00] text-white py-2 px-4 rounded-md hover:bg-[#e67e00] transition-colors mb-4 text-sm">
            Become vendor
          </button>

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
      <div className={cn("flex-1", isMobile ? "w-full" : "")}>
        {/* Header */}
        <header className="bg-white border-b border-gray-100 h-[60px] flex items-center justify-between px-4 md:px-6">
          {/* Mobile Menu Toggle */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 mr-2 text-gray-500 hover:text-gray-700"
            >
              <Menu size={20} />
            </button>
          )}

          {/* Search */}
          <div className={cn(
            "relative",
            isMobile ? "w-full max-w-[160px]" : "w-[300px]"
          )}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={isMobile ? "Search" : "Search something"}
              className="block w-full pl-10 pr-3 py-2 border border-gray-100 rounded-md bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4 md:space-x-4">
            {/* Add Auctions Button - Show text only on larger screens */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#FF8A00] text-white py-2 px-3 md:px-4 rounded-md flex items-center ml-3 text-sm"
            >
              <Plus size={16} className="md:mr-2" />
              <span className="hidden md:inline">Add auctions</span>
            </button>

            {/* Notification Button */}
            <button className="p-2 text-gray-500 hover:text-gray-700 relative">
              <Bell size={18} />
            </button>

            <div className="flex items-center">
              {/* Only show name on larger screens */}
              <span className="hidden md:inline text-sm font-medium mr-2">Hello {user?.firstName || user?.username?.split(' ')[0] || 'User'}</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        {children}

        {/* Add Auction Modal */}
        <AddAuctionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddAuction}
        />
      </div>
    </div>
  );
}
