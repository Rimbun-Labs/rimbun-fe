import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAssessmentResults } from '@/lib/api/assessmentApi';
import { isAssessmentComplete } from '@/utils/assessmentValidation';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface ResponseGroup {
  id: string;
  userId: string;
  questionnaireType: string;
  isCompleted: boolean;
  metadata: {
    score: number;
    profile: string;
    riskProfile: number;
    knowledgeLevel: number;
    leverageAptitude: number;
    riskCapacity: number;
    investmentHorizon: number;
    overallConfidence: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface SessionContextType {
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  session: ResponseGroup | null;
  setSession: (session: ResponseGroup | null) => void;
  clearSession: () => void;
  isLoading: boolean;
  hasCompletedAssessment: () => Promise<{ hasAssessment: boolean; sessionId?: string; isIncomplete?: boolean }>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<ResponseGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Optimized localStorage hook for session ID
  const [sessionId, setSessionId] = useLocalStorage<string | null>(
    'assessmentSessionId',
    null,
    { debounceMs: 100 }
  );

  // Fetch session data when sessionId changes
  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const results = await getAssessmentResults(sessionId);
        
        // Use comprehensive assessment validation
        if (isAssessmentComplete(results)) {
          console.log('✅ SessionContext: Assessment is complete, setting session');
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
          console.log('⚠️ SessionContext: Assessment exists but is incomplete, not setting session');
          // Don't set session for incomplete assessments
        }
      } catch (error) {
        console.error('Failed to fetch session data:', error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  const clearSession = () => {
    setSessionId(null);
    setSession(null);
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

  return (
    <SessionContext.Provider value={{ 
      sessionId, 
      setSessionId, 
      session, 
      setSession, 
      clearSession,
      isLoading,
      hasCompletedAssessment
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