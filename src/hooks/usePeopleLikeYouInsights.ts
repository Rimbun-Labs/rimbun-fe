import { useQuery } from '@tanstack/react-query';
import { getPeopleLikeYouInsights, type ProductDomain } from '@/lib/api/insightsApi';
import { useAuth } from '@/contexts/AuthContext';

export const peopleLikeYouInsightsQueryKey = (productIds: string[], productDomain: ProductDomain) =>
  ['insights', 'people-like-you', productIds, productDomain] as const;

/**
 * Fetch "people like you" insights for a list of product IDs.
 * Use for catalog or other views where recommendations API is not used (recommendations already include insight).
 * Auth required.
 */
export function usePeopleLikeYouInsights(
  productIds: string[],
  productDomain: ProductDomain = 'banking'
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: peopleLikeYouInsightsQueryKey(productIds, productDomain),
    queryFn: () => getPeopleLikeYouInsights(productIds, productDomain),
    enabled: !!user && productIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
