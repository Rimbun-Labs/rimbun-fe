import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  spendingApi, 
  SpendingOverviewDto, 
  SpendingCategoryDto,
  SaveSpendingPeriodDto,
  SpendingPeriodDto
} from '@/lib/api/spendingApi';
import { toast } from 'sonner';

/**
 * Hook to get user's spending overview data
 */
export const useSpendingData = () => {
  return useQuery({
    queryKey: ['spending-overview'],
    queryFn: () => spendingApi.getSpendingOverview(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

/**
 * Hook to save user's spending overview data
 */
export const useSaveSpendingOverview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SpendingOverviewDto) => 
      spendingApi.saveSpendingOverview(data),
    onSuccess: () => {
      // Invalidate and refetch spending data
      queryClient.invalidateQueries({ queryKey: ['spending-overview'] });
      queryClient.invalidateQueries({ queryKey: ['spending-recommendations'] });
      toast.success('Spending data saved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save spending data: ${error.message}`);
    }
  });
};

/**
 * Hook to get user's spending categories
 */
export const useSpendingCategories = () => {
  return useQuery({
    queryKey: ['spending-categories'],
    queryFn: () => spendingApi.getSpendingCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3
  });
};

/**
 * Hook to add a new spending category
 */
export const useAddSpendingCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category: Omit<SpendingCategoryDto, 'id'>) => 
      spendingApi.addSpendingCategory(category),
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ['spending-categories'] });
      queryClient.invalidateQueries({ queryKey: ['spending-overview'] });
      queryClient.invalidateQueries({ queryKey: ['spending-recommendations'] });
      toast.success('Category added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add category: ${error.message}`);
    }
  });
};

/**
 * Hook to update an existing spending category
 */
export const useUpdateSpendingCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, category }: { id: string; category: Omit<SpendingCategoryDto, 'id'> }) => 
      spendingApi.updateSpendingCategory(id, category),
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ['spending-categories'] });
      queryClient.invalidateQueries({ queryKey: ['spending-overview'] });
      queryClient.invalidateQueries({ queryKey: ['spending-recommendations'] });
      toast.success('Category updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update category: ${error.message}`);
    }
  });
};

/**
 * Hook to delete a spending category
 */
export const useDeleteSpendingCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => spendingApi.deleteSpendingCategory(id),
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ['spending-categories'] });
      queryClient.invalidateQueries({ queryKey: ['spending-overview'] });
      queryClient.invalidateQueries({ queryKey: ['spending-recommendations'] });
      toast.success('Category deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete category: ${error.message}`);
    }
  });
};

/**
 * Hook to get comprehensive spending recommendations
 */
export const useSpendingRecommendations = () => {
  return useQuery({
    queryKey: ['spending-recommendations'],
    queryFn: () => spendingApi.getSpendingRecommendations(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3
  });
};

/**
 * Hook to save spending for a specific period
 */
export const useSaveSpendingPeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveSpendingPeriodDto) => 
      spendingApi.saveSpendingPeriod(data),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['spending-history'] });
      queryClient.invalidateQueries({ queryKey: ['spending-trends'] });
      queryClient.invalidateQueries({ queryKey: ['spending-overview'] });
      queryClient.invalidateQueries({ queryKey: ['spending-recommendations'] });
      toast.success('Spending period saved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save spending period: ${error.message}`);
    }
  });
};

/**
 * Hook to get spending history
 */
export const useSpendingHistory = (
  options?: {
    limit?: number;
    startYear?: number;
    startMonth?: number;
    endYear?: number;
    endMonth?: number;
  }
) => {
  return useQuery({
    queryKey: ['spending-history', options],
    queryFn: () => spendingApi.getSpendingHistory(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3
  });
};

/**
 * Hook to get spending trends analysis
 */
export const useSpendingTrends = (
  period: '3m' | '6m' | '12m' = '6m'
) => {
  return useQuery({
    queryKey: ['spending-trends', period],
    queryFn: () => spendingApi.getSpendingTrends(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3
  });
};
