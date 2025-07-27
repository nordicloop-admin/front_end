"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  Info,
  Settings,
  Globe,
  Bell,
  BellOff,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ChatInterface } from './ChatInterface';
import { OrderDetailsPanel } from './OrderDetailsPanel';

interface Message {
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

interface OrderContext {
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

interface ChatContainerProps {
  orderContext: OrderContext;
  currentUser: 'buyer' | 'seller';
  language?: 'en' | 'sv';
  onBack?: () => void;
  className?: string;
}

const translations = {
  en: {
    back: "Back",
    orderDetails: "Order Details",
    settings: "Settings",
    notifications: "Notifications",
    language: "Language",
    reportUser: "Report User",
    blockUser: "Block User",
    online: "Online",
    offline: "Offline",
    lastSeen: "Last seen",
    typing: "is typing...",
    businessHours: "Business Hours: 9:00 - 17:00 (CET)",
    moderatorJoined: "Platform moderator has joined the conversation",
    deliveryConfirmationRequest: "Please confirm delivery once you receive the materials",
    qualityCheckReminder: "Don't forget to inspect the materials and confirm quality",
    english: "English",
    swedish: "Svenska",
    notificationsOn: "Turn off notifications",
    notificationsOff: "Turn on notifications",
    chatWith: "Chat with"
  },
  sv: {
    back: "Tillbaka",
    orderDetails: "Orderdetaljer",
    settings: "Inställningar",
    notifications: "Notifieringar",
    language: "Språk",
    reportUser: "Rapportera användare",
    blockUser: "Blockera användare",
    online: "Online",
    offline: "Offline",
    lastSeen: "Senast sedd",
    typing: "skriver...",
    businessHours: "Öppettider: 9:00 - 17:00 (CET)",
    moderatorJoined: "Plattformsmoderator har gått med i konversationen",
    deliveryConfirmationRequest: "Vänligen bekräfta leverans när du tar emot materialen",
    qualityCheckReminder: "Glöm inte att inspektera materialen och bekräfta kvaliteten",
    english: "English",
    swedish: "Svenska",
    notificationsOn: "Stäng av notifieringar",
    notificationsOff: "Slå på notifieringar",
    chatWith: "Chatta med"
  }
};

export function ChatContainer({
  orderContext,
  currentUser,
  language = 'en',
  onBack,
  className
}: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [isTyping, setIsTyping] = useState(false);

  const t = translations[currentLanguage];
  const otherUser = currentUser === 'buyer' ? orderContext.seller : orderContext.buyer;

  // Initialize with sample messages
  useEffect(() => {
    const sampleMessages: Message[] = [
      {
        id: '1',
        type: 'system',
        content: 'Chat started after successful escrow deposit',
        sender: 'system',
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
      },
      {
        id: '2',
        type: 'text',
        content: `Hello! Thank you for your order of ${orderContext.materialName}. We will prepare the shipment within 2 business days.`,
        sender: currentUser === 'buyer' ? 'seller' : 'buyer',
        timestamp: new Date(Date.now() - 82800000),
        deliveryStatus: 'read'
      },
      {
        id: '3',
        type: 'text',
        content: 'Great! Could you please provide the quality certificates for this batch?',
        sender: currentUser,
        timestamp: new Date(Date.now() - 79200000),
        deliveryStatus: 'read'
      },
      {
        id: '4',
        type: 'document',
        content: 'Here are the quality certificates and test results.',
        sender: currentUser === 'buyer' ? 'seller' : 'buyer',
        timestamp: new Date(Date.now() - 75600000),
        attachments: [
          {
            type: 'certificate',
            url: '/certificates/quality-cert.pdf',
            name: 'Quality Certificate - Batch #2024-001',
            size: 245760
          }
        ],
        deliveryStatus: 'read'
      },
      {
        id: '5',
        type: 'shipping_update',
        content: 'Your order has been shipped',
        sender: 'system',
        timestamp: new Date(Date.now() - 43200000),
        metadata: {
          shippingTrackingNumber: 'DHL1234567890',
          deliveryDate: 'Expected delivery: Tomorrow, 14:00-16:00'
        }
      }
    ];

    // Add delivery confirmation request if order is delivered
    if (orderContext.status === 'delivered' && currentUser === 'buyer') {
      sampleMessages.push({
        id: '6',
        type: 'system',
        content: t.deliveryConfirmationRequest,
        sender: 'system',
        timestamp: new Date(Date.now() - 3600000),
      });
    }

    setMessages(sampleMessages);
  }, [orderContext, currentUser, t]);

  const handleSendMessage = (content: string, attachments?: File[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: attachments && attachments.length > 0 ? 'document' : 'text',
      content,
      sender: currentUser,
      timestamp: new Date(),
      deliveryStatus: 'sent',
      attachments: attachments?.map(file => ({
        type: file.type.startsWith('image/') ? 'image' : 'document',
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size
      }))
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate delivery status updates
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, deliveryStatus: 'delivered' } : msg
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, deliveryStatus: 'read' } : msg
      ));
    }, 3000);
  };

  const handleConfirmDelivery = () => {
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      type: 'delivery_confirmation',
      content: 'Delivery confirmed - Materials received in good condition',
      sender: currentUser,
      timestamp: new Date(),
      deliveryStatus: 'sent'
    };

    setMessages(prev => [...prev, confirmationMessage]);
  };

  const handleReportIssue = () => {
    // This would open a modal or form for reporting issues
    console.log('Report issue clicked');
  };

  const handleExportChat = () => {
    // This would generate and download a chat transcript
    console.log('Export chat clicked');
  };

  const formatLastSeen = (date?: Date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft size={20} />
            </Button>
          )}
          
          <div className="flex items-center space-x-3">
            {/* User Avatar */}
            <div className="relative">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {otherUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
              {otherUser.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
              <p className="text-sm text-gray-500">{otherUser.company}</p>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                {otherUser.isOnline ? (
                  <span className="text-green-600">{t.online}</span>
                ) : (
                  <span>{t.lastSeen} {formatLastSeen(otherUser.lastSeen)}</span>
                )}
                {isTyping && (
                  <span className="text-blue-600">{t.typing}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowOrderDetails(!showOrderDetails)}
            title={t.orderDetails}
          >
            <Info size={20} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setNotificationsEnabled(!notificationsEnabled)}>
                {notificationsEnabled ? <BellOff size={16} className="mr-2" /> : <Bell size={16} className="mr-2" />}
                {notificationsEnabled ? t.notificationsOff : t.notificationsOn}
              </DropdownMenuItem>
              
              <DropdownMenuItem>
                <Globe size={16} className="mr-2" />
                {t.language}
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleReportIssue}>
                <Shield size={16} className="mr-2" />
                {t.reportUser}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <ChatInterface
            orderContext={orderContext}
            messages={messages}
            currentUser={currentUser}
            businessHours={{
              start: "09:00",
              end: "17:00",
              timezone: "CET"
            }}
            language={currentLanguage}
            onSendMessage={handleSendMessage}
            onConfirmDelivery={handleConfirmDelivery}
            onReportIssue={handleReportIssue}
            onExportChat={handleExportChat}
          />
        </div>

        {/* Order Details Sidebar */}
        {showOrderDetails && (
          <div className="w-80 border-l border-gray-200 bg-gray-50">
            <OrderDetailsPanel
              orderContext={orderContext}
              language={currentLanguage}
              onClose={() => setShowOrderDetails(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
