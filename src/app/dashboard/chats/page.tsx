"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatList } from '@/components/chat/ChatList';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useUnreadCount } from '@/contexts/UnreadCountContext';
import { Transaction, ChatMessage, searchTransactions } from '@/services/chat';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useTransactions } from '@/hooks/useTransactions';
import { Loader2 } from 'lucide-react';

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

/**
 * Convert Transaction from chat microservice to ChatPreview format
 */
function transactionToChatPreview(
  transaction: Transaction,
  currentUserId: number,
  unreadCount: number = 0
): ChatPreview {
  const isCurrentUserBuyer = transaction.user_id === currentUserId;

  // Determine the other user based on current user's role
  const otherUser = isCurrentUserBuyer ? {
    name: `Seller ${transaction.seller_id}`, // In real app, fetch seller details
    company: transaction.seller_company,
    avatar: undefined,
    isOnline: false,
    userType: 'seller' as const
  } : {
    name: `${transaction.first_name} ${transaction.last_name}`,
    company: transaction.buyer_company,
    avatar: undefined,
    isOnline: false,
    userType: 'buyer' as const
  };

  // Map transaction status to order status
  const orderStatusMap: Record<string, 'pending' | 'in_transit' | 'delivered' | 'completed'> = {
    'Pending': 'pending',
    'Delivered': 'delivered',
    'Complete': 'completed'
  };

  return {
    id: transaction.transaction_id,
    orderId: transaction.transaction_id,
    otherUser,
    lastMessage: {
      content: transaction.last_message || 'No messages yet',
      timestamp: transaction.date_time ? new Date(transaction.date_time) : new Date(),
      sender: 'them' as const,
      type: 'text' as const
    },
    unreadCount,
    materialName: transaction.auction_name,
    orderStatus: orderStatusMap[transaction.transaction_status] || 'pending',
    chatStatus: 'active' as const,
    priority: 'medium' as const
  };
}

/**
 * Convert Transaction to OrderContext format with enhanced auction_info support
 */
