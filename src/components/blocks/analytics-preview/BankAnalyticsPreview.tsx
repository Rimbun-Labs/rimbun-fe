import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Users,
  Activity,
  TrendingUp,
  CheckCircle2,
  PieChart,
  Target,
  FileText,
} from "lucide-react";

/**
 * Illustrative portfolio snapshot for marketing — static mock only, no API calls.
 */
export const BankAnalyticsPreview: React.FC = () => {
  const overviewCards = [
    {
      title: "Total customers",
      value: "12,450",
      desc: "In aggregation scope",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Overall health score",
      value: "72",
      desc: "Mean score (0–100)",
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Active users (30d)",
      value: "8,200",
      desc: "Engagement window",
      icon: Activity,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Assessment completion",
      value: "68%",
      desc: "Completed / eligible",
      icon: CheckCircle2,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto bg-gradient-to-br from-background via-background to-muted/20 rounded-2xl border border-border shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">Partner insights overview</h3>
            <p className="text-sm text-muted-foreground">
              Illustrative layout aligned to the demo stack: trajectory → context → action → fit
            </p>
          </div>
        </div>
      </div>

      <p className="px-5 pt-4 text-xs text-muted-foreground">
        Synthetic sample only. Live data comes from{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-[11px]">GET /api/v1/dashboard/customers/insights</code>{" "}
        when enabled for your tenant.
      </p>

      <div className="px-5 pt-3">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1">
            <TrendingUp className="h-3 w-3" />
            Trajectory
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1">
            <Target className="h-3 w-3" />
            Context
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1">
            <Activity className="h-3 w-3" />
            Action
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1">
            <FileText className="h-3 w-3" />
            Fit
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {overviewCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{card.title}</p>
                      <p className="text-xl font-bold mt-1">{card.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{card.desc}</p>
                    </div>
                    <div className={`rounded-lg p-2 ${card.bg}`}>
                      <Icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Trajectory & risk distribution
              </CardTitle>
              <CardDescription className="text-xs">
                Portfolio trajectory and risk mix (sample)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Conservative", pct: 35, color: "bg-blue-500" },
                { label: "Moderate", pct: 45, color: "bg-primary" },
                { label: "Aggressive", pct: 20, color: "bg-orange-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-24">{item.label}</span>
                  <Progress value={item.pct} className="h-2 flex-1 [&>div]:bg-primary" />
                  <span className="text-xs font-medium w-8">{item.pct}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Context, action &amp; fit surfaces</CardTitle>
              <CardDescription className="text-xs">
                Preview labels aligned with RM workspace terms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[
                  "Archetype context",
                  "Decision-support action",
                  "Product-fit recommendation",
                  "Evidence lineage",
                ].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
