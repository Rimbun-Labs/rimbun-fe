import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Baby,
  Building2,
  Car,
  FileText,
  Home,
  LayoutGrid,
  Phone,
  Plane,
  RefreshCw,
  ShoppingBag,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Target,
  TriangleAlert,
  UserCircle,
  Users,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  FiDemoBookPulse,
  FiDemoDecisionSupport,
  FiDemoFixture,
  FiDemoLead,
  FiDemoPulse,
  FiDemoTimelineMarker,
  FiDemoTxnRow,
} from "@/fixtures/fi-demo/types";
import { fiDemoBookPulseHelpText, fiDemoHelp, fiDemoPulseHelpText } from "./fi-demo-glossary";
import { FiDemoInfoHint } from "./FiDemoInfoHint";

const reviewTierBadgeClass = (tier: FiDemoDecisionSupport["reviewTier"]) => {
  switch (tier) {
    case "priority_credit_review":
      return "border-amber-500/60 bg-amber-500/15 text-amber-950 dark:text-amber-100";
    case "enhanced_due_diligence":
      return "border-orange-500/50 bg-orange-500/10 text-orange-950 dark:text-orange-100";
    case "standard":
    default:
      return "border-border bg-muted/80 text-foreground";
  }
};

function DecisionSupportPanel({
  support,
  variant = "card",
}: {
  support: FiDemoDecisionSupport;
  variant?: "card" | "embedded";
}) {
  const body = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground inline-flex items-center gap-1">
          Review tier
          <FiDemoInfoHint label="Review tier" text={fiDemoHelp.reviewTier} />
        </span>
        <Badge variant="outline" className={cn("text-xs font-medium", reviewTierBadgeClass(support.reviewTier))}>
          {support.reviewTierLabel}
        </Badge>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 inline-flex items-center gap-1">
          Reason codes
          <FiDemoInfoHint label="Reason codes" text={fiDemoHelp.reasonCodes} iconClassName="h-3 w-3" />
        </p>
        <div className="flex flex-wrap gap-1.5">
          {support.reasonCodes.map((code) => (
            <code
              key={code}
              className="rounded border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-mono text-foreground"
            >
              {code}
            </code>
          ))}
        </div>
      </div>
      <p className="text-sm text-foreground leading-relaxed border-l-2 border-violet-500/40 pl-3">
        {support.underwritingBridge}
      </p>
      <p className="text-[10px] text-muted-foreground">
        Not a credit approval. Production merges behavior signals with bureau, application, income proof, and policy
        engines; this panel shows how behavior informs <strong className="text-foreground">routing and narrative</strong>{" "}
        for underwriting.
      </p>
    </>
  );

  if (variant === "embedded") {
    return (
      <div className="rounded-lg border border-violet-500/25 bg-violet-500/[0.06] p-4 space-y-3">{body}</div>
    );
  }

  return (
    <Card className="border-violet-500/30 bg-violet-500/[0.04] shadow-sm">
      <CardHeader className="pb-2 space-y-1">
        <CardTitle className="text-base flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
          <span className="inline-flex items-center gap-1.5">
            Decision support
            <FiDemoInfoHint label="Decision support" text={fiDemoHelp.decisionSupportTitle} />
          </span>
        </CardTitle>
        <CardDescription className="text-xs">
          Behavior-informed review tier and reason codes for routing and outreach.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">{body}</CardContent>
    </Card>
  );
}

/** Month-over-month delta → bar colors (not credit health — trajectory only). */
function momentumMomTone(delta: number | null): { track: string; fill: string } {
  if (delta === null) {
    return {
      track: "bg-slate-200/70 dark:bg-slate-700/45",
      fill: "bg-slate-500 dark:bg-slate-400",
    };
  }
  if (delta > 0.5) {
    return {
      track: "bg-emerald-500/20 dark:bg-emerald-500/15",
      fill: "bg-emerald-600 dark:bg-emerald-500",
    };
  }
  if (delta < -0.5) {
    return {
      track: "bg-amber-500/25 dark:bg-amber-500/15",
      fill: "bg-amber-600 dark:bg-amber-500",
    };
  }
  return {
    track: "bg-slate-200/50 dark:bg-slate-700/35",
    fill: "bg-slate-400 dark:bg-slate-500",
  };
}

