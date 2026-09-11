import React from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BusinessOverviewWeeklyPoint } from "@/lib/api/businessApi";

type Props = {
  currency: string;
  points: BusinessOverviewWeeklyPoint[];
  /** Optional second series (plan overlay projected cash). */
  overlayPoints?: BusinessOverviewWeeklyPoint[];
  onSelectWeek?: (point: BusinessOverviewWeeklyPoint) => void;
};

function formatMoney(n: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

export function WeeklyForecastChart({
  currency,
  points,
  overlayPoints,
  onSelectWeek,
}: Props) {
  if (!points.length) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Weekly forecast points appear after the outlook is calculated.
      </p>
    );
  }

  const overlayByWeek = new Map(
    (overlayPoints ?? []).map((p) => [p.week, p.projectedBalance]),
  );
  const data = points.map((p) => ({
    ...p,
    overlayBalance: overlayByWeek.get(p.week) ?? null,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          onClick={(state) => {
            const payload = (
              state as {
                activePayload?: Array<{ payload: BusinessOverviewWeeklyPoint }>;
              }
            )?.activePayload?.[0]?.payload;
            if (payload && onSelectWeek) onSelectWeek(payload);
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="week"
            tickFormatter={(w) => `W${w}`}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(v) =>
              new Intl.NumberFormat(undefined, {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(Number(v))
            }
            tick={{ fontSize: 12 }}
            width={56}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              formatMoney(value, currency),
              name,
            ]}
            labelFormatter={(_, payload) => {
              const p = payload?.[0]?.payload as
                | BusinessOverviewWeeklyPoint
                | undefined;
              return p ? `Week ${p.week} · ${p.date}` : "";
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="confirmedNet"
            name="Confirmed net"
            stackId="flow"
            fill="hsl(var(--chart-1))"
            stroke="hsl(var(--chart-1))"
            fillOpacity={0.25}
          />
          <Area
            type="monotone"
            dataKey="expectedNet"
            name="Expected net"
            stackId="flow"
            fill="hsl(var(--chart-2))"
            stroke="hsl(var(--chart-2))"
            fillOpacity={0.2}
          />
          <Area
            type="monotone"
            dataKey="plannedNet"
            name="Planned net"
            stackId="flow"
            fill="hsl(var(--chart-3))"
            stroke="hsl(var(--chart-3))"
            fillOpacity={0.2}
          />
          <Line
            type="monotone"
            dataKey="projectedBalance"
            name="Baseline cash"
            stroke="hsl(var(--foreground))"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          {overlayPoints && overlayPoints.length > 0 ? (
            <Line
              type="monotone"
              dataKey="overlayBalance"
              name="With plan"
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={{ r: 2 }}
              connectNulls
            />
          ) : null}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
