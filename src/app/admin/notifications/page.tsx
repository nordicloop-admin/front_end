"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  Check,
  Trash2,
  Send,
  User,
  X,
  Plus,
  Search,
  Calendar,
  AlertCircle,
  Copy
} from 'lucide-react';
import CustomDropdown from '@/components/ui/CustomDropdown';
import {
  getAllNotifications,
  createNotification,
  createNotificationForAllUsers,
  deleteNotificationForAllUsers,
  Notification,
  CreateNotificationRequest
} from '@/services/notifications';
import { searchUsers } from '@/services/users';
import Modal from '@/components/ui/modal';
import Pagination from '@/components/ui/Pagination';
import {
  getNotificationIconComponent,
  getNotificationTypeConfig,
  getNotificationCategories,
  formatNotificationDate
} from '@/utils/notificationUtils';

// Priority options
const priorityOptions = [
  { value: 'low', label: 'Low Priority', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-700' },
  { value: 'normal', label: 'Normal Priority', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  { value: 'high', label: 'High Priority', color: 'amber', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
  { value: 'urgent', label: 'Urgent', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-700' },
];

// Subscription targeting options
const subscriptionTargetOptions = [
  { value: 'all', label: 'All Users' },
  { value: 'free', label: 'Free Plan Users' },
  { value: 'standard', label: 'Standard Plan Users' },
  { value: 'premium', label: 'Premium Plan Users' }
];



// User type for the component
interface User {
  id: number;
  name: string;
  company_name: string;
}

export default function AdminNotificationsPage() {
  // State for notifications list with pagination
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for notification creation form
  const [formData, setFormData] = useState<CreateNotificationRequest>({
    title: '',
    message: '',
    type: 'system',
    priority: 'normal',
    userId: null,
    subscription_target: 'all'
  });

  // State for user selection
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState<User[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [sendToAllUsers, setSendToAllUsers] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // State for subscription targeting
  const [targetingMode, setTargetingMode] = useState<'all' | 'subscription' | 'specific'>('all');

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // State for UI controls
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('');


  // Get notification categories
  const notificationCategories = getNotificationCategories();

  // Pagination handlers
  const handlePageChange = (page: number) => {
    fetchNotifications(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  // Fetch notifications with pagination and filters
  const fetchNotifications = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllNotifications({
        page,
        page_size: pageSize,
        type: selectedTypeFilter || undefined,
        priority: selectedPriorityFilter || undefined,
        search: searchQuery || undefined,
      });

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setNotifications(response.data.results);
        setTotalCount(response.data.count);
        setTotalPages(Math.ceil(response.data.count / pageSize));
        setCurrentPage(page);
      }
    } catch (_err) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [selectedTypeFilter, selectedPriorityFilter, searchQuery, pageSize]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  // Debounced search to avoid too many API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      if (currentPage === 1) {
        fetchNotifications(1);
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery, selectedTypeFilter, selectedPriorityFilter, currentPage, fetchNotifications]);
  
  // Search users from API
  const searchUsersFromAPI = useCallback(async (query: string) => {
    if (!query.trim()) {
      setUserSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await searchUsers(query);
      
      if (response.data) {
        setUserSearchResults(response.data.results);
      } else {
        setUserSearchResults([]);
      }
    } catch (_err) {
      setUserSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);
  
  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      searchUsersFromAPI(userSearchQuery);
    }, 300);
    
    return () => {
      clearTimeout(handler);
    };
  }, [userSearchQuery, searchUsersFromAPI]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset success/error messages when form is edited
    setSubmitSuccess(false);
    setSubmitError(null);
  };
  
  // Handle user search input
  const handleUserSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setUserSearchQuery(query);
    setShowUserDropdown(true);
  };

  // Handle user selection
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setFormData(prev => ({ ...prev, userId: user.id }));
    setShowUserDropdown(false);
    setSendToAllUsers(false);
    setUserSearchQuery('');
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
        const { userId: _userId, ...notificationData } = formData;
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
          priority: 'normal',
          userId: null
        });
        setSelectedUser(null);
        setSendToAllUsers(true);
        setShowCreateForm(false);

        // Refresh notifications list
        fetchNotifications(currentPage);
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
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notification Management</h1>
          <p className="text-gray-600 mt-1">Create and manage notifications for users</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-[#FF8A00] text-white px-4 py-2 rounded-md hover:bg-[#e67e00] transition-colors flex items-center space-x-2 text-sm"
        >
          <Plus size={16} />
          <span>Create Notification</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900 mb-1">{totalCount}</div>
            <div className="text-sm text-gray-600">Total Notifications</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900 mb-1">
              {notifications.filter(n => {
                const notificationDate = new Date(n.date);
                const now = new Date();
                return notificationDate.getMonth() === now.getMonth() &&
                       notificationDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <div className="text-sm text-gray-600">This Month</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900 mb-1">
              {notifications.filter(n => n.priority === 'high' || n.priority === 'urgent').length}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900 mb-1">
              {notifications.filter(n => !n.is_read).length}
            </div>
            <div className="text-sm text-gray-600">Unread</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                />
              </div>

              <CustomDropdown
                options={[
                  { value: '', label: 'All Types' },
                  ...notificationCategories.map(category => ({
                    value: category.value,
                    label: category.label
                  }))
                ]}
                value={selectedTypeFilter}
                onChange={setSelectedTypeFilter}
                placeholder="All Types"
              />

              <CustomDropdown
                options={[
                  { value: '', label: 'All Priorities' },
                  ...priorityOptions.map(priority => ({
                    value: priority.value,
                    label: priority.label
                  }))
                ]}
                value={selectedPriorityFilter}
                onChange={setSelectedPriorityFilter}
                placeholder="All Priorities"
              />

              {(searchQuery || selectedTypeFilter || selectedPriorityFilter) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTypeFilter('');
                    setSelectedPriorityFilter('');
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Showing {notifications.length} of {totalCount} notifications
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Notifications List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF8A00]"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Notifications</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : notifications.length > 0 ? (
          <>
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => {
                const typeConfig = getNotificationTypeConfig(notification.type);
                const NotificationIcon = getNotificationIconComponent(notification.type);

                return (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Icon */}
                        <div className={`p-2 rounded-lg ${typeConfig.bgColor}`}>
                          <NotificationIcon className={`w-4 h-4 ${typeConfig.color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-base font-medium text-gray-900 truncate">
                              {notification.title}
                            </h3>

                            {/* Read Status */}
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-[#FF8A00] rounded-full"></div>
                            )}

                            {/* Priority Badge */}
                            {notification.priority === 'high' || notification.priority === 'urgent' ? (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                notification.priority === 'urgent'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}>
                                {notification.priority}
                              </span>
                            ) : null}

                            {/* Type Badge */}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeConfig.bgColor} ${typeConfig.color}`}>
                              {typeConfig.label}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-3">
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatNotificationDate(notification.date)}</span>
                              </span>

                              <span className="flex items-center space-x-1">
                                <User className="w-4 h-4" />
                                <span>
                                  {notification.company_name ? notification.company_name : 'All Users'}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${notification.title}\n\n${notification.message}`);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                          title="Copy content"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete notification"
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-4 border-t border-gray-200">
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
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications Found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedTypeFilter || selectedPriorityFilter
                ? 'No notifications match your current filters. Try adjusting your search criteria.'
                : 'Get started by creating your first notification for users.'}
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-[#FF8A00] text-white px-6 py-2 rounded-md hover:bg-[#e67e00] transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Notification</span>
            </button>
          </div>
        )}
      </div>

      {/* Create Notification Modal */}
      <Modal
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        title="Create New Notification"
        maxWidth="2xl"
      >
              {submitSuccess && (
                <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 flex items-center">
                  <Check size={16} className="mr-2" />
                  <span>Notification created successfully!</span>
                </div>
              )}

              {submitError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-center">
                  <X size={16} className="mr-2" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Notification Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                      placeholder="Enter notification title..."
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <CustomDropdown
                      options={notificationCategories.map(category => ({
                        value: category.value,
                        label: category.label
                      }))}
                      value={formData.type}
                      onChange={(value) => handleInputChange({ target: { name: 'type', value } } as any)}
                      placeholder="Select notification type"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority || 'normal'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                    >
                      {priorityOptions.map((priority) => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Audience
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="targeting"
                          checked={targetingMode === 'all'}
                          onChange={() => {
                            setTargetingMode('all');
                            setFormData({ ...formData, subscription_target: 'all', userId: null });
                            setSendToAllUsers(true);
                          }}
                          className="w-4 h-4 text-[#FF8A00] border-gray-300 focus:ring-[#FF8A00]"
                        />
                        <span className="ml-2 text-sm text-gray-700">All Users</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="targeting"
                          checked={targetingMode === 'subscription'}
                          onChange={() => {
                            setTargetingMode('subscription');
                            setFormData({ ...formData, userId: null });
                            setSendToAllUsers(true);
                          }}
                          className="w-4 h-4 text-[#FF8A00] border-gray-300 focus:ring-[#FF8A00]"
                        />
                        <span className="ml-2 text-sm text-gray-700">By Subscription Plan</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="targeting"
                          checked={targetingMode === 'specific'}
                          onChange={() => {
                            setTargetingMode('specific');
                            setFormData({ ...formData, subscription_target: 'all' });
                            setSendToAllUsers(false);
                          }}
                          className="w-4 h-4 text-[#FF8A00] border-gray-300 focus:ring-[#FF8A00]"
                        />
                        <span className="ml-2 text-sm text-gray-700">Specific User</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Subscription Plan Selector */}
                {targetingMode === 'subscription' && (
                  <div>
                    <label htmlFor="subscriptionTarget" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Subscription Plan
                    </label>
                    <select
                      id="subscriptionTarget"
                      name="subscription_target"
                      value={formData.subscription_target || 'all'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                    >
                      {subscriptionTargetOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-2">
                      This will send the notification to all users with the selected subscription plan.
                    </p>
                  </div>
                )}

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent resize-none"
                    placeholder="Enter your notification message here..."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {formData.message.length}/500 characters
                  </p>
                </div>

                {targetingMode === 'specific' && (
                  <div>
                    <label htmlFor="userSearch" className="block text-sm font-medium text-gray-700 mb-2">
                      Select User <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="userSearch"
                        value={userSearchQuery}
                        onChange={handleUserSearch}
                        onFocus={() => setShowUserDropdown(true)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                        placeholder="Search for a specific user..."
                      />

                      {selectedUser && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-[#FF8A00] text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                              <User size={16} />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{selectedUser.name}</div>
                              <div className="text-sm text-gray-500">{selectedUser.company_name}</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(null);
                              setFormData({ ...formData, userId: null });
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}

                      {showUserDropdown && userSearchQuery && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                          {isSearching ? (
                            <div className="px-4 py-3 text-sm text-gray-500 flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#FF8A00] mr-2"></div>
                              Searching users...
                            </div>
                          ) : userSearchResults.length > 0 ? (
                            userSearchResults.map((user) => (
                              <div
                                key={user.id}
                                onClick={() => handleSelectUser(user)}
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center border-b border-gray-100 last:border-b-0"
                              >
                                <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                                  <User size={14} className="text-gray-600" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                  <div className="text-xs text-gray-500">{user.company_name}</div>
                                </div>
                              </div>
                            ))
                          ) : userSearchQuery ? (
                            <div className="px-4 py-3 text-sm text-gray-500">No users found matching &quot;{userSearchQuery}&quot;</div>
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-500">Type to search for users</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || (targetingMode === 'specific' && !selectedUser)}
                    className="px-8 py-2 bg-[#FF8A00] text-white rounded-md hover:bg-[#e67e00] transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Send Notification</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
      </Modal>
    </div>
  );
}
