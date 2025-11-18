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
  auction_info?: AuctionInfo;
  created_at?: string;
}

/**
 * Message type enum
 */
export type MessageType = 'text' | 'image' | 'file';

/**
 * Image attachment interface
 */
export interface ImageAttachment {
  image_name: string;
  image_url: string;
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
  thumbnail_url?: string;
  uploaded_at: string;
}

/**
 * File attachment interface
 */
export interface FileAttachment {
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

/**
 * Message interface matching the enhanced chat microservice schema
 */
export interface ChatMessage {
  _id?: string;
  transaction_id: string;
  message_type: MessageType;
  message?: string;
  sender_id: number;
  timestamp?: string;
  image_attachment?: ImageAttachment;
  file_attachment?: FileAttachment;
}

/**
 * Interface for comprehensive auction information
 */
export interface AuctionInfo {
  // Basic material information
  ad_id?: number;
  category?: string;
  subcategory?: string;
  specific_material?: string;
  
  // Quantity and pricing
  available_quantity?: number;
  unit_of_measurement?: string;
  minimum_order_quantity?: number;
  starting_bid_price?: number;
  currency?: string;
  reserve_price?: number;
  
  // Material characteristics
  packaging?: string;
  material_frequency?: string;
  origin?: string;
  contamination?: string;
  additives?: string;
  storage_conditions?: string;
  processing_methods?: string[];
  
  // Location and logistics
  location?: any;
  delivery_options?: string[];
  
  // Auction timing
  auction_duration?: number;
  auction_start_date?: string;
  auction_end_date?: string;
  
  // Additional specifications
  additional_specifications?: string;
  keywords?: string;
  
  // Status information
  status?: string;
  allow_broker_bids?: boolean;
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
  auction_info?: AuctionInfo;
}

// SendMessageRequest interface removed - using FormData directly for unified endpoint

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
 * Send a message in a transaction (text, image, or file)
 * @param transactionId The transaction ID
 * @param message Optional text message content
 * @param file Optional file attachment (image or document)
 * @returns The created message
 */
export async function sendMessage(
  transactionId: string,
  message?: string,
  file?: File
): Promise<ChatApiResponse<ChatMessage>> {
  try {
    const token = getAccessToken();
    const formData = new FormData();
    
    formData.append('transaction_id', transactionId);
    
    if (message) {
      formData.append('message', message);
    }
    
    if (file) {
      formData.append('file', file);
    }

    const response = await fetch(`${CHAT_API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
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
 * Send an image message in a transaction
 * @param transactionId The transaction ID
 * @param imageFile The image file to upload
 * @param message Optional text message to accompany the image
 * @returns The created message with image attachment
 */
export async function sendImageMessage(
  transactionId: string,
  imageFile: File,
  message?: string
): Promise<ChatApiResponse<ChatMessage>> {
  // Use the unified sendMessage function
  return sendMessage(transactionId, message, imageFile);
}

/**
 * Send a file message in a transaction
 * @param transactionId The transaction ID
 * @param file The file to upload
 * @param message Optional text message to accompany the file
 * @returns The created message with file attachment
 */
export async function sendFileMessage(
  transactionId: string,
  file: File,
  message?: string
): Promise<ChatApiResponse<ChatMessage>> {
  // Use the unified sendMessage function
  return sendMessage(transactionId, message, file);
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
 * Map ad details to auction_info format
 * @param adDetails The ad details from Nordic Loop API
 * @returns Formatted auction_info object
 */
function mapAdDetailsToAuctionInfo(adDetails: any): AuctionInfo {
  return {
    ad_id: adDetails.id,
    category: adDetails.category_name,
    subcategory: adDetails.subcategory_name,
    specific_material: adDetails.specific_material,
    available_quantity: adDetails.available_quantity,
    unit_of_measurement: adDetails.unit_of_measurement,
    minimum_order_quantity: adDetails.minimum_order_quantity ? Number.parseFloat(adDetails.minimum_order_quantity) : undefined,
    starting_bid_price: adDetails.starting_bid_price,
    currency: adDetails.currency,
    reserve_price: adDetails.reserve_price,
    packaging: adDetails.packaging,
    material_frequency: adDetails.material_frequency,
    origin: adDetails.origin,
    contamination: adDetails.contamination,
    additives: adDetails.additives,
    storage_conditions: adDetails.storage_conditions,
    processing_methods: adDetails.processing_methods || [],
    location: adDetails.location,
    delivery_options: adDetails.delivery_options || [],
    auction_duration: adDetails.auction_duration,
    auction_start_date: adDetails.auction_start_date,
    auction_end_date: adDetails.auction_end_date,
    additional_specifications: adDetails.additional_specifications,
    keywords: adDetails.keywords,
    status: adDetails.status,
    allow_broker_bids: adDetails.allow_broker_bids,
  };
}

/**
 * Fetch ad details from Nordic Loop platform
 * @param adId The ad ID to fetch details for
 * @returns The ad details or error
 */
async function fetchAdDetails(adId: number): Promise<ChatApiResponse<any>> {
  try {
    const token = getAccessToken();
    
    if (!token) {
      return {
        data: null,
        error: 'Authentication required to fetch ad details',
        status: 401,
      };
    }

    const response = await fetch(`http://127.0.0.1:8000/api/ads/${adId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: responseData.detail || responseData.message || 'Failed to fetch ad details',
        status: response.status,
      };
    }

    // Extract the actual ad data from the response
    const adDetails = responseData.data || responseData;

    return {
      data: adDetails,
      error: null,
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch ad details',
      status: 500,
    };
  }
}

/**
 * Create or get existing transaction for a bid and navigate to chat
 * This function is used when a buyer wants to chat with a seller from the My Bids page
 * Enhanced to include comprehensive auction information from the Nordic Loop platform
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

    // Fetch comprehensive ad details from Nordic Loop platform
    const adDetailsResponse = await fetchAdDetails(bidData.ad_id);

    if (adDetailsResponse.error) {
      // Continue with transaction creation but without auction_info
      // This ensures the chat functionality doesn't break if ad details can't be fetched
    }

    let auctionInfo: AuctionInfo | undefined;
    
    if (adDetailsResponse.data) {
      // Map the ad details to auction_info format
      auctionInfo = mapAdDetailsToAuctionInfo(adDetailsResponse.data);
    }

    // Create new transaction with auction information
    const createRequest: CreateTransactionRequest = {
      transaction_id: transactionId,
      auction_name: bidData.ad_title,
      seller_id: bidData.seller_id,
      seller_company: bidData.seller_company,
      transaction_status: bidData.status === 'paid' ? 'Complete' : 'Pending',
      auction_info: auctionInfo, // Include the comprehensive auction information
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

