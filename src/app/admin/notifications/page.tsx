"use client";

import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Send, Users, User, Search, X } from 'lucide-react';
import { 
  getAllNotifications, 
  createNotification, 
  createNotificationForAllUsers, 
  deleteNotificationForAllUsers,
  Notification,
  CreateNotificationRequest
} from '@/services/notifications';

// Notification type options
const notificationTypes = [
  { value: 'feature', label: 'New Feature', color: 'blue' },
  { value: 'system', label: 'System Update', color: 'amber' },
  { value: 'auction', label: 'Auction Related', color: 'green' },
  { value: 'promotion', label: 'Promotion', color: 'purple' },
  { value: 'welcome', label: 'Welcome', color: 'gray' },
];

// Function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
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

// Mock users for user selection
// In a real implementation, this would be fetched from an API
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Robert Johnson', email: 'robert@example.com' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com' },
  { id: 5, name: 'Michael Wilson', email: 'michael@example.com' },
];

export default function AdminNotificationsPage() {
  // State for notifications list
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for notification creation form
  const [formData, setFormData] = useState<CreateNotificationRequest>({
    title: '',
    message: '',
    type: 'system',
    userId: null
  });
  
  // State for user selection
  const [selectedUser, setSelectedUser] = useState<{ id: number, name: string, email: string } | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [sendToAllUsers, setSendToAllUsers] = useState(true);
  
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch all notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await getAllNotifications();
        
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setNotifications(response.data);
        }
      } catch (_err) {
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, []);
  
  // Filter users based on search query
  const filteredUsers = userSearchQuery 
    ? mockUsers.filter(user => 
        user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
      )
    : mockUsers;
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset success/error messages when form is edited
    setSubmitSuccess(false);
    setSubmitError(null);
  };
  
  // Handle user selection
  const handleSelectUser = (user: { id: number, name: string, email: string }) => {
    setSelectedUser(user);
    setFormData(prev => ({ ...prev, userId: user.id }));
    setShowUserDropdown(false);
    setSendToAllUsers(false);
  };
  
  // Handle send to all users toggle
  const handleSendToAllToggle = () => {
    setSendToAllUsers(!sendToAllUsers);
    if (!sendToAllUsers) {
      setSelectedUser(null);
      setFormData(prev => ({ ...prev, userId: null }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.message.trim()) {
      setSubmitError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      let response;
      
      if (sendToAllUsers) {
        // Send to all users
        const { userId, ...notificationData } = formData;
        response = await createNotificationForAllUsers(notificationData);
      } else {
        // Send to specific user
        response = await createNotification(formData);
      }
      
      if (response.error) {
        setSubmitError(response.error);
      } else {
        setSubmitSuccess(true);
        
        // Reset form
        setFormData({
          title: '',
          message: '',
          type: 'system',
          userId: null
        });
        setSelectedUser(null);
        setSendToAllUsers(true);
        
        // Refresh notifications list
        const refreshResponse = await getAllNotifications();
        if (refreshResponse.data) {
          setNotifications(refreshResponse.data);
        }
      }
    } catch (_err) {
      setSubmitError('Failed to create notification');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle notification deletion
  const handleDeleteNotification = async (id: number) => {
    try {
      setLoading(true);
      const response = await deleteNotificationForAllUsers(id);
      
      if (response.error) {
        setError(response.error);
      } else {
        // Update local state
        setNotifications(notifications.filter(notification => notification.id !== id));
      }
    } catch (_err) {
      setError('Failed to delete notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <div className="mb-5">
        <h1 className="text-xl font-medium text-gray-900">Notification Management</h1>
        <p className="text-gray-500 text-sm mt-1">Create and manage notifications for users</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Notification Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-medium mb-4">Create New Notification</h2>
          
          {submitSuccess && (
            <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 flex items-center">
              <Check size={16} className="mr-2" />
              Notification created successfully
            </div>
          )}
          
          {submitError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-center">
              <X size={16} className="mr-2" />
              {submitError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                placeholder="Notification title"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                placeholder="Notification message"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
              >
                {notificationTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipients
              </label>
              
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="sendToAll"
                  checked={sendToAllUsers}
                  onChange={handleSendToAllToggle}
                  className="h-4 w-4 text-[#FF8A00] focus:ring-[#FF8A00] border-gray-300 rounded"
                />
                <label htmlFor="sendToAll" className="ml-2 text-sm text-gray-700 flex items-center">
                  <Users size={16} className="mr-1" />
                  Send to all users
                </label>
              </div>
              
              {!sendToAllUsers && (
                <div className="relative">
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                    <div className="px-3 py-2 bg-gray-50 border-r border-gray-300">
                      <User size={16} className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search for a user..."
                      value={userSearchQuery}
                      onChange={(e) => {
                        setUserSearchQuery(e.target.value);
                        setShowUserDropdown(true);
                      }}
                      onFocus={() => setShowUserDropdown(true)}
                      className="flex-1 px-3 py-2 focus:outline-none"
                    />
                    {selectedUser && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(null);
                          setUserSearchQuery('');
                          setFormData(prev => ({ ...prev, userId: null }));
                        }}
                        className="px-2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  
                  {selectedUser && (
                    <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded-md flex items-center">
                      <div className="bg-[#FF8A00] text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                        {selectedUser.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{selectedUser.name}</div>
                        <div className="text-xs text-gray-500">{selectedUser.email}</div>
                      </div>
                    </div>
                  )}
                  
                  {showUserDropdown && !selectedUser && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                          <div
                            key={user.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={() => handleSelectUser(user)}
                          >
                            <div className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center mr-2">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{user.name}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">No users found</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FF8A00] text-white py-2 px-4 rounded-md hover:bg-[#e67e00] transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                ) : (
                  <Send size={16} className="mr-2" />
                )}
                Send Notification
              </button>
            </div>
          </form>
        </div>
        
        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="text-lg font-medium">Recent Notifications</h2>
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
          <div className="p-5">
            {!loading && notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className="border border-gray-100 rounded-md p-4"
                  >
                    <div className="flex items-start">
                      <div className="mr-3 mt-1 flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h3>
                          <button 
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="text-gray-400 hover:text-red-500"
                            disabled={loading}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatDate(notification.date)}</span>
                          <span>
                            {notification.userId ? `Sent to user #${notification.userId}` : 'Sent to all users'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !loading && (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                  <Bell size={20} className="text-gray-400" />
                </div>
                <h3 className="text-gray-700 font-medium mb-1">No notifications</h3>
                <p className="text-gray-500 text-sm">
                  Create your first notification using the form
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
