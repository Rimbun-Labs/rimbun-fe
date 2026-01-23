/**
 * React Query hooks for investment holdings
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { investmentApi } from '@/lib/api/investmentApi';
import type { AddHoldingRequest, UpdateHoldingRequest } from '@/lib/api/types/investment';

/**
 * Get user's investment holdings
 */
export const useInvestmentHoldings = () => {
  return useQuery({
    queryKey: ['investment', 'holdings'],
    queryFn: () => investmentApi.getHoldings(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Add a new investment holding
 */
export const useAddHolding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: AddHoldingRequest['holding']) => {
      return investmentApi.addHolding({ holding: request });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investment', 'holdings'] });
      toast.success('Investment holding added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add investment holding');
    },
  });
};

/**
 * Update an existing investment holding
 */
export const useUpdateHolding = (holdingId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: Omit<UpdateHoldingRequest, 'holdingId'>) => {
      if (!holdingId) throw new Error('Holding ID is required');
      return investmentApi.updateHolding(holdingId, request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investment', 'holdings'] });
      toast.success('Investment holding updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update investment holding');
    },
  });
};

/**
 * Delete an investment holding
 */
export const useDeleteHolding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (holdingId: string) => {
      return investmentApi.deleteHolding(holdingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investment', 'holdings'] });
      toast.success('Investment holding removed successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove investment holding');
    },
  });
};



