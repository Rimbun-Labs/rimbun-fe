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

// Time-series DTOs
export interface SpendingPeriodDto {
  id: string;
  userId: string;
  periodYear: number;
  periodMonth: number; // 1-12
  monthlySpending: number;
  emergencyFundCurrent: number;
  emergencyFundTarget?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SpendingHistoryTrendsDto {
  momChange: number | null; // Month-over-month %
  threeMonthAverage: number | null;
  sixMonthAverage: number | null;
  twelveMonthAverage: number | null;
}

export interface SpendingHistoryDto {
  periods: SpendingPeriodDto[];
  trends: SpendingHistoryTrendsDto;
}

export interface SpendingTrendsDto {
  periods: Array<{
    periodYear: number;
    periodMonth: number;
    monthlySpending: number;
  }>;
  trends: {
    momChange: number | null;
    yoyChange: number | null; // Year-over-year (not implemented yet)
    threeMonthAverage: number | null;
    sixMonthAverage: number | null;
    twelveMonthAverage: number | null;
    velocity: 'increasing' | 'decreasing' | 'stable';
    trendDirection: 'up' | 'down' | 'flat';
  };
  insights: string[];
}

export interface SaveSpendingPeriodDto {
  year: number;
  month: number; // 1-12
  monthlySpending: number;
  emergencyFundCurrent?: number;
  emergencyFundTarget?: number;
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
  },

  /**
   * Save spending for a specific period (month/year)
   */
  saveSpendingPeriod: async (
    userId: string,
    data: SaveSpendingPeriodDto
  ): Promise<SpendingPeriodDto> => {
    const response = await apiClient.post<ApiResponse<SpendingPeriodDto>>(
      `/spending/periods?userId=${userId}`,
      data
    );
    return response.data.data;
  },

  /**
   * Get spending history with trends
   */
  getSpendingHistory: async (
    userId: string,
    options?: {
      limit?: number;
      startYear?: number;
      startMonth?: number;
      endYear?: number;
      endMonth?: number;
    }
  ): Promise<SpendingHistoryDto> => {
    const params = new URLSearchParams();
    params.append('userId', userId);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.startYear) params.append('startYear', options.startYear.toString());
    if (options?.startMonth) params.append('startMonth', options.startMonth.toString());
    if (options?.endYear) params.append('endYear', options.endYear.toString());
    if (options?.endMonth) params.append('endMonth', options.endMonth.toString());

    const response = await apiClient.get<ApiResponse<SpendingHistoryDto>>(
      `/spending/history?${params.toString()}`
    );
    return response.data.data;
  },

  /**
   * Get spending trends analysis
   */
  getSpendingTrends: async (
    userId: string,
    period: '3m' | '6m' | '12m' = '6m'
  ): Promise<SpendingTrendsDto> => {
    const response = await apiClient.get<ApiResponse<SpendingTrendsDto>>(
      `/spending/trends?userId=${userId}&period=${period}`
    );
    return response.data.data;
  }
};

export default spendingApi;
