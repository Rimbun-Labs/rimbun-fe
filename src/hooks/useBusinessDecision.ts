import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getBusinessDecision } from "@/lib/api/fiDecisionApi";
import type { BusinessDecisionDto } from "@/lib/api/types/fiDecision";

function errorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const message = (err as { response?: { data?: { message?: unknown } } }).response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;
  }
  if (err instanceof Error && err.message) return err.message;
  return "Failed to load the business decision";
}

export const useBusinessDecision = (customerId: string, enabled: boolean) => {
  const { user, userRegistrationComplete } = useAuth();
  const [data, setData] = useState<BusinessDecisionDto | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!enabled || !user || !userRegistrationComplete || !customerId) {
      setLoading(false);
      if (!enabled) {
        setData(null);
        setError(null);
      }
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setData(await getBusinessDecision(customerId));
    } catch (err) {
      setError(new Error(errorMessage(err)));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [customerId, enabled, user, userRegistrationComplete]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
};
