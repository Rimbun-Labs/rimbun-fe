
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

export interface SubmitAnswerRequest {
  responseGroupId: string;
  questionId: string;
  answer: {
    value?: string;
    selectedOption?: { id: string };
    answerNumber?: number;
    answerBoolean?: boolean;
  };
}

export const submitAnswer = async (data: SubmitAnswerRequest): Promise<UserResponse> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    id: `response-${Date.now()}-${Math.random()}`,
    userId: "mock-user-id",
    questionId: data.questionId,
    responseGroupId: data.responseGroupId,
    optionId: data.answer.selectedOption?.id,
    answerText: data.answer.value,
    answerNumber: data.answer.answerNumber,
    answerBoolean: data.answer.answerBoolean,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export interface CreateResponseGroupRequest {
  questionnaireType: "ONBOARDING";
  userId?: string;
  metadata?: Record<string, any>;
}

export interface QuestionsWithAnswersResponse {
  responseGroupId: string;
  questionsWithAnswers: Array<{
    id: string;
    text: string;
    questionType: string;
    category: {
      id: string;
      name: string;
    };
    answer: {
      id: string;
      value?: string;
      selectedOption?: {
        id: string;
        text: string;
      };
    };
    optionMetadata?: {
      points: number;
      profileType: number;
      decisionStyle: number;
      confidenceScore: number;
    };
  }>;
}

export interface RecommendationResult {
  assetAllocations: Record<string, number>;
  recommendedMetrics: {
    [key: string]: {
      weight: number;
      description: string;
    };
  };
}

export interface SaveUserResponsesBulkRequest {
  responseGroupId: string;
  responses: Array<{
    questionId: string;
    answer: {
      value?: string;
      selectedOption?: { id: string };
      answerNumber?: number;
      answerBoolean?: boolean;
    };
  }>;
}

import { mockQuestions, mockAssessmentResult } from '../mock/mockData';

/**
 * Creates a new assessment session
 */
export const createSession = async (data?: CreateResponseGroupRequest): Promise<ResponseGroup> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    id: `response-group-${Date.now()}`,
    userId: data?.userId || "mock-user-id",
    questionnaireType: data?.questionnaireType || "ONBOARDING",
    isCompleted: false,
    metadata: data?.metadata || {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

/**
 * Submits multiple answers for an assessment
 */
export const saveUserResponsesBulk = async (data: SaveUserResponsesBulkRequest): Promise<UserResponse[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return data.responses.map(response => ({
    id: `response-${Date.now()}-${Math.random()}`,
    userId: "mock-user-id",
    questionId: response.questionId,
    responseGroupId: data.responseGroupId,
    optionId: response.answer.selectedOption?.id,
    answerText: response.answer.value,
    answerNumber: response.answer.answerNumber,
    answerBoolean: response.answer.answerBoolean,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
};

/**
 * Gets all answered questions for a response group
 */
export const getQuestionsWithAnswers = async (responseGroupId: string): Promise<QuestionsWithAnswersResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    responseGroupId,
    questionsWithAnswers: mockQuestions.map(q => ({
      id: q.id,
      text: q.questionText,
      questionType: q.questionType,
      category: {
        id: q.category.id,
        name: q.category.name
      },
      answer: {
        id: `answer-${q.id}`,
        value: q.questionType === "number" ? "1000" : undefined,
        selectedOption: q.questionType === "multiple_choice" && q.options?.length > 0
          ? { id: q.options[0].id, text: q.options[0].text }
          : undefined
      },
      optionMetadata: q.questionType === "multiple_choice"
        ? {
            points: 70,
            profileType: 70,
            decisionStyle: 75,
            confidenceScore: 85
          }
        : undefined
    }))
  };
};

/**
 * Gets assessment results for a response group
 */
export const getAssessmentResults = async (responseGroupId: string): Promise<AssessmentResult> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockAssessmentResult;
};

/**
 * Gets recommendations based on assessment results
 */
export const getRecommendations = async (responseGroupId: string): Promise<RecommendationResult> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    assetAllocations: {
      EQUITIES: 60,
      BONDS: 20,
      REAL_ESTATE: 10,
      CASH: 10
    },
    recommendedMetrics: {
      "Risk-Adjusted Return": {
        weight: 0.8,
        description: "Measure of return relative to risk taken"
      },
      "Sharpe Ratio": {
        weight: 0.7,
        description: "Risk-adjusted return metric"
      }
    }
  };
};
