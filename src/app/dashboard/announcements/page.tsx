"use client";

import React, { useState } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';

// Mock data for announcements/notifications
const mockNotifications = [
  {
    id: 1,
    title: "New Feature: Auction Analytics",
    message: "We've launched a new analytics dashboard for your auctions. Track performance in real-time!",
    date: "2025-07-10T14:30:00",
    isRead: false,
    type: "feature"
  },
  {
    id: 2,
    title: "System Maintenance",
    message: "Nordic Loop will undergo scheduled maintenance on July 15th from 2-4 AM UTC. Some features may be temporarily unavailable.",
    date: "2025-07-08T09:15:00",
    isRead: true,
    type: "system"
  },
  {
    id: 3,
    title: "Your Auction Has a New Bid!",
    message: "Someone placed a bid on your 'Vintage Wooden Chair' auction. Check it out now!",
    date: "2025-07-07T18:45:00",
    isRead: false,
    type: "auction"
  },
  {
    id: 4,
    title: "Limited Time Promotion",
    message: "Enjoy 50% off on premium listing fees until July 20th. Upgrade your auctions today!",
    date: "2025-07-05T11:20:00",
    isRead: true,
    type: "promotion"
  },
  {
    id: 5,
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

export default function AnnouncementsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter notifications based on active tab
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : activeTab === 'unread'
      ? notifications.filter(notification => !notification.isRead)
      : notifications.filter(notification => notification.isRead);
  
  // Mark notification as read
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };
  
  // Delete notification
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };

  return (
    <div className="p-5">
      <div className="mb-5">
        <h1 className="text-xl font-medium text-gray-900">Announcements & Notifications</h1>
        <p className="text-gray-500 text-sm mt-1">Stay updated with the latest news and activity</p>
      </div>
      
      <div className="bg-white border border-gray-100 rounded-md p-5">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 -mx-5 px-5 -mt-5 mb-4">
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
              onClick={markAllAsRead}
              className="text-sm text-gray-600 hover:text-[#FF8A00] flex items-center"
            >
              <Check size={14} className="mr-1" />
              Mark all as read
            </button>
          </div>
        </div>
        
        {/* Notifications List */}
        <div>
          {filteredNotifications.length > 0 ? (
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
                          >
                            <Check size={12} className="mr-1" />
                            Mark as read
                          </button>
                        )}
                        <button 
                          onClick={() => deleteNotification(notification.id)}
                          className="text-xs text-gray-500 hover:text-red-500 flex items-center"
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
