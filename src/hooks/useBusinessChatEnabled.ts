import { useEffect, useState } from "react";
import { getBusinessChatStatus } from "@/lib/api/businessChatApi";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Ask Rimbun visibility from backend BUSINESS_CHAT_ENABLED.
 * Defaults to hidden until the status call succeeds.
 */
export function useBusinessChatEnabled(): {
  enabled: boolean;
  loading: boolean;
} {
  const { operator } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(Boolean(operator));

  useEffect(() => {
    if (!operator) {
      setEnabled(false);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    void getBusinessChatStatus()
      .then((status) => {
        if (!cancelled) setEnabled(Boolean(status.enabled));
      })
      .catch(() => {
        if (!cancelled) setEnabled(false);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [operator]);

  return { enabled, loading };
}
