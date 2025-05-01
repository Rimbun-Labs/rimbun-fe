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
  questionType?: 'multiple_choice' | 'number' | 'boolean' | 'select';
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
  categoryScores?: {
    [category: string]: {
      score: number;
      maxScore: number;
      percentage: number;
      confidence: number;
      description?: string;
    };
  };
  directInputs?: {
    riskCapacity: number;
    investmentHorizon: number;
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
