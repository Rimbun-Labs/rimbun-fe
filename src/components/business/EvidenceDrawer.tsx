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
  pos_bank_reconciliation_rate: "POS ↔ bank reconciliation",
  commitment_coverage: "Commitment coverage",
  receivable_aging_buckets: "Receivable aging",
  realised_days_to_pay: "Days to get paid",
  customer_receipt_concentration: "Customer receipt concentration",
  hire_plan_cash_impact: "Hire plan cash impact",
};

export function businessMetricLabel(code?: string | null): string | null {
  if (!code) return null;
  return METRIC_LABELS[code] ?? code.replace(/_/g, " ");
}

function EvidenceRows({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data);
  if (entries.length === 0) {
    return (
      <p className="text-muted-foreground text-xs">No evidence fields.</p>
    );
  }
  return (
    <dl className="space-y-2">
      {entries.map(([key, value]) => (
        <div key={key} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-2">
          <dt className="text-xs text-muted-foreground">
            {key.replace(/_/g, " ")}
          </dt>
          <dd className="text-xs break-words">
            {Array.isArray(value) || (value != null && typeof value === "object")
              ? JSON.stringify(value)
              : String(value ?? "—")}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function EvidenceDrawer({ open, onOpenChange, payload }: Props) {
  const metric = payload?.metric;
  const codeLabel = businessMetricLabel(metric?.code);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{payload?.title ?? "Evidence"}</SheetTitle>
          <SheetDescription>
            Deterministic calculation details — no invented numbers.
          </SheetDescription>
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
                  Formula
                </p>
                <p className="mt-1">{payload.formula ?? metric?.formula}</p>
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {(payload.asOf || metric?.asOf) && (
                <Badge variant="outline">asOf {payload.asOf ?? metric?.asOf}</Badge>
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
              {metric?.suppressed ? (
                <Badge variant="destructive">
                  suppressed
                  {metric.suppressionReason
                    ? `: ${metric.suppressionReason}`
                    : ""}
                </Badge>
              ) : null}
            </div>
            {payload.qualityFlags && payload.qualityFlags.length > 0 ? (
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Quality flags
                </p>
                <ul className="mt-1 list-disc pl-4 text-muted-foreground">
                  {payload.qualityFlags.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Evidence
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
