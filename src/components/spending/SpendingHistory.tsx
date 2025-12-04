import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useSpendingHistory, useSpendingTrends } from '@/hooks/useSpendingData';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, TrendingDown, Minus, ArrowUp, ArrowDown, ArrowRight, Lightbulb, BarChart3, History } from "lucide-react";
import { useFormatters } from '@/hooks/useFormatters';
import { Badge } from "@/components/ui/badge";
import { SpendingScenario } from './SpendingScenarioSimulator';

interface SpendingHistoryProps {
  userId: string;
  limit?: number;
  scenario?: SpendingScenario | null;
}

const SpendingHistory: React.FC<SpendingHistoryProps> = ({ userId, limit, scenario }) => {
  const [viewMode, setViewMode] = useState<'history' | 'trends'>('history');
  const [selectedPeriod, setSelectedPeriod] = useState<'3m' | '6m' | '12m'>('6m');
  
  const { data, isLoading, error } = useSpendingHistory(userId, { limit });
  const { data: trendsData, isLoading: trendsLoading, error: trendsError } = useSpendingTrends(userId, selectedPeriod);
  
  const { formatCurrency } = useFormatters();

  // Format data for history chart
  const historyChartData = useMemo(() => {
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

  // Format data for trends chart
  const trendsChartData = useMemo(() => {
    if (!trendsData?.periods) return [];

    return trendsData.periods
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
      });
  }, [trendsData]);

  // Calculate scenario projection data (for history view only)
  const scenarioProjectionData = useMemo(() => {
    if (!scenario || !historyChartData.length) return [];
    
    // Get the last data point
    const lastDataPoint = historyChartData[historyChartData.length - 1];
    const lastDate = new Date(lastDataPoint.fullDate + '-01');
    
    // Generate 6 months of projected data
    const projection = [];
    for (let i = 1; i <= 6; i++) {
      const projectedDate = new Date(lastDate);
      projectedDate.setMonth(projectedDate.getMonth() + i);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      projection.push({
        period: `${monthNames[projectedDate.getMonth()]} ${projectedDate.getFullYear()}`,
        spending: scenario.adjustedSpending,
        fullDate: `${projectedDate.getFullYear()}-${String(projectedDate.getMonth() + 1).padStart(2, '0')}`,
        isProjection: true,
      });
    }
    
    return projection;
  }, [scenario, historyChartData]);

  // Combine actual and projected data for chart
  const combinedChartData = useMemo(() => {
    if (viewMode === 'history' && scenario && scenarioProjectionData.length > 0) {
      // Combine actual and projected data, adding projection values to each point
      return [...historyChartData, ...scenarioProjectionData].map((point, index) => {
        if (point.isProjection) {
          return {
            ...point,
            projectedSpending: point.spending,
            spending: null, // Hide actual spending for projection points
          };
        }
        // For actual data points, add null for projection (will be filled by projection line)
        return {
          ...point,
          projectedSpending: null,
        };
      });
    }
    return viewMode === 'history' ? historyChartData : trendsChartData;
  }, [viewMode, historyChartData, trendsChartData, scenario, scenarioProjectionData]);

  // Helper functions for trends display
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

  const isLoadingData = viewMode === 'history' ? isLoading : trendsLoading;
  const errorData = viewMode === 'history' ? error : trendsError;

  if (isLoadingData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{viewMode === 'history' ? 'Spending History' : 'Spending Trends'}</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingState variant="expanded" lines={3} />
        </CardContent>
      </Card>
    );
  }

  if (errorData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{viewMode === 'history' ? 'Spending History' : 'Spending Trends'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load {viewMode === 'history' ? 'spending history' : 'spending trends'}. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Check if we have data for the current view
  const hasHistoryData = data && data.periods.length > 0;
  const hasTrendsData = trendsData && trendsData.periods.length > 0;

  if (viewMode === 'history' && !hasHistoryData) {
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

  if (viewMode === 'trends' && !hasTrendsData) {
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

  const { trends } = data || { trends: null };
  const hasTrends = trends?.momChange !== null;

  return (
    <div className="space-y-6">
      {/* View Toggle and Period Selector */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>
                {viewMode === 'history' ? 'Spending History' : 'Spending Trends'}
              </CardTitle>
              <CardDescription>
                {viewMode === 'history' 
                  ? (limit ? `Last ${limit} months` : 'All time spending history')
                  : 'Analyze your spending patterns over time'
                }
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
                <Button
                  variant={viewMode === 'history' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('history')}
                  className="h-8 px-3"
                >
                  <History className="h-4 w-4 mr-1" />
                  History
                </Button>
                <Button
                  variant={viewMode === 'trends' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('trends')}
                  className="h-8 px-3"
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Trends
                </Button>
              </div>
              {/* Period Selector (only for trends) */}
              {viewMode === 'trends' && (
                <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
                  <Button
                    variant={selectedPeriod === '3m' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedPeriod('3m')}
                    className="h-8 px-3"
                  >
                    3M
                  </Button>
                  <Button
                    variant={selectedPeriod === '6m' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedPeriod('6m')}
                    className="h-8 px-3"
                  >
                    6M
                  </Button>
                  <Button
                    variant={selectedPeriod === '12m' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedPeriod('12m')}
                    className="h-8 px-3"
                  >
                    12M
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={combinedChartData} 
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
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
                  formatter={(value: number, name: string, props: any) => {
                    const isProjection = props.payload?.isProjection;
                    return [
                      formatCurrency(value),
                      isProjection ? 'Projected Spending' : name
                    ];
                  }}
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
                {/* Scenario projection line */}
                {scenario && viewMode === 'history' && (
                  <Line 
                    type="monotone" 
                    dataKey="projectedSpending"
                    stroke="#10B981" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4, fill: '#10B981' }}
                    activeDot={{ r: 6 }}
                    name="Projected Spending"
                    connectNulls={true}
                  />
                )}
                {/* Average lines for trends view */}
                {viewMode === 'trends' && trendsData?.trends && (
                  <>
                    {trendsData.trends.threeMonthAverage !== null && (
                      <Line 
                        type="monotone" 
                        dataKey={() => trendsData.trends.threeMonthAverage} 
                        stroke="hsl(var(--muted-foreground))" 
                        strokeWidth={1}
                        strokeDasharray="5 5"
                        dot={false}
                        name="3M Average"
                      />
                    )}
                    {trendsData.trends.sixMonthAverage !== null && (
                      <Line 
                        type="monotone" 
                        dataKey={() => trendsData.trends.sixMonthAverage} 
                        stroke="hsl(var(--muted-foreground))" 
                        strokeWidth={1}
                        strokeDasharray="3 3"
                        dot={false}
                        name="6M Average"
                      />
                    )}
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Trends Summary - Only show for history view */}
      {viewMode === 'history' && hasTrends && (
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

      {/* Periods Table - Only for history view */}
      {viewMode === 'history' && (
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
                  {data?.periods
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
      )}

      {/* Trends View Content */}
      {viewMode === 'trends' && trendsData && (
        <>
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
                {(() => {
                  const velocityDisplay = getVelocityDisplay(trendsData.trends.velocity);
                  const VelocityIcon = velocityDisplay.icon;
                  return (
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${velocityDisplay.bgColor}`}>
                      <VelocityIcon className={`h-5 w-5 ${velocityDisplay.color}`} />
                      <span className={`font-bold ${velocityDisplay.color}`}>
                        {velocityDisplay.label}
                      </span>
                    </div>
                  );
                })()}
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
                {(() => {
                  const trendDirectionDisplay = getTrendDirectionDisplay(trendsData.trends.trendDirection);
                  const TrendIcon = trendDirectionDisplay.icon;
                  return (
                    <div className="flex items-center gap-2">
                      <TrendIcon className={`h-5 w-5 ${trendDirectionDisplay.color}`} />
                      <span className={`font-bold ${trendDirectionDisplay.color}`}>
                        {trendDirectionDisplay.label}
                      </span>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Month-over-Month Change */}
            {trendsData.trends.momChange !== null && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Month-over-Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {trendsData.trends.momChange > 0 ? (
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    ) : trendsData.trends.momChange < 0 ? (
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={`text-2xl font-bold ${
                      trendsData.trends.momChange > 0 ? 'text-red-500' : 
                      trendsData.trends.momChange < 0 ? 'text-green-500' : 
                      'text-muted-foreground'
                    }`}>
                      {Math.abs(trendsData.trends.momChange).toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Average Comparison */}
            {trendsData.trends.threeMonthAverage !== null && trendsData.trends.sixMonthAverage !== null && (
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
                      {((trendsData.trends.threeMonthAverage / trendsData.trends.sixMonthAverage - 1) * 100).toFixed(1)}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Averages Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trendsData.trends.threeMonthAverage !== null && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    3-Month Average
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{formatCurrency(trendsData.trends.threeMonthAverage)}</p>
                </CardContent>
              </Card>
            )}

            {trendsData.trends.sixMonthAverage !== null && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    6-Month Average
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{formatCurrency(trendsData.trends.sixMonthAverage)}</p>
                </CardContent>
              </Card>
            )}

            {trendsData.trends.twelveMonthAverage !== null && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    12-Month Average
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{formatCurrency(trendsData.trends.twelveMonthAverage)}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Insights */}
          {trendsData.insights && trendsData.insights.length > 0 && (
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
                  {trendsData.insights.map((insight, index) => (
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
        </>
      )}
    </div>
  );
};

export default SpendingHistory;

