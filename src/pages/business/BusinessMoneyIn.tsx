import React from "react";
import { Navigate } from "react-router-dom";
import { businessWorkspaceBase } from "@/lib/appPaths";

/** Combined into Money → Coming in. */
const BusinessMoneyInPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => (
  <Navigate
    to={`${businessWorkspaceBase(customerIdOverride)}/money?tab=in`}
    replace
  />
);

export default BusinessMoneyInPage;
