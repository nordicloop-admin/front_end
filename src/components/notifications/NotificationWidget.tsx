"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { getUserNotificationsPaginated, Notification } from '@/services/notifications';
import {
  getNotificationTypeConfig,
  formatNotificationDate,
  getNotificationIconComponent
} from '@/utils/notificationUtils';
import { cn } from '@/lib/utils';

interface NotificationWidgetProps {
  className?: string;
  maxItems?: number;
  showViewAllLink?: boolean;
  isAdmin?: boolean;
}

export default function NotificationWidget({
  className,
  maxItems = 5,
  showViewAllLink = true,
  isAdmin = false
}: NotificationWidgetProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchRecentNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getUserNotificationsPaginated({
          page: 1,
          page_size: maxItems
        });
        
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setNotifications(response.data.results);
          setUnreadCount(response.data.results.filter(n => !n.is_read).length);
        }
      } catch (_err) {
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentNotifications();
  }, [maxItems]);

  const viewAllLink = isAdmin ? '/admin/notifications' : '/dashboard/notifications';

  if (loading) {
    return (
      <div className={cn("bg-white border border-gray-200 rounded-lg p-4", className)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-gray-500" />
            Recent Notifications
          </h3>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("bg-white border border-gray-200 rounded-lg p-4", className)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-gray-500" />
            Recent Notifications
          </h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Failed to load notifications</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white border border-gray-200 rounded-lg p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-gray-500" />
          Recent Notifications
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {unreadCount} new
            </span>
          )}
        </h3>
        {showViewAllLink && (
          <Link
            href={viewAllLink}
            className="text-sm text-[#FF8A00] hover:text-[#e67e00] font-medium flex items-center transition-colors"
          >
            View all
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
          {notifications.map((notification) => {
            const typeConfig = getNotificationTypeConfig(notification.type);
            const NotificationIcon = getNotificationIconComponent(notification.type);
            
            return (
              <div
                key={notification.id}
                className={cn(
                  "flex items-start gap-3 p-3 md:p-3.5 transition-colors",
                  !notification.is_read ? "bg-gray-50" : "bg-white"
                )}
              >
                <div className={cn(
                  "flex-shrink-0 rounded-full p-2",
                  typeConfig.bgColor
                )}>
                  <NotificationIcon className={cn("w-4 h-4", typeConfig.color)} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={cn(
                        "text-sm font-medium text-gray-900 line-clamp-1",
                        !notification.is_read && "font-semibold"
                      )}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{formatNotificationDate(notification.date)}</span>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No notifications yet</p>
            <p className="text-xs text-gray-400 mt-1">
              You&apos;ll see your latest notifications here
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
