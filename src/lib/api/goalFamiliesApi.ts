import { apiClient } from './client';
import { GoalFamilyBoardDto, GoalFamilySummariesResponse, GoalFamilyMappingResponse } from './types/goals';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

const buildUserParams = (userId: string) => {
  const params = new URLSearchParams();
  params.append('userId', userId);
  return params;
};

export const goalFamiliesApi = {
  listSummaries: async (userId: string): Promise<GoalFamilySummariesResponse> => {
    const params = buildUserParams(userId);
    const response = await apiClient.get<ApiResponse<GoalFamilySummariesResponse>>(
      `/goal-families?${params.toString()}`
    );
    return response.data.data;
  },

  getBoard: async (userId: string, familyId: string): Promise<GoalFamilyBoardDto> => {
    const params = buildUserParams(userId);
    const response = await apiClient.get<ApiResponse<GoalFamilyBoardDto>>(
      `/goal-families/${familyId}/board?${params.toString()}`
    );
    return response.data.data;
  },

  getMapping: async (): Promise<GoalFamilyMappingResponse> => {
    const response = await apiClient.get<ApiResponse<GoalFamilyMappingResponse>>(
      '/goal-families/mapping'
    );
    return response.data.data;
  },
};

export type GoalFamiliesApi = typeof goalFamiliesApi;

