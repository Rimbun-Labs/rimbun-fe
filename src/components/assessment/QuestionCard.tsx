
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Question, UserAnswer } from "@/lib/api/assessmentApi";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: UserAnswer) => void;
  onNext: () => void;
  currentAnswer?: string | number | boolean;
  isLastQuestion: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  onNext,
  currentAnswer,
  isLastQuestion
}) => {
  const [answer, setAnswer] = React.useState<string | number | boolean>(
    currentAnswer ?? (question.questionType === 'number' ? 0 : '')
  );
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = () => {
    if (answer === '') {
      setError('Please provide an answer');
      return;
    }

    onAnswer({
      questionId: question.id,
      answer: answer,
    });
    
    onNext();
  };

  const renderAnswerInput = () => {
    switch (question.questionType) {
      case 'multiple_choice':
        return (
          <RadioGroup
            value={answer as string}
            onValueChange={(value) => {
              setAnswer(value);
              setError(null);
            }}
            className="space-y-3"
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
              onChange={(e) => {
                setAnswer(Number(e.target.value));
                setError(null);
              }}
              className="w-full"
            />
          </div>
        );

      case 'boolean':
        return (
          <RadioGroup
            value={String(answer)}
            onValueChange={(value) => {
              setAnswer(value === 'true');
              setError(null);
            }}
            className="space-y-3"
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
        <div className="text-sm font-medium text-primary mb-2">
          {question.category.name}
        </div>
        <CardTitle className="text-2xl">{question.questionText}</CardTitle>
        <CardDescription>{question.category.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {renderAnswerInput()}
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Answer carefully - your financial profile depends on it
        </div>
        <Button onClick={handleSubmit}>
          {isLastQuestion ? "Complete" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;
