import { apiClient } from './client';
import type { 
  BankCustomerInsightsResponse,
  BankCustomerInsights,
  BankPermissionResponse 
} from './types/bankInsights';

/**
 * Bank Analytics API
 * Handles all API calls for the Bank Analytics Dashboard
 */

/**
 * Check if user has permission to access bank analytics
 * Uses the lightweight permission check endpoint
 */
export const checkBankPermission = async (): Promise<BankPermissionResponse> => {
  try {
    console.log('🔍 Checking bank permissions...');
    const response = await apiClient.get('/bank/permissions/check');
    
    // Log full response structure for debugging
    console.log('🔍 Full API response:', response);
    console.log('🔍 response.data:', response.data);
    
    // Handle different possible response structures
    // The API might return:
    // 1. { data: { hasPermission, role } } - wrapped in data
    // 2. { hasPermission, role } - direct response
    const responseData = response.data;
    
    let permissionData: BankPermissionResponse;
    
    if (responseData?.data) {
      // Structure: { data: { hasPermission, role } }
      permissionData = responseData.data;
    } else if (responseData?.hasPermission !== undefined) {
      // Structure: { hasPermission, role }
      permissionData = responseData as BankPermissionResponse;
    } else {
      // Unexpected structure - log and return default
      console.error('❌ Unexpected response structure:', responseData);
      return { hasPermission: false, role: '' };
    }
    
    // Validate the response has required fields
    if (typeof permissionData.hasPermission !== 'boolean') {
      console.error('❌ Invalid response: hasPermission is not a boolean', permissionData);
      return { hasPermission: false, role: permissionData.role || '' };
    }
    
    console.log('✅ Bank permission check result:', permissionData);
    return permissionData;
  } catch (error: any) {
    // If 403, user doesn't have permission
    if (error.response?.status === 403) {
      console.log('⚠️ Bank permission denied (403)');
      return { hasPermission: false, role: '' };
    }
    
    // If 404, endpoint doesn't exist yet (might be under development)
    if (error.response?.status === 404) {
      console.warn('⚠️ Bank permissions endpoint not found (404) - endpoint may not be implemented yet');
      return { hasPermission: false, role: '' };
    }
    
    // Log other errors for debugging
    console.error('❌ Bank permission check error:', {
      status: error.response?.status,
      message: error.message,
      error
    });
    
    // For other errors, re-throw
    throw error;
  }
};

/**
 * Get customer insights data
 * Main endpoint for bank analytics dashboard
 */
export const getCustomerInsights = async (): Promise<BankCustomerInsights> => {
  try {
    const response = await apiClient.get('/bank/customers/insights');
    
    // Handle different possible response structures
    const responseData = response.data;
    
    if (responseData?.data) {
      // Structure: { data: BankCustomerInsights }
      return responseData.data;
    } else if (responseData?.totalCustomers !== undefined) {
      // Structure: BankCustomerInsights (direct)
      return responseData as BankCustomerInsights;
    } else {
      throw new Error('Unexpected response structure from customer insights API');
    }
  } catch (error: any) {
    console.error('❌ Failed to fetch customer insights:', error);
    throw error;
  }
};

