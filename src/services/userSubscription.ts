/**
 * User Subscription service for handling user subscription management
 */
import { apiGet, apiPut } from './api';

/**
 * Interface for user subscription data
 */
export interface UserSubscription {
  id: number;
  plan: string;
  plan_display: string;
  status: string;
  status_display: string;
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  payment_method: string;
  payment_method_display: string;
  last_payment: string;
  amount: string;
  contact_name: string;
  contact_email: string;
}

/**
 * Interface for subscription update request
 */
export interface SubscriptionUpdateRequest {
  plan: string;
  auto_renew: boolean;
  payment_method: string;
  contact_name: string;
  contact_email: string;
}

/**
 * Interface for subscription update response
 */
export interface SubscriptionUpdateResponse {
  message: string;
  subscription: UserSubscription;
}

/**
 * Get the current user's subscription
 * @returns The user subscription data
 */
export async function getUserSubscription() {
  try {
    const response = await apiGet<UserSubscription>('/ads/user/subscription/', true);
    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while fetching subscription details',
      status: 500
    };
  }
}

/**
 * Update the current user's subscription
 * @param subscriptionData The subscription data to update
 * @returns The updated subscription data
 */
export async function updateUserSubscription(subscriptionData: SubscriptionUpdateRequest) {
  try {
    const response = await apiPut<SubscriptionUpdateResponse>('/ads/user/subscription/update/', subscriptionData, true);
    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An error occurred while updating subscription',
      status: 500
    };
  }
}
