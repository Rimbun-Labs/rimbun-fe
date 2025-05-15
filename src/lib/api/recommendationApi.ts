import { apiClient } from './client';
import { RecommendationResponse } from './types/assessment';

export const getRecommendations = async (responseGroupId: string): Promise<RecommendationResponse> => {
  try {
    console.log('Fetching recommendations for session:', responseGroupId);
    const response = await apiClient.get<RecommendationResponse>(
      `/recommendation/response-group/${responseGroupId}`
    );
    console.log('Recommendations response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch recommendations:', error);
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    throw new Error('Failed to fetch recommendations');
  }
}; 