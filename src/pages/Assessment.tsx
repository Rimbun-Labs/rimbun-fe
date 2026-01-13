import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { UserAnswer, Question } from '@/lib/api/types/assessment';
import { useAssessmentProgress } from '@/hooks/useAssessmentProgress';
import { useAssessmentAnswers } from '@/hooks/useAssessmentAnswers';
import { AssessmentError } from '@/components/assessment/AssessmentError';
import { AssessmentContainer } from '@/components/assessment/AssessmentContainer';
import AssessmentComplete from '@/components/assessment/AssessmentComplete';
import { AssessmentStartPage } from '@/components/assessment/AssessmentStartPage';
import { AssessmentCompletedInterstitial } from '@/components/assessment/AssessmentCompletedInterstitial';
import { Button } from '@/components/ui/button';
import { createSession } from '@/lib/api/sessionApi';
import { getQuestions } from '@/lib/api/questionnaireApi';
import { getAssessmentResults } from '@/lib/api/assessmentApi';
import { useSession } from '@/contexts/SessionContext';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { getRecommendations } from '@/lib/api/recommendationApi';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { useAssessmentResume } from '@/hooks/useAssessmentResume';
import { storageUtils } from '@/lib/storage/storageUtils';
// Removed environmentStorage - using API-first approach

