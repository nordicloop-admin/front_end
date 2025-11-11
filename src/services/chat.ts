/**
 * Chat service for interacting with the chat microservice
 */
import { getAccessToken } from '@/services/auth';

// Base URL for the chat microservice
const CHAT_API_BASE_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:8001';

/**
 * Interface for API response
 */
export interface ChatApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * Transaction interface matching the chat microservice schema
 */
export interface Transaction {
  _id?: string;
  transaction_id: string;
  auction_name: string;
  user_id: number;
  seller_id: number;
  first_name: string;
  last_name: string;
  buyer_company: string;
  seller_company: string;
  role: 'Buyer' | 'Seller';
  transaction_status: 'Pending' | 'Delivered' | 'Complete';
  date_time?: string;
  last_message?: string | null;
  created_at?: string;
}

/**
 * Message interface matching the chat microservice schema
 */
export interface ChatMessage {
  _id?: string;
  transaction_id: string;
  message: string;
  sender_id: number;
  timestamp?: string;
}

/**
 * Request body for creating a transaction
 */
export interface CreateTransactionRequest {
  transaction_id: string;
  auction_name: string;
  seller_id: number;
  seller_company: string;
  transaction_status: 'Pending' | 'Delivered' | 'Complete';
}

/**
 * Request body for sending a message
 */
export interface SendMessageRequest {
  transaction_id: string;
  message: string;
}

/**
 * Response from GET /transactions
 */
export interface TransactionsResponse {
  transactions: Transaction[];
  count: number;
}

/**
 * Response from GET /messages/{transaction_id}
 */
export interface MessagesResponse {
  messages: ChatMessage[];
  count: number;
}

/**
 * Response from POST /messages/{transaction_id}/mark-read
 */
export interface MarkAsReadResponse {
  transaction_id: string;
  marked_count: number;
  success: boolean;
}

/**
 * Response from GET /messages/unread-count
 */
export interface UnreadCountResponse {
  total_unread: number;
}

/**
 * Transaction unread count
 */
export interface TransactionUnreadCount {
  transaction_id: string;
  unread_count: number;
}

/**
 * Response from GET /transactions/unread-counts
 */
export interface UnreadCountsByTransactionResponse {
  counts: TransactionUnreadCount[];
}

/**
 * Get headers for chat API requests
 */
function getChatHeaders(): HeadersInit {
  const token = getAccessToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Get all transactions for the authenticated user
 * @returns List of transactions where user is buyer or seller
 */
export async function getTransactions(): Promise<ChatApiResponse<TransactionsResponse>> {
  try {
    const headers = getChatHeaders();
    const url = `${CHAT_API_BASE_URL}/transactions`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: data.detail || 'Failed to fetch transactions',
        status: response.status,
      };
    }

    return {
      data: data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch transactions',
      status: 500,
    };
  }
}

/**
 * Get a specific transaction by ID
 * @param transactionId The transaction ID
 * @returns The transaction details
 */
export async function getTransaction(transactionId: string): Promise<ChatApiResponse<Transaction>> {
  try {
    const headers = getChatHeaders();
    const url = `${CHAT_API_BASE_URL}/transactions/${transactionId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: data.detail || 'Failed to fetch transaction',
        status: response.status,
      };
    }

    return {
      data: data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch transaction',
      status: 500,
    };
  }
}

/**
 * Create a new transaction
 * @param request The transaction creation request
 * @returns The created transaction
 */
export async function createTransaction(
  request: CreateTransactionRequest
): Promise<ChatApiResponse<Transaction>> {
  try {
    const headers = getChatHeaders();
    const url = `${CHAT_API_BASE_URL}/transactions`;

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: data.detail || 'Failed to create transaction',
        status: response.status,
      };
    }

    return {
      data: data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to create transaction',
      status: 500,
    };
  }
}

/**
 * Get all messages for a specific transaction
 * @param transactionId The transaction ID
 * @returns List of messages in the transaction
 */
export async function getMessages(transactionId: string): Promise<ChatApiResponse<MessagesResponse>> {
  try {
    const headers = getChatHeaders();
    const url = `${CHAT_API_BASE_URL}/messages/${transactionId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: data.detail || 'Failed to fetch messages',
        status: response.status,
      };
    }

    return {
      data: data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch messages',
      status: 500,
    };
  }
}

