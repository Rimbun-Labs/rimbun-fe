import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSyncCustomerFromRoute } from "@/hooks/useSyncCustomerFromRoute";
import { useSelectedCustomer } from "@/contexts/SelectedCustomerContext";
import { useFiDecisionInsights } from "@/hooks/useFiDecisionInsights";
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
import type { FiDecisionRiskItem } from "@/lib/api/types/fiDecision";

function asPercent(score: number): string {
  return `${Math.round(score)}%`;
}

function riskBadgeClass(band: FiDecisionRiskItem["band"]) {
  if (band === "high") return "bg-red-500/10 text-red-700 border-red-500/40";
  if (band === "medium") return "bg-amber-500/10 text-amber-700 border-amber-500/40";
  return "bg-emerald-500/10 text-emerald-700 border-emerald-500/40";
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
  const { selectedCustomer } = useSelectedCustomer();
  const {
    data,
    loading,
    error,
    refetch,
    explainData,
    explainLoading,
    explainError,
    fetchExplain,
  } = useFiDecisionInsights();
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

        {!loading && !error && data ? (
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
