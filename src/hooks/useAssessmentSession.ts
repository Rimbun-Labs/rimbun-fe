import { useState, useEffect, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createSession } from '@/lib/api/assessmentApi';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from './useLocalStorage';

export const useAssessmentSession = () => {
  const { user } = useAuth();
  const [retryCount, setRetryCount] = useState(0);
  
  // Optimized localStorage hook for session ID
  const [sessionId, setSessionId] = useLocalStorage<string | null>(
    'assessmentSessionId',
    null,
    { debounceMs: 100 }
  );
  
  // Create session
  const createSessionMutation = useMutation({
    mutationFn: () => createSession({ questionnaireType: "ONBOARDING" }),
    onSuccess: (data) => {
      if (data && data.id) {
        setSessionId(data.id);
        setRetryCount(0);
      }
    },
    onError: () => {
      toast.error("Failed to create assessment session");
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          createSessionMutation.mutate();
        }, 1000 * (retryCount + 1)); // Exponential backoff
      } else {
        toast.error("Unable to start assessment. Please try again later.");
      }
    }
  });

  // Load existing session on mount
  useEffect(() => {
    if (!sessionId) {
      createSessionMutation.mutate();
    }
  }, []);

  const handleRetry = useCallback(() => {
    setRetryCount(0);
    createSessionMutation.mutate();
  }, [createSessionMutation]);

  const clearSession = useCallback(() => {
    setSessionId(null);
  }, [setSessionId]);

  return { 
    sessionId, 
    isCreatingSession: createSessionMutation.isPending, 
    handleRetry,
    clearSession
  };
};
