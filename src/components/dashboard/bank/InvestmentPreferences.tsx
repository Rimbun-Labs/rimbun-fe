import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFormatters } from '@/hooks/useFormatters';
import type { InvestmentPreferences } from '@/lib/api/types/bankInsights';

interface InvestmentPreferencesProps {
  data: InvestmentPreferences;
}

export const InvestmentPreferences: React.FC<InvestmentPreferencesProps> = ({ data }) => {
  const { formatNumber } = useFormatters();

  // Normalize percentages to 0–100 range to guard against double-multiplication
  // Accepts values as proportion (0–1), percent (0–100) or basis points (0–10000)
  const normalizePercentage = (value: number | undefined | null): number => {
    if (value === undefined || value === null || isNaN(Number(value))) return 0;
    const n = Number(value);
    if (n <= 1) return n * 100;         // proportion -> percent
    if (n > 1000) return n / 100;       // basis points -> percent
    if (n > 100) return n / 100;        // safety: values like 3333 -> 33.33
    return n;                           // already percent
  };

  // Prepare data for asset class chart
  const assetClassData = [
    {
      name: 'Equities',
      average: normalizePercentage(data.preferredAssetClasses.equities.average),
      median: normalizePercentage(data.preferredAssetClasses.equities.median),
    },
    {
      name: 'Bonds',
      average: normalizePercentage(data.preferredAssetClasses.bonds.average),
      median: normalizePercentage(data.preferredAssetClasses.bonds.median),
    },
    {
      name: 'Real Estate',
      average: normalizePercentage(data.preferredAssetClasses.realEstate.average),
      median: normalizePercentage(data.preferredAssetClasses.realEstate.median),
    },
    {
      name: 'Cash',
      average: normalizePercentage(data.preferredAssetClasses.cash.average),
      median: normalizePercentage(data.preferredAssetClasses.cash.median),
    },
  ];

  // Time horizon data
  const totalTimeHorizon = 
    data.timeHorizonPreferences.shortTerm +
    data.timeHorizonPreferences.mediumTerm +
    data.timeHorizonPreferences.longTerm;

  const timeHorizonData = [
    {
      name: 'Short Term (< 5 years)',
      value: data.timeHorizonPreferences.shortTerm,
      percentage: (data.timeHorizonPreferences.shortTerm / totalTimeHorizon) * 100,
    },
    {
      name: 'Medium Term (5-15 years)',
      value: data.timeHorizonPreferences.mediumTerm,
      percentage: (data.timeHorizonPreferences.mediumTerm / totalTimeHorizon) * 100,
    },
    {
      name: 'Long Term (> 15 years)',
      value: data.timeHorizonPreferences.longTerm,
      percentage: (data.timeHorizonPreferences.longTerm / totalTimeHorizon) * 100,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Asset Class Allocation */}
      <Card>
        <CardHeader>
          <CardTitle>Preferred Asset Class Allocation</CardTitle>
          <CardDescription>
            Average and median allocation percentages across customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={assetClassData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} tickFormatter={(v: number) => `${v}%`} />
              <Tooltip formatter={(value: number) => `${normalizePercentage(value).toFixed(1)}%`} />
              <Legend />
              <Bar dataKey="average" fill="#3b82f6" name="Average" />
              <Bar dataKey="median" fill="#10b981" name="Median" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Time Horizon Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Time Horizon Preferences</CardTitle>
          <CardDescription>
            Customer distribution by investment time horizon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeHorizonData.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm font-semibold">
                    {formatNumber(item.value)} ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

