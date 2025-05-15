import { AssessmentResult } from '../api/assessmentApi';
import { mockQuestions } from './mockQuestions';

export { mockQuestions };

export const mockAssessmentResult: AssessmentResult = {
  // Primary Metrics
  riskProfile: 75,
  knowledgeLevel: 65,
  leverageAptitude: 70,
  riskCapacity: 70,
  investmentHorizon: 10,

  // Style Scores
  decisionStyleScore: 80,
  decisionStyleDeviation: 0.12,
  personalityScore: 85,
  personalityDeviation: 0.15,

  // Direct Inputs
  directInputs: {
    age: 30,
    financialGoal: "Retirement",
    monthlyIncome: "5000",
    totalSavings: "50000"
  },

  // Confidence Metrics
  confidenceMetrics: {
    riskProfileConfidence: 0.85,
    knowledgeLevelConfidence: 0.80,
    leverageAptitudeConfidence: 0.75,
    decisionStyleConfidence: 0.90,
    personalityConfidence: 0.85,
    riskCapacityConfidence: 0.95
  },

  // Final Results
  finalScore: 75,
  profile: "Balanced Investor",
  overallConfidence: 0.82
};

export const mockPortfolioAllocation = {
  EQUITIES: 60,
  BONDS: 25,
  CASH: 10,
  ALTERNATIVES: 5
};

// Update mockLearningModules to include all required fields
export const mockLearningModules = [
  {
    id: "module1",
    title: "Investment Basics",
    description: "Learn fundamental concepts about investing",
    progress: 100,
    totalLessons: 5,
    completedLessons: 5,
    duration: 30,
    difficulty: "BEGINNER" as const,
    isLocked: false,
    imageUrl: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "module2",
    title: "Stock Market Fundamentals",
    description: "Understanding how stocks work",
    progress: 60,
    totalLessons: 10,
    completedLessons: 6,
    duration: 45,
    difficulty: "INTERMEDIATE" as const,
    isLocked: false,
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "module3",
    title: "Fixed Income Securities",
    description: "Learn about bonds and other fixed income investments",
    progress: 20,
    totalLessons: 5,
    completedLessons: 1,
    duration: 25,
    difficulty: "INTERMEDIATE" as const,
    isLocked: false,
    imageUrl: "https://images.unsplash.com/photo-1579621970590-9d624316904b?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "module4",
    title: "Portfolio Diversification",
    description: "Strategies for building a balanced portfolio",
    progress: 0,
    totalLessons: 4,
    completedLessons: 0,
    duration: 60,
    difficulty: "ADVANCED" as const,
    isLocked: false,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000"
  }
];

export const mockRecommendations = [
  {
    id: "rec1",
    title: "Increase Your Emergency Fund",
    description: "We recommend building up 3-6 months of living expenses in a high-yield savings account.",
    priority: "High",
    category: "Financial Planning"
  },
  {
    id: "rec2",
    title: "Consider Index Funds",
    description: "Based on your profile, low-cost index funds would be a good fit for your investment style.",
    priority: "Medium",
    category: "Investment Strategy"
  },
  {
    id: "rec3",
    title: "Learn About ETFs",
    description: "Complete our ETF learning module to understand this investment vehicle that aligns with your goals.",
    priority: "Medium",
    category: "Education"
  }
];
