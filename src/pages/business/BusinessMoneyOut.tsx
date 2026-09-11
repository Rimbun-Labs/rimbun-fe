import React from "react";
import { Navigate } from "react-router-dom";
import { businessWorkspaceBase } from "@/lib/appPaths";

/** Combined into Money → Going out. */
const BusinessMoneyOutPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => (
  <Navigate
    to={`${businessWorkspaceBase(customerIdOverride)}/money?tab=out`}
    replace
  />
);

export default BusinessMoneyOutPage;
