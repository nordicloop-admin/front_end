/**
 * ADS (Ad Creation) service for handling 8-step ad creation workflow
 * Based on ADS_FRONTEND_INTEGRATION_GUIDE.md
 */
import { apiPost, apiPut, apiGet, apiPutFormData, apiPatch, apiDelete } from './api';

// Interfaces based on the API specification
export interface Step1Data {
  category_id: number;
  subcategory_id: number;
  specific_material: string;
  packaging: string;
  material_frequency: string;
}

export interface Step2Data {
  specification_id?: number | null;
  additional_specifications?: string;
}

export interface Step3Data {
  origin: string;
}

export interface Step4Data {
  contamination: string;
  additives: string;
  storage_conditions: string;
}

export interface Step5Data {
  processing_methods: string[];
}

export interface Step6Data {
  location_data: {
    country: string;
    state_province?: string;
    city: string;
    address_line?: string;
    postal_code?: string;
  };
  pickup_available: boolean;
  delivery_options: string[];
}

export interface Step7Data {
  available_quantity: number;
  unit_of_measurement: string;
  minimum_order_quantity: number;
  starting_bid_price: number;
  currency: string;
  auction_duration: number;
  reserve_price?: number;
  custom_auction_duration?: number;
}

export interface Step8Data {
  title: string;
  description: string;
  keywords?: string;
}

export interface AdCreationResponse {
  message: string;
  step: number;
  data: {
    id: number;
    current_step: number;
    is_complete: boolean;
    [key: string]: any;
  };
  step_completion_status: Record<string, boolean>;
  next_incomplete_step: number | null;
  is_complete: boolean;
}

export interface AdErrorResponse {
  error: string;
  details?: Record<string, string[]>;
}

/**
 * ADS Service Class for managing ad creation workflow
 */
export class AdCreationService {
  private currentAdId: number | null = null;

  /**
   * Step 1: Create new ad with material type information
   */
  async createAdStep1(data: Step1Data) {
    try {
      const response = await apiPost<AdCreationResponse | AdErrorResponse>('/ads/step/1/', data, true);

      if (response.error) {
        return {
          success: false,
          error: response.error,
          details: (response.data as AdErrorResponse)?.details
        };
      }

      const result = response.data as AdCreationResponse;
      this.currentAdId = result.data.id;

      return {
        success: true,
        data: result,
        adId: this.currentAdId
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create ad',
        details: null
      };
    }
  }

  /**
   * Step 2-8: Update existing ad with step data
   */
  async updateAdStep(step: number, data: Step2Data | Step3Data | Step4Data | Step5Data | Step6Data | Step7Data | Step8Data) {
    if (!this.currentAdId) {
      return {
        success: false,
        error: 'No active ad. Please complete Step 1 first.',
        details: null
      };
    }

    try {
      const response = await apiPut<AdCreationResponse | AdErrorResponse>(`/ads/${this.currentAdId}/step/${step}/`, data, true);

      if (response.error) {
        return {
          success: false,
          error: response.error,
          details: (response.data as AdErrorResponse)?.details
        };
      }

      return {
        success: true,
        data: response.data as AdCreationResponse
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : `Failed to update step ${step}`,
        details: null
      };
    }
  }

  /**
   * Get step data for a specific step
   */
  async getStepData(step: number) {
    if (!this.currentAdId) {
      return {
        success: false,
        error: 'No active ad selected.',
        data: null
      };
    }

    try {
      const response = await apiGet<AdCreationResponse>(`/ads/${this.currentAdId}/step/${step}/`, true);

      if (response.error) {
        return {
          success: false,
          error: response.error,
          data: null
        };
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : `Failed to fetch step ${step} data`,
        data: null
      };
    }
  }

  /**
   * Validate step data (optional endpoint)
   */
  async validateStepData(step: number, data: any) {
    try {
      const response = await apiPost<{ valid: boolean; message: string }>(`/ads/validate/step/${step}/`, data, true);

      return {
        success: !response.error,
        valid: response.data?.valid || false,
        message: response.data?.message || response.error || 'Validation failed'
      };
    } catch (error) {
      return {
        success: false,
        valid: false,
        message: error instanceof Error ? error.message : 'Validation error'
      };
    }
  }

