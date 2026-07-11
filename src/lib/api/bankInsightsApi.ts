import { apiClient } from './client';
import type { 
  BankCustomerInsights,
} from './types/bankInsights';

/**
 * Get customer insights data for the tenant analytics dashboard.
 */
export const getCustomerInsights = async (): Promise<BankCustomerInsights> => {
  try {
    const response = await apiClient.get('/dashboard/customers/insights');
    
    const responseData = response.data;
    
    if (responseData?.data) {
      return responseData.data;
    } else if (responseData?.totalCustomers !== undefined) {
      return responseData as BankCustomerInsights;
    } else {
      throw new Error('Unexpected response structure from customer insights API');
    }
  } catch (error: any) {
    console.error('Failed to fetch customer insights:', error);
    throw error;
  }
};
