import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateGoal, useGoalFamilyBoard, useGoalFamilySummaries, useGoalsOverview } from '@/hooks/useGoals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import GoalFamilyBoard from '@/components/goals/families/GoalFamilyBoard';
import GoalProgressTimeline from '@/components/goals/GoalProgressTimeline';
import GoalFormDialog from '@/components/goals/GoalFormDialog';
import { getGoalFamilyConfigBySlug } from '@/lib/constants/goalFamilies';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const GoalFamilyPage = () => {
  const { familySlug } = useParams<{ familySlug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.uid ?? '';

  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    data: familySummaries,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useGoalFamilySummaries(userId);

  const { data: goalsData } = useGoalsOverview(userId, true);
  const createGoal = useCreateGoal(userId);

  const matchingFamily = useMemo(() => {
    return familySummaries?.families?.find((family) => family.slug === familySlug);
  }, [familySummaries?.families, familySlug]);

  const familyId = matchingFamily?.id;
  const {
    data: familyBoard,
    isLoading: isBoardLoading,
  } = useGoalFamilyBoard(userId, familyId);

  const isLoading = isSummaryLoading || (Boolean(familyId) && isBoardLoading);

  const handleCreateClick = () => {
    setIsFormOpen(true);
  };

  const handleSubmitGoal = async (payload: Parameters<typeof createGoal.mutateAsync>[0]) => {
    await createGoal.mutateAsync(payload);
  };

  // Filter goals for this family
  const familyGoals = useMemo(() => {
    if (!goalsData?.goals || !familyId) return [];
    return goalsData.goals.filter((goal) => goal.primaryFamilyId === familyId);
  }, [goalsData?.goals, familyId]);

  const config = getGoalFamilyConfigBySlug(matchingFamily?.slug);
  const stats = matchingFamily?.stats ?? {
    totalGoals: 0,
    activeGoals: 0,
    totalTargetAmount: 0,
    totalCurrentAmount: 0,
    overallProgress: 0,
    averageProgress: 0,
  };

  const renderHeaderSkeleton = (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-6 h-32 w-full" />
      </CardContent>
    </Card>
  );

  const renderFamilyNotFound = (
    <Card className="border-dashed border-muted">
      <CardContent className="space-y-4 py-12 text-center">
        <p className="text-lg font-semibold">Family not found</p>
        <p className="text-sm text-muted-foreground">
          We couldn’t find that goal family. It might not exist yet or you may not have access to it.
        </p>
        <Button variant="outline" onClick={() => navigate('/goals')}>
          Return to Goals Hub
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" className="px-2" size="sm" onClick={() => navigate('/goals')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Goals
        </Button>
        <Button variant="outline" onClick={handleCreateClick}>
          Add goal
        </Button>
      </div>

      {isLoading && renderHeaderSkeleton}

      {!isLoading && !matchingFamily && !isSummaryError && renderFamilyNotFound}

      {!isLoading && matchingFamily && (
        <Card className="border-muted">
          <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              {config?.icon && (
                <span className="rounded-full bg-muted p-3">
                  <config.icon className={`h-6 w-6 ${config?.accentColor}`} />
                </span>
              )}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-2xl">{matchingFamily.displayName}</CardTitle>
                  <Badge variant="outline" className="text-xs uppercase">
                    {matchingFamily.primaryMetricType.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  {matchingFamily.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-dashed bg-muted/30 px-4 py-3 text-sm">
              <Sparkles className="h-4 w-4 text-amber-500" />
              {stats.totalGoals > 0
                ? `${stats.totalGoals} goals in this family`
                : 'No goals yet · start one to get guidance'}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-dashed p-4">
                <p className="text-xs uppercase text-muted-foreground">Total goals</p>
                <p className="mt-2 text-2xl font-semibold">{stats.totalGoals}</p>
              </div>
              <div className="rounded-lg border border-dashed p-4">
                <p className="text-xs uppercase text-muted-foreground">Active goals</p>
                <p className="mt-2 text-2xl font-semibold">{stats.activeGoals}</p>
              </div>
              <div className="rounded-lg border border-dashed p-4">
                <p className="text-xs uppercase text-muted-foreground">Target total</p>
                <p className="mt-2 text-xl font-semibold">
                  {currency.format(stats.totalTargetAmount ?? 0)}
                </p>
              </div>
              <div className="rounded-lg border border-dashed p-4">
                <p className="text-xs uppercase text-muted-foreground">Avg. progress</p>
                <p className="mt-2 text-2xl font-semibold">
                  {Math.round(stats.averageProgress ?? 0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Family-scoped Progress Timeline */}
      {!isLoading && matchingFamily && (
        <GoalProgressTimeline
          goals={familyGoals}
          isLoading={isLoading}
          selectedFamilyId={familyId}
          familySummaries={matchingFamily ? [matchingFamily] : undefined}
        />
      )}

      <GoalFamilyBoard
        board={familyBoard}
        isLoading={isLoading || isBoardLoading}
      />

      <GoalFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode="create"
        initialGoal={null}
        onSubmit={handleSubmitGoal}
        isSubmitting={createGoal.isPending}
        description={`Create a new goal in the ${matchingFamily?.displayName} family`}
        preSelectedFamilyId={familyId}
        familySummaries={familySummaries?.families}
      />
    </div>
  );
};

export default GoalFamilyPage;

