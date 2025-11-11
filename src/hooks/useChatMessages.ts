/**
 * Custom hook for managing chat messages with WebSocket support
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getMessages,
  sendMessage,
  createChatWebSocket,
  ChatMessage,
  SendMessageRequest
} from '@/services/chat';
import { useUnreadCount } from '@/contexts/UnreadCountContext';

interface UseChatMessagesReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendNewMessage: (message: string) => Promise<boolean>;
  refreshMessages: () => Promise<void>;
}

/**
 * Hook to manage messages for a specific transaction
 * @param transactionId The transaction ID to fetch messages for
 * @param enableWebSocket Whether to enable real-time WebSocket updates
 * @returns Messages state and functions
 */
export function useChatMessages(
  transactionId: string | null,
  enableWebSocket: boolean = false
): UseChatMessagesReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const { handleNewMessage, handleReadReceipt } = useUnreadCount();

  // Fetch messages from API
  const fetchMessages = useCallback(async () => {
    if (!transactionId) {
      setMessages([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getMessages(transactionId);

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setMessages(response.data.messages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, [transactionId]);

  // Send a new message
  const sendNewMessage = useCallback(async (message: string): Promise<boolean> => {
    if (!transactionId || !message.trim()) {
      return false;
    }

    try {
      const request: SendMessageRequest = {
        transaction_id: transactionId,
        message: message.trim(),
      };

      const response = await sendMessage(request);

      if (response.error) {
        setError(response.error);
        return false;
      }

      if (response.data) {
        // ✅ FIX: Don't add message here - let WebSocket handle it
        // This prevents duplicate messages for the sender
        // The WebSocket broadcast will add the message for all users (including sender)
        return true;
      }

      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      return false;
    }
  }, [transactionId]);

  // Refresh messages manually
  const refreshMessages = useCallback(async () => {
    await fetchMessages();
  }, [fetchMessages]);

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!enableWebSocket || !transactionId) {
      return;
    }

    try {
      // Create WebSocket connection
      const ws = createChatWebSocket(transactionId);
      wsRef.current = ws;

      ws.onopen = () => {
        // WebSocket connected successfully
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Check if this is a read receipt
          if (data.type === 'read_receipt') {
            // Handle read receipt
            handleReadReceipt(data.transaction_id, data.marked_count);
            return;
          }

          // Otherwise, it's a regular message
          const newMessage = data as ChatMessage;

          // Notify unread count context about new message
          if (newMessage.sender_id) {
            handleNewMessage(newMessage.transaction_id, newMessage.sender_id);
          }

          // Add new message to the list if it's not already there
          setMessages(prev => {
            const exists = prev.some(msg => msg._id === newMessage._id);
            if (exists) {
              return prev;
            }
            return [...prev, newMessage];
          });
        } catch {
          // Failed to parse WebSocket message
          setError('Failed to parse incoming message');
        }
      };

      ws.onerror = (_error) => {
        setError('Real-time connection error');
      };

      ws.onclose = () => {
        // WebSocket disconnected
      };

      // Cleanup on unmount or transaction change
      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
        wsRef.current = null;
      };
    } catch {
      // Failed to create WebSocket connection
      setError('Failed to establish real-time connection');
    }
  }, [transactionId, enableWebSocket, handleNewMessage, handleReadReceipt]);

  return {
    messages,
    isLoading,
    error,
    sendNewMessage,
    refreshMessages,
  };
}

