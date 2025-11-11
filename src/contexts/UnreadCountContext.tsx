"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUnreadCount, getUnreadCountsByTransaction, markMessagesAsRead } from '@/services/chat';
import { useAuth } from './AuthContext';

interface UnreadCountContextType {
  totalUnreadCount: number;
  unreadCountsByTransaction: Map<string, number>;
  markTransactionAsRead: (transactionId: string) => Promise<void>;
  refreshUnreadCounts: () => Promise<void>;
  handleNewMessage: (transactionId: string, senderId: number) => void;
  handleReadReceipt: (transactionId: string, markedCount: number) => void;
  isLoading: boolean;
}

const UnreadCountContext = createContext<UnreadCountContextType | undefined>(undefined);

export function UnreadCountProvider({ children }: { children: React.ReactNode }) {
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [unreadCountsByTransaction, setUnreadCountsByTransaction] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Fetch unread counts from the backend
  const refreshUnreadCounts = useCallback(async () => {
    if (!user) {
      setTotalUnreadCount(0);
      setUnreadCountsByTransaction(new Map());
      return;
    }

    try {
      setIsLoading(true);

      // Fetch global unread count
      const globalCount = await getUnreadCount();
      setTotalUnreadCount(globalCount);

      // Fetch per-transaction unread counts
      const transactionCounts = await getUnreadCountsByTransaction();
      const countsMap = new Map<string, number>();
      transactionCounts.forEach(({ transaction_id, unread_count }) => {
        countsMap.set(transaction_id, unread_count);
      });
      setUnreadCountsByTransaction(countsMap);
    } catch (error) {
      console.error('Failed to fetch unread counts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Mark messages in a transaction as read
  const markTransactionAsRead = useCallback(async (transactionId: string) => {
    try {
      const result = await markMessagesAsRead(transactionId);

      if (result.marked_count > 0) {
        // Update local state
        setTotalUnreadCount(prev => Math.max(0, prev - result.marked_count));
        setUnreadCountsByTransaction(prev => {
          const newMap = new Map(prev);
          newMap.delete(transactionId);
          return newMap;
        });
      }
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  }, []);

  // Handle new message received via WebSocket
  const handleNewMessage = useCallback((transactionId: string, senderId: number) => {
    // Only increment if the message is from someone else
    if (user && senderId !== user.id) {
      setTotalUnreadCount(prev => prev + 1);
      setUnreadCountsByTransaction(prev => {
        const newMap = new Map(prev);
        const currentCount = newMap.get(transactionId) || 0;
        newMap.set(transactionId, currentCount + 1);
        return newMap;
      });
    }
  }, [user]);

  // Handle read receipt received via WebSocket
  const handleReadReceipt = useCallback((transactionId: string, markedCount: number) => {
    setTotalUnreadCount(prev => Math.max(0, prev - markedCount));
    setUnreadCountsByTransaction(prev => {
      const newMap = new Map(prev);
      newMap.delete(transactionId);
      return newMap;
    });
  }, []);

  // Initial load and periodic refresh
  useEffect(() => {
    if (user) {
      refreshUnreadCounts();

      // Poll for updates every 30 seconds (fallback for when WebSocket is not connected)
      const interval = setInterval(refreshUnreadCounts, 30000);
      return () => clearInterval(interval);
    }
  }, [user, refreshUnreadCounts]);

  return (
    <UnreadCountContext.Provider
      value={{
        totalUnreadCount,
        unreadCountsByTransaction,
        markTransactionAsRead,
        refreshUnreadCounts,
        handleNewMessage,
        handleReadReceipt,
        isLoading,
      }}
    >
      {children}
    </UnreadCountContext.Provider>
  );
}

export function useUnreadCount() {
  const context = useContext(UnreadCountContext);
  if (context === undefined) {
    throw new Error('useUnreadCount must be used within an UnreadCountProvider');
  }
  return context;
}

