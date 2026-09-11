import React from "react";
import {
  CartesianGrid,
  ComposedChart,
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
  /** Dashed series when user compares with plan. */
  overlayPoints?: BusinessOverviewWeeklyPoint[];
  onSelectWeek?: (point: BusinessOverviewWeeklyPoint) => void;
};

const COLORS = {
  cash: "#0f172a",
  withPlan: "#64748b",
};

function formatMoney(n: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

function LegendItem({
  color,
  label,
  dashed,
}: {
  color: string;
  label: string;
  dashed?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span
        className="inline-block w-5 border-t-2"
        style={{
          borderColor: color,
          borderStyle: dashed ? "dashed" : "solid",
        }}
      />
      {label}
    </span>
  );
}

/**
 * Owner-facing cash outlook: projected balance over weeks.
 * Weekly flow breakdown lives in week detail, not on the chart face.
 */
export function WeeklyForecastChart({
  currency,
  points,
  overlayPoints,
  onSelectWeek,
}: Props) {
  if (!points.length) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Weekly outlook appears after cash is calculated.
      </p>
    );
  }

  const showPlan = Boolean(overlayPoints && overlayPoints.length > 0);

  const overlayByWeek = new Map(
    (overlayPoints ?? []).map((p) => [p.week, p.projectedBalance]),
  );
  const data = points.map((p) => ({
    week: p.week,
    date: p.date,
    expectedCash: p.projectedBalance,
    withPlan: overlayByWeek.get(p.week) ?? null,
    _point: p,
  }));

  return (
    <div className="w-full space-y-3">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 12, right: 16, left: 12, bottom: 28 }}
            onClick={(state) => {
              const row = (
                state as {
                  activePayload?: Array<{
                    payload: { _point: BusinessOverviewWeeklyPoint };
                  }>;
                }
              )?.activePayload?.[0]?.payload;
              if (row?._point && onSelectWeek) onSelectWeek(row._point);
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="week"
              tickFormatter={(w) => `W${w}`}
              tick={{ fontSize: 12, fill: "#64748b" }}
              label={{
                value: "Week",
                position: "insideBottom",
                offset: -14,
                style: { fontSize: 12, fill: "#64748b" },
              }}
            />
            <YAxis
              tickFormatter={(v) =>
                new Intl.NumberFormat(undefined, {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(Number(v))
              }
              tick={{ fontSize: 12, fill: "#64748b" }}
              width={68}
              label={{
                value: `Cash (${currency})`,
                angle: -90,
                position: "insideLeft",
                offset: 4,
                style: { fontSize: 12, fill: "#64748b" },
              }}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatMoney(Number(value), currency),
                name,
              ]}
              labelFormatter={(_, payload) => {
                const row = payload?.[0]?.payload as
                  | { week: number; date: string }
                  | undefined;
                return row ? `Week ${row.week} · ${row.date}` : "";
              }}
            />
            <Line
              type="monotone"
              dataKey="expectedCash"
              name="Expected cash"
              stroke={COLORS.cash}
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: "#fff", stroke: COLORS.cash, strokeWidth: 2 }}
              activeDot={{ r: 5 }}
            />
            {showPlan ? (
              <Line
                type="monotone"
                dataKey="withPlan"
                name="With plan"
                stroke={COLORS.withPlan}
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={{
                  r: 2.5,
                  fill: "#fff",
                  stroke: COLORS.withPlan,
                  strokeWidth: 2,
                }}
                connectNulls
              />
            ) : null}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-2">
        <LegendItem color={COLORS.cash} label="Expected cash" />
        {showPlan ? (
          <LegendItem color={COLORS.withPlan} label="With plan" dashed />
        ) : null}
      </div>
    </div>
  );
}
