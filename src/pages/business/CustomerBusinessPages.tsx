import React from "react";
import { useSyncCustomerFromRoute } from "@/hooks/useSyncCustomerFromRoute";
import BusinessOverview from "@/pages/business/BusinessOverview";
import BusinessAccounts from "@/pages/business/BusinessAccounts";
import BusinessMoney from "@/pages/business/BusinessMoney";
import BusinessUpcomingCash from "@/pages/business/BusinessUpcomingCash";
import BusinessMoneyIn from "@/pages/business/BusinessMoneyIn";
import BusinessMoneyOut from "@/pages/business/BusinessMoneyOut";
import BusinessFinancing from "@/pages/business/BusinessFinancing";
import BusinessPlans from "@/pages/business/BusinessPlans";
import BusinessImport from "@/pages/business/BusinessImport";
import BusinessSources from "@/pages/business/BusinessSources";
import BusinessSourceDetail from "@/pages/business/BusinessSourceDetail";
import BusinessConnections from "@/pages/business/BusinessConnections";
import BusinessReview from "@/pages/business/BusinessReview";
import BusinessPerformance from "@/pages/business/BusinessPerformance";
import BusinessChat from "@/pages/business/BusinessChat";

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
export const CustomerBusinessMoney = withRouteCustomer(BusinessMoney);
export const CustomerBusinessUpcomingCash = withRouteCustomer(
  BusinessUpcomingCash,
);
export const CustomerBusinessMoneyIn = withRouteCustomer(BusinessMoneyIn);
export const CustomerBusinessMoneyOut = withRouteCustomer(BusinessMoneyOut);
export const CustomerBusinessFinancing = withRouteCustomer(BusinessFinancing);
export const CustomerBusinessPlans = withRouteCustomer(BusinessPlans);
export const CustomerBusinessImport = withRouteCustomer(BusinessImport);
export const CustomerBusinessSources = withRouteCustomer(BusinessSources);
export const CustomerBusinessSourceDetail = withRouteCustomer(
  BusinessSourceDetail,
);
export const CustomerBusinessConnections = withRouteCustomer(BusinessConnections);
export const CustomerBusinessReview = withRouteCustomer(BusinessReview);
export const CustomerBusinessPerformance = withRouteCustomer(
  BusinessPerformance,
);
export const CustomerBusinessChat = withRouteCustomer(BusinessChat);
