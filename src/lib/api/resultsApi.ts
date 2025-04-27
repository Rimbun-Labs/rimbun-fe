
import { AssessmentResult, RecommendationResult } from './types/assessment';
import { mockAssessmentResult } from '../mock/mockData';

export const getAssessmentResults = async (responseGroupId: string): Promise<AssessmentResult> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockAssessmentResult;
};

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
