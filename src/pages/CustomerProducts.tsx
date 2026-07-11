import React from "react";
import { useSyncCustomerFromRoute } from "@/hooks/useSyncCustomerFromRoute";
import BankingProducts from "@/pages/BankingProducts";

/** Customer workspace products tab — same banking UI, URL-bound customer. */
const CustomerProducts: React.FC = () => {
  useSyncCustomerFromRoute();
  return <BankingProducts workspaceMode />;
};

export default CustomerProducts;
