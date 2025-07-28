"use client";

import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { getUserNotifications, markNotificationAsRead, deleteNotification, markAllNotificationsAsRead, Notification } from '@/services/notifications';
import NotificationCard from '@/components/notifications/NotificationCard';
import NotificationFilters from '@/components/notifications/NotificationFilters';
import { filterNotifications, sortNotificationsByPriority } from '@/utils/notificationUtils';

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
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [selectedPriority, setSelectedPriority] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await getUserNotifications();
        
        if (response.error) {
          setError(response.error);
          // Fallback to mock data if API fails
          setNotifications(mockNotifications);
        } else if (response.data) {
          setNotifications(response.data);
        }
      } catch (_err) {
        setError('Failed to load notifications');
        // Fallback to mock data if API fails
        setNotifications(mockNotifications);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, []);
  
  // Filter and sort notifications
  const getFilteredNotifications = () => {
    let filtered = notifications;

    // Filter by tab
    if (activeTab === 'unread') {
      filtered = filtered.filter(notification => !notification.is_read);
    } else if (activeTab === 'read') {
      filtered = filtered.filter(notification => notification.is_read);
    }

    // Apply additional filters
    filtered = filterNotifications(filtered, {
      type: selectedType,
      priority: selectedPriority,
      search: searchQuery
    });

    // Sort by priority and date
    return sortNotificationsByPriority(filtered);
  };

  const filteredNotifications = getFilteredNotifications();
  
  // Mark notification as read
  const markAsRead = async (id: number) => {
    try {
      const response = await markNotificationAsRead(id);
      
      if (response.error) {
        setError(response.error);
      } else {
        // Update local state
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
        // Update local state
        setNotifications(notifications.filter(notification => notification.id !== id));
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
        // Update local state
        setNotifications(notifications.map(notification => ({ ...notification, is_read: true })));
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
              {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
              {activeTab !== 'all' && ` (${activeTab})`}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-gray-600 hover:text-[#FF8A00] flex items-center transition-colors"
                disabled={loading || notifications.filter(n => !n.is_read).length === 0}
              >
                <CheckCircle size={14} className="mr-1" />
                Mark all as read
              </button>
            </div>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="p-4 text-red-600 text-sm">
            {error}
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
          {!loading && filteredNotifications.length > 0 ? (
            <div className="space-y-0">
              {filteredNotifications.map((notification) => (
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
      </div>
    </div>
  );
}
