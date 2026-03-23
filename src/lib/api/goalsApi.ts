import { apiClient } from './client';
import {
  CreateGoalRequest,
  GoalProgressHistoryDto,
  GoalWithInsightsDto,
  ResilienceResponseDto,
  UpdateGoalRequest,
  UserGoalsResponse,
  SimulateStrategyRequest,
  SimulateStrategyResponse,
} from './types/goals';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const goalsApi = {
  listGoals: async (includeInactive = false): Promise<UserGoalsResponse> => {
    const params = new URLSearchParams();
    if (includeInactive) {
      params.append('includeInactive', 'true');
    }

    const url = params.toString() ? `/goals?${params.toString()}` : '/goals';
    const response = await apiClient.get<ApiResponse<UserGoalsResponse>>(url);
    return response.data.data;
  },

  getGoal: async (goalId: string): Promise<GoalWithInsightsDto> => {
    const response = await apiClient.get<ApiResponse<GoalWithInsightsDto>>(
      `/goals/${goalId}`
    );
    return response.data.data;
  },

  createGoal: async (payload: CreateGoalRequest): Promise<GoalWithInsightsDto> => {
    const response = await apiClient.post<ApiResponse<GoalWithInsightsDto>>(
      `/goals`,
      payload
    );
    return response.data.data;
  },

  updateGoal: async (
    goalId: string,
    payload: UpdateGoalRequest
  ): Promise<GoalWithInsightsDto> => {
    const response = await apiClient.put<ApiResponse<GoalWithInsightsDto>>(
      `/goals/${goalId}`,
      payload
    );
    return response.data.data;
  },

  deleteGoal: async (goalId: string): Promise<void> => {
    await apiClient.delete(`/goals/${goalId}`);
  },

  getGoalProgressHistory: async (
    goalId: string,
    options?: {
      startYear?: number;
      startMonth?: number;
      endYear?: number;
      endMonth?: number;
      limit?: number;
    }
  ): Promise<GoalProgressHistoryDto> => {
    const params = new URLSearchParams();
    if (options?.startYear) params.append('startYear', options.startYear.toString());
    if (options?.startMonth) params.append('startMonth', options.startMonth.toString());
    if (options?.endYear) params.append('endYear', options.endYear.toString());
    if (options?.endMonth) params.append('endMonth', options.endMonth.toString());
    if (options?.limit) params.append('limit', options.limit.toString());

    const url = params.toString() ? `/goals/${goalId}/progress?${params.toString()}` : `/goals/${goalId}/progress`;
    const response = await apiClient.get<ApiResponse<GoalProgressHistoryDto>>(url);
    return response.data.data;
  },

  simulateStrategy: async (
    request: SimulateStrategyRequest
  ): Promise<SimulateStrategyResponse> => {
    const response = await apiClient.post<ApiResponse<SimulateStrategyResponse>>(
      `/goals/simulate-strategy`,
      request
    );
    return response.data.data;
  },

  getResilience: async (goalId: string): Promise<ResilienceResponseDto | null> => {
    const response = await apiClient.get<ApiResponse<ResilienceResponseDto | null>>(
      `/goals/${goalId}/resilience`
    );
    return response.data.data;
  },
};

export type GoalsApi = typeof goalsApi;

