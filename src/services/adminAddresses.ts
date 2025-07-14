import { apiPatch, ApiResponse } from './api';

// Response type for address verification
export interface AddressVerifyResponse {
  success: boolean;
  message?: string;
}

/**
 * Verify or unverify an address
 * @param id - Address ID
 * @param isVerified - Verification status to set
 * @returns Promise with the response
 */
export async function verifyAddress(
  id: number,
  isVerified: boolean
): Promise<ApiResponse<AddressVerifyResponse>> {
  return await apiPatch<AddressVerifyResponse>(
    `/ads/admin/addresses/${id}/verify/`,
    { isVerified },
    true
  );
}
