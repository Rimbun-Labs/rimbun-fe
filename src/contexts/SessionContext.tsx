import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { ResponseGroup } from '@/lib/api/types/assessment';
import { getAssessmentResults, getLatestAssessmentResults } from '@/lib/api/assessmentApi';
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
  
  // Shared in-flight promise to prevent duplicate API calls
  const assessmentCheckPromiseRef = useRef<Promise<{ hasAssessment: boolean; sessionId?: string; isIncomplete?: boolean }> | null>(null);

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

        if (resumeData && !resumeData.isCompleted) {
          console.log('ℹ️ SessionContext: Session incomplete, skipping score fetch');
          setSession(null);
          setIsLoading(false);
          return;
        }

        if (!resumeData) {
          console.log('ℹ️ SessionContext: No resume data found, falling back to score endpoint for completed session');
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

  // Helper function to create session data from assessment results
  const createSessionFromResults = (results: any): ResponseGroup => {
    return {
      id: results.responseGroupId,
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
    };
  };

  // Function to check if user has completed an assessment
  // Checks cache first, then queries database if needed
  const hasCompletedAssessment = async (): Promise<{ hasAssessment: boolean; sessionId?: string; isIncomplete?: boolean }> => {
    // Fast path: Check cached session first
    if (session?.isCompleted && session?.id) {
      console.log('✅ hasCompletedAssessment: Using cached session data');
      return { hasAssessment: true, sessionId: session.id };
    } else if (session && !session.isCompleted && session.id) {
      // Session exists but is incomplete
      return { hasAssessment: true, sessionId: session.id, isIncomplete: true };
    }

    // If we have an in-flight promise, return it to prevent duplicate calls
    if (assessmentCheckPromiseRef.current) {
      console.log('⏳ hasCompletedAssessment: Reusing in-flight check');
      return assessmentCheckPromiseRef.current;
    }

    // Check prerequisites before querying database
    if (!userRegistrationComplete || authLoading) {
      console.log('⏳ hasCompletedAssessment: Waiting for auth to complete');
      return { hasAssessment: false };
    }

    const databaseUserId = userService.getDatabaseUserId();
    if (!databaseUserId) {
      console.log('⚠️ hasCompletedAssessment: No database user ID found');
      return { hasAssessment: false };
    }

    // Create the promise for database query
    const checkPromise = (async () => {
      try {
        console.log('🔍 hasCompletedAssessment: Querying database for completed assessment');
        const latestResults = await getLatestAssessmentResults();
        
        if (!latestResults) {
          console.log('ℹ️ hasCompletedAssessment: No completed assessment found in database');
          return { hasAssessment: false };
        }

        const foundSessionId = latestResults.responseGroupId;
        console.log('✅ hasCompletedAssessment: Found completed assessment in database:', foundSessionId);

        // Create session data from results
        const sessionData = createSessionFromResults(latestResults);

        // Set both session and sessionId together to keep them in sync
        setSession(sessionData);
        setSessionId(foundSessionId);

        return { hasAssessment: true, sessionId: foundSessionId };
      } catch (error) {
        console.error('❌ hasCompletedAssessment: Error querying database:', error);
        // Return false on error - safe fallback
        return { hasAssessment: false };
      } finally {
        // Clear the in-flight promise
        assessmentCheckPromiseRef.current = null;
      }
    })();

    // Store the promise so concurrent calls can reuse it
    assessmentCheckPromiseRef.current = checkPromise;
    
    return checkPromise;
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