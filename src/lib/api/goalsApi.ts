import { apiClient } from './client';
import {
  CreateGoalRequest,
  GoalProgressHistoryDto,
  GoalWithInsightsDto,
  UpdateGoalRequest,
  UserGoalsResponse,
  SimulateStrategyRequest,
  SimulateStrategyResponse,
} from './types/goals';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

const buildUserParams = (userId: string) => {
  const params = new URLSearchParams();
  params.append('userId', userId);
  return params;
};

export const goalsApi = {
  listGoals: async (userId: string, includeInactive = false): Promise<UserGoalsResponse> => {
    const params = buildUserParams(userId);
    if (includeInactive) {
      params.append('includeInactive', 'true');
    }

    const response = await apiClient.get<ApiResponse<UserGoalsResponse>>(
      `/goals?${params.toString()}`
    );
    return response.data.data;
  },

  getGoal: async (userId: string, goalId: string): Promise<GoalWithInsightsDto> => {
    const params = buildUserParams(userId);
    const response = await apiClient.get<ApiResponse<GoalWithInsightsDto>>(
      `/goals/${goalId}?${params.toString()}`
    );
    return response.data.data;
  },

  createGoal: async (userId: string, payload: CreateGoalRequest): Promise<GoalWithInsightsDto> => {
    const params = buildUserParams(userId);
    const response = await apiClient.post<ApiResponse<GoalWithInsightsDto>>(
      `/goals?${params.toString()}`,
      payload
    );
    return response.data.data;
  },

  updateGoal: async (
    userId: string,
    goalId: string,
    payload: UpdateGoalRequest
  ): Promise<GoalWithInsightsDto> => {
    const params = buildUserParams(userId);
    const response = await apiClient.put<ApiResponse<GoalWithInsightsDto>>(
      `/goals/${goalId}?${params.toString()}`,
      payload
    );
    return response.data.data;
  },

  deleteGoal: async (userId: string, goalId: string): Promise<void> => {
    const params = buildUserParams(userId);
    await apiClient.delete(`/goals/${goalId}?${params.toString()}`);
  },

  getGoalProgressHistory: async (
    userId: string,
    goalId: string,
    options?: {
      startYear?: number;
      startMonth?: number;
      endYear?: number;
      endMonth?: number;
      limit?: number;
    }
  ): Promise<GoalProgressHistoryDto> => {
    const params = buildUserParams(userId);
    if (options?.startYear) params.append('startYear', options.startYear.toString());
    if (options?.startMonth) params.append('startMonth', options.startMonth.toString());
    if (options?.endYear) params.append('endYear', options.endYear.toString());
    if (options?.endMonth) params.append('endMonth', options.endMonth.toString());
    if (options?.limit) params.append('limit', options.limit.toString());

    const response = await apiClient.get<ApiResponse<GoalProgressHistoryDto>>(
      `/goals/${goalId}/progress?${params.toString()}`
    );
    return response.data.data;
  },

  simulateStrategy: async (
    userId: string,
    request: SimulateStrategyRequest
  ): Promise<SimulateStrategyResponse> => {
    const params = buildUserParams(userId);
    const response = await apiClient.post<ApiResponse<SimulateStrategyResponse>>(
      `/goals/simulate-strategy?${params.toString()}`,
      request
    );
    return response.data.data;
  },
};

export type GoalsApi = typeof goalsApi;

