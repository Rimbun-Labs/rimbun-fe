import React, { useState } from "react";
import { BusinessWorkspaceShell } from "@/components/business/BusinessWorkspaceShell";
import { createFacility } from "@/lib/api/businessApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const BusinessFinancingPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => {
  const [facilityType, setFacilityType] = useState("working_capital");
  const [outstanding, setOutstanding] = useState("");
  const [available, setAvailable] = useState("");
  const [currency, setCurrency] = useState("");
  const [lenderName, setLenderName] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <BusinessWorkspaceShell
      title="Financing"
      description="Known credit lines and loan balances. Product recommendations stay separate."
      customerIdOverride={customerIdOverride}
    >
      {(ws) => {
        const currencyValue = currency || ws.profile?.baseCurrency || "IDR";
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add facility</CardTitle>
                <CardDescription>
                  What facility do you already have, how much is drawn, and how
                  much is still available?
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-5">
                <Input
                  placeholder="Type"
                  value={facilityType}
                  onChange={(e) => setFacilityType(e.target.value)}
                />
                <Input
                  placeholder="Lender"
                  value={lenderName}
                  onChange={(e) => setLenderName(e.target.value)}
                />
                <Input
                  placeholder="Outstanding"
                  value={outstanding}
                  onChange={(e) => setOutstanding(e.target.value)}
                />
                <Input
                  placeholder="Available"
                  value={available}
                  onChange={(e) => setAvailable(e.target.value)}
                />
                <Button
                  disabled={saving || !ws.customerId}
                  onClick={async () => {
                    setSaving(true);
                    try {
                      await createFacility(ws.customerId, {
                        facilityType,
                        currency: currencyValue,
                        outstandingPrincipal: outstanding
                          ? Number(outstanding)
                          : undefined,
                        availableAmount: available
                          ? Number(available)
                          : undefined,
                        lenderName: lenderName || undefined,
                        source: "manual",
                      });
                      setOutstanding("");
                      setAvailable("");
                      await ws.refetch();
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  Save facility
                </Button>
                <Input
                  className="md:col-span-5"
                  placeholder="Currency"
                  value={currencyValue}
                  onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                />
              </CardContent>
            </Card>

            <div className="space-y-3">
              {ws.facilities.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No facilities recorded.
                </p>
              ) : (
                ws.facilities.map((f) => (
                  <Card key={f.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {f.facilityType}
                          {f.lenderName ? ` · ${f.lenderName}` : ""}
                        </CardTitle>
                        <Badge variant="outline">{f.status}</Badge>
                      </div>
                      <CardDescription>
                        Outstanding {f.outstandingPrincipal ?? "—"} · available{" "}
                        {f.availableAmount ?? "—"} {f.currency} · source{" "}
                        {f.source}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </div>
        );
      }}
    </BusinessWorkspaceShell>
  );
};

export default BusinessFinancingPage;
