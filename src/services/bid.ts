/**
 * Bid service for handling bid creation and management
 */
import { apiPost, apiGet } from './api';

/**
 * Interface for bid creation data
 */
export interface BidCreateData {
  ad_id: number;
  amount: number;
  volume?: number;
}

/**
 * Interface for bid creation response
 */
export interface BidCreateResponse {
  id: number;
  user: string;
  ad: number;
  amount: string;
  timestamp: string;
}

/**
 * Interface for bid error response
 */
export interface BidErrorResponse {
  error: string;
}

/**
 * Create a new bid
 * @param bidData The bid data
 * @returns The API response with the created bid
 */
export async function createBid(bidData: BidCreateData) {
  try {
    // Create bid requires authentication
    const response = await apiPost<BidCreateResponse | BidErrorResponse>('/bids/create/', bidData, true);
    
    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred during bid creation',
      status: 500
    };
  }
}

/**
 * Get all bids for a specific auction
 * @param auctionId The auction ID
 * @returns The API response with the bids
 */
export async function getAuctionBids(auctionId: number) {
  try {
    // Get bids requires authentication
    const response = await apiGet<BidCreateResponse[]>(`/bids/auction/${auctionId}/`, true);
    
    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching bids',
      status: 500
    };
  }
}

/**
 * Get all bids placed by the current user
 * @returns The API response with the user's bids
 */
export async function getUserBids() {
  try {
    // Get user bids requires authentication
    const response = await apiGet<BidCreateResponse[]>('/bids/user/', true);
    
    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching your bids',
      status: 500
    };
  }
}
