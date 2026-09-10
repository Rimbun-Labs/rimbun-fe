import React from "react";
import { BusinessWorkspaceShell } from "@/components/business/BusinessWorkspaceShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BusinessConnectionsPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => (
  <BusinessWorkspaceShell
    title="Data connections"
    description="Import status and freshness. Manual entry and CSV remain available without an integration."
    customerIdOverride={customerIdOverride}
  >
    {(ws) => (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Account freshness</CardTitle>
            <CardDescription>
              {ws.accounts.length === 0
                ? "No linked accounts yet. Partner statement ingest or bank connection will appear here."
                : `${ws.accounts.length} account(s) available. Last sync times shown on Accounts.`}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Working-capital coverage</CardTitle>
            <CardDescription>
              Receivables {ws.receivables.length} · obligations {ws.obligations.length} · facilities{" "}
              {ws.facilities.length} · plan events {ws.planEvents.length}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>CSV / manual</CardTitle>
            <CardDescription>
              Use Money in, Money out, Financing, and Plans to enter records without waiting on an
              integration.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )}
  </BusinessWorkspaceShell>
);

export default BusinessConnectionsPage;