  /**
   * Get complete ad details
   */
  async getAdDetails(adId?: number) {
    const id = adId || this.currentAdId;
    
    if (!id) {
      return {
        success: false,
        error: 'No ad ID provided',
        data: null
      };
    }

    try {
      const response = await apiGet<any>(`/ads/${id}/`, true);

      return {
        success: !response.error,
        data: response.data,
        error: response.error
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch ad details',
        data: null
      };
    }
  }

  /**
   * Delete ad
   */
  async deleteAd(adId?: number) {
    const id = adId || this.currentAdId;
    
    if (!id) {
      return {
        success: false,
        error: 'No ad ID provided'
      };
    }

    try {
      // Use DELETE method with /ads/{id}/ endpoint as per API specification
      // API now returns JSON response with message and deleted_ad details
      const response = await apiDelete<{
        message: string;
        deleted_ad: {
          id: number;
          title: string;
        };
      }>(`/ads/${id}/`, true);

      if (response.error) {
        return {
          success: false,
          error: response.error
        };
      }

      // Clear current ad ID if we deleted the current ad
      if (id === this.currentAdId) {
        this.currentAdId = null;
      }

      // Success: Return the response data
      return {
        success: true,
        message: response.data?.message || 'Ad deleted successfully',
        deletedAd: response.data?.deleted_ad
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete ad'
      };
    }
  }

  /**
   * Get user's ads
   */
  async getUserAds(complete?: boolean) {
    try {
      const endpoint = complete !== undefined ? `/ads/user/?complete=${complete}` : '/ads/user/';
      const response = await apiGet<any>(endpoint, true);

      return {
        success: !response.error,
        data: response.data,
        error: response.error
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user ads',
        data: null
      };
    }
  }

  /**
   * Set current ad ID (for editing existing ads)
   */
  setCurrentAdId(adId: number) {
    this.currentAdId = adId;
  }

  /**
   * Get current ad ID
   */
  getCurrentAdId() {
    return this.currentAdId;
  }

  /**
   * Clear current ad ID
   */
  clearCurrentAdId() {
    this.currentAdId = null;
  }

  /**
   * Step 8: Update ad with files (images) using FormData
   */
  async updateAdStep8WithFiles(title: string, description: string, keywords: string, images: File[]) {
    if (!this.currentAdId) {
      return {
        success: false,
        error: 'No active ad. Please complete Step 1 first.',
        details: null
      };
    }

    try {
      // Create FormData object
      const formData = new FormData();
      
      // Add text fields with proper trimming
      const trimmedTitle = title.trim();
      const trimmedDescription = description.trim();
      const trimmedKeywords = keywords.trim();
      
      formData.append('title', trimmedTitle);
      formData.append('description', trimmedDescription);
      formData.append('keywords', trimmedKeywords);
      
      // Add image files - backend expects 'material_image' field
      if (images && images.length > 0) {
        // Send only the first image as 'material_image' - backend expects single image
        formData.append('material_image', images[0]);
      }

      const response = await apiPutFormData<AdCreationResponse | AdErrorResponse>(`/ads/${this.currentAdId}/step/8/`, formData, true);

      if (response.error) {
        return {
          success: false,
          error: response.error,
          details: (response.data as AdErrorResponse)?.details
        };
      }

      return {
        success: true,
        data: response.data as AdCreationResponse
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update step 8',
        details: null
      };
    }
  }

