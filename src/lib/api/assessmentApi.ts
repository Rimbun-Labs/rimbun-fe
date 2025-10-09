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

// ✅ CORRECT: Get user sessions by database user ID (this API exists)
export const getUserSessions = async (databaseUserId: string): Promise<any[]> => {
  try {
    const response = await axios.get(
      `${config.API_BASE_URL}/user-responses/user/${databaseUserId}/sessions`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch user sessions:', error);
    return [];
  }
};

// ✅ CORRECT: Get session questions and answers (this API exists)
export const getSessionQuestionsAnswers = async (sessionId: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${config.API_BASE_URL}/user-responses/session/${sessionId}/questions-answers`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch session questions and answers:', error);
    throw new Error('Failed to fetch session data');
  }
};

// ✅ CORRECT: Get latest assessment results using session-based approach
export const getLatestAssessmentResults = async (): Promise<AssessmentResult | null> => {
  try {
    const databaseUserId = userService.getDatabaseUserId();
    
    if (!databaseUserId) {
      console.log('No database user ID found, user may not be registered');
      return null;
    }

    console.log('🔵 Getting user sessions for database user ID:', databaseUserId);
    
    // Step 1: Get user's sessions
    const userSessions = await getUserSessions(databaseUserId);
    
    if (!userSessions || userSessions.length === 0) {
      console.log('No sessions found for user');
      return null;
    }

    // Step 2: Check each session using score endpoint to find completed ones
    const completedSessions = [];
    
    for (const session of userSessions) {
      try {
        const scoreResponse = await fetch(`${config.API_BASE_URL}/assessment/response-group/${session.id}/score`);
        if (scoreResponse.ok) {
          // Score endpoint returns 200 OK for completed sessions
          completedSessions.push(session);
        }
      } catch (error) {
        // Silently skip sessions that can't be checked
      }
    }
    
    if (completedSessions.length === 0) {
      console.log('No completed sessions found for user');
      return null;
    }

    // Step 3: Get the most recent completed session
    const latestSession = completedSessions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    console.log('🔵 Getting assessment results for latest session:', latestSession.id);
    
    // Step 4: Get assessment results for the latest session
    const results = await getAssessmentResults(latestSession.id);
    
    console.log('✅ Successfully retrieved latest assessment results');
    return results;
  } catch (error) {
    console.error('Failed to get latest assessment results:', error);
    return null;
  }
};

export const submitAnswer = async (sessionId: string, answer: UserAnswer): Promise<any> => {
  try {
    const response = await axios.post(
      `${config.API_BASE_URL}/user-responses/answer`,
      {
        responseGroupId: sessionId,
        questionId: answer.questionId,
        answer: answer.answer
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to submit answer:', error);
    throw new Error('Failed to submit answer');
  }
};

export const getQuestions = async (): Promise<any[]> => {
  try {
    const response = await axios.get(
      `${config.API_BASE_URL}/questionnaire/questions`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    throw new Error('Failed to fetch questions');
  }
};
