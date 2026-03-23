import { apiClient } from './client';
import type { PeopleLikeYouInsight } from './types/banking';

/** Response from GET /insights/people-like-you (standalone endpoint for any product list) */
export interface PeopleLikeYouInsightItem extends PeopleLikeYouInsight {
  productId?: string; // when returned from standalone API, for mapping to products
}

export interface PeopleLikeYouInsightsResponse {
  insights: PeopleLikeYouInsightItem[];
}

export type ProductDomain = 'banking' | 'insurance';

/**
 * GET /api/v1/insights/people-like-you
 * Returns "people like you" insights for the given product IDs and domain.
 * Auth required. Only products that meet segment threshold (50/10) are returned.
 */
export async function getPeopleLikeYouInsights(
  productIds: string[],
  productDomain: ProductDomain = 'banking'
): Promise<PeopleLikeYouInsightsResponse> {
  if (productIds.length === 0) {
    return { insights: [] };
  }
  const response = await apiClient.get<PeopleLikeYouInsightsResponse>(
    '/insights/people-like-you',
    {
      params: {
        productIds: productIds.join(','),
        productDomain,
      },
    }
  );
  return response.data;
}
