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
import {
  connectionStatusLabel,
  useBusinessConnectorConnections,
} from "@/hooks/useBusinessConnectors";

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
      description="A quick look at what feeds this business — connections, files, and credit lines you add by hand."
      customerIdOverride={customerIdOverride}
    >
      {(ws) => {
        const importPath = `${businessWorkspaceBase(customerIdOverride)}/import`;
        const connectionsPath = `${businessWorkspaceBase(customerIdOverride)}/connections`;
        const currencyValue = currency || ws.profile?.baseCurrency || "IDR";
        const hasCoverage =
          ws.accounts.length > 0 ||
          ws.receivables.length > 0 ||
          ws.obligations.length > 0;

        return (
          <div className="space-y-6">
            <SourcesSummary
              customerId={ws.customerId}
              importPath={importPath}
              connectionsPath={connectionsPath}
              accountCount={ws.accounts.length}
              receivableCount={ws.receivables.length}
              obligationCount={ws.obligations.length}
              facilityCount={ws.facilities.length}
              hasCoverage={hasCoverage}
            />

            <Card>
              <CardHeader>
                <CardTitle>Credit facilities</CardTitle>
                <CardDescription>
                  Keep track of credit lines you already have — lender, drawn,
                  and still available.
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
          </div>
        );
      }}
    </BusinessWorkspaceShell>
  );
};

function SourcesSummary({
  customerId,
  importPath,
  connectionsPath,
  accountCount,
  receivableCount,
  obligationCount,
  facilityCount,
  hasCoverage,
}: {
  customerId: string;
  importPath: string;
  connectionsPath: string;
  accountCount: number;
  receivableCount: number;
  obligationCount: number;
  facilityCount: number;
  hasCoverage: boolean;
}) {
  const connections = useBusinessConnectorConnections(customerId);
  const active = (connections.data ?? []).filter((c) => c.status !== "revoked");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline" size="sm">
          <Link to={connectionsPath}>Manage connections</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to={importPath}>Import data</Link>
        </Button>
      </div>

      {active.length > 0 ? (
        <ul className="space-y-2 text-sm">
          {active.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-2"
            >
              <span>
                {c.displayName || c.providerKey}
                {c.externalOrganizationId
                  ? ` · ${c.externalOrganizationId}`
                  : ""}
              </span>
              <Badge variant="outline">
                {connectionStatusLabel(c.status)}
              </Badge>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          No bank, sales, or accounting accounts connected yet.
        </p>
      )}

      <div>
        <p className="text-sm font-medium">
          {hasCoverage
            ? "Already loaded for this business"
            : "Nothing loaded yet"}
        </p>
        <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
          <li>{accountCount} cash account(s)</li>
          <li>{receivableCount} expected receipt(s)</li>
          <li>{obligationCount} commitment(s)</li>
          <li>
            {facilityCount} credit{" "}
            {facilityCount === 1 ? "facility" : "facilities"}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default BusinessSourcesPage;
