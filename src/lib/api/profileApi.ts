
import { mockUserProfile } from '../mock/mockProfileData';

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  profilePicture?: string;
  financialProfile: {
    riskProfile: string;
    knowledgeLevel: string;
    investmentHorizon: number;
    riskCapacity: number;
    leverageAptitude: number;
  };
  preferences: {
    notificationSettings: {
      email: boolean;
      push: boolean;
      marketing: boolean;
    };
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
  learningProgress: {
    completedModules: number;
    totalModules: number;
    currentModule?: string;
    achievements: Array<{
      id: string;
      name: string;
      description: string;
      unlocked: boolean;
      unlockedAt?: string;
    }>;
  };
  assessmentHistory: Array<{
    id: string;
    date: string;
    type: string;
    score: number;
    profile: string;
  }>;
}

export const getProfile = async (): Promise<UserProfile> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockUserProfile;
};

export const updateProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { ...mockUserProfile, ...data };
};

export const getAssessmentHistory = async (): Promise<Array<{
  id: string;
  date: string;
  type: string;
  score: number;
  profile: string;
}>> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockUserProfile.assessmentHistory;
};

export const getLearningProgress = async (): Promise<{
  completedModules: number;
  totalModules: number;
  currentModule?: string;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
    unlockedAt?: string;
  }>;
}> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return mockUserProfile.learningProgress;
};

export const updateProfilePicture = async (file: File): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  // In a real implementation, this would upload the file to a storage service
  return URL.createObjectURL(file);
};
