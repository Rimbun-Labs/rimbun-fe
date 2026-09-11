import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Banknote,
  Building2,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  Landmark,
  Link2,
  QrCode,
  Receipt,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { PAGE_HEADER } from "@/lib/constants/spacing";
import { ActionDetailSheet } from "@/components/business/ActionDetailSheet";
import { BusinessWorkspaceShell } from "@/components/business/BusinessWorkspaceShell";
import {
  EvidenceDrawer,
  type EvidencePayload,
} from "@/components/business/EvidenceDrawer";
import { WeeklyForecastChart } from "@/components/business/WeeklyForecastChart";
import { Button } from "@/components/ui/button";
import {
  getBusinessOverview,
  updateAction,
  type BusinessOverview,
  type BusinessOverviewAction,
  type BusinessOverviewMetric,
  type BusinessOverviewWeeklyPoint,
} from "@/lib/api/businessApi";
import { businessWorkspaceBase } from "@/lib/businessPaths";
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
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function timeGreeting(now = new Date()): string {
  const h = now.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatUpdatedAgo(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso.includes("T") ? iso : `${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const days = Math.max(
    0,
    Math.floor((Date.now() - d.getTime()) / (24 * 60 * 60 * 1000)),
  );
  if (days === 0) return "Updated today";
  if (days === 1) return "Updated 1 day ago";
  return `Updated ${days} days ago`;
}

function metricValue(m: BusinessOverviewMetric | undefined, currency: string) {
  if (!m || m.suppressed || m.value == null) return "—";
  if (typeof m.value === "number") {
    if (m.unit === "ratio") return `${(m.value * 100).toFixed(1)}%`;
    if (m.unit === "days") return `${m.value} days`;
    return money(m.value, m.currency ?? currency);
  }
  if (typeof m.value === "object") {
    return "See details";
  }
  return String(m.value);
}

function urgencyTone(label: string | undefined): string {
  const v = (label ?? "").toLowerCase();
  if (v.includes("high"))
    return "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300";
  if (v.includes("medium"))
    return "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
  return "border-border bg-muted/40 text-muted-foreground";
}

/** Icon + tint from action meaning (type / impact), with urgency as fallback. */
function actionVisual(action: BusinessOverviewAction): {
  Icon: LucideIcon;
  wrap: string;
  icon: string;
} {
  const type = (action.actionType ?? "").toLowerCase();
  const kind = (action.impactKind ?? "").toLowerCase();
  const urgency = (action.urgency ?? action.urgencyLabel ?? "").toLowerCase();

  if (
    type.includes("settlement") ||
    type.includes("unmatched") ||
    kind === "cash_release"
  ) {
    return {
      Icon: AlertCircle,
      wrap: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
      icon: "text-red-600 dark:text-red-300",
    };
  }
  if (type.includes("receivable") || type.includes("invoice") || kind === "cash_accelerated") {
    return {
      Icon: Receipt,
      wrap: "bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300",
      icon: "text-orange-600 dark:text-orange-300",
    };
  }
  if (
    type.includes("funding") ||
    type.includes("facility") ||
    type.includes("borrow")
  ) {
    return {
      Icon: Landmark,
      wrap: "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300",
      icon: "text-sky-700 dark:text-sky-300",
    };
  }
  if (
    type.includes("shortfall") ||
    type.includes("prepare_cash") ||
    type.includes("gap")
  ) {
    return {
      Icon: CalendarDays,
      wrap: "bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300",
      icon: "text-amber-700 dark:text-amber-300",
    };
  }
  if (type.includes("plan") || type.includes("delay") || type.includes("hire")) {
    return {
      Icon: CalendarDays,
      wrap: "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300",
      icon: "text-violet-700 dark:text-violet-300",
    };
  }
  if (type.includes("supplier") || type.includes("reschedule")) {
    return {
      Icon: Banknote,
      wrap: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
      icon: "text-emerald-700 dark:text-emerald-300",
    };
  }
  if (kind === "cost_saving" || type.includes("fee")) {
    return {
      Icon: CircleDollarSign,
      wrap: "bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300",
      icon: "text-teal-700 dark:text-teal-300",
    };
  }
  if (kind === "cash_protected" || urgency.includes("high")) {
    return {
      Icon: TrendingDown,
      wrap: "bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300",
      icon: "text-amber-700 dark:text-amber-300",
    };
  }
  if (urgency.includes("medium")) {
    return {
      Icon: Landmark,
      wrap: "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300",
      icon: "text-sky-700 dark:text-sky-300",
    };
  }
  return {
    Icon: CircleDollarSign,
    wrap: "bg-muted text-muted-foreground",
    icon: "text-muted-foreground",
  };
}

function actionSubtitle(
  action: BusinessOverviewAction,
  currency: string,
): string {
  const unmatchedGross =
    action.impactKind === "cash_release" &&
    action.evidenceRows[0]?.amount != null
      ? Number(action.evidenceRows[0].amount)
      : null;
  if (unmatchedGross != null) {
    const n = action.evidenceRows.length;
    return `${money(unmatchedGross, currency)} unmatched${
      n > 0 ? ` · ${n} expected payout${n === 1 ? "" : "s"}` : ""
    }`;
  }
  if (action.impactLabel) return action.impactLabel;
  return action.why ?? action.rationale;
}

const BusinessOverviewPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => {
  return (
    <BusinessWorkspaceShell
      title="Home"
      description="Here's your cash position and what to focus on next."
      customerIdOverride={customerIdOverride}
      hideHeader
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
  const [selectedAction, setSelectedAction] =
    useState<BusinessOverviewAction | null>(null);
  const [actionOpen, setActionOpen] = useState(false);
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

  const openAction = (action: BusinessOverviewAction) => {
    setSelectedAction(action);
    setActionOpen(true);
  };

  const setActionStatus = async (
    actionId: string,
    status: "completed" | "dismissed",
  ) => {
    await updateAction(customerId, actionId, { status });
    setActionOpen(false);
    setSelectedAction(null);
    await load();
  };

  if (loading && !overview) {
    return (
      <div className="space-y-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className={PAGE_HEADER.content}>
            <div className={PAGE_HEADER.icon.container}>
              <Building2
                className={cn(PAGE_HEADER.icon.size, "text-primary")}
              />
            </div>
            <div>
              <h1 className={PAGE_HEADER.title}>{timeGreeting()}</h1>
              <p className={PAGE_HEADER.description}>
                Here&apos;s your cash position and what to focus on next.
              </p>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
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
  const summary = overview.cashSummary;
  const base = businessWorkspaceBase(customerId);
  const asOf = overview.freshness.latestBalanceAsOf;
  const updatedAgo = formatUpdatedAgo(
    overview.freshness.accountsSyncedAt ?? asOf,
  );

  const byCode = (code: string) =>
    [...salesMetrics, ...invoiceMetrics].find(
      (m) => m.code === code && !m.suppressed && m.value != null,
    );

  const netSales = byCode("net_sales");
  const coverage = byCode("commitment_coverage");
  const salesDays =
    overview.freshness.salesDaysInPeriod ||
    (typeof netSales?.evidence?.["Sales days"] === "number"
      ? Number(netSales.evidence["Sales days"])
      : 0);
  const openReceivableCount = overview.freshness.openReceivableCount;
  const unmatchedFromRecon = byCode("pos_bank_reconciliation_rate");
  const openReceivableAmount =
    typeof unmatchedFromRecon?.evidence?.unmatchedSettlementAmount === "number"
      ? Number(unmatchedFromRecon.evidence.unmatchedSettlementAmount)
      : null;

  const thirdStatus =
    summary && summary.residualFundingNeedIdr > 0
      ? {
          label:
            summary.cashBufferTargetIdr != null
              ? `Funding needed to keep ${money(summary.cashBufferTargetIdr, ccy)} buffer`
              : "Funding needed",
          value: money(summary.residualFundingNeedIdr, ccy),
          Icon: ShieldCheck,
          wrap: "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300",
        }
      : summary && summary.addressableCashPressureIdr > 0
        ? {
            label: "Cash you can free up",
            value: money(summary.addressableCashPressureIdr, ccy),
            Icon: CircleDollarSign,
            wrap: "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300",
          }
        : {
            label: "Open actions",
            value: String(summary?.openActionCount ?? overview.actions.length),
            Icon: CircleDollarSign,
            wrap: "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300",
          };
  const ThirdStatusIcon = thirdStatus.Icon;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className={PAGE_HEADER.content}>
          <div className={PAGE_HEADER.icon.container}>
            <Building2
              className={cn(PAGE_HEADER.icon.size, "text-primary")}
            />
          </div>
          <div>
            <h1 className={PAGE_HEADER.title}>{timeGreeting()}</h1>
            <p className={PAGE_HEADER.description}>
              Here&apos;s your cash position and what to focus on next.
            </p>
          </div>
        </div>
        {asOf ? (
          <div className="flex items-start gap-2 text-sm text-muted-foreground sm:pt-1">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="leading-snug sm:text-right">
              <p>Data as of {formatShortDate(asOf)}</p>
              {updatedAgo ? (
                <p className="text-xs text-muted-foreground/80">{updatedAgo}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {!overview.cashPositionComplete ? (
        <div className="rounded-lg border border-amber-300/70 bg-amber-50/50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/20">
          <p className="font-medium">Add a dated account balance</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Needed before cash decisions are complete.
          </p>
          <Button asChild size="sm" className="mt-3" variant="outline">
            <Link to={`${base}/import`}>Import balances</Link>
          </Button>
        </div>
      ) : null}

      {/* Status — tinted icon left of label/value, no card chrome */}
      <section className="grid gap-8 sm:grid-cols-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Cash balance</p>
            <p className="mt-0.5 text-2xl font-semibold tracking-tight">
              {overview.cashPositionComplete
                ? money(overview.cashAvailable, ccy)
                : "—"}
            </p>
          </div>
        </div>
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300">
            <TrendingDown className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Lowest projected</p>
            <p className="mt-0.5 text-2xl font-semibold tracking-tight">
              {money(active?.minBalanceHorizon, ccy)}
            </p>
            {active?.minBalanceDate ? (
              <p className="mt-0.5 text-sm text-muted-foreground">
                on {formatShortDate(active.minBalanceDate)}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              thirdStatus.wrap,
            )}
          >
            <ThirdStatusIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{thirdStatus.label}</p>
            <p className="mt-0.5 text-2xl font-semibold tracking-tight">
              {thirdStatus.value}
            </p>
          </div>
        </div>
      </section>

      {/* Actions — clearly tappable list rows */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">What to do next</h2>
          <p className="text-sm text-muted-foreground">
            Ranked by cash impact. Tap to see details and explore options.
          </p>
        </div>
        {overview.actions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No open actions.</p>
        ) : (
          <div className="space-y-2">
            {overview.actions.map((a) => {
              const visual = actionVisual(a);
              const Icon = visual.Icon;
              return (
                <button
                  key={a.id}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl border bg-background px-4 py-3.5 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onClick={() => openAction(a)}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      visual.wrap,
                    )}
                  >
                    <Icon className={cn("h-5 w-5", visual.icon)} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{a.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                      {actionSubtitle(a, ccy)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium",
                      urgencyTone(a.urgencyLabel),
                    )}
                  >
                    {a.urgencyLabel}
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Chart — projected cash path */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">13-week cash outlook</h2>
            <p className="text-sm text-muted-foreground">
              {showPlan && overlay
                ? "Solid line is expected cash; dashed line includes your plan. Tap a week for the breakdown."
                : "Expected cash over the next 13 weeks. Tap a week for the breakdown."}
            </p>
          </div>
          {overlay ? (
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={showPlan}
                onChange={(e) => setShowPlan(e.target.checked)}
              />
              Compare with plan
            </label>
          ) : null}
        </div>
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
              title: `Week ${point.week} · ${formatShortDate(point.date)}`,
              evidence: {
                "Expected cash (closing)": point.projectedBalance,
                "Net movement this week": point.netFlow,
                "Confirmed this week": point.confirmedNet,
                "Expected this week": point.expectedNet,
                "From plans this week": point.plannedNet,
              },
            })
          }
        />
      </section>

      {/* Supporting — Key drivers + Recent data */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border bg-background p-5">
          <div className="mb-4">
            <h3 className="text-base font-semibold">Key drivers</h3>
            <p className="text-sm text-muted-foreground">
              Main inputs behind the outlook.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="rounded-xl border p-3 text-left transition-colors hover:bg-muted/40"
              onClick={() =>
                netSales
                  ? openEvidence({
                      title: "Net sales",
                      metric: netSales,
                    })
                  : undefined
              }
            >
              <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                <TrendingUp className="h-4 w-4" />
              </span>
              <p className="text-xs text-muted-foreground">Net sales (28d)</p>
              <p className="mt-1 text-lg font-semibold tracking-tight">
                {netSales ? metricValue(netSales, ccy) : "—"}
              </p>
              {salesDays > 0 ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {salesDays} sales day{salesDays === 1 ? "" : "s"}
                </p>
              ) : null}
            </button>

            <div className="rounded-xl border p-3">
              <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
                <Users className="h-4 w-4" />
              </span>
              <p className="text-xs text-muted-foreground">Sales days</p>
              <p className="mt-1 text-lg font-semibold tracking-tight">
                {salesDays || "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">of 28 days</p>
            </div>

            <Link
              to={`${base}/money?tab=in`}
              className="rounded-xl border p-3 transition-colors hover:bg-muted/40"
            >
              <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
                <CreditCard className="h-4 w-4" />
              </span>
              <p className="text-xs text-muted-foreground">Open receivables</p>
              <p className="mt-1 text-lg font-semibold tracking-tight">
                {openReceivableAmount != null
                  ? money(openReceivableAmount, ccy)
                  : openReceivableCount > 0
                    ? `${openReceivableCount}`
                    : "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {openReceivableCount} open
              </p>
            </Link>

            <button
              type="button"
              className="rounded-xl border p-3 text-left transition-colors hover:bg-muted/40"
              onClick={() =>
                coverage
                  ? openEvidence({
                      title: "Commitment coverage",
                      metric: coverage,
                    })
                  : undefined
              }
            >
              <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300">
                <Link2 className="h-4 w-4" />
              </span>
              <p className="text-xs text-muted-foreground">
                Commitment coverage
              </p>
              <p className="mt-1 text-lg font-semibold tracking-tight">
                {coverage && typeof coverage.value === "number"
                  ? `${(coverage.value * 100).toFixed(1)}%`
                  : "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                of expected outflows
              </p>
            </button>
          </div>
        </div>

        <div className="rounded-2xl border bg-background p-5">
          <div className="mb-4">
            <h3 className="text-base font-semibold">Recent data</h3>
            <p className="text-sm text-muted-foreground">
              Latest data and imports.
            </p>
          </div>
          <div className="divide-y rounded-xl border">
            <Link
              to={`${base}/money`}
              className="flex items-center gap-3 px-3 py-3 transition-colors hover:bg-muted/40"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
                <Building2 className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Bank statements</p>
                <p className="text-xs text-muted-foreground">
                  {asOf ? formatShortDate(asOf) : "No balance date"}
                </p>
              </div>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  overview.cashPositionComplete
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
                )}
              >
                {overview.cashPositionComplete ? "Up to date" : "Needs update"}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>

            <Link
              to={`${base}/import`}
              className="flex items-center gap-3 px-3 py-3 transition-colors hover:bg-muted/40"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
                <QrCode className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Sales</p>
                <p className="text-xs text-muted-foreground">
                  {salesDays > 0
                    ? `${salesDays} days in period`
                    : "No sales loaded"}
                </p>
              </div>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  salesDays > 0
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
                )}
              >
                {salesDays > 0 ? "Up to date" : "Needs update"}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>

            <Link
              to={`${base}/money?tab=out`}
              className="flex items-center gap-3 px-3 py-3 transition-colors hover:bg-muted/40"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
                <FileText className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Bills</p>
                <p className="text-xs text-muted-foreground">
                  {asOf ? formatShortDate(asOf) : "Commitments in workspace"}
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                Up to date
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          </div>
          <Link
            to={`${base}/import`}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-sky-700 hover:underline dark:text-sky-400"
          >
            Go to data
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <ActionDetailSheet
        open={actionOpen}
        onOpenChange={setActionOpen}
        action={selectedAction}
        currency={ccy}
        onMarkDone={(id) => void setActionStatus(id, "completed")}
        onDismiss={(id) => void setActionStatus(id, "dismissed")}
      />
      <EvidenceDrawer
        open={evidenceOpen}
        onOpenChange={setEvidenceOpen}
        payload={evidence}
      />
    </div>
  );
};

export default BusinessOverviewPage;
