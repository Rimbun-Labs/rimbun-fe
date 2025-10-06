import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLatestAssessmentResults } from '@/lib/api/assessmentApi';
import { AssessmentResult } from '@/lib/api/types/assessment';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from '@/contexts/SessionContext';
import { isAssessmentComplete } from '@/utils/assessmentValidation';

export const useUserAssessmentPersistence = () => {
  const { user, userRegistrationComplete } = useAuth();
  const { setSession } = useSession();
  const [hasCheckedPersistence, setHasCheckedPersistence] = useState(false);

  // Query for latest assessment results - using CORRECT session-based approach
  const { 
    data: latestResults, 
    isLoading: isLoadingLatest,
    error: latestError 
  } = useQuery<AssessmentResult | null>({
    queryKey: ['user-latest-assessment', user?.uid],
    queryFn: getLatestAssessmentResults, // ✅ CORRECT: Uses session-based approach
    enabled: !!user && userRegistrationComplete,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Effect to handle when latest results are found
  useEffect(() => {
    if (latestResults && !hasCheckedPersistence) {
      console.log('✅ Found existing assessment results for user, checking completeness');
      
      // Use comprehensive assessment validation
      if (isAssessmentComplete(latestResults)) {
        console.log('✅ Assessment is complete, restoring session');
        // Create a session object from the existing results
        const sessionData = {
          id: latestResults.responseGroupId,
          userId: latestResults.responseGroupId,
          questionnaireType: "ONBOARDING",
          isCompleted: true,
          metadata: {
            score: latestResults.scoreData.finalScore,
            profile: latestResults.scoreData.profile,
            riskProfile: latestResults.scoreData.riskProfile,
            knowledgeLevel: latestResults.scoreData.knowledgeLevel,
            leverageAptitude: latestResults.scoreData.leverageAptitude,
            riskCapacity: latestResults.scoreData.riskCapacity,
            investmentHorizon: latestResults.scoreData.investmentHorizon,
            overallConfidence: latestResults.scoreData.overallConfidence
          },
          createdAt: latestResults.createdAt,
          updatedAt: latestResults.updatedAt
        };

        setSession(sessionData);
      } else {
        console.log('⚠️ Assessment exists but is incomplete, not setting session');
        // Don't set session for incomplete assessments
      }

      setHasCheckedPersistence(true);
    } else if (latestResults === null && !hasCheckedPersistence) {
      // No results found, mark as checked
      console.log('ℹ️ No existing assessment results found for user');
      setHasCheckedPersistence(true);
    }
  }, [latestResults, hasCheckedPersistence, setSession]);

  return {
    latestResults,
    isLoadingLatest,
    latestError,
    hasCheckedPersistence
  };
};