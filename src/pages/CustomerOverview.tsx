import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSyncCustomerFromRoute } from "@/hooks/useSyncCustomerFromRoute";
import { useSelectedCustomer } from "@/contexts/SelectedCustomerContext";
import { useFiDecisionInsights } from "@/hooks/useFiDecisionInsights";
import { useBusinessDecision } from "@/hooks/useBusinessDecision";
import { BusinessLeadView } from "@/components/dashboard/BusinessLeadView";
import { PageContainer, PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserCircle, AlertCircle, ClipboardList, Package } from "lucide-react";
import type { CustomerLead, FiDecisionRiskItem, FiQueueBucket } from "@/lib/api/types/fiDecision";

function asPercent(score: number): string {
  return `${Math.round(score)}%`;
}

function riskBadgeClass(band: FiDecisionRiskItem["band"]) {
  if (band === "high") return "bg-red-500/10 text-red-700 border-red-500/40";
  if (band === "medium") return "bg-amber-500/10 text-amber-700 border-amber-500/40";
  return "bg-emerald-500/10 text-emerald-700 border-emerald-500/40";
}

const pulseLabel: Record<CustomerLead["pulse"], string> = {
  imminent_risk: "Imminent risk",
  high_value_upsell: "High-value upsell",
  watch: "Watch",
};

const missingDataLabel: Record<string, string> = {
  propensity: "Propensity",
  loanBalance: "Loan balance",
  funds: "Funds",
};

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatIdr(value: number): string {
  return rupiah.format(value);
}

function monthOf(period: string): string {
  const month = Number(period.split("-")[1]);
  return MONTHS[month - 1] ?? period;
}

function sharePercent(share: number): string {
  const pct = Math.round(share * 1000) / 10;
  return Number.isInteger(pct) ? `${pct}%` : `${pct.toFixed(1)}%`;
}

function MissingStat({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed bg-muted/20 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">More data needed</p>
    </div>
  );
}

