import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bankingApi } from '@/lib/api/bankingApi';
import {
  transformRecommendationsResponse,
  transformComparisonResponse,
  transformProfileResponse,
  transformCatalogItem,
} from '@/lib/utils/bankingTransformers';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from '@/contexts/SessionContext';
import type {
  BankingProduct,
  ProductComparison,
  UserProduct,
} from '@/lib/api/types/banking';

/**
 * Get banking product recommendations
 * Backend extracts user ID from Authorization token
 * Only enabled when user has completed assessment
 */
export function useBankingRecommendations(filters?: {
  goalId?: string;
  productType?: string;
  limit?: number;
  includeIneligible?: boolean;
}) {
  const { user } = useAuth();
  const { session } = useSession();

  return useQuery({
    queryKey: ['banking', 'recommendations', user?.uid, filters],
    queryFn: async () => {
      if (!user) {
        throw new Error('User must be authenticated');
      }
      const response = await bankingApi.getRecommendations(filters);
      return transformRecommendationsResponse(response);
    },
    enabled: !!user && !!session?.isCompleted, // Only fetch when assessment is completed
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Compare banking products
 * Backend extracts user ID from Authorization token
 */
export function useCompareProducts(productIds: string[]) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['banking', 'compare', user?.uid, productIds],
    queryFn: async () => {
      if (!user) {
        throw new Error('User must be authenticated');
      }
      const response = await bankingApi.compareProducts(productIds);
      return transformComparisonResponse(response);
    },
    enabled: !!user && productIds.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get user's banking profile
 * Backend extracts user ID from Authorization token
 */
export function useBankingProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['banking', 'profile', user?.uid],
    queryFn: async () => {
      if (!user) {
        throw new Error('User must be authenticated');
      }
      const response = await bankingApi.getProfile();
      return transformProfileResponse(response);
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get product catalog
 */
export function useProductCatalog(filters?: {
  productType?: string;
  bank?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['banking', 'catalog', filters],
    queryFn: async () => {
      const response = await bankingApi.getProducts(filters);
      
      // Log for debugging
      console.log('[Catalog] API response structure:', {
        hasProducts: !!response.products,
        productsCount: response.products?.length || 0,
        total: response.total,
        firstProduct: response.products?.[0] ? {
          id: response.products[0].id,
          productName: response.products[0].productName,
          bankName: response.products[0].bankName,
          productType: response.products[0].productType,
          hasAttributes: !!response.products[0].attributes,
        } : null,
      });
      
      return {
        products: response.products.map(transformCatalogItem),
        total: response.total,
        filters: response.filters,
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (catalog changes less frequently)
  });
}

/**
 * Get product history
 * Backend extracts user ID from Authorization token
 */
export function useProductHistory(filters?: {
  productId?: string;
  limit?: number;
  offset?: number;
}) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['banking', 'profile', 'history', user?.uid, filters],
    queryFn: async () => {
      if (!user) {
        throw new Error('User must be authenticated');
      }
      const response = await bankingApi.getProductHistory(filters);
      return transformProfileResponse(response);
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Add product to user's profile
 * Backend extracts user ID from Authorization token
 * Fields vary by product type - only send relevant fields
 */
export function useAddProduct() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (productData: { 
      productId: string;
      // Savings/Fixed Deposit fields
      currentBalance?: number;
      // Credit Card fields
      outstandingBalance?: number;
      creditLimit?: number;
      // Loan fields
      loanAmount?: number;
      monthlyPayment?: number;
      // Common optional fields
      openedDate?: string;
      lastUsedDate?: string;
    }) => {
      if (!user) {
        throw new Error('User must be authenticated');
      }
      await bankingApi.addProduct(productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banking', 'profile'] });
      toast.success('Product added to your profile');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add product');
    },
  });
}

/**
 * Update product in user's profile
 * Backend extracts user ID from Authorization token
 * Can update individual fields without sending all fields
 */
export function useUpdateProduct(productId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (productData: {
      // Savings/Fixed Deposit fields
      currentBalance?: number;
      // Credit Card fields
      outstandingBalance?: number;
      creditLimit?: number;
      // Loan fields
      loanAmount?: number;
      monthlyPayment?: number;
      // Common optional fields
      openedDate?: string;
      lastUsedDate?: string;
    }) => {
      if (!user) {
        throw new Error('User must be authenticated');
      }
      await bankingApi.updateProduct(productId, productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banking', 'profile'] });
      toast.success('Product updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update product');
    },
  });
}

/**
 * Delete product from user's profile
 * Backend extracts user ID from Authorization token
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      if (!user) {
        throw new Error('User must be authenticated');
      }
      await bankingApi.deleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banking', 'profile'] });
      toast.success('Product removed from your profile');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove product');
    },
  });
}
