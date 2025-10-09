"use client";

import React from 'react';
import { Check, Trash2, Clock } from 'lucide-react';
import { Notification } from '@/services/notifications';
import {
  getNotificationTypeConfig,
  formatNotificationDate,
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
  // Priority visuals removed per design update (badge/icon hidden)
  
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
      "relative transition-colors duration-150",
      !notification.is_read ? "bg-gray-50" : "bg-white",
      compact ? "p-3" : "p-4",
      "rounded-md",
      className
    )}>
      
      <div className="flex items-start">
        {/* Content (icon removed for minimal style) */}
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
                
                {/* Priority badge intentionally removed */}
              </div>
              
              {/* Message */}
              <p className={cn(
                "text-sm text-gray-600 mb-2 leading-snug",
                compact ? "line-clamp-1" : "line-clamp-2"
              )}>
                {notification.message}
              </p>
              {(() => {
                const meta: any = notification.metadata || {};
                const isRejection = meta.action_type === 'company_rejected' || /verification update needed/i.test(notification.title || '');
                const supportUrl = notification.action_url || meta.support_url;
                if (isRejection && supportUrl) {
                  return (
                    <div className="mb-2 text-xs">
                      <a
                        href={supportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF8A00] hover:text-[#e67700] font-medium underline underline-offset-2"
                      >
                        Contact support to resolve this →
                      </a>
                    </div>
                  );
                }
                return null;
              })()}
              
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
      <div className="border border-gray-200 rounded-md">
  <CardContent />
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-md">
      <CardContent />
    </div>
  );
}
