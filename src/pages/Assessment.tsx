
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { mockQuestions } from '@/lib/mock/mockQuestions';
import { UserAnswer, Question } from '@/lib/api/assessmentApi';
import { useAssessmentSession } from '@/hooks/useAssessmentSession';
import { useAssessmentProgress } from '@/hooks/useAssessmentProgress';
import { useAssessmentAnswers } from '@/hooks/useAssessmentAnswers';
import { AssessmentLoading } from '@/components/assessment/AssessmentLoading';
import { AssessmentError } from '@/components/assessment/AssessmentError';
import { AssessmentContainer } from '@/components/assessment/AssessmentContainer';
import AssessmentComplete from '@/components/assessment/AssessmentComplete';
import { mockAssessmentResult } from '@/lib/mock/mockData';

const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const [isComplete, setIsComplete] = useState(false);
  
  // Initialize session
  const { 
    sessionId, 
    isCreatingSession, 
    handleRetry: retrySessionCreation 
  } = useAssessmentSession();
  
  // Fetch questions
  const { data: questions, isPending: questionsLoading } = useQuery({
    queryKey: ['assessment-questions'],
    queryFn: () => Promise.resolve(mockQuestions)
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
  
  const handleNextQuestion = () => {
    if (!questions) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    
    // Validate current answer
    if (!validateCurrentAnswer(currentQuestion)) {
      return;
    }
    
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

  // Handle user's answer to current question
  const handleUserAnswer = async (answer: UserAnswer) => {
    await handleAnswer({
      ...answer,
      questionType: questions?.[currentQuestionIndex].questionType
    });
  };
  
  if (questionsLoading || isCreatingSession) {
    return <AssessmentLoading />;
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
    return <AssessmentError onRetry={retrySessionCreation} />;
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
      onNext={handleNextQuestion}
      onPrevious={handlePrevious}
    />
  );
};

export default Assessment;
