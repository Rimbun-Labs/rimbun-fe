export interface Question {
  id: string;
  questionText: string;
  whyWeAsk: string;
  questionType: 'multiple_choice' | 'number' | 'boolean' | 'select';
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
  questionType?: 'multiple_choice' | 'number' | 'boolean' | 'select';
}

export interface AssessmentResult {
  id: string;
  responseGroupId: string;
  scoreData: {
    profile: string;
    finalScore: number;
    riskProfile: number;
    directInputs: {
      age: number;
      riskCapacity: number;
      totalSavings: string;
      financialGoal: string;
      monthlyIncome: string;
      investmentHorizon: number;
    };
    riskCapacity: number;
    knowledgeLevel: number;
    leverageAptitude: number;
    personalityScore: number;
    confidenceMetrics: {
      personalityConfidence: number;
      riskProfileConfidence: number;
      riskCapacityConfidence: number;
      decisionStyleConfidence: number;
      knowledgeLevelConfidence: number;
      leverageAptitudeConfidence: number;
    };
    investmentHorizon: number;
    overallConfidence: number;
    decisionStyleScore: number;
    personalityDeviation: number;
    decisionStyleDeviation: number;
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

export type AssessmentResults = AssessmentResult;
