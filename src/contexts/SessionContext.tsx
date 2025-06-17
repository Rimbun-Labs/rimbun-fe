import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ResponseGroup } from '@/lib/api/types/assessment';
import { getAssessmentResults } from '@/lib/api/assessmentApi';

interface SessionContextType {
  sessionId: string | null;
  setSessionId: (id: string) => void;
  session: ResponseGroup | null;
  setSession: (session: ResponseGroup) => void;
  clearSession: () => void;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<ResponseGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session from localStorage on mount
  useEffect(() => {
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
      } catch (error) {
        console.error('Failed to fetch session data:', error);
        // Clear invalid session
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  const clearSession = () => {
    setSessionId(null);
    setSession(null);
    localStorage.removeItem('assessmentSessionId');
  };

  return (
    <SessionContext.Provider value={{ 
      sessionId, 
      setSessionId, 
      session, 
      setSession, 
      clearSession,
      isLoading
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