
import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  createSession, 
  fetchQuestions, 
  submitAnswer, 
  getAssessmentResults,
  UserAnswer,
  Question
} from '@/lib/api/assessmentApi';
import { mockQuestions } from '@/lib/mock/mockQuestions';
import QuestionCard from '@/components/assessment/QuestionCard';
import ProgressBar from '@/components/assessment/ProgressBar';
import CategoryHeader from '@/components/assessment/CategoryHeader';
import AssessmentComplete from '@/components/assessment/AssessmentComplete';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Assessment: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [userAnswers, setUserAnswers] = React.useState<Record<string, any>>({});
  const [isComplete, setIsComplete] = React.useState(false);
  
  // Fetch questions
  const { data: questions, isPending: questionsLoading } = useQuery({
    queryKey: ['assessment-questions'],
    queryFn: () => Promise.resolve(mockQuestions)
  });
  
  // Create session
  const createSessionMutation = useMutation({
    mutationFn: createSession,
    onSuccess: (data) => {
      if (data && data.id) {
        setSessionId(data.id);
      }
    }
  });
  
  React.useEffect(() => {
    createSessionMutation.mutate();
  }, []);
  
  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: ({ sessionId, answer }: { sessionId: string, answer: UserAnswer }) => 
      submitAnswer(sessionId, answer)
  });
  
  // Get results query
  const { data: results, isPending: resultsLoading } = useQuery({
    queryKey: ['assessment-results', sessionId],
    queryFn: () => sessionId ? getAssessmentResults(sessionId) : Promise.reject('No session ID'),
    enabled: isComplete && !!sessionId,
  });
  
  const handleAnswer = (answer: UserAnswer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [answer.questionId]: answer.answer
    }));
    
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
  
  if (!questions || questions.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Error Loading Assessment</h1>
        <p className="text-center">Unable to load assessment questions. Please try again later.</p>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const questionsInCurrentCategory = questions.filter(
    q => q.category.id === currentQuestion.category.id
  );
  const currentQuestionInCategory = questionsInCurrentCategory.findIndex(
    q => q.id === currentQuestion.id
  ) + 1;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Investment Profile Assessment</h1>
      
      <ProgressBar 
        currentStep={currentQuestionIndex + 1} 
        totalSteps={questions.length}
        category={currentQuestion.category.name}
      />
      
      <CategoryHeader 
        category={currentQuestion.category}
        questionCount={questionsInCurrentCategory.length}
        currentQuestion={currentQuestionInCategory}
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
        question={currentQuestion}
        onAnswer={handleAnswer}
        onNext={handleNext}
        currentAnswer={userAnswers[currentQuestion.id]}
        isLastQuestion={currentQuestionIndex === questions.length - 1}
      />
    </div>
  );
};

export default Assessment;
