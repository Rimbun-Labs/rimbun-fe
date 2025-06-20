export * from './types/assessment';
export * from './sessionApi';
export * from './responseApi';
export * from './resultsApi';

import { AssessmentResults } from './types/assessment';
import axios from 'axios';
import { config } from './config';
import { AssessmentResult, UserAnswer, SaveUserResponseRequest } from './types/assessment';
import { userResponsesApi } from './userResponsesApi';
import { userService } from './userService';

export const getAssessmentResults = async (sessionId: string): Promise<AssessmentResult> => {
  try {
    const response = await axios.get<AssessmentResult>(
      `${config.API_BASE_URL}/assessment/response-group/${sessionId}/score`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.data) {
      throw new Error('No data received from the API');
    }

    if (!response.data.scoreData) {
      throw new Error('Missing scoreData in response');
    }

    const requiredFields = ['riskProfile', 'knowledgeLevel', 'leverageAptitude', 'riskCapacity', 
                          'investmentHorizon', 'finalScore', 'profile', 'overallConfidence'];
    
    const missingFields = requiredFields.filter(field => !(field in response.data.scoreData));
    if (missingFields.length > 0) {
      console.error('Missing required fields in scoreData:', missingFields);
      throw new Error(`Missing required fields in scoreData: ${missingFields.join(', ')}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch assessment results:', error);
    if (axios.isAxiosError(error)) {
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
    }
    throw new Error('Failed to fetch assessment results');
  }
};

// Add these two functions after the existing getAssessmentResults function:

// New function to get latest assessment results for a user
export const getLatestUserAssessmentResults = async (): Promise<AssessmentResult | null> => {
  try {
    const databaseUserId = userService.getDatabaseUserId();
    
    if (!databaseUserId) {
      console.log('No database user ID found, user may not be registered');
      return null;
    }

    console.log('🔵 Fetching latest assessment results for user:', databaseUserId);
    
    const response = await axios.get<AssessmentResult>(
      `${config.API_BASE_URL}/assessment/user/${databaseUserId}/latest`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.data) {
      console.log('No assessment results found for user');
      return null;
    }

    if (!response.data.scoreData) {
      console.error('Missing scoreData in response');
      return null;
    }

    const requiredFields = ['riskProfile', 'knowledgeLevel', 'leverageAptitude', 'riskCapacity', 
                          'investmentHorizon', 'finalScore', 'profile', 'overallConfidence'];
    
    const missingFields = requiredFields.filter(field => !(field in response.data.scoreData));
    if (missingFields.length > 0) {
      console.error('Missing required fields in scoreData:', missingFields);
      return null;
    }
    
    console.log('✅ Successfully retrieved latest assessment results for user');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch latest user assessment results:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        console.log('No assessment results found for user (404)');
        return null;
      }
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
    }
    return null;
  }
};

// New function to get all assessment results for a user
export const getAllUserAssessmentResults = async (): Promise<AssessmentResult[]> => {
  try {
    const databaseUserId = userService.getDatabaseUserId();
    
    if (!databaseUserId) {
      console.log('No database user ID found, user may not be registered');
      return [];
    }

    console.log('🔵 Fetching all assessment results for user:', databaseUserId);
    
    const response = await axios.get<AssessmentResult[]>(
      `${config.API_BASE_URL}/assessment/user/${databaseUserId}/all`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.data || !Array.isArray(response.data)) {
      console.log('No assessment results found for user');
      return [];
    }
    
    console.log('✅ Successfully retrieved all assessment results for user');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch all user assessment results:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        console.log('No assessment results found for user (404)');
        return [];
      }
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
    }
    return [];
  }
};

export const submitAnswer = async (sessionId: string, answer: UserAnswer): Promise<void> => {
  try {
    const formattedAnswer = userResponsesApi.formatAnswerForApi(answer.answer, answer.questionType || 'single_text');
    
    const request: SaveUserResponseRequest = {
      responseGroupId: sessionId,
      questionId: answer.questionId,
      answer: formattedAnswer
    };

    await userResponsesApi.submitAnswer(request);
  } catch (error) {
    console.error('Failed to submit answer:', error);
    throw new Error('Failed to submit answer');
  }
};

export const submitAnswersBulk = async (sessionId: string, answers: UserAnswer[]): Promise<void> => {
  try {
    const formattedRequests = answers.map(answer => ({
      responseGroupId: sessionId,
      questionId: answer.questionId,
      answer: userResponsesApi.formatAnswerForApi(answer.answer, answer.questionType || 'single_text')
    }));

    await Promise.all(formattedRequests.map(request => userResponsesApi.submitAnswer(request)));
  } catch (error) {
    console.error('Failed to submit answers in bulk:', error);
    throw new Error('Failed to submit answers in bulk');
  }
};
