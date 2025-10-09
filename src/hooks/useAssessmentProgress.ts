import { useState, useEffect } from 'react';
import { Question } from '@/lib/api/types/assessment';

export interface AssessmentProgressState {
  currentQuestionIndex: number;
  currentCategory: string;
  progress: {
    current: number;
    total: number;
    byCategory: Record<string, { current: number; total: number }>;
  };
}

export const useAssessmentProgress = (questions: Question[] | undefined) => {
  const [progressState, setProgressState] = useState<AssessmentProgressState>({
    currentQuestionIndex: 0,
    currentCategory: '',
    progress: {
      current: 1,
      total: 0,
      byCategory: {}
    }
  });

  useEffect(() => {
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
      
      setProgressState(prev => ({
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

  // Add function to set current question index externally (for resume)
  const setCurrentQuestionIndex = (index: number) => {
    if (!questions || index < 0 || index >= questions.length) {
      return;
    }
    
    const question = questions[index];
    const category = question.category.id;
    
    // Calculate category progress
    const questionsInCategory = questions.filter(q => q.category.id === category);
    const questionIndexInCategory = questionsInCategory.findIndex(q => q.id === question.id) + 1;
    
    setProgressState(prev => ({
      ...prev,
      currentQuestionIndex: index,
      currentCategory: category,
      progress: {
        ...prev.progress,
        current: index + 1,
        byCategory: {
          ...prev.progress.byCategory,
          [category]: {
            current: questionIndexInCategory,
            total: questionsInCategory.length
          }
        }
      }
    }));
    
  };

  const handleNext = () => {
    if (!questions) return;
    
    if (progressState.currentQuestionIndex < questions.length - 1) {
      const nextIndex = progressState.currentQuestionIndex + 1;
      const nextQuestion = questions[nextIndex];
      const nextCategory = nextQuestion.category.id;
      
      // Update category progress
      const updatedCategoryProgress = { ...progressState.progress.byCategory };
      
      if (questions[progressState.currentQuestionIndex].category.id === nextCategory) {
        updatedCategoryProgress[nextCategory].current += 1;
      } else {
        // Reset for new category
        updatedCategoryProgress[nextCategory].current = 1;
      }
      
      setProgressState(prev => ({
        ...prev,
        currentQuestionIndex: nextIndex,
        currentCategory: nextCategory,
        progress: {
          ...prev.progress,
          current: nextIndex + 1,
          byCategory: updatedCategoryProgress
        }
      }));
      
      return true;
    } 
    
    return false;
  };

  const handlePrevious = () => {
    if (!questions || progressState.currentQuestionIndex <= 0) return;
    
    const prevIndex = progressState.currentQuestionIndex - 1;
    const prevQuestion = questions[prevIndex];
    const prevCategory = prevQuestion.category.id;
    
    // Update category progress
    const updatedCategoryProgress = { ...progressState.progress.byCategory };
    
    if (questions[progressState.currentQuestionIndex].category.id === prevCategory) {
      updatedCategoryProgress[prevCategory].current -= 1;
    } else {
      // Update for previous category
      const questionsInPrevCategory = questions.filter(q => q.category.id === prevCategory).length;
      updatedCategoryProgress[prevCategory].current = questionsInPrevCategory - 1;
    }
    
    setProgressState(prev => ({
      ...prev,
      currentQuestionIndex: prevIndex,
      currentCategory: prevCategory,
      progress: {
        ...prev.progress,
        current: prevIndex + 1,
        byCategory: updatedCategoryProgress
      }
    }));
  };

  return {
    ...progressState,
    handleNext,
    handlePrevious,
    setCurrentQuestionIndex
  };
};
