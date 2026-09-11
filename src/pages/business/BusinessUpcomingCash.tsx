import React from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { businessWorkspaceBase } from "@/lib/appPaths";

/** Combined into Money → Coming in / Going out. */
const BusinessUpcomingCashPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => {
  const [params] = useSearchParams();
  const tab = params.get("tab") === "out" ? "out" : "in";
  return (
    <Navigate
      to={`${businessWorkspaceBase(customerIdOverride)}/money?tab=${tab}`}
      replace
    />
  );
};

export default BusinessUpcomingCashPage;
