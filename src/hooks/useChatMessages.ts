/**
 * Custom hook for managing chat messages with TanStack Query and WebSocket
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import {
  getMessages,
  sendMessage,
  createChatWebSocket,
  ChatMessage
} from '@/services/chat';
import { useUnreadCount } from '@/contexts/UnreadCountContext';

interface UseChatMessagesReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendNewMessage: (message: string, file?: File) => Promise<boolean>;
  refetch: () => void;
}

/**
 * Hook to manage messages for a specific transaction using TanStack Query
 */
export function useChatMessages(
  transactionId: string | null,
  enableWebSocket: boolean = false
): UseChatMessagesReturn {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const { handleNewMessage, handleReadReceipt } = useUnreadCount();

  // Fetch messages using TanStack Query
  const {
    data: messages = [],
    isLoading,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: ['messages', transactionId],
    queryFn: async () => {
      if (!transactionId) return [];
      const response = await getMessages(transactionId);
      if (response.error) throw new Error(response.error);
      return response.data?.messages || [];
    },
    enabled: !!transactionId,
    staleTime: 10000, // 10 seconds
    retry: 2,
  });

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: async ({ message, file }: { message: string; file?: File }) => {
      if (!transactionId) throw new Error('No transaction selected');
      const response = await sendMessage(transactionId, message, file);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      // WebSocket will handle adding the message, no need to refetch
      // Just invalidate to keep query fresh
      queryClient.invalidateQueries({ queryKey: ['messages', transactionId] });
    },
  });

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!enableWebSocket || !transactionId) return;

    try {
      const ws = createChatWebSocket(transactionId);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Handle read receipt
          if (data.type === 'read_receipt') {
            handleReadReceipt(data.transaction_id, data.marked_count);
            return;
          }

          // Handle new message
          const newMessage = data as ChatMessage;
          if (newMessage.sender_id) {
            handleNewMessage(newMessage.transaction_id, newMessage.sender_id);
          }

          // Update messages in cache without refetching
          queryClient.setQueryData<ChatMessage[]>(
            ['messages', transactionId],
            (old = []) => {
              const exists = old.some(msg => msg._id === newMessage._id);
              return exists ? old : [...old, newMessage];
            }
          );
        } catch {
          // Ignore parse errors
        }
      };

      return () => {
        if (ws.readyState === WebSocket.OPEN) ws.close();
        wsRef.current = null;
      };
    } catch {
      // Ignore connection errors
    }
  }, [transactionId, enableWebSocket, handleNewMessage, handleReadReceipt, queryClient]);

  return {
    messages,
    isLoading,
    error: queryError?.message || null,
    sendNewMessage: async (message: string, file?: File) => {
      if (!transactionId || (!message.trim() && !file)) return false;
      try {
        await sendMutation.mutateAsync({ message: message.trim(), file });
        return true;
      } catch {
        return false;
      }
    },
    refetch: () => { refetch(); },
  };
}
