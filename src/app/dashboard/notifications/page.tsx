"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { getUserNotifications, markNotificationAsRead, deleteNotification, markAllNotificationsAsRead, Notification } from '@/services/notifications';
import NotificationCard from '@/components/notifications/NotificationCard';
import NotificationFilters from '@/components/notifications/NotificationFilters';
import Pagination, { PaginationInfo } from '@/components/shared/Pagination';



export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    count: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [selectedPriority, setSelectedPriority] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch notifications from API
  const fetchNotifications = useCallback(async (page: number = 1, retryCount: number = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build filter parameters
      const params: any = {
        page,
        page_size: 20,
      };
      
      if (activeTab === 'unread') {
        params.is_read = false;
      } else if (activeTab === 'read') {
        params.is_read = true;
      }
      
      if (selectedType) params.type = selectedType;
      if (selectedPriority) params.priority = selectedPriority;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      
      const response = await getUserNotifications(params);
      
      if (response.error) {
        // Check if it's a timeout error and we haven't retried yet
        if (response.error.includes('Connection issue') && retryCount < 2) {
          // Wait a bit and retry
          setTimeout(() => {
            fetchNotifications(page, retryCount + 1);
          }, 2000);
          return;
        }
        
        setError(response.error);
        // Only clear notifications if it's not a timeout error (preserve existing data)
        if (!response.error.includes('Connection issue')) {
          setNotifications([]);
          setPaginationInfo({ count: 0, next: null, previous: null });
        }
      } else if (response.data) {
        setNotifications(response.data.results);
        setPaginationInfo({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
          current_page: page,
          page_size: 20,
          total_pages: Math.ceil(response.data.count / 20)
        });
      }
    } catch (_err) {
      // For unexpected errors, try once more if we haven't retried
      if (retryCount < 1) {
        setTimeout(() => {
          fetchNotifications(page, retryCount + 1);
        }, 2000);
        return;
      }
      
      setError('Failed to load notifications - please refresh the page');
      setNotifications([]);
      setPaginationInfo({ count: 0, next: null, previous: null });
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedType, selectedPriority, searchQuery]);
  
  // Fetch notifications when page or filters change
  useEffect(() => {
    fetchNotifications(currentPage);
  }, [fetchNotifications, currentPage]);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchNotifications(1);
    }
  }, [activeTab, selectedType, selectedPriority, searchQuery, currentPage, fetchNotifications]);
  
  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Mark notification as read
  const markAsRead = async (id: number) => {
    try {
      const response = await markNotificationAsRead(id);
      
      if (response.error) {
        setError(response.error);
      } else {
        // Update local state immediately for better UX
        setNotifications(notifications.map(notification =>
          notification.id === id ? { ...notification, is_read: true } : notification
        ));
      }
    } catch (_err) {
      setError('Failed to mark notification as read');
    }
  };
  
  // Delete notification
  const handleDeleteNotification = async (id: number) => {
    try {
      const response = await deleteNotification(id);
      
      if (response.error) {
        setError(response.error);
      } else {
        // Refresh the current page to get updated data and pagination
        await fetchNotifications(currentPage);
      }
    } catch (_err) {
      setError('Failed to delete notification');
    }
  };
  
  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const response = await markAllNotificationsAsRead();
      
      if (response.error) {
        setError(response.error);
      } else {
        // Refresh notifications to get updated data
        await fetchNotifications(currentPage);
      }
    } catch (_err) {
      setError('Failed to mark all notifications as read');
    }
  };

  return (
    <div className="p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
        <p className="text-gray-500 text-sm mt-1">Stay updated with the latest news and activity</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Filters */}
        <div className="px-5 py-4">
          <NotificationFilters
            activeTab={activeTab}
            onTabChange={setActiveTab}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedPriority={selectedPriority}
            onPriorityChange={setSelectedPriority}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />
        </div>

        {/* Actions Bar */}
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {paginationInfo.count} notification{paginationInfo.count !== 1 ? 's' : ''}
              {activeTab !== 'all' && ` (${activeTab})`}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-gray-600 hover:text-[#FF8A00] flex items-center transition-colors"
                disabled={loading || paginationInfo.count === 0}
              >
                <CheckCircle size={14} className="mr-1" />
                Mark all as read
              </button>
            </div>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mx-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-red-600 text-sm">{error}</div>
              </div>
              <button
                onClick={() => fetchNotifications(currentPage)}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Retrying...' : 'Retry'}
              </button>
            </div>
          </div>
        )}
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF8A00]"></div>
          </div>
        )}
        
        {/* Notifications List */}
        <div className="divide-y divide-gray-100">
          {!loading && notifications.length > 0 ? (
            <div className="space-y-0">
              {notifications.map((notification) => (
                <div key={notification.id} className="px-5">
                  <NotificationCard
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={handleDeleteNotification}
                    className="border-0 rounded-none"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12 px-5">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Bell size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {loading ? 'Loading notifications...' : 'No notifications found'}
              </h3>
              <p className="text-gray-500 text-sm max-w-sm">
                {loading ? 'Please wait while we fetch your notifications.' :
                 searchQuery ? `No notifications match "${searchQuery}". Try adjusting your search or filters.` :
                 activeTab === 'unread' ? "You've read all your notifications! Check back later for updates." :
                 activeTab === 'read' ? "No read notifications yet. Notifications you've read will appear here." :
                 "You don't have any notifications yet. We'll notify you when there's something new."}
              </p>

              {(searchQuery || selectedType || selectedPriority) && !loading && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType(undefined);
                    setSelectedPriority(undefined);
                  }}
                  className="mt-4 text-sm text-[#FF8A00] hover:text-[#e67e00] font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && notifications.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-200">
            <Pagination
              paginationInfo={paginationInfo}
              onPageChange={handlePageChange}
              className=""
            />
          </div>
        )}
      </div>
    </div>
  );
}
