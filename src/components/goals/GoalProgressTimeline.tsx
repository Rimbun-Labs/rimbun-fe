import { useMemo } from 'react';
import {
  Line,
  LineChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useFormatters } from '@/hooks/useFormatters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  GoalWithInsightsDto,
  GoalFamilyId,
  GoalFamilySlug,
  GoalFamilySummaryDto,
} from '@/lib/api/types/goals';
import {
  getGoalFamilyConfigBySlug,
} from '@/lib/constants/goalFamilies';

interface GoalProgressTimelineProps {
  goals?: GoalWithInsightsDto[];
  isLoading?: boolean;
  familySummaries?: GoalFamilySummaryDto[];
  selectedFamilyId?: string | null;
  onFamilyFilterChange?: (familyId: string | 'all') => void;
  showStrategyComparison?: boolean;
  comparisonGoals?: GoalWithInsightsDto[];
}

// Calculate projected amount for a goal at a given time point
const calculateProjectedAmount = (
  currentAmount: number,
  monthlyContribution: number,
  targetAmount: number,
  monthsFromNow: number
): number => {
  // Simple linear projection: current + (monthly * months)
  const projected = currentAmount + monthlyContribution * monthsFromNow;
  // Cap at target amount
  return Math.min(projected, targetAmount);
};

// Get target date in months from now
const getTargetMonths = (goal: GoalWithInsightsDto): number | null => {
  if (goal.targetDate) {
    const targetDate = new Date(goal.targetDate);
    const now = new Date();
    const monthsDiff = (targetDate.getFullYear() - now.getFullYear()) * 12 + 
                       (targetDate.getMonth() - now.getMonth());
    return Math.max(0, monthsDiff);
  }
  if (goal.investmentHorizon) {
    return goal.investmentHorizon * 12;
  }
  return null;
};

