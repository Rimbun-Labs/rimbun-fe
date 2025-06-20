import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { toast } from "sonner";

export interface PracticeQuestionData {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  hints?: string[];
  relatedMetrics?: string[];
}

export interface PracticeQuestionProps {
  data: PracticeQuestionData;
  mode: 'learning' | 'library';
  onComplete?: (isCorrect: boolean) => void;
  onHint?: () => void;
  showExplanation?: boolean;
  allowRetry?: boolean;
  className?: string;
}

export const PracticeQuestion: React.FC<PracticeQuestionProps> = ({
  data,
  mode,
  onComplete,
  onHint,
  showExplanation = false,
  allowRetry = true,
  className
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(-1);
  const [showFullExplanation, setShowFullExplanation] = useState(showExplanation);

  const isCorrect = selectedAnswer === data.options[data.correct];
  const showHints = mode === 'learning' && data.hints && data.hints.length > 0;
  const hasMoreHints = showHints && currentHintIndex < (data.hints?.length || 0) - 1;

  const handleAnswerSelect = (answer: string) => {
    if (hasAnswered && !allowRetry) return;
    setSelectedAnswer(answer);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    
    setHasAnswered(true);
    if (onComplete) {
      onComplete(isCorrect);
    }

    if (isCorrect) {
      toast.success("Correct! 🎉");
    } else {
      toast.error("Not quite right. Try again!");
    }
  };

  const handleShowHint = () => {
    if (!showHints || !data.hints) return;
    
    const nextHintIndex = currentHintIndex + 1;
    setCurrentHintIndex(nextHintIndex);
    if (onHint) {
      onHint();
    }
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setHasAnswered(false);
    setCurrentHintIndex(-1);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6 space-y-6">
        {/* Question */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Practice Question</h3>
          <p className="text-foreground">{data.question}</p>
        </div>

        {/* Options */}
        <RadioGroup
          value={selectedAnswer || ""}
          onValueChange={handleAnswerSelect}
          className="space-y-3"
          disabled={hasAnswered && !allowRetry}
        >
          {data.options.map((option, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg border transition-colors",
                hasAnswered && index === data.correct && "bg-green-50 border-green-200",
                hasAnswered && selectedAnswer === option && index !== data.correct && "bg-red-50 border-red-200",
                !hasAnswered && "hover:bg-slate-50 border-slate-200"
              )}
            >
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                {option}
              </Label>
              {hasAnswered && index === data.correct && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
              {hasAnswered && selectedAnswer === option && index !== data.correct && (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          ))}
        </RadioGroup>

        {/* Hints - Only show in learning mode */}
        {showHints && currentHintIndex >= 0 && data.hints && (
          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-blue-700">
              <HelpCircle className="h-5 w-5" />
              <span className="font-medium">Hint {currentHintIndex + 1}</span>
            </div>
            <p className="text-blue-700">{data.hints[currentHintIndex]}</p>
          </div>
        )}

        {/* Explanation - Show after answering in both modes */}
        {(showFullExplanation || hasAnswered) && (
          <div className="bg-slate-50 p-4 rounded-lg space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Explanation:</span>{" "}
              {data.explanation}
            </p>
            {data.relatedMetrics && data.relatedMetrics.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-muted-foreground">Related Metrics:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {data.relatedMetrics.map((metric, index) => (
                    <li key={index}>{metric}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Actions - Show in both modes */}
        <div className="flex justify-between items-center pt-4">
          <div className="flex gap-2">
            {mode === 'learning' && showHints && hasMoreHints && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleShowHint}
                disabled={hasAnswered && !allowRetry}
              >
                Show Hint
              </Button>
            )}
            {hasAnswered && allowRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
              >
                Try Again
              </Button>
            )}
          </div>
          {!hasAnswered && (
            <Button
              onClick={handleCheckAnswer}
              disabled={!selectedAnswer}
            >
              Check Answer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PracticeQuestion; 