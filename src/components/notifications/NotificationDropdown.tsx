"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bell, Check, Settings, ExternalLink, X } from 'lucide-react';
import { 
  getUnreadNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  Notification 
} from '@/services/notifications';
import NotificationCard from './NotificationCard';
import { sortNotificationsByPriority } from '@/utils/notificationUtils';
import { cn } from '@/lib/utils';

interface NotificationDropdownProps {
  unreadCount: number;
  onUnreadCountChange: (count: number) => void;
}

export default function NotificationDropdown({ 
  unreadCount, 
  onUnreadCountChange 
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen && notifications.length === 0) {
      fetchNotifications();
    }
  }, [isOpen, notifications.length]);
  
  const fetchNotifications = async (retryCount: number = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUnreadNotifications({ page_size: 10 }); // Get first 10
      
      if (response.error) {
        // If it's a connection issue and we haven't retried, try again
        if (response.error.includes('Connection issue') && retryCount < 1) {
          setTimeout(() => {
            fetchNotifications(retryCount + 1);
          }, 1500);
          return;
        }
        setError(response.error);
      } else if (response.data) {
        const sortedNotifications = sortNotificationsByPriority(response.data.results);
        setNotifications(sortedNotifications);
      }
    } catch (_err) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };
  
  const handleMarkAsRead = async (id: number) => {
    try {
      const response = await markNotificationAsRead(id);
      
      if (!response.error) {
        // Update local state
        setNotifications(notifications.map(notification =>
          notification.id === id ? { ...notification, is_read: true } : notification
        ).filter(n => !n.is_read)); // Remove read notifications from unread list
        
        // Update unread count
        onUnreadCountChange(Math.max(0, unreadCount - 1));
      }
    } catch (_err) {
      // Error handling - silently fail for now
    }
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      const response = await markAllNotificationsAsRead();
      
      if (!response.error) {
        setNotifications([]);
        onUnreadCountChange(0);
      }
    } catch (_err) {
      // Error handling - silently fail for now
    }
  };
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={toggleDropdown}
        className={cn(
          "relative p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-lg",
          isOpen && "bg-gray-100 text-gray-700"
        )}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center space-x-2">
              {notifications.length > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-[#FF8A00] hover:text-[#e67e00] font-medium"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#FF8A00]"></div>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-600 text-sm">
                {error}
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div key={notification.id} className="hover:bg-gray-50">
                    <NotificationCard
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      compact={true}
                      showActions={true}
                      className="border-0 rounded-none"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8">
                <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                  <Check size={20} className="text-gray-400" />
                </div>
                <h4 className="text-gray-700 font-medium mb-1">All caught up!</h4>
                <p className="text-gray-500 text-sm">
                  You&apos;ve read all your notifications
                </p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="border-t border-gray-200 p-3">
            <Link
              href="/dashboard/notifications"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-full px-4 py-2 text-sm text-[#FF8A00] hover:text-[#e67e00] hover:bg-gray-50 rounded-lg transition-colors font-medium"
            >
              <Settings size={16} className="mr-2" />
              View all notifications
              <ExternalLink size={14} className="ml-2" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
