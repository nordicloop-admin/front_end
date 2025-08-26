"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { getUserNotificationsPaginated, markNotificationAsRead, deleteNotification, markAllNotificationsAsRead, Notification } from '@/services/notifications';
import NotificationCard from '@/components/notifications/NotificationCard';
import NotificationFilters from '@/components/notifications/NotificationFilters';
import Pagination from '@/components/ui/Pagination';
import { sortNotificationsByPriority } from '@/utils/notificationUtils';

// Fallback mock data in case API fails
const mockNotifications = [
  {
    id: 1,
    title: "Welcome to Nordic Loop",
    message: "Thank you for joining our community! Explore our marketplace and start creating your first auction.",
    date: "2025-07-01T10:00:00",
    is_read: true,
    type: "welcome"
  }
];



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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const fetchNotifications = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        page_size: pageSize,
        type: selectedType,
        priority: selectedPriority,
        search: searchQuery || undefined,
        is_read: activeTab === 'all' ? undefined : activeTab === 'read'
      };

      const response = await getUserNotificationsPaginated(params);

      if (response.error) {
        setError(response.error);
        // Fallback to mock data if API fails
        setNotifications(mockNotifications);
        setTotalCount(mockNotifications.length);
        setTotalPages(1);
      } else if (response.data) {
        setNotifications(response.data.results);
        setTotalCount(response.data.count);
        setTotalPages(Math.ceil(response.data.count / pageSize));
        setCurrentPage(page);
      }
    } catch (_err) {
      setError('Failed to load notifications');
      // Fallback to mock data if API fails
      setNotifications(mockNotifications);
      setTotalCount(mockNotifications.length);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedType, selectedPriority, searchQuery, pageSize]);

  // Initial fetch and refetch when filters change
  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);
  
  // Sort notifications by priority (server already orders by date)
  const sortedNotifications = sortNotificationsByPriority(notifications);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    fetchNotifications(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };
  
  // Mark notification as read
  const markAsRead = async (id: number) => {
    try {
      const response = await markNotificationAsRead(id);

      if (response.error) {
        setError(response.error);
      } else {
        // Refresh current page to reflect changes
        fetchNotifications(currentPage);
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
        // Refresh current page to reflect changes
        fetchNotifications(currentPage);
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
        // Refresh current page to reflect changes
        fetchNotifications(currentPage);
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
              {totalCount} notification{totalCount !== 1 ? 's' : ''} total
              {activeTab !== 'all' && ` (${activeTab})`}
              {totalCount > 0 && (
                <span className="ml-2">
                  • Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} of {totalCount}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-gray-600 hover:text-[#FF8A00] flex items-center transition-colors"
                disabled={loading || sortedNotifications.filter(n => !n.is_read).length === 0}
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
          {!loading && sortedNotifications.length > 0 ? (
            <>
              <div className="space-y-0">
                {sortedNotifications.map((notification) => (
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-5 py-4 border-t border-gray-200">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalCount={totalCount}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    showPageSizeSelector={true}
                  />
                </div>
              )}
            </>
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
