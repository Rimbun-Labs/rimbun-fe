import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Question, UserAnswer, QuestionType } from "@/lib/api/types/assessment";
import { QuestionHeader } from './question/QuestionHeader';
import { AnswerInputs } from './question/AnswerInputs';
import { ValidationError } from './question/ValidationError';
import { QuestionFooter } from './question/QuestionFooter';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: UserAnswer) => Promise<any>;
  onNext: () => void;
  currentAnswer?: string | number | boolean;
  isLastQuestion: boolean;
  error?: string;
}

// Question card state interface
interface QuestionCardState {
  answer: string | number | boolean;
  validationError: string | null;
  isSubmitting: boolean;
}

// Question card action types
type QuestionCardAction = 
  | { type: 'SET_ANSWER'; answer: string | number | boolean }
  | { type: 'SET_VALIDATION_ERROR'; error: string | null }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'RESET_VALIDATION' };

// Question card reducer
const questionCardReducer = (state: QuestionCardState, action: QuestionCardAction): QuestionCardState => {
  switch (action.type) {
    case 'SET_ANSWER':
      return {
        ...state,
        answer: action.answer,
        validationError: null // Clear validation error when answer changes
      };
    case 'SET_VALIDATION_ERROR':
      return {
        ...state,
        validationError: action.error
      };
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting
      };
    case 'RESET_VALIDATION':
      return {
        ...state,
        validationError: null
      };
    default:
      return state;
  }
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  onNext,
  currentAnswer,
  isLastQuestion,
  error
}) => {
  // Initialize with currentAnswer if provided, otherwise use appropriate default
  const getInitialAnswer = (): string | number | boolean => {
    if (currentAnswer !== undefined) return currentAnswer;
    switch (question.questionType) {
      case 'number':
        return 0;
      case 'boolean':
        return false;
      case 'multiple_choice':
      case 'select':
      case 'single_text':
      default:
        return '';
    }
  };

  // Use reducer for state management
  const [state, dispatch] = useReducer(questionCardReducer, {
    answer: getInitialAnswer(),
    validationError: error || null,
    isSubmitting: false
  });

  const { answer, validationError, isSubmitting } = state;

  // Update answer state when currentAnswer prop changes
  useEffect(() => {
    if (currentAnswer !== undefined) {
      dispatch({ type: 'SET_ANSWER', answer: currentAnswer });
    }
  }, [currentAnswer]);

  // Update validation error when error prop changes
  useEffect(() => {
    if (error) {
      dispatch({ type: 'SET_VALIDATION_ERROR', error });
    }
  }, [error]);

  // Memoized validation function
  const validateAnswer = useCallback((): boolean => {
    if (question.required) {
      if (answer === '' || answer === undefined || answer === null) {
        dispatch({ type: 'SET_VALIDATION_ERROR', error: 'This question requires an answer' });
        return false;
      }

      switch (question.questionType) {
        case 'number':
          const numValue = Number(answer);
          if (isNaN(numValue)) {
            dispatch({ type: 'SET_VALIDATION_ERROR', error: 'Please enter a valid number' });
            return false;
          }
          if (numValue < 0) {
            dispatch({ type: 'SET_VALIDATION_ERROR', error: 'Please enter a positive number' });
            return false;
          }
          break;

        case 'multiple_choice':
        case 'select':
          if (!answer || typeof answer !== 'string') {
            dispatch({ type: 'SET_VALIDATION_ERROR', error: 'Please select an option' });
            return false;
          }
          break;

        case 'single_text':
          if (!answer || typeof answer !== 'string' || answer.trim() === '') {
            dispatch({ type: 'SET_VALIDATION_ERROR', error: 'Please enter your answer' });
            return false;
          }
          break;
      }
    }
    return true;
  }, [answer, question.required, question.questionType]);

  // Memoized submit handler
  const handleSubmit = useCallback(async () => {
    dispatch({ type: 'SET_SUBMITTING', isSubmitting: true });
    dispatch({ type: 'RESET_VALIDATION' });

    if (!validateAnswer()) {
      dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
      return;
    }

    try {
      // Send the direct answer value to the parent component (not wrapped in any object)
      const result = await onAnswer({
        questionId: question.id,
        answer: answer,
        questionType: question.questionType
      });
      
      // If answer submission was successful, move to next question
      if (result !== undefined) {
        onNext();
      }
    } catch (err) {
      dispatch({ type: 'SET_VALIDATION_ERROR', error: 'Failed to save your answer. Please try again.' });
    } finally {
      dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
    }
  }, [answer, question.id, question.questionType, onAnswer, onNext, validateAnswer]);

  // Memoized answer change handler
  const handleAnswerChange = useCallback((value: string | number | boolean) => {
    dispatch({ type: 'SET_ANSWER', answer: value });
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6 space-y-6">
        <QuestionHeader question={question} />
        <div>
          <AnswerInputs
            question={question}
            answer={answer}
            onAnswerChange={handleAnswerChange}
            validationError={validationError}
          />
        </div>
        <div className="pt-4 border-t">
          <QuestionFooter
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isLastQuestion={isLastQuestion}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
