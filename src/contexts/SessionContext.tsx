import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ResponseGroup } from '@/lib/api/types/assessment';
import { getAssessmentResults, getUserSessions as getUserSessionsByUserId } from '@/lib/api/assessmentApi';
import { getAssessmentResumeStatus } from '@/utils/assessmentValidation';
import { userService } from '@/lib/api/userService';
import { useAuth } from './AuthContext';

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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<ResponseGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userRegistrationComplete, loading: authLoading } = useAuth();

  // Load session from localStorage on mount - WITH STALE DATA CLEANUP
  useEffect(() => {
    // Clear any stale localStorage data from previous environments
    const staleKeys = ['assessmentSessionId', 'databaseUserId', 'hasSeenWelcome'];
    staleKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        console.log(`🧹 Clearing stale localStorage data: ${key}`);
        localStorage.removeItem(key);
      }
    });

    // Now check for current session
    const savedSessionId = localStorage.getItem('assessmentSessionId');
    if (savedSessionId) {
      setSessionId(savedSessionId);
    }
  }, []);

  // Fetch session data when sessionId changes
  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // ✅ FIXED: Wait for auth loading to complete before checking sessions
        if (authLoading) {
          console.log('⏳ SessionContext: Auth still loading, waiting...');
          setIsLoading(false);
          return;
        }
        
        // ✅ FIXED: Wait for user registration to complete before checking sessions
        if (!userRegistrationComplete) {
          console.log('⚠️ SessionContext: User registration not complete yet, waiting...');
          setIsLoading(false);
          return;
        }
        
               // ✅ FIXED: Use environment-aware storage instead of direct localStorage
               const databaseUserId = userService.getDatabaseUserId();
               if (!databaseUserId) {
                 console.log('⚠️ SessionContext: No database user ID found, retrying in 100ms...');
                 // Retry after a short delay in case localStorage hasn't been updated yet
                 setTimeout(() => {
                   const retryDatabaseUserId = userService.getDatabaseUserId();
                   if (retryDatabaseUserId) {
                     console.log('✅ SessionContext: Found database user ID on retry:', retryDatabaseUserId);
                     // Retry the session check
                     fetchSessionData();
                   } else {
                     console.log('⚠️ SessionContext: Still no database user ID found after retry');
                     setIsLoading(false);
                   }
                 }, 100);
                 return;
               }

        // ✅ FIXED: Use resume endpoint instead of user sessions endpoint
        const resumeData = await getAssessmentResumeStatus();
        
        if (resumeData?.isComplete && resumeData.sessionId === sessionId) {
          console.log('✅ SessionContext: Session is complete (resume endpoint confirmed), setting session');
          // Get results for metadata
          const results = await getAssessmentResults(sessionId);
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
          console.log('⚠️ SessionContext: Session exists but is incomplete (resume endpoint confirmed)');
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
  }, [sessionId, userRegistrationComplete, authLoading]);

  const clearSession = () => {
    setSessionId(null);
    setSession(null);
    localStorage.removeItem('assessmentSessionId');
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