import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BusinessWorkspaceShell } from "@/components/business/BusinessWorkspaceShell";
import {
  businessMetricLabel,
  EvidenceDrawer,
  type EvidencePayload,
} from "@/components/business/EvidenceDrawer";
import { WeeklyForecastChart } from "@/components/business/WeeklyForecastChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getBusinessOverview,
  type BusinessOverview,
  type BusinessOverviewMetric,
  type BusinessOverviewWeeklyPoint,
} from "@/lib/api/businessApi";
import { businessWorkspaceBase } from "@/lib/businessPaths";
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

function metricValue(m: BusinessOverviewMetric | undefined, currency: string) {
  if (!m || m.suppressed || m.value == null) return "—";
  if (typeof m.value === "number") {
    if (m.unit === "ratio") return `${(m.value * 100).toFixed(1)}%`;
    if (m.unit === "days") return `${m.value} days`;
    return money(m.value, m.currency ?? currency);
  }
  if (typeof m.value === "object") {
    return JSON.stringify(m.value);
  }
  return String(m.value);
}

const BusinessOverviewPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => {
  return (
    <BusinessWorkspaceShell
      title="Overview"
      description="What cash you can use, the next 13 weeks, and the single most important next step."
      customerIdOverride={customerIdOverride}
    >
      {(ws) => <OverviewBody customerId={ws.customerId} />}
    </BusinessWorkspaceShell>
  );
};

