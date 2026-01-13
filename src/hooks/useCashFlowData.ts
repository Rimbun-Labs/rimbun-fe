import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cashFlowApi, CashFlowProjectionsDto } from '@/lib/api/cashFlowApi';
import { toast } from 'sonner';

/**
 * Hook to get user's cash flow projections
 */
export const useCashFlowProjections = () => {
  return useQuery({
    queryKey: ['cash-flow-projections'],
    queryFn: () => cashFlowApi.getCashFlowProjections(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

/**
 * Hook to refresh cash flow projections
 */
export const useRefreshCashFlowProjections = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cashFlowApi.getCashFlowProjections(),
    onSuccess: (data) => {
      // Update the cache with fresh data
      queryClient.setQueryData(['cash-flow-projections'], data);
      toast.success('Cash flow projections updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to refresh projections: ${error.message}`);
    }
  });
};
