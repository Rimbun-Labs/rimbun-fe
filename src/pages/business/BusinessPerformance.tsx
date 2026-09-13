import React, { useEffect, useState } from "react";
import { BusinessWorkspaceShell } from "@/components/business/BusinessWorkspaceShell";
import { Button } from "@/components/ui/button";
import {
  getBusinessPerformance,
  type BusinessPerformanceMoney,
  type BusinessPerformanceSnapshot,
} from "@/lib/api/businessApi";
import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PERIODS = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
] as const;

function money(
  value: BusinessPerformanceMoney | string | number | null | undefined,
  currency?: string,
): string {
  if (value == null || value === "") return "—";
  if (typeof value === "object") {
    return money(value.amount, value.currency);
  }
  const n = Number(value);
  const ccy = currency || "IDR";
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: ccy,
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 border-b pb-6 last:border-0 last:pb-0">
      <div>
        <h2 className="text-sm font-medium">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function CollectionsChart({
  rows,
  currency,
}: {
  rows: BusinessPerformanceSnapshot["collectionsOverTime"];
  currency: string;
}) {
  const chartData = rows.map((row) => ({
    date: row.date,
    gross: Number(row.grossAmount),
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />
          <YAxis
            tickFormatter={(value) =>
              new Intl.NumberFormat(undefined, {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(Number(value))
            }
            tick={{ fontSize: 12, fill: "#64748b" }}
            width={64}
          />
          <Tooltip
            formatter={(value: number) => [
              money(Number(value), currency),
              "Gross collections",
            ]}
            labelFormatter={(label) => formatDate(String(label))}
          />
          <Bar
            dataKey="gross"
            name="Gross collections"
            fill="#0f766e"
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const BusinessPerformancePage: React.FC<{
  customerIdOverride?: string;
}> = ({ customerIdOverride }) => {
  return (
    <BusinessWorkspaceShell
      title="Performance"
      description="Collections, fees, and expected payouts from connected payment providers."
      customerIdOverride={customerIdOverride}
    >
      {(ws) => <PerformanceBody customerId={ws.customerId} />}
    </BusinessWorkspaceShell>
  );
};

function PerformanceBody({ customerId }: { customerId: string }) {
  const [days, setDays] = useState<number>(30);
  const [data, setData] = useState<BusinessPerformanceSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getBusinessPerformance(customerId, { days })
      .then((snap) => {
        if (!cancelled) setData(snap);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not load performance",
          );
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [customerId, days]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <Button
            key={p.days}
            size="sm"
            variant={days === p.days ? "default" : "outline"}
            onClick={() => setDays(p.days)}
          >
            {p.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {!loading && data && !data.hasProcessorActivity ? (
        <p className="text-sm text-muted-foreground">
          No collection activity in this period yet. Sync a payment connection
          or import settlement data to see performance here.
        </p>
      ) : null}

      {!loading && data && data.hasProcessorActivity ? (
        <>
          <Section
            title="Summary"
            description="Gross collections and fees from payment activity in this period."
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              <Metric
                label="Overall collections"
                value={money(data.overallCollections)}
              />
              <Metric
                label="Fees and deductions"
                value={money(data.feesAndDeductions)}
              />
              <Metric
                label="Net proceeds"
                value={money(data.netProceeds)}
                hint="Expected after fees — not bank cash yet"
              />
              <Metric
                label="Refunds and reversals"
                value={money(data.refundsAndReversals)}
              />
              <Metric
                label="Successful payments"
                value={String(data.transactionVolume)}
              />
            </div>
          </Section>

          <Section
            title="Collections over time"
            description="Successful gross collections by day."
          >
            {data.collectionsOverTime.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No daily activity.
              </p>
            ) : (
              <CollectionsChart
                rows={data.collectionsOverTime}
                currency={data.currency}
              />
            )}
          </Section>

          <Section
            title="Channel mix"
            description="Where collections came from in this period."
          >
            {data.channelMix.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No channel detail available.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {data.channelMix.map((ch) => (
                  <li
                    key={ch.channel}
                    className="flex flex-wrap items-center justify-between gap-2"
                  >
                    <span>
                      {ch.channel}{" "}
                      <span className="text-muted-foreground">
                        · {ch.transactionCount}
                      </span>
                    </span>
                    <span className="tabular-nums">
                      {money(ch.grossAmount, ch.currency)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section
            title="Expected payouts"
            description="Expected processor proceeds that Rimbun has not matched to a bank deposit."
          >
            <Metric
              label="Not yet matched"
              value={money(data.expectedPayouts.total)}
              hint={
                data.expectedPayouts.count === 0
                  ? "None outstanding"
                  : `${data.expectedPayouts.count} payout(s)`
              }
            />
            {data.expectedPayouts.items.length > 0 ? (
              <ul className="mt-3 space-y-2 text-sm">
                {data.expectedPayouts.items.map((item, i) => (
                  <li
                    key={`${item.label}-${item.expectedDate}-${i}`}
                    className="flex flex-wrap justify-between gap-2"
                  >
                    <span>
                      {item.label}
                      <span className="text-muted-foreground">
                        {" "}
                        · {formatDate(item.expectedDate)}
                      </span>
                    </span>
                    <span className="tabular-nums">
                      {money(item.amount, item.currency)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </Section>

          <Section
            title="Matched bank deposits"
            description="Processor payouts matched to imported bank activity in the selected period."
          >
            {data.actualDeposited == null ? (
              <p className="text-sm text-muted-foreground">
                Actual deposited amounts appear after bank accounts are in the
                workspace and payouts are matched.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                <Metric
                  label="Matched deposits"
                  value={money(data.actualDeposited)}
                />
                {data.unmatchedPayoutDifference ? (
                  <Metric
                    label="Unmatched payout difference"
                    value={money(data.unmatchedPayoutDifference)}
                    hint="Expected payouts not yet matched to bank deposits"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground self-end">
                    No unmatched payouts right now.
                  </p>
                )}
              </div>
            )}
          </Section>

          {data.caveats.length > 0 ? (
            <ul className="space-y-1 text-sm text-muted-foreground">
              {data.caveats.map((c) => (
                <li key={c} className={cn("leading-snug")}>
                  {c}
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

export default BusinessPerformancePage;
