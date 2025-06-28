import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Question, UserAnswer, SaveUserResponseRequest } from '@/lib/api/types/assessment';
import { userResponsesApi } from '@/lib/api/userResponsesApi';
import { toast } from "sonner";
import { config } from '@/lib/api/config';

export const useAssessmentAnswers = (sessionId: string | null) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: userResponsesApi.submitAnswer,
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save your answer");
      setError(error.message || "Failed to save your answer. Please try again.");
    }
  });

  // Add function to load existing answers (for resume)
  const loadExistingAnswers = async (sessionId: string) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/user-responses/session/${sessionId}/questions-answers`);
      if (response.ok) {
        const data = await response.json();
        const answers = data.questionsWithAnswers.reduce((acc: any, q: any) => {
          acc[q.id] = q.answer.value || q.answer.selectedOption?.id || q.answer.answerText || q.answer.answerNumber || q.answer.answerBoolean;
          return acc;
        }, {});
        setAnswers(answers);
        return answers;
      }
      return {};
    } catch (error) {
      console.error('Failed to load existing answers:', error);
      return {};
    }
  };

  const handleAnswer = async (answer: UserAnswer, question: Question) => {
    if (!sessionId) {
      throw new Error('No session ID available');
    }

    try {
      // Format the answer according to the question type
      const formattedAnswer = userResponsesApi.formatAnswerForApi(answer.answer, question.questionType);
      
      // Create the request object with a properly formatted string answer
      const request: SaveUserResponseRequest = {
        responseGroupId: sessionId,
        questionId: answer.questionId,
        answer: formattedAnswer
      };

      // Update answers state immediately
      setAnswers(prev => ({
        ...prev,
        [answer.questionId]: formattedAnswer
      }));
      
      setError(null);
      setIsSubmitting(true);
      
      // Submit the answer
      await submitAnswerMutation.mutateAsync(request);
      
      return formattedAnswer;
    } catch (error) {
      console.error('Error handling answer:', error);
      setError(error instanceof Error ? error.message : "Failed to save your answer. Please try again.");
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
    setError,
    loadExistingAnswers,
    setAnswers
  };
};
