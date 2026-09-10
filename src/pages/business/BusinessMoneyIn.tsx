import React, { useState } from "react";
import { BusinessWorkspaceShell } from "@/components/business/BusinessWorkspaceShell";
import { createReceivable } from "@/lib/api/businessApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const BusinessMoneyInPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => {
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [saving, setSaving] = useState(false);

  return (
    <BusinessWorkspaceShell
      title="Money in"
      description="Receivables and expected receipts. This does not generate or send invoices."
      customerIdOverride={customerIdOverride}
    >
      {(ws) => (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add receivable</CardTitle>
              <CardDescription>Manual entry for first value without an integration.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-4">
              <Input
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
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
                    const n = Number(amount);
                    await createReceivable(ws.customerId, {
                      originalAmount: n,
                      outstandingAmount: n,
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
            {ws.receivables.length === 0 ? (
              <p className="text-sm text-muted-foreground">No receivables recorded.</p>
            ) : (
              ws.receivables.map((r) => (
                <Card key={r.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {r.outstandingAmount} {r.currency}
                      </CardTitle>
                      <Badge variant="outline">{r.status}</Badge>
                    </div>
                    <CardDescription>
                      Due {r.dueDate || "—"} · source {r.source}
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

export default BusinessMoneyInPage;
