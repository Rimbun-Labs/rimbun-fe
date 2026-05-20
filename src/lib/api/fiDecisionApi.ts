import { apiClient } from "./client";
import type {
  BankCustomerListItem,
  BankCustomersResponseDto,
  FiDecisionExplainDto,
  FiDecisionInsightsDto,
  FiQueueBucketSummaryDto,
  FiQueueBucketSummaryResponseDto,
  FiQueueBucketsResponseMeta,
} from "./types/fiDecision";

function sanitizeCustomerSearchQuery(q: string): string {
  return q.replace(/[%_\\]/g, "").trim();
}

export const getBankCustomers = async (
  limit = 50,
  offset = 0,
  q?: string
): Promise<BankCustomerListItem[]> => {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  const trimmed = q != null ? sanitizeCustomerSearchQuery(q) : "";
  if (trimmed.length >= 2) {
    params.set("q", trimmed);
  }
  const response = await apiClient.get(`/bank/customers?${params.toString()}`);
  const responseData = response.data;
  if (responseData?.data && Array.isArray(responseData.data)) {
    return (responseData as BankCustomersResponseDto).data;
  }
  if (Array.isArray(responseData)) return responseData as BankCustomerListItem[];
  return [];
};

export type FiQueueBucketsResult = {
  data: FiQueueBucketSummaryDto[];
  meta?: FiQueueBucketsResponseMeta;
};

export const getFiQueueBuckets = async (
  limit = 50,
  offset = 0,
  mode: "ranked" | "default" = "ranked",
  includeBookSummary = false
): Promise<FiQueueBucketsResult> => {
  const params = new URLSearchParams({
    mode,
    limit: String(limit),
    offset: String(offset),
  });
  if (includeBookSummary) {
    params.set("includeBookSummary", "true");
  }
  const response = await apiClient.get(`/bank/customers/fi-queue-buckets?${params.toString()}`);
  const responseData = response.data;
  const meta = responseData?.meta as FiQueueBucketsResponseMeta | undefined;
  if (responseData?.data && Array.isArray(responseData.data)) {
    return { data: (responseData as FiQueueBucketSummaryResponseDto).data, meta };
  }
  if (Array.isArray(responseData)) return { data: responseData as FiQueueBucketSummaryDto[], meta };
  return { data: [], meta };
};

export const getFiDecisionInsights = async (userId: string): Promise<FiDecisionInsightsDto> => {
  const response = await apiClient.get(`/bank/customers/${userId}/fi-decision`);
  const responseData = response.data;
  if (responseData?.data) return responseData.data as FiDecisionInsightsDto;
  return responseData as FiDecisionInsightsDto;
};

export const getFiDecisionExplain = async (userId: string): Promise<FiDecisionExplainDto> => {
  const response = await apiClient.get(`/bank/customers/${userId}/fi-decision/explain`);
  const responseData = response.data;
  if (responseData?.data) return responseData.data as FiDecisionExplainDto;
  return responseData as FiDecisionExplainDto;
};

