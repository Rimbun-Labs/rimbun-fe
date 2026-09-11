import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Printer } from "lucide-react";
import { BusinessWorkspaceShell } from "@/components/business/BusinessWorkspaceShell";
import { Button } from "@/components/ui/button";
import {
  getBusinessOverview,
  type BusinessOverview,
  type BusinessOverviewAction,
} from "@/lib/api/businessApi";
import {
  cashSummaryValues,
  claimTypeLabel,
  formatFundingAmount,
  residualFundingCopy,
} from "@/lib/business/claimLabels";
import { PAGE_HEADER } from "@/lib/constants/spacing";
import { cn } from "@/lib/utils";

function money(
  value: string | number | null | undefined,
  currency = "USD",
): string {
  if (value == null || value === "") return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

function formatShortDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function metricNumber(
  metric: Record<string, unknown> | null | undefined,
  key: string,
): number | null {
  if (!metric) return null;
  const v = metric[key];
  return typeof v === "number" && !Number.isNaN(v) ? v : null;
}

function dataQualityLine(overview: BusinessOverview): string {
  const parts: string[] = [];
  if (!overview.cashPositionComplete) {
    parts.push("Dated account balance missing");
  } else {
    parts.push("Cash position complete");
  }
  parts.push(
    `${overview.accountCount} account${overview.accountCount === 1 ? "" : "s"}`,
  );
  if (overview.freshness.salesDaysInPeriod > 0) {
    parts.push(`${overview.freshness.salesDaysInPeriod} sales days in period`);
  }
  const settlement = overview.modules.high_frequency_sales?.settlement;
  if (settlement) {
    parts.push(
      `${settlement.matchedCount} matched / ${settlement.unmatchedCount} unmatched settlements`,
    );
  }
  return parts.join(" · ");
}

const BusinessReviewPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => {
  return (
    <BusinessWorkspaceShell
      title="Review"
      description="Cash & working capital review — printable summary from the same overview engine."
      customerIdOverride={customerIdOverride}
    >
      {(ws) => <ReviewBody customerId={ws.customerId} />}
    </BusinessWorkspaceShell>
  );
};

const ReviewBody: React.FC<{ customerId: string }> = ({ customerId }) => {
  const [overview, setOverview] = useState<BusinessOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!customerId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getBusinessOverview(customerId);
      setOverview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load review");
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    void load();
  }, [load]);

  const cash = useMemo(
    () => cashSummaryValues(overview?.cashSummary),
    [overview?.cashSummary],
  );

  if (loading && !overview) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }
  if (error && !overview) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-destructive">{error}</p>
        <Button size="sm" variant="outline" onClick={() => void load()}>
          Retry
        </Button>
      </div>
    );
  }
  if (!overview) return null;

  const ccy = overview.baseCurrency;
  const verified = overview.actions.filter(
    (a) =>
      a.claimType === "observed" && a.evidenceQuality !== "insufficient",
  );
  const scenarios = overview.actions.filter(
    (a) =>
      a.claimType === "conditional" ||
      a.claimType === "calculated" ||
      a.claimType === "benchmark_based",
  );
  const daysBelowBuffer =
    overview.actions
      .map((a) => metricNumber(a.scenarioMetric, "daysBelowBuffer"))
      .find((d): d is number => d != null) ??
    overview.actions
      .map((a) => metricNumber(a.baselineMetric, "daysBelowBuffer"))
      .find((d): d is number => d != null) ??
    null;
  const residualCopy = residualFundingCopy(
    cash.residualFundingNeedIfActionsSucceedIdr,
    ccy,
    daysBelowBuffer,
  );
  const settlement = overview.modules.high_frequency_sales?.settlement;
  const assumptions = Array.from(
    new Set(
      overview.actions.flatMap((a) => a.assumptions ?? []).filter(Boolean),
    ),
  );

  return (
    <div className="space-y-10 print:space-y-6">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .business-review-print, .business-review-print * { visibility: visible; }
          .business-review-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            background: white;
            color: black;
          }
          .no-print { display: none !important; }
          .business-review-print section {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="flex flex-wrap items-start justify-between gap-4 no-print">
        <div className={PAGE_HEADER.content}>
          <div>
            <h1 className={PAGE_HEADER.title}>Cash & working capital review</h1>
            <p className={PAGE_HEADER.description}>
              Same figures as Home — formatted for sharing or print.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => window.print()}
        >
          <Printer className="mr-2 h-4 w-4" />
          Print / Save as PDF
        </Button>
      </div>

      <div className="business-review-print space-y-10">
        <header className="hidden print:block">
          <h1 className="text-2xl font-semibold">
            Cash & working capital review
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            As of {formatShortDate(overview.freshness.latestBalanceAsOf)} ·{" "}
            {ccy}
          </p>
        </header>

        {/* 1. Executive summary */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Executive summary</h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            <SummaryRow
              label="Current operating cash"
              value={
                overview.cashPositionComplete
                  ? money(overview.cashAvailable, ccy)
                  : "—"
              }
            />
            <SummaryRow
              label="Baseline funding need"
              value={money(cash.baselineFundingNeedIdr, ccy)}
            />
            <SummaryRow
              label="Verified missing cash"
              value={
                cash.verifiedMissingCashIdr > 0
                  ? money(cash.verifiedMissingCashIdr, ccy)
                  : "—"
              }
            />
            <SummaryRow
              label="Conditional funding reduction"
              value={
                cash.conditionalFundingReductionIdr > 0
                  ? money(cash.conditionalFundingReductionIdr, ccy)
                  : "—"
              }
            />
            <SummaryRow
              label="Residual funding need if actions succeed"
              value={money(cash.residualFundingNeedIfActionsSucceedIdr, ccy)}
            />
            <SummaryRow label="Data quality" value={dataQualityLine(overview)} />
          </dl>
          {residualCopy ? (
            <p className="rounded-lg border px-4 py-3 text-sm">{residualCopy}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              After the modelled actions, no residual funding need is estimated.
            </p>
          )}
        </section>

        {/* 2. Verified findings */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Verified findings</h2>
          <p className="text-sm text-muted-foreground">
            Observed issues supported by evidence.
          </p>
          {verified.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No verified findings in the current open actions.
            </p>
          ) : (
            <ActionTable actions={verified} currency={ccy} />
          )}
        </section>

        {/* 3. Decision scenarios */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Decision scenarios</h2>
          <p className="text-sm text-muted-foreground">
            Conditional and calculated comparisons.
          </p>
          {scenarios.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No decision scenarios ranked for this period.
            </p>
          ) : (
            <ActionTable actions={scenarios} currency={ccy} />
          )}
        </section>

        {/* 4. Working-capital actions */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Working-capital actions</h2>
          {overview.actions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No open actions.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Action</th>
                    <th className="px-3 py-2 font-medium">Class</th>
                    <th className="px-3 py-2 font-medium">Deadline</th>
                    <th className="px-3 py-2 font-medium">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {overview.actions.map((a) => (
                    <tr key={a.id}>
                      <td className="px-3 py-2.5 align-top">
                        <p className="font-medium">{a.title}</p>
                        <p className="mt-0.5 text-muted-foreground">
                          {a.why ?? a.rationale}
                        </p>
                      </td>
                      <td className="px-3 py-2.5 align-top whitespace-nowrap">
                        {claimTypeLabel(a.claimType, a.evidenceQuality)}
                      </td>
                      <td className="px-3 py-2.5 align-top whitespace-nowrap">
                        {formatShortDate(a.dueDate ?? a.effectiveDate)}
                      </td>
                      <td className="px-3 py-2.5 align-top">
                        {a.impactLabel ??
                          (a.impactIdr != null
                            ? money(a.impactIdr, ccy)
                            : "—")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* 5. Funding readiness */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Funding readiness</h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            <SummaryRow
              label="Amount still required"
              value={
                cash.residualFundingNeedIfActionsSucceedIdr > 0
                  ? formatFundingAmount(
                      cash.residualFundingNeedIfActionsSucceedIdr,
                      ccy,
                    )
                  : money(0, ccy)
              }
            />
            <SummaryRow
              label="First date"
              value={formatShortDate(cash.residualFundingDate)}
            />
            <SummaryRow
              label="Duration below buffer"
              value={
                daysBelowBuffer != null
                  ? `Approximately ${daysBelowBuffer} days`
                  : "—"
              }
            />
            <SummaryRow
              label="Cash buffer target"
              value={
                cash.cashBufferTargetIdr != null
                  ? money(cash.cashBufferTargetIdr, ccy)
                  : "—"
              }
            />
          </dl>
          {assumptions.length > 0 ? (
            <div>
              <p className="text-sm font-medium">Assumptions</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {assumptions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No modelled assumptions listed on open actions.
            </p>
          )}
          {!overview.cashPositionComplete ? (
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Missing information: dated account balance required before funding
              figures are complete.
            </p>
          ) : null}
        </section>

        {/* 6. Evidence and limitations */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Evidence and limitations</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              Latest balance as of{" "}
              {formatShortDate(overview.freshness.latestBalanceAsOf)}; accounts
              synced{" "}
              {overview.freshness.accountsSyncedAt
                ? formatShortDate(
                    overview.freshness.accountsSyncedAt.slice(0, 10),
                  )
                : "—"}
              .
            </li>
            <li>
              Sales days in period: {overview.freshness.salesDaysInPeriod}. Open
              receivables: {overview.freshness.openReceivableCount}
              {overview.freshness.openReceivableAmount != null
                ? ` (${money(overview.freshness.openReceivableAmount, ccy)})`
                : ""}
              .
            </li>
            {settlement ? (
              <li>
                Settlement reconciliation: {settlement.matchedCount} matched,{" "}
                {settlement.unmatchedCount} unmatched
                {settlement.unmatchedAmount != null
                  ? ` (${money(settlement.unmatchedAmount, ccy)})`
                  : ""}
                {settlement.reconciliationRate != null
                  ? ` · ${(settlement.reconciliationRate * 100).toFixed(0)}% matched`
                  : ""}
                {settlement.actionableMissingCount != null
                  ? ` · ${settlement.actionableMissingCount} actionable missing${
                      settlement.actionableMissingAmount != null
                        ? ` (${money(settlement.actionableMissingAmount, ccy)})`
                        : ""
                    }`
                  : ""}
                {settlement.periodStart && settlement.periodEnd
                  ? ` · ${settlement.periodStart} → ${settlement.periodEnd}`
                  : ""}
                .
              </li>
            ) : (
              <li>No high-frequency settlement module in this overview.</li>
            )}
            {overview.excludedCurrencies.length > 0 ? (
              <li>
                Excluded currencies: {overview.excludedCurrencies.join(", ")}.
              </li>
            ) : null}
            <li>
              Forecast model: {overview.forecast?.modelVersion ?? "—"};{" "}
              calculation {overview.forecast?.calculationVersion ?? "—"}.
            </li>
            <li>
              This review does not recommend a bank or loan product. Residual
              amounts describe uncovered cash need only.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border px-4 py-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium leading-snug">{value}</dd>
    </div>
  );
}

function ActionTable({
  actions,
  currency,
}: {
  actions: BusinessOverviewAction[];
  currency: string;
}) {
  return (
    <ul className="space-y-2">
      {actions.map((a) => (
        <li
          key={a.id}
          className={cn("rounded-xl border px-4 py-3 text-sm")}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-medium">{a.title}</p>
            <span className="text-xs text-muted-foreground">
              {claimTypeLabel(a.claimType, a.evidenceQuality)}
            </span>
          </div>
          <p className="mt-1 text-muted-foreground">{a.why ?? a.rationale}</p>
          {a.impactLabel || a.grossAmountIdr != null ? (
            <p className="mt-2 text-sm">
              {a.impactLabel ??
                (a.grossAmountIdr != null
                  ? `Gross ${money(a.grossAmountIdr, currency)}`
                  : null)}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export default BusinessReviewPage;
