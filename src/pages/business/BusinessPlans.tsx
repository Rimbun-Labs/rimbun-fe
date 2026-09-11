import React, { useState } from "react";
import { Link } from "react-router-dom";
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { businessWorkspaceBase } from "@/lib/appPaths";

const PLAN_TYPES = [
  { value: "hire", label: "Hire" },
  { value: "equipment", label: "Equipment" },
  { value: "expansion", label: "Expansion" },
  { value: "contract", label: "Contract" },
  { value: "purchase", label: "Purchase" },
  { value: "other", label: "Other" },
] as const;

function planTypeLabel(value: string): string {
  return (
    PLAN_TYPES.find((t) => t.value === value)?.label ??
    value.replace(/_/g, " ")
  );
}

function formatMoney(
  amount: string | number | null,
  currency: string | null,
): string {
  if (amount == null) return "—";
  const n = Number(amount);
  if (Number.isNaN(n)) return String(amount);
  const ccy = currency || "IDR";
  if (ccy === "IDR" && Math.abs(n) >= 1_000_000) {
    const millions = n / 1_000_000;
    const rounded =
      Math.abs(millions) >= 10
        ? Math.round(millions)
        : Math.round(millions * 10) / 10;
    return `IDR ${rounded}m`;
  }
  return `${n.toLocaleString()} ${ccy}`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "Unscheduled";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const BusinessPlansPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => {
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("hire");
  const [amount, setAmount] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [currency, setCurrency] = useState("");
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <BusinessWorkspaceShell
      title="Plans"
      description="Future decisions you are considering. On Home, use Compare with plan to see how they change cash."
      customerIdOverride={customerIdOverride}
    >
      {(ws) => {
        const currencyValue = currency || ws.profile?.baseCurrency || "IDR";
        const homePath = businessWorkspaceBase(customerIdOverride);
        return (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              After you save a plan, open{" "}
              <Link
                to={homePath}
                className="font-medium text-foreground underline underline-offset-2"
              >
                Home
              </Link>{" "}
              and turn on <span className="font-medium">Compare with plan</span>{" "}
              to see the outlook with vs without it.
            </p>

            <div className="space-y-3">
              {ws.planEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No plans yet. Add something you are considering — hire,
                  equipment, purchase — then compare it on Home.
                </p>
              ) : (
                ws.planEvents.map((p) => (
                  <Card key={p.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-base">{p.title}</CardTitle>
                        <Badge variant="outline">{p.status}</Badge>
                      </div>
                      <CardDescription>
                        {planTypeLabel(p.eventType)} ·{" "}
                        {formatDate(p.expectedDate)} · cash effect{" "}
                        {formatMoney(p.amount, p.currency)}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>

            <Collapsible open={addOpen} onOpenChange={setAddOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 px-0">
                  Add a plan
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      addOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Add a plan</CardTitle>
                    <CardDescription>
                      What are you considering? Type, expected cash effect, and
                      when — then compare on Home.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1 md:col-span-2">
                      <Label htmlFor="plan-title">
                        What are you considering?
                      </Label>
                      <Input
                        id="plan-title"
                        placeholder="e.g. Hire barista, Buy espresso machine"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="plan-type">Type</Label>
                      <select
                        id="plan-type"
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                      >
                        {PLAN_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="plan-date">Expected date</Label>
                      <Input
                        id="plan-date"
                        type="date"
                        value={expectedDate}
                        onChange={(e) => setExpectedDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="plan-amount">Expected cash effect</Label>
                      <Input
                        id="plan-amount"
                        placeholder="Amount (outflow as positive)"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="plan-ccy">Currency</Label>
                      <Input
                        id="plan-ccy"
                        value={currencyValue}
                        onChange={(e) =>
                          setCurrency(e.target.value.toUpperCase())
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Button
                        disabled={saving || !ws.customerId || !title}
                        onClick={async () => {
                          setSaving(true);
                          setNote(null);
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
                            setExpectedDate("");
                            await ws.refetch();
                            setNote("Saved. Compare it on Home.");
                          } finally {
                            setSaving(false);
                          }
                        }}
                      >
                        Save plan
                      </Button>
                      {note ? (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {note}
                        </p>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          </div>
        );
      }}
    </BusinessWorkspaceShell>
  );
};

export default BusinessPlansPage;