function HealthMomentumMiniChart({ points }: { points: FiDemoLead["healthMomentum"] }) {
  const max = Math.max(...points.map((p) => p.score), 100);
  const first = points[0]?.score ?? 0;
  const last = points[points.length - 1]?.score ?? 0;
  const netDelta = last - first;
  const netLabel =
    netDelta > 0.5 ? "Net: improving" : netDelta < -0.5 ? "Net: softening" : "Net: flat";
  const netClass =
    netDelta > 0.5
      ? "text-emerald-700 dark:text-emerald-400"
      : netDelta < -0.5
        ? "text-amber-700 dark:text-amber-400"
        : "text-muted-foreground";

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        <span>
          MoM bars:{" "}
          <span className="text-emerald-700 dark:text-emerald-400">up</span>
          {" · "}
          <span className="text-amber-700 dark:text-amber-400">down</span>
          {" · "}
          <span className="text-slate-600 dark:text-slate-400">flat</span>
        </span>
      </div>
      <div className="flex items-end gap-2 h-28">
        {points.map((p, i) => {
          const momDelta = i === 0 ? null : p.score - points[i - 1].score;
          const { track, fill } = momentumMomTone(momDelta);
          return (
            <div key={`${p.monthLabel}-${i}`} className="flex-1 min-w-0 h-full flex flex-col items-center">
              <div className={cn("w-full flex-1 rounded-sm relative overflow-hidden", track)}>
                <div
                  className={cn("absolute inset-x-0 bottom-0 rounded-sm", fill)}
                  style={{ height: `${(p.score / max) * 100}%` }}
                />
              </div>
              <span className="mt-1 text-[10px] text-muted-foreground tabular-nums">{p.monthLabel}</span>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[11px] text-muted-foreground">
          Latest index:{" "}
          <strong className="text-foreground tabular-nums">{points[points.length - 1]?.score ?? "-"}</strong> / 100
        </p>
        <p className={cn("text-[11px] font-medium tabular-nums", netClass)}>
          {netLabel}{" "}
          <span className="font-semibold">
            ({netDelta > 0 ? "+" : ""}
            {netDelta.toFixed(0)} pts vs. start)
          </span>
        </p>
      </div>
    </div>
  );
}

function recommendationConfidenceBadgeClass(band: FiDemoLead["productRecommendation"]["confidenceBand"]) {
  switch (band) {
    case "high":
      return "border-emerald-500/60 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200";
    case "medium":
      return "border-amber-500/60 bg-amber-500/10 text-amber-900 dark:text-amber-200";
    case "low":
    default:
      return "border-slate-400/60 bg-slate-500/10 text-slate-900 dark:text-slate-200";
  }
}

function LogicEvidenceBody({ lead }: { lead: FiDemoLead }) {
  return (
    <div className="space-y-6 mt-6">
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 inline-flex items-center gap-1">
          Rule lineage
          <FiDemoInfoHint label="Logic evidence" text={fiDemoHelp.logicEvidence} iconClassName="h-3 w-3" />
        </h4>
        <div className="space-y-3">
          {lead.logicEvidence.rules.map((rule) => (
            <div key={rule.code} className="rounded-lg border border-border bg-muted/20 p-3 space-y-1.5">
              <p className="text-[11px] font-mono text-primary">{rule.code}</p>
              <code className="text-[11px] text-foreground block">{rule.expression}</code>
              <p className="text-xs text-muted-foreground">{rule.plainEnglish}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          Trigger transactions
        </h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Merchant string</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Avg (6m)</TableHead>
              <TableHead className="text-right">Days ago</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lead.logicEvidence.triggerTransactions.map((row: FiDemoTxnRow, idx) => (
              <TableRow key={`${row.category}-${idx}`}>
                <TableCell>{row.category}</TableCell>
                <TableCell className="font-mono text-xs">{row.merchantHint ?? "n/a"}</TableCell>
                <TableCell className="text-right tabular-nums">${row.amount.toLocaleString()}</TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">${row.categoryAverage6m.toLocaleString()}</TableCell>
                <TableCell className="text-right">{row.daysAgo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function CustomerSnapshotBody({ lead, privacyMode }: { lead: FiDemoLead; privacyMode: boolean }) {
  const ps = pulseStyles(lead.pulse);
  const anomalyCount = lead.transactions.filter((t) => t.isAnomaly).length;

  return (
    <div className="space-y-6 px-1 pb-2">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <UserCircle className="h-7 w-7" />
        </div>
        <div className="min-w-0 space-y-1">
          <p
            className={cn(
              "font-mono text-sm font-semibold text-foreground",
              privacyMode && "blur-[4px] select-none"
            )}
          >
            {privacyMode ? "••••••••" : lead.pseudonymKey}
          </p>
          <p className="text-xs text-muted-foreground">Fixture lead id: {lead.id}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center gap-1">
              <Badge variant="outline" className={cn("text-[10px]", ps.border, ps.bg)}>
                {ps.label}
              </Badge>
              <FiDemoInfoHint label={ps.label} text={fiDemoPulseHelpText(lead.pulse)} iconClassName="h-3 w-3" />
            </span>
            <span className="inline-flex items-center gap-1">
              <Badge variant="secondary">{lead.archetypeTag}</Badge>
              <FiDemoInfoHint label="Archetype" text={fiDemoHelp.archetypeBadge} iconClassName="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">At a glance</h4>
        <p
          className={cn(
            "text-sm text-foreground leading-relaxed",
            privacyMode && "blur-[2px] select-none"
          )}
        >
          {lead.oneLiner}
        </p>
      </div>

      <Separator />

      <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <dt className="text-xs text-muted-foreground flex items-center gap-1">
            Modeled propensity
            <FiDemoInfoHint label="Modeled propensity" text={fiDemoHelp.dtPropensity} iconClassName="h-3 w-3" />
          </dt>
          <dd className="font-semibold tabular-nums">{lead.propensityScore.toFixed(2)}</dd>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <dt className="text-xs text-muted-foreground flex items-center gap-1">
            Facility / balance
            <FiDemoInfoHint label="Facility / balance" text={fiDemoHelp.dtFacilityBalance} iconClassName="h-3 w-3" />
          </dt>
          <dd className={cn("font-semibold tabular-nums", privacyMode && "blur-sm")}>
            {privacyMode ? "••••••" : `$${lead.loanBalance.toLocaleString()}`}
          </dd>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <dt className="text-xs text-muted-foreground flex items-center gap-1">
            Priority score (× balance)
            <FiDemoInfoHint label="Priority score" text={fiDemoHelp.dtPriorityScore} iconClassName="h-3 w-3" />
          </dt>
          <dd className={cn("font-semibold tabular-nums", privacyMode && "blur-sm")}>
            {privacyMode ? "•••••" : lead.priorityScore.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </dd>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <dt className="text-xs text-muted-foreground flex items-center gap-1">
            Merchant cluster
            <FiDemoInfoHint label="Merchant cluster" text={fiDemoHelp.dtMerchantCluster} iconClassName="h-3 w-3" />
          </dt>
          <dd className="font-mono text-xs font-medium break-all">{lead.merchantClusterId}</dd>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-3 sm:col-span-2">
          <dt className="text-xs text-muted-foreground flex items-center gap-1">
            Liquidity (demo)
            <FiDemoInfoHint label="Liquidity" text={fiDemoHelp.dtLiquidityDemo} iconClassName="h-3 w-3" />
          </dt>
          <dd className="text-sm">
            ~{lead.liquidity.daysOfRunway} days runway · burn{" "}
            {privacyMode ? "••••" : `$${lead.liquidity.burnRateCurrent.toLocaleString()}`} vs avg{" "}
            {privacyMode ? "••••" : `$${lead.liquidity.burnRate6mAvg.toLocaleString()}`}
            {lead.liquidity.showLiquidityCrunchWarning && (
              <Badge variant="destructive" className="ml-2 text-[10px]">
                Stress flag
              </Badge>
            )}
          </dd>
        </div>
      </dl>

      <Separator />

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 inline-flex items-center gap-1">
          Decision support
          <FiDemoInfoHint label="Decision support" text={fiDemoHelp.decisionSupportTitle} iconClassName="h-3 w-3" />
        </h4>
        <DecisionSupportPanel support={lead.decisionSupport} variant="embedded" />
      </div>

      <Separator />

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 inline-flex items-center gap-1">
          Supporting indicators
          <FiDemoInfoHint label="Supporting indicators" text={fiDemoHelp.supportingIndicators} iconClassName="h-3 w-3" />
        </h4>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          {lead.supportingIndicators.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>

      <Separator />

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          Recent behavior clusters
        </h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {lead.timeline.map((m, i) => (
            <li key={`${m.daysAgo}-${i}`} className="flex gap-2">
              <span className="font-mono text-xs text-foreground/80 shrink-0">{m.daysAgo}d</span>
              <span>{m.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          Category signals
        </h4>
        <p className="text-sm text-muted-foreground">
          {anomalyCount} row{anomalyCount === 1 ? "" : "s"} flagged &gt;2× category average.
        </p>
      </div>

      {lead.snapshotHighlights && lead.snapshotHighlights.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Notes
            </h4>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {lead.snapshotHighlights.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        </>
      )}

      <p className="text-[11px] text-muted-foreground border-t border-border pt-4">
        Sample customer snapshot for this preview.
      </p>
    </div>
  );
}

const timelineIcon = (m: FiDemoTimelineMarker) => {
  const cls = "h-5 w-5";
  switch (m.iconKey) {
    case "baby":
      return <Baby className={cls} />;
    case "hospital":
      return <Building2 className={cls} />;
    case "plane":
      return <Plane className={cls} />;
    case "shopping":
      return <ShoppingBag className={cls} />;
    case "home":
      return <Home className={cls} />;
    case "car":
      return <Car className={cls} />;
    default:
      return <Target className={cls} />;
  }
};

const pulseStyles = (pulse: FiDemoPulse) => {
  switch (pulse) {
    case "imminent_risk":
      return {
        border: "border-red-500/50",
        bg: "bg-red-500/10",
        dot: "bg-red-500",
        label: "Imminent risk",
      };
    case "high_value_upsell":
      return {
        border: "border-amber-500/50",
        bg: "bg-amber-500/10",
        dot: "bg-amber-500",
        label: "High-value upsell",
      };
    case "watch":
    default:
      return {
        border: "border-sky-500/45",
        bg: "bg-sky-500/10",
        dot: "bg-sky-500",
        label: "Watch",
      };
  }
};

/** Short “what to do next” line for the working-on bar */
const nextActionHint = (pulse: FiDemoPulse): string => {
  switch (pulse) {
    case "imminent_risk":
      return "Prioritize liquidity / restructure outreach while stress is early.";
    case "high_value_upsell":
      return "Lead with a structured offer conversation (e.g. home / life-stage).";
    case "watch":
    default:
      return "Light touch or cross-sell aligned to recent spend pattern.";
  }
};

const bookPulseLabel = (p: FiDemoBookPulse) => {
  switch (p) {
    case "imminent_risk":
      return "Imminent risk";
    case "high_value_upsell":
      return "High-value upsell";
    case "watch":
      return "Watch";
    case "neutral":
      return "No active queue pulse";
    default:
      return p;
  }
};

const bookPulseBarClass = (p: FiDemoBookPulse) => {
  switch (p) {
    case "imminent_risk":
      return "[&>div]:bg-red-500";
    case "high_value_upsell":
      return "[&>div]:bg-amber-500";
    case "watch":
      return "[&>div]:bg-sky-500";
    case "neutral":
    default:
      return "[&>div]:bg-muted-foreground/50";
  }
};

export interface FiDemoConsoleProps {
  data: FiDemoFixture;
}

export const FiDemoConsole: React.FC<FiDemoConsoleProps> = ({ data }) => {
  const { meta, leads, portfolio } = data;
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<"portfolio" | "leads">(() => {
    const q = searchParams.get("lead");
    const t = searchParams.get("tab");
    if (t === "portfolio" || t === "leads") return t;
    if (q && leads.some((l) => l.id === q)) return "leads";
    return "portfolio";
  });

  const [selectedId, setSelectedId] = useState(() => {
    const q = searchParams.get("lead");
    return q && leads.some((l) => l.id === q) ? q : leads[0]?.id ?? "";
  });

  const [privacyMode, setPrivacyMode] = useState(false);
  const [scriptOpen, setScriptOpen] = useState(false);
  const [snapshotOpen, setSnapshotOpen] = useState(false);
  const [logicOpen, setLogicOpen] = useState(false);

  const selectLead = useCallback(
    (id: string) => {
      if (!leads.some((l) => l.id === id)) return;
      setSelectedId(id);
      setActiveTab("leads");
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("lead", id);
          next.set("tab", "leads");
          return next;
        },
        { replace: true }
      );
    },
    [leads, setSearchParams]
  );

  const openCustomerSnapshot = useCallback(
    (id: string) => {
      if (!leads.some((l) => l.id === id)) return;
      setScriptOpen(false);
      selectLead(id);
      setSnapshotOpen(true);
    },
    [leads, selectLead]
  );

  const setTab = useCallback(
    (next: "portfolio" | "leads") => {
      setActiveTab(next);
      setSearchParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          p.set("tab", next);
          return p;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  useEffect(() => {
    const q = searchParams.get("lead");
    const t = searchParams.get("tab");
    if (q && leads.some((l) => l.id === q)) setSelectedId(q);
    if (t === "portfolio" || t === "leads") setActiveTab(t);
    else if (q && leads.some((l) => l.id === q)) setActiveTab("leads");
  }, [searchParams, leads]);

  const selected = useMemo(
    () => (leads.length ? leads.find((l) => l.id === selectedId) ?? leads[0] : undefined),
    [leads, selectedId]
  );

  const runwayPct = selected
    ? Math.min(100, Math.round((selected.liquidity.daysOfRunway / 120) * 100))
    : 0;
  const burnDelta =
    selected && selected.liquidity.burnRate6mAvg > 0
      ? ((selected.liquidity.burnRateCurrent - selected.liquidity.burnRate6mAvg) /
          selected.liquidity.burnRate6mAvg) *
        100
      : 0;

  const fmtNum = (n: number) => (privacyMode ? "•••••" : n.toLocaleString());

  if (!portfolio) return null;

  return (
    <TooltipProvider delayDuration={200}>
    <div className="w-full max-w-6xl mx-auto rounded-2xl border border-border shadow-2xl overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-4 md:p-5 border-b border-border">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg text-foreground">Workspace preview</h2>
              <p className="text-sm text-muted-foreground">
                {meta.scenarioName} · As of {meta.asOf} · Portfolio view + sample leads
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background/80 px-3 py-2">
            <Switch
              id="privacy-mode"
              checked={privacyMode}
              onCheckedChange={setPrivacyMode}
              aria-label="Privacy mode"
            />
            <div className="flex items-center gap-1">
              <Label htmlFor="privacy-mode" className="text-sm cursor-pointer">
                Privacy mode
              </Label>
              <FiDemoInfoHint label="Privacy mode" text={fiDemoHelp.privacyMode} iconClassName="h-3 w-3" />
            </div>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Blurs identifiers; keeps behavioral cues
            </span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setTab(v as "portfolio" | "leads")} className="w-full">
        <div className="px-4 md:px-6 pt-4 border-b border-border/60 bg-muted/10">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0 md:w-auto md:bg-muted/80 md:p-1">
            <TabsTrigger value="portfolio" className="gap-1.5 data-[state=active]:bg-background">
              <LayoutGrid className="h-3.5 w-3.5" />
              Portfolio overview
            </TabsTrigger>
            <TabsTrigger value="leads" className="gap-1.5 data-[state=active]:bg-background">
              <Users className="h-3.5 w-3.5" />
              Lead workspace
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="portfolio" className="p-4 md:p-6 space-y-6 mt-0">
          <p className="text-sm text-muted-foreground max-w-3xl">
            <span className="inline-flex items-center gap-1.5">
              <FiDemoInfoHint label="Portfolio overview" text={fiDemoHelp.portfolioOverviewTab} />
            </span>{" "}
            Aggregated view of this book — use it to size segments, spot pulse mix, and brief
            product teams on bundle angles.{" "}
            <span className="block mt-2 text-xs">
              Tip for live demos: append{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">
                {`?lead=lead_002&tab=leads`}
              </code>{" "}
              (or use <strong className="text-foreground">Open</strong> below). Stay on portfolio with a preselected story:{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">
                {`?lead=lead_002&tab=portfolio`}
              </code>
              .
            </span>
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {(
              [
                {
                  label: "Customers in book",
                  value: fmtNum(portfolio.kpis.customersInBook),
                  help: fiDemoHelp.kpiCustomersInBook,
                },
                {
                  label: "With modeled signals",
                  value: fmtNum(portfolio.kpis.customersWithModeledSignals),
                  help: fiDemoHelp.kpiWithModeledSignals,
                },
                {
                  label: "Queue depth (modeled)",
                  value: fmtNum(portfolio.kpis.activeQueueDepth),
                  help: fiDemoHelp.kpiQueueDepth,
                },
                {
                  label: "Avg propensity (modeled)",
                  value: privacyMode ? "•••" : portfolio.kpis.avgPropensityModeled.toFixed(2),
                  help: fiDemoHelp.kpiAvgPropensity,
                },
                {
                  label: "Liquidity stress (approx.)",
                  value: fmtNum(portfolio.kpis.liquidityStressApprox),
                  help: fiDemoHelp.kpiLiquidityStress,
                },
              ] as const
            ).map((k) => (
              <Card key={k.label}>
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-muted-foreground inline-flex items-center gap-1 flex-wrap">
                    {k.label}
                    <FiDemoInfoHint label={k.label} text={k.help} iconClassName="h-3 w-3" />
                  </p>
                  <p className="text-xl font-bold mt-1 tabular-nums">{k.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base inline-flex items-center gap-1.5">
                  Archetype mix
                  <FiDemoInfoHint label="Archetype mix" text={fiDemoHelp.sectionArchetypeMix} />
                </CardTitle>
                <CardDescription className="text-xs">Share of book by modeled archetype</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {portfolio.archetypes.map((row) => (
                  <div key={row.archetype} className="flex items-center gap-2">
                    <div className="w-36 sm:w-44 shrink-0">
                      <span className="text-xs text-muted-foreground leading-tight block">{row.archetype}</span>
                    </div>
                    <Progress value={row.pct} className={cn("h-2 flex-1", "[&>div]:bg-primary")} />
                    <span className="text-xs font-medium w-20 text-right tabular-nums shrink-0">
                      {row.pct}% · {privacyMode ? "••••" : row.count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base inline-flex items-center gap-1.5">
                  Priority pulse (book)
                  <FiDemoInfoHint label="Priority pulse (book)" text={fiDemoHelp.sectionPriorityPulseBook} />
                </CardTitle>
                <CardDescription className="text-xs">Where the modeled queue is pulling attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {portfolio.pulses.map((row) => (
                  <div key={row.pulse} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-36 sm:w-44 shrink-0 leading-tight inline-flex items-center gap-1">
                      {bookPulseLabel(row.pulse)}
                      <FiDemoInfoHint
                        label={bookPulseLabel(row.pulse)}
                        text={fiDemoBookPulseHelpText(row.pulse)}
                        iconClassName="h-3 w-3"
                      />
                    </span>
                    <Progress value={row.pct} className={cn("h-2 flex-1", bookPulseBarClass(row.pulse))} />
                    <span className="text-xs font-medium w-20 text-right tabular-nums">
                      {row.pct}% · {privacyMode ? "••••" : row.count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base inline-flex items-center gap-1.5">
                Product construction hints
                <FiDemoInfoHint label="Product construction hints" text={fiDemoHelp.sectionProductHints} />
              </CardTitle>
              <CardDescription className="text-xs">
                Themes derived from archetype + cluster mix — for campaigns and proposition design (not live pricing).
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Theme</TableHead>
                    <TableHead>
                      <div className="inline-flex items-center gap-1">
                        Primary archetype
                        <FiDemoInfoHint label="Primary archetype" text={fiDemoHelp.archetypeBadge} iconClassName="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">
                      <div className="inline-flex items-center justify-end gap-1 ml-auto">
                        Book share
                        <FiDemoInfoHint label="Book share" text={fiDemoHelp.bookShare} iconClassName="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[200px]">Product angle</TableHead>
                    <TableHead className="text-right w-[140px] whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1 ml-auto">
                        Jump to lead
                        <FiDemoInfoHint label="Jump to lead" text={fiDemoHelp.jumpToLead} iconClassName="h-3 w-3" />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolio.productThemes.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.theme}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{row.primaryArchetype}</Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{row.bookSharePct}%</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{row.productAngle}</TableCell>
                      <TableCell className="text-right">
                        {row.sampleLeadId ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1"
                            onClick={() => selectLead(row.sampleLeadId!)}
                          >
                            Open
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">No sample in demo</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="p-4 md:p-6 mt-0">
          {!selected ? (
            <p className="text-sm text-muted-foreground">No sample leads available.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Narrow triage rail — pick one customer; detail is always on the right */}
              <div className="lg:col-span-4 space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 flex-wrap">
                    <Target className="h-4 w-4 text-primary" />
                    Today&apos;s outreach
                    <FiDemoInfoHint label="Today's outreach" text={fiDemoHelp.todaysOutreach} />
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Triage only — ranked by modeled priority. One row is{" "}
                    <strong className="text-foreground">selected</strong>; engagement context loads on the right. Deep
                    link:{" "}
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">?lead=lead_002</code>
                  </p>
                </div>
                <ul className="space-y-2" aria-label="Ranked outreach list">
                  {leads.map((lead) => {
                    const ps = pulseStyles(lead.pulse);
                    const active = lead.id === selected.id;
                    return (
                      <li key={lead.id}>
                        <div
                          role="button"
                          tabIndex={0}
                          className={cn(
                            "rounded-lg border p-2.5 text-left transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            active
                              ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/30"
                              : "border-border bg-muted/20 hover:bg-muted/40"
                          )}
                          onClick={() => selectLead(lead.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              selectLead(lead.id);
                            }
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", ps.dot)} aria-hidden />
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                <span
                                  className={cn(
                                    "font-mono text-xs font-semibold text-foreground",
                                    privacyMode && "blur-[3px]"
                                  )}
                                >
                                  {privacyMode ? "••••••••" : lead.pseudonymKey}
                                </span>
                                <span className="inline-flex items-center gap-0.5">
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                                    {ps.label}
                                  </Badge>
                                  <FiDemoInfoHint
                                    label={ps.label}
                                    text={fiDemoPulseHelpText(lead.pulse)}
                                    stopPropagation
                                    iconClassName="h-3 w-3"
                                  />
                                </span>
                                <span className="inline-flex items-center gap-0.5">
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                                    {lead.archetypeTag}
                                  </Badge>
                                  <FiDemoInfoHint
                                    label="Archetype"
                                    text={fiDemoHelp.archetypeBadge}
                                    stopPropagation
                                    iconClassName="h-3 w-3"
                                  />
                                </span>
                              </div>
                              <p
                                className={cn(
                                  "line-clamp-2 text-[11px] leading-snug text-muted-foreground",
                                  privacyMode && "blur-[2px] select-none"
                                )}
                              >
                                {lead.oneLiner}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="mt-2 h-7 w-full text-[11px] text-primary hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              openCustomerSnapshot(lead.id);
                            }}
                          >
                            <UserCircle className="h-3.5 w-3.5 mr-1.5" />
                            Customer snapshot
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="lg:col-span-8 space-y-5 min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground inline-flex items-center gap-1 flex-wrap">
                  Engagement context — selected customer
                  <FiDemoInfoHint
                    label="Engagement context"
                    text={fiDemoHelp.engagementAndLeadWorkspace}
                    iconClassName="h-3 w-3"
                  />
                </p>

                {/* Unambiguous “who am I working on?” */}
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-primary/10 to-background p-4 shadow-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary inline-flex items-center gap-1">
                    Working on
                    <FiDemoInfoHint label="Working on" text={fiDemoHelp.workingOn} iconClassName="h-3 w-3" />
                  </p>
                  <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "font-mono text-lg font-semibold text-foreground truncate",
                          privacyMode && "blur-[4px] select-none"
                        )}
                      >
                        {privacyMode ? "••••••••" : selected.pseudonymKey}
                      </p>
                      <p className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="inline-flex items-center gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {selected.archetypeTag}
                          </Badge>
                          <FiDemoInfoHint label="Archetype" text={fiDemoHelp.archetypeBadge} iconClassName="h-3 w-3" />
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-normal">
                          {pulseStyles(selected.pulse).label}
                          <FiDemoInfoHint
                            label={pulseStyles(selected.pulse).label}
                            text={fiDemoPulseHelpText(selected.pulse)}
                            iconClassName="h-3 w-3"
                          />
                        </span>
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="shrink-0 gap-1.5"
                      onClick={() => openCustomerSnapshot(selected.id)}
                    >
                      <UserCircle className="h-4 w-4" />
                      Open snapshot
                    </Button>
                  </div>
                  <p className="mt-3 text-sm text-foreground leading-snug border-t border-primary/15 pt-3">
                    <span className="font-medium text-primary">Suggested next step: </span>
                    {nextActionHint(selected.pulse)}
                  </p>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Need the full customer view? Use <strong className="text-foreground">Open snapshot</strong> — the
                    cards below are supporting context for the conversation.
                  </p>
                </div>

                <div className="space-y-2">
                  <DecisionSupportPanel support={selected.decisionSupport} />
                  <div className="flex justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={() => setLogicOpen(true)}>
                      View evidence
                    </Button>
                  </div>
                </div>

                <p className="text-[11px] uppercase tracking-wide text-muted-foreground border-t border-border/60 pt-3">
                  Decision-support stack: trajectory → context → action → fit
                </p>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base inline-flex items-center gap-1.5">
                      Health momentum chart
                      <FiDemoInfoHint label="Health momentum" text={fiDemoHelp.healthMomentum} />
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Synthetic 0–100 behavioral momentum over six months — trajectory, not a credit score. How to read
                      level, month-to-month change, and overall trend below.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Collapsible defaultOpen className="group rounded-lg border border-border/70 bg-muted/25">
                      <CollapsibleTrigger
                        type="button"
                        className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left outline-none transition-colors hover:bg-muted/35 focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="text-xs font-semibold text-foreground">How to read this chart</span>
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="border-t border-border/60 px-3 pb-3 pt-1 data-[state=closed]:border-t-0">
                        <div className="text-[11px] text-muted-foreground leading-relaxed space-y-2 pt-1">
                          <p>
                            <span className="font-semibold text-foreground">What is health momentum?</span> A{" "}
                            <strong className="text-foreground">0–100 behavioral momentum index</strong> for
                            this preview. It summarizes how{" "}
                            <strong className="text-foreground">consistent, supportive</strong> patterns in cashflow and
                            spend behavior look <strong className="text-foreground">over time</strong> — as a trajectory,
                            not a snapshot. It is <strong className="text-foreground">not</strong> a credit score, bureau
                            outcome, or medical meaning.
                          </p>
                          <p>
                            <span className="font-semibold text-foreground">How to read the chart</span> —{" "}
                            <strong className="text-foreground">Bar height</strong> = the index that month (higher generally
                            means patterns look{" "}
                            <strong className="text-foreground">more supportive / opportunity-rich</strong> in the model
                            story; lower means <strong className="text-foreground">more pressured / less supportive</strong>
                            ). <strong className="text-foreground">Bar color</strong> ={" "}
                            <strong className="text-foreground">month-over-month change</strong> in the index (green: up
                            vs. prior month; amber: down; gray: flat). The{" "}
                            <strong className="text-foreground">first month</strong> is the baseline for this window.
                          </p>
                          <p>
                            <span className="font-semibold text-foreground">What trends mean (holistically)</span> —{" "}
                            <strong className="text-foreground">Rising</strong> overall: momentum is strengthening — often
                            aligns with expansion or cross-sell when other signals agree.{" "}
                            <strong className="text-foreground">Falling</strong> overall: momentum is weakening — often
                            aligns with earlier outreach or support when other signals agree;{" "}
                            <strong className="text-foreground">not</strong> automatic distress.{" "}
                            <strong className="text-foreground">Flat</strong> overall: no strong drift — use pulse,
                            liquidity, and archetype context for the next step.
                          </p>
                          <p className="text-[10px] border-t border-border/60 pt-2 mt-1">
                            <span className="font-semibold text-foreground">Reminder:</span> demo-only illustration of
                            leading trajectory; use alongside policy and human judgment.
                          </p>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                    <HealthMomentumMiniChart points={selected.healthMomentum} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base inline-flex items-center gap-1.5">
                      Archetype profile
                      <FiDemoInfoHint label="Supporting indicators" text={fiDemoHelp.supportingIndicators} />
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Deterministic supporting indicators from observed behavior patterns.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      {selected.supportingIndicators.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-emerald-500/35 bg-emerald-500/[0.04] shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base inline-flex items-center gap-1.5">
                      Action payload
                      <FiDemoInfoHint label="Action payload" text={fiDemoHelp.actionPayload} />
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Suggested RM strategy derived from current pulse, trajectory, and cluster evidence.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium text-foreground">Suggested strategy: </span>
                      <span className="text-foreground">{selected.actionPayload.strategyLabel}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Why now: </span>
                      {selected.actionPayload.whyNow}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base inline-flex items-center gap-1.5">
                      Banking product fit (primary)
                      <FiDemoInfoHint label="Banking product fit" text={fiDemoHelp.productRecommendation} />
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Core banking and servicing options first — cards, loans, deposits, and restructure paths where relevant.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[11px] font-medium uppercase tracking-wide",
                          recommendationConfidenceBadgeClass(selected.productRecommendation.confidenceBand)
                        )}
                      >
                        {selected.productRecommendation.confidenceBand} confidence
                      </Badge>
                      <FiDemoInfoHint
                        label="Recommendation confidence"
                        text={fiDemoHelp.recommendationConfidence}
                        iconClassName="h-3 w-3"
                      />
                      <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                        {selected.productRecommendation.basedOnSignals.matched}/
                        {selected.productRecommendation.basedOnSignals.total} signals matched
                        <FiDemoInfoHint
                          label="Signals matched"
                          text={fiDemoHelp.recommendationSignals}
                          iconClassName="h-3 w-3"
                        />
                      </span>
                    </div>

                    <div className="space-y-2">
                      {selected.productRecommendation.options.map((option, i) => (
                        <div key={`${option.product}-${i}`} className="rounded-lg border border-border bg-muted/20 p-3 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-medium text-foreground">{option.product}</p>
                            <Badge
                              variant={option.tag === "recommended" ? "default" : "secondary"}
                              className="text-[10px] uppercase tracking-wide"
                            >
                              {option.tag === "recommended" ? "Recommended" : "Alternative"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{option.fitRationale}</p>
                          {option.tradeoff && (
                            <p className="text-[11px] text-muted-foreground">
                              <span className="font-medium text-foreground">Trade-off:</span> {option.tradeoff}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="pt-1 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                        Provenance:
                        <FiDemoInfoHint
                          label="Recommendation provenance"
                          text={fiDemoHelp.recommendationProvenance}
                          iconClassName="h-3 w-3"
                        />
                      </span>
                      {selected.productRecommendation.provenanceChips.map((chip) => (
                        <Badge key={chip} variant="outline" className="text-[10px]">
                          {chip}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-dashed border-muted-foreground/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base inline-flex items-center gap-1.5">
                      Investment suitability (secondary)
                      <FiDemoInfoHint label="Investment suitability" text={fiDemoHelp.wealthRecommendation} />
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Fund and plan ideas when core banking is in place and capacity supports accumulate mode — gated by relationship policy.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {!selected.wealthRecommendation.eligible ? (
                      <Alert>
                        <TriangleAlert className="h-4 w-4" />
                        <AlertTitle className="text-sm inline-flex items-center gap-1 flex-wrap">
                          Wealth lane paused
                          <FiDemoInfoHint label="Why paused" text={fiDemoHelp.wealthIneligible} iconClassName="h-3 w-3" />
                        </AlertTitle>
                        <AlertDescription className="text-xs">
                          {selected.wealthRecommendation.ineligibleReason}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <>
                        {selected.wealthRecommendation.confidenceBand ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[11px] font-medium uppercase tracking-wide",
                                recommendationConfidenceBadgeClass(selected.wealthRecommendation.confidenceBand)
                              )}
                            >
                              {selected.wealthRecommendation.confidenceBand} confidence
                            </Badge>
                            {selected.wealthRecommendation.basedOnSignals ? (
                              <span className="text-xs text-muted-foreground">
                                {selected.wealthRecommendation.basedOnSignals.matched}/
                                {selected.wealthRecommendation.basedOnSignals.total} suitability signals
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                        <div className="space-y-2">
                          {selected.wealthRecommendation.options.map((option, i) => (
                            <div
                              key={`${option.fundName}-${i}`}
                              className="rounded-lg border border-border bg-muted/15 p-3 space-y-1.5"
                            >
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-medium text-foreground">{option.fundName}</p>
                                <Badge variant="outline" className="text-[10px]">
                                  {option.fundType}
                                </Badge>
                                <Badge
                                  variant={option.tag === "recommended" ? "default" : "secondary"}
                                  className="text-[10px] uppercase tracking-wide"
                                >
                                  {option.tag === "recommended" ? "Recommended" : "Alternative"}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{option.fitRationale}</p>
                              {option.tradeoff ? (
                                <p className="text-[11px] text-muted-foreground">
                                  <span className="font-medium text-foreground">Trade-off:</span> {option.tradeoff}
                                </p>
                              ) : null}
                            </div>
                          ))}
                        </div>
                        {selected.wealthRecommendation.provenanceChips?.length ? (
                          <div className="pt-1 flex flex-wrap items-center gap-2">
                            <span className="text-[11px] text-muted-foreground">Provenance:</span>
                            {selected.wealthRecommendation.provenanceChips.map((chip) => (
                              <Badge key={chip} variant="outline" className="text-[10px]">
                                {chip}
                              </Badge>
                            ))}
                          </div>
                        ) : null}
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-primary/35 bg-primary/[0.03] shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base inline-flex items-center gap-1.5">
                      Next 10 minutes
                      <FiDemoInfoHint label="Next 10 minutes" text={fiDemoHelp.nextTenMinutes} />
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Actions for this customer — demo only; nothing executes against core banking.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col sm:flex-row flex-wrap gap-2">
                    <Button variant="outline" className="justify-start gap-2" type="button">
                      <RefreshCw className="h-4 w-4" />
                      Request soft-restructure
                    </Button>
                    <Button variant="outline" className="justify-start gap-2" type="button">
                      <FileText className="h-4 w-4" />
                      Send product factsheet
                    </Button>
                    <Button
                      className="justify-start gap-2"
                      type="button"
                      onClick={() => {
                        setSnapshotOpen(false);
                        setScriptOpen(true);
                      }}
                    >
                      <Phone className="h-4 w-4" />
                      Call script
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base inline-flex items-center gap-1.5">
                      Liquidity meter
                      <FiDemoInfoHint label="Liquidity meter" text={fiDemoHelp.liquidityMeter} />
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Current month burn vs. 6-month average — demo math only.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1 gap-2">
                        <span className="text-muted-foreground inline-flex items-center gap-1">
                          Days of runway
                          <FiDemoInfoHint
                            label="Days of runway"
                            text={fiDemoHelp.liquidityMeter}
                            iconClassName="h-3 w-3"
                          />
                        </span>
                        <span className="font-semibold tabular-nums">{selected.liquidity.daysOfRunway} days</span>
                      </div>
                      <Progress value={runwayPct} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg border border-border p-3">
                        <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                          Burn (current)
                          <FiDemoInfoHint label="Burn current" text={fiDemoHelp.liquidityMeter} iconClassName="h-3 w-3" />
                        </p>
                        <p className="text-lg font-bold tabular-nums">
                          {privacyMode ? "••••" : `$${selected.liquidity.burnRateCurrent.toLocaleString()}`}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border p-3">
                        <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                          Burn (6-mo avg)
                          <FiDemoInfoHint label="Burn 6-month average" text={fiDemoHelp.liquidityMeter} iconClassName="h-3 w-3" />
                        </p>
                        <p className="text-lg font-bold tabular-nums text-muted-foreground">
                          {privacyMode ? "••••" : `$${selected.liquidity.burnRate6mAvg.toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                    {selected.liquidity.showLiquidityCrunchWarning && (
                      <Alert variant="destructive">
                        <TriangleAlert className="h-4 w-4" />
                        <AlertTitle className="inline-flex items-center gap-1 flex-wrap">
                          Liquidity crunch (demo alert)
                          <FiDemoInfoHint label="Liquidity crunch alert" text={fiDemoHelp.liquidityMeter} iconClassName="h-3 w-3" />
                        </AlertTitle>
                        <AlertDescription>
                          Current burn is ~{burnDelta > 0 ? "+" : ""}
                          {burnDelta.toFixed(0)}% vs. 6-month average — conversation angle: restructuring or
                          consolidation (subject to policy).
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base inline-flex items-center gap-1.5">
                      Behavior timeline
                      <FiDemoInfoHint label="Behavior timeline" text={fiDemoHelp.behaviorTimeline} />
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Spend clusters for talk tracks — sample events in this preview.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative pt-6 pb-2">
                      <div className="absolute left-0 right-0 top-9 h-0.5 bg-border" aria-hidden />
                      <div className="relative flex justify-between gap-2">
                        {selected.timeline.map((m, i) => (
                          <div
                            key={`${m.daysAgo}-${i}`}
                            className="flex flex-col items-center z-10"
                            style={{ flex: 1 }}
                          >
                            <div
                              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-background bg-primary/15 text-primary shadow-sm"
                              title={m.label}
                            >
                              {timelineIcon(m)}
                            </div>
                            <span className="mt-2 text-[10px] text-center text-muted-foreground max-w-[5.5rem] leading-tight">
                              {m.label}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground/80">{m.daysAgo}d</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Clusters support why{" "}
                      <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                        {selected.archetypeTag}
                        <FiDemoInfoHint label="Archetype" text={fiDemoHelp.archetypeBadge} iconClassName="h-3 w-3" />
                      </span>{" "}
                      is the modeled archetype for this outreach.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base inline-flex items-center gap-1.5">
                      Recent category activity
                      <FiDemoInfoHint label="Recent category activity" text={fiDemoHelp.recentCategoryActivity} />
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Rows flagged when amount &gt; 2× category 6-month average.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            <div className="inline-flex items-center gap-1">
                              Category
                              <FiDemoInfoHint label="Category" text={fiDemoHelp.tableCategory} iconClassName="h-3 w-3" />
                            </div>
                          </TableHead>
                          <TableHead className="text-right">
                            <div className="inline-flex items-center justify-end gap-1 ml-auto">
                              Amount
                              <FiDemoInfoHint label="Amount" text={fiDemoHelp.tableAmount} iconClassName="h-3 w-3" />
                            </div>
                          </TableHead>
                          <TableHead className="text-right">
                            <div className="inline-flex items-center justify-end gap-1 ml-auto">
                              Avg (6m)
                              <FiDemoInfoHint label="Average 6 months" text={fiDemoHelp.tableAvg6m} iconClassName="h-3 w-3" />
                            </div>
                          </TableHead>
                          <TableHead className="text-right">
                            <div className="inline-flex items-center justify-end gap-1 ml-auto">
                              Days ago
                              <FiDemoInfoHint label="Days ago" text={fiDemoHelp.tableDaysAgo} iconClassName="h-3 w-3" />
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selected.transactions.map((row, i) => (
                          <TableRow
                            key={`${row.category}-${i}`}
                            className={row.isAnomaly ? "bg-amber-500/10" : undefined}
                          >
                            <TableCell>
                              {row.category}
                              {row.isAnomaly && (
                                <span className="ml-2 inline-flex items-center gap-0.5 align-middle">
                                  <Badge variant="outline" className="text-[10px] border-amber-500/50">
                                    Anomaly
                                  </Badge>
                                  <FiDemoInfoHint label="Anomaly" text={fiDemoHelp.tableAnomaly} iconClassName="h-3 w-3" />
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right font-mono tabular-nums">
                              {privacyMode ? "••••" : `$${row.amount.toLocaleString()}`}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground tabular-nums">
                              {privacyMode ? "•••" : `$${row.categoryAverage6m.toLocaleString()}`}
                            </TableCell>
                            <TableCell className="text-right">{row.daysAgo}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Sheet open={scriptOpen} onOpenChange={setScriptOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="inline-flex items-center gap-1.5">
              Call script
              <FiDemoInfoHint label="Call script" text={fiDemoHelp.callScript} />
            </SheetTitle>
            <SheetDescription>Three bullets to open the conversation.</SheetDescription>
          </SheetHeader>
          <ul className="mt-6 space-y-4 text-sm text-muted-foreground list-disc pl-5">
            {selected?.callScriptBullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>

      <Sheet open={snapshotOpen} onOpenChange={setSnapshotOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="space-y-1 pr-8">
            <SheetTitle className="inline-flex items-center gap-1.5">
              Customer snapshot
              <FiDemoInfoHint label="Customer snapshot" text={fiDemoHelp.customerSnapshot} />
            </SheetTitle>
            <SheetDescription>
              Consolidated view for the selected sample lead.
            </SheetDescription>
          </SheetHeader>
          {selected && (
            <div className="mt-6">
              <CustomerSnapshotBody lead={selected} privacyMode={privacyMode} />
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={logicOpen} onOpenChange={setLogicOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="space-y-1 pr-8">
            <SheetTitle className="inline-flex items-center gap-1.5">
              Logic evidence
              <FiDemoInfoHint label="Logic evidence" text={fiDemoHelp.logicEvidence} />
            </SheetTitle>
            <SheetDescription>
              Rule lineage and trigger rows for the selected sample lead.
            </SheetDescription>
          </SheetHeader>
          {selected && <LogicEvidenceBody lead={selected} />}
        </SheetContent>
      </Sheet>

      <p className="px-5 pb-4 text-[11px] text-muted-foreground border-t border-border/60 pt-3 mx-4 mb-4">
        Sample workspace preview — demo data only, not connected to live customers or your systems.
      </p>
    </div>
    </TooltipProvider>
  );
};
