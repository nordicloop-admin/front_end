// Authentication and registration related types

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface CompanyRegistration {
  // Backend API fields
  official_name?: string;
  vat_number?: string;
  contact_name?: string;
  contact_position?: string;
  contact_email?: string;
  status?: ReviewStatus;

  // Frontend form fields
  companyName?: string;
  vatNumber?: string;
  email?: string;
  website?: string;
  country: string;
  sector: string;
  contactFirstName?: string;
  contactLastName?: string;
  contactEmail?: string;
  contactPosition?: string;
  reviewStatus?: ReviewStatus;
  createdAt?: string;
}

export interface UserSignUp {
  email: string;
  password: string;
  companyId: string;
}

export interface User {
  id?: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  position?: string;
  companyId?: string;
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
