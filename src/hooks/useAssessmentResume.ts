import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

export const useAssessmentResume = (sessionId: string | null, enabled: boolean) => {
  return useQuery({
    queryKey: ['assessment-resume', sessionId],
    queryFn: async () => {
      try {
        const response = await apiClient.get(
          `/user-responses/session/${sessionId}/resume`
        );
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log('ℹ️ Resume endpoint returned 404 - no resume data available yet');
          return null;
        }
        throw error;
      }
    },
    enabled: !!sessionId && enabled,
    staleTime: 0,
    retry: false,
  });
};
