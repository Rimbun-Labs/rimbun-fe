import React from "react";
import { BusinessWorkspaceShell } from "@/components/business/BusinessWorkspaceShell";
import { BusinessImportWizard } from "@/components/business/BusinessImportWizard";

const BusinessImportPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => (
  <BusinessWorkspaceShell
    title="Import data"
    description="Bring bank, sales, invoice, and bill files into this business."
    customerIdOverride={customerIdOverride}
  >
    {(ws) => (
      <div>
        {ws.customerId ? (
          <BusinessImportWizard
            customerId={ws.customerId}
            onComplete={() => void ws.refetch()}
          />
        ) : (
          <p className="text-sm text-muted-foreground">Loading workspace…</p>
        )}
      </div>
    )}
  </BusinessWorkspaceShell>
);

export default BusinessImportPage;
