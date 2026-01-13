import { apiClient } from './client';
import { GoalFamilyBoardDto, GoalFamilySummariesResponse, GoalFamilyMappingResponse } from './types/goals';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const goalFamiliesApi = {
  listSummaries: async (): Promise<GoalFamilySummariesResponse> => {
    const response = await apiClient.get<ApiResponse<GoalFamilySummariesResponse>>(
      `/goal-families`
    );
    return response.data.data;
  },

  getBoard: async (familyId: string): Promise<GoalFamilyBoardDto> => {
    const response = await apiClient.get<ApiResponse<GoalFamilyBoardDto>>(
      `/goal-families/${familyId}/board`
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

