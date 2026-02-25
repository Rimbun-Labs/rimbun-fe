/**
 * Funds API – /api/v1/investment/funds
 * All endpoints are public (no auth).
 * Response wrapper: { data: T; meta: { timestamp, version } }
 */

import { apiClient } from './client';
import type {
  GlossaryResponse,
  FundListResponse,
  FundDetailResponse,
  FundCompareResponse,
  FundListParams,
} from './types/funds';

const BASE = '/investment/funds';

/** Axios response.data from backend has shape { data: T; meta?: { timestamp, version } } */
interface ApiWrapper<T> {
  data: T;
  meta?: { timestamp: number; version: string };
}

/**
 * GET /investment/funds/glossary
 */
export async function getGlossary(): Promise<GlossaryResponse> {
  const response = await apiClient.get<ApiWrapper<GlossaryResponse>>(`${BASE}/glossary`);
  return response.data.data;
}

/**
 * GET /investment/funds
 */
export async function getFunds(params?: FundListParams): Promise<FundListResponse> {
  const query: Record<string, string> = {};
  if (params?.source) query.source = params.source;
  if (params?.assetClass) query.assetClass = params.assetClass;
  if (params?.geography) query.geography = params.geography;
  if (params?.shariahCompliant !== undefined)
    query.shariahCompliant = params.shariahCompliant ? 'true' : 'false';
  if (params?.search) query.search = params.search;
  if (params?.limit !== undefined) query.limit = String(params.limit);
  if (params?.offset !== undefined) query.offset = String(params.offset);
  if (params?.includeInterpretations) query.includeInterpretations = 'true';
  if (params?.includeFit) query.includeFit = 'true';

  const response = await apiClient.get<ApiWrapper<FundListResponse>>(BASE, { params: query });
  return response.data.data;
}

/**
 * GET /investment/funds/:fundId
 */
export async function getFundDetail(
  fundId: string,
  options?: { includeInterpretations?: boolean; includeFit?: boolean }
): Promise<FundDetailResponse> {
  const params: Record<string, string> = {};
  if (options?.includeInterpretations) params.includeInterpretations = 'true';
  if (options?.includeFit) params.includeFit = 'true';

  const response = await apiClient.get<ApiWrapper<FundDetailResponse>>(`${BASE}/${encodeURIComponent(fundId)}`, {
    params: Object.keys(params).length ? params : undefined,
  });
  return response.data.data;
}

/**
 * GET /investment/funds/compare?shareClassIds=id1,id2,...
 */
export async function compareShareClasses(
  shareClassIds: string[],
  options?: { includeInterpretations?: boolean }
): Promise<FundCompareResponse> {
  const params: Record<string, string> = {
    shareClassIds: shareClassIds.join(','),
  };
  if (options?.includeInterpretations) params.includeInterpretations = 'true';

  const response = await apiClient.get<ApiWrapper<FundCompareResponse>>(`${BASE}/compare`, { params });
  return response.data.data;
}

export const fundsApi = {
  getGlossary,
  getFunds,
  getFundDetail,
  compareShareClasses,
};