export const GoalProgressTimeline = ({
  goals = [],
  isLoading,
  familySummaries,
  selectedFamilyId,
  onFamilyFilterChange,
  showStrategyComparison = false,
  comparisonGoals,
}: GoalProgressTimelineProps) => {
  const { formatCurrency } = useFormatters();

  const familyMetaMap = useMemo(() => {
    const map = new Map<string, GoalFamilySummaryDto>();
    familySummaries?.forEach((family) => {
      map.set(family.id, family);
      map.set(family.slug, family);
    });
    return map;
  }, [familySummaries]);

  const getFamilyLabel = (familyId: string) => {
    // First check if it's in the family summaries (has displayName)
    const meta = familyMetaMap.get(familyId);
    if (meta) return meta.displayName;

    // Try as slug (with hyphens)
    const configBySlug = getGoalFamilyConfigBySlug(familyId);
    if (configBySlug) return configBySlug.label;

    // If familyId is a UUID, we can't resolve it here - return generic
    return 'Uncategorized';
  };

const paletteFallback = [
  'hsl(var(--primary))',
  'hsl(0, 84%, 60%)',
  'hsl(217, 91%, 60%)',
  'hsl(270, 70%, 60%)',
  'hsl(188, 94%, 50%)',
  'hsl(330, 81%, 60%)',
  'hsl(42, 90%, 60%)',
  'hsl(120, 70%, 50%)',
];

const getFamilyColor = (familyId: string, index: number): string => {
  // Try to get config by slug (familyId could be UUID or slug)
  const config = getGoalFamilyConfigBySlug(familyId);

  if (config?.slug) {
    const colorMap: Record<GoalFamilySlug, string> = {
      'invest-grow': 'hsl(var(--primary))',
      'debt-obligations': 'hsl(0, 84%, 60%)',
      'lifestyle-milestones': 'hsl(330, 81%, 60%)',
      'risk-protection': 'hsl(217, 91%, 60%)',
      'values-legacy': 'hsl(270, 70%, 60%)',
      'liquidity-resilience': 'hsl(188, 94%, 50%)',
    };
    if (colorMap[config.slug]) {
      return colorMap[config.slug];
    }
  }

  return paletteFallback[index % paletteFallback.length];
};

  // Filter goals by family if selected
  const filteredGoals = useMemo(() => {
    if (!goals.length) return [];
    if (selectedFamilyId && selectedFamilyId !== 'all') {
      return goals.filter((g) => g.primaryFamilyId === selectedFamilyId);
    }
    return goals;
  }, [goals, selectedFamilyId]);

  // Calculate time range and create time buckets
  const chartData = useMemo(() => {
    if (!filteredGoals.length) return [];

    // Find the furthest target date/horizon
    let maxMonths = 0;
    filteredGoals.forEach((goal) => {
      const targetMonths = getTargetMonths(goal);
      if (targetMonths !== null) {
        maxMonths = Math.max(maxMonths, targetMonths);
      }
    });

    // Default to 20 years if no target dates
    if (maxMonths === 0) {
      maxMonths = 20 * 12;
    }

    // Create time buckets (every 6 months, or every year for longer horizons)
    const bucketInterval = maxMonths > 10 * 12 ? 12 : 6; // Yearly if > 10 years, else 6 months
    const timeBuckets: number[] = [];
    for (let months = 0; months <= maxMonths; months += bucketInterval) {
      timeBuckets.push(months);
    }

    // Create data points for each time bucket
    const dataPoints = timeBuckets.map((months) => {
      const year = Math.floor(months / 12);
      const date = new Date();
      date.setMonth(date.getMonth() + months);

      const dataPoint: Record<string, string | number> = {
        months,
        year: date.getFullYear(),
        label:
          months === 0
            ? 'Now'
            : date.toLocaleString('default', {
                month: bucketInterval === 12 ? undefined : 'short',
                year: 'numeric',
              }),
      };

      // Calculate projected amount for each goal at this time point
      filteredGoals.forEach((goal) => {
        const currentAmount = Number(goal.currentAmount ?? 0);
        const monthlyContribution = Number(goal.monthlyContribution ?? 0);
        const targetAmount = Number(goal.targetAmount ?? 0);
        const goalName = goal.goalName;
        
        // Use goal name as key (sanitized for chart)
        const key = goalName.replace(/[^a-zA-Z0-9]/g, '_');
        dataPoint[key] = calculateProjectedAmount(
          currentAmount,
          monthlyContribution,
          targetAmount,
          months
        );
      });

      // Add comparison data if enabled
      if (showStrategyComparison && comparisonGoals?.length) {
        const comparisonFiltered = selectedFamilyId && selectedFamilyId !== 'all'
          ? comparisonGoals.filter((g) => g.primaryFamilyId === selectedFamilyId)
          : comparisonGoals;

        comparisonFiltered.forEach((goal) => {
          const currentAmount = Number(goal.currentAmount ?? 0);
          const monthlyContribution = Number(goal.monthlyContribution ?? 0);
          const targetAmount = Number(goal.targetAmount ?? 0);
          const goalName = goal.goalName;
          
          const key = `${goalName.replace(/[^a-zA-Z0-9]/g, '_')}_comparison`;
          dataPoint[key] = calculateProjectedAmount(
            currentAmount,
            monthlyContribution,
            targetAmount,
            months
          );
        });
      }

      return dataPoint;
    });

    return dataPoints;
  }, [filteredGoals, showStrategyComparison, comparisonGoals, selectedFamilyId]);

  // Prepare goal metadata for lines (main goals)
  const goalLines = useMemo(() => {
    return filteredGoals.map((goal, index) => {
      const familyId = goal.primaryFamilyId || 'uncategorized';
      const goalName = goal.goalName;
      const key = goalName.replace(/[^a-zA-Z0-9]/g, '_');
      
      return {
        key,
        name: goalName,
        familyId,
        familyLabel: getFamilyLabel(familyId),
        color: getFamilyColor(familyId, index),
        currentAmount: Number(goal.currentAmount ?? 0),
        targetAmount: Number(goal.targetAmount ?? 0),
      };
    });
  }, [filteredGoals, familyMetaMap]);

  // Prepare comparison goal lines if enabled
  const comparisonGoalLines = useMemo(() => {
    if (!showStrategyComparison || !comparisonGoals?.length) return [];
    
    const comparisonFiltered = selectedFamilyId && selectedFamilyId !== 'all'
      ? comparisonGoals.filter((g) => g.primaryFamilyId === selectedFamilyId)
      : comparisonGoals;

    return comparisonFiltered.map((goal, index) => {
      const familyId = goal.primaryFamilyId || 'uncategorized';
      const goalName = goal.goalName;
      const key = `${goalName.replace(/[^a-zA-Z0-9]/g, '_')}_comparison`;
      
      return {
        key,
        name: `${goalName} (Current)`,
        familyId,
        familyLabel: getFamilyLabel(familyId),
        color: 'hsl(var(--muted-foreground))',
        currentAmount: Number(goal.currentAmount ?? 0),
        targetAmount: Number(goal.targetAmount ?? 0),
      };
    });
  }, [showStrategyComparison, comparisonGoals, selectedFamilyId, familyMetaMap]);

  // Limit to top 8 goals to keep chart readable
  const displayGoals = useMemo(() => {
    return goalLines
      .sort((a, b) => b.targetAmount - a.targetAmount)
      .slice(0, 8);
  }, [goalLines]);

  // Limit comparison goals to match display goals
  const displayComparisonGoals = useMemo(() => {
    if (!showStrategyComparison || !comparisonGoalLines.length) return [];
    const displayGoalNames = new Set(displayGoals.map(g => g.name));
    return comparisonGoalLines
      .filter(g => displayGoalNames.has(g.name.replace(' (Current)', '')))
      .slice(0, 8);
  }, [showStrategyComparison, comparisonGoalLines, displayGoals]);

  const totalTarget = filteredGoals.reduce(
    (sum, goal) => sum + Number(goal.targetAmount ?? 0),
    0
  );
  const totalCurrent = filteredGoals.reduce(
    (sum, goal) => sum + Number(goal.currentAmount ?? 0),
    0
  );
  const totalProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  // Get unique families for filter
  const families = useMemo(() => {
    if (familySummaries?.length) {
      return familySummaries.map((family) => ({
        id: family.id,
        label: family.displayName,
      }));
    }

    const familySet = new Map<string, string>();
    goals.forEach((goal) => {
      if (!goal.primaryFamilyId) return;
      familySet.set(goal.primaryFamilyId, getFamilyLabel(goal.primaryFamilyId));
    });
    return Array.from(familySet.entries()).map(([id, label]) => ({ id, label }));
  }, [familySummaries, goals]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Goal Progress Timeline</CardTitle>
          <CardDescription>Visualize your financial goals over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (!goals.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Goal Progress Timeline</CardTitle>
          <CardDescription>Visualize your financial goals over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed py-12 text-center text-muted-foreground">
            No goals yet. Create your first goal to see progress visualization.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Goal Progress Timeline</CardTitle>
            <CardDescription>Visualize your financial goals over time</CardDescription>
          </div>
          {onFamilyFilterChange && families.length > 0 && (
            <Select
              value={selectedFamilyId || 'all'}
              onValueChange={(value) => onFamilyFilterChange(value as string | 'all')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All families" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All families</SelectItem>
                {families.map((family) => (
                  <SelectItem key={family.id} value={family.id}>
                    {family.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-dashed p-3">
            <p className="text-xs uppercase text-muted-foreground">Total Saved</p>
            <p className="mt-1 text-xl font-semibold">{formatCurrency(totalCurrent)}</p>
          </div>
          <div className="rounded-lg border border-dashed p-3">
            <p className="text-xs uppercase text-muted-foreground">Total Target</p>
            <p className="mt-1 text-xl font-semibold">{formatCurrency(totalTarget)}</p>
          </div>
          <div className="rounded-lg border border-dashed p-3">
            <p className="text-xs uppercase text-muted-foreground">Overall Progress</p>
            <p className="mt-1 text-xl font-semibold">{Math.round(totalProgress)}%</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  if (value === 'Now') return 'Now';
                  return value;
                }}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fontSize: 12 }}
                domain={[0, 'dataMax']}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Year: ${label}`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value, entry) => {
                  const goal = displayGoals.find(g => g.key === value);
                  return goal?.name || value;
                }}
              />
              {/* Comparison lines (current) - shown as dashed gray */}
              {showStrategyComparison && displayComparisonGoals.map((goal) => (
                <Line
                  key={goal.key}
                  type="monotone"
                  dataKey={goal.key}
                  stroke={goal.color}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                  name={goal.key}
                  opacity={0.6}
                />
              ))}
              {/* Main lines (strategy) */}
              {displayGoals.map((goal) => (
                <Line
                  key={goal.key}
                  type="monotone"
                  dataKey={goal.key}
                  stroke={goal.color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name={goal.key}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        {goalLines.length > displayGoals.length && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Showing top {displayGoals.length} goals by target amount. {goalLines.length - displayGoals.length} more goals not displayed.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalProgressTimeline;
