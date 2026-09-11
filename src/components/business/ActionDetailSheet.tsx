import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { BusinessOverviewAction } from "@/lib/api/businessApi";
import { claimTypeLabel } from "@/lib/business/claimLabels";

export type ActionCompletionPayload = {
  outcome: "recovered" | "negotiated" | "completed" | "attempted_no_result";
  actualAmount?: number;
  completedAt?: string;
  completionNotes?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: BusinessOverviewAction | null;
  currency: string;
  onMarkDone?: (actionId: string, payload: ActionCompletionPayload) => void;
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

function metricNumber(
  metric: Record<string, unknown> | null | undefined,
  key: string,
): number | null {
  if (!metric) return null;
  const v = metric[key];
  return typeof v === "number" && !Number.isNaN(v) ? v : null;
}

/** Settlement actions often lead with a summary row — exclude it from payout counts. */
function splitEvidenceRows(action: BusinessOverviewAction) {
  const rows = action.evidenceRows ?? [];
  const isSettlement =
    (action.actionType ?? "").toLowerCase().includes("settlement") ||
    action.impactKind === "cash_release";
  const firstLooksSummary =
    rows.length > 1 &&
    /unmatched|total|summary|gross|missing/i.test(rows[0]?.label ?? "");
  if (isSettlement || firstLooksSummary) {
    return { summaryRow: rows[0] ?? null, detailRows: rows.slice(1) };
  }
  return { summaryRow: null, detailRows: rows };
}

function todayYmd(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
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
  const [completing, setCompleting] = useState(false);
  const [outcome, setOutcome] =
    useState<ActionCompletionPayload["outcome"]>("completed");
  const [actualAmount, setActualAmount] = useState("");
  const [completedAt, setCompletedAt] = useState(todayYmd());
  const [completionNotes, setCompletionNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    setCompleting(false);
    setOutcome("completed");
    setActualAmount("");
    setCompletedAt(todayYmd());
    setCompletionNotes("");
  }, [action?.id, open]);

  if (!action) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md" />
      </Sheet>
    );
  }

  const ccy = action.impactCurrency ?? currency;
  const baselineMin = metricNumber(action.baselineMetric, "minCash");
  const scenarioMin = metricNumber(action.scenarioMetric, "minCash");
  const baselineFunding = metricNumber(
    action.baselineMetric,
    "fundingRequirement",
  );
  const scenarioFunding = metricNumber(
    action.scenarioMetric,
    "fundingRequirement",
  );

  const minCashEffect =
    action.standaloneMinCashChangeIdr ??
    (baselineMin != null && scenarioMin != null
      ? scenarioMin - baselineMin
      : action.impactIdr);

  const fundingEffect =
    action.sequentialFundingNeedReductionIdr ??
    action.standaloneFundingNeedReductionIdr ??
    (baselineFunding != null && scenarioFunding != null
      ? baselineFunding - scenarioFunding
      : null);

  const { summaryRow, detailRows } = splitEvidenceRows(action);
  const visibleDetails = showAllEvidence
    ? detailRows
    : detailRows.slice(0, 3);
  const gross =
    action.grossAmountIdr ??
    (summaryRow?.amount != null ? Number(summaryRow.amount) : null);
  const classification = claimTypeLabel(
    action.claimType,
    action.evidenceQuality,
  );
  const assumptions = action.assumptions ?? [];

  const submitDone = () => {
    if (!onMarkDone) return;
    const parsed =
      actualAmount.trim() === "" ? undefined : Number(actualAmount);
    onMarkDone(action.id, {
      outcome,
      actualAmount:
        parsed != null && Number.isFinite(parsed) && parsed >= 0
          ? parsed
          : undefined,
      completedAt: completedAt || undefined,
      completionNotes: completionNotes.trim() || undefined,
    });
    setCompleting(false);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setShowAllEvidence(false);
          setCompleting(false);
        }
        onOpenChange(next);
      }}
    >
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{classification}</Badge>
            <Badge variant="outline">{action.urgencyLabel}</Badge>
          </div>
          <SheetTitle className="pt-2">{action.title}</SheetTitle>
          <SheetDescription>{action.why ?? action.rationale}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5 text-sm">
          {gross != null ? (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Source / gross amount</p>
              <p className="text-xl font-semibold">{money(gross, ccy)}</p>
              {action.impactLabel ? (
                <p className="text-muted-foreground">{action.impactLabel}</p>
              ) : null}
            </div>
          ) : action.impactLabel ? (
            <p className="text-xl font-semibold">{action.impactLabel}</p>
          ) : null}

          <div className="grid gap-3">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Before (if you do nothing)</p>
              <p className="mt-1 font-medium">
                {baselineMin != null
                  ? `${money(baselineMin, ccy)} minimum cash`
                  : action.baselineSummary ?? "—"}
              </p>
              {baselineFunding != null ? (
                <p className="mt-1 text-muted-foreground">
                  Funding need {money(baselineFunding, ccy)}
                </p>
              ) : null}
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">After (if this happens)</p>
              <p className="mt-1 font-medium">
                {scenarioMin != null
                  ? `${money(scenarioMin, ccy)} minimum cash`
                  : action.scenarioSummary ?? "—"}
              </p>
              {scenarioFunding != null ? (
                <p className="mt-1 text-muted-foreground">
                  Funding need {money(scenarioFunding, ccy)}
                </p>
              ) : null}
            </div>
          </div>

          {minCashEffect != null ? (
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Effect on minimum cash</p>
              <p className="mt-1 font-semibold">
                {minCashEffect >= 0 ? "+" : ""}
                {money(minCashEffect, ccy)}
              </p>
            </div>
          ) : null}

          {fundingEffect != null && fundingEffect !== 0 ? (
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Effect on funding need</p>
              <p className="mt-1 font-semibold">
                {fundingEffect > 0 ? "−" : "+"}
                {money(Math.abs(fundingEffect), ccy)}
              </p>
            </div>
          ) : null}

          {assumptions.length > 0 ? (
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Assumptions
              </p>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                {assumptions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {summaryRow || detailRows.length > 0 ? (
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Evidence
                {detailRows.length > 0
                  ? ` · ${detailRows.length} item${detailRows.length === 1 ? "" : "s"}`
                  : ""}
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
                {visibleDetails.map((row, idx) => (
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
              {detailRows.length > 3 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => setShowAllEvidence((v) => !v)}
                >
                  {showAllEvidence
                    ? "Show fewer"
                    : `View all ${detailRows.length} items`}
                </Button>
              ) : null}
            </div>
          ) : null}

          {action.validUntil ? (
            <p className="text-xs text-muted-foreground">
              Valid until {action.validUntil}
            </p>
          ) : null}

          {completing ? (
            <div className="space-y-3 rounded-lg border p-3">
              <p className="text-xs font-medium text-muted-foreground">
                Record outcome
              </p>
              <div className="space-y-1">
                <Label htmlFor="action-outcome">Outcome</Label>
                <select
                  id="action-outcome"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={outcome}
                  onChange={(e) =>
                    setOutcome(
                      e.target.value as ActionCompletionPayload["outcome"],
                    )
                  }
                >
                  <option value="completed">Completed</option>
                  <option value="recovered">Recovered</option>
                  <option value="negotiated">Negotiated</option>
                  <option value="attempted_no_result">Attempted, no result</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="action-actual-amount">
                  Actual amount ({ccy})
                </Label>
                <Input
                  id="action-actual-amount"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  placeholder="Optional"
                  value={actualAmount}
                  onChange={(e) => setActualAmount(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="action-completed-at">Date</Label>
                <Input
                  id="action-completed-at"
                  type="date"
                  value={completedAt}
                  onChange={(e) => setCompletedAt(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="action-notes">Notes</Label>
                <Textarea
                  id="action-notes"
                  rows={3}
                  placeholder="Optional"
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={submitDone}>
                  Save as done
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCompleting(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {onMarkDone ? (
                <Button size="sm" onClick={() => setCompleting(true)}>
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
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
