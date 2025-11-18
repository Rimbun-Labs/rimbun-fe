import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useSpendingTrends } from '@/hooks/useSpendingData';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, TrendingDown, Minus, ArrowUp, ArrowDown, ArrowRight, Lightbulb } from "lucide-react";
import { useFormatters } from '@/hooks/useFormatters';
import { Badge } from "@/components/ui/badge";

interface SpendingTrendsProps {
  userId: string;
}

const SpendingTrends: React.FC<SpendingTrendsProps> = ({ userId }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'3m' | '6m' | '12m'>('6m');
  const { data, isLoading, error } = useSpendingTrends(userId, selectedPeriod);
  const { formatCurrency } = useFormatters();

  // Format data for chart
  const chartData = data?.periods
    .sort((a, b) => {
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
      };
    }) || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Trends</CardTitle>
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
          <CardTitle>Spending Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load spending trends. Please try again later.
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
          <CardTitle>Spending Trends</CardTitle>
          <CardDescription>Analyze your spending patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Not enough data to show trends. Enter spending data for multiple months to see trends.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { trends, insights } = data;

  // Get velocity color and icon
  const getVelocityDisplay = (velocity: string) => {
    switch (velocity) {
      case 'increasing':
        return {
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          icon: ArrowUp,
          label: 'Increasing'
        };
      case 'decreasing':
        return {
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          icon: ArrowDown,
          label: 'Decreasing'
        };
      default:
        return {
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          icon: ArrowRight,
          label: 'Stable'
        };
    }
  };

  // Get trend direction display
  const getTrendDirectionDisplay = (direction: string) => {
    switch (direction) {
      case 'up':
        return {
          color: 'text-red-500',
          icon: TrendingUp,
          label: 'Upward'
        };
      case 'down':
        return {
          color: 'text-green-500',
          icon: TrendingDown,
          label: 'Downward'
        };
      default:
        return {
          color: 'text-muted-foreground',
          icon: Minus,
          label: 'Flat'
        };
    }
  };

  const velocityDisplay = getVelocityDisplay(trends.velocity);
  const trendDirectionDisplay = getTrendDirectionDisplay(trends.trendDirection);
  const VelocityIcon = velocityDisplay.icon;
  const TrendIcon = trendDirectionDisplay.icon;

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Analysis</CardTitle>
          <CardDescription>Select a time period to analyze</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === '3m' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('3m')}
              size="sm"
            >
              3 Months
            </Button>
            <Button
              variant={selectedPeriod === '6m' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('6m')}
              size="sm"
            >
              6 Months
            </Button>
            <Button
              variant={selectedPeriod === '12m' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('12m')}
              size="sm"
            >
              12 Months
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Velocity Indicator */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Spending Velocity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`flex items-center gap-2 p-3 rounded-lg ${velocityDisplay.bgColor}`}>
              <VelocityIcon className={`h-5 w-5 ${velocityDisplay.color}`} />
              <span className={`font-bold ${velocityDisplay.color}`}>
                {velocityDisplay.label}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Trend Direction */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Trend Direction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendIcon className={`h-5 w-5 ${trendDirectionDisplay.color}`} />
              <span className={`font-bold ${trendDirectionDisplay.color}`}>
                {trendDirectionDisplay.label}
              </span>
            </div>
          </CardContent>
        </Card>

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

        {/* Average Comparison */}
        {trends.threeMonthAverage !== null && trends.sixMonthAverage !== null && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">3M vs 6M</p>
                <p className="text-lg font-bold">
                  {((trends.threeMonthAverage / trends.sixMonthAverage - 1) * 100).toFixed(1)}%
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Trend</CardTitle>
          <CardDescription>
            {selectedPeriod === '3m' ? 'Last 3 months' : 
             selectedPeriod === '6m' ? 'Last 6 months' : 
             'Last 12 months'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
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
                {/* Average lines */}
                {trends.threeMonthAverage !== null && (
                  <Line 
                    type="monotone" 
                    dataKey={() => trends.threeMonthAverage} 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                    name="3M Average"
                  />
                )}
                {trends.sixMonthAverage !== null && (
                  <Line 
                    type="monotone" 
                    dataKey={() => trends.sixMonthAverage} 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    dot={false}
                    name="6M Average"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Averages Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Insights */}
      {insights && insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Insights
            </CardTitle>
            <CardDescription>Actionable insights based on your spending patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <p className="text-sm flex-1">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SpendingTrends;

