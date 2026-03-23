import { useQuery } from '@tanstack/react-query';
import { getProfileNeeds } from '@/lib/api/profileApi';

export const profileNeedsQueryKey = ['profile', 'needs'] as const;

/**
 * Profile needs and gaps for dashboard "things to do" list.
 * Invalidates when single-view profile is invalidated (goals, spending, banking, etc.).
 */
export function useProfileNeeds() {
  return useQuery({
    queryKey: profileNeedsQueryKey,
    queryFn: getProfileNeeds,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
}
