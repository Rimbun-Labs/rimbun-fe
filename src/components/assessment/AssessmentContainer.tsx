import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Question, UserAnswer } from '@/lib/api/types/assessment';
import { AssessmentProgressState } from '@/hooks/useAssessmentProgress';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';
import CategoryHeader from './CategoryHeader';
import { ComponentErrorBoundary } from '@/components/error/ComponentErrorBoundary';

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
  const questionsInCurrentCategory = questions.filter(
    q => q.category.id === currentQuestion.category.id
  );
  const currentQuestionInCategory = questionsInCurrentCategory.findIndex(
    q => q.id === currentQuestion.id
  ) + 1;
  
  return (
    <div className="w-full">
      {/* Main Header */}
      <div className="w-full space-y-4 mb-10">
        <h1 className="text-3xl font-bold text-foreground">
          Investment Profile Assessment
        </h1>
        <p className="text-muted-foreground text-lg">
          Let's understand your investment preferences to provide personalized recommendations
        </p>
      </div>
      
      <div className="space-y-8">
        {/* Progress Bar */}
        <ProgressBar 
          currentStep={progress.current} 
          totalSteps={progress.total}
          category={currentQuestion.category.name}
        />
        
        {/* Category Header */}
        <CategoryHeader 
          category={currentQuestion.category}
          questionCount={questionsInCurrentCategory.length}
          currentQuestion={currentQuestionInCategory}
        />
        
        {/* Navigation */}
        {currentQuestionIndex > 0 && (
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={onPrevious}
              className="flex items-center gap-3 border-border hover:bg-muted hover:text-foreground"
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4" />
              Previous Question
            </Button>
          </div>
        )}
        
        {/* Error Display */}
        {error && (
          <div className="w-full">
            <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-destructive mr-3" />
              <span className="text-destructive font-medium">{error}</span>
            </div>
          </div>
        )}
        
        {/* Question Card */}
        <QuestionCard 
          question={currentQuestion}
          onAnswer={onAnswer}
          onNext={onNext}
          currentAnswer={answers[currentQuestion.id]}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
          error={error || undefined}
        />
      </div>
    </div>
  );
};

// Wrap the AssessmentContainer component with ComponentErrorBoundary
export const AssessmentContainerWithErrorBoundary: React.FC<AssessmentContainerProps> = (props) => {
  return (
    <ComponentErrorBoundary 
      componentName="AssessmentContainer"
      variant="card"
      showDetails={false}
    >
      <AssessmentContainer {...props} />
    </ComponentErrorBoundary>
  );
};