  async updateAdStep8WithImage(adId: number, title: string, description: string, keywords: string, imageFile?: File) {
    try {
      // Create FormData object - only for step 8 fields
      const formData = new FormData();
      
      // Add ONLY step 8 fields explicitly with proper trimming
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('keywords', keywords.trim());
      
      if (imageFile) {
        formData.append('material_image', imageFile);
      }

      const response = await apiPutFormData<AdCreationResponse | AdErrorResponse>(`/ads/${adId}/step/8/`, formData, true);
      
      if (response.error) {
        return {
          success: false,
          error: response.error,
          details: (response.data as AdErrorResponse)?.details
        };
      }

      return {
        success: true,
        data: response.data as AdCreationResponse
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update step 8 with image',
        details: null
      };
    }
  }
}

// Create a singleton instance
export const adCreationService = new AdCreationService();

// Export commonly used constants from the FRONTEND_CHOICE_VALUES_REFERENCE.md
export const PACKAGING_OPTIONS = [
  { value: 'baled', label: 'Baled' },
  { value: 'loose', label: 'Loose' },
  { value: 'big_bag', label: 'Big-bag' },
  { value: 'octabin', label: 'Octabin' },
  { value: 'roles', label: 'Roles' },
  { value: 'container', label: 'Container' },
  { value: 'other', label: 'Other' }
];

export const MATERIAL_FREQUENCY_OPTIONS = [
  { value: 'one_time', label: 'One-time' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi_weekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' }
];

export const ORIGIN_OPTIONS = [
  { value: 'post_industrial', label: 'Post-industrial' },
  { value: 'post_consumer', label: 'Post-consumer' },
  { value: 'mix', label: 'Mix' }
];

export const CONTAMINATION_OPTIONS = [
  { value: 'clean', label: 'Clean' },
  { value: 'slightly_contaminated', label: 'Slightly Contaminated' },
  { value: 'heavily_contaminated', label: 'Heavily Contaminated' }
];

export const ADDITIVES_OPTIONS = [
  { value: 'uv_stabilizer', label: 'UV Stabilizer' },
  { value: 'antioxidant', label: 'Antioxidant' },
  { value: 'flame_retardants', label: 'Flame retardants' },
  { value: 'chlorides', label: 'Chlorides' },
  { value: 'no_additives', label: 'No additives' }
];

export const STORAGE_CONDITIONS_OPTIONS = [
  { value: 'climate_controlled', label: 'Climate Controlled' },
  { value: 'protected_outdoor', label: 'Protected Outdoor' },
  { value: 'unprotected_outdoor', label: 'Unprotected Outdoor' }
];

export const PROCESSING_METHODS_OPTIONS = [
  { value: 'blow_moulding', label: 'Blow moulding' },
  { value: 'injection_moulding', label: 'Injection moulding' },
  { value: 'extrusion', label: 'Extrusion' },
  { value: 'calendering', label: 'Calendering' },
  { value: 'rotational_moulding', label: 'Rotational moulding' },
  { value: 'sintering', label: 'Sintering' },
  { value: 'thermoforming', label: 'Thermoforming' }
];

export const DELIVERY_OPTIONS = [
  { value: 'pickup_only', label: 'Pickup Only' },
  { value: 'local_delivery', label: 'Local Delivery' },
  { value: 'national_shipping', label: 'National Shipping' },
  { value: 'international_shipping', label: 'International Shipping' },
  { value: 'freight_forwarding', label: 'Freight Forwarding' }
];

export const UNIT_OF_MEASUREMENT_OPTIONS = [
  { value: 'kg', label: 'Kilogram' },
  { value: 'g', label: 'Gram' },
  { value: 'lb', label: 'Pound' },
  { value: 'tons', label: 'Tons' }
];

export const CURRENCY_OPTIONS = [
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'SEK', label: 'Swedish Krona (kr)' },
  { value: 'GBP', label: 'British Pound (£)' }
];

export const AUCTION_DURATION_OPTIONS = [
  { value: 1, label: '1 day' },
  { value: 3, label: '3 days' },
  { value: 7, label: '7 days' },
  { value: 14, label: '14 days' },
  { value: 30, label: '30 days' }
];

