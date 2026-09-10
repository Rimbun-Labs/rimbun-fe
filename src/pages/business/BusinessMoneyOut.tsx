import React, { useState } from "react";
import { BusinessWorkspaceShell } from "@/components/business/BusinessWorkspaceShell";
import { createObligation } from "@/lib/api/businessApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const TYPES = ["payable", "payroll", "tax", "rent", "subscription", "supplier", "insurance", "other"];

const BusinessMoneyOutPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => {
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [obligationType, setObligationType] = useState("payable");
  const [saving, setSaving] = useState(false);

  return (
    <BusinessWorkspaceShell
      title="Money out"
      description="Obligations and recurring commitments. Not payroll or payment execution."
      customerIdOverride={customerIdOverride}
    >
      {(ws) => (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add obligation</CardTitle>
              <CardDescription>Manual entry for upcoming cash outflows.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-5">
              <select
                className="h-10 rounded-md border bg-background px-3 text-sm"
                value={obligationType}
                onChange={(e) => setObligationType(e.target.value)}
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <Input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <Input
                placeholder="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
              />
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              <Button
                disabled={saving || !ws.customerId || !amount}
                onClick={async () => {
                  setSaving(true);
                  try {
                    await createObligation(ws.customerId, {
                      obligationType,
                      amount: Number(amount),
                      currency: currency || "USD",
                      dueDate: dueDate || undefined,
                      source: "manual",
                    });
                    setAmount("");
                    await ws.refetch();
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                Save
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {ws.obligations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No obligations recorded.</p>
            ) : (
              ws.obligations.map((o) => (
                <Card key={o.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {o.obligationType}: {o.amount} {o.currency}
                      </CardTitle>
                      <Badge variant="outline">{o.status}</Badge>
                    </div>
                    <CardDescription>
                      Due {o.dueDate || "—"} · source {o.source}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </BusinessWorkspaceShell>
  );
};

export default BusinessMoneyOutPage;