const OverviewBody: React.FC<{
  customerId: string;
}> = ({ customerId }) => {
  const [overview, setOverview] = useState<BusinessOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evidence, setEvidence] = useState<EvidencePayload | null>(null);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [showPlan, setShowPlan] = useState(false);

  const load = useCallback(async () => {
    if (!customerId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getBusinessOverview(customerId);
      setOverview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load overview");
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    void load();
  }, [load]);

  const openEvidence = (payload: EvidencePayload) => {
    setEvidence(payload);
    setEvidenceOpen(true);
  };

  if (loading && !overview) {
    return <p className="text-sm text-muted-foreground">Loading outlook…</p>;
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
  const baseline = overview.forecast;
  const overlay = overview.planOverlay;
  const active = showPlan && overlay ? overlay : baseline;
  const salesModule = overview.modules?.high_frequency_sales ?? null;
  const invoiceModule = overview.modules?.invoice_led ?? null;
  const salesMetrics = salesModule?.metrics ?? [];
  const invoiceMetrics = invoiceModule?.metrics ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {overview.demoBadge ? <Badge>Demo data</Badge> : null}
        <Badge variant="outline">asOf {overview.asOf}</Badge>
        {active?.calculationVersion ? (
          <Badge variant="secondary">{active.calculationVersion}</Badge>
        ) : null}
        {overlay ? (
          <label className="ml-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={showPlan}
              onChange={(e) => setShowPlan(e.target.checked)}
            />
            Show plan overlay
          </label>
        ) : null}
      </div>

      {showPlan && overlay ? (
        <p className="text-sm text-muted-foreground">
          Comparing baseline vs one plan. Cards below use the plan path; the
          chart shows both lines. Baseline low{" "}
          {money(baseline?.minBalanceHorizon, ccy)}
          {baseline?.minBalanceDate ? ` on ${baseline.minBalanceDate}` : ""}
          {overlay.bufferBreachDate
            ? ` · plan breaches buffer on ${overlay.bufferBreachDate}`
            : " · plan stays above buffer"}
          .
        </p>
      ) : null}

      {!overview.cashPositionComplete ? (
        <Card className="border-amber-300/60 dark:border-amber-700/50">
          <CardHeader>
            <CardTitle className="text-lg">
              Add a dated account balance
            </CardTitle>
            <CardDescription>
              Transactions show how cash moved, but they cannot establish how
              much cash the business started with. Import a closing balance and
              its date to complete this outlook.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="sm">
              <Link
                to={`${businessWorkspaceBase(customerId)}/connections`}
              >
                Add account balances
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card
          className="cursor-pointer"
          onClick={() =>
            openEvidence({
              title: "Cash available",
              formula: "Sum of base-currency account balances",
              asOf: overview.asOf,
              evidence: {
                accountCount: overview.accountCount,
                excludedCurrencies: overview.excludedCurrencies,
                cashAvailable: overview.cashAvailable,
              },
            })
          }
        >
          <CardHeader className="pb-2">
            <CardDescription>Cash available ({ccy})</CardDescription>
            <CardTitle className="text-2xl">
              {overview.cashPositionComplete
                ? money(overview.cashAvailable, ccy)
                : "Incomplete"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {overview.accountCount} account
            {overview.accountCount === 1 ? "" : "s"}
            {overview.excludedCurrencies.length
              ? ` · excluded ${overview.excludedCurrencies.join(", ")}`
              : ""}
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer"
          onClick={() =>
            openEvidence({
              title: "13-week low point",
              formula: "Minimum weekly projected balance in horizon",
              asOf: overview.asOf,
              calculationVersion: active?.calculationVersion,
              qualityFlags: Array.isArray(active?.qualityFlags)
                ? (active?.qualityFlags as string[])
                : undefined,
              evidence: {
                scenario: active?.scenario ?? "baseline",
                minBalanceHorizon: active?.minBalanceHorizon,
                minBalanceDate: active?.minBalanceDate,
                bufferBreachDate: active?.bufferBreachDate,
                confidence: active?.confidence,
              },
            })
          }
        >
          <CardHeader className="pb-2">
            <CardDescription>
              13-week lowest balance
              {showPlan && overlay ? " (with plan)" : ""}
            </CardDescription>
            <CardTitle className="text-2xl">
              {money(active?.minBalanceHorizon, ccy)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {active?.minBalanceDate
              ? `On ${active.minBalanceDate}`
              : "No outlook yet"}
            {active?.bufferBreachDate
              ? ` · buffer breach ${active.bufferBreachDate}`
              : ""}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Before the low point</CardDescription>
            <CardTitle className="text-lg">
              In {money(active?.expectedInBeforeLow, ccy)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Commitments due {money(active?.commitmentsBeforeLow, ccy)}
          </CardContent>
        </Card>
      </div>

      {overview.primaryAction ? (
        <Card
          className="border-amber-300/60 dark:border-amber-700/50 cursor-pointer"
          onClick={() =>
            openEvidence({
              title: overview.primaryAction!.title,
              evidence: overview.primaryAction!.evidence ?? {},
              asOf: overview.asOf,
            })
          }
        >
          <CardHeader>
            <CardDescription>Most important action</CardDescription>
            <CardTitle className="text-xl">
              {overview.primaryAction.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>{overview.primaryAction.rationale}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{overview.primaryAction.priority}</Badge>
              {overview.primaryAction.dueDate ? (
                <Badge variant="outline">
                  due {overview.primaryAction.dueDate}
                </Badge>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>13-week cash outlook</CardTitle>
          <CardDescription>
            Click a week for evidence. Solid line is baseline; dashed line is
            with the plan when overlay is on. The action queue always reflects
            the baseline scenario (plan effects stay in the comparison).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WeeklyForecastChart
            currency={ccy}
            points={
              (baseline?.weeklyBalances ?? []) as BusinessOverviewWeeklyPoint[]
            }
            overlayPoints={
              showPlan && overlay
                ? (overlay.weeklyBalances as BusinessOverviewWeeklyPoint[])
                : undefined
            }
            onSelectWeek={(point) =>
              openEvidence({
                title: `Week ${point.week} · ${point.date}`,
                formula:
                  "Opening path + confirmed/expected/planned/modelled net flows",
                asOf: overview.asOf,
                calculationVersion: active?.calculationVersion,
                evidence: point as unknown as Record<string, unknown>,
              })
            }
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Action queue</CardTitle>
            <CardDescription>Ranked operational next steps</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.actions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No open actions.</p>
            ) : (
              overview.actions.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className="w-full rounded-lg border p-3 text-left hover:bg-muted/40"
                  onClick={() =>
                    openEvidence({
                      title: a.title,
                      evidence: a.evidence ?? {},
                      asOf: overview.asOf,
                    })
                  }
                >
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant="outline">{a.priority}</Badge>
                    <span className="font-medium">{a.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{a.rationale}</p>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data freshness</CardTitle>
            <CardDescription>
              Confidence{" "}
              {active?.confidence != null
                ? Number(active.confidence).toFixed(2)
                : "—"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Sales days (28d): {overview.freshness.salesDaysInPeriod || "—"}
            </p>
            <p>Open receivables: {overview.freshness.openReceivableCount}</p>
            <p>
              Latest balance date:{" "}
              {overview.freshness.latestBalanceAsOf
                ? overview.freshness.latestBalanceAsOf
                : "—"}
            </p>
            <Button asChild variant="outline" size="sm">
              <Link
                to={`${businessWorkspaceBase(customerId)}/connections`}
              >
                Open Data
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {overview.capabilities?.high_frequency_sales && salesModule ? (
        <Card>
          <CardHeader>
            <CardTitle>{salesModule.label}</CardTitle>
            <CardDescription>
              Settlement and operating cash ratios — not accounting profit
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {salesMetrics.map((m) => (
              <button
                key={m.code}
                type="button"
                className="rounded-lg border p-3 text-left hover:bg-muted/40"
                onClick={() =>
                  openEvidence({
                    title: businessMetricLabel(m.code) ?? m.code,
                    metric: m,
                    asOf: m.asOf,
                  })
                }
              >
                <p className="text-xs text-muted-foreground">
                  {businessMetricLabel(m.code) ?? m.code}
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {metricValue(m, ccy)}
                </p>
                {m.suppressed ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {m.suppressionReason ?? "suppressed"}
                  </p>
                ) : null}
              </button>
            ))}
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">POS↔bank matched</p>
              <p className="mt-1 text-lg font-semibold">
                {salesModule.settlement.matchedCount} /{" "}
                {salesModule.settlement.matchedCount +
                  salesModule.settlement.unmatchedCount}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {overview.capabilities?.invoice_led && invoiceModule ? (
        <Card>
          <CardHeader>
            <CardTitle>{invoiceModule.label}</CardTitle>
            <CardDescription>
              Aging, concentration, and collection pressure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {invoiceMetrics.map((m) => (
                <button
                  key={m.code}
                  type="button"
                  className="rounded-lg border p-3 text-left hover:bg-muted/40"
                  onClick={() =>
                    openEvidence({
                      title: businessMetricLabel(m.code) ?? m.code,
                      metric: m,
                      asOf: m.asOf,
                    })
                  }
                >
                  <p className="text-xs text-muted-foreground">
                    {businessMetricLabel(m.code) ?? m.code}
                  </p>
                  <p className="mt-1 text-lg font-semibold line-clamp-3">
                    {metricValue(m, ccy)}
                  </p>
                </button>
              ))}
            </div>
            {(invoiceModule.actions ?? []).slice(0, 3).map((a, idx) => (
              <div key={idx} className="rounded-lg border p-3 text-sm">
                <p className="font-medium">
                  {String(a.recommendedStep ?? a.problem)}
                </p>
                <p className="mt-1 text-muted-foreground">
                  {String(a.whyNow ?? "")}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <EvidenceDrawer
        open={evidenceOpen}
        onOpenChange={setEvidenceOpen}
        payload={evidence}
      />
    </div>
  );
};

export default BusinessOverviewPage;
