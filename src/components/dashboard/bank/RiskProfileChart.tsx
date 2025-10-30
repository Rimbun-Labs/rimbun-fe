import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useFormatters } from '@/hooks/useFormatters';
import type { RiskProfileDistribution } from '@/lib/api/types/bankInsights';

interface RiskProfileChartProps {
  data: RiskProfileDistribution;
}

const COLORS = {
  conservative: '#3b82f6', // blue
  moderate: '#10b981',      // green
  aggressive: '#f59e0b',   // orange
};

export const RiskProfileChart: React.FC<RiskProfileChartProps> = ({ data }) => {
  const { formatNumber } = useFormatters();

  const chartData = [
    {
      name: 'Conservative',
      value: data.conservative.count,
      percentage: data.conservative.percentage,
      color: COLORS.conservative,
    },
    {
      name: 'Moderate',
      value: data.moderate.count,
      percentage: data.moderate.percentage,
      color: COLORS.moderate,
    },
    {
      name: 'Aggressive',
      value: data.aggressive.count,
      percentage: data.aggressive.percentage,
      color: COLORS.aggressive,
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-popover border rounded-lg p-3 shadow-md">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm">
            {formatNumber(data.value)} customers ({data.payload.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {chartData.map((item) => (
          <div key={item.name} className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <p className="text-xl font-bold">{formatNumber(item.value)}</p>
            <p className="text-xs text-muted-foreground">
              {item.percentage.toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

