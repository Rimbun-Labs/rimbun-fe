import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ResponseGroup } from '@/lib/api/types/assessment';
import { getAssessmentResults } from '@/lib/api/assessmentApi';
import { isAssessmentComplete } from '@/utils/assessmentValidation';
import { userService } from '@/lib/api/userService';
import { useAuth } from './AuthContext';
import { storageUtils } from '@/lib/storage/storageUtils';
import { initializeEnvironmentStorage } from '@/utils/environmentStorage';
import apiClient from '@/lib/api/client';

interface SessionContextType {
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  session: ResponseGroup | null;
  setSession: (session: ResponseGroup | null) => void;
  clearSession: () => void;
  isLoading: boolean;
  hasCompletedAssessment: () => Promise<{ hasAssessment: boolean; sessionId?: string; isIncomplete?: boolean }>;
  isReady: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<ResponseGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [storageReady, setStorageReady] = useState(false);
  const { userRegistrationComplete, loading: authLoading } = useAuth();

  // Initialize environment-aware storage and hydrate sessionId
  useEffect(() => {
    initializeEnvironmentStorage();
    const savedSessionId = storageUtils.getItem('assessmentSessionId');
    if (savedSessionId) {
      setSessionId(savedSessionId);
    }
    setStorageReady(true);
  }, []);

  // Keep storage in sync with sessionId
  useEffect(() => {
    if (!storageReady) return;

    if (sessionId) {
      storageUtils.setItem('assessmentSessionId', sessionId);
    } else {
      storageUtils.removeItem('assessmentSessionId');
    }
  }, [sessionId, storageReady]);

  const fetchResumeData = async (responseGroupId: string) => {
    try {
      const response = await apiClient.get(
        `/user-responses/session/${responseGroupId}/resume`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  };

  // Fetch session data when prerequisites are ready
  useEffect(() => {
    if (!storageReady) {
      return;
    }

    let retryTimeout: ReturnType<typeof setTimeout> | null = null;

    const fetchSessionData = async () => {
      if (!sessionId) {
        setIsLoading(false);
        setSession(null);
        return;
      }

      if (authLoading) {
        console.log('⏳ SessionContext: Auth still loading, waiting...');
        return;
      }

      if (!userRegistrationComplete) {
        console.log('⚠️ SessionContext: User registration not complete yet, waiting...');
        return;
      }

      setIsLoading(true);

      const databaseUserId = userService.getDatabaseUserId();
      if (!databaseUserId) {
        console.log('⚠️ SessionContext: No database user ID found, retrying...');
        retryTimeout = setTimeout(fetchSessionData, 150);
        return;
      }

      try {
        const resumeData = await fetchResumeData(sessionId);

        if (!resumeData || !resumeData.isCompleted) {
          console.log('ℹ️ SessionContext: Session incomplete, skipping score fetch');
          setSession(null);
          setIsLoading(false);
          return;
        }

        const results = await getAssessmentResults(sessionId);

        if (isAssessmentComplete(results)) {
          setSession({
            id: sessionId,
            userId: results.responseGroupId,
            questionnaireType: "ONBOARDING",
            isCompleted: true,
            metadata: {
              score: results.scoreData.finalScore,
              profile: results.scoreData.profile,
              riskProfile: results.scoreData.riskProfile,
              knowledgeLevel: results.scoreData.knowledgeLevel,
              leverageAptitude: results.scoreData.leverageAptitude,
              riskCapacity: results.scoreData.riskCapacity,
              investmentHorizon: results.scoreData.investmentHorizon,
              overallConfidence: results.scoreData.overallConfidence
            },
            createdAt: results.createdAt,
            updatedAt: results.updatedAt
          });
        } else {
          console.log('⚠️ SessionContext: Assessment data incomplete');
          setSession(null);
        }
      } catch (error) {
        console.error('Failed to fetch session data:', error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionData();

    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [sessionId, userRegistrationComplete, authLoading, storageReady]);

  const clearSession = () => {
    setSessionId(null);
    setSession(null);
    storageUtils.removeItem('assessmentSessionId');
  };

  // Function to check if user has completed an assessment - NO API CALL
  const hasCompletedAssessment = async (): Promise<{ hasAssessment: boolean; sessionId?: string; isIncomplete?: boolean }> => {
    // Use the session state directly - no API call needed
    if (session?.isCompleted && session?.id) {
      console.log('✅ hasCompletedAssessment: Using cached session data');
      return { hasAssessment: true, sessionId: session.id };
    } else if (session && !session.isCompleted && session.id) {
      // Session exists but is incomplete
      return { hasAssessment: true, sessionId: session.id, isIncomplete: true };
    } else {
      // No session or no assessment
      return { hasAssessment: false };
    }
  };

  const isReady = storageReady && !isLoading;

  return (
    <SessionContext.Provider value={{ 
      sessionId, 
      setSessionId, 
      session, 
      setSession, 
      clearSession,
      isLoading,
      hasCompletedAssessment,
      isReady
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};