import React from "react";
import { Navigate } from "react-router-dom";
import { businessWorkspaceBase } from "@/lib/appPaths";

/** Combined into Money → Position. */
const BusinessAccountsPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => (
  <Navigate to={`${businessWorkspaceBase(customerIdOverride)}/money`} replace />
);

export default BusinessAccountsPage;
