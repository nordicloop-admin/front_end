"use client";

import React from 'react';
import Link from 'next/link';
import { 
  MessageCircle, 
  ArrowRight,
  Clock,
  User,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ChatPreview {
  id: string;
  orderId: string;
  otherUser: {
    name: string;
    company: string;
    userType: 'buyer' | 'seller';
    isOnline: boolean;
  };
  lastMessage: {
    content: string;
    timestamp: Date;
    sender: 'me' | 'them' | 'system';
  };
  unreadCount: number;
  materialName: string;
}

interface ChatWidgetProps {
  recentChats: ChatPreview[];
  language?: 'en' | 'sv';
  className?: string;
}

const translations = {
  en: {
    recentChats: "Recent Chats",
    viewAllChats: "View All Chats",
    noRecentChats: "No recent chats",
    noRecentChatsDescription: "Your recent conversations will appear here",
    justNow: "Just now",
    minutesAgo: "m ago",
    hoursAgo: "h ago",
    daysAgo: "d ago",
    you: "You",
    newMessages: "new messages",
    newMessage: "new message",
    buyer: "Buyer",
    seller: "Seller"
  },
  sv: {
    recentChats: "Senaste chattar",
    viewAllChats: "Visa alla chattar",
    noRecentChats: "Inga senaste chattar",
    noRecentChatsDescription: "Dina senaste konversationer kommer att visas här",
    justNow: "Just nu",
    minutesAgo: "m sedan",
    hoursAgo: "h sedan",
    daysAgo: "d sedan",
    you: "Du",
    newMessages: "nya meddelanden",
    newMessage: "nytt meddelande",
    buyer: "Köpare",
    seller: "Säljare"
  }
};

export function ChatWidget({
  recentChats,
  language = 'en',
  className
}: ChatWidgetProps) {
  const t = translations[language];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t.justNow;
    if (minutes < 60) return `${minutes}${t.minutesAgo}`;
    if (hours < 24) return `${hours}${t.hoursAgo}`;
    return `${days}${t.daysAgo}`;
  };

  const truncateMessage = (message: string, maxLength: number = 40) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  const totalUnreadCount = recentChats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 shadow-sm", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <MessageCircle size={18} className="text-[#FF8A00]" />
          <h3 className="font-semibold text-gray-900">{t.recentChats}</h3>
          {totalUnreadCount > 0 && (
            <span className="bg-[#FF8A00] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
            </span>
          )}
        </div>
        <Link href="/dashboard/chats">
          <Button variant="ghost" size="sm" className="text-[#FF8A00] hover:text-[#e67700]">
            {t.viewAllChats}
            <ArrowRight size={14} className="ml-1" />
          </Button>
        </Link>
      </div>

      {/* Chat List */}
      <div className="max-h-80 overflow-y-auto">
        {recentChats.length === 0 ? (
          <div className="p-6 text-center">
            <MessageCircle size={32} className="text-gray-300 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">{t.noRecentChats}</h4>
            <p className="text-xs text-gray-500">{t.noRecentChatsDescription}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentChats.slice(0, 5).map((chat) => (
              <Link
                key={chat.id}
                href={`/dashboard/chats?chat=${chat.id}`}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-700">
                        {chat.otherUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {chat.otherUser.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                    )}
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {chat.otherUser.name}
                        </h4>
                        <span className={cn(
                          "inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium",
                          chat.otherUser.userType === 'buyer' 
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-green-100 text-green-700"
                        )}>
                          {chat.otherUser.userType === 'buyer' ? t.buyer : t.seller}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {chat.unreadCount > 0 && (
                          <span className="bg-[#FF8A00] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(chat.lastMessage.timestamp)}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mb-1 flex items-center">
                      <Package size={8} className="mr-1" />
                      {truncateMessage(chat.materialName, 30)}
                    </p>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-700 truncate flex-1">
                        {chat.lastMessage.sender === 'me' && (
                          <span className="text-gray-500">{t.you}: </span>
                        )}
                        {truncateMessage(chat.lastMessage.content)}
                      </p>
                    </div>

                    <div className="mt-1 text-xs text-gray-400 font-mono">
                      #{chat.orderId}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {recentChats.length > 5 && (
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <Link href="/dashboard/chats">
            <Button variant="ghost" size="sm" className="w-full text-[#FF8A00] hover:text-[#e67700]">
              View {recentChats.length - 5} more chats
              <ArrowRight size={14} className="ml-1" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

// Hook to get recent chats data
export function useRecentChats() {
  // In a real app, this would fetch from your API
  const [recentChats, setRecentChats] = React.useState<ChatPreview[]>([
    {
      id: 'chat-1',
      orderId: 'NL-2024-001234',
      otherUser: {
        name: 'Erik Andersson',
        company: 'Nordic Recycling AB',
        userType: 'seller',
        isOnline: true
      },
      lastMessage: {
        content: 'The quality certificates have been uploaded.',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        sender: 'them'
      },
      unreadCount: 2,
      materialName: 'HDPE Post-Industrial Pellets'
    },
    {
      id: 'chat-2',
      orderId: 'NL-2024-001189',
      otherUser: {
        name: 'Anna Larsson',
        company: 'Green Materials Ltd',
        userType: 'buyer',
        isOnline: false
      },
      lastMessage: {
        content: 'Thank you for the quick delivery!',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        sender: 'them'
      },
      unreadCount: 0,
      materialName: 'Recycled PET Flakes'
    },
    {
      id: 'chat-3',
      orderId: 'NL-2024-001156',
      otherUser: {
        name: 'Magnus Johansson',
        company: 'Sustainable Plastics AB',
        userType: 'seller',
        isOnline: true
      },
      lastMessage: {
        content: 'Your order is now in transit',
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        sender: 'system'
      },
      unreadCount: 1,
      materialName: 'PP Injection Grade Pellets'
    }
  ]);

  return { recentChats, setRecentChats };
}
