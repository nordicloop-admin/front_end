"use client";

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  Download,
  MessageSquare,
  Users,
  Package,
  Clock,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { AutoResponseManager } from '@/components/chat/AutoResponseManager';
import { ChatExport } from '@/components/chat/ChatExport';
import { ChatNotifications, useNotifications } from '@/components/chat/ChatNotifications';

// Sample data for the demo
const sampleOrderContext = {
  orderId: "NL-2024-001234",
  materialName: "High-Quality HDPE Post-Industrial Pellets",
  materialType: "Plastic Pellets",
  quantity: "2.5 tons",
  price: "€3,750",
  shippingAddress: "Industrivägen 15, 41234 Göteborg, Sweden",
  estimatedDelivery: "2024-02-15",
  status: "delivered" as const,
  seller: {
    name: "Erik Andersson",
    company: "Nordic Recycling AB",
    avatar: "/avatars/erik.jpg",
    isOnline: true,
    lastSeen: new Date(Date.now() - 300000) // 5 minutes ago
  },
  buyer: {
    name: "Maria Johansson",
    company: "Sustainable Plastics Ltd",
    avatar: "/avatars/maria.jpg",
    isOnline: false,
    lastSeen: new Date(Date.now() - 1800000) // 30 minutes ago
  },
  specifications: {
    grade: "Food Grade",
    color: "Natural/Clear",
    origin: "Sweden",
    certifications: ["ISO 9001", "FDA Approved", "EU Food Contact"]
  },
  timeline: {
    orderPlaced: new Date("2024-01-15T10:30:00"),
    paymentConfirmed: new Date("2024-01-15T11:15:00"),
    shippingStarted: new Date("2024-01-18T09:00:00"),
    delivered: new Date("2024-01-20T14:30:00"),
    completed: undefined
  }
};

const sampleBusinessHours = {
  monday: { start: "09:00", end: "17:00", isOpen: true },
  tuesday: { start: "09:00", end: "17:00", isOpen: true },
  wednesday: { start: "09:00", end: "17:00", isOpen: true },
  thursday: { start: "09:00", end: "17:00", isOpen: true },
  friday: { start: "09:00", end: "17:00", isOpen: true },
  saturday: { start: "10:00", end: "14:00", isOpen: true },
  sunday: { start: "10:00", end: "14:00", isOpen: false },
  timezone: "CET"
};

const sampleAutoResponses = [
  {
    id: "1",
    trigger: "out_of_office" as const,
    message: "Thank you for your message. I'm currently out of office and will respond within 24 hours.",
    isActive: false,
    language: "both" as const
  },
  {
    id: "2",
    trigger: "after_hours" as const,
    message: "Thank you for your message. Our business hours are 9:00-17:00 CET. I'll respond during business hours.",
    isActive: true,
    language: "both" as const
  }
];

const sampleMessages = [
  {
    id: '1',
    type: 'system' as const,
    content: 'Chat started after successful escrow deposit',
    sender: 'system' as const,
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: '2',
    type: 'text' as const,
    content: `Hello! Thank you for your order of ${sampleOrderContext.materialName}. We will prepare the shipment within 2 business days.`,
    sender: 'seller' as const,
    timestamp: new Date(Date.now() - 82800000),
    deliveryStatus: 'read' as const
  },
  {
    id: '3',
    type: 'text' as const,
    content: 'Great! Could you please provide the quality certificates for this batch?',
    sender: 'buyer' as const,
    timestamp: new Date(Date.now() - 79200000),
    deliveryStatus: 'read' as const
  },
  {
    id: '4',
    type: 'document' as const,
    content: 'Here are the quality certificates and test results.',
    sender: 'seller' as const,
    timestamp: new Date(Date.now() - 75600000),
    attachments: [
      {
        type: 'certificate' as const,
        url: '/certificates/quality-cert.pdf',
        name: 'Quality Certificate - Batch #2024-001',
        size: 245760
      }
    ],
    deliveryStatus: 'read' as const
  },
  {
    id: '5',
    type: 'shipping_update' as const,
    content: 'Your order has been shipped',
    sender: 'system' as const,
    timestamp: new Date(Date.now() - 43200000),
    metadata: {
      shippingTrackingNumber: 'DHL1234567890',
      deliveryDate: 'Expected delivery: Tomorrow, 14:00-16:00'
    }
  }
];

