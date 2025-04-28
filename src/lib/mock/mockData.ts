
import { AssessmentResult } from '../api/assessmentApi';
import { mockQuestions } from './mockQuestions';

export { mockQuestions };

export const mockAssessmentResult: AssessmentResult = {
  riskProfile: 75,
  knowledgeLevel: 65,
  leverageAptitude: 70,
  decisionStyleScore: 80,
  personalityScore: 85,
  finalScore: 75,
  profile: "MODERATE",
  confidenceMetrics: {
    riskProfileConfidence: 0.85,
    knowledgeLevelConfidence: 0.80,
    leverageAptitudeConfidence: 0.75,
    decisionStyleConfidence: 0.90,
    personalityConfidence: 0.85,
    riskCapacityConfidence: 0.95
  },
  categoryScores: {
    "Risk Tolerance": {
      score: 35,
      maxScore: 50,
      percentage: 70,
      confidence: 0.85,
      description: "Measures your comfort level with investment volatility"
    },
    "Market Knowledge": {
      score: 32,
      maxScore: 50,
      percentage: 64,
      confidence: 0.80,
      description: "Evaluates your understanding of investment markets"
    },
    "Financial Goals": {
      score: 40,
      maxScore: 50,
      percentage: 80,
      confidence: 0.92,
      description: "Assesses your financial objectives"
    },
    "Investment Experience": {
      score: 28,
      maxScore: 40,
      percentage: 70,
      confidence: 0.75,
      description: "Gauges your previous investment experience"
    },
    "Decision Making": {
      score: 38,
      maxScore: 50,
      percentage: 76,
      confidence: 0.88,
      description: "Analyzes your investment decision-making process"
    }
  },
  directInputs: {
    riskCapacity: 7,
    investmentHorizon: 10
  }
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
