import { GoalFamilySummaryDto } from '@/lib/api/types/goals';
import { getGoalFamilyConfigBySlug } from '@/lib/constants/goalFamilies';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface GoalFamilyCardProps {
  summary: GoalFamilySummaryDto;
  onSelect: (family: GoalFamilySummaryDto) => void;
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const GoalFamilyCard = ({ summary, onSelect }: GoalFamilyCardProps) => {
  const config = getGoalFamilyConfigBySlug(summary.slug);
  const stats = summary.stats ?? {
    totalGoals: 0,
    activeGoals: 0,
    totalTargetAmount: 0,
    totalCurrentAmount: 0,
    overallProgress: 0,
    averageProgress: 0,
  };
  const avgProgress = stats.averageProgress ?? 0;

  const Icon = config?.icon;

  return (
    <Card className="border border-muted transition-all hover:border-primary/60 hover:shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{summary.displayName}</CardTitle>
          {Icon && <Icon className={`h-5 w-5 ${config?.accentColor ?? 'text-muted-foreground'}`} />}
        </div>
        <p className="text-sm text-muted-foreground">{summary.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Avg. progress</span>
            <span className="font-semibold text-foreground">
              {Math.round(avgProgress)}%
            </span>
          </div>
          <Progress value={avgProgress} className="mt-2" />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-dashed p-3">
            <p className="text-xs uppercase text-muted-foreground">Active Goals</p>
            <p className="mt-1 text-xl font-semibold">{stats.activeGoals}</p>
          </div>
          <div className="rounded-lg border border-dashed p-3">
            <p className="text-xs uppercase text-muted-foreground">Total Target</p>
            <p className="mt-1 text-sm font-semibold">
              {currency.format(stats.totalTargetAmount ?? 0)}
            </p>
          </div>
        </div>
        <Button className="w-full" variant="outline" onClick={() => onSelect(summary)}>
          Open family workspace
        </Button>
      </CardContent>
    </Card>
  );
};

export default GoalFamilyCard;

