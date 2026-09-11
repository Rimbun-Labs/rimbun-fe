import React, { useState } from "react";
import { BusinessWorkspaceShell } from "@/components/business/BusinessWorkspaceShell";
import { createObligation } from "@/lib/api/businessApi";
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

const TYPES = [
  "payable",
  "payroll",
  "tax",
  "rent",
  "subscription",
  "supplier",
  "insurance",
  "other",
];

const BusinessMoneyOutPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => {
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState("");
  const [obligationType, setObligationType] = useState("payable");
  const [payee, setPayee] = useState("");
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  return (
    <BusinessWorkspaceShell
      title="Money out"
      description="Commitments that will leave cash. Prefer importing bills when you have a CSV; use this form for one-off items."
      customerIdOverride={customerIdOverride}
    >
      {(ws) => {
        const currencyValue = currency || ws.profile?.baseCurrency || "IDR";
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Record money out</CardTitle>
                <CardDescription>
                  Ask: who must we pay, what kind of cost is it, how much, and
                  when? The outlook will use it automatically.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="mo-type">Type</Label>
                  <select
                    id="mo-type"
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    value={obligationType}
                    onChange={(e) => setObligationType(e.target.value)}
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="mo-payee">Payee (optional note)</Label>
                  <Input
                    id="mo-payee"
                    placeholder="e.g. landlord, supplier"
                    value={payee}
                    onChange={(e) => setPayee(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="mo-amount">Amount</Label>
                  <Input
                    id="mo-amount"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="mo-ccy">Currency</Label>
                  <Input
                    id="mo-ccy"
                    value={currencyValue}
                    onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="mo-due">Due date</Label>
                  <Input
                    id="mo-due"
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
                        await createObligation(ws.customerId, {
                          obligationType,
                          amount: Number(amount),
                          currency: currencyValue,
                          dueDate: dueDate || undefined,
                          externalId: payee
                            ? `manual-${payee
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .slice(0, 24)}-${Date.now()}`
                            : undefined,
                          source: "manual",
                        });
                        setAmount("");
                        setPayee("");
                        await ws.refetch();
                        setNote("Saved.");
                      } finally {
                        setSaving(false);
                      }
                    }}
                  >
                    Save money out
                  </Button>
                  {note ? (
                    <p className="mt-2 text-sm text-muted-foreground">{note}</p>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {ws.obligations.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No obligations yet. Import a bills CSV from Data, or add one
                  commitment above.
                </p>
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
        );
      }}
    </BusinessWorkspaceShell>
  );
};

export default BusinessMoneyOutPage;
