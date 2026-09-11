import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getBusinessProfile,
  getDesignatedBusinessSubject,
  listBusinessAccounts,
  listFacilities,
  listObligations,
  listPlanEvents,
  listReceivables,
  type BusinessObligation,
  type BusinessPlanEvent,
  type BusinessProfile,
  type BusinessReceivable,
  type FinancingFacility,
  type FinancialAccount,
} from "@/lib/api/businessApi";

export function useBusinessWorkspace(customerIdOverride?: string) {
  const { user, userRegistrationComplete, operator } = useAuth();
  const [customerId, setCustomerId] = useState(customerIdOverride ?? "");
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [receivables, setReceivables] = useState<BusinessReceivable[]>([]);
  const [obligations, setObligations] = useState<BusinessObligation[]>([]);
  const [facilities, setFacilities] = useState<FinancingFacility[]>([]);
  const [planEvents, setPlanEvents] = useState<BusinessPlanEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const resolveCustomerId = useCallback(async () => {
    if (customerIdOverride) return customerIdOverride;
    if (operator?.tenantType === "business") {
      const subject = await getDesignatedBusinessSubject();
      return subject.customerId;
    }
    return "";
  }, [customerIdOverride, operator?.tenantType]);

  const refetch = useCallback(async () => {
    if (!user || !userRegistrationComplete) return;
    try {
      setLoading(true);
      setError(null);
      const id = await resolveCustomerId();
      if (!id) {
        setCustomerId("");
        return;
      }
      setCustomerId(id);
      const [
        nextProfile,
        nextAccounts,
        nextReceivables,
        nextObligations,
        nextFacilities,
        nextPlans,
      ] = await Promise.all([
        getBusinessProfile(id),
        listBusinessAccounts(id),
        listReceivables(id),
        listObligations(id),
        listFacilities(id),
        listPlanEvents(id),
      ]);
      setProfile(nextProfile);
      setAccounts(nextAccounts);
      setReceivables(nextReceivables);
      setObligations(nextObligations);
      setFacilities(nextFacilities);
      setPlanEvents(nextPlans);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to load business workspace"),
      );
    } finally {
      setLoading(false);
    }
  }, [user, userRegistrationComplete, resolveCustomerId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return {
    customerId,
    profile,
    accounts,
    receivables,
    obligations,
    facilities,
    planEvents,
    loading,
    error,
    refetch,
  };
}
