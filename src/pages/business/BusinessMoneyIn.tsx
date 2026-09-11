import React, { useState } from "react";
import { BusinessWorkspaceShell } from "@/components/business/BusinessWorkspaceShell";
import { createReceivable } from "@/lib/api/businessApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const BusinessMoneyInPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => {
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  return (
    <BusinessWorkspaceShell
      title="Money in"
      description="Expected receipts that should hit cash. Prefer importing invoices when you have a CSV; use this form for one-off corrections."
      customerIdOverride={customerIdOverride}
    >
      {(ws) => {
        const currencyValue = currency || ws.profile?.baseCurrency || "IDR";
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Record expected money in</CardTitle>
                <CardDescription>
                  Ask: who owes us, how much is still open, and when do we
                  expect it? The outlook will use it automatically.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="mi-customer">Customer (optional note)</Label>
                  <Input
                    id="mi-customer"
                    placeholder="e.g. PT Sinar"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="mi-amount">Outstanding amount</Label>
                  <Input
                    id="mi-amount"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="mi-ccy">Currency</Label>
                  <Input
                    id="mi-ccy"
                    value={currencyValue}
                    onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="mi-due">Expected / due date</Label>
                  <Input
                    id="mi-due"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Button
                    disabled={saving || !ws.customerId || !amount}
                    onClick={async () => {
                      setSaving(true);
                      setNote(null);
                      try {
                        const n = Number(amount);
                        await createReceivable(ws.customerId, {
                          originalAmount: n,
                          outstandingAmount: n,
                          currency: currencyValue,
                          dueDate: dueDate || undefined,
                          externalId: customerName
                            ? `manual-${customerName
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .slice(0, 24)}-${Date.now()}`
                            : undefined,
                          source: "manual",
                        });
                        setAmount("");
                        setCustomerName("");
                        await ws.refetch();
                        setNote("Saved.");
                      } finally {
                        setSaving(false);
                      }
                    }}
                  >
                    Save money in
                  </Button>
                  {note ? (
                    <p className="mt-2 text-sm text-muted-foreground">{note}</p>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {ws.receivables.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No receivables yet. Import an invoices CSV from Data, or add
                  one expected receipt above.
                </p>
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
        );
      }}
    </BusinessWorkspaceShell>
  );
};

export default BusinessMoneyInPage;