export default function ChatDemoPage() {
  const [currentView, setCurrentView] = useState<'chat' | 'settings' | 'export'>('chat');
  const [currentUser, setCurrentUser] = useState<'buyer' | 'seller'>('buyer');
  const [language, setLanguage] = useState<'en' | 'sv'>('en');
  const [businessHours, setBusinessHours] = useState(sampleBusinessHours);
  const [autoResponses, setAutoResponses] = useState(sampleAutoResponses);
  
  const {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    dismissNotification
  } = useNotifications();

  // Add some sample notifications
  React.useEffect(() => {
    addNotification({
      type: 'message',
      title: 'New message from Erik',
      content: 'Quality certificates have been uploaded',
      priority: 'medium',
      orderId: sampleOrderContext.orderId,
      actionRequired: false
    });
    
    addNotification({
      type: 'delivery',
      title: 'Delivery confirmation needed',
      content: 'Please confirm receipt of materials',
      priority: 'high',
      orderId: sampleOrderContext.orderId,
      actionRequired: true
    });
  }, [addNotification]);

  const handleNotificationClick = (notification: any) => {
    console.log('Notification clicked:', notification);
    // In a real app, this would navigate to the relevant chat or order
  };

  const toggleEmailNotifications = (enabled: boolean) => {
    console.log('Email notifications:', enabled);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="flex items-center"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-xl font-semibold text-gray-900">Chat System Demo</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <div className="flex items-center space-x-2">
              <Globe size={16} className="text-gray-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'sv')}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-[#FF8A00] focus:border-[#FF8A00]"
              >
                <option value="en">English</option>
                <option value="sv">Svenska</option>
              </select>
            </div>

            {/* User Role Toggle */}
            <div className="flex items-center space-x-2">
              <Users size={16} className="text-gray-500" />
              <select
                value={currentUser}
                onChange={(e) => setCurrentUser(e.target.value as 'buyer' | 'seller')}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-[#FF8A00] focus:border-[#FF8A00]"
              >
                <option value="buyer">Buyer View</option>
                <option value="seller">Seller View</option>
              </select>
            </div>

            {/* Notifications */}
            <ChatNotifications
              notifications={notifications}
              language={language}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onNotificationClick={handleNotificationClick}
              onDismiss={dismissNotification}
              emailNotificationsEnabled={true}
              onToggleEmailNotifications={toggleEmailNotifications}
            />

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentView('chat')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  currentView === 'chat' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MessageSquare size={14} className="mr-1 inline" />
                Chat
              </button>
              <button
                onClick={() => setCurrentView('settings')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  currentView === 'settings' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Settings size={14} className="mr-1 inline" />
                Settings
              </button>
              <button
                onClick={() => setCurrentView('export')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  currentView === 'export' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Download size={14} className="mr-1 inline" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Features Info */}
      <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm text-blue-700">
            <div className="flex items-center space-x-2">
              <Package size={14} />
              <span>Order Context Integration</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageSquare size={14} />
              <span>Multi-language Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={14} />
              <span>Business Hours & Auto-responses</span>
            </div>
            <div className="flex items-center space-x-2">
              <Download size={14} />
              <span>Export Functionality</span>
            </div>
          </div>
          <span className="text-xs text-blue-600 font-medium">
            Demo Mode - Switch between buyer/seller views
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-140px)]">
        {currentView === 'chat' && (
          <ChatContainer
            orderContext={sampleOrderContext}
            currentUser={currentUser}
            language={language}
            className="h-full"
          />
        )}

        {currentView === 'settings' && (
          <div className="h-full flex items-center justify-center p-6">
            <AutoResponseManager
              businessHours={businessHours}
              autoResponses={autoResponses}
              language={language}
              onUpdateBusinessHours={setBusinessHours}
              onUpdateAutoResponses={setAutoResponses}
              onClose={() => setCurrentView('chat')}
            />
          </div>
        )}

        {currentView === 'export' && (
          <ChatExport
            messages={sampleMessages}
            orderContext={sampleOrderContext}
            language={language}
            onClose={() => setCurrentView('chat')}
          />
        )}
      </div>
    </div>
  );
}