const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isComplete, setIsComplete] = useState(false);
  const [showStartPage, setShowStartPage] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [isCheckingExistingAssessment, setIsCheckingExistingAssessment] = useState(true);
  const [showCompletedInterstitial, setShowCompletedInterstitial] = useState(false);
  const [completedSessionId, setCompletedSessionId] = useState<string | null>(null);
  const [hasExistingCompletedAssessment, setHasExistingCompletedAssessment] = useState(false);
  const [hasNewlyCompletedAssessment, setHasNewlyCompletedAssessment] = useState(false);
  const [assessmentMode, setAssessmentMode] = useState<'new' | 'resume' | 'retake'>('new');
  const [existingSessionId, setExistingSessionId] = useState<string | null>(null);
  const [existingAnswers, setExistingAnswers] = useState<Record<string, any>>({});
  const [existingProgress, setExistingProgress] = useState<any>(null);
  const { sessionId, setSessionId, setSession, hasCompletedAssessment, isLoading: sessionLoading } = useSession();
  const { userRegistrationComplete } = useAuth();
  
  // Simple resume functionality
  const urlParams = new URLSearchParams(window.location.search);
  const resumeSessionId = urlParams.get('sessionId');
  const { data: resumeData } = useAssessmentResume(resumeSessionId, userRegistrationComplete);
  
  // Check URL parameters for retake mode and resume functionality
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const resumeSessionId = urlParams.get('sessionId');
    
    if (mode === 'retake') {
      setAssessmentMode('retake');
      setIsCheckingExistingAssessment(false); // Skip redirect check for retake
      return;
    }
    
    if (resumeSessionId) {
      setAssessmentMode('resume');
      setSessionId(resumeSessionId);
      storageUtils.setItem('assessmentSessionId', resumeSessionId);
      setShowStartPage(false);
      setHasStarted(true);
      console.log('🔄 Resuming assessment from session:', resumeSessionId);
    }
  }, [setSessionId]);

  // Check if user already has completed assessment on mount
  useEffect(() => {
    const checkExistingAssessment = async () => {
      // 🔑 FIXED: Also check URL parameters directly to prevent race conditions
      const urlParams = new URLSearchParams(window.location.search);
      const mode = urlParams.get('mode');
      const isRetakeMode = mode === 'retake';
      
      if (!userRegistrationComplete || sessionLoading || assessmentMode === 'retake' || assessmentMode === 'resume' || isRetakeMode) {
        setIsCheckingExistingAssessment(false);
        return;
      }

      try {
        const status = await hasCompletedAssessment();
        if (status.hasAssessment && status.sessionId && !status.isIncomplete) {
          // User already has completed assessment, show interstitial instead of redirecting
          setCompletedSessionId(status.sessionId);
          setHasExistingCompletedAssessment(true);
          setHasNewlyCompletedAssessment(false);
          setShowCompletedInterstitial(true);
          setShowStartPage(false);
          setIsComplete(false);
          setIsCheckingExistingAssessment(false);
          return;
        }
        // If incomplete assessment, let them stay on assessment page to complete it
        else if (status.isIncomplete) {
          console.log('⚠️ User has incomplete assessment, allowing them to complete it');
        }
      } catch (error) {
        console.error('Failed to check existing assessment:', error);
      } finally {
        setIsCheckingExistingAssessment(false);
      }
    };

    checkExistingAssessment();
  }, [navigate, userRegistrationComplete, assessmentMode]);
  
  // Check assessment status for resume functionality
  useEffect(() => {
    const checkAssessmentStatus = async () => {
      if (!userRegistrationComplete) return;
      
      // Don't override retake mode if it's already set
      if (assessmentMode === 'retake') return;
      
      try {
        // ✅ FIXED: Don't override assessment mode - let URL parameters control it
        console.log('✅ Assessment status check complete, keeping current mode:', assessmentMode);
      } catch (error) {
        console.error('Failed to check assessment status:', error);
        // ✅ FIXED: Don't override assessment mode on error either
      }
    };

    checkAssessmentStatus();
  }, [navigate, userRegistrationComplete, assessmentMode]);
  
  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: createSession,
    onSuccess: (response) => {
      setSessionId(response.id);
      storageUtils.setItem('assessmentSessionId', response.id);
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
    queryKey: ['assessment-questions-v2'], // Changed key to force fresh fetch
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
    setAnswers,
    loadExistingAnswers
  } = useAssessmentAnswers(sessionId);
  
  const hasLoadedResumeAnswers = useRef(false);

  // Set resume index when questions are loaded and we're in resume mode
  useEffect(() => {
    console.log('🔍 Resume useEffect triggered:', {
      questionsLoaded: !!questions,
      questionsLength: questions?.length,
      assessmentMode,
      resumeData,
      resumeSessionId
    });
    
    if (hasExistingCompletedAssessment) {
      return;
    }

    if (questions && assessmentMode === 'resume' && resumeData) {
      console.log('🔍 Resume data received:', resumeData);
      
      // ✅ FIXED: Check if assessment is completed first
      if (resumeData.isCompleted) {
        console.log('✅ Assessment completed - showing interstitial for completed resume');
        setHasExistingCompletedAssessment(true);
        setHasNewlyCompletedAssessment(false);
        setCompletedSessionId(resumeSessionId || sessionId);
        setShowCompletedInterstitial(true);
        setIsComplete(false);
        setIsCheckingExistingAssessment(false);
        setShowStartPage(false);
        return;
      }
      
      // ✅ FIXED: Use nextQuestionId from backend for precise resume point
      if (resumeData.nextQuestionId) {
        const questionIndex = questions.findIndex(q => q.id === resumeData.nextQuestionId);
        console.log('🔍 Question lookup:', {
          nextQuestionId: resumeData.nextQuestionId,
          questionIndex,
          totalQuestions: questions.length
        });
        
        if (questionIndex !== -1) {
          setCurrentQuestionIndex(questionIndex);
          console.log('📍 Starting resume from specific question ID:', resumeData.nextQuestionId, 'at index:', questionIndex);
        } else {
          // Fallback to resumeIndex if question ID not found
          setCurrentQuestionIndex(resumeData.resumeIndex || 0);
          console.log('📍 Fallback: Starting resume from index:', resumeData.resumeIndex || 0);
        }
      } else {
        // Fallback to resumeIndex if no nextQuestionId
        setCurrentQuestionIndex(resumeData.resumeIndex || 0);
        console.log('📍 Fallback: Starting resume from index:', resumeData.resumeIndex || 0);
      }
      if (resumeSessionId && !resumeData.isCompleted && !hasLoadedResumeAnswers.current) {
        hasLoadedResumeAnswers.current = true;
        loadExistingAnswers(resumeSessionId);
      }
    }
  }, [questions, assessmentMode, resumeData, resumeSessionId, loadExistingAnswers, hasExistingCompletedAssessment, sessionId]);
  
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
    enabled: hasNewlyCompletedAssessment && !!sessionId,
    retry: false // We handle retries manually
  });
  
  // Handle results success - navigate to dashboard when complete
  useEffect(() => {
    if (results && sessionId && hasNewlyCompletedAssessment) {
      // Results are available, assessment is complete - navigate to dashboard
      console.log('✅ Assessment: Results loaded, navigating to dashboard');
      
      // Invalidate banking recommendations so they refetch with new assessment data
      queryClient.invalidateQueries({ queryKey: ['banking', 'recommendations'] });
      
      navigate(`/dashboard/${sessionId}`);
    }
  }, [results, sessionId, hasNewlyCompletedAssessment, navigate, queryClient]);

  // Handle errors in useEffect
  useEffect(() => {
    if (resultsError) {
      toast.error('Failed to load results. Please try again.');
    }
  }, [resultsError]);

  const handleStartAssessment = async () => {
    // Reset completion flags when starting/restarting assessment
    setHasExistingCompletedAssessment(false);
    setHasNewlyCompletedAssessment(false);
    setShowCompletedInterstitial(false);
    setIsComplete(false);

    if (!userRegistrationComplete) {
      toast.error('Please wait while we set up your account...');
      console.log('❌ Assessment: User registration not complete yet');
      return;
    }
    
    if (assessmentMode === 'resume' && existingSessionId) {
      // Resume existing session
      setSessionId(existingSessionId); // Use regular setSessionId for existing sessions
      setShowStartPage(false);
      setHasStarted(true);
      
      // Load existing answers into the assessment state
      setAnswers(existingAnswers);
      
      // ✅ FIXED: Trust backend resume data completely - no frontend calculations
      console.log('🔄 Resume mode: Trusting backend resume data completely');
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
      setHasNewlyCompletedAssessment(true);
      setHasExistingCompletedAssessment(false);
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

  // Handlers for completed assessment interstitial
  const handleViewResults = () => {
    if (completedSessionId) {
      navigate(`/dashboard/${completedSessionId}`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleRetake = () => {
    setShowCompletedInterstitial(false);
    setHasExistingCompletedAssessment(false);
    setHasNewlyCompletedAssessment(false);
    setIsComplete(false);
    setAssessmentMode('retake');
    setShowStartPage(true);
    // Update URL to include retake mode
    navigate('/assessment?mode=retake', { replace: true });
  };

  // Show loading while checking existing assessment
  if (isCheckingExistingAssessment) {
    return (
      <div className="py-12">
        <LoadingState 
          variant="expanded"
          showTitle
          showSubtitle
          lines={3}
        />
      </div>
    );
  }

  // Show completed assessment interstitial
  if (showCompletedInterstitial && completedSessionId) {
    return (
      <div className="min-h-screen bg-background">
        <AssessmentCompletedInterstitial
          sessionId={completedSessionId}
          onViewResults={handleViewResults}
          onRetake={handleRetake}
        />
      </div>
    );
  }

  // Consolidated return with conditional content
  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Loading State */}
      {isCheckingExistingAssessment && (
        <div className="py-12">
          <LoadingState 
            variant="expanded"
            showTitle
            showSubtitle
            lines={3}
          />
        </div>
      )}

      {/* Start Page */}
      {!isCheckingExistingAssessment && showStartPage && (
        <AssessmentStartPage 
          mode={assessmentMode}
          onStart={handleStartAssessment}
          progress={existingProgress}
        />
      )}

      {/* Complete State */}
      {!isCheckingExistingAssessment && !showStartPage && isComplete && (
        <>
          {resultsLoading && (
            <div className="py-12">
              <LoadingState 
                variant="expanded"
                showTitle
                showSubtitle
                lines={3}
              />
            </div>
          )}

          {resultsError && (
            <div className="w-full py-12">
              <h1 className="text-3xl font-bold mb-10 text-center text-foreground">Error Loading Results</h1>
              <div className="w-full space-y-6">
                <AssessmentError 
                  onRetry={() => {
                    setIsComplete(false);
                    // Retry the query
                  }}
                />
              </div>
            </div>
          )}

          {!resultsLoading && !resultsError && (
            // Do not render results here; navigation will occur in useEffect
            <div className="w-full py-12">
              <div className="w-full space-y-6">
                <LoadingState 
                  variant="expanded"
                  showTitle
                  showSubtitle
                  lines={3}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Error State */}
      {!isCheckingExistingAssessment && !showStartPage && !isComplete && (!questions || questions.length === 0) && (
        <AssessmentError 
          onRetry={() => {
            setHasStarted(false);
            setShowStartPage(true);
          }}
        />
      )}

      {/* Main Assessment Content */}
      {!isCheckingExistingAssessment && !showStartPage && !isComplete && questions && questions.length > 0 && (
        <AssessmentContainer
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
      )}
      </div>
    </div>
  );
};

export default Assessment;
