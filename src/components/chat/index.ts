// Chat System Components
export { ChatInterface } from './ChatInterface';
export { ChatContainer } from './ChatContainer';
export { ChatList } from './ChatList';
export { ChatWidget, useRecentChats } from './ChatWidget';
export { MessageBubble } from './MessageBubble';
export { OrderDetailsPanel } from './OrderDetailsPanel';
export { ChatNotifications, useNotifications } from './ChatNotifications';
export { AutoResponseManager } from './AutoResponseManager';
export { ChatExport } from './ChatExport';

// Types
export interface Message {
  id: string;
  type: 'text' | 'image' | 'document' | 'system' | 'delivery_confirmation' | 'quality_report' | 'shipping_update';
  content: string;
  sender: 'buyer' | 'seller' | 'moderator' | 'system';
  timestamp: Date;
  attachments?: {
    type: 'image' | 'document' | 'certificate';
    url: string;
    name: string;
    size?: number;
    thumbnail?: string;
  }[];
  isRead?: boolean;
  deliveryStatus?: 'sent' | 'delivered' | 'read';
  metadata?: {
    shippingTrackingNumber?: string;
    qualityRating?: number;
    issueType?: string;
    deliveryDate?: string;
  };
}

export interface OrderContext {
  orderId: string;
  materialName: string;
  materialType: string;
  quantity: string;
  price: string;
  shippingAddress: string;
  estimatedDelivery: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'completed';
  seller: {
    name: string;
    company: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen?: Date;
  };
  buyer: {
    name: string;
    company: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen?: Date;
  };
  specifications: {
    grade?: string;
    color?: string;
    origin?: string;
    certifications?: string[];
  };
  timeline: {
    orderPlaced: Date;
    paymentConfirmed: Date;
    shippingStarted?: Date;
    delivered?: Date;
    completed?: Date;
  };
}

export interface Notification {
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

export interface AutoResponse {
  id: string;
  trigger: 'out_of_office' | 'after_hours' | 'weekend' | 'holiday' | 'custom';
  message: string;
  isActive: boolean;
  language: 'en' | 'sv' | 'both';
  startDate?: Date;
  endDate?: Date;
}

export interface BusinessHours {
  monday: { start: string; end: string; isOpen: boolean };
  tuesday: { start: string; end: string; isOpen: boolean };
  wednesday: { start: string; end: string; isOpen: boolean };
  thursday: { start: string; end: string; isOpen: boolean };
  friday: { start: string; end: string; isOpen: boolean };
  saturday: { start: string; end: string; isOpen: boolean };
  sunday: { start: string; end: string; isOpen: boolean };
  timezone: string;
}

export interface ChatPreview {
  id: string;
  orderId: string;
  otherUser: {
    name: string;
    company: string;
    avatar?: string;
    isOnline: boolean;
    userType: 'buyer' | 'seller';
  };
  lastMessage: {
    content: string;
    timestamp: Date;
    sender: 'me' | 'them' | 'system';
    type: 'text' | 'image' | 'document' | 'system';
  };
  unreadCount: number;
  materialName: string;
  orderStatus: 'pending' | 'in_transit' | 'delivered' | 'completed';
  chatStatus: 'active' | 'archived' | 'closed';
  priority: 'low' | 'medium' | 'high';
}
