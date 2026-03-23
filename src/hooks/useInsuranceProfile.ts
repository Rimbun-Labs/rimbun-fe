import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { insuranceProfileApi } from '@/lib/api/insuranceProfileApi';
import { singleViewProfileQueryKey } from '@/hooks/useSingleViewProfile';
import { profileNeedsQueryKey } from '@/hooks/useProfileNeeds';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import type {
  AddExistingInsuranceProductRequest,
  UpdateExistingInsuranceProductRequest,
} from '@/lib/api/types/insuranceProfile';

export const insuranceProfileQueryKey = ['insurance', 'profile'] as const;

/**
 * Get current user's insurance profile (policies + product details).
 */
export function useInsuranceProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...insuranceProfileQueryKey, user?.uid],
    queryFn: async () => {
      if (!user) {
        throw new Error('User must be authenticated');
      }
      return insuranceProfileApi.getProfile();
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Add a policy to the user's insurance profile.
 */
export function useAddInsuranceProduct() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (body: AddExistingInsuranceProductRequest) => {
      if (!user) {
        throw new Error('User must be authenticated');
      }
      await insuranceProfileApi.addProduct(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: insuranceProfileQueryKey });
      queryClient.invalidateQueries({ queryKey: singleViewProfileQueryKey });
      queryClient.invalidateQueries({ queryKey: profileNeedsQueryKey });
      toast.success('Policy added to your profile');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add policy');
    },
  });
}

/**
 * Update a policy in the user's insurance profile.
 */
export function useUpdateInsuranceProduct(productId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (body: UpdateExistingInsuranceProductRequest) => {
      if (!user) {
        throw new Error('User must be authenticated');
      }
      await insuranceProfileApi.updateProduct(productId, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: insuranceProfileQueryKey });
      queryClient.invalidateQueries({ queryKey: singleViewProfileQueryKey });
      queryClient.invalidateQueries({ queryKey: profileNeedsQueryKey });
      toast.success('Policy updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update policy');
    },
  });
}

/**
 * Remove a policy from the user's insurance profile.
 */
export function useDeleteInsuranceProduct() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!user) {
        throw new Error('User must be authenticated');
      }
      await insuranceProfileApi.deleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: insuranceProfileQueryKey });
      queryClient.invalidateQueries({ queryKey: singleViewProfileQueryKey });
      queryClient.invalidateQueries({ queryKey: profileNeedsQueryKey });
      toast.success('Policy removed from your profile');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove policy');
    },
  });
}
