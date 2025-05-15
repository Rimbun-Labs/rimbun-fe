export type QuestionType = 'number' | 'multiple_choice' | 'select' | 'boolean' | 'single_text';

export interface Question {
  id: string;
  questionType: QuestionType;
  questionText: string;
  whyWeAsk: string;
  category: {
    id: string;
    name: string;
    description: string;
  };
  options?: Array<{
    id: string;
    optionLabel: string;
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
  questionType?: QuestionType;
}

export interface AssessmentResult {
  id: string;
  responseGroupId: string;
  scoreData: {
    // Primary Metrics (all numbers 0-100)
    riskProfile: number;          // Risk tolerance score
    knowledgeLevel: number;       // Financial knowledge score
    leverageAptitude: number;     // Leverage comfort score
    riskCapacity: number;         // Risk capacity score
    investmentHorizon: number;    // Investment horizon score

    // Style Scores
    decisionStyleScore: number;   // Decision-making approach
    decisionStyleDeviation: number; // Consistency in decision style
    personalityScore: number;     // Personality traits
    personalityDeviation: number; // Consistency in personality

    // Optional Direct Inputs
    directInputs?: {
      age?: number;
      financialGoal?: string;
      monthlyIncome?: string;
      totalSavings?: string;
    };

    // Optional Confidence Metrics (all numbers 0-1)
    confidenceMetrics?: {
      riskProfileConfidence: number;
      knowledgeLevelConfidence: number;
      leverageAptitudeConfidence: number;
      decisionStyleConfidence: number;
      personalityConfidence: number;
      riskCapacityConfidence: number;
    };

    // Final Results
    finalScore: number;          // Final weighted score (0-100)
    profile: string;             // One of: "Advanced Balanced Investor", "Balanced Investor", "Opportunistic Investor", "Conservative Investor"
    overallConfidence: number;   // Overall confidence level (0-1)
  };
  createdAt: string;
  updatedAt: string;
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

export interface CreateResponseGroupRequest {
  questionnaireType: "ONBOARDING";
  userId?: string;
  metadata?: Record<string, any>;
  description?: string;
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

export interface SaveUserResponseRequest {
  responseGroupId: string;
  questionId: string;
  answer: string; // Enforce string type here
  metadata?: Record<string, any>;
}

export type AssessmentResults = AssessmentResult;

export interface UserSession {
  id: string;
  userId: string;
  questionnaireType: string;
  description?: string;
  createdAt: string;
  scoreData?: {
    profile: string;
    finalScore: number;
    // ... other score data
  };
}

import { RecommendedMetricsWithWeights } from './metrics';

export interface RecommendationResponse {
  recommendationCalculationData: {
    riskAssessment: number;
    financialKnowledge: number;
    investmentHorizon: number;
    liquidityNeeds: number;
    incomeNeeds: number;
    behavioralStyle: number;
    investmentGoal: {
      EQUITIES: number;
      BONDS: number;
      REAL_ESTATE: number;
      CASH: number;
    };
  };
  initialAssetClassScores: {
    EQUITIES: number;
    BONDS: number;
    REAL_ESTATE: number;
    CASH: number;
  };
  adjustedAllocations: {
    EQUITIES: number;
    BONDS: number;
    REAL_ESTATE: number;
    CASH: number;
  };
  recommendedMetrics: RecommendedMetricsWithWeights;
}
