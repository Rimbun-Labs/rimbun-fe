import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getBankCustomers } from "@/lib/api/fiDecisionApi";

export type TenantCustomerOption = {
  customerId: string;
  externalCustomerId: string;
  displayName: string;
};

type SelectedCustomerContextValue = {
  customers: TenantCustomerOption[];
  selectedCustomerId: string;
  selectedCustomer: TenantCustomerOption | null;
  setSelectedCustomerId: (id: string) => void;
  loading: boolean;
  error: Error | null;
  refetchCustomers: () => Promise<void>;
};

const SelectedCustomerContext = createContext<SelectedCustomerContextValue | undefined>(
  undefined
);

function normalizeCustomerRow(row: Record<string, unknown>): TenantCustomerOption | null {
  const customerId = String(row.customerId ?? row.userId ?? "").trim();
  if (!customerId) return null;
  return {
    customerId,
    externalCustomerId: String(row.externalCustomerId ?? row.email ?? ""),
    displayName: String(row.displayName ?? row.externalCustomerId ?? customerId),
  };
}

export const SelectedCustomerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, userRegistrationComplete } = useAuth();
  const [customers, setCustomers] = useState<TenantCustomerOption[]>([]);
  const [selectedCustomerId, setSelectedCustomerIdState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetchCustomers = useCallback(async () => {
    if (!user || !userRegistrationComplete) {
      setCustomers([]);
      setSelectedCustomerIdState("");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const rows = await getBankCustomers(50, 0);
      const normalized = (rows as unknown as Record<string, unknown>[])
        .map(normalizeCustomerRow)
        .filter(Boolean) as TenantCustomerOption[];
      setCustomers(normalized);
      setSelectedCustomerIdState((prev) => {
        if (prev && normalized.some((c) => c.customerId === prev)) return prev;
        return normalized[0]?.customerId ?? "";
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load customers"));
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [user, userRegistrationComplete]);

  useEffect(() => {
    void refetchCustomers();
  }, [refetchCustomers]);

  const setSelectedCustomerId = useCallback((id: string) => {
    setSelectedCustomerIdState(id);
  }, []);

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.customerId === selectedCustomerId) ?? null,
    [customers, selectedCustomerId]
  );

  const value = useMemo(
    () => ({
      customers,
      selectedCustomerId,
      selectedCustomer,
      setSelectedCustomerId,
      loading,
      error,
      refetchCustomers,
    }),
    [
      customers,
      selectedCustomerId,
      selectedCustomer,
      setSelectedCustomerId,
      loading,
      error,
      refetchCustomers,
    ]
  );

  return (
    <SelectedCustomerContext.Provider value={value}>
      {children}
    </SelectedCustomerContext.Provider>
  );
};

export const useSelectedCustomer = (): SelectedCustomerContextValue => {
  const ctx = useContext(SelectedCustomerContext);
  if (!ctx) {
    throw new Error("useSelectedCustomer must be used within SelectedCustomerProvider");
  }
  return ctx;
};
