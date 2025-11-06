/**
 * ChatContainer wrapper that integrates with the chat microservice API
 */
"use client";

import React, { useMemo } from 'react';
import { ChatContainer } from './ChatContainer';
import { useChatMessages } from '@/hooks/useChatMessages';
import { Transaction } from '@/services/chat';
import { Loader2 } from 'lucide-react';

interface ChatContainerWithAPIProps {
  transaction: Transaction;
  currentUserId: number;
  language?: 'en' | 'sv';
  onBack?: () => void;
  className?: string;
}

/**
 * Convert Transaction to OrderContext format expected by ChatContainer
 */
function transactionToOrderContext(transaction: Transaction, currentUserId: number) {
  const isCurrentUserBuyer = transaction.user_id === currentUserId;
  
  return {
    orderId: transaction.transaction_id,
    materialName: transaction.auction_name,
    materialType: "Material", // TODO: Add material type to transaction schema
    quantity: "N/A", // TODO: Add quantity to transaction schema
    price: "N/A", // TODO: Add price to transaction schema
    shippingAddress: "N/A", // TODO: Add shipping address to transaction schema
    estimatedDelivery: transaction.date_time || new Date().toISOString(),
    status: transaction.transaction_status.toLowerCase() as 'pending' | 'in_transit' | 'delivered' | 'completed',
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
    specifications: {
      grade: undefined,
      color: undefined,
      origin: undefined,
      certifications: undefined
    },
    timeline: {
      orderPlaced: transaction.date_time ? new Date(transaction.date_time) : new Date(),
      paymentConfirmed: transaction.date_time ? new Date(transaction.date_time) : new Date(),
      shippingStarted: undefined,
      delivered: transaction.transaction_status === 'Delivered' ? new Date() : undefined,
      completed: transaction.transaction_status === 'Complete' ? new Date() : undefined
    }
  };
}

/**
 * Convert ChatMessage from API to Message format expected by ChatContainer
 */
function apiMessageToMessage(apiMessage: any, currentUserId: number) {
  const isCurrentUser = apiMessage.sender_id === currentUserId;
  
  return {
    id: apiMessage._id || apiMessage.transaction_id + '-' + apiMessage.timestamp,
    type: 'text' as const,
    content: apiMessage.message,
    sender: isCurrentUser ? 'buyer' as const : 'seller' as const, // Simplified - in real app, determine based on role
    timestamp: apiMessage.timestamp ? new Date(apiMessage.timestamp) : new Date(),
    isRead: true,
    deliveryStatus: 'delivered' as const
  };
}

export function ChatContainerWithAPI({
  transaction,
  currentUserId,
  language = 'en',
  onBack,
  className
}: ChatContainerWithAPIProps) {
  const { messages: apiMessages, isLoading, error, sendNewMessage } = useChatMessages(
    transaction.transaction_id,
    true // Enable WebSocket for real-time updates
  );

  // Convert API messages to ChatContainer format
  const messages = useMemo(() => {
    return apiMessages.map(msg => apiMessageToMessage(msg, currentUserId));
  }, [apiMessages, currentUserId]);

  // Convert transaction to order context
  const orderContext = useMemo(() => {
    return transactionToOrderContext(transaction, currentUserId);
  }, [transaction, currentUserId]);

  // Determine current user type
  const currentUser = transaction.user_id === currentUserId ? 'buyer' : 'seller';

  // Handle sending messages
  const handleSendMessage = async (content: string, _attachments?: File[]) => {
    // TODO: Implement file upload support
    const success = await sendNewMessage(content);
    
    if (!success && error) {
      // Show error notification
      // TODO: Replace with proper error notification system
    }
  };

  const handleConfirmDelivery = () => {
    // TODO: Implement delivery confirmation
  };

  const handleReportIssue = () => {
    // TODO: Implement issue reporting
  };

  const handleExportChat = () => {
    // TODO: Implement chat export
  };

  // Show loading state
  if (isLoading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF8A00] mx-auto mb-4" />
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load messages</h3>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <ChatContainer
      orderContext={orderContext}
      currentUser={currentUser}
      language={language}
      onBack={onBack}
      className={className}
      // Override the message handling with API integration
      messages={messages}
      onSendMessage={handleSendMessage}
      onConfirmDelivery={handleConfirmDelivery}
      onReportIssue={handleReportIssue}
      onExportChat={handleExportChat}
    />
  );
}

