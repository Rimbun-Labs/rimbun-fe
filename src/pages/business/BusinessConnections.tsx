import React from "react";
import { BusinessWorkspaceShell } from "@/components/business/BusinessWorkspaceShell";
import { BusinessImportWizard } from "@/components/business/BusinessImportWizard";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BusinessConnectionsPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => (
  <BusinessWorkspaceShell
    title="Data"
    description="Import bank, POS, invoices, and bills. Manual entry remains available without an integration."
    customerIdOverride={customerIdOverride}
  >
    {(ws) => (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Account freshness</CardTitle>
              <CardDescription>
                {ws.accounts.length === 0
                  ? "No accounts yet. Import a bank CSV or wait for a live connection."
                  : `${ws.accounts.length} account(s). Last sync times appear after each import.`}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Working-capital coverage</CardTitle>
              <CardDescription>
                Receivables {ws.receivables.length} · obligations{" "}
                {ws.obligations.length} · facilities {ws.facilities.length} ·
                plan events {ws.planEvents.length}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {ws.customerId ? (
          <BusinessImportWizard
            customerId={ws.customerId}
            onComplete={() => void ws.refetch()}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Resolve the business subject to start importing.
          </p>
        )}
      </div>
    )}
  </BusinessWorkspaceShell>
);

export default BusinessConnectionsPage;
