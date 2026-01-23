/**
 * Investment Holdings API
 * Frontend-ready structure for managing user's investment holdings
 * Backend endpoints can be added later
 */

import { apiClient } from './client';
import type {
  InvestmentHolding,
  InvestmentHoldingsResponse,
  AddHoldingRequest,
  UpdateHoldingRequest,
} from './types/investment';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const investmentApi = {
  /**
   * Get user's investment holdings
   */
  getHoldings: async (): Promise<InvestmentHoldingsResponse> => {
    // TODO: Replace with actual API endpoint when backend is ready
    // const response = await apiClient.get<ApiResponse<InvestmentHoldingsResponse>>('/investment/holdings');
    // return response.data.data;
    
    // For now, return empty holdings
    return {
      holdings: [],
      totalValue: 0,
      totalCost: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      byAssetClass: {},
    };
  },

  /**
   * Add a new investment holding
   */
  addHolding: async (request: AddHoldingRequest): Promise<InvestmentHoldingsResponse> => {
    // TODO: Replace with actual API endpoint when backend is ready
    // const response = await apiClient.post<ApiResponse<InvestmentHoldingsResponse>>('/investment/holdings', request);
    // return response.data.data;
    
    // For now, return empty holdings
    return {
      holdings: [],
      totalValue: 0,
      totalCost: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      byAssetClass: {},
    };
  },

  /**
   * Update an existing investment holding
   */
  updateHolding: async (
    holdingId: string,
    request: UpdateHoldingRequest
  ): Promise<InvestmentHoldingsResponse> => {
    // TODO: Replace with actual API endpoint when backend is ready
    // const response = await apiClient.put<ApiResponse<InvestmentHoldingsResponse>>(`/investment/holdings/${holdingId}`, request);
    // return response.data.data;
    
    // For now, return empty holdings
    return {
      holdings: [],
      totalValue: 0,
      totalCost: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      byAssetClass: {},
    };
  },

  /**
   * Delete an investment holding
   */
  deleteHolding: async (holdingId: string): Promise<InvestmentHoldingsResponse> => {
    // TODO: Replace with actual API endpoint when backend is ready
    // const response = await apiClient.delete<ApiResponse<InvestmentHoldingsResponse>>(`/investment/holdings/${holdingId}`);
    // return response.data.data;
    
    // For now, return empty holdings
    return {
      holdings: [],
      totalValue: 0,
      totalCost: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      byAssetClass: {},
    };
  },
};

export type InvestmentApi = typeof investmentApi;



