import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useSpendingHistory } from '@/hooks/useSpendingData';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useFormatters } from '@/hooks/useFormatters';

interface SpendingHistoryProps {
  userId: string;
  limit?: number;
}

const SpendingHistory: React.FC<SpendingHistoryProps> = ({ userId, limit }) => {
  const { data, isLoading, error } = useSpendingHistory(userId, { limit });
  const { formatCurrency } = useFormatters();

  // Format data for chart
  const chartData = useMemo(() => {
    if (!data?.periods) return [];

    return data.periods
      .sort((a, b) => {
        // Sort by year, then month
        if (a.periodYear !== b.periodYear) {
          return a.periodYear - b.periodYear;
        }
        return a.periodMonth - b.periodMonth;
      })
      .map((period) => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return {
          period: `${monthNames[period.periodMonth - 1]} ${period.periodYear}`,
          spending: period.monthlySpending,
          fullDate: `${period.periodYear}-${String(period.periodMonth).padStart(2, '0')}`,
        };
      });
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending History</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingState variant="expanded" lines={3} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending History</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load spending history. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.periods.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending History</CardTitle>
          <CardDescription>Track your spending over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No spending history available yet. Start by entering your spending data.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { trends } = data;
  const hasTrends = trends.momChange !== null;

  return (
    <div className="space-y-6">
      {/* Chart Card */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Over Time</CardTitle>
          <CardDescription>
            {limit ? `Last ${limit} months` : 'All time spending history'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="period" 
                  className="text-xs"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value)}
                  className="text-xs"
                />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="spending" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Monthly Spending"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Trends Summary */}
      {hasTrends && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Month-over-Month Change */}
          {trends.momChange !== null && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Month-over-Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {trends.momChange > 0 ? (
                    <TrendingUp className="h-4 w-4 text-red-500" />
                  ) : trends.momChange < 0 ? (
                    <TrendingDown className="h-4 w-4 text-green-500" />
                  ) : (
                    <Minus className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={`text-2xl font-bold ${
                    trends.momChange > 0 ? 'text-red-500' : 
                    trends.momChange < 0 ? 'text-green-500' : 
                    'text-muted-foreground'
                  }`}>
                    {Math.abs(trends.momChange).toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 3-Month Average */}
          {trends.threeMonthAverage !== null && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  3-Month Average
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(trends.threeMonthAverage)}</p>
              </CardContent>
            </Card>
          )}

          {/* 6-Month Average */}
          {trends.sixMonthAverage !== null && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  6-Month Average
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(trends.sixMonthAverage)}</p>
              </CardContent>
            </Card>
          )}

          {/* 12-Month Average */}
          {trends.twelveMonthAverage !== null && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  12-Month Average
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(trends.twelveMonthAverage)}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Periods Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Periods</CardTitle>
          <CardDescription>Detailed spending by month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-medium">Period</th>
                  <th className="text-right py-2 px-4 font-medium">Spending</th>
                  <th className="text-right py-2 px-4 font-medium">Emergency Fund</th>
                </tr>
              </thead>
              <tbody>
                {data.periods
                  .sort((a, b) => {
                    if (a.periodYear !== b.periodYear) {
                      return b.periodYear - a.periodYear;
                    }
                    return b.periodMonth - a.periodMonth;
                  })
                  .slice(0, 12)
                  .map((period) => {
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return (
                      <tr key={period.id} className="border-b">
                        <td className="py-2 px-4">
                          {monthNames[period.periodMonth - 1]} {period.periodYear}
                        </td>
                        <td className="text-right py-2 px-4 font-medium">
                          {formatCurrency(period.monthlySpending)}
                        </td>
                        <td className="text-right py-2 px-4 text-muted-foreground">
                          {formatCurrency(period.emergencyFundCurrent)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpendingHistory;

