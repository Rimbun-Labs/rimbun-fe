import { apiClient } from './client';
import { config } from './config';
import type { UserProfileDto, SingleViewProfileResponse } from './types/singleViewProfile';
import type { NeedsAndGapsDto } from './types/needsAndGaps';
import type { EconomicProfileDto } from './types/economicProfile';

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  profilePicture?: string;
  authProviderId?: string;
  authProviderType?: string;
  isActive?: boolean;
  role?: string;
  lastLoginAt?: string;
  // Enhanced financial profile (numeric values, not strings)
  financialProfile: {
    riskProfile: number;        // 0-100 (changed from string)
    knowledgeLevel: number;      // 0-100 (changed from string)
    decisionStyleScore: number;  // 0-100 (new field)
    leverageAptitude: number;
    riskCapacity: number;
    investmentHorizon: number;
    profile: string;            // e.g., "Balanced Investor" (new field)
    overallConfidence: number;   // 0-1 (new field)
    lastUpdated: string | null; // ISO date string (new field)
  };
  // New field: Latest assessment details
  latestAssessment?: {
    sessionId: string;
    completedAt: string;        // ISO date string
    profile: string;
    scores: {
      riskProfile: number;
      knowledgeLevel: number;
      decisionStyleScore: number;
      leverageAptitude: number;
      riskCapacity: number;
      investmentHorizon: number;
      personalityScore: number;
      finalScore: number;
    };
    confidence: {
      overallConfidence: number;
      riskProfileConfidence: number;
      knowledgeLevelConfidence: number;
      leverageAptitudeConfidence: number;
      decisionStyleConfidence: number;
      personalityConfidence: number;
      riskCapacityConfidence: number;
      investmentProfileConfidence: number;
      diversificationConfidence?: number;
    };
    directInputs?: {
      age?: number;
      financialGoal?: string;
      monthlyIncome?: string;
      totalSavings?: string;
      targetAmount?: number;
      monthlyInvestable?: number;
      investmentHorizon?: number;
      riskCapacity?: number;
    };
  };
  // Enhanced assessment history
  assessmentHistory: Array<{
    sessionId: string;        // New field
    id: string;
    date: string;              // ISO date string
    type: string;              // "ONBOARDING", "MONTHLY_CHECKUP", etc.
    score: number;             // finalScore
    profile: string;
    riskProfile: number;       // New field (numeric)
    knowledgeLevel: number;    // New field (numeric)
  }>;
  // New field: Summary stats
  summary?: {
    totalAssessments: number;
    hasActiveProfile: boolean;
  };
  preferences: {
    notificationSettings?: {
      email: boolean;
      push: boolean;
      marketing: boolean;
    };
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    notifications?: boolean;
  };
  learningProgress: {
    completedModules?: number;
    totalModules?: number;
    currentModule?: string;
    achievements?: Array<{
      id: string;
      name: string;
      description: string;
      unlocked: boolean;
      unlockedAt?: string;
    }>;
    completedAssessments?: number;  // New field from backend
    lastAssessmentDate?: string | null;  // New field from backend
  };
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
        riskProfile: 0,
        knowledgeLevel: 0,
        decisionStyleScore: 0,
        leverageAptitude: 0,
        riskCapacity: 0,
        investmentHorizon: 0,
        profile: 'Not Assessed',
        overallConfidence: 0,
        lastUpdated: null
      },
      preferences: {
        theme: 'system',
        language: 'en',
        notifications: true
      },
      learningProgress: {
        completedModules: 0,
        totalModules: 0,
        completedAssessments: 0,
        lastAssessmentDate: null,
        achievements: []
      },
      assessmentHistory: [],
      summary: {
        totalAssessments: 0,
        hasActiveProfile: false
      }
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

    // Backend uses /users/me with @CurrentUser() - extracts user from auth token
    // Consistent with DELETE /users/me and PUT /subscription/me
    const response = await apiClient.put(`/users/me`, data);

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

/**
 * Single-view profile: GET /api/v1/profile
 * Returns identity, assessment, spending, goals, banking, statementAccount in one call.
 * Auth: Bearer token (same as other endpoints). Each section can be null.
 */
export const getSingleViewProfile = async (): Promise<UserProfileDto> => {
  const response = await apiClient.get<SingleViewProfileResponse>('/profile');
  return response.data.data;
};

/**
 * Profile needs and gaps: GET /api/v1/profile/needs
 * Returns prioritized list of gaps (assessment, goals, emergency fund, etc.) for dashboard "things to do".
 */
export const getProfileNeeds = async (): Promise<NeedsAndGapsDto> => {
  const response = await apiClient.get<{ data: NeedsAndGapsDto }>('/profile/needs');
  return response.data.data;
};

/**
 * Economic profile: GET /api/v1/profile/economic
 * Returns user's employment context and dependents for purpose engine.
 */
export const getEconomicProfile = async (): Promise<EconomicProfileDto | null> => {
  const response = await apiClient.get<{ data: EconomicProfileDto | null }>('/profile/economic');
  return response.data.data;
};

/**
 * Upsert economic profile: PUT /api/v1/profile/economic
 * Backend normalizes employmentType, dependents, plannedRetirementAge.
 */
export const upsertEconomicProfile = async (
  payload: EconomicProfileDto
): Promise<EconomicProfileDto> => {
  const response = await apiClient.put<{ data: EconomicProfileDto }>(
    '/profile/economic',
    payload
  );
  return response.data.data;
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
