import React from "react";
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
  const { data, loading, error, refetch } = useFiDecisionInsights();

  const label =
    selectedCustomer?.displayName ||
    selectedCustomer?.externalCustomerId ||
    customerId;

  const liquidity = data?.risk?.liquidityRisk;
  const stress = data?.risk?.stressRisk;

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
              <CardHeader>
                <CardTitle className="text-base">Executive summary</CardTitle>
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
    </PageContainer>
  );
};

export default CustomerOverview;
