import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { UserAnswer, Question } from '@/lib/api/types/assessment';
import { useAssessmentProgress } from '@/hooks/useAssessmentProgress';
import { useAssessmentAnswers } from '@/hooks/useAssessmentAnswers';
import { AssessmentLoading } from '@/components/assessment/AssessmentLoading';
import { AssessmentError } from '@/components/assessment/AssessmentError';
import { AssessmentContainer } from '@/components/assessment/AssessmentContainer';
import AssessmentComplete from '@/components/assessment/AssessmentComplete';
import AssessmentContextDialog from '@/components/assessment/AssessmentContextDialog';
import { mockAssessmentResult } from '@/lib/mock/mockData';
import { createSession } from '@/lib/api/sessionApi';
import { getQuestions } from '@/lib/api/questionnaireApi';
import { useSession } from '@/contexts/SessionContext';
import { toast } from 'sonner';

const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const [isComplete, setIsComplete] = useState(false);
  const [showContextDialog, setShowContextDialog] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const { sessionId, setSessionId } = useSession();
  
  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: createSession,
    onSuccess: (response) => {
      setSessionId(response.id);
      setShowContextDialog(false);
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
  const { data: results, isPending: resultsLoading } = useQuery({
    queryKey: ['assessment-results', sessionId],
    queryFn: () => sessionId ? Promise.resolve(mockAssessmentResult) : Promise.reject('No session ID'),
    enabled: isComplete && !!sessionId,
  });
  
  const handleStartAssessment = () => {
    createSessionMutation.mutate({
      questionnaireType: "ONBOARDING",
      description: "Investment Profile Assessment"
    });
  };

  const handleCloseContextDialog = () => {
    setShowContextDialog(false);
    navigate(-1); // Go back if user cancels
  };
  
  // Directly progress to next question - called after answer has been processed
  const moveToNextQuestion = () => {
    if (!questions) return;
    
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    
    if (!isLastQuestion) {
      handleNext();
    } else {
      setIsComplete(true);
      // Navigate to results page
      navigate(`/assessment/results/${sessionId}`);
    }
    
    setError(null);
  };

  // Handle user's answer to current question and then validate
  const handleUserAnswer = async (answer: UserAnswer) => {
    if (!questions) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    
    console.log("userAnswer", answer)
    // Process and save the answer
    const answerResult = await handleAnswer(answer, currentQuestion);
    
    // Validate the answer immediately with the new value
    if (!validateCurrentAnswer(currentQuestion, answerResult)) {
      return undefined;
    }
    
    // Return the answer to indicate success
    return answerResult;
  };

  // Show context dialog if assessment hasn't started
  if (!hasStarted) {
    return (
      <AssessmentContextDialog
        isOpen={showContextDialog}
        onStart={handleStartAssessment}
        onClose={handleCloseContextDialog}
      />
    );
  }
  
  if (createSessionMutation.isPending || questionsLoading) {
    return <AssessmentLoading />;
  }

  if (questionsError) {
    return (
      <AssessmentError 
        onRetry={() => {
          setHasStarted(false);
          setShowContextDialog(true);
        }}
      />
    );
  }
  
  if (isComplete) {
    if (resultsLoading) {
      return (
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Processing Your Results</h1>
          <div className="max-w-3xl mx-auto space-y-4">
            <AssessmentLoading />
          </div>
        </div>
      );
    }
    
    return results && <AssessmentComplete result={results} />;
  }
  
  if (!questions || questions.length === 0) {
    return (
      <AssessmentError 
        onRetry={() => {
          setHasStarted(false);
          setShowContextDialog(true);
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
