import apiClient from './client';
import { SubscriptionData, SubscriptionTier } from './types/subscription';

export const getSubscription = async (): Promise<SubscriptionData> => {
  try {
    const response = await apiClient.get('/subscription/me');
    // Backend returns BaseResponse wrapper, so we unwrap it
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch subscription:', error);
    // Return default free tier on error
    throw new Error('Failed to fetch subscription data');
  }
};

export interface UpdateSubscriptionRequest {
  tier: SubscriptionTier;
  billingPeriod?: 'monthly' | 'yearly';
}

export const updateSubscription = async (request: UpdateSubscriptionRequest): Promise<SubscriptionData> => {
  try {
    const response = await apiClient.put('/subscription/me', request);
    // Backend returns BaseResponse wrapper, so we unwrap it
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to update subscription:', error);
    const errorMessage = error.response?.data?.details || error.message || 'Failed to update subscription';
    throw new Error(errorMessage);
  }
};