/**
 * Send a message in a transaction
 * @param request The message send request
 * @returns The created message
 */
export async function sendMessage(
  request: SendMessageRequest
): Promise<ChatApiResponse<ChatMessage>> {
  try {
    const headers = getChatHeaders();
    const url = `${CHAT_API_BASE_URL}/messages`;

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: data.detail || 'Failed to send message',
        status: response.status,
      };
    }

    return {
      data: data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to send message',
      status: 500,
    };
  }
}

/**
 * Create a WebSocket connection for real-time messaging
 * @param transactionId The transaction ID
 * @returns WebSocket instance
 */
export function createChatWebSocket(transactionId: string): WebSocket {
  const wsUrl = CHAT_API_BASE_URL.replace('http', 'ws');
  return new WebSocket(`${wsUrl}/ws/${transactionId}`);
}

/**
 * Interface for bid data needed to create a chat transaction
 */
export interface BidChatData {
  ad_id: number;
  ad_title: string;
  seller_id: number;
  seller_company: string;
  status: string;
}

/**
 * Create or get existing transaction for a bid and navigate to chat
 * This function is used when a buyer wants to chat with a seller from the My Bids page
 *
 * @param bidData The bid data containing seller information
 * @returns The transaction ID if successful, or error message
 */
export async function createTransactionFromBid(
  bidData: BidChatData
): Promise<ChatApiResponse<string>> {
  try {
    // Use ad_id as transaction_id (unique identifier for the auction)
    const transactionId = `ad-${bidData.ad_id}`;

    // Check if transaction already exists
    const existingTransaction = await getTransaction(transactionId);

    if (existingTransaction.data) {
      // Transaction already exists, return its ID
      return {
        data: transactionId,
        error: null,
        status: 200,
      };
    }

    // Create new transaction
    const createRequest: CreateTransactionRequest = {
      transaction_id: transactionId,
      auction_name: bidData.ad_title,
      seller_id: bidData.seller_id,
      seller_company: bidData.seller_company,
      transaction_status: bidData.status === 'paid' ? 'Complete' : 'Pending',
    };

    const createResponse = await createTransaction(createRequest);

    if (createResponse.error) {
      return {
        data: null,
        error: createResponse.error,
        status: createResponse.status,
      };
    }

    return {
      data: transactionId,
      error: null,
      status: createResponse.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to create transaction from bid',
      status: 500,
    };
  }
}

/**
 * Mark all messages in a transaction as read
 * @param transactionId The transaction ID
 * @returns Number of messages marked as read
 */
export async function markMessagesAsRead(transactionId: string): Promise<MarkAsReadResponse> {
  const headers = getChatHeaders();
  const url = `${CHAT_API_BASE_URL}/messages/${transactionId}/mark-read`;

  const response = await fetch(url, {
    method: 'POST',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to mark messages as read');
  }

  return await response.json();
}

/**
 * Get total unread message count for the current user
 * @returns Total number of unread messages
 */
export async function getUnreadCount(): Promise<number> {
  const headers = getChatHeaders();
  const url = `${CHAT_API_BASE_URL}/messages/unread-count`;

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to get unread count');
  }

  const data: UnreadCountResponse = await response.json();
  return data.total_unread;
}

/**
 * Get unread message counts grouped by transaction
 * @returns List of unread counts per transaction
 */
export async function getUnreadCountsByTransaction(): Promise<TransactionUnreadCount[]> {
  const headers = getChatHeaders();
  const url = `${CHAT_API_BASE_URL}/transactions/unread-counts`;

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to get unread counts by transaction');
  }

  const data: UnreadCountsByTransactionResponse = await response.json();
  return data.counts;
}

/**
 * Search transactions by company name, buyer names, or auction name
 * @param query Search query string
 * @returns List of matching transactions
 */
export async function searchTransactions(query: string): Promise<ChatApiResponse<TransactionsResponse>> {
  try {
    const headers = getChatHeaders();
    const url = `${CHAT_API_BASE_URL}/transactions/search?q=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: data.detail || 'Failed to search transactions',
        status: response.status,
      };
    }

    return {
      data: data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to search transactions',
      status: 500,
    };
  }
}

