import { AssessmentResult } from '@/lib/api/types/assessment';

/**
 * Simple assessment completion validation
 * Checks if an assessment result has the basic required fields
 */
export const isAssessmentComplete = (result: AssessmentResult): boolean => {
  console.log('🔄 HMR TEST - Validation function updated!');
  if (!result || !result.scoreData) {
    console.log('❌ Assessment validation: No result or scoreData');
    return false;
  }

  const { scoreData } = result;

  // Check if basic required fields exist (like original working version)
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
      console.log(`❌ Assessment validation: Missing required field: ${field}`);
      return false;
    }
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