"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';
import {
  Bell,
  MapPin,
  User,
  LogOut,
  Search,
  Plus,
  Menu,
  ChevronDown
} from 'lucide-react';

interface DashboardHeaderProps {
  onMobileMenuToggle?: () => void;
  showAddAuctionsButton?: boolean;
}

export default function DashboardHeader({ onMobileMenuToggle, showAddAuctionsButton }: DashboardHeaderProps) {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Check if the screen is mobile
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleLogout = () => {
    // Call the logout function from the auth context
    logout();
    // Redirect to the login page
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-100 h-[60px] flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      {/* Mobile Menu Toggle */}
      {isMobile && onMobileMenuToggle && (
        <button
          onClick={onMobileMenuToggle}
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
        {showAddAuctionsButton && (
          <Link
            href="/dashboard/auctions/create-alternative"
            className="bg-[#FF8A00] text-white py-2 px-3 md:px-4 rounded-md flex items-center ml-3 text-sm hover:bg-[#e67e00] transition-colors"
          >
            <Plus size={16} className="md:mr-2" />
            <span className="hidden md:inline">Add auctions</span>
          </Link>
        )}

        {/* Notification Button */}
        <button className="p-2 text-gray-500 hover:text-gray-700 relative">
          <Bell size={18} />
        </button>

        <div className="flex items-center relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center hover:bg-gray-50 rounded-md px-2 py-1 transition-colors"
          >
            {/* Only show name on larger screens */}
            <span className="hidden md:inline text-sm font-medium mr-2"> {user?.firstName || user?.username?.split(' ')[0] || 'User'}</span>
            <ChevronDown size={16} className={`transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* User Dropdown Menu */}
          {userDropdownOpen && (
            <>
              {/* Backdrop to close dropdown when clicking outside */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setUserDropdownOpen(false)}
              />
              
              {/* Dropdown Content */}
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                <div className="p-3 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user?.username || 'User'
                    }
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {user?.email || 'No email provided'}
                  </div>
                </div>
                
                <div className="py-1">
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User size={16} className="mr-3" />
                    Profile Settings
                  </Link>
                  
                  <Link
                    href="/dashboard/addresses"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <MapPin size={16} className="mr-3" />
                    My Addresses
                  </Link>
                  
                  <Link
                    href="/dashboard/subscriptions"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Bell size={16} className="mr-3" />
                    Subscriptions
                  </Link>
                </div>
                
                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} className="mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
} 