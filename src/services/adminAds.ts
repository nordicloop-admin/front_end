/**
 * Admin Ads Service for managing ad approval and suspension
 */
import { apiPost } from './api';

interface AdminAdResponse {
  success: boolean;
  message: string;
  ad: {
    id: number;
    title: string | null;
    status: string;
    suspended_by_admin: boolean;
    is_active: boolean;
    is_complete: boolean;
    [key: string]: any;
  };
}

// Not used but kept for reference
// interface AdminAdErrorResponse {
//   error: string;
// }

/**
 * AdminAdsService Class for managing ad approval and suspension by administrators
 */
export class AdminAdsService {
  /**
   * Approve an ad that was previously suspended
   * @param adId The ID of the ad to approve
   * @returns The API response
   */
  async approveAd(adId: number) {
    try {
      const response = await apiPost<AdminAdResponse>(
        `/ads/admin/ads/${adId}/approve/`, 
        {}, 
        true
      );

      if (response.error) {
        return {
          success: false,
          error: response.error,
          data: null
        };
      }

      return {
        success: true,
        data: response.data,
        message: response.data?.message || 'Ad approved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to approve ad',
        data: null
      };
    }
  }

  /**
   * Suspend an ad that violates regulations
   * @param adId The ID of the ad to suspend
   * @returns The API response
   */
  async suspendAd(adId: number) {
    try {
      const response = await apiPost<AdminAdResponse>(
        `/ads/admin/ads/${adId}/suspend/`, 
        {}, 
        true
      );

      if (response.error) {
        return {
          success: false,
          error: response.error,
          data: null
        };
      }

      return {
        success: true,
        data: response.data,
        message: response.data?.message || 'Ad suspended successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to suspend ad',
        data: null
      };
    }
  }
}

// Create a singleton instance
export const adminAdsService = new AdminAdsService();
