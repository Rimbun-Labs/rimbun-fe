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
export const useSpendingData = (userId: string) => {
  return useQuery({
    queryKey: ['spending-overview', userId],
    queryFn: () => spendingApi.getSpendingOverview(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

/**
 * Hook to save user's spending overview data
 */
export const useSaveSpendingOverview = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SpendingOverviewDto) => 
      spendingApi.saveSpendingOverview(userId, data),
    onSuccess: () => {
      // Invalidate and refetch spending data
      queryClient.invalidateQueries({ queryKey: ['spending-overview', userId] });
      queryClient.invalidateQueries({ queryKey: ['spending-recommendations', userId] });
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
export const useSpendingCategories = (userId: string) => {
  return useQuery({
    queryKey: ['spending-categories', userId],
    queryFn: () => spendingApi.getSpendingCategories(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3
  });
};

/**
 * Hook to add a new spending category
 */
export const useAddSpendingCategory = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category: Omit<SpendingCategoryDto, 'id'>) => 
      spendingApi.addSpendingCategory(userId, category),
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ['spending-categories', userId] });
      queryClient.invalidateQueries({ queryKey: ['spending-overview', userId] });
      queryClient.invalidateQueries({ queryKey: ['spending-recommendations', userId] });
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
export const useUpdateSpendingCategory = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, category }: { id: string; category: Omit<SpendingCategoryDto, 'id'> }) => 
      spendingApi.updateSpendingCategory(id, userId, category),
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ['spending-categories', userId] });
      queryClient.invalidateQueries({ queryKey: ['spending-overview', userId] });
      queryClient.invalidateQueries({ queryKey: ['spending-recommendations', userId] });
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
export const useDeleteSpendingCategory = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => spendingApi.deleteSpendingCategory(id, userId),
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ['spending-categories', userId] });
      queryClient.invalidateQueries({ queryKey: ['spending-overview', userId] });
      queryClient.invalidateQueries({ queryKey: ['spending-recommendations', userId] });
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
export const useSpendingRecommendations = (userId: string) => {
  return useQuery({
    queryKey: ['spending-recommendations', userId],
    queryFn: () => spendingApi.getSpendingRecommendations(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3
  });
};

/**
 * Hook to save spending for a specific period
 */
export const useSaveSpendingPeriod = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveSpendingPeriodDto) => 
      spendingApi.saveSpendingPeriod(userId, data),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['spending-history', userId] });
      queryClient.invalidateQueries({ queryKey: ['spending-trends', userId] });
      queryClient.invalidateQueries({ queryKey: ['spending-overview', userId] });
      queryClient.invalidateQueries({ queryKey: ['spending-recommendations', userId] });
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
  userId: string,
  options?: {
    limit?: number;
    startYear?: number;
    startMonth?: number;
    endYear?: number;
    endMonth?: number;
  }
) => {
  return useQuery({
    queryKey: ['spending-history', userId, options],
    queryFn: () => spendingApi.getSpendingHistory(userId, options),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3
  });
};

/**
 * Hook to get spending trends analysis
 */
export const useSpendingTrends = (
  userId: string,
  period: '3m' | '6m' | '12m' = '6m'
) => {
  return useQuery({
    queryKey: ['spending-trends', userId, period],
    queryFn: () => spendingApi.getSpendingTrends(userId, period),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3
  });
};