function transactionToOrderContext(transaction: Transaction, currentUserId: number) {
  const isCurrentUserBuyer = transaction.user_id === currentUserId;
  const auctionInfo = transaction.auction_info;

  // Map transaction status
  const statusMap: Record<string, 'pending' | 'in_transit' | 'delivered' | 'completed'> = {
    'Pending': 'pending',
    'Delivered': 'delivered',
    'Complete': 'completed'
  };

  // Format quantity and price from auction_info if available
  const formatQuantity = () => {
    if (auctionInfo?.available_quantity && auctionInfo?.unit_of_measurement) {
      return `${auctionInfo.available_quantity} ${auctionInfo.unit_of_measurement}`;
    }
    return "N/A";
  };

  const formatPrice = () => {
    if (auctionInfo?.starting_bid_price && auctionInfo?.currency) {
      const price = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: auctionInfo.currency
      }).format(auctionInfo.starting_bid_price);
      return `${price} per ${auctionInfo.unit_of_measurement || 'unit'}`;
    }
    return "N/A";
  };

  // Format shipping address from location info
  const formatShippingAddress = () => {
    if (auctionInfo?.location) {
      const location = auctionInfo.location;
      const addressParts = [
        location.address_line,
        location.city,
        location.state_province,
        location.country
      ].filter(Boolean);

      if (addressParts.length > 0) {
        return addressParts.join(', ');
      }
    }
    return "N/A";
  };

  // Format estimated delivery from auction end date
  const formatEstimatedDelivery = () => {
    if (auctionInfo?.auction_end_date) {
      const endDate = new Date(auctionInfo.auction_end_date);
      // Add 7-14 days for delivery after auction ends
      const deliveryDate = new Date(endDate.getTime() + (10 * 24 * 60 * 60 * 1000));
      return deliveryDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    return transaction.date_time ? new Date(transaction.date_time).toLocaleDateString() : new Date().toLocaleDateString();
  };

  // Enhanced material type from category and subcategory
  const materialType = auctionInfo?.category && auctionInfo?.subcategory
    ? `${auctionInfo.category} - ${auctionInfo.subcategory}`
    : "Material";

  // Enhanced specifications from auction_info
  const specifications = {
    grade: auctionInfo?.specific_material || undefined,
    color: undefined, // Not available in current auction_info
    origin: auctionInfo?.origin || undefined,
    certifications: auctionInfo?.additives ? [auctionInfo.additives] : undefined
  };

  // Enhanced timeline using auction dates
  const timeline = {
    orderPlaced: transaction.date_time ? new Date(transaction.date_time) : new Date(),
    paymentConfirmed: transaction.date_time ? new Date(transaction.date_time) : new Date(),
    shippingStarted: transaction.transaction_status !== 'Pending' ? new Date() : undefined,
    delivered: transaction.transaction_status === 'Delivered' ? new Date() : undefined,
    completed: transaction.transaction_status === 'Complete' ? new Date() : undefined
  };

  return {
    orderId: transaction.transaction_id,
    materialName: transaction.auction_name,
    materialType,
    quantity: formatQuantity(),
    price: formatPrice(),
    shippingAddress: formatShippingAddress(),
    estimatedDelivery: formatEstimatedDelivery(),
    status: statusMap[transaction.transaction_status] || 'pending',
    seller: {
      name: isCurrentUserBuyer ? `Seller ${transaction.seller_id}` : `${transaction.first_name} ${transaction.last_name}`,
      company: isCurrentUserBuyer ? transaction.seller_company : transaction.buyer_company,
      avatar: undefined,
      isOnline: false,
      lastSeen: undefined
    },
    buyer: {
      name: isCurrentUserBuyer ? `${transaction.first_name} ${transaction.last_name}` : `Buyer ${transaction.user_id}`,
      company: isCurrentUserBuyer ? transaction.buyer_company : transaction.seller_company,
      avatar: undefined,
      isOnline: false,
      lastSeen: undefined
    },
    specifications,
    timeline,
    // Pass the complete auction_info for enhanced display
    auctionInfo: auctionInfo || undefined
  };
}

