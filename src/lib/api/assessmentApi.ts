export interface Question {
  id: string;
  questionText: string;
  whyWeAsk: string;
  questionType: 'multiple_choice' | 'number' | 'boolean';
  category: {
    id: string;
    name: string;
    description: string;
  };
  options?: Array<{
    id: string;
    text: string;
  }>;
  visibilityRules?: {
    showToLevels: string[];
  };
  required: boolean;
  placeholder?: string;
}

export interface UserAnswer {
  questionId: string;
  answer: string | number | boolean;
}

export interface AssessmentResult {
  riskProfile: number;
  knowledgeLevel: number;
  leverageAptitude: number;
  decisionStyleScore: number;
  personalityScore: number;
  finalScore: number;
  profile: string;
  confidenceMetrics: {
    riskProfileConfidence: number;
    knowledgeLevelConfidence: number;
    leverageAptitudeConfidence: number;
    decisionStyleConfidence: number;
    personalityConfidence: number;
    riskCapacityConfidence: number;
  };
}

export interface ResponseGroup {
  id: string;
  userId: string;
  questionnaireType: string;
  isCompleted: boolean;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  id: string;
  userId: string;
  questionId: string;
  responseGroupId: string;
  optionId?: string;
  answerText?: string;
  answerNumber?: number;
  answerBoolean?: boolean;
  answerMetadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

import { mockQuestions, mockAssessmentResult } from '../mock/mockData';

/**
 * Fetches questions for the assessment
 * @returns Promise resolving to an array of Questions
 */
export const fetchQuestions = async (): Promise<Question[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockQuestions;
};

/**
 * Creates a new assessment session
 * @returns Promise resolving to session data with an ID
 */
export const createSession = async (): Promise<{ id: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    id: `session-${Date.now()}`
  };
};

/**
 * Submits an answer for a specific question in the assessment
 * @param sessionId The ID of the current assessment session
 * @param answer The user's answer data
 * @returns Promise resolving to the stored answer
 */
export const submitAnswer = async (
  sessionId: string,
  answer: UserAnswer
): Promise<UserAnswer> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log(`Answer submitted for session ${sessionId}:`, answer);
  return answer;
};

/**
 * Gets the assessment results for a completed session
 * @param sessionId The ID of the assessment session
 * @returns Promise resolving to the assessment results
 */
export const getAssessmentResults = async (
  sessionId: string
): Promise<AssessmentResult> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(`Getting results for session ${sessionId}`);
  return mockAssessmentResult;
};
