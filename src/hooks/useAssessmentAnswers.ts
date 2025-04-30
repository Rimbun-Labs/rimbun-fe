
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { submitAnswer, UserAnswer, SubmitAnswerRequest, Question } from '@/lib/api/assessmentApi';
import { toast } from "sonner";

export const useAssessmentAnswers = (sessionId: string | null) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: (data: SubmitAnswerRequest) => submitAnswer(data),
    onSuccess: () => {
      // Handle success if needed
    },
    onError: () => {
      toast.error("Failed to save your answer");
      setError("Failed to save your answer. Please try again.");
    }
  });

  const handleAnswer = async (answer: UserAnswer) => {
    const { questionId } = answer;
    
    // Update answers state immediately
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer.answer
    }));
    
    setError(null);
    setIsSubmitting(true);
    
    if (sessionId) {
      let submitData: SubmitAnswerRequest = {
        responseGroupId: sessionId,
        questionId: answer.questionId,
        answer: {}
      };
      
      const answerValue = answer.answer;
      
      if (typeof answerValue === 'string') {
        if (answer.questionType === 'multiple_choice') {
          submitData.answer.selectedOption = { id: answerValue as string };
        } else {
          submitData.answer.value = answerValue as string;
        }
      } else if (typeof answerValue === 'number') {
        submitData.answer.answerNumber = answerValue as number;
      } else if (typeof answerValue === 'boolean') {
        submitData.answer.answerBoolean = answerValue as boolean;
      }
      
      try {
        await submitAnswerMutation.mutateAsync(submitData);
      } catch (error) {
        setError("Failed to save your answer. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
    
    // Return the answer for immediate validation
    return answer.answer;
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
      if (isNaN(Number(currentAnswer)) || Number(currentAnswer) < 0) {
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
