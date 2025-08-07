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

// Admin-only functions for managing pricing
import { apiPost, apiPut, apiDelete } from './api';

export interface BaseFeature {
  id: number;
  name: string;
  category: string;
  base_description: string;
  is_active: boolean;
  order: number;
}

export interface CreatePricingPlanRequest {
  name: string;
  plan_type: 'free' | 'standard' | 'premium';
  price: number;
  currency: string;
  color: string;
  is_popular: boolean;
  is_active: boolean;
  order: number;
}

export interface UpdatePricingPlanRequest extends Partial<CreatePricingPlanRequest> {
  id: number;
}

export interface CreateBaseFeatureRequest {
  name: string;
  category: string;
  base_description: string;
  is_active: boolean;
  order: number;
}

export interface UpdateBaseFeatureRequest extends Partial<CreateBaseFeatureRequest> {
  id: number;
}

export interface CreatePlanFeatureRequest {
  plan_id: number;
  base_feature_id: number;
  is_included: boolean;
  feature_value?: string | null;
  custom_description?: string | null;
  order: number;
  is_highlighted: boolean;
}

export interface UpdatePlanFeatureRequest extends Partial<CreatePlanFeatureRequest> {
  id: number;
}

export interface UpdatePricingPageContentRequest {
  title: string;
  subtitle: string;
  section_label: string;
  cta_text: string;
  cta_url: string;
}

/**
 * Get all base features (public endpoint)
 */
export async function getBaseFeatures() {
  return apiGet<BaseFeature[]>('/pricing/base-features/', false);
}

/**
 * Get all base features (admin only)
 */
export async function getAdminBaseFeatures() {
  return apiGet<BaseFeature[]>('/pricing/admin/base-features/', true);
}

/**
 * Create a new pricing plan (admin only)
 */
export async function createPricingPlan(plan: CreatePricingPlanRequest) {
  return apiPost<PricingPlan>('/pricing/admin/plans/', plan, true);
}

/**
 * Update a pricing plan (admin only)
 */
export async function updatePricingPlan(plan: UpdatePricingPlanRequest) {
  return apiPut<PricingPlan>(`/pricing/admin/plans/${plan.id}/`, plan, true);
}

/**
 * Delete a pricing plan (admin only)
 */
export async function deletePricingPlan(planId: number) {
  return apiDelete<{ success: boolean }>(`/pricing/admin/plans/${planId}/`, true);
}

/**
 * Create a new base feature (admin only)
 */
export async function createBaseFeature(feature: CreateBaseFeatureRequest) {
  return apiPost<BaseFeature>('/pricing/admin/base-features/', feature, true);
}

/**
 * Update a base feature (admin only)
 */
export async function updateBaseFeature(feature: UpdateBaseFeatureRequest) {
  return apiPut<BaseFeature>(`/pricing/admin/base-features/${feature.id}/`, feature, true);
}

/**
 * Delete a base feature (admin only)
 */
export async function deleteBaseFeature(featureId: number) {
  return apiDelete<{ success: boolean }>(`/pricing/admin/base-features/${featureId}/`, true);
}

/**
 * Update pricing page content (admin only)
 */
export async function updatePricingPageContent(content: UpdatePricingPageContentRequest) {
  return apiPut<PricingPageContent>('/pricing/admin/content/', content, true);
}

/**
 * Get all pricing plans for admin (includes inactive plans)
 */
export async function getAdminPricingPlans() {
  return apiGet<PricingPlan[]>('/pricing/admin/plans/', true);
}
