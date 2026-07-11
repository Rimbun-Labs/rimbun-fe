import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelectedCustomer } from "@/contexts/SelectedCustomerContext";

/** Keep SelectedCustomerContext aligned with `/dashboard/customers/:customerId` routes. */
export function useSyncCustomerFromRoute(): string {
  const { customerId = "" } = useParams<{ customerId: string }>();
  const { setSelectedCustomerId, selectedCustomerId } = useSelectedCustomer();

  useEffect(() => {
    if (customerId && customerId !== selectedCustomerId) {
      setSelectedCustomerId(customerId);
    }
  }, [customerId, selectedCustomerId, setSelectedCustomerId]);

  return customerId;
}
