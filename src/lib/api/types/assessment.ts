export type QuestionType = 'number' | 'multiple_choice' | 'select' | 'boolean' | 'single_text' | 'slider';

export interface SliderConfig {
  min: number;
  max: number;
  step: number;
  unit: string;
  format: 'currency' | 'percentage' | 'number';
}

export interface Question {
  id: string;
  questionText: string;
  whyWeAsk: string;
  questionType: QuestionType;
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
  answer?: {
    value: number | string | boolean;
    text?: string;
  };
  sliderConfig?: SliderConfig;
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
      targetAmount?: number;
      monthlyInvestable?: number;
      investmentHorizon?: number;
    };

    // Optional Confidence Metrics (all numbers 0-1)
    confidenceMetrics?: {
      riskProfileConfidence: number;
      knowledgeLevelConfidence: number;
      leverageAptitudeConfidence: number;
      decisionStyleConfidence: number;
      personalityConfidence: number;
      riskCapacityConfidence: number;
      investmentProfileConfidence: number;
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
    questionText: string;
    whyWeAsk: string;
    questionType: QuestionType;
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
    sliderConfig?: SliderConfig;
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

export interface AssetAllocations {
  equities: number;
  bonds: number;
  realEstate: number;
  cash: number;
}

export interface RecommendationResponse {
  recommendationCalculationData: {
    riskAssessment: number;
    financialKnowledge: number;
    investmentHorizon: number;
    liquidityNeeds: number;
    incomeNeeds: number;
    behavioralStyle: number;
    investmentGoal: AssetAllocations;
    goalGapInsights?: {
      currentGap: number;
      requiredMonthlySavings: number;
      currentSavingsRate: number;
      projectedTimeToGoal: number;
      goalAchievabilityScore: number;
      recommendations: {
        primaryAction: 'increase_savings' | 'adjust_strategy' | 'extend_timeline' | 'on_track';
        message: string;
        suggestedMonthlySavings?: number;
        suggestedStrategy?: 'more_aggressive' | 'more_conservative' | 'maintain';
      };
      investmentScenarios?: {
        conservative: {
          name: string;
          baseAmount: number;
          monthlyContribution: number;
          projectedAmount: number;
          timeToGoal: number;
          isRealistic: boolean;
          requiredMonthlySavings?: number;
          currentSavingsRate?: number;
        };
        aggressive: {
          name: string;
          baseAmount: number;
          monthlyContribution: number;
          projectedAmount: number;
          timeToGoal: number;
          isRealistic: boolean;
          requiredMonthlySavings?: number;
          currentSavingsRate?: number;
        };
      };
    };
  };
  initialAssetClassScores: AssetAllocations;
  adjustedAllocations: AssetAllocations;
  recommendedMetrics: RecommendedMetricsWithWeights;
  diversificationAnalysis?: {
    diversificationScore: number;      // 0-1
    riskAdjustedVolatility: number;
    recommendations: string[];
    correlationMatrix: Record<string, Record<string, number>>;
  };
}

export type AssessmentResults = AssessmentResult;

export interface UserSession {
  id: string;
  userId: string;
  questionnaireType: string;
  description?: string;
  createdAt: string;
  isCompleted: boolean | null;
  scoreData?: {
    profile: string;
    finalScore: number;
    // ... other score data
  };
}

import { RecommendedMetricsWithWeights } from './metrics';

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
