
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Question, UserAnswer } from '@/lib/api/types/assessment';
import { AssessmentProgressState } from '@/hooks/useAssessmentProgress';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';
import CategoryHeader from './CategoryHeader';

interface AssessmentContainerProps {
  questions: Question[];
  currentQuestionIndex: number;
  progress: AssessmentProgressState['progress'];
  answers: Record<string, any>;
  error: string | null;
  isSubmitting: boolean;
  onAnswer: (answer: UserAnswer) => Promise<any>;
  onNext: () => void;
  onPrevious: () => void;
}

export const AssessmentContainer: React.FC<AssessmentContainerProps> = ({
  questions,
  currentQuestionIndex,
  progress,
  answers,
  error,
  isSubmitting,
  onAnswer,
  onNext,
  onPrevious
}) => {
  const currentQuestion = questions[currentQuestionIndex];
  console.log(currentQuestion)
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
        currentStep={progress.current} 
        totalSteps={progress.total}
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
            onClick={onPrevious}
            className="flex items-center gap-1"
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4" />
            Previous Question
          </Button>
        </div>
      )}
      
      {error && (
        <div className="max-w-3xl mx-auto mb-4 p-3 bg-destructive/10 text-destructive rounded-md flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <QuestionCard 
        question={currentQuestion}
        onAnswer={onAnswer}
        onNext={onNext}
        currentAnswer={answers[currentQuestion.id]}
        isLastQuestion={currentQuestionIndex === questions.length - 1}
        error={error || undefined}
      />
    </div>
  );
};
