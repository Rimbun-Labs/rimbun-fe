import { useQuery } from '@tanstack/react-query';
import { getSingleViewProfile } from '@/lib/api/profileApi';

export const singleViewProfileQueryKey = ['single-view-profile'] as const;

/**
 * Single-view profile: identity, assessment, spending, goals, banking, statementAccount.
 * One GET /profile call. Each section can be null; handle in UI.
 * Cache 2 minutes; invalidate after profile-changing actions (goals, banking, spending, assessment).
 */
export function useSingleViewProfile() {
  return useQuery({
    queryKey: singleViewProfileQueryKey,
    queryFn: getSingleViewProfile,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
}
