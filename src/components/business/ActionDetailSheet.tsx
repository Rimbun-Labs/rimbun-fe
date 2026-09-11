import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BusinessOverviewAction } from "@/lib/api/businessApi";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: BusinessOverviewAction | null;
  currency: string;
  onMarkDone?: (actionId: string) => void;
  onDismiss?: (actionId: string) => void;
};

function money(value: number | null | undefined, currency: string): string {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function ActionDetailSheet({
  open,
  onOpenChange,
  action,
  currency,
  onMarkDone,
  onDismiss,
}: Props) {
  const [showAllEvidence, setShowAllEvidence] = useState(false);

  if (!action) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md" />
      </Sheet>
    );
  }

  const ccy = action.impactCurrency ?? currency;
  const baselineMin =
    action.baselineMetric &&
    typeof action.baselineMetric.minCash === "number"
      ? Number(action.baselineMetric.minCash)
      : null;
  const scenarioMin =
    action.scenarioMetric &&
    typeof action.scenarioMetric.minCash === "number"
      ? Number(action.scenarioMetric.minCash)
      : null;
  const effect =
    baselineMin != null && scenarioMin != null
      ? scenarioMin - baselineMin
      : action.impactIdr;
  const summaryRow = action.evidenceRows[0] ?? null;
  const payoutRows = action.evidenceRows.slice(1);
  const visiblePayouts = showAllEvidence
    ? payoutRows
    : payoutRows.slice(0, 3);
  const unmatchedGross =
    summaryRow?.amount != null ? Number(summaryRow.amount) : null;

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) setShowAllEvidence(false);
        onOpenChange(next);
      }}
    >
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{action.title}</SheetTitle>
          <SheetDescription>{action.why ?? action.rationale}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5 text-sm">
          {unmatchedGross != null && action.impactKind === "cash_release" ? (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {money(unmatchedGross, ccy)} unmatched
              </p>
              {action.impactLabel ? (
                <p className="text-xl font-semibold">{action.impactLabel}</p>
              ) : null}
            </div>
          ) : action.impactLabel ? (
            <p className="text-xl font-semibold">{action.impactLabel}</p>
          ) : null}

          <div className="grid gap-3">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">If you do nothing</p>
              <p className="mt-1 font-medium">
                {baselineMin != null
                  ? `${money(baselineMin, ccy)} minimum cash`
                  : action.baselineSummary ?? "—"}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">If you do this</p>
              <p className="mt-1 font-medium">
                {scenarioMin != null
                  ? `${money(scenarioMin, ccy)} minimum cash`
                  : action.scenarioSummary ?? "—"}
              </p>
            </div>
          </div>

          {effect != null ? (
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Effect</p>
              <p className="mt-1 font-semibold">
                {effect >= 0 ? "+" : ""}
                {money(effect, ccy)} minimum cash
              </p>
              {unmatchedGross != null &&
              effect > 0 &&
              Math.abs(unmatchedGross - effect) > 1 ? (
                <p className="mt-1 text-muted-foreground">
                  Not all of the unmatched amount lands in the lowest-cash week —
                  only {money(effect, ccy)} changes the trough.
                </p>
              ) : (
                <p className="mt-1 text-muted-foreground">
                  Keeps more cash available through the lowest-cash week.
                </p>
              )}
            </div>
          ) : null}

          {summaryRow || payoutRows.length > 0 ? (
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Why we say this
              </p>
              <ul className="space-y-2">
                {summaryRow ? (
                  <li className="rounded-lg border p-3">
                    <p className="font-medium">{summaryRow.label}</p>
                    <p className="mt-1 text-muted-foreground">
                      {[
                        summaryRow.amount != null
                          ? money(summaryRow.amount, ccy)
                          : null,
                        summaryRow.date,
                        summaryRow.detail,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </li>
                ) : null}
                {visiblePayouts.map((row, idx) => (
                  <li key={`${row.label}-${idx}`} className="rounded-lg border p-3">
                    <p className="font-medium">{row.label}</p>
                    <p className="mt-1 text-muted-foreground">
                      {[
                        row.amount != null ? money(row.amount, ccy) : null,
                        row.date,
                        row.detail,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </li>
                ))}
              </ul>
              {payoutRows.length > 3 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => setShowAllEvidence((v) => !v)}
                >
                  {showAllEvidence
                    ? "Show fewer"
                    : `View all ${payoutRows.length} payouts`}
                </Button>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{action.urgencyLabel}</Badge>
            {onMarkDone ? (
              <Button size="sm" onClick={() => onMarkDone(action.id)}>
                Mark done
              </Button>
            ) : null}
            {onDismiss ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDismiss(action.id)}
              >
                Dismiss
              </Button>
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
