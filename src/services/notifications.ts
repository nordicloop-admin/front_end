/**
 * Notification service for handling notification-related API calls
 */
import { apiGet, apiPost, apiPut, apiDelete } from './api';

// Types
export interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  is_read: boolean;
  type: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  action_url?: string | null;
  metadata?: Record<string, any>;
  user?: number | null; // User ID for targeted notifications (null for all users)
  company_name?: string | null; // Company name for display purposes
  subscription_target?: 'all' | 'free' | 'standard' | 'premium';
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  action_url?: string | null;
  metadata?: Record<string, any>;
  userId?: number | null; // Optional user ID for targeted notifications (will be converted to 'user' in API)
  subscription_target?: 'all' | 'free' | 'standard' | 'premium';
}

/**
 * Get all notifications for the current user with pagination
 * @param params - Query parameters for pagination and filtering
 * @returns Promise with paginated notifications data
 */
export async function getUserNotifications(params?: {
  page?: number;
  page_size?: number;
  type?: string;
  priority?: string;
  search?: string;
  is_read?: boolean;
}) {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
  if (params?.type) queryParams.append('type', params.type);
  if (params?.priority) queryParams.append('priority', params.priority);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.is_read !== undefined) queryParams.append('is_read', params.is_read.toString());

  const url = `/notifications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  try {
    const response = await apiGet<{
      count: number;
      next: string | null;
      previous: string | null;
      results: Notification[];
    }>(url, true);

    // If we get a timeout or network error, return a graceful fallback
    if (response.error && (
      response.error.includes('timeout') || 
      response.error.includes('network') ||
      response.error.includes('signal')
    )) {
      return {
        data: {
          count: 0,
          next: null,
          previous: null,
          results: []
        },
        error: 'Connection issue - please refresh to reload notifications',
        status: response.status
      };
    }

    return response;
  } catch (_error) {
    // Fallback for any unexpected errors
    return {
      data: {
        count: 0,
        next: null,
        previous: null,
        results: []
      },
      error: 'Failed to load notifications - please try again',
      status: 500
    };
  }
}

/**
 * Get paginated notifications for the current user
 * @param params - Query parameters for pagination and filtering
 * @returns Promise with paginated notifications data
 */
export async function getUserNotificationsPaginated(params?: {
  page?: number;
  page_size?: number;
  type?: string;
  priority?: string;
  search?: string;
  is_read?: boolean;
}) {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
  if (params?.type) queryParams.append('type', params.type);
  if (params?.priority) queryParams.append('priority', params.priority);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.is_read !== undefined) queryParams.append('is_read', params.is_read.toString());

  const url = `/notifications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return apiGet<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Notification[];
  }>(url, true);
}

/**
 * Get unread notifications for the current user (first page only for dropdown)
 * @returns Promise with unread notifications data
 */
export async function getUnreadNotifications() {
  try {
    // Get first page of unread notifications with a reasonable page size for dropdown
    const response = await apiGet<{
      count: number;
      next: string | null;
      previous: string | null;
      results: Notification[];
    }>('/notifications/unread?page=1&page_size=10', true);
    
    // If we get a timeout or network error, return a graceful fallback
    if (response.error && (
      response.error.includes('timeout') || 
      response.error.includes('network') ||
      response.error.includes('signal')
    )) {
      return {
        data: [],
        error: 'Connection issue - please refresh to reload notifications',
        status: response.status
      };
    }
    
    // If successful, return just the results array
    if (response.data) {
      return {
        data: response.data.results,
        error: null,
        status: response.status
      };
    }
    
    // If no data but no error, return empty array
    return {
      data: [],
      error: response.error || 'No notifications found',
      status: response.status || 200
    };
  } catch (_error) {
    // Fallback for any unexpected errors
    return {
      data: [],
      error: 'Failed to load notifications - please try again',
      status: 500
    };
  }
}

/**
 * Get paginated unread notifications for the current user
 * @param params - Query parameters for pagination and filtering
 * @returns Promise with paginated unread notifications data
 */
