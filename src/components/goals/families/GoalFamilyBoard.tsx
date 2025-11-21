import { GoalFamilyBoardDto } from '@/lib/api/types/goals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getGoalFamilyConfigBySlug } from '@/lib/constants/goalFamilies';

interface GoalFamilyBoardProps {
  board?: GoalFamilyBoardDto;
  isLoading?: boolean;
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const GoalFamilyBoard = ({ board, isLoading }: GoalFamilyBoardProps) => {
  if (isLoading) {
    return <Skeleton className="h-72 w-full rounded-xl" />;
  }

  if (!board) {
    return (
      <Card className="border-dashed border-muted">
        <CardContent className="py-16 text-center text-muted-foreground">
          Select a family card to see its board.
        </CardContent>
      </Card>
    );
  }

  const config = getGoalFamilyConfigBySlug(board.family.slug);
  const stats = board.stats ?? {
    totalGoals: 0,
    activeGoals: 0,
    totalTargetAmount: 0,
    totalCurrentAmount: 0,
    overallProgress: 0,
    averageProgress: 0,
  };
  const avgProgress = stats.averageProgress ?? 0;
  const columns = board.columns ?? [];

  return (
    <Card className="border-muted">
      <CardHeader className="gap-2">
        <div className="flex items-center gap-3">
          {config?.icon && (
            <span className="rounded-full bg-muted p-2">
              <config.icon className={`h-5 w-5 ${config?.accentColor}`} />
            </span>
          )}
          <div>
            <CardTitle className="text-xl">{board.family.displayName}</CardTitle>
            <p className="text-sm text-muted-foreground">{board.family.description}</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-dashed p-3 text-sm">
            <p className="text-xs uppercase text-muted-foreground">Goals</p>
            <p className="mt-1 text-xl font-semibold">{stats.totalGoals}</p>
          </div>
          <div className="rounded-lg border border-dashed p-3 text-sm">
            <p className="text-xs uppercase text-muted-foreground">Active</p>
            <p className="mt-1 text-xl font-semibold">{stats.activeGoals}</p>
          </div>
          <div className="rounded-lg border border-dashed p-3 text-sm">
            <p className="text-xs uppercase text-muted-foreground">Current</p>
            <p className="mt-1 text-lg font-semibold">
              {currency.format(stats.totalCurrentAmount ?? 0)}
            </p>
          </div>
          <div className="rounded-lg border border-dashed p-3 text-sm">
            <p className="text-xs uppercase text-muted-foreground">Progress</p>
            <p className="mt-1 text-xl font-semibold">{Math.round(avgProgress)}%</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {columns.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">No goals yet in this family.</div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-4">
            {columns.map((column) => (
              <div key={column.state} className="rounded-xl border bg-muted/30 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold">{column.label}</p>
                  <Badge variant="secondary">{column.goals.length}</Badge>
                </div>
                <div className="space-y-3">
                  {column.goals.map((goal) => {
                    const metricValue = goal.primaryMetric ?? goal.progressPercentage ?? 0;
                    return (
                      <div key={goal.id} className="rounded-lg border border-dashed bg-background p-3">
                        <p className="text-sm font-semibold">{goal.goalName}</p>
                        <p className="text-xs text-muted-foreground">{goal.primaryMetricLabel}</p>
                        <p className="mt-2 text-lg font-semibold">{Math.round(metricValue)}%</p>
                        {goal.priority && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            Priority {goal.priority}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                  {column.goals.length === 0 && (
                    <p className="text-sm text-muted-foreground">No goals</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalFamilyBoard;

