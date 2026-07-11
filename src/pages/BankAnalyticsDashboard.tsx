import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBankCustomerInsights } from '@/hooks/useBankCustomerInsights';
import { useFiDecisionInsights } from '@/hooks/useFiDecisionInsights';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, AlertCircle, ArrowLeft, Sparkles, CircleAlert } from 'lucide-react';
import { OverviewCards } from '@/components/dashboard/bank/OverviewCards';
import { RiskProfileChart } from '@/components/dashboard/bank/RiskProfileChart';
import { FinancialHealthSection } from '@/components/dashboard/bank/FinancialHealthSection';
import { EngagementMetrics } from '@/components/dashboard/bank/EngagementMetrics';
import { InvestmentPreferences } from '@/components/dashboard/bank/InvestmentPreferences';
import { CustomerSegmentation } from '@/components/dashboard/bank/CustomerSegmentation';
import { RouteErrorBoundary } from '@/components/error/RouteErrorBoundary';
import { format } from 'date-fns';
import type {
  BankCustomerListItem,
  FiDecisionAction,
  FiDecisionBehavioralWindowSlice,
  FiDecisionDataSufficiencyMetric,
  FiDecisionMetadata,
  FiDecisionRiskBreakdown,
  FiDecisionRiskItem,
  FiDecisionSpendLocation,
  FiQueueBookSummary,
  FiQueueBucket,
  FiQueueReadinessTier,
} from '@/lib/api/types/fiDecision';
import {
  normalizeActivationPropensity,
  normalizeExplainActivation,
  normalizeExplainProductFit,
  normalizeIntentSignals,
  normalizeMerchantPropensity,
  normalizeProductFit,
  pickPrimarySpendLocationHypothesis,
  shouldDemoteCrossSell,
} from '@/lib/api/fiDecisionNormalize';

const asPercent = (value: number) => {
  // Backend may return either ratio (0-1) or already-final percentage (0-100).
  const normalized = Math.abs(value) <= 1 ? value * 100 : value;
  return `${Math.round(normalized)}%`;
};
const asCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
const asDecimal = (value: number, maxFractionDigits = 1) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: maxFractionDigits }).format(value);

const formatDeltaPct = (v: number | null | undefined) => {
  if (v == null) return '—';
  const p = Math.abs(v) <= 1 ? v * 100 : v;
  const sign = p > 0 ? '+' : '';
  return `${sign}${Math.round(p)}%`;
};

const signedNumber = (value: number) => `${value >= 0 ? '+' : ''}${Math.round(value)}`;

const merchantTrendLabel = (trend30dPct: number | null | undefined) => {
  if (trend30dPct == null) return 'Trend n/a';
  if (trend30dPct >= 15) return 'Rising';
  if (trend30dPct <= -10) return 'Declining';
  return 'Stable';
};

const merchantVolatilityLabel = (volatility3mCv: number | null | undefined) => {
  if (volatility3mCv == null) return 'Volatility n/a';
  if (volatility3mCv >= 0.6) return 'High volatility';
  if (volatility3mCv >= 0.3) return 'Medium volatility';
  return 'Low volatility';
};

const SPEND_LOCATION_BEHAVIOR_LABELS: Record<string, string> = {
  sticky_recurring: 'Recurring spend',
  episodic_volatile: 'Sporadic/high variance',
  mixed: 'Mixed behavior',
  insufficient_history: 'Low signal',
};
const SPEND_LOCATION_DOMINANT_MODE_LABELS: Record<string, string> = {
  routine: 'Routine',
  bursty: 'Bursty',
  volatile: 'Volatile',
  insufficient_data: 'Insufficient data',
};
const SPEND_LOCATION_CONCENTRATION_TIER_LABELS: Record<string, string> = {
  high: 'High concentration',
  medium: 'Medium concentration',
  low: 'Low concentration',
};

function spendLocationBehaviorLabel(pattern: string) {
  return SPEND_LOCATION_BEHAVIOR_LABELS[pattern] ?? pattern.replace(/_/g, ' ');
}
function spendLocationDominantModeLabel(mode: string) {
  return SPEND_LOCATION_DOMINANT_MODE_LABELS[mode] ?? mode.replace(/_/g, ' ');
}
function spendLocationConcentrationTierLabel(tier: string) {
  return SPEND_LOCATION_CONCENTRATION_TIER_LABELS[tier] ?? tier.replace(/_/g, ' ');
}

