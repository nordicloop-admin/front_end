// Authentication and registration related types

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface CompanyRegistration {
  companyName: string;
  vatNumber: string;
  email?: string;
  website?: string;
  country: string;
  sector: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPosition: string;
  reviewStatus: ReviewStatus;
  createdAt: string;
}

export interface UserSignUp {
  email: string;
  password: string;
  companyId: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  position: string;
  companyId: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  vatNumber: string;
  email?: string;
  website?: string;
  country: string;
  sector: string;
  reviewStatus: ReviewStatus;
  createdAt: string;
}

export const SECTOR_CHOICES = [
  { value: 'manufacturing_production', label: 'Manufacturing & Production' },
  { value: 'construction', label: 'Construction & Demolition' },
  { value: 'retail', label: 'Wholesale & Retail' },
  { value: 'packaging', label: 'Packaging & Printing' },
  { value: 'recycling', label: 'Recycling & Waste Management' },
  { value: 'energy_utilities', label: 'Energy & Utilities' },
];

export const COUNTRY_CHOICES = [
  { value: 'sweden', label: 'Sweden' },
  { value: 'norway', label: 'Norway' },
  { value: 'denmark', label: 'Denmark' },
  { value: 'finland', label: 'Finland' },
  { value: 'iceland', label: 'Iceland' },
  // Add more countries as needed
];
