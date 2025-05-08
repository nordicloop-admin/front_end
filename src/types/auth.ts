// Authentication and registration related types

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface CompanyRegistration {
  official_name: string;
  vat_number: string;
  email?: string;
  website?: string;
  country: string;
  sector: string;
  contact_name: string;
  contact_position: string;
  contact_email: string;
  status: ReviewStatus;
}

export interface UserSignUp {
  email: string;
  password: string;
  companyId: string;
}

export interface User {
  email: string;
  username: string;
  firstName?: string;
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
];

export const COUNTRY_CHOICES = [
  { value: 'Sweden', label: 'Sweden' },
  { value: 'Norway', label: 'Norway' },
  { value: 'Denmark', label: 'Denmark' },
  { value: 'Finland', label: 'Finland' },
  { value: 'Iceland', label: 'Iceland' },
  { value: 'Rwanda', label: 'Rwanda' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'Uganda', label: 'Uganda' },
  { value: 'Tanzania', label: 'Tanzania' },
  // Add more countries as needed
];