function SpendLocationInsightCard({
  spendLocation,
  metadata,
  title = 'Spend location signal',
}: {
  spendLocation?: FiDecisionSpendLocation;
  metadata?: FiDecisionMetadata;
  title?: string;
}) {
  const primary = pickPrimarySpendLocationHypothesis(spendLocation);
  if (!spendLocation) return null;

  const engineLabel =
    spendLocation.engineVersion || metadata?.versions?.spendLocationEngine || '';
  const hypothesisKey = (h: { rank: number; merchantFamily: string; anchorRole: string }) =>
    `${h.rank}-${h.merchantFamily}-${h.anchorRole}`;
  const others = primary
    ? spendLocation.hypotheses.filter((h) => hypothesisKey(h) !== hypothesisKey(primary))
    : spendLocation.hypotheses;
  const profile = spendLocation.spendBehaviorProfile;
  const next30Rows = spendLocation.next30dSpendLikelihoodByFamily ?? [];
  const guidance = profile?.rmGuidance ?? [];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{spendLocation.title || spendLocation.subtitle || 'Spend behavior and likely near-term lanes.'}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {spendLocation.subtitle ? <p className="text-muted-foreground">{spendLocation.subtitle}</p> : null}
        {profile ? (
          <div className="rounded-md border p-3 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Behavior summary</p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary">{spendLocationDominantModeLabel(profile.dominantMode)}</Badge>
              <Badge variant="outline">{spendLocationConcentrationTierLabel(profile.walletConcentrationTier)}</Badge>
              <Badge variant="outline">Wallet concentration {asPercent(profile.walletConcentration)}</Badge>
              <Badge variant="outline">Stability {asPercent(profile.stabilityIndex)}</Badge>
              <Badge
                variant={profile.confidenceTier === 'HIGH' ? 'default' : 'outline'}
                className={profile.confidenceTier === 'LOW' ? 'text-muted-foreground border-dashed' : undefined}
              >
                Confidence {profile.confidenceTier}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Discretionary pressure: <span className="font-medium text-foreground">{profile.discretionaryPressure}</span>
            </p>
          </div>
        ) : null}
        {guidance.length > 0 ? (
          <div className="rounded-md border p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">RM guidance</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {guidance.slice(0, 3).map((row) => (
                <li key={row}>{row}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {next30Rows.length > 0 ? (
          <div className="rounded-md border p-3 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Likely spend lanes (next 30d)
            </p>
            {next30Rows.slice(0, 3).map((row) => (
              <div key={`${row.rank}-${row.merchantFamily}`} className="rounded-md border p-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">#{row.rank} {row.merchantFamily}</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant={row.likelihoodTier === 'HIGH' ? 'default' : 'outline'}>
                      {row.likelihoodTier}
                    </Badge>
                    <Badge variant="outline">{row.expectedPattern}</Badge>
                  </div>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{row.evidence}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">Caution: {row.doNotOverclaim}</p>
              </div>
            ))}
          </div>
        ) : null}
        {primary ? (
          <div className="rounded-md border p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Primary anchor</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{primary.merchantFamily}</Badge>
              <Badge variant="outline">{spendLocationBehaviorLabel(primary.behaviorPattern)}</Badge>
              <Badge
                variant={primary.hypothesisConfidenceTier === 'HIGH' ? 'default' : 'outline'}
                className={primary.hypothesisConfidenceTier === 'LOW' ? 'text-muted-foreground border-dashed' : undefined}
              >
                Signal strength {primary.hypothesisConfidenceTier}
              </Badge>
              <Badge variant="outline">Share {asPercent(primary.shareScore)}</Badge>
              <Badge variant="outline">Intent {asPercent(primary.intentScore)}</Badge>
            </div>
            <p className="mt-2 text-muted-foreground">{primary.narrativeHint}</p>
          </div>
        ) : null}
        {others.length > 0 ? (
          <details className="rounded-md border p-3">
            <summary className="cursor-pointer text-xs font-medium text-foreground">
              Other ranked families ({others.length})
            </summary>
            <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
              {others.map((h) => (
                <li key={hypothesisKey(h)}>
                  <span className="font-medium text-foreground">
                    #{h.rank} {h.merchantFamily}
                  </span>
                  {' · '}
                  {spendLocationBehaviorLabel(h.behaviorPattern)} · {h.hypothesisConfidenceTier}
                  {h.narrativeHint ? <span className="block mt-0.5">{h.narrativeHint}</span> : null}
                </li>
              ))}
            </ul>
          </details>
        ) : null}
        {spendLocation.disclaimer ? (
          <p className="rounded-md border border-dashed p-2 text-[11px] text-muted-foreground">
            {spendLocation.disclaimer}
          </p>
        ) : null}
        {engineLabel ? (
          <p className="border-t pt-2 text-[11px] text-muted-foreground">Engine: {engineLabel}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function MerchantSparkline({
  series,
}: {
  series?: Array<{ period: string; share: number; amount: number }>;
}) {
  if (!series?.length) {
    return <p className="text-xs text-muted-foreground">No monthly share series yet.</p>;
  }

  const safe = series.map((row) => ({
    ...row,
    normalizedShare: Math.max(0, Math.min(1, row.share)),
  }));

  return (
    <div className="space-y-1">
      <div className="flex h-8 items-end gap-1">
        {safe.map((row) => (
          <div
            key={row.period}
            title={`${row.period}: ${asPercent(row.normalizedShare)} (${asCurrency(row.amount)})`}
            className="w-full rounded-sm bg-primary/80"
            style={{ height: `${Math.max(10, row.normalizedShare * 100)}%` }}
          />
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground">
        {safe[0].period} → {safe[safe.length - 1].period}
      </p>
    </div>
  );
}

function BehavioralWindowStrip({ label, slice }: { label: string; slice: FiDecisionBehavioralWindowSlice }) {
  const metrics = [
    {
      key: "total",
      label: "Total debit",
      current: slice.totalDebit,
      prior: slice.priorTotalDebit,
      delta: slice.totalDebitDeltaPct,
    },
    {
      key: "debt",
      label: "Debt bucket",
      current: slice.debtDebit,
      prior: slice.priorDebtDebit,
      delta: slice.debtDebitDeltaPct,
    },
    {
      key: "discretionary",
      label: "Discretionary",
      current: slice.discretionaryDebit,
      prior: slice.priorDiscretionaryDebit,
      delta: slice.discretionaryDebitDeltaPct,
    },
  ] as const;

  const maxValue = Math.max(1, ...metrics.flatMap((m) => [Math.abs(m.current), Math.abs(m.prior)]));

  return (
    <div className="rounded-md border p-3">
      <p className="mb-3 text-sm font-medium text-foreground">{label}</p>
      <div className="space-y-3">
        {metrics.map((metric) => {
          const currentWidth = (Math.abs(metric.current) / maxValue) * 100;
          const priorWidth = (Math.abs(metric.prior) / maxValue) * 100;
          const delta = metric.delta ?? 0;
          const deltaTone =
            delta > 0
              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
              : delta < 0
                ? "bg-rose-500/15 text-rose-300 border-rose-500/40"
                : "bg-muted text-muted-foreground border-border";

          return (
            <div key={metric.key} className="space-y-2 rounded-md border p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{metric.label}</p>
                <Badge variant="outline" className={deltaTone}>
                  Δ {formatDeltaPct(metric.delta)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Current</span>
                    <span>{asCurrency(metric.current)}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${Math.max(6, currentWidth)}%` }}
                      title={`Current: ${asCurrency(metric.current)}`}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Prior</span>
                    <span>{asCurrency(metric.prior)}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-muted-foreground/60"
                      style={{ width: `${Math.max(6, priorWidth)}%` }}
                      title={`Prior: ${asCurrency(metric.prior)}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LiquidityContextCard({
  title,
  context,
}: {
  title: string;
  context?: {
    monthlyCashflowDeficit: number;
    monthlyCashflowSurplus: number;
    emergencyFundCurrentAmount?: number | null;
    emergencyFundTargetAmount?: number | null;
    emergencyFundMonthsOfExpenses?: number | null;
    emergencyFundTargetMonths?: number | null;
    emergencyFundGapAmount?: number | null;
    emergencyFundGapMonths?: number | null;
    estimatedRunwayMonths?: number | null;
  };
}) {
  if (!context) return null;

  const hasEmergencyFundDetail =
    context.emergencyFundCurrentAmount != null ||
    context.emergencyFundTargetAmount != null ||
    context.emergencyFundMonthsOfExpenses != null ||
    context.emergencyFundTargetMonths != null ||
    context.emergencyFundGapAmount != null ||
    context.emergencyFundGapMonths != null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {context.monthlyCashflowDeficit > 0 ? (
          <p>
            Monthly cashflow deficit:{' '}
            <span className="font-medium">{asCurrency(context.monthlyCashflowDeficit)}</span>
          </p>
        ) : (
          <p>
            Monthly cashflow surplus:{' '}
            <span className="font-medium">{asCurrency(context.monthlyCashflowSurplus)}</span>
          </p>
        )}

        {hasEmergencyFundDetail ? (
          <>
            <p>
              Emergency fund:{' '}
              <span className="font-medium">
                {context.emergencyFundMonthsOfExpenses != null
                  ? `${asDecimal(context.emergencyFundMonthsOfExpenses)} months`
                  : '—'}
              </span>{' '}
              (target{' '}
              <span className="font-medium">
                {context.emergencyFundTargetMonths != null
                  ? `${asDecimal(context.emergencyFundTargetMonths)} months`
                  : '—'}
              </span>
              )
            </p>
            <p>
              Gap:{' '}
              <span className="font-medium">
                {context.emergencyFundGapAmount != null ? asCurrency(context.emergencyFundGapAmount) : '—'}
              </span>{' '}
              /{' '}
              <span className="font-medium">
                {context.emergencyFundGapMonths != null ? `${asDecimal(context.emergencyFundGapMonths)} months` : '—'}
              </span>
            </p>
          </>
        ) : (
          <p className="text-muted-foreground">Insufficient emergency fund detail from source data.</p>
        )}

        <p>
          Estimated runway at current deficit:{' '}
          <span className="font-medium">
            {context.estimatedRunwayMonths != null ? `${asDecimal(context.estimatedRunwayMonths)} months` : '—'}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}

function RiskBreakdownCard({
  breakdown,
  compact,
}: {
  breakdown?: FiDecisionRiskBreakdown;
  compact?: boolean;
}) {
  if (!breakdown) return null;
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">How this score was computed</CardTitle>
      </CardHeader>
      <CardContent className={`grid grid-cols-1 gap-4 text-sm ${compact ? "" : "md:grid-cols-2"}`}>
        <div className="space-y-1 rounded-md border p-3">
          <p className="font-medium">Liquidity risk breakdown</p>
          <p>Base: <span className="font-medium">{signedNumber(breakdown.liquidity.baseScore)}</span></p>
          <p>Cashflow adj: <span className="font-medium">{signedNumber(breakdown.liquidity.cashflowAdjustment)}</span></p>
          <p>Burn-rate adj: <span className="font-medium">{signedNumber(breakdown.liquidity.burnRateAdjustment)}</span></p>
          <p>Emergency-fund adj: <span className="font-medium">{signedNumber(breakdown.liquidity.emergencyFundAdjustment)}</span></p>
          <p className="pt-1">Final: <span className="font-semibold">{Math.round(breakdown.liquidity.finalScore)}</span></p>
        </div>
        <div className="space-y-1 rounded-md border p-3">
          <p className="font-medium">Stress risk breakdown</p>
          <p>Base: <span className="font-medium">{signedNumber(breakdown.stress.baseScore)}</span></p>
          <p>High-severity gaps adj: <span className="font-medium">{signedNumber(breakdown.stress.highSeverityGapAdjustment)}</span></p>
          <p>Medium-severity gaps adj: <span className="font-medium">{signedNumber(breakdown.stress.mediumSeverityGapAdjustment)}</span></p>
          <p>Cashflow adj: <span className="font-medium">{signedNumber(breakdown.stress.cashflowAdjustment)}</span></p>
          <p>Burn-rate adj: <span className="font-medium">{signedNumber(breakdown.stress.burnRateAdjustment)}</span></p>
          <p className="pt-1">Final: <span className="font-semibold">{Math.round(breakdown.stress.finalScore)}</span></p>
        </div>
      </CardContent>
    </Card>
  );
}

function GovernanceCoverageCard({
  merchantResolutionCoverage,
  unresolvedSpendShare,
  familyCoverageMap,
}: {
  merchantResolutionCoverage?: number;
  unresolvedSpendShare?: number;
  familyCoverageMap?: Record<string, { coverage: number; qualityFlag: "HIGH" | "MEDIUM" | "INSUFFICIENT"; confidenceFloor: number }>;
}) {
  if (
    merchantResolutionCoverage == null &&
    unresolvedSpendShare == null &&
    (!familyCoverageMap || Object.keys(familyCoverageMap).length === 0)
  ) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Data quality & governance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-wrap gap-2">
          {merchantResolutionCoverage != null && (
            <Badge variant="outline">Resolution coverage {asPercent(merchantResolutionCoverage)}</Badge>
          )}
          {unresolvedSpendShare != null && (
            <Badge variant="outline">Unresolved spend {asPercent(unresolvedSpendShare)}</Badge>
          )}
        </div>
        {familyCoverageMap && Object.keys(familyCoverageMap).length > 0 && (
          <div className="space-y-2">
            {Object.entries(familyCoverageMap).slice(0, 6).map(([family, meta]) => (
              <div key={family} className="rounded-md border p-2">
                <p className="font-medium">{family}</p>
                <p className="text-xs text-muted-foreground">
                  Coverage {asPercent(meta.coverage)} · Quality {meta.qualityFlag} · Confidence floor {asPercent(meta.confidenceFloor)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const isMetricInsufficient = (metric?: FiDecisionDataSufficiencyMetric) => {
  if (!metric) return false;
  if (metric.sufficient === false) return true;
  const status = metric.status?.toUpperCase();
  return status === "PARTIAL" || status === "INSUFFICIENT";
};

function DataSufficiencyAlert({
  title,
  metric,
}: {
  title: string;
  metric?: FiDecisionDataSufficiencyMetric;
}) {
  if (!isMetricInsufficient(metric)) return null;

  return (
    <Alert>
      <CircleAlert className="h-4 w-4" />
      <AlertTitle>{title} using partial evidence</AlertTitle>
      <AlertDescription>
        {metric?.reason || metric?.details || "Some upstream signals are incomplete, so confidence is reduced."}
      </AlertDescription>
    </Alert>
  );
}

function DecisionTraceabilityCard({
  metadata,
}: {
  metadata?: {
    decisionId?: string;
    generatedAt?: string;
    versions?: Record<string, string>;
    featureFreshness?: Record<string, string>;
  };
}) {
  if (!metadata?.decisionId && !metadata?.generatedAt && !metadata?.versions && !metadata?.featureFreshness) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Decision traceability</CardTitle>
        <CardDescription>Audit trail for model versions and feature freshness used in this decision.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {metadata.decisionId ? <p>Decision ID: <span className="font-medium">{metadata.decisionId}</span></p> : null}
        {metadata.generatedAt ? (
          <p>Generated at: <span className="font-medium">{format(new Date(metadata.generatedAt), 'PPpp')}</span></p>
        ) : null}
        {metadata.versions && Object.keys(metadata.versions).length > 0 ? (
          <details className="rounded-md border p-3">
            <summary className="cursor-pointer text-sm font-medium">Version map</summary>
            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
              {Object.entries(metadata.versions).map(([k, v]) => (
                <p key={k}>{k}: {v}</p>
              ))}
            </div>
          </details>
        ) : null}
        {metadata.featureFreshness && Object.keys(metadata.featureFreshness).length > 0 ? (
          <details className="rounded-md border p-3">
            <summary className="cursor-pointer text-sm font-medium">Feature freshness</summary>
            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
              {Object.entries(metadata.featureFreshness).map(([k, v]) => (
                <p key={k}>{k}: {v}</p>
              ))}
            </div>
          </details>
        ) : null}
      </CardContent>
    </Card>
  );
}

function SuppressionAppliedCard({
  rows,
  title,
}: {
  rows?: Array<{ reason: string; triggered: boolean; key?: string; scope?: string; rule?: string }>;
  title: string;
}) {
  const triggered = rows?.filter((row) => row.triggered) ?? [];
  if (!triggered.length) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {triggered.map((row) => (
          <div key={`${row.key ?? row.rule ?? row.reason}-${row.scope ?? ''}`} className="rounded-md border p-2">
            <p className="font-medium">{row.reason}</p>
            {(row.scope || row.rule || row.key) && (
              <p className="text-xs text-muted-foreground">
                {[row.scope, row.rule, row.key].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const riskBadgeClass = (band: FiDecisionRiskItem['band']) => {
  if (band === 'high') return 'bg-red-500/10 text-red-700 border-red-500/40';
  if (band === 'medium') return 'bg-amber-500/10 text-amber-700 border-amber-500/40';
  return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/40';
};

const actionCategoryLabel: Record<FiDecisionAction['category'], string> = {
  risk_mitigation: 'Risk mitigation',
  affordability: 'Affordability',
  cross_sell: 'Cross-sell',
  engagement: 'Engagement',
};
const ACTIVATION_PITCH_READY_THRESHOLD = 65;

const queueBucketLabel: Record<FiQueueBucket, string> = {
  ACT_NOW: "Act now",
  MONITOR: "Monitor",
  SUPPRESSED_HOLD: "Suppressed / Hold",
  NEEDS_DATA: "Needs data",
};

const READINESS_TIER_ORDER: FiQueueReadinessTier[] = ['READY', 'PARTIAL', 'NEEDS_DATA'];

const bookSummaryScopeCaption = (summary: FiQueueBookSummary) =>
  summary.scope === 'ranked_candidate_pool'
    ? 'Priority pool (this ranking run)'
    : 'This page only (legacy list)';

const bookSummaryScopeFootnote = (summary: FiQueueBookSummary) =>
  summary.scope === 'ranked_candidate_pool'
    ? `Aggregated over ${summary.candidatePoolSize} candidates scored before pagination — not your full institution.`
    : 'Aggregated over customers on this page only (DB order).';

const queueBucketBadgeClass = (bucket: FiQueueBucket) => {
  if (bucket === "ACT_NOW") return "bg-emerald-500/10 text-emerald-700 border-emerald-500/40";
  if (bucket === "SUPPRESSED_HOLD") return "bg-amber-500/10 text-amber-700 border-amber-500/40";
  if (bucket === "NEEDS_DATA") return "bg-rose-500/10 text-rose-700 border-rose-500/40";
  return "bg-muted text-muted-foreground border-border";
};

function DecisionRiskCard({ title, risk }: { title: string; risk: FiDecisionRiskItem }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardDescription>{title}</CardDescription>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{asPercent(risk.score)}</CardTitle>
          <Badge variant="outline" className={riskBadgeClass(risk.band)}>
            {risk.band.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">Confidence: {String(risk.confidence).toUpperCase()}</p>
        {risk.reasons.slice(0, 2).map((reason) => (
          <p key={reason} className="text-sm">- {reason}</p>
        ))}
      </CardContent>
    </Card>
  );
}

const BankAnalyticsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useBankCustomerInsights();
  const {
    customers,
    bookSummary,
    selectedCustomerId,
    setSelectedCustomerId,
    customersLoading,
    customersError,
    data: decisionData,
    loading: decisionLoading,
    error: decisionError,
    refetchCustomers,
    refetch: refetchDecision,
    explainData,
    explainLoading,
    explainError,
    fetchExplain,
    searchWalkInCustomers,
  } = useFiDecisionInsights();
  const [isExplainOpen, setIsExplainOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'customer' | 'overview'>('portfolio');
  const [portfolioQuery, setPortfolioQuery] = useState('');
  const [portfolioCohortInput, setPortfolioCohortInput] = useState('');
  const [hideNeedsData, setHideNeedsData] = useState(false);
  const [portfolioSort, setPortfolioSort] = useState<'queue-priority-desc' | 'selected-first' | 'name-asc' | 'name-desc'>(
    'queue-priority-desc'
  );

  const [walkInInput, setWalkInInput] = useState('');
  const [walkInResults, setWalkInResults] = useState<BankCustomerListItem[]>([]);
  const [walkInLoading, setWalkInLoading] = useState(false);
  const [walkInError, setWalkInError] = useState<Error | null>(null);
  const [walkInPick, setWalkInPick] = useState<{ userId: string; label: string } | null>(null);
  const walkInDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (walkInDebounceRef.current) clearTimeout(walkInDebounceRef.current);
    const cleaned = walkInInput.replace(/[%_\\]/g, '').trim();
    if (cleaned.length < 2) {
      setWalkInResults([]);
      setWalkInError(null);
      setWalkInLoading(false);
      return;
    }
    setWalkInLoading(true);
    walkInDebounceRef.current = setTimeout(async () => {
      try {
        const rows = await searchWalkInCustomers(walkInInput);
        setWalkInResults(rows);
        setWalkInError(null);
      } catch (e) {
        setWalkInError(e instanceof Error ? e : new Error('Customer search failed'));
        setWalkInResults([]);
      } finally {
        setWalkInLoading(false);
      }
    }, 350);
    return () => {
      if (walkInDebounceRef.current) clearTimeout(walkInDebounceRef.current);
    };
  }, [walkInInput, searchWalkInCustomers]);

  const hasPartialDecisionData = useMemo(() => {
    if (!decisionData?.sourceStatus) return false;
    return Object.values(decisionData.sourceStatus).some((v) => v === false);
  }, [decisionData]);

  const prioritizedActions = useMemo(() => {
    if (!decisionData) return [];
    if (!shouldDemoteCrossSell(decisionData)) return decisionData.actions;
    return [...decisionData.actions].sort((a, b) => {
      if (a.category === 'cross_sell' && b.category !== 'cross_sell') return 1;
      if (a.category !== 'cross_sell' && b.category === 'cross_sell') return -1;
      return a.priority - b.priority;
    });
  }, [decisionData]);
  const primaryAction = prioritizedActions[0];
  const backupAction = prioritizedActions[1];

  const openExplain = async () => {
    setIsExplainOpen(true);
    if (!explainData && !explainLoading) {
      await fetchExplain();
    }
  };

  const customerLabel = useMemo(() => {
    const selected = customers.find((customer) => customer.userId === selectedCustomerId);
    if (selected) return selected.displayName || selected.email || selected.userId;
    if (walkInPick && walkInPick.userId === selectedCustomerId) return walkInPick.label;
    if (selectedCustomerId) return selectedCustomerId;
    return 'No customer selected';
  }, [customers, selectedCustomerId, walkInPick]);

  const selectedInQueuePage = useMemo(
    () => Boolean(selectedCustomerId && customers.some((c) => c.userId === selectedCustomerId)),
    [customers, selectedCustomerId]
  );

  const productFitRows = useMemo(
    () =>
      decisionData?.propensityAndIntent
        ? normalizeProductFit(decisionData.propensityAndIntent)
        : [],
    [decisionData]
  );
  const activationRows = useMemo(
    () =>
      decisionData?.propensityAndIntent
        ? normalizeActivationPropensity(decisionData.propensityAndIntent)
        : [],
    [decisionData]
  );
  const merchantRows = useMemo(() => {
    if (!decisionData?.propensityAndIntent) return [];
    const rows = normalizeMerchantPropensity(decisionData.propensityAndIntent);
    return [...rows].sort((a, b) => (b.intentScore ?? b.score ?? 0) - (a.intentScore ?? a.score ?? 0));
  }, [decisionData]);
  const intentRows = useMemo(
    () =>
      decisionData?.propensityAndIntent
        ? normalizeIntentSignals(decisionData.propensityAndIntent)
        : [],
    [decisionData]
  );
  const mergedProductRows = useMemo(() => {
    const fitByProduct = new Map(productFitRows.map((row) => [row.productType, row]));
    const actByProduct = new Map(activationRows.map((row) => [row.productType, row]));
    const allProducts = Array.from(new Set([...fitByProduct.keys(), ...actByProduct.keys()]));

    return allProducts
      .map((productType) => {
        const fit = fitByProduct.get(productType);
        const activation = actByProduct.get(productType);
        const activationScore = activation?.activationScore ?? 0;
        const isSuppressed = activation?.suppressed === true;
        const actionabilityLabel = isSuppressed
          ? "Do not pitch product now"
          : activationScore >= ACTIVATION_PITCH_READY_THRESHOLD
            ? "Pitch-ready"
            : "Monitor / nurture";

        return {
          productType,
          fitScore: fit?.fitScore ?? activation?.fitScore,
          fitRationale: fit?.rationale,
          activationScore: activation?.activationScore,
          suppressed: isSuppressed,
          suppressReasons: activation?.suppressReasons ?? [],
          actionabilityLabel,
        };
      })
      .sort((a, b) => (b.activationScore ?? 0) - (a.activationScore ?? 0));
  }, [activationRows, productFitRows]);

  const explainProductFitRows = useMemo(
    () => (explainData ? normalizeExplainProductFit(explainData) : []),
    [explainData]
  );
  const explainActivationRows = useMemo(
    () => (explainData ? normalizeExplainActivation(explainData) : []),
    [explainData]
  );
  const cohortTokens = useMemo(
    () =>
      portfolioCohortInput
        .split(/[\s,]+/)
        .map((token) => token.trim().toLowerCase())
        .filter(Boolean),
    [portfolioCohortInput]
  );

  const portfolioRows = useMemo(() => {
    const normalizedQuery = portfolioQuery.trim().toLowerCase();
    const filtered = customers.filter((customer) => {
      if (cohortTokens.length > 0) {
        const userId = customer.userId?.toLowerCase() ?? '';
        const email = customer.email?.toLowerCase() ?? '';
        const displayName = customer.displayName?.toLowerCase() ?? '';
        const inCohort = cohortTokens.some(
          (token) => token === userId || token === email || (displayName && displayName.includes(token))
        );
        if (!inCohort) return false;
      }

      if (hideNeedsData && customer.queueBucket === "NEEDS_DATA") return false;

      if (!normalizedQuery) return true;
      const haystack = [customer.displayName, customer.email, customer.userId]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });

    return [...filtered].sort((a, b) => {
      if (portfolioSort === 'selected-first') {
        const aSelected = a.userId === selectedCustomerId ? 1 : 0;
        const bSelected = b.userId === selectedCustomerId ? 1 : 0;
        if (aSelected !== bSelected) return bSelected - aSelected;
      }

      if (portfolioSort === 'queue-priority-desc') {
        const aSelected = a.userId === selectedCustomerId ? 1 : 0;
        const bSelected = b.userId === selectedCustomerId ? 1 : 0;
        if (aSelected !== bSelected) return bSelected - aSelected;

        const aScore = a.queuePriorityScore ?? 0;
        const bScore = b.queuePriorityScore ?? 0;
        if (aScore !== bScore) return bScore - aScore;
      }

      const aLabel = (a.displayName || a.email || a.userId).toLowerCase();
      const bLabel = (b.displayName || b.email || b.userId).toLowerCase();
      if (portfolioSort === 'name-desc') return bLabel.localeCompare(aLabel);
      return aLabel.localeCompare(bLabel);
    });
  }, [customers, cohortTokens, hideNeedsData, portfolioQuery, portfolioSort, selectedCustomerId]);

  type PortfolioBucketGroup = FiQueueBucket | "QUEUE_PENDING";
  const bucketDisplayOrder: PortfolioBucketGroup[] = ["ACT_NOW", "SUPPRESSED_HOLD", "NEEDS_DATA", "MONITOR", "QUEUE_PENDING"];

  const bucketGroups = useMemo(() => {
    const groups: Record<PortfolioBucketGroup, typeof portfolioRows> = {
      ACT_NOW: [],
      MONITOR: [],
      SUPPRESSED_HOLD: [],
      NEEDS_DATA: [],
      QUEUE_PENDING: [],
    };

    for (const customer of portfolioRows) {
      const bucket = customer.queueBucket ?? "QUEUE_PENDING";
      groups[bucket].push(customer);
    }

    return bucketDisplayOrder
      .map((bucket) => {
        const rows = groups[bucket];
        if (!rows.length) return null;

        const sortedRows = [...rows].sort((a, b) => {
          const aSelected = a.userId === selectedCustomerId;
          const bSelected = b.userId === selectedCustomerId;
          const aScore = a.queuePriorityScore ?? 0;
          const bScore = b.queuePriorityScore ?? 0;
          const aLabel = (a.displayName || a.email || a.userId).toLowerCase();
          const bLabel = (b.displayName || b.email || b.userId).toLowerCase();

          if (portfolioSort === 'selected-first' && aSelected !== bSelected) {
            return aSelected ? -1 : 1;
          }

          if (portfolioSort === 'name-asc') return aLabel.localeCompare(bLabel);
          if (portfolioSort === 'name-desc') return bLabel.localeCompare(aLabel);

          // Default within buckets: highest queue priority first.
          if (aScore !== bScore) return bScore - aScore;
          return aLabel.localeCompare(bLabel);
        });

        if (bucket === "QUEUE_PENDING") {
          return {
            id: bucket,
            title: "Queue pending",
            rows: sortedRows,
          };
        }

        return {
          id: bucket,
          title: queueBucketLabel[bucket],
          rows: sortedRows,
        };
      })
      .filter(Boolean) as Array<{
        id: PortfolioBucketGroup;
        title: string;
        rows: typeof portfolioRows;
      }>;
  }, [portfolioRows, selectedCustomerId, portfolioSort]);

  // Show error state
  if (error) {
    const isUnauthorized = error.message.includes('401') || error.message.includes('Unauthorized');
    const isForbidden = error.message.includes('403') || error.message.includes('Forbidden');
    
    if (isUnauthorized || isForbidden) {
      return (
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {isUnauthorized ? 'Authentication Required' : 'Access Denied'}
            </AlertTitle>
            <AlertDescription className="mt-2">
              {isUnauthorized 
                ? 'Please log in to access this dashboard.'
                : 'You don\'t have permission to access this dashboard.'}
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => isUnauthorized ? navigate('/login') : navigate('/dashboard')}
                  className="mt-2"
                >
                  {isUnauthorized ? 'Go to Login' : 'Back to Dashboard'}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Data</AlertTitle>
          <AlertDescription className="mt-2">
            {error.message || 'Failed to load customer insights. Please try again.'}
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => refetch()}
                className="mt-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show loading state
  if (loading || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  // Format the generatedAt timestamp
  const formattedDate = data.generatedAt 
    ? format(new Date(data.generatedAt), 'PPpp')
    : 'Unknown';
  const decisionGeneratedAt = decisionData?.generatedAt
    ? format(new Date(decisionData.generatedAt), 'PPpp')
    : null;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bank Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Last updated: {formattedDate}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => {
            refetch();
            refetchCustomers();
            refetchDecision();
          }}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'portfolio' | 'customer' | 'overview')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="customer">Customer Detail</TabsTrigger>
          <TabsTrigger value="overview">Bank Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer portfolio triage</CardTitle>
              <CardDescription>
                Select who to review next, then open the full decision view.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {bookSummary ? (
                <div className="rounded-lg border border-primary/25 bg-muted/30 p-4 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Queue snapshot</p>
                      <p className="text-xs text-muted-foreground">{bookSummaryScopeCaption(bookSummary)}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {bookSummary.mode === 'ranked' ? 'Ranked' : 'Legacy'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{bookSummaryScopeFootnote(bookSummary)}</p>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(queueBucketLabel) as FiQueueBucket[]).map((bucket) => (
                      <Badge key={bucket} variant="outline" className={queueBucketBadgeClass(bucket)}>
                        {queueBucketLabel[bucket]}: {bookSummary.countsByQueueBucket?.[bucket] ?? 0}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {READINESS_TIER_ORDER.map((tier) => (
                      <Badge key={tier} variant="secondary">
                        {tier}: {bookSummary.countsByReadinessTier?.[tier] ?? 0}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    As of {bookSummary.asOf ? format(new Date(bookSummary.asOf), 'PPpp') : '—'} · Pool size{' '}
                    {bookSummary.candidatePoolSize} · This page {bookSummary.returnedCount} (limit {bookSummary.limit},
                    offset {bookSummary.offset})
                  </p>
                </div>
              ) : null}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <div className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">Queue rows (this page)</p>
                  <p className="text-lg font-semibold">{customers.length}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">Matching filters</p>
                  <p className="text-lg font-semibold">{portfolioRows.length}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">Selected customer</p>
                  <p className="text-sm font-medium truncate">{customerLabel}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">Customers with email</p>
                  <p className="text-lg font-semibold">{customers.filter((customer) => Boolean(customer.email)).length}</p>
                </div>
              </div>
              <div className="rounded-md border p-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Find any customer (name or email)</p>
                <input
                  value={walkInInput}
                  onChange={(e) => setWalkInInput(e.target.value)}
                  placeholder="Type at least 2 characters (server ignores short queries)"
                  className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                />
                {walkInError ? (
                  <p className="text-xs text-destructive">{walkInError.message}</p>
                ) : null}
                {walkInLoading ? <Skeleton className="h-8 w-full" /> : null}
                {!walkInLoading &&
                walkInInput.replace(/[%_\\]/g, '').trim().length >= 2 &&
                walkInResults.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No matches — try another spelling.</p>
                ) : null}
                {walkInResults.length > 0 ? (
                  <ul className="max-h-40 space-y-1 overflow-y-auto rounded-md border p-2">
                    {walkInResults.map((row) => {
                      const label = row.displayName || row.email || row.userId;
                      return (
                        <li key={row.userId}>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto w-full justify-start px-2 py-1.5 text-left text-xs"
                            onClick={() => {
                              setWalkInPick({ userId: row.userId, label });
                              setSelectedCustomerId(row.userId);
                              setActiveTab('customer');
                            }}
                          >
                            <span className="font-medium">{label}</span>
                            {row.email ? <span className="ml-1 text-muted-foreground">· {row.email}</span> : null}
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
              <div className="grid grid-cols-1 gap-2 lg:grid-cols-4">
                <input
                  value={portfolioQuery}
                  onChange={(e) => setPortfolioQuery(e.target.value)}
                  placeholder="Search name, email or user ID"
                  className="h-9 rounded-md border bg-background px-3 text-sm lg:col-span-2"
                />
                <select
                  value={portfolioSort}
                  onChange={(e) =>
                    setPortfolioSort(e.target.value as 'queue-priority-desc' | 'selected-first' | 'name-asc' | 'name-desc')
                  }
                  className="h-9 rounded-md border bg-background px-2 text-sm"
                >
                  <option value="queue-priority-desc">Sort: Highest queue priority</option>
                  <option value="selected-first">Sort: Selected first</option>
                  <option value="name-asc">Sort: Name A-Z</option>
                  <option value="name-desc">Sort: Name Z-A</option>
                </select>
              </div>
              <div className="grid grid-cols-1 gap-2 lg:grid-cols-4">
                <input
                  value={portfolioCohortInput}
                  onChange={(e) => setPortfolioCohortInput(e.target.value)}
                  placeholder="Cohort filter: comma-separated userIds/emails"
                  className="h-9 rounded-md border bg-background px-3 text-sm lg:col-span-3"
                />
                <Button
                  type="button"
                  variant={hideNeedsData ? 'secondary' : 'outline'}
                  onClick={() => setHideNeedsData((prev) => !prev)}
                  className="h-9"
                >
                  {hideNeedsData ? 'Showing actionable only' : 'Hide Needs data'}
                </Button>
              </div>
              {!selectedInQueuePage && selectedCustomerId ? (
                <Alert>
                  <CircleAlert className="h-4 w-4" />
                  <AlertTitle>Customer outside this queue page</AlertTitle>
                  <AlertDescription>
                    The selected customer is not in the current ranked queue slice. Use walk-in search above or pick a
                    row below — detail still loads from fi-decision.
                  </AlertDescription>
                </Alert>
              ) : null}
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setPortfolioQuery('');
                    setPortfolioCohortInput('');
                    setHideNeedsData(false);
                    setPortfolioSort('queue-priority-desc');
                    setWalkInInput('');
                    setWalkInResults([]);
                    setWalkInPick(null);
                  }}
                  disabled={
                    !portfolioQuery &&
                    !portfolioCohortInput &&
                    !hideNeedsData &&
                    portfolioSort === 'queue-priority-desc' &&
                    !walkInInput
                  }
                >
                  Clear filters
                </Button>
              </div>
              {customersError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Unable to load customers</AlertTitle>
                  <AlertDescription>{customersError.message}</AlertDescription>
                </Alert>
              )}
              {customersLoading ? (
                <Skeleton className="h-28 w-full" />
              ) : customers.length === 0 ? (
                <Alert>
                  <CircleAlert className="h-4 w-4" />
                  <AlertTitle>No customers found</AlertTitle>
                  <AlertDescription>No bank customers are available for FI decision analysis yet.</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  <Accordion
                    type="multiple"
                    defaultValue={bucketGroups.slice(0, 2).map((group) => group.id)}
                    className="rounded-md border px-3"
                  >
                    {bucketGroups.map((group) => (
                      <AccordionItem key={group.id} value={group.id}>
                        <AccordionTrigger className="text-sm">
                          <span className="flex items-center gap-2">
                            {group.title}
                            <Badge variant="outline">{group.rows.length}</Badge>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2">
                          {group.rows.map((customer) => {
                            const isSelected = customer.userId === selectedCustomerId;
                            const customerTitle = customer.displayName || customer.email || customer.userId;
                            const bucket: PortfolioBucketGroup = customer.queueBucket ?? "QUEUE_PENDING";
                            return (
                              <div
                                key={customer.userId}
                                className={`flex flex-wrap items-center justify-between gap-3 rounded-md border px-3 py-2.5 ${isSelected ? 'border-primary bg-primary/5' : ''}`}
                              >
                                <div className="min-w-0 space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="max-w-[320px] truncate text-sm font-medium">{customerTitle}</p>
                                    <Badge
                                      variant="outline"
                                      className={
                                        bucket === "QUEUE_PENDING"
                                          ? "bg-muted text-muted-foreground border-border"
                                          : queueBucketBadgeClass(bucket)
                                      }
                                    >
                                      {bucket === "QUEUE_PENDING" ? "Queue pending" : queueBucketLabel[bucket]}
                                    </Badge>
                                    {isSelected ? <Badge variant="secondary">Selected</Badge> : null}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                    <span>{customer.email || 'No email'}</span>
                                    <span>•</span>
                                    <span className="font-mono">ID {customer.userId.slice(0, 8)}...</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {customer.queueReason
                                      ? `${customer.queueReason} · Priority ${customer.queuePriorityScore ?? 0}/100`
                                      : "Queue pending..."}
                                  </p>
                                  {customer.diagnostics && (
                                    <p className="text-[11px] text-muted-foreground">
                                      Tier {customer.diagnostics.readinessTier ?? "n/a"}
                                      {typeof customer.diagnostics.resolvedShare === "number"
                                        ? ` · Resolved ${asPercent(customer.diagnostics.resolvedShare)}`
                                        : ""}
                                      {typeof customer.diagnostics.debitRows === "number"
                                        ? ` · Debit rows ${customer.diagnostics.debitRows}`
                                        : ""}
                                      {customer.diagnostics.lastDebitDate
                                        ? ` · Last debit ${customer.diagnostics.lastDebitDate}`
                                        : ""}
                                      {customer.diagnostics.gateFailures?.length
                                        ? ` · Gates ${customer.diagnostics.gateFailures.join(", ")}`
                                        : ""}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant={isSelected ? 'secondary' : 'outline'}
                                    onClick={() => {
                                      setWalkInPick(null);
                                      setSelectedCustomerId(customer.userId);
                                      setActiveTab('customer');
                                    }}
                                  >
                                    Open detail
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  {!portfolioRows.length && (
                    <Alert>
                      <CircleAlert className="h-4 w-4" />
                      <AlertTitle>No matches</AlertTitle>
                      <AlertDescription>Try a different search term or clear filters.</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer" className="mt-4 space-y-4">
          <Card className="sticky top-2 z-10 border-primary/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">Selected customer</p>
                  <p className="truncate text-sm font-medium">{customerLabel}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Liquidity risk</p>
                  <p className="text-sm font-medium">
                    {decisionData?.risk?.liquidityRisk
                      ? `${decisionData.risk.liquidityRisk.band.toUpperCase()} (${asPercent(decisionData.risk.liquidityRisk.score)})`
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Stress risk</p>
                  <p className="text-sm font-medium">
                    {decisionData?.risk?.stressRisk
                      ? `${decisionData.risk.stressRisk.band.toUpperCase()} (${asPercent(decisionData.risk.stressRisk.score)})`
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Top priority action</p>
                  <p className="truncate text-sm font-medium">
                    {prioritizedActions[0]?.title || 'No action available'}
                  </p>
                </div>
              </div>
              {prioritizedActions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {prioritizedActions.slice(0, 2).map((action) => (
                    <Badge key={`${action.priority}-${action.title}-summary`} variant="outline">
                      P{action.priority} · {actionCategoryLabel[action.category]}
                    </Badge>
                  ))}
                  {decisionData?.offerSuppression?.crossSellSuppressed ? (
                    <Badge variant="destructive">Cross-sell suppressed</Badge>
                  ) : null}
                </div>
              )}
              {decisionData?.spendLocation ? (() => {
                const p = pickPrimarySpendLocationHypothesis(decisionData.spendLocation);
                if (!p) return null;
                return (
                  <p className="mt-3 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                    Spend signal:{' '}
                    <span className="font-medium text-foreground">{p.merchantFamily}</span>
                    {' · '}
                    {spendLocationBehaviorLabel(p.behaviorPattern)}
                    {' · '}
                    Strength {p.hypothesisConfidenceTier}
                  </p>
                );
              })() : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    FI Decision Intelligence
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Summary-first assistant for risk, affordability, intent and next-best actions.
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={openExplain} disabled={decisionLoading || explainLoading}>
                  {explainLoading ? 'Loading explanation...' : 'Explain this decision'}
                </Button>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <label htmlFor="fi-decision-customer" className="text-xs text-muted-foreground">
                    Customer
                  </label>
                  <select
                    id="fi-decision-customer"
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    disabled={customersLoading || customers.length === 0}
                    className="h-8 rounded-md border bg-background px-2 text-xs"
                  >
                    {customers.map((customer) => (
                      <option key={customer.userId} value={customer.userId}>
                        {customer.displayName || customer.email || customer.userId}
                      </option>
                    ))}
                  </select>
                  <Button size="sm" variant="ghost" onClick={() => setActiveTab('portfolio')}>
                    Back to portfolio
                  </Button>
                </div>
              </div>
              {decisionGeneratedAt && (
                <p className="text-xs text-muted-foreground">Decision generated at: {decisionGeneratedAt}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {decisionLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-32" />
                  <Skeleton className="h-32" />
                </div>
              )}

              {!decisionLoading && decisionError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>
                    {decisionError.message.includes('401') || decisionError.message.includes('Unauthorized')
                      ? 'Authentication required'
                      : 'Decision intelligence unavailable'}
                  </AlertTitle>
                  <AlertDescription>
                    {decisionError.message.includes('401') || decisionError.message.includes('Unauthorized')
                      ? 'This page is available to bank/admin roles only.'
                      : (decisionError.message || 'Unable to load decision insights right now.')}
                  </AlertDescription>
                </Alert>
              )}

              {!decisionLoading && !decisionError && decisionData && (
                <>
                  {hasPartialDecisionData && (
                    <Alert>
                      <CircleAlert className="h-4 w-4" />
                      <AlertTitle>Partial data mode</AlertTitle>
                      <AlertDescription>
                        Some upstream sources are unavailable, so this recommendation uses partial evidence.
                      </AlertDescription>
                    </Alert>
                  )}
                  {decisionData.offerSuppression?.crossSellSuppressed && (
                    <Alert>
                      <CircleAlert className="h-4 w-4" />
                      <AlertTitle>Cross-sell suppressed</AlertTitle>
                      <AlertDescription>
                        <p className="mb-2">Prioritise stabilisation and affordability; avoid aggressive cross-sell as primary CTA.</p>
                        {decisionData.offerSuppression.reasons?.length ? (
                          <ul className="list-inside list-disc text-sm">
                            {decisionData.offerSuppression.reasons.map((r) => (
                              <li key={r}>{r}</li>
                            ))}
                          </ul>
                        ) : null}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Card className="border-dashed">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Executive summary</CardTitle>
                      <CardDescription>
                        Fast answer layer for engagement, risk posture, and next best move.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm">{decisionData.executiveSummary}</p>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div className="rounded-md border p-3">
                          <p className="text-xs text-muted-foreground">Decision stance</p>
                          <p className="text-sm font-medium">
                            {decisionData.offerSuppression?.crossSellSuppressed ? 'Cautious engage' : 'Engage with next-best action'}
                          </p>
                        </div>
                        <div className="rounded-md border p-3">
                          <p className="text-xs text-muted-foreground">Top action</p>
                          <p className="text-sm font-medium">{prioritizedActions[0]?.title || 'No action available'}</p>
                        </div>
                        <div className="rounded-md border p-3">
                          <p className="text-xs text-muted-foreground">Key reason</p>
                          <p className="text-sm font-medium">
                            {decisionData.risk?.liquidityRisk?.reasons?.[0] ||
                              decisionData.risk?.stressRisk?.reasons?.[0] ||
                              'No primary rationale available'}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {decisionData.risk?.liquidityRisk ? (
                          <DecisionRiskCard title="Liquidity risk" risk={decisionData.risk.liquidityRisk} />
                        ) : null}
                        {decisionData.risk?.stressRisk ? (
                          <DecisionRiskCard title="Stress risk" risk={decisionData.risk.stressRisk} />
                        ) : null}
                        {!decisionData.risk?.liquidityRisk && !decisionData.risk?.stressRisk ? (
                          <p className="text-sm text-muted-foreground md:col-span-2">
                            Risk signals unavailable for this customer.
                          </p>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Decision console</CardTitle>
                      <CardDescription>
                        One-screen decision prompt for what to do now, why, and what to avoid.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <div className="rounded-md border p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-medium">Recommended next action</p>
                          <Badge variant="secondary">
                            {primaryAction ? `P${primaryAction.priority} · ${actionCategoryLabel[primaryAction.category]}` : 'No action'}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm font-medium">{primaryAction?.title ?? 'No action available'}</p>
                        {primaryAction?.rationale ? (
                          <p className="mt-1 text-muted-foreground">{primaryAction.rationale}</p>
                        ) : null}
                      </div>

                      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                        <div className="rounded-md border p-3">
                          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Why now</p>
                          <ul className="list-inside list-disc space-y-1 text-sm">
                            <li>
                              Liquidity{' '}
                              {decisionData.risk?.liquidityRisk
                                ? `${decisionData.risk.liquidityRisk.band.toUpperCase()} (${asPercent(decisionData.risk.liquidityRisk.score)})`
                                : '—'}
                            </li>
                            <li>
                              Stress{' '}
                              {decisionData.risk?.stressRisk
                                ? `${decisionData.risk.stressRisk.band.toUpperCase()} (${asPercent(decisionData.risk.stressRisk.score)})`
                                : '—'}
                            </li>
                            <li>
                              {decisionData.risk?.liquidityRisk?.reasons?.[0] ||
                                decisionData.risk?.stressRisk?.reasons?.[0] ||
                                'Primary rationale unavailable'}
                            </li>
                          </ul>
                        </div>
                        <div className="rounded-md border p-3">
                          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Risk caveat</p>
                          {decisionData.offerSuppression?.crossSellSuppressed ? (
                            <p className="text-sm text-muted-foreground">
                              Cross-sell should not be the primary CTA for this customer right now.
                            </p>
                          ) : hasPartialDecisionData ? (
                            <p className="text-sm text-muted-foreground">
                              Some source data is partial. Apply conservative outreach and verify missing context.
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">No hard suppression flag. Standard controls apply.</p>
                          )}
                        </div>
                      </div>

                      <div className="rounded-md border p-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Backup action</p>
                        <p className="mt-1 font-medium">{backupAction?.title ?? 'No backup action available'}</p>
                        {backupAction?.rationale ? (
                          <p className="mt-1 text-muted-foreground">{backupAction.rationale}</p>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>

                  <Accordion type="multiple" defaultValue={['act-now', 'opportunity-context']} className="rounded-lg border px-4">
                    <AccordionItem value="act-now">
                      <AccordionTrigger className="text-base">Act now</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">Action queue</CardTitle>
                            <CardDescription>
                              Cross-sell is deprioritised when risk is high, offers are suppressed, or policy caps activation.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {prioritizedActions.map((action) => (
                              <div
                                key={`${action.priority}-${action.title}`}
                                className={`rounded-md border p-3 ${action.category === 'cross_sell' && shouldDemoteCrossSell(decisionData) ? 'opacity-75' : ''}`}
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <p className="font-medium text-sm">
                                    P{action.priority} - {action.title}
                                  </p>
                                  <Badge variant="secondary">{actionCategoryLabel[action.category]}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{action.rationale}</p>
                                <details className="mt-2 rounded-md border p-2">
                                  <summary className="cursor-pointer text-xs font-medium">Why this action</summary>
                                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                                    <p>Category: {actionCategoryLabel[action.category]}</p>
                                    <p>
                                      Risk context: liquidity {decisionData.risk?.liquidityRisk?.band ?? '—'} / stress{' '}
                                      {decisionData.risk?.stressRisk?.band ?? '—'}
                                    </p>
                                    {action.category === 'cross_sell' && decisionData.offerSuppression?.crossSellSuppressed ? (
                                      <p>Suppression active: cross-sell should be secondary until stabilisation improves.</p>
                                    ) : null}
                                  </div>
                                </details>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="opportunity-context">
                      <AccordionTrigger className="text-base">Opportunity context</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        {decisionData.spendLocation ? (
                          <SpendLocationInsightCard
                            spendLocation={decisionData.spendLocation}
                            metadata={decisionData.decisionMetadata}
                          />
                        ) : null}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">Fit, activation & intent</CardTitle>
                            <CardDescription>
                              Product fit is suitability; activation reflects near-term next-best-action strength.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <DataSufficiencyAlert title="Propensity & intent" metric={decisionData.dataSufficiency?.propensity} />
                            <DataSufficiencyAlert title="Merchant propensity" metric={decisionData.dataSufficiency?.merchantPropensity} />
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Actionability now (activation) + suitability (fit)</p>
                              {mergedProductRows.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No product actionability or suitability signals yet.</p>
                              ) : (
                                mergedProductRows.slice(0, 3).map((item) => (
                                  <div
                                    key={item.productType}
                                    className={`rounded-md border p-2 text-sm ${item.suppressed ? 'opacity-85' : ''}`}
                                  >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <p className="font-medium">{item.productType}</p>
                                      <div className="flex flex-wrap gap-1">
                                        {typeof item.fitScore === "number" ? (
                                          <Badge variant="outline">Fit {asPercent(item.fitScore)}</Badge>
                                        ) : null}
                                        {typeof item.activationScore === "number" ? (
                                          <Badge variant="secondary">Act now {asPercent(item.activationScore)}</Badge>
                                        ) : null}
                                        {item.suppressed ? (
                                          <Badge variant="destructive">Suppressed</Badge>
                                        ) : null}
                                      </div>
                                    </div>
                                    <div className="mt-2">
                                      <Badge
                                        variant={
                                          item.suppressed
                                            ? "destructive"
                                            : (item.activationScore ?? 0) >= ACTIVATION_PITCH_READY_THRESHOLD
                                              ? "default"
                                              : "outline"
                                        }
                                      >
                                        {item.actionabilityLabel}
                                      </Badge>
                                    </div>
                                    {item.suppressed && item.suppressReasons.length ? (
                                      <p className="mt-1 text-xs text-muted-foreground">
                                        {item.suppressReasons.join(' · ')}
                                      </p>
                                    ) : null}
                                    {item.fitRationale ? (
                                      <details className="mt-2 rounded-md border p-2">
                                        <summary className="cursor-pointer text-xs font-medium">Suitability details</summary>
                                        <p className="mt-1 text-xs text-muted-foreground">{item.fitRationale}</p>
                                      </details>
                                    ) : null}
                                  </div>
                                ))
                              )}
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Merchant families</p>
                              {merchantRows.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No strong merchant propensity detected yet.</p>
                              ) : (
                                merchantRows.slice(0, 2).map((item, idx) => (
                                  <div key={item.merchantFamily} className="rounded-md border p-2 space-y-2">
                                    <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                                      <p className="font-medium">{idx + 1}. {item.merchantFamily}</p>
                                      <p className="text-muted-foreground">
                                        Intent {asPercent(item.intentScore ?? item.score)}
                                      </p>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      <Badge variant="outline">{merchantTrendLabel(item.trend30dPct)}</Badge>
                                      <Badge variant="outline">Recency {item.recency30d ?? 0}d</Badge>
                                      <Badge variant="outline">{merchantVolatilityLabel(item.volatility3mCv)}</Badge>
                                      <Badge variant="secondary">Confidence {asPercent(item.confidence ?? 0)}</Badge>
                                    </div>
                                    <MerchantSparkline series={item.monthlyShareSeries} />
                                    <p className="text-xs text-muted-foreground">{item.rationale}</p>
                                  </div>
                                ))
                              )}
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Intent signals</p>
                              {intentRows.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No strong intent signals at the moment.</p>
                              ) : (
                                intentRows.slice(0, 2).map((signal) => (
                                  <div key={`${signal.intentType}-${signal.message}`} className="flex items-start justify-between gap-3 text-sm">
                                    <p>{signal.message}</p>
                                    <Badge variant="outline">{signal.urgency}</Badge>
                                  </div>
                                ))
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="risk-checks">
                      <AccordionTrigger className="text-base">Risk & capacity checks</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <DataSufficiencyAlert title="Risk block" metric={decisionData.dataSufficiency?.risk} />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">Affordability</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                              <p>Commitment ratio: <span className="font-medium">{asPercent(decisionData.affordability.commitmentRatio)}</span></p>
                              <p>Safe installment capacity: <span className="font-medium">{asCurrency(decisionData.affordability.safeInstallmentCapacity)}</span></p>
                              <p>Remaining amount: <span className="font-medium">{asCurrency(decisionData.affordability.remainingAmount)}</span></p>
                              <p className="text-muted-foreground">{decisionData.affordability.recommendation}</p>
                            </CardContent>
                          </Card>
                          <LiquidityContextCard title="Liquidity context" context={decisionData.liquidityContext} />
                        </div>
                        {decisionData.behavioralWindows != null ? (
                          <>
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-base">Spend vs prior period</CardTitle>
                                <CardDescription>Behavioural windows from debit activity (when enrichment is available).</CardDescription>
                              </CardHeader>
                              <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {decisionData.behavioralWindows.last30VsPrior30 && (
                                  <BehavioralWindowStrip label="Last 30 vs prior 30 days" slice={decisionData.behavioralWindows.last30VsPrior30} />
                                )}
                                {decisionData.behavioralWindows.last90VsPrior90 && (
                                  <BehavioralWindowStrip label="Last 90 vs prior 90 days" slice={decisionData.behavioralWindows.last90VsPrior90} />
                                )}
                              </CardContent>
                            </Card>
                            <DataSufficiencyAlert title="Behavioral windows" metric={decisionData.dataSufficiency?.behavioral} />
                          </>
                        ) : decisionData.sourceStatus?.hasBehavioralEnrichment === false ? (
                          <Alert>
                            <CircleAlert className="h-4 w-4" />
                            <AlertTitle>Spend trajectory unavailable</AlertTitle>
                            <AlertDescription>
                              Insufficient transaction history or enrichment not available for period comparisons.
                            </AlertDescription>
                          </Alert>
                        ) : null}
                        <RiskBreakdownCard breakdown={decisionData.riskBreakdown} />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="audit-governance">
                      <AccordionTrigger className="text-base">Audit & governance</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <DecisionTraceabilityCard metadata={decisionData.decisionMetadata} />
                        <SuppressionAppliedCard rows={decisionData.suppressionApplied} title="Suppression rules applied" />
                        <GovernanceCoverageCard
                          merchantResolutionCoverage={decisionData.merchantResolutionCoverage}
                          unresolvedSpendShare={decisionData.unresolvedSpendShare}
                          familyCoverageMap={decisionData.familyCoverageMap}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="mt-4 space-y-6">
          <OverviewCards data={data} />

          <Card>
            <CardHeader>
              <CardTitle>Risk Profile Distribution</CardTitle>
              <CardDescription>
                Breakdown of customer risk profiles across your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RiskProfileChart data={data.riskProfiles} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FinancialHealthSection data={data.financialHealth} />
            <EngagementMetrics data={data.engagement} />
          </div>

          <InvestmentPreferences data={data.investmentPreferences} />
          <CustomerSegmentation data={data.customerSegments} />
        </TabsContent>
      </Tabs>

      <Sheet open={isExplainOpen} onOpenChange={setIsExplainOpen}>
        <SheetContent className="w-[95vw] sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Decision explainability</SheetTitle>
            <SheetDescription>
              Transparent rationale from <code>/api/v1/dashboard/customers/{'{customerId}'}/fi-decision/explain</code>.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4 text-sm">
            {explainLoading && <Skeleton className="h-40" />}
            {!explainLoading && explainError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Explain payload unavailable</AlertTitle>
                <AlertDescription>{explainError.message}</AlertDescription>
              </Alert>
            )}
            {!explainLoading && !explainError && explainData && (
              <>
                {explainData.generatedAt && (
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-base">Generated at</CardTitle></CardHeader>
                    <CardContent><p>{format(new Date(explainData.generatedAt), 'PPpp')}</p></CardContent>
                  </Card>
                )}
                <DecisionTraceabilityCard metadata={explainData.decisionMetadata} />
                <SuppressionAppliedCard rows={explainData.suppressionApplied} title="Suppression rules applied (explain)" />
                {explainData.riskDrivers && (
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-base">Risk rationale</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {explainData.riskDrivers.liquidity?.map((r) => <p key={`liq-${r}`}>- {r}</p>)}
                      {explainData.riskDrivers.stress?.map((r) => <p key={`stress-${r}`}>- {r}</p>)}
                    </CardContent>
                  </Card>
                )}
                <DataSufficiencyAlert title="Risk block" metric={explainData.dataSufficiency?.risk} />
                <RiskBreakdownCard breakdown={explainData.riskBreakdown} compact />
                {explainData.affordabilityDrivers && (
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-base">Affordability drivers</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {explainData.affordabilityDrivers.recommendation && (
                        <p>- {explainData.affordabilityDrivers.recommendation}</p>
                      )}
                      {typeof explainData.affordabilityDrivers.commitmentRatio === 'number' && (
                        <p>- Commitment ratio: {asPercent(explainData.affordabilityDrivers.commitmentRatio)}</p>
                      )}
                      {typeof explainData.affordabilityDrivers.safeInstallmentCapacity === 'number' && (
                        <p>- Safe installment capacity: {asCurrency(explainData.affordabilityDrivers.safeInstallmentCapacity)}</p>
                      )}
                    </CardContent>
                  </Card>
                )}
                <LiquidityContextCard title="Liquidity context (explain)" context={explainData.liquidityContext} />
                {explainProductFitRows.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-base">Product fit drivers</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {explainProductFitRows.map((item) => (
                        <p key={`${item.productType}-${item.rationale}`}>
                          - {item.productType}: fit {asPercent(item.fitScore)} — {item.rationale}
                        </p>
                      ))}
                    </CardContent>
                  </Card>
                )}
                {explainActivationRows.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-base">Activation drivers</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {explainActivationRows.map((item) => (
                        <p key={`${item.productType}-${item.rationale}-act`}>
                          - {item.productType}: activation {asPercent(item.activationScore)}
                          {item.suppressed ? ' (suppressed)' : ''} — {item.rationale}
                        </p>
                      ))}
                    </CardContent>
                  </Card>
                )}
                {explainData.behavioralWindows &&
                  (explainData.behavioralWindows.last30VsPrior30 || explainData.behavioralWindows.last90VsPrior90) && (
                  <>
                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-base">Behavioural windows (explain)</CardTitle></CardHeader>
                      <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {explainData.behavioralWindows.last30VsPrior30 && (
                          <BehavioralWindowStrip label="Last 30 vs prior 30" slice={explainData.behavioralWindows.last30VsPrior30} />
                        )}
                        {explainData.behavioralWindows.last90VsPrior90 && (
                          <BehavioralWindowStrip label="Last 90 vs prior 90" slice={explainData.behavioralWindows.last90VsPrior90} />
                        )}
                      </CardContent>
                    </Card>
                    <DataSufficiencyAlert title="Behavioral windows" metric={explainData.dataSufficiency?.behavioral} />
                  </>
                )}
                {explainData.offerSuppression?.crossSellSuppressed && (
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-base">Offer suppression (explain)</CardTitle></CardHeader>
                    <CardContent className="space-y-1">
                      {explainData.offerSuppression.reasons?.map((r) => <p key={r}>- {r}</p>)}
                    </CardContent>
                  </Card>
                )}
                {explainData.spendLocation ? (
                  <SpendLocationInsightCard
                    spendLocation={explainData.spendLocation}
                    metadata={explainData.decisionMetadata}
                    title="Spend location signal (explain)"
                  />
                ) : null}
                <GovernanceCoverageCard
                  merchantResolutionCoverage={explainData.merchantResolutionCoverage}
                  unresolvedSpendShare={explainData.unresolvedSpendShare}
                  familyCoverageMap={explainData.familyCoverageMap}
                />
                <DataSufficiencyAlert title="Propensity & intent" metric={explainData.dataSufficiency?.propensity} />
                <DataSufficiencyAlert title="Merchant propensity" metric={explainData.dataSufficiency?.merchantPropensity} />
                {explainData.merchantPropensityDrivers && explainData.merchantPropensityDrivers.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-base">Merchant propensity drivers</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {explainData.merchantPropensityDrivers.map((item) => (
                        <div key={`${item.merchantFamily}-${item.rationale}`} className="rounded-md border p-2">
                          <p className="text-sm">
                            {item.merchantFamily}: intent {asPercent(item.intentScore ?? item.score)} / confidence {asPercent(item.confidence ?? 0)}
                          </p>
                          <MerchantSparkline series={item.monthlyShareSeries} />
                          <p className="text-xs text-muted-foreground mt-1">{item.rationale}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
                {explainData.intentDrivers && explainData.intentDrivers.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-base">Intent drivers</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {explainData.intentDrivers.map((item) => (
                        <p key={`${item.intentType}-${item.message}`}>
                          - {item.intentType} ({item.urgency}): {item.message}
                        </p>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

// Wrap with error boundary
const BankAnalyticsDashboardWithBoundary: React.FC = () => (
  <RouteErrorBoundary routeName="Bank Analytics Dashboard" showFullPage={true}>
    <BankAnalyticsDashboard />
  </RouteErrorBoundary>
);

export default BankAnalyticsDashboardWithBoundary;

