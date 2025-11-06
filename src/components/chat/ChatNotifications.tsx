"use client";

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  MessageCircle, 
  Package, 
  Truck, 
  AlertTriangle,
  Clock,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  type: 'message' | 'delivery' | 'quality' | 'system' | 'reminder';
  title: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  orderId?: string;
  chatId?: string;
  priority: 'low' | 'medium' | 'high';
  actionRequired?: boolean;
}

interface ChatNotificationsProps {
  notifications: Notification[];
  language?: 'en' | 'sv';
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onNotificationClick: (notification: Notification) => void;
  onDismiss: (notificationId: string) => void;
  emailNotificationsEnabled?: boolean;
  onToggleEmailNotifications?: (enabled: boolean) => void;
}

const translations = {
  en: {
    notifications: "Notifications",
    markAllRead: "Mark all as read",
    noNotifications: "No new notifications",
    newMessage: "New message",
    deliveryUpdate: "Delivery update",
    qualityConfirmation: "Quality confirmation needed",
    systemAlert: "System alert",
    reminder: "Reminder",
    emailNotifications: "Email notifications",
    turnOn: "Turn on",
    turnOff: "Turn off",
    actionRequired: "Action required",
    justNow: "Just now",
    minutesAgo: "minutes ago",
    hoursAgo: "hours ago",
    daysAgo: "days ago",
    dismiss: "Dismiss"
  },
  sv: {
    notifications: "Notifieringar",
    markAllRead: "Markera alla som lästa",
    noNotifications: "Inga nya notifieringar",
    newMessage: "Nytt meddelande",
    deliveryUpdate: "Leveransuppdatering",
    qualityConfirmation: "Kvalitetsbekräftelse behövs",
    systemAlert: "Systemvarning",
    reminder: "Påminnelse",
    emailNotifications: "E-postnotifieringar",
    turnOn: "Slå på",
    turnOff: "Stäng av",
    actionRequired: "Åtgärd krävs",
    justNow: "Just nu",
    minutesAgo: "minuter sedan",
    hoursAgo: "timmar sedan",
    daysAgo: "dagar sedan",
    dismiss: "Avfärda"
  }
};

export function ChatNotifications({
  notifications,
  language = 'en',
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick,
  onDismiss,
  emailNotificationsEnabled = true,
  onToggleEmailNotifications
}: ChatNotificationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[language];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = cn(
      "w-5 h-5",
      priority === 'high' ? 'text-red-500' : 
      priority === 'medium' ? 'text-orange-500' : 'text-blue-500'
    );

    switch (type) {
      case 'message':
        return <MessageCircle className={iconClass} />;
      case 'delivery':
        return <Truck className={iconClass} />;
      case 'quality':
        return <Package className={iconClass} />;
      case 'system':
        return <AlertTriangle className={iconClass} />;
      case 'reminder':
        return <Clock className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'message': return t.newMessage;
      case 'delivery': return t.deliveryUpdate;
      case 'quality': return t.qualityConfirmation;
      case 'system': return t.systemAlert;
      case 'reminder': return t.reminder;
      default: return type;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t.justNow;
    if (minutes < 60) return `${minutes} ${t.minutesAgo}`;
    if (hours < 24) return `${hours} ${t.hoursAgo}`;
    return `${days} ${t.daysAgo}`;
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    onNotificationClick(notification);
    setIsOpen(false);
  };

  // Auto-close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('[data-notification-panel]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" data-notification-panel>
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">{t.notifications}</h3>
            <div className="flex items-center space-x-2">
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="text-xs"
                >
                  {t.markAllRead}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="w-6 h-6"
              >
                <X size={14} />
              </Button>
            </div>
          </div>

          {/* Email Notifications Toggle */}
          {onToggleEmailNotifications && (
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail size={16} className="text-gray-600" />
                  <span className="text-sm text-gray-700">{t.emailNotifications}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleEmailNotifications(!emailNotificationsEnabled)}
                  className="text-xs"
                >
                  {emailNotificationsEnabled ? t.turnOff : t.turnOn}
                </Button>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell size={24} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">{t.noNotifications}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-gray-50 cursor-pointer transition-colors",
                      !notification.isRead && "bg-blue-50 border-l-4 border-l-blue-500"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type, notification.priority)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDismiss(notification.id);
                            }}
                            className="w-6 h-6 p-0 text-gray-400 hover:text-gray-600"
                          >
                            <X size={12} />
                          </Button>
                        </div>
                        
                        <p className="text-xs text-gray-500 mb-1">
                          {getNotificationTypeLabel(notification.type)}
                        </p>
                        
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {notification.content}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                          
                          {notification.actionRequired && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                              <AlertTriangle size={10} className="mr-1" />
                              {t.actionRequired}
                            </span>
                          )}
                        </div>
                        
                        {notification.orderId && (
                          <div className="mt-1">
                            <span className="text-xs text-gray-400 font-mono">
                              #{notification.orderId}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAllNotifications
  };
}
