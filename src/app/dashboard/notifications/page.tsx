"use client";

import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { getUserNotifications, markNotificationAsRead, deleteNotification, markAllNotificationsAsRead, Notification } from '@/services/notifications';

// Fallback mock data in case API fails
const mockNotifications = [
  {
    id: 1,
    title: "Welcome to Nordic Loop",
    message: "Thank you for joining our community! Explore our marketplace and start creating your first auction.",
    date: "2025-07-01T10:00:00",
    isRead: true,
    type: "welcome"
  }
];

// Function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
    });
  }
};

// Get notification icon based on type
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'feature':
      return <div className="bg-blue-100 p-2 rounded-full"><Bell size={16} className="text-blue-600" /></div>;
    case 'system':
      return <div className="bg-amber-100 p-2 rounded-full"><Bell size={16} className="text-amber-600" /></div>;
    case 'auction':
      return <div className="bg-green-100 p-2 rounded-full"><Bell size={16} className="text-green-600" /></div>;
    case 'promotion':
      return <div className="bg-purple-100 p-2 rounded-full"><Bell size={16} className="text-purple-600" /></div>;
    default:
      return <div className="bg-gray-100 p-2 rounded-full"><Bell size={16} className="text-gray-600" /></div>;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
  
  // Filter notifications based on active tab
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : activeTab === 'unread'
      ? notifications.filter(notification => !notification.isRead)
      : notifications.filter(notification => notification.isRead);
  
  // Mark notification as read
  const markAsRead = async (id: number) => {
    try {
      const response = await markNotificationAsRead(id);
      
      if (response.error) {
        setError(response.error);
      } else {
        // Update local state
        setNotifications(notifications.map(notification => 
          notification.id === id ? { ...notification, isRead: true } : notification
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
        setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
      }
    } catch (_err) {
      setError('Failed to mark all notifications as read');
    }
  };

  return (
    <div className="p-5">
      <div className="mb-5">
        <h1 className="text-xl font-medium text-gray-900">Notifications</h1>
        <p className="text-gray-500 text-sm mt-1">Stay updated with the latest news and activity</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="flex items-center border-b border-gray-200 px-5">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'all' ? 'text-[#FF8A00] border-b-2 border-[#FF8A00]' : 'text-gray-600 hover:text-gray-800'}`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveTab('unread')}
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'unread' ? 'text-[#FF8A00] border-b-2 border-[#FF8A00]' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Unread
          </button>
          <button 
            onClick={() => setActiveTab('read')}
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'read' ? 'text-[#FF8A00] border-b-2 border-[#FF8A00]' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Read
          </button>
          <div className="ml-auto flex items-center">
            <button 
              onClick={handleMarkAllAsRead}
              className="text-sm text-gray-600 hover:text-[#FF8A00] flex items-center"
              disabled={loading || notifications.length === 0}
            >
              <Check size={14} className="mr-1" />
              Mark all as read
            </button>
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
        <div>
          {!loading && filteredNotifications.length > 0 ? (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`border-b border-gray-100 pb-3 last:border-0 last:pb-0 ${!notification.isRead ? 'bg-gray-50 -mx-5 px-5 py-3 mb-3' : ''}`}
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-1 flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                          {formatDate(notification.date)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex items-center space-x-4">
                        {!notification.isRead && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-[#FF8A00] hover:text-[#e67e00] flex items-center"
                            disabled={loading}
                          >
                            <Check size={12} className="mr-1" />
                            Mark as read
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="text-xs text-gray-500 hover:text-red-500 flex items-center"
                          disabled={loading}
                        >
                          <Trash2 size={12} className="mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                <Bell size={20} className="text-gray-400" />
              </div>
              <h3 className="text-gray-700 font-medium mb-1">No notifications</h3>
              <p className="text-gray-500 text-sm">
                {activeTab === 'unread' 
                  ? "You've read all your notifications" 
                  : activeTab === 'read'
                    ? "No read notifications yet"
                    : "You don't have any notifications yet"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
