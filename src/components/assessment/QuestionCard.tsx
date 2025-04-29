
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Question, UserAnswer } from "@/lib/api/types/assessment";
import { QuestionHeader } from './question/QuestionHeader';
import { AnswerInputs } from './question/AnswerInputs';
import { ValidationError } from './question/ValidationError';
import { QuestionFooter } from './question/QuestionFooter';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: UserAnswer) => void;
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
  const [answer, setAnswer] = React.useState<string | number | boolean>(
    currentAnswer ?? (question.questionType === 'number' ? 0 : '')
  );
  const [validationError, setValidationError] = React.useState<string | null>(error || null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (currentAnswer !== undefined) {
      setAnswer(currentAnswer);
    }
  }, [currentAnswer]);

  React.useEffect(() => {
    if (error) {
      setValidationError(error);
    }
  }, [error]);

  const validateAnswer = (): boolean => {
    if (question.required) {
      if (answer === '' || answer === undefined || answer === null) {
        setValidationError('Please provide an answer');
        return false;
      }
      if (question.questionType === 'number' && (isNaN(Number(answer)) || Number(answer) < 0)) {
        setValidationError('Please enter a valid number');
        return false;
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
      await onAnswer({
        questionId: question.id,
        answer: answer,
      });
      onNext();
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
    <Card className="w-full max-w-3xl mx-auto animate-fade-in shadow-lg">
      <QuestionHeader question={question} />
      <CardContent>
        <AnswerInputs
          question={question}
          answer={answer}
          onAnswerChange={handleAnswerChange}
          validationError={validationError}
        />
        <ValidationError error={validationError || ''} questionId={question.id} />
      </CardContent>
      <QuestionFooter 
        isSubmitting={isSubmitting}
        isLastQuestion={isLastQuestion}
        onSubmit={handleSubmit}
      />
    </Card>
  );
};

export default QuestionCard;
