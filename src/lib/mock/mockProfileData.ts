
import { UserProfile } from '../api/profileApi';

export const mockUserProfile: UserProfile = {
  id: "user-1",
  displayName: "Alex Johnson",
  email: "alex.johnson@example.com",
  profilePicture: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150&q=80",
  financialProfile: {
    riskProfile: "MODERATE",
    knowledgeLevel: "INTERMEDIATE",
    investmentHorizon: 10,
    riskCapacity: 65,
    leverageAptitude: 40
  },
  preferences: {
    notificationSettings: {
      email: true,
      push: true,
      marketing: false
    },
    theme: 'system',
    language: 'en'
  },
  learningProgress: {
    completedModules: 2,
    totalModules: 8,
    currentModule: "Portfolio Diversification",
    achievements: [
      {
        id: "ach1",
        name: "First Steps",
        description: "Complete your first learning module",
        unlocked: true,
        unlockedAt: "2024-01-15T10:30:00Z"
      },
      {
        id: "ach2",
        name: "Knowledge Seeker",
        description: "Complete 2 learning modules",
        unlocked: true,
        unlockedAt: "2024-02-20T15:45:00Z"
      },
      {
        id: "ach3",
        name: "Risk Navigator",
        description: "Complete the risk assessment with high confidence",
        unlocked: true,
        unlockedAt: "2024-01-10T09:15:00Z"
      },
      {
        id: "ach4",
        name: "Portfolio Master",
        description: "Create your first portfolio",
        unlocked: false
      },
      {
        id: "ach5",
        name: "Diversification Expert",
        description: "Complete the diversification module with a perfect score",
        unlocked: false
      }
    ]
  },
  assessmentHistory: [
    {
      id: "assessment-1",
      date: "2024-01-10T09:00:00Z",
      type: "Initial Assessment",
      score: 65,
      profile: "MODERATE"
    },
    {
      id: "assessment-2",
      date: "2024-03-15T14:30:00Z",
      type: "Quarterly Review",
      score: 70,
      profile: "MODERATE"
    }
  ]
};