export default function ChatsPage() {
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { markTransactionAsRead, unreadCountsByTransaction } = useUnreadCount();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(
    searchParams.get('chat') || null
  );
  const [isMobile, setIsMobile] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Use TanStack Query for transactions - automatically handles background polling
  const {
    data: transactions = [],
    isLoading,
    error: queryError
  } = useTransactions(30000); // Poll every 30 seconds

  const error = queryError?.message || null;

  // Compute chat previews using transactions and unread counts
  const chats = useMemo(() => {
    if (!user || transactions.length === 0) return [];
    return transactions.map(transaction => {
      const unreadCount = unreadCountsByTransaction.get(transaction.transaction_id) || 0;
      return transactionToChatPreview(transaction, user.id, unreadCount);
    });
  }, [transactions, user, unreadCountsByTransaction]);

  // Handle search functionality
  const handleSearch = useCallback(async (query: string): Promise<ChatPreview[]> => {
    if (!user) return [];

    try {
      setIsSearching(true);
      const response = await searchTransactions(query);

      if (response.error || !response.data) {
        // eslint-disable-next-line no-console
        console.error('Search failed:', response.error);
        return [];
      }

      // Convert search results to ChatPreview format
      const searchResults = response.data.transactions.map(transaction => {
        const unreadCount = unreadCountsByTransaction.get(transaction.transaction_id) || 0;
        return transactionToChatPreview(transaction, user.id, unreadCount);
      });

      return searchResults;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Search failed:', error);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, [user, unreadCountsByTransaction]);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleChatSelect = async (chatId: string) => {
    setSelectedChatId(chatId);

    // Mark messages as read in backend (unread counts will auto-update)
    await markTransactionAsRead(chatId);

    // Update URL 
    const url = new URL(window.location.href);
    url.searchParams.set('chat', chatId);
    window.history.pushState({}, '', url.toString());
  };

  const handleArchiveChat = (chatId: string) => {
    // TODO: Implement archive functionality with backend API
    // eslint-disable-next-line no-console
    console.log('Archive chat:', chatId);
  };

  const handleDeleteChat = (chatId: string) => {
    // TODO: Implement delete functionality with backend API
    if (selectedChatId === chatId) {
      setSelectedChatId(null);
    }
    // eslint-disable-next-line no-console
    console.log('Delete chat:', chatId);
  };

  const handleBackToList = () => {
    setSelectedChatId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('chat');
    window.history.pushState({}, '', url.toString());
  };

  const selectedTransaction = transactions.find(t => t.transaction_id === selectedChatId);

  // Convert selected transaction to order context
  const selectedOrderContext = selectedTransaction && user
    ? transactionToOrderContext(selectedTransaction, user.id)
    : null;

  // Determine current user type based on the selected transaction
  const getCurrentUserType = () => {
    if (!selectedTransaction || !user) return 'buyer';
    return selectedTransaction.user_id === user.id ? 'buyer' : 'seller';
  };

  // Use the chat messages hook for the selected transaction
  const {
    messages: apiMessages,
    isLoading: isLoadingMessages,
    error: messagesError,
    sendNewMessage
  } = useChatMessages(
    selectedChatId,
    true // Enable WebSocket for real-time updates
  );

  // Convert API messages to ChatContainer format
  const convertApiMessageToMessage = (apiMessage: ChatMessage) => {
    if (!user) return null;

    const isCurrentUser = apiMessage.sender_id === user.id;
    const currentUserType = getCurrentUserType();

    // Map message_type from API to component type
    // Note: API uses 'file' but component expects 'document'
    const messageType = apiMessage.message_type === 'image' ? 'image' as const :
      apiMessage.message_type === 'file' ? 'document' as const :
        'text' as const;

    return {
      id: apiMessage._id || `${apiMessage.transaction_id}-${apiMessage.timestamp}`,
      type: messageType,
      content: apiMessage.message || '',
      sender: isCurrentUser ? currentUserType : (currentUserType === 'buyer' ? 'seller' : 'buyer') as 'buyer' | 'seller',
      timestamp: apiMessage.timestamp ? new Date(apiMessage.timestamp) : new Date(),
      isRead: true,
      deliveryStatus: 'delivered' as const,
      // Include image and file attachments from API
      imageAttachment: apiMessage.image_attachment,
      fileAttachment: apiMessage.file_attachment
    };
  };

  const chatMessages = apiMessages
    .map(convertApiMessageToMessage)
    .filter((msg): msg is NonNullable<typeof msg> => msg !== null);

  // Handle sending messages
  const handleSendMessage = async (content: string, attachments?: File[]) => {
    // If there are attachments, we take the first one (since ChatInterface sends them one by one currently)
    const file = attachments && attachments.length > 0 ? attachments[0] : undefined;

    const success = await sendNewMessage(content, file);

    if (!success && messagesError) {
      // TODO: Show error notification to user
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF8A00] mx-auto mb-4" />
          <p className="text-gray-600">Loading chats...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center bg-white">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load chats</h3>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#FF8A00] text-white rounded-lg hover:bg-[#E67A00] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show not authenticated state
  if (!isAuthenticated || !user) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center bg-white">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Please log in</h3>
          <p className="text-sm text-gray-500">You need to be logged in to view chats</p>
        </div>
      </div>
    );
  }

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
          currentUserId={user.id.toString()}
          language="en"
          onChatSelect={handleChatSelect}
          onArchiveChat={handleArchiveChat}
          onDeleteChat={handleDeleteChat}
          onSearch={handleSearch}
          isSearching={isSearching}
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
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isLoadingMessages={isLoadingMessages}
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
