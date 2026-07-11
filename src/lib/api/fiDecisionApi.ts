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

/** Backend uses customerId; older FE types used userId — normalize both. */
function withCustomerIdAlias<T extends Record<string, unknown>>(
  row: T
): T & { userId: string; customerId: string } {
  const customerId = String(row.customerId ?? row.userId ?? "");
  return { ...row, customerId, userId: customerId };
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
  const response = await apiClient.get(`/dashboard/customers?${params.toString()}`);
  const responseData = response.data;
  let rows: Record<string, unknown>[] = [];
  if (responseData?.data && Array.isArray(responseData.data)) {
    rows = (responseData as BankCustomersResponseDto).data as unknown as Record<string, unknown>[];
  } else if (Array.isArray(responseData)) {
    rows = responseData as Record<string, unknown>[];
  }
  return rows.map((r) => withCustomerIdAlias(r)) as unknown as BankCustomerListItem[];
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
  const response = await apiClient.get(
    `/dashboard/customers/fi-queue-buckets?${params.toString()}`
  );
  const responseData = response.data;
  const meta = responseData?.meta as FiQueueBucketsResponseMeta | undefined;
  let rows: Record<string, unknown>[] = [];
  if (responseData?.data && Array.isArray(responseData.data)) {
    rows = (responseData as FiQueueBucketSummaryResponseDto)
      .data as unknown as Record<string, unknown>[];
  } else if (Array.isArray(responseData)) {
    rows = responseData as Record<string, unknown>[];
  }
  return {
    data: rows.map((r) => withCustomerIdAlias(r)) as unknown as FiQueueBucketSummaryDto[],
    meta,
  };
};

export const getFiDecisionInsights = async (
  customerId: string
): Promise<FiDecisionInsightsDto> => {
  const response = await apiClient.get(`/dashboard/customers/${customerId}/fi-decision`);
  const responseData = response.data;
  if (responseData?.data) return responseData.data as FiDecisionInsightsDto;
  return responseData as FiDecisionInsightsDto;
};

export const getFiDecisionExplain = async (
  customerId: string
): Promise<FiDecisionExplainDto> => {
  const response = await apiClient.get(
    `/dashboard/customers/${customerId}/fi-decision/explain`
  );
  const responseData = response.data;
  if (responseData?.data) return responseData.data as FiDecisionExplainDto;
  return responseData as FiDecisionExplainDto;
};
