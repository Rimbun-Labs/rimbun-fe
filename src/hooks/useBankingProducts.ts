import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bankingApi } from '@/lib/api/bankingApi';
import { singleViewProfileQueryKey } from '@/hooks/useSingleViewProfile';
import { profileNeedsQueryKey } from '@/hooks/useProfileNeeds';
import {
  transformRecommendationsResponse,
  transformComparisonResponse,
  transformProfileResponse,
  transformCatalogItem,
} from '@/lib/utils/bankingTransformers';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useSelectedCustomer } from '@/contexts/SelectedCustomerContext';

/**
 * Recommendations for the selected tenant customer.
 */
export function useBankingRecommendations(filters?: {
  goalId?: string;
  productType?: string;
  limit?: number;
  includeIneligible?: boolean;
  includeFiltered?: boolean;
  disableTypeFiltering?: boolean;
}) {
  const { user } = useAuth();
  const { selectedCustomerId } = useSelectedCustomer();

  return useQuery({
    queryKey: ['banking', 'recommendations', selectedCustomerId, filters],
    queryFn: async () => {
      const response = await bankingApi.getRecommendations(selectedCustomerId, filters);
      return transformRecommendationsResponse(response);
    },
    enabled: !!user && !!selectedCustomerId,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

export function useCompareProducts(productIds: string[]) {
  const { user } = useAuth();
  const { selectedCustomerId } = useSelectedCustomer();

  return useQuery({
    queryKey: ['banking', 'compare', selectedCustomerId, productIds],
    queryFn: async () => {
      const response = await bankingApi.compareProducts(selectedCustomerId, productIds);
      return transformComparisonResponse(response);
    },
    enabled: !!user && !!selectedCustomerId && productIds.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBankingProfile() {
  const { user } = useAuth();
  const { selectedCustomerId } = useSelectedCustomer();

  return useQuery({
    queryKey: ['banking', 'profile', selectedCustomerId],
    queryFn: async () => {
      const response = await bankingApi.getProfile(selectedCustomerId);
      return transformProfileResponse(response);
    },
    enabled: !!user && !!selectedCustomerId,
    staleTime: 5 * 60 * 1000,
  });
}

/** Shared catalog — not customer-scoped. */
export function useProductCatalog(filters?: {
  productType?: string;
  bank?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['banking', 'catalog', filters],
    queryFn: async () => {
      const response = await bankingApi.getProducts(filters);
      return {
        products: response.products.map(transformCatalogItem),
        total: response.total,
        filters: response.filters,
      };
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useProductHistory(filters?: {
  productId?: string;
  limit?: number;
  offset?: number;
}) {
  const { user } = useAuth();
  const { selectedCustomerId } = useSelectedCustomer();

  return useQuery({
    queryKey: ['banking', 'profile', 'history', selectedCustomerId, filters],
    queryFn: async () => {
      const response = await bankingApi.getProductHistory(selectedCustomerId, filters);
      return transformProfileResponse(response);
    },
    enabled: !!user && !!selectedCustomerId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();
  const { selectedCustomerId } = useSelectedCustomer();

  return useMutation({
    mutationFn: async (productData: {
      productId: string;
      currentBalance?: number;
      outstandingBalance?: number;
      creditLimit?: number;
      loanAmount?: number;
      monthlyPayment?: number;
      openedDate?: string;
      lastUsedDate?: string;
    }) => {
      await bankingApi.addProduct(selectedCustomerId, productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banking', 'profile'] });
      queryClient.invalidateQueries({ queryKey: singleViewProfileQueryKey });
      queryClient.invalidateQueries({ queryKey: profileNeedsQueryKey });
      toast.success('Product added to customer profile');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add product');
    },
  });
}

export function useUpdateProduct(productId: string) {
  const queryClient = useQueryClient();
  const { selectedCustomerId } = useSelectedCustomer();

  return useMutation({
    mutationFn: async (productData: {
      currentBalance?: number;
      outstandingBalance?: number;
      creditLimit?: number;
      loanAmount?: number;
      monthlyPayment?: number;
      openedDate?: string;
      lastUsedDate?: string;
    }) => {
      await bankingApi.updateProduct(selectedCustomerId, productId, productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banking', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['banking', 'summary'] });
      queryClient.invalidateQueries({ queryKey: singleViewProfileQueryKey });
      queryClient.invalidateQueries({ queryKey: profileNeedsQueryKey });
      toast.success('Product updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update product');
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { selectedCustomerId } = useSelectedCustomer();

  return useMutation({
    mutationFn: async (productId: string) => {
      await bankingApi.deleteProduct(selectedCustomerId, productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banking', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['banking', 'summary'] });
      queryClient.invalidateQueries({ queryKey: singleViewProfileQueryKey });
      queryClient.invalidateQueries({ queryKey: profileNeedsQueryKey });
      toast.success('Product removed from customer profile');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove product');
    },
  });
}

export function useBankingFinancialSummary() {
  const { user } = useAuth();
  const { selectedCustomerId } = useSelectedCustomer();

  return useQuery({
    queryKey: ['banking', 'summary', selectedCustomerId],
    queryFn: async () => bankingApi.getFinancialSummary(selectedCustomerId),
    enabled: !!user && !!selectedCustomerId,
    staleTime: 2 * 60 * 1000,
  });
}
