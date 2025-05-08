/**
 * Company service for handling company registration and management
 */
import { apiPost } from './api';
import { CompanyRegistration, Company } from '@/types/auth';

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
  contact_name: string;
  contact_position: string;
  contact_email: string;
  registration_date: string;
  status: string;
}

/**
 * Register a new company
 * @param companyData The company registration data
 * @returns The registration response
 */
export async function registerCompany(companyData: CompanyRegistration) {
  try {
    const response = await apiPost<CompanyRegistrationResponse>('/company/companies/create/', companyData);
    
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
