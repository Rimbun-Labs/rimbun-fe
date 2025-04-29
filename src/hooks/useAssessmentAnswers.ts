
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
        setIsSubmitting(false);
      } catch (error) {
        setIsSubmitting(false);
        setError("Failed to save your answer. Please try again.");
      }
    } else {
      setIsSubmitting(false);
    }
  };

  const validateCurrentAnswer = (question: Question): boolean => {
    if (question.required && !answers[question.id]) {
      setError("This question requires an answer");
      toast.error("Please answer this question before continuing");
      return false;
    }
    
    if (question.questionType === 'number' && (
      isNaN(Number(answers[question.id])) || 
      Number(answers[question.id]) < 0
    )) {
      setError("Please enter a valid number");
      return false;
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
