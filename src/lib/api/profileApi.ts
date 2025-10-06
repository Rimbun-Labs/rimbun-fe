
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
    const response = await fetch(`${config.API_BASE_URL}/users/${userId}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch profile');
    }

    return await response.json();
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
    const response = await fetch(`${config.API_BASE_URL}/users/${userId}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    return await response.json();
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
    const response = await fetch(`${config.API_BASE_URL}/users/${userId}/assessments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch assessment history');
    }

    return await response.json();
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
    const response = await fetch(`${config.API_BASE_URL}/users/${userId}/learning-progress`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch learning progress');
    }

    return await response.json();
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

    const response = await fetch(`${config.API_BASE_URL}/users/profile-picture`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload profile picture');
    }

    const result = await response.json();
    return result.profilePictureUrl;
  } catch (error) {
    console.error('Failed to upload profile picture:', error);
    throw error;
  }
};
