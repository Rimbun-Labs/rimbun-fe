
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createSession } from '@/lib/api/assessmentApi';
import { toast } from "sonner";

export const useAssessmentSession = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Create session
  const createSessionMutation = useMutation({
    mutationFn: () => createSession({ questionnaireType: "ONBOARDING" }),
    onSuccess: (data) => {
      if (data && data.id) {
        setSessionId(data.id);
        setRetryCount(0);
        // Store session ID in localStorage for persistence
        localStorage.setItem('assessmentSessionId', data.id);
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
    const savedSessionId = localStorage.getItem('assessmentSessionId');
    if (savedSessionId) {
      setSessionId(savedSessionId);
    } else {
      createSessionMutation.mutate();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionId) {
        localStorage.removeItem('assessmentSessionId');
      }
    };
  }, [sessionId]);

  const handleRetry = () => {
    setRetryCount(0);
    createSessionMutation.mutate();
  };

  return { 
    sessionId, 
    isCreatingSession: createSessionMutation.isPending, 
    handleRetry 
  };
};
