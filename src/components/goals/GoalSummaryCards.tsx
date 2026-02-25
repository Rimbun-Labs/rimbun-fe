import { cn } from '@/lib/utils';
import { GoalsSummaryDto } from '@/lib/api/types/goals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Target, ListChecks, PiggyBank, TrendingUp } from 'lucide-react';

interface GoalSummaryCardsProps {
  summary?: GoalsSummaryDto;
  isLoading?: boolean;
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const GoalSummaryCards = ({ summary, isLoading }: GoalSummaryCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 w-full">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} className="h-36 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const cards = [
    {
      label: 'Total Goals',
      value: summary.totalGoals,
      icon: ListChecks,
      accent: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200',
    },
    {
      label: 'Active Goals',
      value: summary.activeGoals,
      icon: Target,
      accent: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
    },
    {
      label: 'Total Target',
      value: currency.format(summary.totalTargetAmount || 0),
      icon: PiggyBank,
      accent: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
    },
    {
      label: 'Overall Progress',
      value: `${Math.round(summary.overallProgress || 0)}%`,
      icon: TrendingUp,
      accent: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200',
      progress: summary.overallProgress || 0,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 w-full">
      {cards.map(({ label, value, icon: Icon, accent, progress }) => (
        <Card key={label} className="border-muted w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {label}
            </CardTitle>
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold',
                accent
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{value}</div>
            {typeof progress === 'number' && (
              <div className="mt-4">
                <Progress value={progress} />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GoalSummaryCards;


