import { useQuery } from '@tanstack/react-query';
import { getGlossary, getFunds, getFundDetail, compareShareClasses } from '@/lib/api/fundsApi';
import type { FundListParams } from '@/lib/api/types/funds';

/** Options for fund detail and compare */
export type FundDetailOptions = { includeInterpretations?: boolean; includeFit?: boolean };
export type FundCompareOptions = { includeInterpretations?: boolean };

/** Query key factory for funds */
export const fundsKeys = {
  all: ['investment', 'funds'] as const,
  glossary: () => [...fundsKeys.all, 'glossary'] as const,
  list: (params?: FundListParams) => [...fundsKeys.all, 'list', params ?? {}] as const,
  detail: (fundId: string, options?: FundDetailOptions) =>
    [...fundsKeys.all, 'detail', fundId, options] as const,
  compare: (shareClassIds: string[], options?: FundCompareOptions) =>
    [...fundsKeys.all, 'compare', shareClassIds, options] as const,
};

/**
 * GET /investment/funds/glossary
 */
export function useFundGlossary() {
  return useQuery({
    queryKey: fundsKeys.glossary(),
    queryFn: getGlossary,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * GET /investment/funds (list with optional filters)
 */
export function useFundCatalog(params?: FundListParams) {
  return useQuery({
    queryKey: fundsKeys.list(params),
    queryFn: () => getFunds(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

/**
 * GET /investment/funds/:fundId
 */
export function useFundDetail(
  fundId: string | null | undefined,
  options?: FundDetailOptions
) {
  return useQuery({
    queryKey: fundsKeys.detail(fundId ?? '', options),
    queryFn: () => getFundDetail(fundId!, options),
    enabled: !!fundId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * GET /investment/funds/compare?shareClassIds=...
 */
export function useFundCompare(
  shareClassIds: string[],
  options?: { includeInterpretations?: boolean }
) {
  return useQuery({
    queryKey: fundsKeys.compare(shareClassIds, options),
    queryFn: () => compareShareClasses(shareClassIds, options),
    enabled: shareClassIds.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}
