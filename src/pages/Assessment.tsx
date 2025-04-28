import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  createSession, 
  submitAnswer, 
  getAssessmentResults,
  Question,
  UserAnswer,
  SubmitAnswerRequest
} from '@/lib/api/assessmentApi';
import { mockQuestions } from '@/lib/mock/mockQuestions';
import QuestionCard from '@/components/assessment/QuestionCard';
import ProgressBar from '@/components/assessment/ProgressBar';
import CategoryHeader from '@/components/assessment/CategoryHeader';
import AssessmentComplete from '@/components/assessment/AssessmentComplete';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

interface AssessmentState {
  currentQuestionIndex: number;
  currentCategory: string;
  answers: Record<string, any>;
  isSubmitting: boolean;
  error: string | null;
  progress: {
    current: number;
    total: number;
    byCategory: Record<string, { current: number, total: number }>;
  };
}

const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = React.useState<AssessmentState>({
    currentQuestionIndex: 0,
    currentCategory: '',
    answers: {},
    isSubmitting: false,
    error: null,
    progress: {
      current: 1,
      total: 0,
      byCategory: {}
    }
  });
  
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [isComplete, setIsComplete] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  
  // Fetch questions
  const { data: questions, isPending: questionsLoading } = useQuery({
    queryKey: ['assessment-questions'],
    queryFn: () => Promise.resolve(mockQuestions)
  });
  
  // Create session
  const createSessionMutation = useMutation({
    mutationFn: () => createSession({ questionnaireType: "ONBOARDING" }),
    onSuccess: (data) => {
      if (data && data.id) {
        setSessionId(data.id);
        setRetryCount(0);
        // Store session ID in localStorage for persistence
        localStorage.setItem('assessmentSessionId', data.id);
      }
    },
    onError: () => {
      toast.error("Failed to create assessment session");
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          createSessionMutation.mutate();
        }, 1000 * (retryCount + 1)); // Exponential backoff
      } else {
        toast.error("Unable to start assessment. Please try again later.");
      }
    }
  });
  
  // Load existing session on mount
  React.useEffect(() => {
    const savedSessionId = localStorage.getItem('assessmentSessionId');
    if (savedSessionId) {
      setSessionId(savedSessionId);
    } else {
      createSessionMutation.mutate();
    }
  }, []);
  
  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (sessionId) {
        localStorage.removeItem('assessmentSessionId');
      }
    };
  }, [sessionId]);
  
  React.useEffect(() => {
    if (questions && questions.length > 0) {
      // Initialize progress data
      const categoryMap: Record<string, { current: number, total: number }> = {};
      questions.forEach(question => {
        const categoryId = question.category.id;
        if (!categoryMap[categoryId]) {
          categoryMap[categoryId] = { current: 0, total: 0 };
        }
        categoryMap[categoryId].total += 1;
      });
      
      setState(prev => ({
        ...prev,
        currentCategory: questions[0].category.id,
        progress: {
          current: 1,
          total: questions.length,
          byCategory: categoryMap
        }
      }));
    }
  }, [questions]);
  
  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: (data: SubmitAnswerRequest) => submitAnswer(data),
    onSuccess: () => {
      // Handle success if needed
    },
    onError: () => {
      toast.error("Failed to save your answer");
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: "Failed to save your answer. Please try again."
      }));
    }
  });
  
  // Get results query
  const { data: results, isPending: resultsLoading } = useQuery({
    queryKey: ['assessment-results', sessionId],
    queryFn: () => sessionId ? getAssessmentResults(sessionId) : Promise.reject('No session ID'),
    enabled: isComplete && !!sessionId,
  });
  
  const handleAnswer = async (answer: UserAnswer) => {
    const { questionId } = answer;
    
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer.answer
      },
      error: null,
      isSubmitting: true
    }));
    
    if (sessionId) {
      let submitData: SubmitAnswerRequest = {
        responseGroupId: sessionId,
        questionId: answer.questionId,
        answer: {}
      };
      
      const answerValue = answer.answer;
      
      if (typeof answerValue === 'string') {
        if (questions?.[state.currentQuestionIndex].questionType === 'multiple_choice') {
          submitData.answer.selectedOption = { id: answerValue as string };
        } else {
          submitData.answer.value = answerValue as string;
        }
      } else if (typeof answerValue === 'number') {
        submitData.answer.answerNumber = answerValue as number;
      } else if (typeof answerValue === 'boolean') {
        submitData.answer.answerBoolean = answerValue as boolean;
      }
      
      try {
        await submitAnswerMutation.mutateAsync(submitData);
        setState(prev => ({
          ...prev,
          isSubmitting: false
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isSubmitting: false,
          error: "Failed to save your answer. Please try again."
        }));
      }
    }
  };
  
  const handleNext = () => {
    if (!questions) return;
    
    const currentQuestion = questions[state.currentQuestionIndex];
    
    // Validate current answer
    if (currentQuestion.required && !state.answers[currentQuestion.id]) {
      setState(prev => ({
        ...prev,
        error: "This question requires an answer"
      }));
      toast.error("Please answer this question before continuing");
      return;
    }
    
    if (state.currentQuestionIndex < questions.length - 1) {
      const nextIndex = state.currentQuestionIndex + 1;
      const nextQuestion = questions[nextIndex];
      const nextCategory = nextQuestion.category.id;
      
      // Update category progress
      const updatedCategoryProgress = { ...state.progress.byCategory };
      
      if (currentQuestion.category.id === nextCategory) {
        updatedCategoryProgress[nextCategory].current += 1;
      } else {
        // Reset for new category
        updatedCategoryProgress[nextCategory].current = 1;
      }
      
      setState(prev => ({
        ...prev,
        currentQuestionIndex: nextIndex,
        currentCategory: nextCategory,
        progress: {
          ...prev.progress,
          current: nextIndex + 1,
          byCategory: updatedCategoryProgress
        },
        error: null
      }));
    } else {
      setIsComplete(true);
      // Navigate to results page
      navigate(`/assessment/results/${sessionId}`);
    }
  };
  
  const handlePrevious = () => {
    if (!questions || state.currentQuestionIndex <= 0) return;
    
    const prevIndex = state.currentQuestionIndex - 1;
    const prevQuestion = questions[prevIndex];
    const prevCategory = prevQuestion.category.id;
    
    // Update category progress
    const updatedCategoryProgress = { ...state.progress.byCategory };
    
    if (questions[state.currentQuestionIndex].category.id === prevCategory) {
      updatedCategoryProgress[prevCategory].current -= 1;
    } else {
      // Update for previous category
      const questionsInPrevCategory = questions.filter(q => q.category.id === prevCategory).length;
      updatedCategoryProgress[prevCategory].current = questionsInPrevCategory - 1;
    }
    
    setState(prev => ({
      ...prev,
      currentQuestionIndex: prevIndex,
      currentCategory: prevCategory,
      progress: {
        ...prev.progress,
        current: prevIndex + 1,
        byCategory: updatedCategoryProgress
      },
      error: null
    }));
  };

  const handleRetry = () => {
    setRetryCount(0);
    createSessionMutation.mutate();
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
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Unable to load assessment questions.</p>
          <Button onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  const currentQuestion = questions[state.currentQuestionIndex];
  const questionsInCurrentCategory = questions.filter(
    q => q.category.id === currentQuestion.category.id
  );
  const currentQuestionInCategory = questionsInCurrentCategory.findIndex(
    q => q.id === currentQuestion.id
  ) + 1;
  
  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-center">Investment Profile Assessment</h1>
      
      <ProgressBar 
        currentStep={state.progress.current} 
        totalSteps={state.progress.total}
        category={currentQuestion.category.name}
      />
      
      <CategoryHeader 
        category={currentQuestion.category}
        questionCount={questionsInCurrentCategory.length}
        currentQuestion={currentQuestionInCategory}
      />
      
      {state.currentQuestionIndex > 0 && (
        <div className="max-w-3xl mx-auto mb-4">
          <Button 
            variant="ghost" 
            onClick={handlePrevious}
            className="flex items-center gap-1"
            disabled={state.isSubmitting}
          >
            <ArrowLeft className="h-4 w-4" />
            Previous Question
          </Button>
        </div>
      )}
      
      {state.error && (
        <div className="max-w-3xl mx-auto mb-4 p-3 bg-destructive/10 text-destructive rounded-md flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>{state.error}</span>
        </div>
      )}
      
      <QuestionCard 
        question={currentQuestion}
        onAnswer={handleAnswer}
        onNext={handleNext}
        currentAnswer={state.answers[currentQuestion.id]}
        isLastQuestion={state.currentQuestionIndex === questions.length - 1}
        error={state.error}
      />
    </div>
  );
};

export default Assessment;
