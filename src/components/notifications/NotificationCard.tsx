"use client";

import React from 'react';
import Link from 'next/link';
import { Check, Trash2, ExternalLink, Clock } from 'lucide-react';
import { Notification } from '@/services/notifications';
import {
  getNotificationTypeConfig,
  getNotificationPriorityConfig,
  formatNotificationDate,
  getNotificationIconComponent,
  getPriorityIconComponent
} from '@/utils/notificationUtils';
import { cn } from '@/lib/utils';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead?: (id: number) => void;
  onDelete?: (id: number) => void;
  compact?: boolean;
  showActions?: boolean;
  className?: string;
}

export default function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
  compact = false,
  showActions = true,
  className
}: NotificationCardProps) {
  const typeConfig = getNotificationTypeConfig(notification.type);
  const priorityConfig = getNotificationPriorityConfig(notification.priority || 'normal');
  const NotificationIcon = getNotificationIconComponent(notification.type);
  const PriorityIcon = getPriorityIconComponent(notification.priority || 'normal');
  
  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(notification.id);
    }
  };
  
  const CardContent = () => (
    <div className={cn(
      "relative transition-all duration-200 hover:shadow-sm",
      !notification.is_read && "bg-gray-50/50",
      compact ? "p-3" : "p-4",
      className
    )}>
      {/* Priority indicator */}
      {notification.priority && notification.priority !== 'normal' && (
        <div className={cn(
          "absolute top-0 left-0 w-1 h-full rounded-l-lg",
          notification.priority === 'urgent' && "bg-red-500",
          notification.priority === 'high' && "bg-amber-500",
          notification.priority === 'low' && "bg-gray-400"
        )} />
      )}
      
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className={cn(
          "flex-shrink-0 rounded-full p-2 mt-0.5",
          typeConfig.bgColor
        )}>
          <NotificationIcon className={cn("w-4 h-4", typeConfig.color)} />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {/* Title and Priority */}
              <div className="flex items-center space-x-2 mb-1">
                <h3 className={cn(
                  "font-medium text-sm truncate",
                  !notification.is_read ? "text-gray-900" : "text-gray-700"
                )}>
                  {notification.title}
                </h3>
                
                {notification.priority && notification.priority !== 'normal' && (
                  <div className={cn(
                    "flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium",
                    priorityConfig.bgColor,
                    priorityConfig.color
                  )}>
                    <PriorityIcon className="w-3 h-3" />
                    <span>{priorityConfig.label}</span>
                  </div>
                )}
              </div>
              
              {/* Message */}
              <p className={cn(
                "text-sm text-gray-600 mb-2",
                compact ? "line-clamp-1" : "line-clamp-2"
              )}>
                {notification.message}
              </p>
              
              {/* Metadata */}
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatNotificationDate(notification.date)}</span>
                </div>
                
                <div className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium",
                  typeConfig.bgColor,
                  typeConfig.color
                )}>
                  {typeConfig.label}
                </div>
                
                {!notification.is_read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
            </div>
            
            {/* Actions */}
            {showActions && (
              <div className="flex items-center space-x-2 ml-4">
                {notification.action_url && !compact && (
                  <Link
                    href={notification.action_url}
                    className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                    title="View details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}

                {!notification.is_read && onMarkAsRead && (
                  <button
                    onClick={handleMarkAsRead}
                    className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}

                {onDelete && (
                  <button
                    onClick={handleDelete}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
  // For compact mode (used in dropdowns), don't make the whole card clickable to avoid nested links
  if (compact) {
    return (
      <div className="border border-gray-200 rounded-lg">
        <CardContent />
      </div>
    );
  }

  // For full cards, make the whole card clickable if there's an action URL
  if (notification.action_url) {
    return (
      <Link href={notification.action_url} className="block">
        <div className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
          <CardContent />
        </div>
      </Link>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg">
      <CardContent />
    </div>
  );
}
