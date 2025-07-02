import { AssessmentResult } from '@/lib/api/types/assessment';
import { getLatestUserAssessmentResults } from '@/lib/api/assessmentApi';
import { config } from '@/lib/api/config';

/**
 * Check if assessment is complete based on required fields
 */
export const isAssessmentComplete = (result: AssessmentResult): boolean => {
  if (!result || !result.scoreData) {
    console.log('❌ Assessment validation: No result or scoreData');
    return false;
  }

  const { scoreData } = result;

  // Check if finalScore exists and is a number
  if (typeof scoreData.finalScore !== 'number' || scoreData.finalScore < 0) {
    console.log('❌ Assessment validation: Missing or invalid finalScore');
    return false;
  }

  // Check if profile is not empty
  if (!scoreData.profile || scoreData.profile.trim() === '') {
    console.log('❌ Assessment validation: Missing or empty profile');
    return false;
  }

  // Check if directInputs object exists
  if (!scoreData.directInputs) {
    console.log('❌ Assessment validation: Missing directInputs object');
    return false;
  }

  console.log('✅ Assessment validation: Assessment is complete');
  return true;
};

/**
 * Check if assessment has partial data (some answers but not complete)
 */
export const hasPartialAssessmentData = (result: AssessmentResult): boolean => {
  if (!result || !result.scoreData) {
    return false;
  }

  const { scoreData } = result;

  // Check if we have some data but not complete
  const hasSomeMetrics = scoreData.riskProfile !== undefined || 
                        scoreData.knowledgeLevel !== undefined ||
                        scoreData.finalScore !== undefined;

  const hasSomeInputs = scoreData.directInputs && 
                       Object.keys(scoreData.directInputs).length > 0;

  return hasSomeMetrics || hasSomeInputs;
};

/**
 * Get assessment completion status with detailed information
 */
export const getAssessmentStatus = (result: AssessmentResult): {
  isComplete: boolean;
  hasPartialData: boolean;
  missingFields: string[];
  reason: string;
} => {
  if (!result || !result.scoreData) {
    return {
      isComplete: false,
      hasPartialData: false,
      missingFields: ['scoreData'],
      reason: 'No assessment data found'
    };
  }

  const { scoreData } = result;
  const missingFields: string[] = [];

  // Check required fields
  const requiredFields = [
    'riskProfile',
    'knowledgeLevel', 
    'leverageAptitude',
    'riskCapacity',
    'investmentHorizon',
    'finalScore',
    'profile',
    'overallConfidence'
  ];

  for (const field of requiredFields) {
    if (!(field in scoreData) || scoreData[field] === undefined || scoreData[field] === null) {
      missingFields.push(field);
    }
  }

  // Check directInputs object exists
  if (!scoreData.directInputs) {
    missingFields.push('directInputs');
  }

  const isComplete = missingFields.length === 0 && isAssessmentComplete(result);
  const hasPartialData = hasPartialAssessmentData(result);

  let reason = '';
  if (isComplete) {
    reason = 'Assessment is complete';
  } else if (hasPartialData) {
    reason = `Assessment is incomplete. Missing: ${missingFields.join(', ')}`;
  } else {
    reason = 'No assessment data found';
  }

  return {
    isComplete,
    hasPartialData,
    missingFields,
    reason
  };
};

/**
 * Get comprehensive assessment status for resume functionality
 */
export const getAssessmentResumeStatus = async (): Promise<{
  hasAssessment: boolean;
  sessionId?: string;
  isComplete: boolean;
  isIncomplete: boolean;
  canResume: boolean;
  progress?: {
    questionsAnswered: number;
    totalQuestions: number;
    lastAnsweredAt?: string;
  };
  answers?: Record<string, any>;
}> => {
  try {
    // Use existing function to get latest results
    const latestResults = await getLatestUserAssessmentResults();
    
    if (!latestResults) {
      return {
        hasAssessment: false,
        isComplete: false,
        isIncomplete: false,
        canResume: false
      };
    }

    const sessionId = latestResults.responseGroupId;
    
    // Check if assessment is complete by trying to get results
    try {
      const assessmentResponse = await fetch(`${config.API_BASE_URL}/assessment/response-group/${sessionId}/score`);
      
      if (assessmentResponse.ok) {
        const assessmentData = await assessmentResponse.json();
        // Assessment is complete
        return {
          hasAssessment: true,
          sessionId,
          isComplete: true,
          isIncomplete: false,
          canResume: false
        };
      }
    } catch (error) {
      // Assessment results not available - check if incomplete
    }
    
    // Assessment exists but is incomplete - check for answers
    try {
      const answersResponse = await fetch(`${config.API_BASE_URL}/user-responses/session/${sessionId}/questions-answers`);
      
      if (answersResponse.ok) {
        const answersData = await answersResponse.json();
        const hasAnswers = answersData.questionsWithAnswers.length > 0;
        
        return {
          hasAssessment: true,
          sessionId,
          isComplete: false,
          isIncomplete: true,
          canResume: hasAnswers,
          progress: {
            questionsAnswered: answersData.questionsWithAnswers.length,
            totalQuestions: 30, // Update this to match your total questions
            lastAnsweredAt: answersData.questionsWithAnswers[answersData.questionsWithAnswers.length - 1]?.createdAt
          },
          answers: answersData.questionsWithAnswers.reduce((acc: any, q: any) => {
            acc[q.id] = q.answer.value || q.answer.selectedOption?.id || q.answer.answerText || q.answer.answerNumber || q.answer.answerBoolean;
            return acc;
          }, {})
        };
      }
    } catch (error) {
      console.error('Failed to get answers:', error);
    }
    
    return {
      hasAssessment: true,
      sessionId,
      isComplete: false,
      isIncomplete: true,
      canResume: false
    };
  } catch (error) {
    console.error('Failed to get assessment status:', error);
    return {
      hasAssessment: false,
      isComplete: false,
      isIncomplete: false,
      canResume: false
    };
  }
}; 