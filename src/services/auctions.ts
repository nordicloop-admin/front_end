/**
 * Auctions service for handling admin auction management
 */
import { apiGet, apiPut } from './api';

/**
 * Interface for admin auction list response
 */
interface AdminAuctionListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminAuction[];
  page_size: number;
  total_pages: number;
  current_page: number;
}

/**
 * Interface for admin auction data
 */
interface AdminAuction {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  basePrice: number;
  highestBid: number;
  status: 'active' | 'pending' | 'closed' | 'suspended';
  volume: string;
  seller: string;
  countryOfOrigin: string;
  createdAt: string;
  image: string;
  description?: string;
  company?: string;
  location?: string;
  endDate?: string;
  suspended_by_admin?: boolean;

  // Currency and unit fields for proper formatting
  currency?: string;
  currency_display?: string;
  unit_of_measurement?: string;
  unit_of_measurement_display?: string;

  // Additional detailed fields from AdminAuctionDetailSerializer
  specificMaterial?: string;
  reservePrice?: number;
  auctionEndDate?: string;
  totalBids?: number;
  minimumOrderQuantity?: number;

  // Material properties
  packaging?: string;
  materialFrequency?: string;
  origin?: string;
  contamination?: string;
  additives?: string;
  storageConditions?: string;
  processingMethods?: string[];

  // Location and delivery
  pickupAvailable?: boolean;
  deliveryOptions?: string[];

  // Auction information
  auctionDuration?: string;
  auctionStatus?: string;

  // System information
  isComplete?: boolean;
  currentStep?: number;
  keywords?: string;
}

/**
 * Interface for admin auction query parameters
 */
interface AdminAuctionParams {
  search?: string;
  status?: string;
  page?: number;
  page_size?: number;
}

/**
 * Get auctions list for admin with filtering and pagination
 * @param params Query parameters for filtering and pagination
 * @returns The auctions list response
 */
export async function getAdminAuctions(params: AdminAuctionParams = {}) {
  try {
    // Build query string
    const queryParams = new URLSearchParams();
    
    if (params.search) {
      queryParams.append('search', params.search);
    }
    
    if (params.status) {
      queryParams.append('status', params.status);
    }
    
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    
    if (params.page_size) {
      queryParams.append('page_size', params.page_size.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = `/ads/admin/auctions/${queryString ? `?${queryString}` : ''}`;

    const response = await apiGet<AdminAuctionListResponse>(endpoint, true);

    // Transform the response to match frontend expectations if needed
    if (response.data?.results) {
      response.data.results = response.data.results.map(auction => ({
        ...auction,
        // Map any backend field names to frontend field names if needed
        // The user specified not to change models, so we should exclude fields not in our model
      }));
    }

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching auctions',
      status: 500
    };
  }
}

/**
 * Get a specific auction by ID for admin
 * @param auctionId The auction ID
 * @returns The auction data
 */
export async function getAdminAuction(auctionId: string) {
  try {
    // Use the detailed ad endpoint that returns comprehensive data
    const response = await apiGet<any>(`/ads/${auctionId}/`, true);

    if (response.data?.data) {
      // Transform the comprehensive backend data to match AdminAuction interface
      const backendData = response.data.data;
      const transformedData: AdminAuction = {
        id: backendData.id.toString(),
        name: backendData.title || `${backendData.category_name} - ${backendData.subcategory_name}`,
        category: backendData.category_name,
        subcategory: backendData.subcategory_name,
        basePrice: parseFloat(backendData.starting_bid_price || '0'),
        highestBid: 0, // Will be updated if we fetch bids
        status: backendData.suspended_by_admin ? 'suspended' : (backendData.is_active ? 'active' : 'pending'),
        volume: backendData.available_quantity || '0',
        seller: backendData.posted_by,
        countryOfOrigin: backendData.location_summary || 'Unknown',
        createdAt: backendData.created_at,
        image: backendData.material_image || '',
        description: backendData.description,
        company: backendData.company_name,
        location: backendData.location_summary,
        endDate: backendData.auction_end_date,
        suspended_by_admin: backendData.suspended_by_admin,

        // Currency and unit fields
        currency: backendData.currency,
        currency_display: backendData.currency_display,
        unit_of_measurement: backendData.unit_of_measurement,
        unit_of_measurement_display: backendData.unit_of_measurement_display,

        // Additional detailed fields
        specificMaterial: backendData.specific_material,
        reservePrice: backendData.reserve_price ? parseFloat(backendData.reserve_price) : undefined,
        auctionEndDate: backendData.auction_end_date,
        minimumOrderQuantity: backendData.minimum_order_quantity ? parseFloat(backendData.minimum_order_quantity) : undefined,

        // Material properties
        packaging: backendData.packaging_display,
        materialFrequency: backendData.material_frequency_display,
        origin: backendData.origin_display,
        contamination: backendData.contamination_display,
        additives: backendData.additives_display,
        storageConditions: backendData.storage_conditions_display,
        processingMethods: backendData.processing_methods_display || [],

        // Location and delivery
        pickupAvailable: backendData.pickup_available,
        deliveryOptions: backendData.delivery_options_display || [],

        // Auction information
        auctionDuration: backendData.auction_duration_display,
        auctionStatus: backendData.auction_status,

        // System information
        isComplete: backendData.is_complete,
        currentStep: backendData.current_step,
        keywords: backendData.keywords
      };

      return {
        data: transformedData,
        error: null,
        status: 200
      };
    }

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching auction details',
      status: 500
    };
  }
}

/**
 * Update the status of an auction
 * @param auctionId The auction ID to update
 * @param newStatus The new status for the auction
 * @returns Response with updated auction or error
 */
export async function updateAuctionStatus(auctionId: string, newStatus: string) {
  try {
    const response = await apiPut<AdminAuction>(
      `/ads/admin/auctions/${auctionId}/status/`,
      { status: newStatus },
      true
    );

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while updating auction status',
      status: 500
    };
  }
}

// Export types for use in components
export type { AdminAuction, AdminAuctionListResponse, AdminAuctionParams }; 