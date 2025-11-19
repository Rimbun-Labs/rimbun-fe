import { GoalWithInsightsDto } from '@/lib/api/types/goals';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowRight, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalCardProps {
  goal: GoalWithInsightsDto;
  onView: (goal: GoalWithInsightsDto) => void;
  onEdit: (goal: GoalWithInsightsDto) => void;
  onDelete: (goal: GoalWithInsightsDto) => void;
  disableDelete?: boolean;
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const GoalCard = ({
  goal,
  onView,
  onEdit,
  onDelete,
  disableDelete,
}: GoalCardProps) => {
  // Calculate progress with fallback if backend doesn't provide it
  const progress = goal.progressPercentage !== undefined && goal.progressPercentage !== null
    ? Math.round(goal.progressPercentage)
    : goal.targetAmount > 0
    ? Math.round((goal.currentAmount / goal.targetAmount) * 100)
    : 0;
  
  const gap = goal.goalGapInsights?.currentGap ?? goal.targetAmount - goal.currentAmount;
  
  // Use requiredMonthlySavings from insights, or calculate fallback if 0
  const requiredMonthly = goal.requiredMonthlySavings && goal.requiredMonthlySavings > 0
    ? goal.requiredMonthlySavings
    : goal.goalGapInsights?.recommendedMonthlyContribution ?? 0;
  
  const savingsRate = goal.currentSavingsRate ?? 0;

  const statusBadge = (() => {
    if (goal.status === 'completed')
      return {
        label: 'Completed',
        className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
      };
    if (goal.status === 'paused' || goal.isActive === false)
      return {
        label: 'Paused',
        className: 'bg-muted text-muted-foreground',
      };
    return {
      label: 'Active',
      className: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200',
    };
  })();

  const isOffTrack = savingsRate && savingsRate < 0.8;

  return (
    <Card className="h-full border-muted bg-card/60">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-xl">{goal.goalName}</CardTitle>
            {goal.priority && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200">
                Priority {goal.priority}
              </Badge>
            )}
            {goal.isFromAssessment && (
              <Badge variant="default" className="bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-100">
                Assessment Goal
              </Badge>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{currency.format(goal.currentAmount)} saved</span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/70" />
            <span>{currency.format(goal.targetAmount)} target</span>
          </div>
        </div>
        <Badge variant="outline" className={statusBadge.className}>
          {statusBadge.label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Progress</p>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="mt-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-dashed p-4">
            <p className="text-xs uppercase text-muted-foreground">Goal Gap</p>
            <p className={cn('mt-2 text-lg font-semibold', gap > 0 ? 'text-rose-500' : 'text-emerald-500')}>
              {currency.format(Math.max(gap, 0))}
            </p>
          </div>
          <div className="rounded-lg border border-dashed p-4">
            <p className="text-xs uppercase text-muted-foreground">Required Monthly</p>
            <p className="mt-2 text-lg font-semibold">
              {requiredMonthly > 0 ? currency.format(requiredMonthly) : '—'}
            </p>
          </div>
          <div className="rounded-lg border border-dashed p-4">
            <p className="text-xs uppercase text-muted-foreground">You’re Contributing</p>
            <p
              className={cn(
                'mt-2 text-lg font-semibold',
                isOffTrack ? 'text-rose-500' : 'text-foreground'
              )}
            >
              {currency.format(goal.monthlyContribution)}{' '}
              {savingsRate ? `(${Math.round(savingsRate * 100)}%)` : ''}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t bg-muted/30">
        <Button variant="default" size="sm" onClick={() => onView(goal)}>
          View details
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(goal)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          disabled={disableDelete}
          onClick={() => onDelete(goal)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GoalCard;

