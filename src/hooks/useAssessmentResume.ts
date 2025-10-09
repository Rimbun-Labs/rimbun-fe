import { useQuery } from '@tanstack/react-query';
import { config } from '../lib/api/config';

export const useAssessmentResume = (sessionId: string | null) => {
  return useQuery({
    queryKey: ['assessment-resume', sessionId],
    queryFn: async () => {
      const response = await fetch(`${config.API_BASE_URL}/user-responses/session/${sessionId}/resume`);
      if (response.status === 404) {
        // 404 is expected when there's no resume data yet
        console.log('ℹ️ Resume endpoint returned 404 - no resume data available yet');
        return null;
      }
      if (!response.ok) {
        throw new Error('Failed to get resume data');
      }
      return response.json();
    },
    enabled: !!sessionId,
    staleTime: 0, // Always fetch fresh data
    retry: false, // Don't retry 404 errors
  });
};
