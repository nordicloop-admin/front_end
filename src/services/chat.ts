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

