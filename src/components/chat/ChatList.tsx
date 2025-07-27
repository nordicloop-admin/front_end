"use client";

import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Search, 
  Filter,
  Clock,
  CheckCircle2,
  Package,
  User,
  Building,
  MoreVertical,
  Archive,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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

interface ChatListProps {
  chats: ChatPreview[];
  currentUserId: string;
  language?: 'en' | 'sv';
  onChatSelect: (chatId: string) => void;
  onArchiveChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
  className?: string;
}

const translations = {
  en: {
    chats: "Chats",
    searchChats: "Search chats...",
    noChats: "No chats yet",
    noChatsDescription: "Your conversations will appear here after successful orders",
    allChats: "All",
    active: "Active",
    archived: "Archived",
    unread: "Unread",
    online: "Online",
    offline: "Offline",
    justNow: "Just now",
    minutesAgo: "m ago",
    hoursAgo: "h ago",
    daysAgo: "d ago",
    weeksAgo: "w ago",
    you: "You",
    system: "System",
    orderStatus: "Order Status",
    pending: "Pending",
    inTransit: "In Transit",
    delivered: "Delivered",
    completed: "Completed",
    archiveChat: "Archive Chat",
    deleteChat: "Delete Chat",
    buyer: "Buyer",
    seller: "Seller",
    newMessage: "New message",
    deliveryUpdate: "Delivery update",
    qualityConfirmation: "Quality confirmation"
  },
  sv: {
    chats: "Chattar",
    searchChats: "Sök chattar...",
    noChats: "Inga chattar än",
    noChatsDescription: "Dina konversationer kommer att visas här efter framgångsrika beställningar",
    allChats: "Alla",
    active: "Aktiva",
    archived: "Arkiverade",
    unread: "Olästa",
    online: "Online",
    offline: "Offline",
    justNow: "Just nu",
    minutesAgo: "m sedan",
    hoursAgo: "h sedan",
    daysAgo: "d sedan",
    weeksAgo: "v sedan",
    you: "Du",
    system: "System",
    orderStatus: "Orderstatus",
    pending: "Väntande",
    inTransit: "Under transport",
    delivered: "Levererad",
    completed: "Slutförd",
    archiveChat: "Arkivera chatt",
    deleteChat: "Ta bort chatt",
    buyer: "Köpare",
    seller: "Säljare",
    newMessage: "Nytt meddelande",
    deliveryUpdate: "Leveransuppdatering",
    qualityConfirmation: "Kvalitetsbekräftelse"
  }
};

export function ChatList({
  chats,
  currentUserId,
  language = 'en',
  onChatSelect,
  onArchiveChat,
  onDeleteChat,
  className
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'archived' | 'unread'>('all');
  const [filteredChats, setFilteredChats] = useState(chats);

  const t = translations[language];

  useEffect(() => {
    let filtered = chats;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(chat => 
        chat.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.otherUser.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.materialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.orderId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    switch (filterStatus) {
      case 'active':
        filtered = filtered.filter(chat => chat.chatStatus === 'active');
        break;
      case 'archived':
        filtered = filtered.filter(chat => chat.chatStatus === 'archived');
        break;
      case 'unread':
        filtered = filtered.filter(chat => chat.unreadCount > 0);
        break;
    }

    // Sort by last message timestamp (most recent first)
    filtered.sort((a, b) => b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime());

    setFilteredChats(filtered);
  }, [chats, searchQuery, filterStatus]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    const weeks = Math.floor(diff / 604800000);

    if (minutes < 1) return t.justNow;
    if (minutes < 60) return `${minutes}${t.minutesAgo}`;
    if (hours < 24) return `${hours}${t.hoursAgo}`;
    if (days < 7) return `${days}${t.daysAgo}`;
    return `${weeks}${t.weeksAgo}`;
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'delivered': return 'text-blue-600 bg-blue-50';
      case 'in_transit': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getMessagePreview = (chat: ChatPreview) => {
    const { lastMessage } = chat;
    let preview = lastMessage.content;

    if (lastMessage.type === 'image') {
      preview = '📷 Photo';
    } else if (lastMessage.type === 'document') {
      preview = '📄 Document';
    } else if (lastMessage.type === 'system') {
      if (preview.includes('delivery')) preview = t.deliveryUpdate;
      else if (preview.includes('quality')) preview = t.qualityConfirmation;
    }

    // Truncate long messages
    if (preview.length > 50) {
      preview = preview.substring(0, 50) + '...';
    }

    return preview;
  };

  const filterCounts = {
    all: chats.length,
    active: chats.filter(c => c.chatStatus === 'active').length,
    archived: chats.filter(c => c.chatStatus === 'archived').length,
    unread: chats.filter(c => c.unreadCount > 0).length
  };

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <MessageCircle size={20} className="mr-2" />
            {t.chats}
          </h2>
          {chats.length > 0 && (
            <span className="text-sm text-gray-500">
              {filteredChats.length} of {chats.length}
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t.searchChats}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF8A00] focus:border-[#FF8A00] text-sm"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {(['all', 'active', 'archived', 'unread'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterStatus(filter)}
              className={cn(
                "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                filterStatus === filter
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {t[filter]}
              {filterCounts[filter] > 0 && (
                <span className="ml-1 text-xs">({filterCounts[filter]})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <MessageCircle size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t.noChats}</h3>
            <p className="text-sm text-gray-500 max-w-sm">{t.noChatsDescription}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={cn(
                  "p-4 hover:bg-gray-50 cursor-pointer transition-colors",
                  chat.unreadCount > 0 && "bg-blue-50 border-l-4 border-l-blue-500"
                )}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {chat.otherUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {chat.otherUser.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
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
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-green-100 text-green-800"
                        )}>
                          {chat.otherUser.userType === 'buyer' ? t.buyer : t.seller}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {chat.unreadCount > 0 && (
                          <span className="bg-[#FF8A00] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(chat.lastMessage.timestamp)}
                        </span>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-6 h-6 p-0 text-gray-400 hover:text-gray-600"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical size={12} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {onArchiveChat && (
                              <DropdownMenuItem onClick={() => onArchiveChat(chat.id)}>
                                <Archive size={14} className="mr-2" />
                                {t.archiveChat}
                              </DropdownMenuItem>
                            )}
                            {onDeleteChat && (
                              <DropdownMenuItem 
                                onClick={() => onDeleteChat(chat.id)}
                                className="text-red-600"
                              >
                                <Trash2 size={14} className="mr-2" />
                                {t.deleteChat}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mb-1 flex items-center">
                      <Building size={10} className="mr-1" />
                      {chat.otherUser.company}
                    </p>

                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-600 truncate flex-1">
                        <Package size={10} className="mr-1 inline" />
                        {chat.materialName}
                      </p>
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ml-2",
                        getOrderStatusColor(chat.orderStatus)
                      )}>
                        {t[chat.orderStatus as keyof typeof t]}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-700 truncate flex-1">
                        {chat.lastMessage.sender === 'me' && (
                          <span className="text-gray-500">{t.you}: </span>
                        )}
                        {chat.lastMessage.sender === 'system' && (
                          <span className="text-gray-500">{t.system}: </span>
                        )}
                        {getMessagePreview(chat)}
                      </p>
                      
                      {chat.lastMessage.sender === 'me' && (
                        <CheckCircle2 size={12} className="text-gray-400 ml-2 flex-shrink-0" />
                      )}
                    </div>

                    <div className="mt-1 text-xs text-gray-400 font-mono">
                      #{chat.orderId}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
