import React from "react";
import { useSyncCustomerFromRoute } from "@/hooks/useSyncCustomerFromRoute";
import BusinessOverview from "@/pages/business/BusinessOverview";
import BusinessAccounts from "@/pages/business/BusinessAccounts";
import BusinessMoneyIn from "@/pages/business/BusinessMoneyIn";
import BusinessMoneyOut from "@/pages/business/BusinessMoneyOut";
import BusinessFinancing from "@/pages/business/BusinessFinancing";
import BusinessPlans from "@/pages/business/BusinessPlans";

function withRouteCustomer(
  Page: React.ComponentType<{ customerIdOverride?: string }>
): React.FC {
  return function RoutedBusinessPage() {
    const customerId = useSyncCustomerFromRoute();
    return <Page customerIdOverride={customerId || undefined} />;
  };
}

export const CustomerBusinessOverview = withRouteCustomer(BusinessOverview);
export const CustomerBusinessAccounts = withRouteCustomer(BusinessAccounts);
export const CustomerBusinessMoneyIn = withRouteCustomer(BusinessMoneyIn);
export const CustomerBusinessMoneyOut = withRouteCustomer(BusinessMoneyOut);
export const CustomerBusinessFinancing = withRouteCustomer(BusinessFinancing);
export const CustomerBusinessPlans = withRouteCustomer(BusinessPlans);
