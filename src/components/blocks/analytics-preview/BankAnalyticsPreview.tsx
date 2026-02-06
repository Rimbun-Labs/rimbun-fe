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
} from "lucide-react";

/**
 * Static preview of the Bank Analytics Dashboard for the For Banks landing page.
 * No real data or API calls—mock layout only.
 */
export const BankAnalyticsPreview: React.FC = () => {
  const overviewCards = [
    { title: "Total Customers", value: "12,450", desc: "Registered users", icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { title: "Health Score", value: "72%", desc: "Average financial health", icon: TrendingUp, color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30" },
    { title: "Active Users (30d)", value: "8,200", desc: "Active in last 30 days", icon: Activity, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30" },
    { title: "Assessment Completion", value: "68%", desc: "Completed assessments", icon: CheckCircle2, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/30" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto bg-gradient-to-br from-background via-background to-muted/20 rounded-2xl border border-border shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">Bank Analytics Dashboard</h3>
            <p className="text-sm text-muted-foreground">Preview — partner view</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5">
        {/* Overview cards */}
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

        {/* Risk profile + Engagement row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Risk Profile Distribution
              </CardTitle>
              <CardDescription className="text-xs">
                Breakdown of customer risk profiles
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
              <CardTitle className="text-base">Engagement & Segmentation</CardTitle>
              <CardDescription className="text-xs">
                Financial health, activity, and customer segments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["Engagement metrics", "Financial health", "Investment preferences", "Customer segments"].map((t) => (
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
