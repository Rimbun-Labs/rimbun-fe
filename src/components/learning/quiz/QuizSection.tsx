import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getQuizQuestions, submitQuizAttempt } from '@/lib/api/quizApi';
import { Question } from '@/lib/api/types/assessment';
import { QuizState, QuizResult } from '@/lib/api/types/quiz';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface QuizSectionProps {
  assetClass: string;
  responseGroupId: string;
  onClose: () => void;
}

const QuizSection: React.FC<QuizSectionProps> = ({ 
  assetClass, 
  responseGroupId,
  onClose 
}) => {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    isComplete: false
  });

  // Fetch questions
  const { data: questions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['quiz', assetClass, responseGroupId],
    queryFn: () => getQuizQuestions(assetClass, responseGroupId),
    enabled: !!assetClass && !!responseGroupId
  });

  const submitMutation = useMutation({
    mutationFn: (answers: Record<string, string>) => 
      submitQuizAttempt(assetClass, responseGroupId, Object.entries(answers).map(([questionId, answerId]) => ({
        questionId,
        selectedAnswer: answerId
      }))),
    onSuccess: (result) => {
      setState(prev => ({ ...prev, isComplete: true, result }));
      toast.success('Quiz completed successfully!');
    },
    onError: (error) => {
      toast.error('Failed to submit quiz. Please try again.');
    }
  });

  const currentQuestion = questions?.[state.currentQuestionIndex];
  const progress = (state.currentQuestionIndex / (questions?.length || 1)) * 100;

  const handleAnswer = (answer: string) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [currentQuestion?.id || '']: answer }
    }));
  };

  const handleNext = () => {
    if (currentQuestion && state.currentQuestionIndex < (questions?.length || 0) - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    } else {
      submitMutation.mutate(state.answers);
    }
  };

  const handlePrevious = () => {
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
    }
  };

  if (isLoadingQuestions) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-slate-600">No questions available for this asset class.</p>
            <Button onClick={onClose} className="mt-4">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (state.isComplete && state.result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Score:</span>
              <span className="font-semibold">{state.result.score}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Correct Answers:</span>
              <span className="font-semibold">{state.result.correctAnswers} of {state.result.totalQuestions}</span>
            </div>
            {state.result.answers && state.result.answers.length > 0 && (
              <div className="space-y-4 mt-6">
                {state.result.answers.map((answer, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    {answer.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">Question {index + 1}</p>
                      {answer.explanation && (
                        <p className="text-sm text-gray-600 mt-1">{answer.explanation}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button onClick={onClose} className="w-full mt-6">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Your Knowledge</CardTitle>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">
              Question {state.currentQuestionIndex + 1} of {questions.length}
            </h3>
            <p className="text-gray-700">{currentQuestion?.questionText}</p>
          </div>

          <RadioGroup
            value={state.answers[currentQuestion?.id || '']}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {currentQuestion?.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id}>{option.optionLabel}</Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={state.currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!state.answers[currentQuestion?.id || '']}
            >
              {state.currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizSection; 