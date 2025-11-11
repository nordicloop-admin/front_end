"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getUnreadCount, getUnreadCountsByTransaction, markMessagesAsRead } from '@/services/chat';
import { useAuth } from './AuthContext';

interface UnreadCountContextType {
  totalUnreadCount: number;
  unreadChatsCount: number; // Number of conversations with unread messages
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

  // Compute the number of conversations with unread messages
  const unreadChatsCount = useMemo(() => {
    let count = 0;
    unreadCountsByTransaction.forEach((unreadCount) => {
      if (unreadCount > 0) {
        count++;
      }
    });
    return count;
  }, [unreadCountsByTransaction]);

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
      console.log('[UnreadCount] Global unread count:', globalCount);
      setTotalUnreadCount(globalCount);

      // Fetch per-transaction unread counts
      const transactionCounts = await getUnreadCountsByTransaction();
      console.log('[UnreadCount] Per-transaction counts:', transactionCounts);

      const countsMap = new Map<string, number>();
      transactionCounts.forEach(({ transaction_id, unread_count }) => {
        countsMap.set(transaction_id, unread_count);
      });

      console.log('[UnreadCount] Counts map:', Array.from(countsMap.entries()));
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
    console.log('[UnreadCount] handleNewMessage called:', { transactionId, senderId, currentUserId: user?.id });

    // Only increment if the message is from someone else
    if (user && senderId !== user.id) {
      console.log('[UnreadCount] Incrementing unread count for transaction:', transactionId);

      setTotalUnreadCount(prev => {
        console.log('[UnreadCount] Total count before:', prev, 'after:', prev + 1);
        return prev + 1;
      });

      setUnreadCountsByTransaction(prev => {
        const newMap = new Map(prev);
        const currentCount = newMap.get(transactionId) || 0;
        newMap.set(transactionId, currentCount + 1);
        console.log('[UnreadCount] Transaction counts updated:', Array.from(newMap.entries()));
        return newMap;
      });
    } else {
      console.log('[UnreadCount] Skipping increment - message from current user');
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

  // Global WebSocket connection for real-time unread count updates
  useEffect(() => {
    if (!user) return;

    console.log('[UnreadCount] Setting up global WebSocket connection for user:', user.id);
    
    // Initial load
    refreshUnreadCounts();

    // Create global WebSocket connection
    let globalWs: WebSocket | null = null;
    
    try {
      // Use the same base URL as the chat service but with ws protocol
      const baseUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:8001';
      const wsUrl = baseUrl.replace('http://', 'ws://').replace('https://', 'wss://') + `/ws/global/${user.id}`;
      globalWs = new WebSocket(wsUrl);
      
      globalWs.onopen = () => {
        console.log('[UnreadCount] Global WebSocket connected');
      };
      
      globalWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('[UnreadCount] Global WebSocket message received:', data);
          
          if (data.type === 'unread_count_update') {
            console.log('[UnreadCount] Processing unread count update:', data);
            
            // Update total count
            setTotalUnreadCount(data.total_unread);
            
            // Update per-transaction count
            setUnreadCountsByTransaction(prev => {
              const newMap = new Map(prev);
              if (data.transaction_unread > 0) {
                newMap.set(data.transaction_id, data.transaction_unread);
              } else {
                newMap.delete(data.transaction_id);
              }
              console.log('[UnreadCount] Transaction counts updated via WebSocket:', Array.from(newMap.entries()));
              return newMap;
            });
          }
        } catch (error) {
          console.error('[UnreadCount] Error parsing global WebSocket message:', error);
        }
      };
      
      globalWs.onerror = (error) => {
        console.error('[UnreadCount] Global WebSocket error:', error);
      };
      
      globalWs.onclose = () => {
        console.log('[UnreadCount] Global WebSocket disconnected');
      };
      
      // Send periodic ping to keep connection alive
      const pingInterval = setInterval(() => {
        if (globalWs && globalWs.readyState === WebSocket.OPEN) {
          globalWs.send(JSON.stringify({ type: 'ping' }));
        }
      }, 30000); // Ping every 30 seconds
      
      // Fallback polling (less frequent since we have WebSocket)
      console.log('[UnreadCount] Setting up fallback polling interval (30 seconds)');
      const pollInterval = setInterval(() => {
        console.log('[UnreadCount] Fallback polling for unread counts...');
        refreshUnreadCounts();
      }, 30000); // Reduced to 30 seconds since WebSocket handles real-time updates
      
      return () => {
        console.log('[UnreadCount] Cleaning up global WebSocket and intervals');
        clearInterval(pingInterval);
        clearInterval(pollInterval);
        
        if (globalWs && globalWs.readyState === WebSocket.OPEN) {
          globalWs.close();
        }
      };
    } catch (error) {
      console.error('[UnreadCount] Failed to create global WebSocket:', error);
      
      // Fallback to polling only
      console.log('[UnreadCount] Falling back to polling only');
      const interval = setInterval(() => {
        console.log('[UnreadCount] Polling for unread counts (WebSocket failed)...');
        refreshUnreadCounts();
      }, 5000);
      return () => {
        console.log('[UnreadCount] Cleaning up polling interval');
        clearInterval(interval);
      };
    }
  }, [user, refreshUnreadCounts]);

  return (
    <UnreadCountContext.Provider
      value={{
        totalUnreadCount,
        unreadChatsCount,
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

