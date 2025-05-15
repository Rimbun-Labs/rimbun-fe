import { AssessmentResult } from './types/assessment';
import { mockAssessmentResult } from '../mock/mockData';

export const getAssessmentResults = async (responseGroupId: string): Promise<AssessmentResult> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockAssessmentResult;
};

export const getPerformanceMetrics = async (userId: string): Promise<{
  learningProgress: {
    completedModules: number;
    totalModules: number;
    currentStreak: number;
    averageScore: number;
  };
  assessmentHistory: Array<{
    date: string;
    score: number;
    profile: string;
  }>;
  portfolioMetrics: {
    riskAdjustedReturn: number;
    sharpeRatio: number;
    volatility: number;
    maxDrawdown: number;
  };
}> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return {
    learningProgress: {
      completedModules: 3,
      totalModules: 10,
      currentStreak: 5,
      averageScore: 82
    },
    assessmentHistory: [
      {
        date: "2024-01-15",
        score: 65,
        profile: "MODERATE"
      },
      {
        date: "2024-02-15",
        score: 68,
        profile: "MODERATE"
      },
      {
        date: "2024-03-15",
        score: 72,
        profile: "MODERATE"
      },
      {
        date: "2024-04-15",
        score: 75,
        profile: "MODERATE_AGGRESSIVE"
      }
    ],
    portfolioMetrics: {
      riskAdjustedReturn: 7.2,
      sharpeRatio: 0.68,
      volatility: 12.4,
      maxDrawdown: 8.5
    }
  };
};

export const getAchievements = async (userId: string): Promise<Array<{
  id: string;
  name: string;
  description: string;
  category: 'LEARNING' | 'ASSESSMENT' | 'PORTFOLIO';
  progress: number;
  target: number;
  unlocked: boolean;
  unlockedAt?: string;
  icon: string;
  rewards?: {
    type: string;
    value: string;
  };
}>> => {
  await new Promise(resolve => setTimeout(resolve, 550));
  return [
    {
      id: "ach1",
      name: "Risk Profile Master",
      description: "Complete your risk assessment with high confidence",
      category: "ASSESSMENT",
      progress: 100,
      target: 100,
      unlocked: true,
      unlockedAt: "2024-04-15T14:30:00Z",
      icon: "trophy",
      rewards: {
        type: "badge",
        value: "Gold Badge"
      }
    },
    {
      id: "ach2",
      name: "Learning Champion",
      description: "Complete 5 learning modules",
      category: "LEARNING",
      progress: 40,
      target: 100,
      unlocked: false,
      icon: "book"
    },
    {
      id: "ach3",
      name: "Diversification Expert",
      description: "Create a well-balanced portfolio",
      category: "PORTFOLIO",
      progress: 75,
      target: 100,
      unlocked: false,
      icon: "chart"
    },
    {
      id: "ach4",
      name: "Knowledge Seeker",
      description: "Score above 85% on financial literacy test",
      category: "ASSESSMENT",
      progress: 90,
      target: 100,
      unlocked: true,
      unlockedAt: "2024-04-10T09:15:00Z",
      icon: "award",
      rewards: {
        type: "points",
        value: "+25 pts"
      }
    },
    {
      id: "ach5",
      name: "Market Timer",
      description: "Successfully time market movements",
      category: "PORTFOLIO",
      progress: 30,
      target: 100,
      unlocked: false,
      icon: "chart"
    }
  ];
};
