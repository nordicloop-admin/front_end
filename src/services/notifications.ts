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
  isRead: boolean;
  type: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  actionUrl?: string | null;
  metadata?: Record<string, any>;
  userId?: number | null; // Optional user ID for targeted notifications
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  actionUrl?: string | null;
  metadata?: Record<string, any>;
  userId?: number | null; // Optional user ID for targeted notifications
}

/**
 * Get all notifications for the current user
 * @returns Promise with notifications data
 */
export async function getUserNotifications() {
  return apiGet<Notification[]>('/notifications', true);
}

/**
 * Get all unread notifications for the current user
 * @returns Promise with unread notifications data
 */
export async function getUnreadNotifications() {
  return apiGet<Notification[]>('/notifications/unread', true);
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
  return apiPut<{ success: boolean }>('/notifications/read-all', {}, true);
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
 * Get all notifications (admin only)
 * @returns Promise with all notifications data
 */
export async function getAllNotifications() {
  return apiGet<Notification[]>('/notifications/list-all/', true);
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
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching unread notification count',
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
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching notification stats',
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
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while marking notifications as read',
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
