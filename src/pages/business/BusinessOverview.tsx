import React from "react";
import { Link } from "react-router-dom";
import { BusinessWorkspaceShell } from "@/components/business/BusinessWorkspaceShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { businessWorkspaceBase } from "@/lib/businessPaths";

function money(
  value: string | number | null | undefined,
  currency = "USD",
): string {
  if (value == null || value === "") return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(n);
}

const BusinessOverviewPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => {
  return (
    <BusinessWorkspaceShell
      title="Business overview"
      description="Cash position, 30/60/90-day outlook, warnings, and recommended actions."
      customerIdOverride={customerIdOverride}
    >
      {(ws) => {
        const forecastCurrency =
          ws.forecast?.currency ?? ws.profile?.baseCurrency ?? null;
        const byCurrency = new Map<string, { total: number; count: number }>();
        for (const a of ws.accounts) {
          const ccy = (a.currency || "XXX").toUpperCase();
          const row = byCurrency.get(ccy) ?? { total: 0, count: 0 };
          row.total += Number(a.currentBalance ?? 0);
          row.count += 1;
          byCurrency.set(ccy, row);
        }
        const preferredCashCurrency =
          (ws.profile?.baseCurrency && byCurrency.has(ws.profile.baseCurrency)
            ? ws.profile.baseCurrency
            : null) ??
          [...byCurrency.keys()].sort(
            (a, b) =>
              (byCurrency.get(b)?.count ?? 0) - (byCurrency.get(a)?.count ?? 0),
          )[0] ??
          "USD";
        const cash = byCurrency.get(preferredCashCurrency)?.total ?? 0;
        const otherCurrencies = [...byCurrency.keys()].filter(
          (c) => c !== preferredCashCurrency,
        );
        const outlookCurrency = forecastCurrency ?? preferredCashCurrency;
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>
                    Cash position ({preferredCashCurrency})
                  </CardDescription>
                  <CardTitle className="text-2xl">
                    {money(cash, preferredCashCurrency)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {byCurrency.get(preferredCashCurrency)?.count ?? 0} account
                  {(byCurrency.get(preferredCashCurrency)?.count ?? 0) === 1
                    ? ""
                    : "s"}
                  {otherCurrencies.length > 0
                    ? ` · excluded ${otherCurrencies.join(", ")} (no FX)`
                    : ""}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>
                    30-day min
                    {forecastCurrency ? ` (${forecastCurrency})` : ""}
                  </CardDescription>
                  <CardTitle className="text-2xl">
                    {money(ws.forecast?.minBalance30d, outlookCurrency)}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>
                    60-day min
                    {forecastCurrency ? ` (${forecastCurrency})` : ""}
                  </CardDescription>
                  <CardTitle className="text-2xl">
                    {money(ws.forecast?.minBalance60d, outlookCurrency)}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>
                    90-day min
                    {forecastCurrency ? ` (${forecastCurrency})` : ""}
                  </CardDescription>
                  <CardTitle className="text-2xl">
                    {money(ws.forecast?.minBalance90d, outlookCurrency)}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => void ws.runForecast()}>
                Recalculate forecast
              </Button>
              <Button asChild variant="outline">
                <Link
                  to={`${businessWorkspaceBase(customerIdOverride)}/money-in`}
                >
                  Add money in
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link
                  to={`${businessWorkspaceBase(customerIdOverride)}/money-out`}
                >
                  Add money out
                </Link>
              </Button>
            </div>

            {!ws.forecast && (
              <Card>
                <CardHeader>
                  <CardTitle>No forecast yet</CardTitle>
                  <CardDescription>
                    Add account balances and dated receivables/obligations, then
                    recalculate for a single-currency baseline runway.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Warnings</CardTitle>
                  <CardDescription>
                    Explainable risks that need attention
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ws.warnings.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No open warnings.
                    </p>
                  ) : (
                    ws.warnings.slice(0, 6).map((w) => (
                      <div key={w.id} className="rounded-lg border p-3">
                        <div className="mb-1 flex items-center gap-2">
                          <Badge variant="outline">{w.severity}</Badge>
                          <span className="font-medium">{w.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {w.rationale}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recommended actions</CardTitle>
                  <CardDescription>
                    Operational next steps (not product pitches)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ws.actions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No open actions.
                    </p>
                  ) : (
                    ws.actions.slice(0, 6).map((a) => (
                      <div key={a.id} className="rounded-lg border p-3">
                        <div className="mb-1 flex items-center gap-2">
                          <Badge variant="outline">{a.priority}</Badge>
                          <span className="font-medium">{a.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {a.rationale}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {ws.profile && (
              <p className="text-xs text-muted-foreground">
                Subject: {ws.profile.legalName}
                {ws.profile.tradingName
                  ? ` (${ws.profile.tradingName})`
                  : ""} · {ws.profile.baseCurrency}
              </p>
            )}
          </div>
        );
      }}
    </BusinessWorkspaceShell>
  );
};

export default BusinessOverviewPage;
