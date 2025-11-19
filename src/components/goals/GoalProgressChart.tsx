import { ReactNode, useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GoalProgressHistoryDto } from '@/lib/api/types/goals';
import { Skeleton } from '@/components/ui/skeleton';
import { useFormatters } from '@/hooks/useFormatters';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface GoalProgressChartProps {
  history?: GoalProgressHistoryDto;
  isLoading?: boolean;
  goalName?: string;
  headerExtras?: ReactNode;
}

export const GoalProgressChart = ({ history, isLoading, goalName, headerExtras }: GoalProgressChartProps) => {
  const { formatCurrency } = useFormatters();

  const chartData = useMemo(() => {
    if (!history?.snapshots?.length) return [];
    return [...history.snapshots]
      .sort((a, b) => (a.year === b.year ? a.month - b.month : a.year - b.year))
      .map((snapshot) => ({
        period: `${snapshot.year}-${String(snapshot.month).padStart(2, '0')}`,
        label: `${new Date(snapshot.year, snapshot.month - 1).toLocaleString('default', {
          month: 'short',
        })} ${String(snapshot.year).slice(-2)}`,
        currentAmount: snapshot.currentAmount,
        contribution: snapshot.contribution ?? 0,
        progress: snapshot.progressPercentage ?? 0,
      }));
  }, [history]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Goal Progress</CardTitle>
          <CardDescription>Tracking your savings momentum</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[320px] w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Goal Progress</CardTitle>
          <CardDescription>Tracking your savings momentum</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed py-12 text-center text-muted-foreground">
            No progress history yet. Start contributing to see monthly insights.
          </div>
        </CardContent>
      </Card>
    );
  }

  const { trends } = history!;
  const momentum =
    typeof trends?.momChange === 'number'
      ? trends.momChange > 0
        ? 'up'
        : trends.momChange < 0
        ? 'down'
        : 'flat'
      : null;

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>{goalName ? `${goalName} Progress` : 'Goal Progress'}</CardTitle>
            <CardDescription>Monthly contributions and balance growth</CardDescription>
          </div>
          {headerExtras && <div className="flex flex-wrap gap-2">{headerExtras}</div>}
        </div>
        {trends && (
          <div className="flex flex-wrap gap-3">
            {typeof trends.momChange === 'number' && (
              <Badge
                variant="outline"
                className={
                  momentum === 'up'
                    ? 'border-emerald-300 text-emerald-600 dark:border-emerald-500/50 dark:text-emerald-200'
                    : momentum === 'down'
                    ? 'border-rose-300 text-rose-600 dark:border-rose-500/50 dark:text-rose-200'
                    : 'text-muted-foreground'
                }
              >
                {momentum === 'up' && <TrendingUp className="mr-1.5 h-3.5 w-3.5" />}
                {momentum === 'down' && <TrendingDown className="mr-1.5 h-3.5 w-3.5" />}
                {momentum === 'flat' && <Activity className="mr-1.5 h-3.5 w-3.5" />}
                MoM change {trends.momChange > 0 ? '+' : ''}
                {trends.momChange.toFixed(1)}%
              </Badge>
            )}
            {typeof trends.averageMonthlyContribution === 'number' && (
              <Badge variant="secondary">
                Avg. contribution {formatCurrency(trends.averageMonthlyContribution)}
              </Badge>
            )}
            {trends.projectedCompletionDate && (
              <Badge variant="outline">
                Projected completion {new Date(trends.projectedCompletionDate).toLocaleDateString()}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number, name) =>
                  name === 'currentAmount' ? formatCurrency(value) : `${value.toFixed(1)}%`
                }
                labelFormatter={(value) => value}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="currentAmount"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary)/0.15)"
                name="Current amount"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(value) => value}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="contribution" fill="hsl(var(--muted-foreground))" radius={4} name="Monthly contribution" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalProgressChart;

