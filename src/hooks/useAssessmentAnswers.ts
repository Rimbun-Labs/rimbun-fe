import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Question, UserAnswer } from '@/lib/api/types/assessment';
import { userResponsesApi } from '@/lib/api/userResponsesApi';
import { toast } from "sonner";

export const useAssessmentAnswers = (sessionId: string | null) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: userResponsesApi.submitAnswer,
    onError: () => {
      toast.error("Failed to save your answer");
      setError("Failed to save your answer. Please try again.");
    }
  });

  const handleAnswer = async (answer: UserAnswer, question: Question) => {
    if (!sessionId) return;
    console.log("answerxx", answer)
    const formattedAnswer = userResponsesApi.formatAnswerValue(answer.answer, question);
    
    // Update answers state immediately
    setAnswers(prev => ({
      ...prev,
      [answer.questionId]: formattedAnswer
    }));
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      console.log("mutation",{
        responseGroupId: sessionId,
        questionId: answer.questionId,
        answer: formattedAnswer
      })
      await submitAnswerMutation.mutateAsync({
        responseGroupId: sessionId,
        questionId: answer.questionId,
        answer: formattedAnswer
      });
      
      return formattedAnswer;
    } catch (error) {
      console.log(error)
      setError("Failed to save your answer. Please try again.");
      return undefined;
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateCurrentAnswer = (question: Question, immediateAnswer?: any): boolean => {
    // Use immediate answer if provided (for synchronous validation), otherwise use from state
    const currentAnswer = immediateAnswer !== undefined ? immediateAnswer : answers[question.id];
    
    // If the question is required and there's no answer
    if (question.required && (currentAnswer === undefined || currentAnswer === null || currentAnswer === '')) {
      setError("This question requires an answer");
      toast.error("Please answer this question before continuing");
      return false;
    }
    
    // Specific validation for number type
    if (question.questionType === 'number' && currentAnswer !== undefined) {
      const numValue = Number(currentAnswer);
      if (isNaN(numValue) || numValue < 0) {
        setError("Please enter a valid number");
        return false;
      }
    }
    
    return true;
  };

  return {
    answers,
    isSubmitting,
    error,
    handleAnswer,
    validateCurrentAnswer,
    setError
  };
};
