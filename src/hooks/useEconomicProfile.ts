import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEconomicProfile, upsertEconomicProfile } from '@/lib/api/profileApi';
import type { EconomicProfileDto } from '@/lib/api/types/economicProfile';
import { singleViewProfileQueryKey } from '@/hooks/useSingleViewProfile';
import { toast } from 'sonner';

export const economicProfileQueryKey = ['profile', 'economic'] as const;

export function useEconomicProfile() {
  return useQuery({
    queryKey: economicProfileQueryKey,
    queryFn: getEconomicProfile,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpsertEconomicProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EconomicProfileDto) => upsertEconomicProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: economicProfileQueryKey });
      queryClient.invalidateQueries({ queryKey: singleViewProfileQueryKey });
      toast.success('Economic profile saved');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save economic profile');
    },
  });
}

