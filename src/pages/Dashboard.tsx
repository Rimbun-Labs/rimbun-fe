import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  useBankPortfolioHome,
  type PortfolioHomeMode,
} from "@/hooks/useBankPortfolioHome";
import { PageContainer, PageHeader } from "@/components/layout";
import { RiskProfileChart } from "@/components/dashboard/bank/RiskProfileChart";
import { FinancialHealthSection } from "@/components/dashboard/bank/FinancialHealthSection";
import { EngagementMetrics } from "@/components/dashboard/bank/EngagementMetrics";
import { InvestmentPreferences } from "@/components/dashboard/bank/InvestmentPreferences";
import { CustomerSegmentation } from "@/components/dashboard/bank/CustomerSegmentation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Building2,
  RefreshCw,
  Users,
} from "lucide-react";
import { RouteErrorBoundary } from "@/components/error/RouteErrorBoundary";
import { useFormatters } from "@/hooks/useFormatters";
import { appCustomers, businessWorkspaceBase } from "@/lib/appPaths";
import { cn } from "@/lib/utils";

const MODE_OPTIONS: Array<{ value: PortfolioHomeMode; label: string }> = [
  { value: "all", label: "All" },
  { value: "individuals", label: "Individuals" },
  { value: "businesses", label: "Businesses" },
];

type MetricCard = {
  title: string;
  value: string;
  description: string;
};

