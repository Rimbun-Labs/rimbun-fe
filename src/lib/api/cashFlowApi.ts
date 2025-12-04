import { apiClient } from './client';

// DTOs for Cash Flow API
export interface MonthlyProjectionDto {
  month: number;        // 1-12
  year: number;         // 2025, 2026, etc.
  income: number;
  spending: number;
  savings: number;
  investmentValue: number;
  totalNetWorth: number;
  goalProgress: number;  // 0-100
  monthlyReturn: number;
}

export interface ScenarioProjectionDto {
  monthlyProjections: MonthlyProjectionDto[];
  finalValue: number;
  goalAchieved: boolean;
  monthsToGoal: number;
  totalSavings: number;
  averageMonthlyReturn: number;
}

export interface CashFlowProjectionsDto {
  userId: string;
  monthlySpending: number;
  cashFlowProjections: {
    monthlyProjections: MonthlyProjectionDto[];
    scenarios: {
      conservative: ScenarioProjectionDto;
      realistic: ScenarioProjectionDto;
      optimistic: ScenarioProjectionDto;
    };
  };
  assessment: {
    monthlyIncome: number;
    targetAmount: number; // Now aggregated from all goals
    investmentHorizon: number; // Now longest horizon from all goals
  };
  goals?: {  // Aggregated goals info
    count: number;
    totalTargetAmount: number;
    totalCurrentAmount: number;
  };
  metadata?: {  // Data source & freshness info
    targetSource: 'aggregated_goals' | 'assessment' | 'default';
    targetSourceDescription: string;
    dataFreshness: {
      assessmentAgeDays?: number;
      assessmentStatus?: 'current' | 'stale' | 'very_stale';
      goalsLastUpdated?: string;
      spendingDataLastUpdated?: string;
    };
  };
  message?: string; // Only present when no assessment
}

// API Response wrapper
interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Cash Flow API client
export const cashFlowApi = {
  /**
   * Get cash flow projections for a user
   */
  getCashFlowProjections: async (userId: string): Promise<CashFlowProjectionsDto> => {
    const response = await apiClient.get<ApiResponse<CashFlowProjectionsDto>>(
      `/spending/cash-flow-projections?userId=${userId}`
    );
    return response.data.data;
  },
};
