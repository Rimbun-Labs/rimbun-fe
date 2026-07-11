import React from "react";
import { useBankCustomerInsights } from "@/hooks/useBankCustomerInsights";
import { PageContainer, PageHeader } from "@/components/layout";
import { OverviewCards } from "@/components/dashboard/bank/OverviewCards";
import { RiskProfileChart } from "@/components/dashboard/bank/RiskProfileChart";
import { FinancialHealthSection } from "@/components/dashboard/bank/FinancialHealthSection";
import { EngagementMetrics } from "@/components/dashboard/bank/EngagementMetrics";
import { InvestmentPreferences } from "@/components/dashboard/bank/InvestmentPreferences";
import { CustomerSegmentation } from "@/components/dashboard/bank/CustomerSegmentation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, AlertCircle, RefreshCw } from "lucide-react";
import { RouteErrorBoundary } from "@/components/error/RouteErrorBoundary";

/**
 * Dashboard Home — bank-level book view (risk, health, engagement, segments).
 */
const Dashboard: React.FC = () => {
  const { data, loading, error, refetch } = useBankCustomerInsights();

  return (
    <PageContainer>
      <PageHeader
        icon={BarChart3}
        title="Home"
        description="How the customer book looks across risk, health, engagement, and segments."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        }
      />

      <div className="mt-6 space-y-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : null}

        {!loading && error ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unable to load book overview</AlertTitle>
            <AlertDescription className="flex flex-wrap items-center gap-2">
              Book insights could not be loaded right now.
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : null}

        {!loading && !error && data ? (
          <>
            <OverviewCards data={data} />

            <Card>
              <CardHeader>
                <CardTitle>Risk profile distribution</CardTitle>
                <CardDescription>
                  Breakdown of customer risk profiles across the book
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
          </>
        ) : null}

        {!loading && !error && !data ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No book data yet</AlertTitle>
            <AlertDescription>
              Book insights will appear here once customer data is available.
            </AlertDescription>
          </Alert>
        ) : null}
      </div>
    </PageContainer>
  );
};

const DashboardWithBoundary: React.FC = () => (
  <RouteErrorBoundary>
    <Dashboard />
  </RouteErrorBoundary>
);

export default DashboardWithBoundary;
