export * from './types/assessment';
export * from './sessionApi';
export * from './responseApi';
export * from './resultsApi';

import { AssessmentResults } from './types/assessment';
import axios from 'axios';
import { config } from './config';
import { AssessmentResult, UserAnswer } from './types/assessment';

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
        riskCapacity: 70,
        totalSavings: "50000",
        financialGoal: "Retirement",
        monthlyIncome: "5000",
        investmentHorizon: 10
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
  if (config.isMock) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Add delay to simulate network
    return createMockAssessmentResult(sessionId);
  }

  try {
    const response = await axios.get<AssessmentResult>(
      `${config.API_BASE_URL}/assessment/response-group/${sessionId}/score`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    console.log("res", response.data)
    return response.data;
  } catch (error) {
    console.error('Failed to fetch assessment results:', error);
    throw new Error('Failed to fetch assessment results');
  }
};

export const submitAnswer = async (sessionId: string, answer: UserAnswer): Promise<void> => {
  if (config.isMock) {
    return mockSubmitAnswer(sessionId, answer);
  }

  try {
    await axios.post(
      `${config.API_BASE_URL}/assessment/response-group/${sessionId}/response`,
      {
        questionId: answer.questionId,
        answer: {
          value: typeof answer.answer === 'string' ? answer.answer : undefined,
          answerNumber: typeof answer.answer === 'number' ? answer.answer : undefined,
          answerBoolean: typeof answer.answer === 'boolean' ? answer.answer : undefined
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Failed to submit answer:', error);
    throw new Error('Failed to submit answer');
  }
};

export const submitAnswersBulk = async (sessionId: string, answers: UserAnswer[]): Promise<void> => {
  if (config.isMock) {
    for (const answer of answers) {
      await mockSubmitAnswer(sessionId, answer);
    }
    return;
  }

  try {
    await axios.post(
      `${config.API_BASE_URL}/assessment/response-group/${sessionId}/responses/bulk`,
      {
        responseGroupId: sessionId,
        responses: answers.map(answer => ({
          questionId: answer.questionId,
          answer: {
            value: typeof answer.answer === 'string' ? answer.answer : undefined,
            answerNumber: typeof answer.answer === 'number' ? answer.answer : undefined,
            answerBoolean: typeof answer.answer === 'boolean' ? answer.answer : undefined
          }
        }))
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Failed to submit answers in bulk:', error);
    throw new Error('Failed to submit answers in bulk');
  }
};
