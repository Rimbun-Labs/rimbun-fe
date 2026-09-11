import React from "react";
import { Navigate } from "react-router-dom";
import { businessWorkspaceBase } from "@/lib/appPaths";

/** @deprecated Prefer /import — kept so old bookmarks still work. */
const BusinessConnectionsPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => (
  <Navigate
    to={`${businessWorkspaceBase(customerIdOverride)}/import`}
    replace
  />
);

export default BusinessConnectionsPage;
