import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cashFlowApi, CashFlowProjectionsDto } from '@/lib/api/cashFlowApi';
import { toast } from 'sonner';

/**
 * Hook to get user's cash flow projections
 */
export const useCashFlowProjections = (userId: string) => {
  return useQuery({
    queryKey: ['cash-flow-projections', userId],
    queryFn: () => cashFlowApi.getCashFlowProjections(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

/**
 * Hook to refresh cash flow projections
 */
export const useRefreshCashFlowProjections = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cashFlowApi.getCashFlowProjections(userId),
    onSuccess: (data) => {
      // Update the cache with fresh data
      queryClient.setQueryData(['cash-flow-projections', userId], data);
      toast.success('Cash flow projections updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to refresh projections: ${error.message}`);
    }
  });
};
