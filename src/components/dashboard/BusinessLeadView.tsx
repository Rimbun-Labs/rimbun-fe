import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { BusinessLead } from "@/lib/api/types/fiDecision";

const missingDataLabel: Record<string, string> = {
  loanBalance: "loan balance",
  loanRate: "loan rate",
  invoices: "invoices",
};

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function monthLabelFor(lead: BusinessLead, period: string): string {
  return lead.months?.find((month) => month.period === period)?.monthLabel ?? period;
}

function gapDays(days: number | null): string {
  return days == null ? "—" : `${days} days`;
}

function patternLabel(pattern: string): string {
  return pattern.replace(/_/g, " ");
}

export function BusinessLeadView({ lead }: { lead: BusinessLead }) {
  const assessment = lead.pulseAssessment;
  const reviewLabel = assessment?.reviewTierLabel ?? lead.decisionSupport?.reviewTierLabel;
  const months = lead.months ?? [];
  const salesPoints = lead.healthMomentum ?? [];
  const buyers = (lead.buyerChanges ?? []).filter((buyer) => buyer.pattern !== "steady");
  const pinned = lead.inferences?.find((point) => point.code === lead.actionPayload.basedOnInference);
  const missing = (lead.needsMoreData ?? [])
    .map((slot) => missingDataLabel[slot] ?? slot)
    .join(", ");

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-primary/25 bg-gradient-to-br from-primary/10 to-background p-4">
        <div className="flex flex-wrap items-center gap-2">
          {reviewLabel ? <Badge variant="outline">{reviewLabel}</Badge> : null}
          {assessment ? (
            <Badge variant="secondary">
              Risk {assessment.riskScore} · Opportunity {assessment.opportunityScore}
            </Badge>
          ) : null}
        </div>
        <h2 className="mt-3 text-lg font-semibold text-foreground">{lead.archetypeTag}</h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground">{lead.oneLiner}</p>
        <p className="mt-3 border-t border-primary/15 pt-3 text-sm font-medium text-primary">
          {lead.actionPayload.strategyLabel}
        </p>
        {lead.actionPayload.whyNow ? (
          <p className="mt-1 text-sm text-muted-foreground">{lead.actionPayload.whyNow}</p>
        ) : null}
        {pinned?.nextStep ? (
          <p className="mt-2 text-sm font-medium text-primary">{pinned.nextStep}</p>
        ) : null}
        {lead.limits && lead.limits.length > 0 ? (
          <Collapsible className="group/limits mt-3">
            <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground">
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-data-[state=open]/limits:rotate-90" />
              Limits
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-muted-foreground">
                {lead.limits.map((limit) => (
                  <li key={limit}>{limit}</li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        ) : null}
      </section>

      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-medium">Sales</h3>
          <p className="text-xs text-muted-foreground">{lead.healthMomentumBasis}</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {salesPoints.map((point) => (
              <div key={point.monthLabel} className="rounded-lg border bg-muted/20 p-3">
                <p className="font-mono text-xs text-muted-foreground">{point.monthLabel}</p>
                {point.sales != null ? (
                  <p className="mt-1 text-sm font-medium tabular-nums">{rupiah.format(point.sales)}</p>
                ) : null}
                <p className="mt-1 text-xs text-muted-foreground">Index {point.score}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium">What changed</h3>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {lead.timeline.map((mark) => (
              <div key={`${mark.period ?? mark.monthLabel}-${mark.label}`} className="rounded-lg border p-3">
                <p className="font-mono text-xs text-muted-foreground">{mark.monthLabel ?? mark.period}</p>
                <p className="mt-1 text-sm font-medium">{mark.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lead.inferences && lead.inferences.length > 0 ? (
        <section>
          <h3 className="text-sm font-medium">Inferences</h3>
          <div className="mt-2 divide-y rounded-lg border">
            {lead.inferences.map((point) => (
              <Collapsible key={point.code} className="group/inference">
                <CollapsibleTrigger className="flex w-full flex-wrap items-center gap-2 px-3 py-2 text-left">
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]/inference:rotate-90" />
                  <span className="min-w-0 flex-1 text-sm font-medium">{point.heading}</span>
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {point.direction}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] uppercase">
                    {point.confidence}
                  </Badge>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-3 pb-3 pl-8">
                  <p className="text-sm text-foreground">{point.finding}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{point.meaning}</p>
                  {point.nextStep ? <p className="mt-2 text-sm font-medium text-primary">{point.nextStep}</p> : null}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </section>
      ) : null}

      {buyers.length > 0 ? (
        <section>
          <h3 className="text-sm font-medium">Buyers</h3>
          <div className="mt-2 divide-y rounded-lg border">
            {buyers.map((buyer) => (
              <Collapsible key={buyer.name} className="group/buyer">
                <CollapsibleTrigger className="flex w-full flex-wrap items-center gap-x-2 gap-y-1 px-3 py-2 text-left">
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]/buyer:rotate-90" />
                  <span className="min-w-0 flex-1 text-sm font-medium">{buyer.name}</span>
                  <span className="text-xs text-muted-foreground">{patternLabel(buyer.pattern)}</span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {rupiah.format(buyer.earlierTotal)} → {rupiah.format(buyer.latestTotal)}
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent className="grid grid-cols-2 gap-3 px-3 pb-3 pl-8 text-sm">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{monthLabelFor(lead, buyer.earlierPeriod)}</p>
                    <p className="text-xs text-muted-foreground">{buyer.earlierCount} payments</p>
                    <p className="text-xs tabular-nums text-muted-foreground">Average {rupiah.format(buyer.earlierAverage)}</p>
                    <p className="text-xs text-muted-foreground">{gapDays(buyer.earlierGapDays)} between payments</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{monthLabelFor(lead, buyer.latestPeriod)}</p>
                    <p className="text-xs text-muted-foreground">{buyer.latestCount} payments</p>
                    <p className="text-xs tabular-nums text-muted-foreground">Average {rupiah.format(buyer.latestAverage)}</p>
                    <p className="text-xs text-muted-foreground">{gapDays(buyer.latestGapDays)} between payments</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </section>
      ) : null}

      {months.length > 0 ? (
        <section>
          <h3 className="text-sm font-medium">Money in, money out, balance</h3>
          {lead.liquidity.cashCoverMonths != null ? (
            <p className="text-xs text-muted-foreground">Cash cover {lead.liquidity.cashCoverMonths} months</p>
          ) : null}
          <div className="mt-2 grid grid-cols-3 gap-2">
            {months.map((month) => (
              <div key={month.period} className="rounded-lg border p-3 text-sm">
                <p className="font-mono text-xs text-muted-foreground">{month.monthLabel}</p>
                <p className="mt-2 text-xs text-muted-foreground">In</p>
                <p className="tabular-nums">{rupiah.format(month.moneyIn)}</p>
                <p className="mt-2 text-xs text-muted-foreground">Out</p>
                <p className="tabular-nums">{rupiah.format(month.moneyOut)}</p>
                <p className="mt-2 text-xs text-muted-foreground">Balance</p>
                <p className="font-medium tabular-nums">{rupiah.format(month.closingBalance)}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-2 sm:grid-cols-3">
        {lead.productRecommendation.options.map((option) => (
          <Collapsible key={option.product} className="group/product rounded-lg border bg-muted/20">
            <CollapsibleTrigger className="flex w-full items-start gap-2 p-3 text-left">
              <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]/product:rotate-90" />
              <span className="min-w-0 flex-1">
                <Badge variant={option.tag === "recommended" ? "default" : "secondary"} className="text-[10px] uppercase">
                  {option.tag === "recommended" ? "Recommended" : "Alternative"}
                </Badge>
                <p className="mt-2 text-sm font-medium">{option.product}</p>
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3 pl-8">
              <p className="text-xs text-muted-foreground">{option.fitRationale}</p>
              {option.tradeoff ? <p className="mt-1 text-xs text-foreground">{option.tradeoff}</p> : null}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </section>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {missing ? `Not on the statement: ${missing}. ` : ""}
        {lead.wealthRecommendation.eligible ? "Investment fit is available." : lead.wealthRecommendation.ineligibleReason}
      </p>
    </div>
  );
}