// Constants for exact values (matching FRONTEND_CHOICE_VALUES_REFERENCE.md)
export const AD_CHOICES = {
  PACKAGING: {
    BALED: 'baled',
    LOOSE: 'loose',
    BIG_BAG: 'big_bag',
    OCTABIN: 'octabin',
    ROLES: 'roles',
    CONTAINER: 'container',
    OTHER: 'other'
  },
  
  MATERIAL_FREQUENCY: {
    ONE_TIME: 'one_time',
    WEEKLY: 'weekly',
    BI_WEEKLY: 'bi_weekly',
    MONTHLY: 'monthly',
    QUARTERLY: 'quarterly',
    YEARLY: 'yearly'
  },
  
  ORIGIN: {
    POST_INDUSTRIAL: 'post_industrial',
    POST_CONSUMER: 'post_consumer',
    MIX: 'mix'
  },
  
  CONTAMINATION: {
    CLEAN: 'clean',
    SLIGHTLY_CONTAMINATED: 'slightly_contaminated',
    HEAVILY_CONTAMINATED: 'heavily_contaminated'
  },
  
  ADDITIVES: {
    UV_STABILIZER: 'uv_stabilizer',
    ANTIOXIDANT: 'antioxidant',
    FLAME_RETARDANTS: 'flame_retardants',
    CHLORIDES: 'chlorides',
    NO_ADDITIVES: 'no_additives'
  },
  
  STORAGE_CONDITIONS: {
    CLIMATE_CONTROLLED: 'climate_controlled',
    PROTECTED_OUTDOOR: 'protected_outdoor',
    UNPROTECTED_OUTDOOR: 'unprotected_outdoor'
  },
  
  PROCESSING_METHODS: {
    BLOW_MOULDING: 'blow_moulding',
    INJECTION_MOULDING: 'injection_moulding',
    EXTRUSION: 'extrusion',
    CALENDERING: 'calendering',
    ROTATIONAL_MOULDING: 'rotational_moulding',
    SINTERING: 'sintering',
    THERMOFORMING: 'thermoforming'
  },
  
  DELIVERY_OPTIONS: {
    PICKUP_ONLY: 'pickup_only',
    LOCAL_DELIVERY: 'local_delivery',
    NATIONAL_SHIPPING: 'national_shipping',
    INTERNATIONAL_SHIPPING: 'international_shipping',
    FREIGHT_FORWARDING: 'freight_forwarding'
  },
  
  UNIT_OF_MEASUREMENT: {
    KG: 'kg',
    G: 'g',
    LB: 'lb',
    TONS: 'tons'
  },
  
  CURRENCY: {
    EUR: 'EUR',
    USD: 'USD',
    SEK: 'SEK',
    GBP: 'GBP'
  },
  
  AUCTION_DURATION: {
    ONE_DAY: 1,
    THREE_DAYS: 3,
    SEVEN_DAYS: 7,
    FOURTEEN_DAYS: 14,
    THIRTY_DAYS: 30
  }
};

// Ad Update Service Class (according to AD_UPDATE_FUNCTIONALITY_GUIDE.md)
export class AdUpdateService {
  
  /**
   * Complete Ad Update (PUT) - Replace entire ad with provided data
   * @param adId The ID of the ad to update
   * @param data Complete ad data
   * @returns The API response
   */
  async updateCompleteAd(adId: number, data: any) {
    try {
      const response = await apiPut<AdCreationResponse | AdErrorResponse>(`/ads/${adId}/`, data, true);
      
      if (response.error) {
        return {
          success: false,
          error: response.error,
          details: (response.data as AdErrorResponse)?.details
        };
      }

      return {
        success: true,
        data: response.data as AdCreationResponse
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update ad',
        details: null
      };
    }
  }
  
  /**
   * Partial Ad Update (PATCH) - Update only specific fields
   * @param adId The ID of the ad to update
   * @param data Partial ad data - only fields to update
   * @returns The API response
   */
  async updatePartialAd(adId: number, data: any) {
    try {
      const response = await apiPatch<AdCreationResponse | AdErrorResponse>(`/ads/${adId}/`, data, true);
      
      if (response.error) {
        return {
          success: false,
          error: response.error,
          details: (response.data as AdErrorResponse)?.details
        };
      }

      return {
        success: true,
        data: response.data as AdCreationResponse
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update ad',
        details: null
      };
    }
  }
  
