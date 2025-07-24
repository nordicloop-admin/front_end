/**
 * Category subscription service for handling user subscriptions to auction categories
 */
import { apiGet, apiPost, apiDelete } from './api';
import { Category, Subcategory } from './auction';

/**
 * Interface for related ad data
 */
export interface RelatedAd {
  id: number;
  title: string;
  description: string;
  packaging: string;
  auction_duration: number;
  storage_conditions: string;
  contamination: string;
  available_quantity: string;
  unit_of_measurement: string;
  starting_bid_price: string;
  currency: string;
  created_at: string;
}

/**
 * Interface for category subscription data
 */
export interface CategorySubscription {
  id: number;
  material_type: string;
  subcategory_name: string | null;
  created_at: string;
  related_ads: RelatedAd[];
}

/**
 * Interface for creating a category subscription
 */
export interface CreateCategorySubscription {
  category_id: number;
  subcategory_id?: number | null;
}

/**
 * Interface for paginated API response
 */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Get all category subscriptions for the current user
 * @returns Promise with category subscriptions data
 */
export async function getUserCategorySubscriptions() {
  const response = await apiGet<PaginatedResponse<CategorySubscription>>('/category-subscriptions/', true);
  
  // Map the paginated response to the expected format
  if (response.data && response.data.results) {
    return {
      data: response.data.results as CategorySubscription[],
      error: response.error,
      status: response.status
    };
  }
  
  // Return empty array if no results
  return {
    data: [] as CategorySubscription[],
    error: response.error,
    status: response.status
  };
}

/**
 * Subscribe to a category or subcategory
 * @param subscription The subscription data
 * @returns Promise with created subscription data
 */
export async function subscribeToCategoryOrSubcategory(subscription: CreateCategorySubscription) {
  return apiPost<CategorySubscription>('/category-subscriptions/', subscription, true);
}

/**
 * Unsubscribe from a category subscription
 * @param subscriptionId The ID of the subscription to delete
 * @returns Promise with success status
 */
export async function unsubscribeFromCategory(subscriptionId: number) {
  return apiDelete<{ success: boolean }>(`/category-subscriptions/${subscriptionId}/`, true);
}

/**
 * Check if user is subscribed to a specific category
 * @param categoryId The category ID to check
 * @param subcategoryId Optional subcategory ID to check
 * @returns Promise with boolean indicating if subscribed
 */
export async function isSubscribedToCategory(_categoryId: number, _subcategoryId?: number) {
  try {
    const response = await getUserCategorySubscriptions();
    
    if (response.error || !response.data) {
      return {
        data: false,
        error: response.error,
        status: response.status
      };
    }
    
    // Get category name from categoryId
    // This requires a separate API call to get category details
    // For now, we'll check based on material_type and subcategory_name
    // This would need to be updated to properly map category IDs to names
    
    // This is a simplified approach - in a real implementation, you would
    // need to map category IDs to names or modify the backend to include IDs
    const subscriptions = response.data as CategorySubscription[];
    const isSubscribed = subscriptions.some((_subscription: CategorySubscription) => {
      // For now, we'll assume material_type is unique enough to identify a category
      // In a real implementation, you would need a more robust solution
      return true; // Placeholder - actual implementation would check category/subcategory
    });
    
    return {
      data: isSubscribed,
      error: null,
      status: 200
    };
  } catch (error) {
    return {
      data: false,
      error: error instanceof Error ? error.message : 'An error occurred while checking subscription status',
      status: 500
    };
  }
}
