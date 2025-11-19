import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  useDeleteGoal,
  useGoal,
  useGoalProgressHistory,
  useUpdateGoal,
} from '@/hooks/useGoals';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import GoalFormDialog from '@/components/goals/GoalFormDialog';
import GoalProgressChart from '@/components/goals/GoalProgressChart';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Clock4,
  NotebookPen,
  Pencil,
  Shield,
  Trash2,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { GoalWithInsightsDto } from '@/lib/api/types/goals';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const GoalDetailPage = () => {
  const { goalId } = useParams<{ goalId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.uid ?? '';

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [historyRange, setHistoryRange] = useState<'6m' | '12m' | '24m' | 'all'>('12m');

  const { data: goal, isLoading, isError, refetch } = useGoal(userId, goalId);
  const progressQueryOptions = useMemo(() => {
    if (historyRange === 'all') return undefined;
    return { limit: parseInt(historyRange, 10) };
  }, [historyRange]);

  const { data: progressHistory, isLoading: isProgressLoading } = useGoalProgressHistory(
    userId,
    goalId,
    progressQueryOptions
  );
  const updateGoal = useUpdateGoal(userId, goalId);
  const deleteGoal = useDeleteGoal(userId);

  const insightTiles = useMemo(() => {
    if (!goal) return [];
    return [
      {
        label: 'Target amount',
        value: currency.format(goal.targetAmount),
        icon: Shield,
      },
      {
        label: 'Current amount',
        value: currency.format(goal.currentAmount),
        icon: BadgeCheck,
      },
      {
        label: 'Gap remaining',
        value: currency.format(
          goal.goalGapInsights?.currentGap ?? Math.max(goal.targetAmount - goal.currentAmount, 0)
        ),
        icon: NotebookPen,
        highlight: true,
      },
      {
        label: 'Monthly contribution',
        value: currency.format(goal.monthlyContribution),
        icon: Calendar,
      },
      {
        label: 'Required monthly savings',
        value: currency.format(goal.requiredMonthlySavings ?? 0),
        icon: Calendar,
        highlight: (goal.currentSavingsRate ?? 1) < 0.8,
      },
      {
        label: 'Achievability score',
        value: goal.goalAchievabilityScore ? `${goal.goalAchievabilityScore}/100` : '—',
        icon: Shield,
      },
    ];
  }, [goal]);

  const handleDelete = async () => {
    if (!goalId) return;
    await deleteGoal.mutateAsync(goalId);
    navigate('/goals');
  };

  const handleEditSubmit = async (payload: Parameters<typeof updateGoal.mutateAsync>[0]) => {
    await updateGoal.mutateAsync(payload);
    setIsEditOpen(false);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-[320px] w-full" />
      </div>
    );
  }

  if (isError || !goal) {
    return (
      <div className="space-y-6 p-4 md:p-8">
        <Alert variant="destructive">
          <AlertTitle>Goal not found</AlertTitle>
          <AlertDescription>
            We couldn&apos;t load that goal. It may have been deleted or you may not have access.
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => navigate('/goals')}>
          Return to goals
        </Button>
      </div>
    );
  }

  const timeStatus = goal.timeAnalysis?.status;
  const timelineCopy = (() => {
    if (!goal.timeAnalysis) return 'Timeline analysis unavailable';
    if (timeStatus === 'on_track') return 'On track with your stated horizon';
    if (timeStatus === 'warning') return 'Slightly behind target timeline';
    if (timeStatus === 'off_track') return 'Off track vs horizon';
    return 'Timeline analysis';
  })();

  const historyFilters: Array<{ label: string; value: typeof historyRange }> = [
    { label: '6M', value: '6m' },
    { label: '12M', value: '12m' },
    { label: '24M', value: '24m' },
    { label: 'All', value: 'all' },
  ];

  return (
    <div className="space-y-6 p-4 md:p-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/goals">Goals</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{goal.goalName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="px-2" onClick={() => navigate('/goals')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {goal.isFromAssessment && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-100">
                Assessment goal
              </Badge>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-semibold">{goal.goalName}</h1>
          <p className="text-muted-foreground">
            {goal.goalType.replace('_', ' ')} · Priority {goal.priority ?? 3}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setIsEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit goal
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteOpen(true)}
            disabled={goal.isFromAssessment}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {insightTiles.map((tile) => (
          <Card
            key={tile.label}
            className={tile.highlight ? 'border-rose-200 dark:border-rose-500/40' : undefined}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {tile.label}
              </CardTitle>
              <tile.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{tile.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Timeline analysis</CardTitle>
            <CardDescription>{timelineCopy}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-dashed p-4">
                <p className="text-xs uppercase text-muted-foreground">Investment horizon</p>
                <p className="mt-2 text-2xl font-semibold">
                  {goal.investmentHorizon ? `${goal.investmentHorizon} yrs` : '—'}
                </p>
              </div>
              <div className="rounded-lg border border-dashed p-4">
                <p className="text-xs uppercase text-muted-foreground">Actual timeline</p>
                <p className="mt-2 text-2xl font-semibold">
                  {goal.timeAnalysis?.actualYears ? `${goal.timeAnalysis.actualYears} yrs` : '—'}
                </p>
              </div>
              <div className="rounded-lg border border-dashed p-4">
                <p className="text-xs uppercase text-muted-foreground">Projected completion</p>
                <p className="mt-2 text-2xl font-semibold">
                  {goal.projectedTimeToGoal
                    ? `${goal.projectedTimeToGoal.toFixed(1)} yrs`
                    : goal.timeAnalysis?.projectedCompletionYear ?? '—'}
                </p>
              </div>
            </div>
            {goal.targetDate && (
              <div className="flex items-center gap-3 rounded-lg border border-dashed p-4 text-sm">
                <Clock4 className="h-4 w-4 text-muted-foreground" />
                Target date <span className="font-medium">{new Date(goal.targetDate).toDateString()}</span>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notes & metadata</CardTitle>
            <CardDescription>Context, allocation, or advisor notes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border border-dashed p-3">
              <p className="text-xs uppercase text-muted-foreground">Initial investment</p>
              <p className="text-lg font-semibold">
                {goal.metadata?.initialInvestment
                  ? currency.format(goal.metadata.initialInvestment)
                  : '—'}
              </p>
            </div>
            <div className="rounded-lg border border-dashed p-3">
              <p className="text-xs uppercase text-muted-foreground">Notes</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                {goal.metadata?.notes ?? 'No notes added yet.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <GoalProgressChart
        history={progressHistory}
        isLoading={isProgressLoading}
        goalName={goal.goalName}
        headerExtras={
          <div className="flex flex-wrap gap-2">
            {historyFilters.map((filter) => (
              <Button
                key={filter.value}
                variant={historyRange === filter.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setHistoryRange(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        }
      />

      <GoalFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        mode="edit"
        initialGoal={goal as GoalWithInsightsDto}
        onSubmit={handleEditSubmit}
        isSubmitting={updateGoal.isPending}
        title="Edit goal"
        description="Adjust target, contributions, or notes. Insights will refresh automatically."
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete goal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{goal.goalName}&quot;? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteGoal.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteGoal.isPending || goal.isFromAssessment}
              onClick={handleDelete}
            >
              Delete goal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GoalDetailPage;

