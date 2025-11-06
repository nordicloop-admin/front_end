// Authentication and registration related types

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface CompanyRegistration {
  // Backend API fields - new format
  official_name: string;
  vat_number: string;
  email?: string;
  website?: string;
  sector: string;
  country: string;

  // Primary contact person
  primary_first_name: string;
  primary_last_name: string;
  primary_email: string;
  primary_position: string;

  // Secondary contact person (optional)
  secondary_first_name?: string;
  secondary_last_name?: string;
  secondary_email?: string;
  secondary_position?: string;

  status?: ReviewStatus;

  // Legacy fields for backward compatibility
  companyName?: string;
  vatNumber?: string;
  contactFirstName?: string;
  contactLastName?: string;
  contactEmail?: string;
  contactPosition?: string;
  contact2FirstName?: string;
  contact2LastName?: string;
  contact2Email?: string;
  contact2Position?: string;
  reviewStatus?: ReviewStatus;
  createdAt?: string;
}

export interface UserSignUp {
  email: string;
  password: string;
  companyId: string;
}

export interface User {
  id: number;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  position?: string;
  companyId?: number | null;
  companyName?: string | null;
  role?: string;
  contactType?: string;
  canPlaceAds?: boolean;
  canPlaceBids?: boolean;
  createdAt?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface Company {
  id: number;
  official_name: string;
  vat_number: string;
  email?: string;
  website?: string;
  country: string;
  sector: string;
  contact_name: string;
  contact_position: string;
  contact_email: string;
  registration_date: string;
  status: ReviewStatus;
}

export const SECTOR_CHOICES = [
  { value: 'manufacturing', label: 'Manufacturing & Production' },
  { value: 'construction', label: 'Construction & Demolition' },
  { value: 'retail', label: 'Wholesale & Retail' },
  { value: 'packaging', label: 'Packaging & Printing' },
  { value: 'recycling', label: 'Recycling & Waste Management' },
  { value: 'energy', label: 'Energy & Utilities' },
  { value: 'broker', label: 'Broker' },
];

export const COUNTRY_CHOICES = [
  { value: 'Sweden', label: 'Sweden' },
];
