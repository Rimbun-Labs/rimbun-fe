import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { UserAnswer, Question } from '@/lib/api/types/assessment';
import { useAssessmentProgress } from '@/hooks/useAssessmentProgress';
import { useAssessmentAnswers } from '@/hooks/useAssessmentAnswers';
import { AssessmentError } from '@/components/assessment/AssessmentError';
import { AssessmentContainer } from '@/components/assessment/AssessmentContainer';
import AssessmentComplete from '@/components/assessment/AssessmentComplete';
import { AssessmentStartPage } from '@/components/assessment/AssessmentStartPage';
import { Button } from '@/components/ui/button';
import { createSession } from '@/lib/api/sessionApi';
import { getQuestions } from '@/lib/api/questionnaireApi';
import { getAssessmentResults } from '@/lib/api/assessmentApi';
import { useSession } from '@/contexts/SessionContext';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { getRecommendations } from '@/lib/api/recommendationApi';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { isAssessmentComplete } from '@/utils/assessmentValidation';
import { getAssessmentResumeStatus } from '@/utils/assessmentValidation';
import { RouteErrorBoundary } from '@/components/error/RouteErrorBoundary';
import { AssessmentContainerWithErrorBoundary } from '@/components/assessment/AssessmentContainer';


const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const [isComplete, setIsComplete] = useState(false);
  const [showStartPage, setShowStartPage] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [isCheckingExistingAssessment, setIsCheckingExistingAssessment] = useState(true);
  const [assessmentMode, setAssessmentMode] = useState<'new' | 'resume' | 'retake'>('new');
  const [existingSessionId, setExistingSessionId] = useState<string | null>(null);
  const [existingAnswers, setExistingAnswers] = useState<Record<string, any>>({});
  const [existingProgress, setExistingProgress] = useState<any>(null);
  const { sessionId, setSessionId, setSession, hasCompletedAssessment } = useSession();
  const { userRegistrationComplete } = useAuth();
  
  // Check assessment status for resume functionality - REMOVE THE AUTOMATIC REDIRECT
  useEffect(() => {
    const checkAssessmentStatus = async () => {
      if (!userRegistrationComplete) {
        setIsCheckingExistingAssessment(false);
        return;
      }
      
      try {
        const status = await getAssessmentResumeStatus();
        
        if (status.isIncomplete && status.canResume) {
          setAssessmentMode('resume');
          setExistingSessionId(status.sessionId!);
          setExistingAnswers(status.answers || {});
          setExistingProgress(status.progress || null);
        } else if (status.isComplete) {
          setAssessmentMode('retake');
        } else {
          setAssessmentMode('new');
        }
      } catch (error) {
        console.error('Failed to check assessment status:', error);
        setAssessmentMode('new');
      } finally {
        setIsCheckingExistingAssessment(false);
      }
    };

    checkAssessmentStatus();
  }, [userRegistrationComplete]);
  
  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: createSession,
    onSuccess: (response) => {
      setSessionId(response.id);
      setShowStartPage(false);
      setHasStarted(true);
    },
    onError: (error) => {
      toast.error('Failed to start assessment session. Please try again.');
      console.error('Session creation error:', error);
    }
  });
  
  // Fetch questions
  const { data: questions, isPending: questionsLoading, error: questionsError } = useQuery({
    queryKey: ['assessment-questions'],
    queryFn: getQuestions,
    enabled: hasStarted, // Only fetch questions after user starts the assessment
  });
  
  // Setup assessment progress state management
  const { 
    currentQuestionIndex, 
    currentCategory,
    progress, 
    handleNext,
    handlePrevious,
    setCurrentQuestionIndex
  } = useAssessmentProgress(questions);
  
  // Setup answer handling
  const {
    answers,
    isSubmitting,
    error,
    handleAnswer,
    validateCurrentAnswer,
    setError,
    setAnswers
  } = useAssessmentAnswers(sessionId);
  
  // Get results query (activated when assessment completes)
  const { data: results, isPending: resultsLoading, error: resultsError } = useQuery({
    queryKey: ['assessment-results', sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error('No session ID');
      
      // Add initial delay to allow backend processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Add retry logic
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          const result = await getAssessmentResults(sessionId);
          
          // Validate required fields
          if (!result?.scoreData?.finalScore) {
            throw new Error('Invalid results structure');
          }
          
          return result;
        } catch (error) {
          attempts++;
          if (attempts === maxAttempts) throw error;
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      throw new Error('Failed to fetch results after multiple attempts');
    },
    enabled: isComplete && !!sessionId,
    retry: false // We handle retries manually
  });
  
  // Handle results success in useEffect
  useEffect(() => {
    if (results && sessionId) {
      // Use comprehensive assessment validation
      if (isAssessmentComplete(results)) {
        console.log('✅ Assessment: Results are complete, setting session');
        // Set session with the nested structure
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
        
        // Navigate directly to dashboard with session ID
        navigate(`/dashboard/${sessionId}`);
      } else {
        console.log('⚠️ Assessment: Results exist but are incomplete, not setting session');
        // Don't set session for incomplete results
      }
    }
  }, [results, sessionId, navigate]);

  // Handle errors in useEffect
  useEffect(() => {
    if (resultsError) {
      toast.error('Failed to load results. Please try again.');
    }
  }, [resultsError]);

  const handleStartAssessment = async () => {
    if (!userRegistrationComplete) {
      // Add a small delay and retry once in case of timing issue
      console.log('⚠️ Assessment: User registration not complete, waiting 2 seconds and retrying...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check again after delay
      if (!userRegistrationComplete) {
        toast.error('Please wait while we set up your account. If this persists, try refreshing the page.');
        console.log('❌ Assessment: User registration still not complete after retry');
        return;
      }
    }
    
    if (assessmentMode === 'resume' && existingSessionId) {
      // Resume existing session
      setSessionId(existingSessionId);
      setShowStartPage(false);
      setHasStarted(true);
      
      // Load existing answers into the assessment state
      setAnswers(existingAnswers);
      
      // Set current question to next unanswered question
      if (questions) {
        const answeredQuestionIds = Object.keys(existingAnswers);
        const nextUnansweredIndex = questions.findIndex(q => !answeredQuestionIds.includes(q.id));
        if (nextUnansweredIndex !== -1) {
          // Set the current question index to resume from the correct question
          setCurrentQuestionIndex(nextUnansweredIndex);
          console.log('Resuming from question:', nextUnansweredIndex + 1);
        }
      }
    } else {
      // Create new session (for new or retake)
      console.log('✅ Assessment: User registration complete, creating session');
      createSessionMutation.mutate({
        questionnaireType: "ONBOARDING",
        description: assessmentMode === 'retake' ? "Investment Profile Assessment (Retake)" : "Investment Profile Assessment"
      });
    }
  };

  const handleCloseContextDialog = () => {
    setShowStartPage(false);
    navigate('/dashboard'); // Navigate to dashboard instead of back
  };
  
  // Directly progress to next question - called after answer has been processed
  const moveToNextQuestion = async () => {
    if (!questions) return;
    
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    
    if (!isLastQuestion) {
      handleNext();
    } else {
      setIsComplete(true);
      // Show loading state immediately
      toast.info('Processing your assessment results...');
    }
    
    setError(null);
  };

  // Handle user's answer to current question and then validate
  const handleUserAnswer = async (answer: UserAnswer) => {
    if (!questions) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    
    // Process and save the answer
    const answerResult = await handleAnswer(answer, currentQuestion);
    
    // Validate the answer immediately with the new value
    if (!validateCurrentAnswer(currentQuestion, answerResult)) {
      return undefined;
    }
    
    // Return the answer to indicate success
    return answerResult;
  };

  // Show loading while checking existing assessment
  if (isCheckingExistingAssessment) {
    return (
      <div className="container max-w-4xl py-8">
        <LoadingState 
          variant="expanded"
          showTitle
          showSubtitle
          lines={3}
        />
      </div>
    );
  }

  // Show start page with different modes
  if (showStartPage) {
    return (
      <AssessmentStartPage 
        mode={assessmentMode}
        onStart={handleStartAssessment}
        progress={existingProgress}
      />
    );
  }
  
  if (isComplete) {
    if (resultsLoading) {
      return (
        <div className="container max-w-4xl py-8">
          <LoadingState 
            variant="expanded"
            showTitle
            showSubtitle
            lines={3}
          />
        </div>
      );
    }

    if (resultsError) {
      return (
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Error Loading Results</h1>
          <div className="max-w-3xl mx-auto space-y-4">
            <AssessmentError 
              onRetry={() => {
                setIsComplete(false);
                // Retry the query
              }}
            />
          </div>
        </div>
      );
    }

    // Do not render results here; navigation will occur in useEffect
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Redirecting to Dashboard...</h1>
        <div className="max-w-3xl mx-auto space-y-4">
          <LoadingState 
            variant="expanded"
            showTitle
            showSubtitle
            lines={3}
          />
        </div>
      </div>
    );
  }
  
  if (!questions || questions.length === 0) {
    return (
      <AssessmentError 
        onRetry={() => {
          setHasStarted(false);
          setShowStartPage(true);
        }}
      />
    );
  }
  
  return (
    <AssessmentContainerWithErrorBoundary
      questions={questions}
      currentQuestionIndex={currentQuestionIndex}
      progress={progress}
      answers={answers}
      error={error}
      isSubmitting={isSubmitting}
      onAnswer={handleUserAnswer}
      onNext={moveToNextQuestion}
      onPrevious={handlePrevious}
    />
  );
};

// Wrap the Assessment component with RouteErrorBoundary
const AssessmentWithErrorBoundary: React.FC = () => {
  return (
    <RouteErrorBoundary routeName="Assessment" showFullPage={true}>
      <Assessment />
    </RouteErrorBoundary>
  );
};

export default AssessmentWithErrorBoundary;
