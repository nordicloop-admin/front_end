"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatList } from '@/components/chat/ChatList';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { cn } from '@/lib/utils';

interface ChatPreview {
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

// Sample chat data - in a real app, this would come from your API
const sampleChats = [
  {
    id: 'chat-1',
    orderId: 'NL-2024-001234',
    otherUser: {
      name: 'Erik Andersson',
      company: 'Nordic Recycling AB',
      avatar: '/avatars/erik.jpg',
      isOnline: true,
      userType: 'seller' as const
    },
    lastMessage: {
      content: 'The quality certificates have been uploaded. Please review them.',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      sender: 'them' as const,
      type: 'text' as const
    },
    unreadCount: 2,
    materialName: 'High-Quality HDPE Post-Industrial Pellets',
    orderStatus: 'delivered' as const,
    chatStatus: 'active' as const,
    priority: 'high' as const
  },
  {
    id: 'chat-2',
    orderId: 'NL-2024-001189',
    otherUser: {
      name: 'Anna Larsson',
      company: 'Green Materials Ltd',
      avatar: '/avatars/anna.jpg',
      isOnline: false,
      userType: 'buyer' as const
    },
    lastMessage: {
      content: 'Thank you for the quick delivery! Everything looks perfect.',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      sender: 'them' as const,
      type: 'text' as const
    },
    unreadCount: 0,
    materialName: 'Recycled PET Flakes - Clear Grade',
    orderStatus: 'completed' as const,
    chatStatus: 'active' as const,
    priority: 'low' as const
  },
  {
    id: 'chat-3',
    orderId: 'NL-2024-001156',
    otherUser: {
      name: 'Magnus Johansson',
      company: 'Sustainable Plastics AB',
      avatar: '/avatars/magnus.jpg',
      isOnline: true,
      userType: 'seller' as const
    },
    lastMessage: {
      content: 'Shipping update: Your order is now in transit',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      sender: 'system' as const,
      type: 'system' as const
    },
    unreadCount: 1,
    materialName: 'PP Injection Grade Pellets',
    orderStatus: 'in_transit' as const,
    chatStatus: 'active' as const,
    priority: 'medium' as const
  },
  {
    id: 'chat-4',
    orderId: 'NL-2024-001098',
    otherUser: {
      name: 'Sofia Nilsson',
      company: 'EcoPlast Solutions',
      avatar: '/avatars/sofia.jpg',
      isOnline: false,
      userType: 'buyer' as const
    },
    lastMessage: {
      content: 'Could you provide more details about the material specifications?',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      sender: 'them' as const,
      type: 'text' as const
    },
    unreadCount: 0,
    materialName: 'LDPE Film Grade Pellets',
    orderStatus: 'pending' as const,
    chatStatus: 'active' as const,
    priority: 'medium' as const
  },
  {
    id: 'chat-5',
    orderId: 'NL-2024-000987',
    otherUser: {
      name: 'Lars Bergström',
      company: 'Nordic Waste Solutions',
      avatar: '/avatars/lars.jpg',
      isOnline: false,
      userType: 'seller' as const
    },
    lastMessage: {
      content: 'Order completed successfully. Thank you for your business!',
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      sender: 'them' as const,
      type: 'text' as const
    },
    unreadCount: 0,
    materialName: 'Mixed Plastic Waste - Industrial Grade',
    orderStatus: 'completed' as const,
    chatStatus: 'archived' as const,
    priority: 'low' as const
  }
];

const sampleOrderContexts = {
  'chat-1': {
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
      lastSeen: new Date(Date.now() - 300000)
    },
    buyer: {
      name: "Current User",
      company: "Your Company AB",
      avatar: "/avatars/user.jpg",
      isOnline: true,
      lastSeen: new Date()
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
  }
  // Add more order contexts as needed
};

export default function ChatsPage() {
  const searchParams = useSearchParams();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(
    searchParams.get('chat') || null
  );
  const [chats, setChats] = useState<ChatPreview[]>(sampleChats);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    
    // Mark chat as read
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
    ));

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('chat', chatId);
    window.history.pushState({}, '', url.toString());
  };

  const handleArchiveChat = (chatId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, chatStatus: 'archived' as const } : chat
    ));
  };

  const handleDeleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (selectedChatId === chatId) {
      setSelectedChatId(null);
    }
  };

  const handleBackToList = () => {
    setSelectedChatId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('chat');
    window.history.pushState({}, '', url.toString());
  };

  const selectedChat = chats.find(chat => chat.id === selectedChatId);
  const selectedOrderContext = selectedChatId ? sampleOrderContexts[selectedChatId as keyof typeof sampleOrderContexts] : null;

  // Determine current user type based on the selected chat
  const getCurrentUserType = () => {
    if (!selectedChat) return 'buyer';
    // If the other user is a seller, current user is buyer and vice versa
    return selectedChat.otherUser.userType === 'seller' ? 'buyer' : 'seller';
  };

  return (
    <div className="h-[calc(100vh-120px)] flex bg-white">
      {/* Chat List - Hidden on mobile when chat is selected */}
      <div className={cn(
        "border-r border-gray-200 bg-white",
        isMobile 
          ? selectedChatId 
            ? "hidden" 
            : "w-full"
          : "w-80 flex-shrink-0"
      )}>
        <ChatList
          chats={chats}
          currentUserId="current-user-id"
          language="en"
          onChatSelect={handleChatSelect}
          onArchiveChat={handleArchiveChat}
          onDeleteChat={handleDeleteChat}
          className="h-full"
        />
      </div>

      {/* Chat Interface */}
      <div className={cn(
        "flex-1 flex flex-col",
        isMobile && !selectedChatId && "hidden"
      )}>
        {selectedChatId && selectedOrderContext ? (
          <ChatContainer
            orderContext={selectedOrderContext}
            currentUser={getCurrentUserType()}
            language="en"
            onBack={isMobile ? handleBackToList : undefined}
            className="h-full"
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Choose a chat from the sidebar to start messaging with buyers and sellers about your orders.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
