
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
