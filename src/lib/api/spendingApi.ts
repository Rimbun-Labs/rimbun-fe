import { apiClient } from './client';

// DTOs for spending API
export interface SpendingOverviewDto {
  monthlySpending: number;
  emergencyFundCurrent: number;
  emergencyFundTarget?: number;
}

export interface SpendingCategoryDto {
  id?: string;
  categoryName: string;
  monthlyAmount: number;
  isCustom: boolean;
}

export interface EmergencyFundStatusDto {
  currentAmount: number;
  targetAmount: number;
  monthsOfExpenses: number;
  status: 'adequate' | 'insufficient' | 'excessive';
  recommendedTarget: number;
}

export interface SpendingAnalysisDto {
  monthlyIncome: number;
  monthlySpending: number;
  savingsRate: number;
  emergencyFundStatus: EmergencyFundStatusDto;
  spendingCategories: SpendingCategoryDto[];
}

export interface SpendingRecommendationDto {
  currentSavingsRate: number;
  recommendedSavingsRate: number;
  potentialMonthlySavings: number;
  spendingAdjustments: string[];
  emergencyFundActions: string[];
  combinedRecommendations: {
    primaryAction: string;
    spendingOptimizations: string[];
    goalAlignment: string[];
  };
}

// API response wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Spending API client
export const spendingApi = {
  /**
   * Get user's spending overview
   */
  getSpendingOverview: async (userId: string): Promise<SpendingAnalysisDto> => {
    const response = await apiClient.get<ApiResponse<SpendingAnalysisDto>>(
      `/spending/overview?userId=${userId}`
    );
    return response.data.data;
  },

  /**
   * Save user's spending overview
   */
  saveSpendingOverview: async (
    userId: string, 
    data: SpendingOverviewDto
  ): Promise<SpendingAnalysisDto> => {
    const response = await apiClient.post<ApiResponse<SpendingAnalysisDto>>(
      `/spending/overview?userId=${userId}`,
      data
    );
    return response.data.data;
  },

  /**
   * Get user's spending categories
   */
  getSpendingCategories: async (userId: string): Promise<SpendingCategoryDto[]> => {
    const response = await apiClient.get<ApiResponse<SpendingCategoryDto[]>>(
      `/spending/categories?userId=${userId}`
    );
    return response.data.data;
  },

  /**
   * Add a new spending category
   */
  addSpendingCategory: async (
    userId: string, 
    category: Omit<SpendingCategoryDto, 'id'>
  ): Promise<SpendingCategoryDto> => {
    const response = await apiClient.post<ApiResponse<SpendingCategoryDto>>(
      `/spending/categories?userId=${userId}`,
      category
    );
    return response.data.data;
  },

  /**
   * Update an existing spending category
   */
  updateSpendingCategory: async (
    id: string,
    userId: string, 
    category: Omit<SpendingCategoryDto, 'id'>
  ): Promise<SpendingCategoryDto> => {
    const response = await apiClient.put<ApiResponse<SpendingCategoryDto>>(
      `/spending/categories/${id}?userId=${userId}`,
      category
    );
    return response.data.data;
  },

  /**
   * Delete a spending category
   */
  deleteSpendingCategory: async (id: string, userId: string): Promise<void> => {
    await apiClient.delete(`/spending/categories/${id}?userId=${userId}`);
  },

  /**
   * Get comprehensive spending recommendations
   */
  getSpendingRecommendations: async (userId: string): Promise<SpendingRecommendationDto> => {
    const response = await apiClient.get<ApiResponse<SpendingRecommendationDto>>(
      `/spending/recommendations?userId=${userId}`
    );
    return response.data.data;
  }
};

export default spendingApi;