  /**
   * Step-by-Step Update - Update specific step
   * @param adId The ID of the ad to update
   * @param step The step number (1-8)
   * @param data Step-specific data
   * @returns The API response
   */
  async updateAdStep(adId: number, step: number, data: any) {
    try {
      const response = await apiPut<AdCreationResponse | AdErrorResponse>(`/ads/${adId}/step/${step}/`, data, true);
      
      if (response.error) {
        return {
          success: false,
          error: response.error,
          details: (response.data as AdErrorResponse)?.details
        };
      }

      return {
        success: true,
        data: response.data as AdCreationResponse
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : `Failed to update step ${step}`,
        details: null
      };
    }
  }
  
  /**
   * Step 8 Update with Image Upload (FormData)
   * @param adId The ID of the ad to update
   * @param title Ad title
   * @param description Ad description
   * @param keywords Ad keywords
   * @param imageFile Optional image file
   * @returns The API response
   */
  async updateAdStep8WithImage(adId: number, title: string, description: string, keywords: string, imageFile?: File) {
    try {
      // Create FormData object - only for step 8 fields
      const formData = new FormData();
      
      // Add ONLY step 8 fields explicitly with proper trimming
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('keywords', keywords.trim());
      
      if (imageFile) {
        formData.append('material_image', imageFile);
      }

      const response = await apiPutFormData<AdCreationResponse | AdErrorResponse>(`/ads/${adId}/step/8/`, formData, true);
      
      if (response.error) {
        return {
          success: false,
          error: response.error,
          details: (response.data as AdErrorResponse)?.details
        };
      }

      return {
        success: true,
        data: response.data as AdCreationResponse
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update step 8 with image',
        details: null
      };
    }
  }
  
  /**
   * Update Title & Description Only (PATCH)
   * @param adId The ID of the ad to update
   * @param title New title
   * @param description New description
   * @returns The API response
   */
  async updateTitleDescription(adId: number, title: string, description: string) {
    return this.updatePartialAd(adId, { title, description });
  }
  
  /**
   * Update Pricing Information (PATCH)
   * @param adId The ID of the ad to update
   * @param startingBidPrice New starting bid price
   * @param reservePrice New reserve price (optional)
   * @param currency Currency (optional)
   * @returns The API response
   */
  async updatePricing(adId: number, startingBidPrice: number, reservePrice?: number, currency?: string) {
    const data: any = { starting_bid_price: startingBidPrice };
    if (reservePrice !== undefined) data.reserve_price = reservePrice;
    if (currency) data.currency = currency;
    
    return this.updatePartialAd(adId, data);
  }
  
  /**
   * Update Location Information (PATCH)
   * @param adId The ID of the ad to update
   * @param locationData Location data object
   * @returns The API response
   */
  async updateLocation(adId: number, locationData: any) {
    return this.updatePartialAd(adId, { location_data: locationData });
  }
  
  /**
   * Update Processing Methods (PATCH)
   * @param adId The ID of the ad to update
   * @param processingMethods Array of processing method strings
   * @returns The API response
   */
  async updateProcessingMethods(adId: number, processingMethods: string[]) {
    return this.updatePartialAd(adId, { processing_methods: processingMethods });
  }
  
  /**
   * Update Delivery Options (PATCH)
   * @param adId The ID of the ad to update
   * @param deliveryOptions Array of delivery option strings
   * @param pickupAvailable Whether pickup is available
   * @returns The API response
   */
  async updateDeliveryOptions(adId: number, deliveryOptions: string[], pickupAvailable: boolean) {
    return this.updatePartialAd(adId, { 
      delivery_options: deliveryOptions,
      pickup_available: pickupAvailable
    });
  }
}

// Create a singleton instance for ad updates
export const adUpdateService = new AdUpdateService(); 