export * from './types/assessment';
export * from './sessionApi';
export * from './responseApi';
export * from './resultsApi';

import { AssessmentResults } from './types/assessment';
import axios from 'axios';
import { config } from './config';
import { AssessmentResult, UserAnswer, SaveUserResponseRequest } from './types/assessment';
import { userResponsesApi } from './userResponsesApi';

const createMockAssessmentResult = (sessionId: string): AssessmentResult => {
  return {
    id: `result-${Date.now()}`,
    responseGroupId: sessionId,
    scoreData: {
      profile: "Balanced Growth",
      finalScore: 75,
      riskProfile: 65,
      directInputs: {
        age: 30,
        financialGoal: "Retirement",
        monthlyIncome: "5000",
        totalSavings: "50000"
      },
      riskCapacity: 70,
      knowledgeLevel: 80,
      leverageAptitude: 60,
      personalityScore: 72,
      confidenceMetrics: {
        personalityConfidence: 0.85,
        riskProfileConfidence: 0.78,
        riskCapacityConfidence: 0.82,
        decisionStyleConfidence: 0.75,
        knowledgeLevelConfidence: 0.88,
        leverageAptitudeConfidence: 0.76
      },
      investmentHorizon: 10,
      overallConfidence: 0.82,
      decisionStyleScore: 68,
      personalityDeviation: 0.15,
      decisionStyleDeviation: 0.12
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

const mockSubmitAnswer = async (sessionId: string, answer: UserAnswer): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
  console.log('Mock submit answer:', { sessionId, answer });
};

export const getAssessmentResults = async (sessionId: string): Promise<AssessmentResult> => {
  try {
    console.log('Fetching assessment results for session:', sessionId);
    
    const response = await axios.get<AssessmentResult>(
      `${config.API_BASE_URL}/assessment/response-group/${sessionId}/score`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    // Log the raw response for debugging
    console.log('Raw API response:', response);
    console.log('Response data:', response.data);
    
    // Validate the response structure
    if (!response.data) {
      throw new Error('No data received from the API');
    }

    if (!response.data.scoreData) {
      throw new Error('Missing scoreData in response');
    }

    // Check for required fields in scoreData
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

export const submitAnswer = async (sessionId: string, answer: UserAnswer): Promise<void> => {
  try {
    // Format the answer according to the question type
    const formattedAnswer = userResponsesApi.formatAnswerForApi(answer.answer, answer.questionType || 'single_text');
    
    // Create the request object
    const request: SaveUserResponseRequest = {
      responseGroupId: sessionId,
      questionId: answer.questionId,
      answer: formattedAnswer
    };

    // Use the userResponsesApi to submit the answer
    await userResponsesApi.submitAnswer(request);
  } catch (error) {
    console.error('Failed to submit answer:', error);
    throw new Error('Failed to submit answer');
  }
};

export const submitAnswersBulk = async (sessionId: string, answers: UserAnswer[]): Promise<void> => {
  try {
    // Format all answers
    const formattedRequests = answers.map(answer => ({
      responseGroupId: sessionId,
      questionId: answer.questionId,
      answer: userResponsesApi.formatAnswerForApi(answer.answer, answer.questionType || 'single_text')
    }));

    // Submit each answer individually
    await Promise.all(formattedRequests.map(request => userResponsesApi.submitAnswer(request)));
  } catch (error) {
    console.error('Failed to submit answers in bulk:', error);
    throw new Error('Failed to submit answers in bulk');
  }
};
