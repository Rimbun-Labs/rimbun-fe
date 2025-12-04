import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ReferenceLine } from 'recharts';
import { useFormatters } from '@/hooks/useFormatters';
import { useTheme } from '@/hooks/useTheme';
import { generateEmergencyFundTimelineData, calculateEmergencyFundTimeline } from '@/utils/spendingCalculations';
import { Shield } from 'lucide-react';
import { DataQualityMetrics } from '@/utils/dataQuality';
import DataQualityIndicator from './DataQualityIndicator';

interface EmergencyFundTimelineChartProps {
  currentAmount: number;
  targetAmount: number;
  currentMonthlyContribution: number;
  scenarioMonthlyContribution: number;
  monthlySpending: number;
  dataQuality?: DataQualityMetrics | null;
}

/**
 * Component to visualize emergency fund growth timeline
 * Shows both current and scenario projections
 */
const EmergencyFundTimelineChart: React.FC<EmergencyFundTimelineChartProps> = ({
  currentAmount,
  targetAmount,
  currentMonthlyContribution,
  scenarioMonthlyContribution,
  monthlySpending,
  dataQuality,
}) => {
  const { formatCurrency } = useFormatters();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Calculate timeline
  const timeline = calculateEmergencyFundTimeline(
    currentAmount,
    targetAmount,
    currentMonthlyContribution,
    scenarioMonthlyContribution
  );

  // Generate chart data
  const chartData = generateEmergencyFundTimelineData(
    currentAmount,
    targetAmount,
    currentMonthlyContribution,
    scenarioMonthlyContribution,
    60 // Max 60 months
  );

  // Check if we have meaningful data to show
  const hasValidProjection = 
    targetAmount > 0 &&
    currentAmount < targetAmount &&
    (currentMonthlyContribution > 0 || scenarioMonthlyContribution > 0);

  // Check if chart would be meaningful
  // Need: valid projection AND chart data that shows growth (not just flat lines)
  const hasMeaningfulChartData = hasValidProjection && chartData.length > 1 && (
    // Check if current projection shows growth
    (currentMonthlyContribution > 0 && chartData.some(d => d.current > currentAmount)) ||
    // Check if scenario projection shows growth
    (scenarioMonthlyContribution > 0 && chartData.some(d => d.scenario > currentAmount))
  );

  // Calculate milestone amounts (3 months, 6 months coverage)
  const threeMonthsCoverage = monthlySpending * 3;
  const sixMonthsCoverage = monthlySpending * 6;

  // Format month number to actual date
  const formatMonthToDate = (monthNumber: number): string => {
    if (monthNumber === 0) return 'Now';
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setMonth(targetDate.getMonth() + monthNumber);
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[targetDate.getMonth()];
    const year = targetDate.getFullYear();
    
    // Show year only if it's different from current year or if it's more than 12 months away
    const currentYear = today.getFullYear();
    if (year === currentYear && monthNumber <= 12) {
      return month;
    }
    return `${month} ${year}`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover p-3 rounded-lg shadow-lg border border-border">
          <p className="font-medium text-popover-foreground mb-2">
            {formatMonthToDate(label)}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
          {label > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              {payload[0]?.value >= targetAmount ? 'Target reached!' : 
               `Remaining: ${formatCurrency(targetAmount - (payload[0]?.value || 0))}`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Format months for display
  const formatMonths = (months: number) => {
    if (months < 0) return 'N/A';
    if (months === 0) return 'Reached';
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths > 0 ? `${years}y ${remainingMonths}mo` : `${years} years`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Emergency Fund Timeline
            </CardTitle>
            <CardDescription>
              Projected growth of your emergency fund over time
            </CardDescription>
          </div>
          {dataQuality && (
            <div className="flex-shrink-0">
              <DataQualityIndicator quality={dataQuality} compact />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Current Projection</p>
            <p className="text-lg font-bold">
              {timeline.currentMonthsToTarget < 0 
                ? 'Target reached' 
                : timeline.currentMonthsToTarget === 0
                ? 'No contribution'
                : formatMonths(timeline.currentMonthsToTarget)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(currentMonthlyContribution)}/month
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Scenario Projection</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold">
                {timeline.scenarioMonthsToTarget < 0 
                  ? 'Target reached' 
                  : timeline.scenarioMonthsToTarget === 0
                  ? 'No contribution'
                  : formatMonths(timeline.scenarioMonthsToTarget)}
              </p>
              {timeline.monthsDifference !== 0 && timeline.currentMonthsToTarget >= 0 && timeline.scenarioMonthsToTarget >= 0 && (
                <span className={`text-sm font-medium ${timeline.isFaster ? 'text-green-600' : 'text-red-600'}`}>
                  {timeline.isFaster ? '↓' : '↑'} {Math.abs(timeline.monthsDifference)} months
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(scenarioMonthlyContribution)}/month
            </p>
          </div>
        </div>

        {/* Chart or Empty State */}
        {!hasValidProjection ? (
          <div className="h-64 w-full flex items-center justify-center border border-dashed rounded-lg bg-muted/30">
            <div className="text-center p-6 max-w-md">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-medium text-foreground mb-2">No Timeline Available</p>
              <p className="text-sm text-muted-foreground">
                {targetAmount <= 0 
                  ? "Set an emergency fund target to see your timeline projection."
                  : currentAmount >= targetAmount
                  ? "Congratulations! You've reached your emergency fund target."
                  : (currentMonthlyContribution <= 0 && scenarioMonthlyContribution <= 0)
                  ? "Allocate some savings to your emergency fund to see the timeline projection."
                  : "Adjust your emergency fund allocation to see the timeline projection."
                }
              </p>
            </div>
          </div>
        ) : !hasMeaningfulChartData ? (
          <div className="h-64 w-full flex items-center justify-center border border-dashed rounded-lg bg-muted/30">
            <div className="text-center p-6 max-w-md">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-medium text-foreground mb-2">Insufficient Data for Timeline</p>
              <p className="text-sm text-muted-foreground mb-4">
                The summary above shows your projections. Adjust your allocations to see a detailed timeline chart.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div className="p-3 bg-background rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">Current</p>
                  <p className="font-semibold">{formatCurrency(currentAmount)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(currentMonthlyContribution)}/mo
                  </p>
                </div>
                <div className="p-3 bg-background rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">Target</p>
                  <p className="font-semibold">{formatCurrency(targetAmount)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Gap: {formatCurrency(targetAmount - currentAmount)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorScenario" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  tickFormatter={formatMonthToDate}
                  className="text-xs"
                  stroke={isDarkMode ? '#94a3b8' : '#64748b'}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value)}
                  className="text-xs"
                  stroke={isDarkMode ? '#94a3b8' : '#64748b'}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  formatter={(value) => (
                    <span style={{ color: isDarkMode ? '#e2e8f0' : '#64748b' }}>
                      {value}
                    </span>
                  )}
                />
                {/* Milestone reference lines */}
                {threeMonthsCoverage < targetAmount && (
                  <ReferenceLine 
                    y={threeMonthsCoverage} 
                    stroke="#f59e0b" 
                    strokeDasharray="3 3" 
                    label={{ value: "3 months", position: "right", fill: "#f59e0b" }}
                  />
                )}
                {sixMonthsCoverage <= targetAmount && (
                  <ReferenceLine 
                    y={sixMonthsCoverage} 
                    stroke="#10b981" 
                    strokeDasharray="3 3" 
                    label={{ value: "6 months (target)", position: "right", fill: "#10b981" }}
                  />
                )}
                <ReferenceLine 
                  y={targetAmount} 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{ value: "Target", position: "right", fill: "#ef4444" }}
                />
                <Area
                  type="monotone"
                  dataKey="current"
                  name="Current Projection"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCurrent)"
                />
                <Area
                  type="monotone"
                  dataKey="scenario"
                  name="Scenario Projection"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fillOpacity={1}
                  fill="url(#colorScenario)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Current Fund:</strong> {formatCurrency(currentAmount)} | 
            <strong> Target:</strong> {formatCurrency(targetAmount)} | 
            <strong> Gap:</strong> {formatCurrency(targetAmount - currentAmount)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyFundTimelineChart;

