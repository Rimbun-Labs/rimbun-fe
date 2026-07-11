import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelectedCustomer } from "@/contexts/SelectedCustomerContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type Props = {
  className?: string;
};

export const CustomerPicker: React.FC<Props> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    customers,
    selectedCustomerId,
    setSelectedCustomerId,
    loading,
    error,
  } = useSelectedCustomer();

  const onSelect = (id: string) => {
    setSelectedCustomerId(id);
    const match = location.pathname.match(
      /^\/dashboard\/customers\/[^/]+(\/.*)?$/
    );
    if (match) {
      navigate(`/dashboard/customers/${id}${match[1] ?? ""}`);
    }
  };

  if (loading) {
    return (
      <div className={className}>
        <p className="text-sm text-muted-foreground">Loading customers…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <p className="text-sm text-destructive">Could not load customers: {error.message}</p>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className={className}>
        <p className="text-sm text-muted-foreground">
          No customers available yet.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <Label htmlFor="tenant-customer-picker" className="text-xs text-muted-foreground">
        Customer
      </Label>
      <Select value={selectedCustomerId} onValueChange={onSelect}>
        <SelectTrigger id="tenant-customer-picker" className="mt-1 w-full max-w-md">
          <SelectValue placeholder="Select a customer" />
        </SelectTrigger>
        <SelectContent>
          {customers.map((c) => (
            <SelectItem key={c.customerId} value={c.customerId}>
              {c.displayName || c.externalCustomerId}
              {c.externalCustomerId ? ` (${c.externalCustomerId})` : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
