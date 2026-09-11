import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getCustomerInsights } from "@/lib/api/bankInsightsApi";
import {
  getBankCustomers,
  getBusinessPortfolioQueue,
  getFiQueueBuckets,
} from "@/lib/api/fiDecisionApi";
import { appCustomer, businessWorkspaceBase } from "@/lib/appPaths";
import type { BankCustomerInsights } from "@/lib/api/types/bankInsights";
import type {
  BusinessPortfolioQueueItem,
  FiQueueBookSummary,
  FiQueueBucket,
  FiQueueBucketSummaryDto,
} from "@/lib/api/types/fiDecision";

export type PortfolioHomeMode = "all" | "individuals" | "businesses";

export type AttentionItem = {
  id: string;
  tone: "business" | "individual";
  title: string;
  detail: string;
  href: string;
};

export type BankPortfolioHomeData = {
  individualCount: number;
  businessCount: number;
  totalCount: number;
  insights: BankCustomerInsights | null;
  businessQueue: BusinessPortfolioQueueItem[];
  individualQueue: FiQueueBucketSummaryDto[];
  individualBookSummary: FiQueueBookSummary | null;
  attention: AttentionItem[];
  businessesNeedingAttention: number;
  projectedShortfalls: number;
  overdueReceivableWarnings: number;
  individualsNeedingAttention: number;
};

const INDIVIDUAL_ATTENTION_BUCKETS: FiQueueBucket[] = [
  "ACT_NOW",
  "NEEDS_DATA",
  "MONITOR",
];

function individualAttentionDetail(bucket: FiQueueBucket, reason?: string): string {
  if (reason?.trim()) return reason.trim();
  switch (bucket) {
    case "ACT_NOW":
      return "Ready for RM action";
    case "NEEDS_DATA":
      return "Incomplete assessment or thin data";
    case "MONITOR":
      return "Worth monitoring";
    default:
      return `Queue: ${bucket}`;
  }
}

function buildAttention(params: {
  businessQueue: BusinessPortfolioQueueItem[];
  individualQueue: FiQueueBucketSummaryDto[];
}): AttentionItem[] {
  const items: AttentionItem[] = [];

  for (const b of params.businessQueue) {
    if (b.openWarningCount <= 0 && b.openActionCount <= 0) continue;
    items.push({
      id: `biz-${b.customerId}`,
      tone: "business",
      title: b.displayName || b.externalCustomerId,
      detail:
        b.topWarningTitle ??
        `${b.openWarningCount} open warning${b.openWarningCount === 1 ? "" : "s"}, ${b.openActionCount} action${b.openActionCount === 1 ? "" : "s"}`,
      href: businessWorkspaceBase(b.customerId),
    });
  }

  for (const row of params.individualQueue) {
    if (!INDIVIDUAL_ATTENTION_BUCKETS.includes(row.queueBucket)) continue;
    const id = String(row.customerId ?? row.userId ?? "");
    if (!id) continue;
    items.push({
      id: `ind-${id}`,
      tone: "individual",
      title: row.displayName || row.externalCustomerId || id,
      detail: individualAttentionDetail(row.queueBucket, row.queueReason),
      href: appCustomer(id),
    });
  }

  return items.slice(0, 12);
}

export function useBankPortfolioHome(mode: PortfolioHomeMode) {
  const { user, userRegistrationComplete } = useAuth();
  const [data, setData] = useState<BankPortfolioHomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAll = useCallback(async () => {
    if (!user || !userRegistrationComplete) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const [individuals, businesses, businessQueue, fiQueueResult, insights] =
        await Promise.all([
          getBankCustomers(100, 0, undefined, "individual"),
          getBankCustomers(100, 0, undefined, "business"),
          getBusinessPortfolioQueue(50, 0),
          getFiQueueBuckets(30, 0, "ranked", true).catch(() =>
            getFiQueueBuckets(30, 0, "default", true).catch(() => ({
              data: [] as FiQueueBucketSummaryDto[],
              meta: undefined,
            }))
          ),
          getCustomerInsights().catch(() => null),
        ]);

      const individualQueue = fiQueueResult.data ?? [];
      const individualBookSummary = fiQueueResult.meta?.bookSummary ?? null;
      const attention = buildAttention({ businessQueue, individualQueue });

      const businessesNeedingAttention = businessQueue.filter(
        (b) => b.openWarningCount > 0 || b.openActionCount > 0
      ).length;
      const projectedShortfalls = businessQueue.filter((b) =>
        (b.topWarningTitle ?? "").toLowerCase().includes("shortfall")
      ).length;
      const overdueReceivableWarnings = businessQueue.filter((b) => {
        const title = (b.topWarningTitle ?? "").toLowerCase();
        return title.includes("overdue") || title.includes("receivable");
      }).length;
      const individualsNeedingAttention = attention.filter(
        (a) => a.tone === "individual"
      ).length;

      setData({
        individualCount: individuals.length,
        businessCount: businesses.length,
        totalCount: individuals.length + businesses.length,
        insights,
        businessQueue,
        individualQueue,
        individualBookSummary,
        attention,
        businessesNeedingAttention,
        projectedShortfalls,
        overdueReceivableWarnings,
        individualsNeedingAttention,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to load portfolio home")
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [user, userRegistrationComplete]);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const filteredAttention = useMemo(() => {
    if (!data) return [];
    if (mode === "businesses") {
      return data.attention.filter((a) => a.tone === "business");
    }
    if (mode === "individuals") {
      return data.attention.filter((a) => a.tone === "individual");
    }
    return data.attention;
  }, [data, mode]);

  return {
    data,
    filteredAttention,
    loading,
    error,
    refetch: fetchAll,
  };
}
