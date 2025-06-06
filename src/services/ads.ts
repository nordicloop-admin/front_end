/**
 * ADS (Ad Creation) service for handling 8-step ad creation workflow
 * Based on ADS_FRONTEND_INTEGRATION_GUIDE.md
 */
import { apiPost, apiPut, apiGet, apiPutFormData } from './api';

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
      const response = await apiGet<{ message: string }>(`/ads/${id}/`, true);

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

      return {
        success: true,
        message: response.data?.message || 'Ad deleted successfully'
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
      
      // Add text fields
      formData.append('title', title);
      formData.append('description', description);
      formData.append('keywords', keywords);
      
      // Add image files - backend expects 'material_image' field
      if (images && images.length > 0) {
        // For now, send the first image as 'material_image'
        formData.append('material_image', images[0]);
        
        // If there are multiple images, append them with indexed names
        images.forEach((image, index) => {
          if (index > 0) { // Skip first image as it's already added as 'material_image'
            formData.append(`additional_image_${index}`, image);
          }
        });
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