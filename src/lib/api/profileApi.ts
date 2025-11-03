import { apiClient } from './client';
import { config } from './config';

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

export const getProfile = async (userId: string): Promise<UserProfile> => {
  try {
    // Use Firebase UID, not database ID
    const { auth } = await import('../firebase/config');
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const response = await apiClient.get(`/users/me/${user.uid}`);
    
    if (!response.data) {
      throw new Error('No data received from the API');
    }

    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    // Return a default profile structure if API fails
    return {
      id: userId,
      displayName: '',
      email: '',
      financialProfile: {
        riskProfile: 'UNKNOWN',
        knowledgeLevel: 'BEGINNER',
        investmentHorizon: 0,
        riskCapacity: 0,
        leverageAptitude: 0
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
        completedModules: 0,
        totalModules: 0,
        achievements: []
      },
      assessmentHistory: []
    };
  }
};

export const updateProfile = async (userId: string, data: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    // Use Firebase UID, not database ID
    const { auth } = await import('../firebase/config');
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const response = await apiClient.put(`/users/me/${user.uid}`, data);

    if (!response.data) {
      throw new Error('No data received from the API');
    }

    return response.data.data;
  } catch (error) {
    console.error('Failed to update profile:', error);
    throw error;
  }
};

export const getAssessmentHistory = async (userId: string): Promise<Array<{
  id: string;
  date: string;
  type: string;
  score: number;
  profile: string;
}>> => {
  try {
    const response = await apiClient.get(`/users/${userId}/assessments`);

    if (!response.data) {
      return [];
    }

    return response.data;
  } catch (error) {
    console.error('Failed to fetch assessment history:', error);
    return [];
  }
};

export const getLearningProgress = async (userId: string): Promise<{
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
  try {
    // Use Firebase UID for quiz progress endpoint
    const { auth } = await import('../firebase/config');
    const user = auth.currentUser;
    
    if (!user) {
      return {
        completedModules: 0,
        totalModules: 0,
        achievements: []
      };
    }

    // Use the correct endpoint: /quiz/progress
    const response = await apiClient.get(`/quiz/progress?userId=${user.uid}`);

    if (!response.data) {
      return {
        completedModules: 0,
        totalModules: 0,
        achievements: []
      };
    }

    // Transform quiz progress to learning progress format
    const quizProgress = response.data;
    return {
      completedModules: quizProgress.completedQuizzes || 0,
      totalModules: quizProgress.totalQuizzes || 0,
      achievements: []
    };
  } catch (error) {
    console.error('Failed to fetch learning progress:', error);
    return {
      completedModules: 0,
      totalModules: 0,
      achievements: []
    };
  }
};

export const updateProfilePicture = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);

    // Use apiClient.post with FormData - apiClient will include Authorization header
    // Note: axios automatically handles FormData and sets Content-Type to multipart/form-data
    // Don't manually set Content-Type - let axios handle it for FormData
    const response = await apiClient.post<{ profilePictureUrl: string }>(
      '/users/profile-picture',
      formData
    );

    return response.data.profilePictureUrl;
  } catch (error: any) {
    console.error('Failed to upload profile picture:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to upload profile picture');
  }
};