const Dashboard: React.FC = () => {
  const [mode, setMode] = useState<PortfolioHomeMode>("all");
  const { data, filteredAttention, loading, error, refetch } =
    useBankPortfolioHome(mode);
  const { formatNumber } = useFormatters();

  const metricCards: MetricCard[] = (() => {
    if (!data) return [];
    if (mode === "businesses") {
      return [
        {
          title: "Business records",
          value: formatNumber(data.businessCount),
          description: "Business customers in this book",
        },
        {
          title: "Needing attention",
          value: formatNumber(data.businessesNeedingAttention),
          description: "Open warnings or recommended actions",
        },
        {
          title: "Projected shortfalls",
          value: formatNumber(data.projectedShortfalls),
          description: "Businesses with a shortfall-style warning",
        },
        {
          title: "Receivables pressure",
          value: formatNumber(data.overdueReceivableWarnings),
          description: "Top warning mentions overdue / receivables",
        },
      ];
    }
    if (mode === "individuals") {
      const insights = data.insights;
      return [
        {
          title: "Individual records",
          value: formatNumber(data.individualCount),
          description: "Individual customers in this book",
        },
        {
          title: "Health score",
          value: insights
            ? `${insights.financialHealth.overallHealthScore.toFixed(1)}%`
            : "—",
          description: "Average financial health (individuals)",
        },
        {
          title: "With activity (30d)",
          value: insights
            ? formatNumber(insights.engagement.activeUsers.last30Days)
            : "—",
          description: "Individuals with platform activity in 30 days",
        },
        {
          title: "Assessment completion",
          value: insights
            ? `${insights.engagement.assessmentCompletion.completionRate.toFixed(1)}%`
            : "—",
          description: "Share of completed assessments",
        },
      ];
    }
    return [
      {
        title: "Customer records",
        value: formatNumber(data.totalCount),
        description: "Individuals and businesses in this book",
      },
      {
        title: "Individuals",
        value: formatNumber(data.individualCount),
        description: "Personal / retail customers",
      },
      {
        title: "Businesses",
        value: formatNumber(data.businessCount),
        description: "SME and commercial customers",
      },
      {
        title: "Needs attention",
        value: formatNumber(filteredAttention.length),
        description: "Top items in the attention queue below",
      },
    ];
  })();

  return (
    <PageContainer>
      <PageHeader
        icon={Users}
        title="Home"
        description="Portfolio command centre — switch mode to focus individuals, businesses, or the full book."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        }
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {MODE_OPTIONS.map(({ value, label }) => (
          <Button
            key={value}
            type="button"
            size="sm"
            variant={mode === value ? "secondary" : "outline"}
            onClick={() => setMode(value)}
          >
            {label}
          </Button>
        ))}
        <Button variant="ghost" size="sm" asChild className="ml-auto">
          <Link to={appCustomers()}>
            Open customer portfolio
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      <div className="mt-6 space-y-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : null}

        {!loading && error ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unable to load portfolio home</AlertTitle>
            <AlertDescription className="flex flex-wrap items-center gap-2">
              Portfolio data could not be loaded right now.
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : null}

        {!loading && !error && data ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {metricCards.map((card) => (
                <Card key={card.title}>
                  <CardContent className="p-5">
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </p>
                    <p className="mt-2 text-2xl font-bold">{card.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Attention queue</CardTitle>
                <CardDescription>
                  {mode === "businesses"
                    ? "Businesses with open warnings or actions"
                    : mode === "individuals"
                      ? "Individuals in ACT NOW, MONITOR, or NEEDS DATA"
                      : "Mixed book — businesses and individuals that need a look"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredAttention.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">
                    Nothing queued for attention in this mode.
                  </p>
                ) : (
                  <ul className="divide-y rounded-md border">
                    {filteredAttention.map((item) => (
                      <li key={item.id}>
                        <Link
                          to={item.href}
                          className="flex items-start gap-3 px-3 py-3 transition-colors hover:bg-muted/50"
                        >
                          <span
                            className={cn(
                              "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                              item.tone === "business"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
                                : "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200"
                            )}
                          >
                            {item.tone === "business" ? (
                              <Building2 className="h-4 w-4" />
                            ) : (
                              <AlertTriangle className="h-4 w-4" />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="font-medium truncate">
                                {item.title}
                              </span>
                              <Badge variant="outline" className="text-[10px]">
                                {item.tone === "business"
                                  ? "Business"
                                  : "Individual"}
                              </Badge>
                            </span>
                            <span className="mt-0.5 block text-sm text-muted-foreground line-clamp-2">
                              {item.detail}
                            </span>
                          </span>
                          <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-muted-foreground" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {mode === "businesses" ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Business queue</CardTitle>
                  <CardDescription>
                    Ranked by open warnings and actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {data.businessQueue.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No business customers in queue yet.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {data.businessQueue.slice(0, 8).map((row) => (
                        <li
                          key={row.customerId}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
                        >
                          <Link
                            to={businessWorkspaceBase(row.customerId)}
                            className="font-medium hover:underline"
                          >
                            {row.displayName || row.externalCustomerId}
                          </Link>
                          <span className="text-muted-foreground">
                            {row.openWarningCount} warnings · {row.openActionCount}{" "}
                            actions
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ) : null}

            {(mode === "individuals" || mode === "all") && data.insights ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Risk profile distribution</CardTitle>
                    <CardDescription>
                      Individual customers with assessed risk profiles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RiskProfileChart data={data.insights.riskProfiles} />
                  </CardContent>
                </Card>

                {mode === "individuals" ? (
                  <>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <FinancialHealthSection
                        data={data.insights.financialHealth}
                      />
                      <EngagementMetrics data={data.insights.engagement} />
                    </div>
                    <InvestmentPreferences
                      data={data.insights.investmentPreferences}
                    />
                    <CustomerSegmentation
                      data={data.insights.customerSegments}
                    />
                  </>
                ) : null}
              </>
            ) : null}

            {mode === "individuals" && !data.insights ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No individual insights yet</AlertTitle>
                <AlertDescription>
                  Consumer book metrics will appear once individual customer data
                  is available.
                </AlertDescription>
              </Alert>
            ) : null}
          </>
        ) : null}
      </div>
    </PageContainer>
  );
};

const DashboardWithBoundary: React.FC = () => (
  <RouteErrorBoundary routeName="Home">
    <Dashboard />
  </RouteErrorBoundary>
);

export default DashboardWithBoundary;
