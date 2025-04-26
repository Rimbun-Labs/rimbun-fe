
import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  createSession, 
  fetchQuestions, 
  submitAnswer, 
  getAssessmentResults, 
  UserAnswer 
} from '@/lib/api/assessmentApi';
import { mockQuestions, mockAssessmentResult } from '@/lib/mock/mockData';
import QuestionCard from '@/components/assessment/QuestionCard';
import ProgressBar from '@/components/assessment/ProgressBar';
import AssessmentComplete from '@/components/assessment/AssessmentComplete';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Assessment: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [userAnswers, setUserAnswers] = React.useState<Record<string, any>>({});
  const [isComplete, setIsComplete] = React.useState(false);
  
  // Fetch questions from API or use mock data
  const { data: questions, isPending: questionsLoading } = useQuery({
    queryKey: ['assessment-questions'],
    queryFn: () => {
      // For development, use mock data
      return Promise.resolve(mockQuestions);
      // In production, fetch from API
      // return fetchQuestions();
    }
  });
  
  // Create a session when the component mounts
  const createSessionMutation = useMutation({
    mutationFn: createSession,
    onSuccess: (data) => {
      setSessionId(data.id);
    }
  });
  
  React.useEffect(() => {
    // Create a session when the component mounts
    createSessionMutation.mutate();
  }, []);
  
  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: ({ sessionId, answer }: { sessionId: string, answer: UserAnswer }) => 
      submitAnswer(sessionId, answer),
    onError: (error) => {
      console.error('Error submitting answer:', error);
    }
  });
  
  // Get assessment results query
  const { data: results, isPending: resultsLoading } = useQuery({
    queryKey: ['assessment-results', sessionId],
    queryFn: () => {
      // For development, use mock data
      return Promise.resolve(mockAssessmentResult);
      // In production, fetch from API
      // return getAssessmentResults(sessionId!);
    },
    enabled: isComplete && !!sessionId,
  });
  
  const handleAnswer = (answer: UserAnswer) => {
    // Store answer locally
    setUserAnswers((prev) => ({
      ...prev,
      [answer.questionId]: answer.answer
    }));
    
    // Submit answer to API if we have a session
    if (sessionId) {
      submitAnswerMutation.mutate({
        sessionId,
        answer
      });
    }
  };
  
  const handleNext = () => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsComplete(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };
  
  // Show loading state
  if (questionsLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Investment Profile Assessment</h1>
        <div className="max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    );
  }
  
  // Show results when assessment is complete
  if (isComplete) {
    if (resultsLoading) {
      return (
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Processing Your Results</h1>
          <div className="max-w-3xl mx-auto space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      );
    }
    
    return results && <AssessmentComplete result={results} />;
  }
  
  // Show current question
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Investment Profile Assessment</h1>
      
      {questions && (
        <>
          <ProgressBar 
            currentStep={currentQuestionIndex + 1} 
            totalSteps={questions.length} 
          />
          
          {currentQuestionIndex > 0 && (
            <div className="max-w-3xl mx-auto mb-4">
              <Button 
                variant="ghost" 
                onClick={handlePrevious} 
                className="flex items-center gap-1"
                disabled={submitAnswerMutation.isPending}
              >
                <ArrowLeft className="h-4 w-4" />
                Previous Question
              </Button>
            </div>
          )}
          
          <QuestionCard 
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            onNext={handleNext}
            currentAnswer={userAnswers[questions[currentQuestionIndex].id]}
            isLastQuestion={currentQuestionIndex === questions.length - 1}
          />
        </>
      )}
    </div>
  );
};

export default Assessment;
