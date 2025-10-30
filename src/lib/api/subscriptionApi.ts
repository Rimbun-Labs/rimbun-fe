import apiClient from './client';
import { SubscriptionData } from './types/subscription';

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

