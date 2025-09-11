"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';
import {
  User,
  LogOut,
  Search,
  Plus,
  Menu,
  ChevronDown,
  Building,
  Settings
} from 'lucide-react';
import { getUnreadNotificationCount } from '@/services/notifications';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';

interface DashboardHeaderProps {
  onMobileMenuToggle?: () => void;
  showAddAuctionsButton?: boolean;
}

export default function DashboardHeader({ onMobileMenuToggle, showAddAuctionsButton }: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState<number>(0);

  // Check if the screen is mobile
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleLogout = () => {
    // Call the logout function from the auth context
    logout();
    // Redirect to the login page
    router.push('/login');
  };

  const handleWorkspaceSwitch = (workspace: 'user' | 'admin') => {
    setWorkspaceDropdownOpen(false);
    if (workspace === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };
  
  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadNotificationCount = async () => {
      try {
        const response = await getUnreadNotificationCount();
        if (response.data) {
          setUnreadNotificationCount(response.data.count);
        }
      } catch (_error) {
        // Error handling - silently fail
      }
    };
    
    fetchUnreadNotificationCount();
    
    // Set up interval to refresh the count every minute
    const intervalId = setInterval(fetchUnreadNotificationCount, 60000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const isAdminPath = pathname.startsWith('/admin');

  return (
    <header className="bg-white border-b border-gray-100 h-[60px] flex items-center px-4 md:px-6 flex-shrink-0">
      {/* Left Side */}
      <div className="flex items-center">
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
        {/* <div className={cn(
          "relative",
          isMobile ? "w-[160px]" : "w-[300px]"
        )}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={isMobile ? "Search" : "Search something"}
            className="block w-full pl-10 pr-3 py-2 border border-gray-100 rounded-md bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
          />
        </div> */}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-3 md:space-x-4 ml-auto">
        {/* Add Auctions Button - Hidden as requested */}
        {showAddAuctionsButton && false && (
          <Link
            href="/dashboard/auctions/create-alternative"
            className="bg-[#FF8A00] text-white py-2 px-3 md:px-4 rounded-md flex items-center text-sm hover:bg-[#e67e00] transition-colors shadow-sm"
          >
            <Plus size={16} className="md:mr-2" />
            <span className="hidden md:inline">Add auctions</span>
          </Link>
        )}

        {/* Workspace Switcher - Only for Admin users */}
        {user?.role === 'Admin' && (
          <div className="relative">
            <button
              onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
              className="flex items-center px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Building size={16} className="mr-2 text-gray-600" />
              <span className="hidden sm:inline font-medium text-gray-700">
                {isAdminPath ? 'Admin Panel' : 'User Dashboard'}
              </span>
              <ChevronDown size={14} className={`ml-2 transition-transform ${workspaceDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Workspace Dropdown */}
            {workspaceDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setWorkspaceDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                  <div className="py-1">
                    <button
                      onClick={() => handleWorkspaceSwitch('user')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={16} className="mr-3 text-gray-400" />
                      <div>
                        <div className="font-medium">User Dashboard</div>
                        <div className="text-xs text-gray-500">Standard user interface</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleWorkspaceSwitch('admin')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings size={16} className="mr-3 text-gray-400" />
                      <div>
                        <div className="font-medium">Admin Panel</div>
                        <div className="text-xs text-gray-500">Administrative controls</div>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Notification Dropdown */}
        <NotificationDropdown
          unreadCount={unreadNotificationCount}
          onUnreadCountChange={setUnreadNotificationCount}
        />

        {/* User Dropdown */}
        <div className="flex items-center relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center hover:bg-gray-50 rounded-md px-2 py-1 transition-colors"
          >
            {/* Only show name on larger screens */}
            <span className="hidden md:inline text-sm font-medium mr-2">
              {user?.firstName || user?.username?.split(' ')[0] || 'User'}
            </span>
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