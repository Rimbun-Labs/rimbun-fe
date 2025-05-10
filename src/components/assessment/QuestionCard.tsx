import React, { useState, useEffect } from 'react';
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

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  onNext,
  currentAnswer,
  isLastQuestion,
  error
}) => {
  // Initialize with currentAnswer if provided, otherwise use appropriate default
  const getInitialAnswer = () => {
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

  const [answer, setAnswer] = useState<string | number | boolean>(getInitialAnswer());
  const [validationError, setValidationError] = useState<string | null>(error || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update answer state when currentAnswer prop changes
  useEffect(() => {
    if (currentAnswer !== undefined) {
      setAnswer(currentAnswer);
    }
  }, [currentAnswer]);

  // Update validation error when error prop changes
  useEffect(() => {
    if (error) {
      setValidationError(error);
    }
  }, [error]);

  const validateAnswer = (): boolean => {
    if (question.required) {
      if (answer === '' || answer === undefined || answer === null) {
        setValidationError('This question requires an answer');
        return false;
      }

      switch (question.questionType) {
        case 'number':
          const numValue = Number(answer);
          if (isNaN(numValue)) {
            setValidationError('Please enter a valid number');
            return false;
          }
          if (numValue < 0) {
            setValidationError('Please enter a positive number');
            return false;
          }
          break;

        case 'multiple_choice':
        case 'select':
          if (!answer || typeof answer !== 'string') {
            setValidationError('Please select an option');
            return false;
          }
          break;

        case 'single_text':
          if (!answer || typeof answer !== 'string' || answer.trim() === '') {
            setValidationError('Please enter your answer');
            return false;
          }
          break;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setValidationError(null);

    if (!validateAnswer()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Send the answer to the parent component and wait for processing
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
      setValidationError('Failed to save your answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswerChange = (value: string | number | boolean) => {
    setAnswer(value);
    setValidationError(null);
  };

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
