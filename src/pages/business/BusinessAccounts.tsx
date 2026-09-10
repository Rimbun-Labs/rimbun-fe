import React from "react";
import { BusinessWorkspaceShell } from "@/components/business/BusinessWorkspaceShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BusinessAccountsPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => (
  <BusinessWorkspaceShell
    title="Accounts & transactions"
    description="Connected financial accounts. Classification follows business cash-flow taxonomy."
    customerIdOverride={customerIdOverride}
  >
    {(ws) => (
      <div className="space-y-4">
        {ws.accounts.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No accounts yet</CardTitle>
              <CardDescription>
                Ingest a statement via partner API or wait for sync. Empty accounts can still host
                manual working-capital records.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          ws.accounts.map((a) => (
            <Card key={a.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg">
                    {a.displayName || a.institutionName || a.externalAccountId}
                  </CardTitle>
                  <Badge variant="outline">{a.status}</Badge>
                </div>
                <CardDescription>
                  {a.accountType || "Account"} · {a.currency}
                  {a.lastSyncedAt ? ` · synced ${new Date(a.lastSyncedAt).toLocaleString()}` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                Balance: {a.currentBalance ?? "—"} {a.currency}
                {a.availableBalance != null ? ` · available ${a.availableBalance}` : ""}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    )}
  </BusinessWorkspaceShell>
);

export default BusinessAccountsPage;
