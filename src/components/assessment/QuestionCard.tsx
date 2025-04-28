import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Question, UserAnswer } from "@/lib/api/assessmentApi";
import { Info, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  const renderAnswerInput = () => {
    switch (question.questionType) {
      case 'multiple_choice':
        return (
          <RadioGroup
            value={answer as string}
            onValueChange={handleAnswerChange}
            className="space-y-3"
            aria-label={question.questionText}
          >
            {question.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="text-base cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <Label htmlFor={`number-${question.id}`}>Enter a number</Label>
            <Input
              id={`number-${question.id}`}
              type="number"
              value={answer as number || ''}
              onChange={(e) => handleAnswerChange(Number(e.target.value))}
              className="w-full"
              placeholder={question.placeholder}
              aria-invalid={!!validationError}
              aria-describedby={validationError ? `error-${question.id}` : undefined}
            />
          </div>
        );

      case 'boolean':
        return (
          <RadioGroup
            value={String(answer)}
            onValueChange={(value) => handleAnswerChange(value === 'true')}
            className="space-y-3"
            aria-label={question.questionText}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id={`${question.id}-yes`} />
              <Label htmlFor={`${question.id}-yes`} className="text-base cursor-pointer">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={`${question.id}-no`} />
              <Label htmlFor={`${question.id}-no`} className="text-base cursor-pointer">
                No
              </Label>
            </div>
          </RadioGroup>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto animate-fade-in shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-primary mb-2">
            {question.category.name}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </div>
          {question.whyWeAsk && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Info className="h-4 w-4" />
                    <span className="sr-only">Why we ask</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{question.whyWeAsk}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <CardTitle className="text-2xl">{question.questionText}</CardTitle>
        <CardDescription>{question.category.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {renderAnswerInput()}
        {validationError && (
          <div className="mt-2 flex items-center text-sm text-destructive" id={`error-${question.id}`}>
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>{validationError}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Answer carefully - your financial profile depends on it
        </div>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          aria-label={isLastQuestion ? "Complete assessment" : "Next question"}
        >
          {isSubmitting ? "Saving..." : isLastQuestion ? "Complete" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;
