/**
 * Company service for handling company registration and management
 */
import { apiPost, apiGet } from './api';
import { CompanyRegistration } from '@/types/auth';

/**
 * Interface for company registration response
 */
interface CompanyRegistrationResponse {
  id: number;
  official_name: string;
  vat_number: string;
  email: string;
  sector: string;
  country: string;
  website: string;
  primary_first_name: string;
  primary_last_name: string;
  primary_email: string;
  primary_position: string;
  secondary_first_name?: string;
  secondary_last_name?: string;
  secondary_email?: string;
  secondary_position?: string;
  registration_date: string;
  status: string;
}

/**
 * Interface for admin company list response
 */
interface AdminCompanyListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminCompany[];
  page_size: number;
  total_pages: number;
  current_page: number;
}

/**
 * Interface for admin company data
 */
interface AdminCompany {
  id: string;
  companyName: string;
  vatNumber: string;
  country: string;
  sector: string;
  companyEmail: string;
  companyPhone?: string;
  status: 'pending' | 'approved' | 'rejected';
  registrationDate: string;
  contacts: {
    name: string;
    email: string;
    position: string;
  }[];
}

/**
 * Interface for admin company query parameters
 */
interface AdminCompanyParams {
  search?: string;
  status?: 'all' | 'pending' | 'approved' | 'rejected';
  page?: number;
  page_size?: number;
}

/**
 * Register a new company
 * @param companyData The company registration data
 * @returns The registration response
 */
export async function registerCompany(companyData: CompanyRegistration) {
  try {
    const response = await apiPost<CompanyRegistrationResponse>('/company/create/', companyData);

    return response;
  } catch (error) {
    // Use a logger instead of console to avoid ESLint warnings
    // console.error('Company registration error:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred during company registration',
      status: 500
    };
  }
}

/**
 * Get companies list for admin with filtering and pagination
 * @param params Query parameters for filtering and pagination
 * @returns The companies list response
 */
export async function getAdminCompanies(params: AdminCompanyParams = {}) {
  try {
    // Build query string
    const queryParams = new URLSearchParams();
    
    if (params.search) {
      queryParams.append('search', params.search);
    }
    
    if (params.status && params.status !== 'all') {
      queryParams.append('status', params.status);
    }
    
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    
    if (params.page_size) {
      queryParams.append('page_size', params.page_size.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = `/company/admin/companies/${queryString ? `?${queryString}` : ''}`;

    const response = await apiGet<AdminCompanyListResponse>(endpoint, true);

    // Transform the response to match frontend expectations if needed
    if (response.data?.results) {
      response.data.results = response.data.results.map(company => ({
        ...company,
        // Map any backend field names to frontend field names if needed
        // The user specified not to change models, so we should exclude fields not in our model
      }));
    }

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching companies',
      status: 500
    };
  }
}

/**
 * Get a specific company by ID for admin
 * @param companyId The company ID
 * @returns The company data
 */
export async function getAdminCompany(companyId: string) {
  try {
    const response = await apiGet<AdminCompany>(`/company/admin/companies/${companyId}/`, true);

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching company details',
      status: 500
    };
  }
}

/**
 * Generate a signup token for a user
 * @param email The user's email
 * @returns A base64 encoded token
 */
export function generateSignupToken(email: string): string {
  const payload = {
    email,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days expiration
  };

  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// Export types for use in components
export type { AdminCompany, AdminCompanyListResponse, AdminCompanyParams };
