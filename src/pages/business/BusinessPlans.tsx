import React, { useState } from "react";
import { BusinessWorkspaceShell } from "@/components/business/BusinessWorkspaceShell";
import { createPlanEvent } from "@/lib/api/businessApi";
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

const BusinessPlansPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => {
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("purchase");
  const [amount, setAmount] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [currency, setCurrency] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <BusinessWorkspaceShell
      title="Plans & scenarios"
      description="Future events that should change the cash outlook (hire, equipment, contract win)."
      customerIdOverride={customerIdOverride}
    >
      {(ws) => {
        const currencyValue = currency || ws.profile?.baseCurrency || "IDR";
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add planned cash event</CardTitle>
                <CardDescription>
                  What will change cash, when, and by roughly how much? It will
                  appear automatically in the outlook.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-5">
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  placeholder="Type"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                />
                <Input
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Input
                  type="date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                />
                <Button
                  disabled={saving || !ws.customerId || !title}
                  onClick={async () => {
                    setSaving(true);
                    try {
                      await createPlanEvent(ws.customerId, {
                        title,
                        eventType,
                        amount: amount ? Number(amount) : undefined,
                        currency: amount ? currencyValue : undefined,
                        expectedDate: expectedDate || undefined,
                        scenario: "plan_overlay",
                        source: "manual",
                      });
                      setTitle("");
                      setAmount("");
                      await ws.refetch();
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  Save plan
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
              {ws.planEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No plan events yet.
                </p>
              ) : (
                ws.planEvents.map((p) => (
                  <Card key={p.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{p.title}</CardTitle>
                        <Badge variant="outline">{p.status}</Badge>
                      </div>
                      <CardDescription>
                        {p.eventType} · {p.expectedDate || "unscheduled"}
                        {p.amount != null
                          ? ` · ${p.amount} ${p.currency ?? ""}`
                          : ""}{" "}
                        · source {p.source}
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

export default BusinessPlansPage;
