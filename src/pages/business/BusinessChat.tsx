import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { SoftWait } from "@/components/ui/SoftWait";
import { APP_ROOT, businessWorkspaceBase } from "@/lib/appPaths";
import { useAskRimbun } from "@/contexts/AskRimbunContext";
import { useBusinessChatEnabled } from "@/hooks/useBusinessChatEnabled";

/**
 * Deep link: open the Ask panel and return to the workspace home.
 * Chat lives in the right-side panel, not a dedicated page.
 */
const BusinessChatPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => {
  const { enabled, loading } = useBusinessChatEnabled();
  const { openAsk } = useAskRimbun();
  const home = businessWorkspaceBase(customerIdOverride);

  useEffect(() => {
    if (enabled) openAsk();
  }, [enabled, openAsk]);

  if (loading) return <SoftWait preset="page" />;
  if (!enabled) return <Navigate to={customerIdOverride ? home : APP_ROOT} replace />;
  return <Navigate to={home} replace />;
};

export default BusinessChatPage;
