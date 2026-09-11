import React from "react";
import { Navigate } from "react-router-dom";
import { businessWorkspaceBase } from "@/lib/appPaths";

/** Facilities live under Data → Sources. Old /financing bookmarks redirect. */
const BusinessFinancingPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => (
  <Navigate
    to={`${businessWorkspaceBase(customerIdOverride)}/sources`}
    replace
  />
);

export default BusinessFinancingPage;
