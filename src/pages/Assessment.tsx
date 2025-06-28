import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { UserAnswer, Question } from '@/lib/api/types/assessment';
import { useAssessmentProgress } from '@/hooks/useAssessmentProgress';
import { useAssessmentAnswers } from '@/hooks/useAssessmentAnswers';
import { AssessmentError } from '@/components/assessment/AssessmentError';
import { AssessmentContainer } from '@/components/assessment/AssessmentContainer';
import AssessmentComplete from '@/components/assessment/AssessmentComplete';
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

const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const [isComplete, setIsComplete] = useState(false);
  const [showStartPage, setShowStartPage] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [isCheckingExistingAssessment, setIsCheckingExistingAssessment] = useState(true);
  const { sessionId, setSessionId, setSession, hasCompletedAssessment } = useSession();
  const { userRegistrationComplete } = useAuth();
  
  // Check if user already has completed assessment on mount
  useEffect(() => {
    const checkExistingAssessment = async () => {
      if (!userRegistrationComplete) {
        setIsCheckingExistingAssessment(false);
        return;
      }

      try {
        const status = await hasCompletedAssessment();
        if (status.hasAssessment && status.sessionId && !status.isIncomplete) {
          // User already has completed assessment, redirect to dashboard
          navigate(`/dashboard/${status.sessionId}`);
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
  }, [navigate, userRegistrationComplete]);
  
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
    handlePrevious
  } = useAssessmentProgress(questions);
  
  // Setup answer handling
  const {
    answers,
    isSubmitting,
    error,
    handleAnswer,
    validateCurrentAnswer,
    setError
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

  const handleStartAssessment = () => {
    if (!userRegistrationComplete) {
      toast.error('Please wait while we set up your account...');
      console.log('❌ Assessment: User registration not complete yet');
      return;
    }
    
    console.log('✅ Assessment: User registration complete, creating session');
    createSessionMutation.mutate({
      questionnaireType: "ONBOARDING",
      description: "Investment Profile Assessment"
    });
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

  // Show context dialog if assessment hasn't started
  if (!hasStarted) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Investment Profile Assessment</h1>
            <p className="text-xl text-muted-foreground">
              Understand your investment style and risk tolerance
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold mb-2">What is this assessment?</h3>
              <p className="text-muted-foreground">
                This comprehensive assessment is designed to help us understand your investment 
                preferences, risk tolerance, and financial goals. By analyzing your responses, 
                we can provide personalized investment recommendations that align with your profile.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">What to expect?</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>A series of carefully crafted questions about your investment preferences</li>
                <li>Questions about your financial goals and time horizon</li>
                <li>Scenarios to assess your risk tolerance</li>
                <li>Questions about your investment knowledge and experience</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Time Required</h3>
              <p className="text-muted-foreground">
                The assessment typically takes 10-15 minutes to complete. You can save your progress 
                and return later if needed.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">What you'll get</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>A detailed analysis of your investment profile</li>
                <li>Personalized investment strategy recommendations</li>
                <li>Risk tolerance assessment</li>
                <li>Suggested asset allocation based on your profile</li>
              </ul>
            </section>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center pt-6">
            <Button variant="outline" onClick={handleCloseContextDialog}>
              Cancel
            </Button>
            <Button onClick={handleStartAssessment}>
              Start Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  if (createSessionMutation.isPending || questionsLoading) {
    return <LoadingState 
      variant="expanded"
      showTitle
      showSubtitle
      lines={3}
    />;
  }

  if (questionsError) {
    return (
      <AssessmentError 
        onRetry={() => {
          setHasStarted(false);
          setShowStartPage(true);
        }}
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
  );
};

export default Assessment;
