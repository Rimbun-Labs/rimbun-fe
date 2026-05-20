import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getBankCustomers,
  getFiDecisionExplain,
  getFiDecisionInsights,
  getFiQueueBuckets,
} from "@/lib/api/fiDecisionApi";
import type {
  BankCustomerListItem,
  FiDecisionExplainDto,
  FiDecisionInsightsDto,
  FiQueueBookSummary,
  FiQueueBucketSummaryDto,
} from "@/lib/api/types/fiDecision";

const DECISION_CACHE_MS = 60000;

export const useFiDecisionInsights = () => {
  const { user, userRegistrationComplete } = useAuth();
  const [customers, setCustomers] = useState<FiQueueBucketSummaryDto[]>([]);
  const [bookSummary, setBookSummary] = useState<FiQueueBookSummary | undefined>(undefined);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [customersLoading, setCustomersLoading] = useState(true);
  const [customersError, setCustomersError] = useState<Error | null>(null);
  const [data, setData] = useState<FiDecisionInsightsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [explainData, setExplainData] = useState<FiDecisionExplainDto | null>(null);
  const [explainLoading, setExplainLoading] = useState(false);
  const [explainError, setExplainError] = useState<Error | null>(null);

  const lastFetchedAtRef = useRef<number>(0);

  const fetchCustomers = async () => {
    if (!user || !userRegistrationComplete) {
      setCustomersLoading(false);
      return;
    }

    try {
      setCustomersLoading(true);
      setCustomersError(null);
      const { data: list, meta } = await getFiQueueBuckets(50, 0, "ranked", true);
      setCustomers(list);
      setBookSummary(meta?.bookSummary);
      if (list.length > 0) {
        setSelectedCustomerId((prev) => prev || list[0].userId);
      }
    } catch (err: any) {
      const nextErr =
        err instanceof Error ? err : new Error(err?.response?.data?.message || "Failed to fetch customers");
      setCustomersError(nextErr);
      setCustomers([]);
      setBookSummary(undefined);
      setSelectedCustomerId("");
    } finally {
      setCustomersLoading(false);
    }
  };

  const searchWalkInCustomers = useCallback(async (q: string): Promise<BankCustomerListItem[]> => {
    if (!user || !userRegistrationComplete) return [];
    const cleaned = q.replace(/[%_\\]/g, "").trim();
    if (cleaned.length < 2) return [];
    return getBankCustomers(50, 0, cleaned);
  }, [user, userRegistrationComplete]);

  const fetchDecision = async (force = false) => {
    if (!user || !userRegistrationComplete || !selectedCustomerId) {
      setLoading(false);
      return;
    }

    const now = Date.now();
    if (!force && data && now - lastFetchedAtRef.current < DECISION_CACHE_MS) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const next = await getFiDecisionInsights(selectedCustomerId);
      setData(next);
      lastFetchedAtRef.current = Date.now();
    } catch (err: any) {
      const nextErr =
        err instanceof Error ? err : new Error(err?.response?.data?.message || "Failed to load decision insights");
      setError(nextErr);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchExplain = async () => {
    try {
      setExplainLoading(true);
      setExplainError(null);
      if (!selectedCustomerId) return null;
      const next = await getFiDecisionExplain(selectedCustomerId);
      setExplainData(next);
      return next;
    } catch (err: any) {
      const nextErr =
        err instanceof Error ? err : new Error(err?.response?.data?.message || "Failed to load explain payload");
      setExplainError(nextErr);
      return null;
    } finally {
      setExplainLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userRegistrationComplete]);

  useEffect(() => {
    setExplainData(null);
    setExplainError(null);
    fetchDecision(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCustomerId]);

  return {
    customers,
    bookSummary,
    selectedCustomerId,
    setSelectedCustomerId,
    customersLoading,
    customersError,
    data,
    loading,
    error,
    refetchCustomers: fetchCustomers,
    refetch: () => fetchDecision(true),
    explainData,
    explainLoading,
    explainError,
    fetchExplain,
    searchWalkInCustomers,
  };
};