export async function getUnreadNotificationsPaginated(params?: {
  page?: number;
  page_size?: number;
  type?: string;
  priority?: string;
  search?: string;
}) {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
  if (params?.type) queryParams.append('type', params.type);
  if (params?.priority) queryParams.append('priority', params.priority);
  if (params?.search) queryParams.append('search', params.search);

  const url = `/notifications/unread${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return apiGet<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Notification[];
  }>(url, true);
}

/**
 * Mark a notification as read
 * @param notificationId The ID of the notification to mark as read
 * @returns Promise with updated notification data
 */
export async function markNotificationAsRead(notificationId: number) {
  return apiPut<Notification>(`/notifications/${notificationId}/read`, {}, true);
}

/**
 * Mark all notifications as read for the current user
 * @returns Promise with success status
 */
export async function markAllNotificationsAsRead() {
  return apiPut<{ success: boolean }>('/notifications/read-all/', {}, true);
}

/**
 * Delete a notification
 * @param notificationId The ID of the notification to delete
 * @returns Promise with success status
 */
export async function deleteNotification(notificationId: number) {
  return apiDelete<{ success: boolean }>(`/notifications/${notificationId}`, true);
}

// Admin functions

/**
 * Get all notifications with pagination and filters (admin only)
 * @param params - Query parameters for pagination and filtering
 * @returns Promise with paginated notifications data
 */
export async function getAllNotifications(params?: {
  page?: number;
  page_size?: number;
  type?: string;
  priority?: string;
  search?: string;
}) {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
  if (params?.type) queryParams.append('type', params.type);
  if (params?.priority) queryParams.append('priority', params.priority);
  if (params?.search) queryParams.append('search', params.search);

  const url = `/notifications/list-all/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return apiGet<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Notification[];
  }>(url, true);
}

/**
 * Create a new notification (admin only)
 * @param notification The notification data to create
 * @returns Promise with created notification data
 */
export async function createNotification(notification: CreateNotificationRequest) {
  return apiPost<Notification>('/notifications/create-notification/', notification, true);
}

/**
 * Get count of unread notifications for the current user
 * @returns The count of unread notifications
 */
export async function getUnreadNotificationCount() {
  try {
    const response = await apiGet<{ count: number }>('/notifications/unread-count/', true);
    return response;
  } catch (_error) {
    return {
      data: null,
      error: _error instanceof Error ? _error.message : 'An error occurred while fetching unread notification count',
      status: 500
    };
  }
}

/**
 * Get notification statistics for the current user
 * @returns Notification statistics including counts by type and priority
 */
export async function getNotificationStats() {
  try {
    const response = await apiGet<{
      total_count: number;
      unread_count: number;
      read_count: number;
      type_counts: Record<string, number>;
      priority_counts: Record<string, number>;
    }>('/notifications/stats/', true);
    return response;
  } catch (_error) {
    return {
      data: null,
      error: _error instanceof Error ? _error.message : 'An error occurred while fetching notification stats',
      status: 500
    };
  }
}

/**
 * Mark all notifications of a specific type as read
 * @param type The notification type to mark as read
 * @returns Promise with success status and updated count
 */
export async function markNotificationTypeAsRead(type: string) {
  try {
    const response = await apiPost<{
      success: boolean;
      updated_count: number;
      type: string;
    }>('/notifications/mark-type-as-read/', { type }, true);
    return response;
  } catch (_error) {
    return {
      data: null,
      error: _error instanceof Error ? _error.message : 'An error occurred while marking notifications as read',
      status: 500
    };
  }
}

/**
 * Create a notification for all users (admin only)
 * @param notification The notification data to create
 * @returns Promise with created notification data
 */
export async function createNotificationForAllUsers(notification: Omit<CreateNotificationRequest, 'userId'>) {
  return apiPost<{ success: boolean, count: number }>('/notifications/broadcast/', notification, true);
}

/**
 * Delete a notification for all users (admin only)
 * @param notificationId The ID of the notification to delete
 * @returns Promise with success status
 */
export async function deleteNotificationForAllUsers(notificationId: number) {
  return apiDelete<{ success: boolean }>(`/notifications/${notificationId}/delete-broadcast/`, true);
}
