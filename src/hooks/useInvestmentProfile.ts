import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { investmentProfileApi } from '@/lib/api/investmentProfileApi';
import { singleViewProfileQueryKey } from '@/hooks/useSingleViewProfile';
import { profileNeedsQueryKey } from '@/hooks/useProfileNeeds';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import type {
  AddExistingPositionRequest,
  UpdateExistingPositionRequest,
} from '@/lib/api/types/investmentProfile';

export const investmentProfileQueryKey = ['investment', 'profile'] as const;

/**
 * Get current user's investment profile (positions + share class/fund details).
 */
export function useInvestmentProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...investmentProfileQueryKey, user?.uid],
    queryFn: async () => {
      if (!user) {
        throw new Error('User must be authenticated');
      }
      return investmentProfileApi.getProfile();
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Add a position to the user's investment profile.
 */
export function useAddPosition() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (body: AddExistingPositionRequest) => {
      if (!user) {
        throw new Error('User must be authenticated');
      }
      await investmentProfileApi.addPosition(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investmentProfileQueryKey });
      queryClient.invalidateQueries({ queryKey: singleViewProfileQueryKey });
      queryClient.invalidateQueries({ queryKey: profileNeedsQueryKey });
      toast.success('Position added to your profile');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add position');
    },
  });
}

/**
 * Update a position in the user's investment profile.
 */
export function useUpdatePosition(shareClassId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (body: UpdateExistingPositionRequest) => {
      if (!user) {
        throw new Error('User must be authenticated');
      }
      await investmentProfileApi.updatePosition(shareClassId, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investmentProfileQueryKey });
      queryClient.invalidateQueries({ queryKey: singleViewProfileQueryKey });
      queryClient.invalidateQueries({ queryKey: profileNeedsQueryKey });
      toast.success('Position updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update position');
    },
  });
}

/**
 * Remove a position from the user's investment profile.
 */
export function useDeletePosition() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (shareClassId: string) => {
      if (!user) {
        throw new Error('User must be authenticated');
      }
      await investmentProfileApi.deletePosition(shareClassId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investmentProfileQueryKey });
      queryClient.invalidateQueries({ queryKey: singleViewProfileQueryKey });
      queryClient.invalidateQueries({ queryKey: profileNeedsQueryKey });
      toast.success('Position removed from your profile');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove position');
    },
  });
}
