import { apiGet, apiPost, apiPut, apiDelete } from './api';

// Import or recreate ApiResponse type
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

// Types
export interface Address {
  id: number;
  type: 'shipping' | 'billing' | 'business';
  type_display: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
  country: string;
  is_verified: boolean;
  is_primary: boolean;
  contact_name: string;
  contact_phone: string;
  created_at?: string;
  updated_at?: string;
}

export interface AddressCreateRequest {
  type: 'shipping' | 'billing' | 'business';
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
  country: string;
  is_primary: boolean;
  contact_name: string;
  contact_phone: string;
}

export interface AddressUpdateRequest extends AddressCreateRequest {
  id: number;
}

export interface AddressCreateResponse {
  message: string;
  address: Address;
}

export interface AddressUpdateResponse {
  message: string;
  address: Address;
}

export interface AddressDeleteResponse {
  message: string;
}

// API functions
export async function getUserAddresses(): Promise<ApiResponse<Address[]>> {
  return await apiGet<Address[]>('/ads/user/addresses/', true);
}

export async function getUserAddressById(id: string | number): Promise<ApiResponse<Address>> {
  return await apiGet<Address>(`/ads/user/addresses/${id}/`, true);
}

export async function createUserAddress(
  addressData: AddressCreateRequest
): Promise<ApiResponse<AddressCreateResponse>> {
  return await apiPost<AddressCreateResponse>('/ads/user/addresses/', addressData, true);
}

export async function updateUserAddress(
  id: number,
  addressData: AddressCreateRequest
): Promise<ApiResponse<AddressUpdateResponse>> {
  return await apiPut<AddressUpdateResponse>(`/ads/user/addresses/${id}/`, addressData, true);
}

export async function deleteUserAddress(
  id: number
): Promise<ApiResponse<AddressDeleteResponse>> {
  return await apiDelete<AddressDeleteResponse>(`/ads/user/addresses/${id}/`, true);
}

export async function setPrimaryAddress(
  id: number
): Promise<ApiResponse<AddressUpdateResponse>> {
  return await apiPut<AddressUpdateResponse>(
    `/ads/user/addresses/${id}/set-primary/`, 
    {}, 
    true
  );
}
