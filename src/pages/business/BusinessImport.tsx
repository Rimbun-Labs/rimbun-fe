import React from "react";
import { Link } from "react-router-dom";
import { BusinessWorkspaceShell } from "@/components/business/BusinessWorkspaceShell";
import { BusinessImportWizard } from "@/components/business/BusinessImportWizard";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { businessWorkspaceBase } from "@/lib/appPaths";

const BusinessImportPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => (
  <BusinessWorkspaceShell
    title="Import data"
    description="Bring bank, sales, invoice, and bill files into this business."
    customerIdOverride={customerIdOverride}
  >
    {(ws) => {
      const connectionsPath = `${businessWorkspaceBase(customerIdOverride)}/connections`;
      return (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Coverage</CardTitle>
                <CardDescription>
                  {ws.accounts.length === 0
                    ? "No accounts yet — start with balances or a bank export."
                    : `${ws.accounts.length} account(s) · receivables ${ws.receivables.length} · obligations ${ws.obligations.length}`}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Live connections</CardTitle>
                <CardDescription>
                  Prefer a linked account?{" "}
                  <Link
                    to={connectionsPath}
                    className="underline underline-offset-2"
                  >
                    Open Connections
                  </Link>
                  .
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
      );
    }}
  </BusinessWorkspaceShell>
);

export default BusinessImportPage;
