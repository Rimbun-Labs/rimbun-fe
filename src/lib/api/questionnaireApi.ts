import { apiClient } from './client';
import { Question } from './types/assessment';
import { mockQuestions } from '../mock/mockQuestions';
import { config } from './config';

const isMockEnvironment = () => {
  const host = window.location.hostname;
  return host.includes('lovable') || host.includes('preview');
};

export const getQuestions = async (): Promise<Question[]> => {
  if (isMockEnvironment()) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return mockQuestions; // Mock data is already correctly ordered
  }

  try {
    const response = await apiClient.get<Question[]>(
      `/questionnaire/questions`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    return response.data; // Use backend order as-is
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    throw new Error('Failed to fetch assessment questions');
  }
}; 