function CustomerLeadView({
  lead,
  queueBucket,
}: {
  lead: CustomerLead;
  queueBucket?: FiQueueBucket;
}) {
  const observed = lead.liquidity.monthsObserved;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-primary/10 to-background p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{pulseLabel[lead.pulse] ?? lead.pulse}</Badge>
          <Badge variant="secondary">{lead.archetypeTag}</Badge>
          {queueBucket ? <Badge variant="outline">{queueBucket}</Badge> : null}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-foreground">{lead.oneLiner}</p>
        {(lead.insights ?? []).length > 0 ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {(lead.insights ?? []).map((insight) =>
              insight.id === "income" ? (
                <div key={insight.id} className="rounded-lg border border-primary/15 bg-background/60 p-3 sm:col-span-2">
                  <p className="text-sm font-medium">{insight.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Pay {formatIdr(insight.salary ?? 0)}
                    {insight.sideIncome != null ? `, side income ${formatIdr(insight.sideIncome)}` : ""}
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {(insight.months ?? []).map((month) => (
                      <div key={month.period} className="text-sm">
                        <p className="font-mono text-xs text-muted-foreground">{monthOf(month.period)}</p>
                        <p className="tabular-nums">In {formatIdr(month.moneyIn)}</p>
                        <p className="tabular-nums">Out {formatIdr(month.moneyOut)}</p>
                        <p className={month.surplus < 0 ? "tabular-nums text-amber-700" : "tabular-nums"}>
                          Surplus {formatIdr(month.surplus)}
                          {month.surplus < 0 ? " · finished short" : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div key={insight.id} className="rounded-lg border border-primary/15 bg-background/60 p-3">
                  <p className="text-sm font-medium">{insight.title}</p>
                  {insight.shareOfMoneyOut != null ? (
                    <p className="mt-1 text-lg font-semibold tabular-nums">
                      {sharePercent(insight.shareOfMoneyOut)}
                    </p>
                  ) : null}
                  {insight.monthCount != null ? (
                    <p className="text-xs text-muted-foreground">
                      {insight.monthCount} {insight.monthCount === 1 ? "month" : "months"}
                    </p>
                  ) : null}
                  {insight.series && insight.series.length > 0 ? (
                    <p className="mt-1 text-xs tabular-nums text-muted-foreground">
                      {insight.series.map((point) => formatIdr(point.amount)).join(", then ")}
                    </p>
                  ) : null}
                </div>
              )
            )}
          </div>
        ) : null}
        <p className="mt-3 border-t border-primary/15 pt-3 text-sm">
          <span className="font-medium text-primary">{lead.actionPayload.strategyLabel}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">Runway</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">{lead.liquidity.daysOfRunway} days</p>
          {lead.liquidity.showLiquidityCrunchWarning ? (
            <p className="mt-1 text-[11px] text-amber-700">Liquidity warning</p>
          ) : null}
        </div>
        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">Latest month out</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">{formatIdr(lead.liquidity.burnRateCurrent)}</p>
        </div>
        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">Average of {observed} months</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">{formatIdr(lead.liquidity.burnRate6mAvg)}</p>
        </div>
        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">Signals</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">
            {lead.productRecommendation.basedOnSignals.matched}/{lead.productRecommendation.basedOnSignals.total}
          </p>
          <p className="mt-1 text-[11px] capitalize text-muted-foreground">
            {lead.productRecommendation.confidenceBand} confidence
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {(lead.needsMoreData ?? []).map((slot) => (
          <MissingStat key={slot} label={missingDataLabel[slot] ?? slot} />
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {lead.timeline.map((mark, index) => (
            <div key={`${mark.label}-${mark.daysAgo}-${index}`} className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-medium">{mark.label}</span>
              <span className="text-xs text-muted-foreground">{mark.daysAgo} days ago</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-28">
            {lead.healthMomentum.map((month, index) => (
              <div key={`${month.monthLabel}-${index}`} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="text-xs tabular-nums">{month.score}</span>
                <div className="w-full rounded-sm bg-primary/80" style={{ height: `${month.score}%` }} />
                <span className="text-xs text-muted-foreground">{month.monthLabel}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Flagged behavior</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {lead.transactions.map((row, index) => (
            <div key={`${row.category}-${row.merchantHint ?? ""}-${row.amount}-${index}`} className="flex items-baseline justify-between gap-3 text-sm">
              <p>
                <span className="font-medium">{row.merchantHint || row.category}</span>
                {row.merchantHint ? (
                  <span className="text-muted-foreground"> · {row.category}</span>
                ) : null}
                {row.isAnomaly ? (
                  <Badge variant="outline" className="ml-2 text-[10px]">
                    Anomaly
                  </Badge>
                ) : null}
              </p>
              <p className="shrink-0 tabular-nums">
                {formatIdr(row.amount)}
                <span className="ml-2 text-xs text-muted-foreground">avg {formatIdr(row.categoryAverage6m)}</span>
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{lead.actionPayload.strategyLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{lead.actionPayload.whyNow}</p>
        </CardContent>
      </Card>

      <div className="grid gap-2 sm:grid-cols-3">
        {lead.productRecommendation.options.map((option) => (
          <div key={option.product} className="rounded-lg border bg-muted/20 p-3">
            <Badge variant={option.tag === "recommended" ? "default" : "secondary"} className="text-[10px] uppercase">
              {option.tag === "recommended" ? "Recommended" : "Alternative"}
            </Badge>
            <p className="mt-2 text-sm font-medium">{option.product}</p>
            <p className="mt-1 text-xs text-muted-foreground">{option.fitRationale}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        {lead.wealthRecommendation.eligible
          ? "Investment fit is available."
          : lead.wealthRecommendation.ineligibleReason}
      </p>
    </div>
  );
}

function RiskCard({ title, risk }: { title: string; risk: FiDecisionRiskItem }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardDescription>{title}</CardDescription>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{asPercent(risk.score)}</CardTitle>
          <Badge variant="outline" className={riskBadgeClass(risk.band)}>
            {String(risk.band).toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Confidence: {String(risk.confidence).toUpperCase()}
        </p>
        {(risk.reasons ?? []).slice(0, 2).map((reason) => (
          <p key={reason} className="text-sm">
            - {reason}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}

const CustomerOverview: React.FC = () => {
  const customerId = useSyncCustomerFromRoute();
  const [searchParams] = useSearchParams();
  const { selectedCustomer } = useSelectedCustomer();
  const isBusiness =
    searchParams.get("kind") === "business" ||
    (selectedCustomer?.customerId === customerId && selectedCustomer.customerType === "business");
  const {
    data,
    loading,
    error,
    refetch,
    explainData,
    explainLoading,
    explainError,
    fetchExplain,
  } = useFiDecisionInsights({ loadDecision: !isBusiness });
  const business = useBusinessDecision(customerId, isBusiness);
  const [isExplainOpen, setIsExplainOpen] = useState(false);

  const label =
    selectedCustomer?.displayName ||
    selectedCustomer?.externalCustomerId ||
    customerId;

  const liquidity = data?.risk?.liquidityRisk;
  const stress = data?.risk?.stressRisk;

  const openExplain = async () => {
    setIsExplainOpen(true);
    await fetchExplain();
  };

  if (isBusiness) {
    return (
      <PageContainer>
        <PageHeader
          icon={UserCircle}
          title={label}
          description="Sales, payers, and cash cover from the statements."
        />
        <div className="mt-6 space-y-4">
          {business.error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Unable to load this business</AlertTitle>
              <AlertDescription className="flex flex-wrap items-center gap-2">
                {business.error.message}
                <Button variant="outline" size="sm" onClick={() => void business.refetch()}>
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : null}
          {business.loading ? <Skeleton className="h-32 w-full" /> : null}
          {!business.loading && !business.error && business.data?.businessLead ? (
            <BusinessLeadView lead={business.data.businessLead} />
          ) : null}
          {!business.loading && !business.error && business.data && !business.data.businessLead ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No statement yet</AlertTitle>
              <AlertDescription>{business.data.executiveSummary}</AlertDescription>
            </Alert>
          ) : null}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        icon={UserCircle}
        title={label}
        description="Opportunity and risk signals for follow-up."
        action={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to={`/dashboard/customers/${customerId}/assessment`}>
                <ClipboardList className="h-4 w-4 mr-2" />
                Assessment
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link to={`/dashboard/customers/${customerId}/products`}>
                <Package className="h-4 w-4 mr-2" />
                Products
              </Link>
            </Button>
          </div>
        }
      />

      <div className="mt-6 space-y-4">
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unable to load overview</AlertTitle>
            <AlertDescription className="flex flex-wrap items-center gap-2">
              Something went wrong loading this overview.
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : null}

        {loading ? <Skeleton className="h-32 w-full" /> : null}

        {!loading && !error && data?.customerLead ? (
          <CustomerLeadView lead={data.customerLead} queueBucket={data.queueBucket} />
        ) : null}

        {!loading && !error && data && !data.customerLead ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
                <CardTitle className="text-base">Executive summary</CardTitle>
                <Button variant="outline" size="sm" onClick={() => void openExplain()}>
                  Why this view
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {data.executiveSummary || "No summary available yet."}
                </p>
                {data.queueBucket ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Queue: {data.queueBucket}
                    {data.queueReason ? ` — ${data.queueReason}` : ""}
                  </p>
                ) : null}
              </CardContent>
            </Card>

            {liquidity || stress ? (
              <div className="grid gap-4 md:grid-cols-2">
                {liquidity ? <RiskCard title="Liquidity risk" risk={liquidity} /> : null}
                {stress ? <RiskCard title="Stress risk" risk={stress} /> : null}
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Risk signals unavailable</AlertTitle>
                <AlertDescription>
                  Risk details are not available for this customer yet.
                </AlertDescription>
              </Alert>
            )}

            {(data.actions ?? []).length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Suggested actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {data.actions.slice(0, 5).map((action) => (
                    <div key={`${action.priority}-${action.title}`} className="rounded-md border p-3">
                      <p className="text-sm font-medium">
                        {action.priority}. {action.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{action.rationale}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}
          </>
        ) : null}

        {!loading && !error && !data ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No insights yet</AlertTitle>
            <AlertDescription>
              Insights are not available for this customer yet.
            </AlertDescription>
          </Alert>
        ) : null}
      </div>

      <Sheet open={isExplainOpen} onOpenChange={setIsExplainOpen}>
        <SheetContent className="w-[95vw] sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Why this view</SheetTitle>
            <SheetDescription>
              Key drivers behind the summary and risk signals for {label}.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4 text-sm">
            {explainLoading ? <Skeleton className="h-32 w-full" /> : null}
            {!explainLoading && explainError ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Rationale unavailable</AlertTitle>
                <AlertDescription>
                  Detailed rationale could not be loaded right now.
                </AlertDescription>
              </Alert>
            ) : null}
            {!explainLoading && !explainError && explainData ? (
              <>
                {(explainData.riskDrivers?.liquidity?.length ?? 0) > 0 ? (
                  <div>
                    <p className="font-medium">Liquidity</p>
                    <ul className="mt-1 list-inside list-disc text-muted-foreground">
                      {explainData.riskDrivers!.liquidity!.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {(explainData.riskDrivers?.stress?.length ?? 0) > 0 ? (
                  <div>
                    <p className="font-medium">Stress</p>
                    <ul className="mt-1 list-inside list-disc text-muted-foreground">
                      {explainData.riskDrivers!.stress!.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {explainData.affordabilityDrivers?.recommendation ? (
                  <div>
                    <p className="font-medium">Affordability</p>
                    <p className="mt-1 text-muted-foreground">
                      {explainData.affordabilityDrivers.recommendation}
                    </p>
                  </div>
                ) : null}
                {!explainData.riskDrivers?.liquidity?.length &&
                !explainData.riskDrivers?.stress?.length &&
                !explainData.affordabilityDrivers?.recommendation ? (
                  <p className="text-muted-foreground">
                    No additional rationale details are available for this customer.
                  </p>
                ) : null}
              </>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </PageContainer>
  );
};

export default CustomerOverview;
