import {
  Bell,
  Settings,
  Gavel,
  Gift,
  UserCheck,
  CreditCard,
  Shield,
  User,
  DollarSign,
  AlertTriangle,
  Info,
  Star,
  ShieldAlert,
  Zap,
  LucideIcon
} from 'lucide-react';
import { Notification } from '@/services/notifications';

export interface NotificationTypeConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export interface NotificationPriorityConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: LucideIcon;
}

// Notification type configurations
export const notificationTypes: Record<string, NotificationTypeConfig> = {
  feature: {
    label: 'New Feature',
    icon: Star,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
    description: 'New features and updates'
  },
  system: {
    label: 'System Update',
    icon: Settings,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-200',
    description: 'System maintenance and updates'
  },
  auction: {
    label: 'Auction',
    icon: Gavel,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
    description: 'Auction-related notifications'
  },
  promotion: {
    label: 'Promotion',
    icon: Gift,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200',
    description: 'Promotional offers and deals'
  },
  welcome: {
    label: 'Welcome',
    icon: UserCheck,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
    description: 'Welcome messages and onboarding'
  },
  subscription: {
    label: 'Subscription',
    icon: CreditCard,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    borderColor: 'border-indigo-200',
    description: 'Subscription status and billing'
  },
  security: {
    label: 'Security',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
    description: 'Security alerts and updates'
  },
  account: {
    label: 'Account',
    icon: User,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    borderColor: 'border-teal-200',
    description: 'Account-related notifications'
  },
  bid: {
    label: 'Bid',
    icon: DollarSign,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-200',
    description: 'Bidding activity and updates'
  },
  payment: {
    label: 'Payment',
    icon: CreditCard,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    borderColor: 'border-cyan-200',
    description: 'Payment and transaction updates'
  },
  admin: {
    label: 'Admin',
    icon: ShieldAlert,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200',
    description: 'Administrative notifications'
  }
};

// Priority configurations
export const notificationPriorities: Record<string, NotificationPriorityConfig> = {
  low: {
    label: 'Low',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    icon: Info
  },
  normal: {
    label: 'Normal',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    icon: Bell
  },
  high: {
    label: 'High',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    icon: AlertTriangle
  },
  urgent: {
    label: 'Urgent',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    icon: Zap
  }
};

/**
 * Get notification type configuration
 */
export function getNotificationTypeConfig(type: string): NotificationTypeConfig {
  return notificationTypes[type] || notificationTypes.feature;
}

/**
 * Get notification priority configuration
 */
export function getNotificationPriorityConfig(priority: string): NotificationPriorityConfig {
  return notificationPriorities[priority] || notificationPriorities.normal;
}

/**
 * Get notification icon component
 */
export function getNotificationIconComponent(type: string): LucideIcon {
  const config = getNotificationTypeConfig(type);
  return config.icon;
}

/**
 * Get priority icon component
 */
export function getPriorityIconComponent(priority: string): LucideIcon {
  const config = getNotificationPriorityConfig(priority);
  return config.icon;
}

/**
 * Format notification date
 */
export function formatNotificationDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
    });
  }
}

/**
 * Get notification categories for filtering
 */
export function getNotificationCategories() {
  return Object.entries(notificationTypes).map(([key, config]) => ({
    value: key,
    label: config.label,
    description: config.description,
    color: config.color,
    bgColor: config.bgColor
  }));
}

/**
 * Group notifications by type
 */
export function groupNotificationsByType(notifications: Notification[]) {
  return notifications.reduce((groups, notification) => {
    const type = notification.type || 'feature';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(notification);
    return groups;
  }, {} as Record<string, Notification[]>);
}

/**
 * Sort notifications by priority and date
 */
export function sortNotificationsByPriority(notifications: Notification[]): Notification[] {
  const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
  
  return [...notifications].sort((a, b) => {
    // First sort by read status (unread first)
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1;
    }
    
    // Then by priority
    const aPriority = priorityOrder[a.priority || 'normal'];
    const bPriority = priorityOrder[b.priority || 'normal'];
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    // Finally by date (newest first)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/**
 * Filter notifications by criteria
 */
export function filterNotifications(
  notifications: Notification[],
  filters: {
    type?: string;
    priority?: string;
    isRead?: boolean;
    search?: string;
  }
): Notification[] {
  return notifications.filter(notification => {
    if (filters.type && notification.type !== filters.type) {
      return false;
    }
    
    if (filters.priority && notification.priority !== filters.priority) {
      return false;
    }
    
    if (filters.isRead !== undefined && notification.isRead !== filters.isRead) {
      return false;
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        notification.title.toLowerCase().includes(searchLower) ||
        notification.message.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
}
