import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { insuranceProductsApi, type InsuranceProductsFilters } from '@/lib/api/insuranceProductsApi';
import type { InsuranceProductDetailDto, InsuranceProductListResponseDto } from '@/lib/api/types/insuranceProducts';
import type { ProductDnaResponseDto } from '@/lib/api/types/documents';
import { toast } from 'sonner';

export const insuranceProductsListQueryKey = ['insurance', 'products'] as const;
export const insuranceProductDetailQueryKey = ['insurance', 'product'] as const;
export const insuranceCompareQueryKey = ['insurance', 'compare'] as const;

export function useInsuranceProducts(filters?: InsuranceProductsFilters) {
  return useQuery<InsuranceProductListResponseDto>({
    queryKey: [...insuranceProductsListQueryKey, filters],
    queryFn: () => insuranceProductsApi.getProducts(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useInsuranceProduct(productId: string | undefined) {
  return useQuery<InsuranceProductDetailDto>({
    queryKey: [...insuranceProductDetailQueryKey, productId],
    queryFn: () => insuranceProductsApi.getProduct(productId!),
    enabled: Boolean(productId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useInsuranceCompare(productIds: string[]) {
  const validIds = productIds.filter(Boolean);
  const canFetch = validIds.length >= 2 && validIds.length <= 4;

  return useQuery<{ products: InsuranceProductDetailDto[] }>({
    queryKey: [...insuranceCompareQueryKey, validIds],
    queryFn: () => insuranceProductsApi.getCompare(validIds),
    enabled: canFetch,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Enrich a catalog product with PDS-extracted productDna (from POST /documents/parse).
 * Invalidates product list and detail on success.
 */
export function useEnrichProductFromPds() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, productDna }: { productId: string; productDna: ProductDnaResponseDto }) =>
      insuranceProductsApi.enrichProductFromPds(productId, productDna),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: insuranceProductsListQueryKey });
      queryClient.invalidateQueries({ queryKey: [...insuranceProductDetailQueryKey, productId] });
      toast.success('Product updated with PDS data');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to enrich product from PDS');
    },
  });
}
