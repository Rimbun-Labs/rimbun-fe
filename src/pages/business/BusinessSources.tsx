import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BusinessWorkspaceShell } from "@/components/business/BusinessWorkspaceShell";
import { createFacility } from "@/lib/api/businessApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

const FACILITY_TYPES = [
  { value: "working_capital", label: "Working capital facility" },
  { value: "overdraft", label: "Overdraft" },
  { value: "term_loan", label: "Term loan" },
  { value: "credit_card", label: "Credit card" },
  { value: "other", label: "Other" },
] as const;

function facilityTypeLabel(value: string): string {
  return (
    FACILITY_TYPES.find((t) => t.value === value)?.label ??
    value.replace(/_/g, " ")
  );
}

function formatMoney(
  amount: string | number | null | undefined,
  currency: string,
): string {
  if (amount == null || Number.isNaN(Number(amount))) return "—";
  const n = Number(amount);
  if (currency === "IDR" && Math.abs(n) >= 1_000_000) {
    const millions = n / 1_000_000;
    const rounded =
      Math.abs(millions) >= 10
        ? Math.round(millions)
        : Math.round(millions * 10) / 10;
    return `IDR ${rounded}m`;
  }
  return `${n.toLocaleString()} ${currency}`;
}

const BusinessSourcesPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => {
  const [facilityType, setFacilityType] = useState("working_capital");
  const [outstanding, setOutstanding] = useState("");
  const [available, setAvailable] = useState("");
  const [currency, setCurrency] = useState("");
  const [lenderName, setLenderName] = useState("");
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <BusinessWorkspaceShell
      title="Sources"
      description="Where Rimbun gets its facts from — file imports, connected systems when available, and durable context like credit facilities."
      customerIdOverride={customerIdOverride}
    >
      {(ws) => {
        const importPath = `${businessWorkspaceBase(customerIdOverride)}/import`;
        const currencyValue = currency || ws.profile?.baseCurrency || "IDR";
        const hasFileCoverage =
          ws.accounts.length > 0 ||
          ws.receivables.length > 0 ||
          ws.obligations.length > 0;

        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Connected systems</CardTitle>
                <CardDescription>
                  No bank, POS, or accounting connectors are linked yet. When
                  they are, you will see connection status and last sync here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Until then, feed operating data with files from Import data.
                </p>
                <Button asChild className="mt-3" variant="outline">
                  <Link to={importPath}>Go to Import data</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Credit facilities</CardTitle>
                <CardDescription>
                  Record existing credit lines as source facts (lender, drawn,
                  still available). This is Data — not a cash decision page.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {ws.facilities.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No facilities recorded yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {ws.facilities.map((f) => {
                      const title = [
                        f.lenderName,
                        facilityTypeLabel(f.facilityType),
                      ]
                        .filter(Boolean)
                        .join(" ");
                      return (
                        <div
                          key={f.id}
                          className="flex items-start justify-between gap-2 border-b pb-3 last:border-0 last:pb-0"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {title || facilityTypeLabel(f.facilityType)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Outstanding{" "}
                              {formatMoney(f.outstandingPrincipal, f.currency)}
                              {" · "}
                              Available{" "}
                              {formatMoney(f.availableAmount, f.currency)}
                            </p>
                          </div>
                          <Badge variant="outline">{f.status}</Badge>
                        </div>
                      );
                    })}
                  </div>
                )}

                <Collapsible open={addOpen} onOpenChange={setAddOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1 px-0">
                      Add facility
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          addOpen ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-1">
                        <Label htmlFor="src-fin-type">Facility type</Label>
                        <select
                          id="src-fin-type"
                          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                          value={facilityType}
                          onChange={(e) => setFacilityType(e.target.value)}
                        >
                          {FACILITY_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="src-fin-lender">Lender</Label>
                        <Input
                          id="src-fin-lender"
                          placeholder="e.g. BCA"
                          value={lenderName}
                          onChange={(e) => setLenderName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="src-fin-out">Amount outstanding</Label>
                        <Input
                          id="src-fin-out"
                          placeholder="Drawn / outstanding"
                          value={outstanding}
                          onChange={(e) => setOutstanding(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="src-fin-avail">
                          Amount still available
                        </Label>
                        <Input
                          id="src-fin-avail"
                          placeholder="Undrawn / remaining limit"
                          value={available}
                          onChange={(e) => setAvailable(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label htmlFor="src-fin-ccy">Currency</Label>
                        <Input
                          id="src-fin-ccy"
                          value={currencyValue}
                          onChange={(e) =>
                            setCurrency(e.target.value.toUpperCase())
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Button
                          disabled={saving || !ws.customerId}
                          onClick={async () => {
                            setSaving(true);
                            setNote(null);
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
                              setLenderName("");
                              await ws.refetch();
                              setNote("Saved.");
                            } finally {
                              setSaving(false);
                            }
                          }}
                        >
                          Save facility
                        </Button>
                        {note ? (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {note}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What is already in the workspace</CardTitle>
                <CardDescription>
                  {hasFileCoverage
                    ? "Operating facts currently available (from imports)."
                    : "Nothing loaded from files yet — start with Import data."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc text-sm text-muted-foreground">
                  <li>{ws.accounts.length} cash account(s)</li>
                  <li>
                    {ws.receivables.length} expected receipt(s) (Money)
                  </li>
                  <li>{ws.obligations.length} commitment(s) (Money)</li>
                  <li>
                    {ws.facilities.length} credit{" "}
                    {ws.facilities.length === 1 ? "facility" : "facilities"}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );
      }}
    </BusinessWorkspaceShell>
  );
};

export default BusinessSourcesPage;
