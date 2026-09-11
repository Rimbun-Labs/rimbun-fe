import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import type { BusinessOverviewMetric } from "@/lib/api/businessApi";

export type EvidencePayload = {
  title: string;
  formula?: string;
  asOf?: string;
  confidence?: number;
  calculationVersion?: string;
  qualityFlags?: string[];
  evidence?: Record<string, unknown>;
  metric?: BusinessOverviewMetric | null;
  /** When true, show audit badges (version / confidence). Default off. */
  showAudit?: boolean;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payload: EvidencePayload | null;
};

const METRIC_LABELS: Record<string, string> = {
  net_sales: "Net sales",
  payroll_cash_ratio: "Payroll vs cash",
  supplier_cash_cost_ratio: "Supplier cash cost ratio",
  pos_bank_reconciliation_rate: "Settlement match rate",
  commitment_coverage: "Commitment coverage",
  receivable_aging_buckets: "Receivable aging",
  realised_days_to_pay: "Days to get paid",
  customer_receipt_concentration: "Customer receipt concentration",
  hire_plan_cash_impact: "Hire plan cash impact",
};

const EVIDENCE_LABELS: Record<string, string> = {
  accountCount: "Accounts",
  excludedCurrencies: "Excluded currencies",
  cashAvailable: "Cash available",
  minBalanceHorizon: "Lowest balance",
  minBalanceDate: "Lowest on",
  bufferBreachDate: "Buffer breach",
  scenario: "Scenario",
  shortfallDate: "Shortfall date",
  shortfallAmount: "Shortfall amount",
  matchedCount: "Matched",
  unmatchedCount: "Unmatched",
};

export function businessMetricLabel(code?: string | null): string | null {
  if (!code) return null;
  return METRIC_LABELS[code] ?? code.replace(/_/g, " ");
}

function formatEvidenceValue(value: unknown): string {
  if (value == null) return "—";
  if (typeof value === "number") {
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(
      value,
    );
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    if (value.length === 0) return "—";
    if (value.every((v) => typeof v !== "object")) return value.join(", ");
    return `${value.length} items`;
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .slice(0, 6)
      .map(([k, v]) => `${EVIDENCE_LABELS[k] ?? k}: ${formatEvidenceValue(v)}`)
      .join(" · ");
  }
  return String(value);
}

function EvidenceRows({ data }: { data: Record<string, unknown> }) {
  const skip = new Set([
    "calculationVersion",
    "modelVersion",
    "generationVersion",
    "qualityFlags",
    "confidence",
  ]);
  const entries = Object.entries(data).filter(([key]) => !skip.has(key));
  if (entries.length === 0) {
    return <p className="text-muted-foreground text-xs">Nothing to show.</p>;
  }
  return (
    <dl className="space-y-2">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-2"
        >
          <dt className="text-xs text-muted-foreground">
            {EVIDENCE_LABELS[key] ?? key.replace(/_/g, " ")}
          </dt>
          <dd className="text-xs break-words">{formatEvidenceValue(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

export function EvidenceDrawer({ open, onOpenChange, payload }: Props) {
  const metric = payload?.metric;
  const codeLabel = businessMetricLabel(metric?.code);
  const showAudit = Boolean(payload?.showAudit);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{payload?.title ?? "Details"}</SheetTitle>
          <SheetDescription>Supporting figures for this view.</SheetDescription>
        </SheetHeader>
        {!payload ? null : (
          <div className="mt-6 space-y-4 text-sm">
            {codeLabel ? (
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Metric
                </p>
                <p className="mt-1">{codeLabel}</p>
              </div>
            ) : null}
            {payload.formula || metric?.formula ? (
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  How it is built
                </p>
                <p className="mt-1">{payload.formula ?? metric?.formula}</p>
              </div>
            ) : null}
            {showAudit ? (
              <div className="flex flex-wrap gap-2">
                {(payload.asOf || metric?.asOf) && (
                  <Badge variant="outline">
                    as of {payload.asOf ?? metric?.asOf}
                  </Badge>
                )}
                {(payload.confidence != null || metric?.confidence != null) && (
                  <Badge variant="outline">
                    confidence{" "}
                    {(
                      payload.confidence ??
                      metric?.confidence ??
                      0
                    ).toFixed(2)}
                  </Badge>
                )}
                {(payload.calculationVersion || metric?.calculationVersion) && (
                  <Badge variant="secondary">
                    {payload.calculationVersion ?? metric?.calculationVersion}
                  </Badge>
                )}
              </div>
            ) : null}
            {metric?.suppressed ? (
              <Badge variant="destructive">
                Hidden
                {metric.suppressionReason
                  ? `: ${metric.suppressionReason}`
                  : ""}
              </Badge>
            ) : null}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Details
              </p>
              <EvidenceRows
                data={
                  (payload.evidence ??
                    metric?.evidence ??
                    {}) as Record<string, unknown>
                }
              />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
