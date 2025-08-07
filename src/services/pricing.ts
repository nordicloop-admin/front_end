/**
 * Pricing service for handling pricing-related API calls
 */
import { apiGet } from './api';

// Types
export interface PricingFeature {
  id: number;
  feature_text: string;
  feature_name: string;
  category: string;
  is_included: boolean;
  feature_value: string | null;
  order: number;
  is_highlighted: boolean;
}

export interface PricingPlan {
  id: number;
  name: string;
  plan_type: 'free' | 'standard' | 'premium';
  price: number;
  currency: string;
  color: string;
  is_popular: boolean;
  is_active: boolean;
  order: number;
  features: PricingFeature[];
}

export interface PricingPageContent {
  id: number;
  title: string;
  subtitle: string;
  section_label: string;
  cta_text: string;
  cta_url: string;
}

export interface PricingData {
  page_content: PricingPageContent;
  pricing_plans: PricingPlan[];
}

/**
 * Get all pricing data (plans and page content)
 * @returns Promise with pricing data
 */
export async function getPricingData() {
  return apiGet<{
    success: boolean;
    data: PricingData;
  }>('/pricing/data/', false); // No auth required for pricing data
}

/**
 * Get pricing plans only
 * @returns Promise with pricing plans
 */
export async function getPricingPlans() {
  return apiGet<PricingPlan[]>('/pricing/plans/', false);
}

/**
 * Get pricing page content only
 * @returns Promise with page content
 */
export async function getPricingPageContent() {
  return apiGet<PricingPageContent>('/pricing/content/', false);
}
