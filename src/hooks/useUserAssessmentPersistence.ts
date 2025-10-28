import { useEffect, useState } from 'react';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { getLatestAssessmentResults } from '@/lib/api/assessmentApi';
import { userService } from '@/lib/api/userService';

export const useUserAssessmentPersistence = () => {
  const { setSession } = useSession();
  const { user, userRegistrationComplete, loading } = useAuth();
  const [hasCheckedPersistence, setHasCheckedPersistence] = useState(false);

  useEffect(() => {
    const checkPersistence = async () => {
      // Wait for auth to complete before checking persistence
      if (loading || !user || !userRegistrationComplete) {
        console.log('⏳ useUserAssessmentPersistence: Waiting for auth completion');
        return;
      }

      if (hasCheckedPersistence) return;

      try {
        console.log('🔍 useUserAssessmentPersistence: Checking for existing assessment results');
        
        const latestResults = await getLatestAssessmentResults();
        
        if (latestResults && !hasCheckedPersistence) {
          try {
            console.log('✅ Found existing assessment results for user, checking completeness');
            
            // If getLatestAssessmentResults() returned data, it means the session is complete
            // (since we fixed that function to use score endpoint)
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
            console.log('✅ Assessment is complete (backend confirmed), restoring session');
          } catch (error) {
            console.error('Failed to restore session from assessment results:', error);
          }
          setHasCheckedPersistence(true);
        } else if (latestResults === null && !hasCheckedPersistence) {
          console.log('ℹ️ No existing assessment results found for user');
          setHasCheckedPersistence(true);
        }
      } catch (error) {
        console.error('Failed to check assessment persistence:', error);
        setHasCheckedPersistence(true);
      }
    };

    checkPersistence();
  }, [setSession, hasCheckedPersistence, user, userRegistrationComplete, loading]);

  return { hasCheckedPersistence };
};
