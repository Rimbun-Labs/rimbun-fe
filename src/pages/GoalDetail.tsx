import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  useDeleteGoal,
  useGoal,
  useGoalProgressHistory,
  useResilience,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Clock4,
  Info,
  NotebookPen,
  Pencil,
  Shield,
  Trash2,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { GoalWithInsightsDto } from '@/lib/api/types/goals';
import { getGoalFamilyConfigBySlug } from '@/lib/constants/goalFamilies';
import {
  getInsuranceCurrencyFormat,
  getMonthlyPaymentLabel,
  HEDGE_TYPE_EXPLANATIONS,
  INSURANCE_TERMS,
} from '@/lib/constants/insuranceEducation';
import { formatGoalType, getInsuranceProductDisplayName } from '@/lib/utils/insuranceDisplay';
import { LabelWithBridgeTooltip } from '@/components/insurance/LabelWithBridgeTooltip';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const insuranceCurrency = getInsuranceCurrencyFormat();

const GoalDetailPage = () => {
  const { goalId } = useParams<{ goalId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.uid ?? '';

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isNudgeOpen, setIsNudgeOpen] = useState(false);
  const [nudgeChoice, setNudgeChoice] = useState<'self' | 'others' | null>(null);
  const [historyRange, setHistoryRange] = useState<'6m' | '12m' | '24m' | 'all'>('12m');

  const { data: goal, isLoading, isError, refetch } = useGoal(goalId);
  const { data: resilience, refetch: refetchResilience } = useResilience(goalId);
  const progressQueryOptions = useMemo(() => {
    if (historyRange === 'all') return undefined;
    return { limit: parseInt(historyRange, 10) };
  }, [historyRange]);

  const { data: progressHistory, isLoading: isProgressLoading } = useGoalProgressHistory(
    goalId,
    progressQueryOptions
  );
  const updateGoal = useUpdateGoal(goalId);
  const deleteGoal = useDeleteGoal();

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

  const handleNudgeAnswer = async (dependencyScope: 'self' | 'others') => {
    if (!goalId || !goal) return;
    await updateGoal.mutateAsync({
      metadata: { ...goal.metadata, dependencyScope },
    });
    setIsNudgeOpen(false);
    setNudgeChoice(null);
    refetchResilience();
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

  // primaryFamilyId is a UUID, so we need to get the slug from the goal's family object or look it up
  const familyConfig = goal.primaryFamily?.slug 
    ? getGoalFamilyConfigBySlug(goal.primaryFamily.slug)
    : getGoalFamilyConfigBySlug(goal.primaryFamilyId); // Fallback: might be a slug

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
            {familyConfig && (
              <Badge
                variant="outline"
                className="border-primary/40 text-xs font-semibold uppercase tracking-wide text-primary"
              >
                {familyConfig.label}
              </Badge>
            )}
            {goal.isFromAssessment && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-100">
                Assessment goal
              </Badge>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-semibold">{goal.goalName}</h1>
          <p className="text-muted-foreground">
            {formatGoalType(goal.goalType)} · Priority {goal.priority ?? 3}
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

      {resilience && resilience.hedgeType !== 'none' && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Protection & resilience
            </CardTitle>
            <CardDescription>{resilience.actionCopy}</CardDescription>
            {(() => {
              const explain = HEDGE_TYPE_EXPLANATIONS[resilience.hedgeType] ?? HEDGE_TYPE_EXPLANATIONS.none;
              return (
                <p className="text-sm text-muted-foreground pt-1">
                  What this means: {explain.body}
                </p>
              );
            })()}
          </CardHeader>
          <CardContent className="space-y-4">
            {resilience.showNudge && resilience.dependencyScope == null && (
              <div className="rounded-lg border border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/30 p-4">
                <p className="text-sm font-medium text-foreground mb-2">
                  {resilience.nudgeQuestionCopy}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsNudgeOpen(true)}
                  className="border-amber-300 dark:border-amber-700"
                >
                  Answer to see tailored products
                </Button>
              </div>
            )}
            {resilience.recommendedSumAssured > 0 && (
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  <LabelWithBridgeTooltip label="Recommended cover" bridgeKey="recommendedCover" />: {insuranceCurrency.format(resilience.recommendedSumAssured)}
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                        aria-label="Explanation: Recommended cover"
                      >
                        <Info className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{INSURANCE_TERMS.recommendedCover}</p>
                      <p className="mt-1 font-medium">{INSURANCE_TERMS.recommendedCoverContext}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
            {resilience.products.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Suggested products</p>
                <ul className="space-y-3">
                  {resilience.products.map((product) => (
                    <li
                      key={product.productId}
                      className="rounded-lg border bg-muted/30 p-3 text-sm"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          {product.productId ? (
                            <Link
                              to={`/insurance/products/${encodeURIComponent(product.productId)}`}
                              className="block hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded -m-1 p-1"
                            >
                              <p className="font-medium text-foreground">
                                {getInsuranceProductDisplayName(product)}
                              </p>
                              {product.nudgeCopy && (
                                <p className="mt-1 text-muted-foreground">{product.nudgeCopy}</p>
                              )}
                              {product.estimatedMonthlyPremiumProxy != null && (() => {
                                const { term, indicativeLabel } = getMonthlyPaymentLabel(product.isTakaful === true);
                                return (
                                  <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                                    From {insuranceCurrency.format(product.estimatedMonthlyPremiumProxy)}/mo
                                    <span className="block text-[10px] text-muted-foreground/80 mt-0.5 w-full">
                                      Indicative {term.toLowerCase()} · {indicativeLabel}
                                    </span>
                                  </p>
                                );
                              })()}
                            </Link>
                          ) : (
                            <>
                              <p className="font-medium text-foreground">
                                {getInsuranceProductDisplayName(product)}
                              </p>
                              {product.nudgeCopy && (
                                <p className="mt-1 text-muted-foreground">{product.nudgeCopy}</p>
                              )}
                              {product.estimatedMonthlyPremiumProxy != null && (() => {
                                const { term, indicativeLabel } = getMonthlyPaymentLabel(product.isTakaful === true);
                                return (
                                  <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                                    From {insuranceCurrency.format(product.estimatedMonthlyPremiumProxy)}/mo
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button
                                            type="button"
                                            className="text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded inline-flex"
                                            aria-label="Explanation: Indicative premium"
                                          >
                                            <Info className="h-3 w-3" />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                          <p>{INSURANCE_TERMS.indicativePremium}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <span className="block text-[10px] text-muted-foreground/80 mt-0.5 w-full">
                                      Indicative {term.toLowerCase()} · {indicativeLabel}
                                    </span>
                                  </p>
                                );
                              })()}
                            </>
                          )}
                        </div>
                        {product.productId ? (
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/insurance/products/${encodeURIComponent(product.productId)}`}>
                              View details
                            </Link>
                          </Button>
                        ) : product.productPageUrl ? (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={product.productPageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View product
                            </a>
                          </Button>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={isNudgeOpen} onOpenChange={setIsNudgeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>One quick question</DialogTitle>
            <DialogDescription>
              {resilience?.nudgeQuestionCopy}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (nudgeChoice) handleNudgeAnswer(nudgeChoice);
            }}
            className="space-y-4"
          >
            <RadioGroup
              value={nudgeChoice ?? ''}
              onValueChange={(v) => setNudgeChoice(v === 'self' || v === 'others' ? v : null)}
              className="grid gap-3"
            >
              <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                <RadioGroupItem value="self" id="nudge-self" />
                <span className="text-sm font-medium">Just for me</span>
              </label>
              <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                <RadioGroupItem value="others" id="nudge-others" />
                <span className="text-sm font-medium">Others rely on it</span>
              </label>
            </RadioGroup>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsNudgeOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateGoal.isPending || !nudgeChoice}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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

