import { GoalFamilySummaryDto, GoalFamilySummariesResponse } from '@/lib/api/types/goals';
import GoalFamilyCard from './GoalFamilyCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface GoalFamiliesOverviewProps {
  summaries?: GoalFamilySummariesResponse;
  isLoading?: boolean;
  onSelectFamily: (family: GoalFamilySummaryDto) => void;
}

export const GoalFamiliesOverview = ({
  summaries,
  isLoading,
  onSelectFamily,
}: GoalFamiliesOverviewProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-56 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!summaries) return null;

  const families = summaries.families ?? [];
  const totals = summaries.summary;
  const activeFamilies = families.filter((family) => (family.stats?.totalGoals ?? 0) > 0);
  const inactiveFamilies = families.filter((family) => (family.stats?.totalGoals ?? 0) === 0);

  if (!families.length) {
    return (
      <Card className="border-dashed border-muted w-full">
        <CardContent className="py-12 text-center text-muted-foreground">
          No goal families available yet.
        </CardContent>
      </Card>
    );
  }

  const totalFamilies = totals?.totalFamilies ?? families.length;
  const familiesWithGoals = totals?.familiesWithGoals ?? activeFamilies.length;
  const totalGoals =
    totals?.totalGoalsAcrossFamilies ??
    families.reduce((acc, family) => acc + (family.stats?.totalGoals ?? 0), 0);
  const activeGoals = families.reduce(
    (acc, family) => acc + (family.stats?.activeGoals ?? 0),
    0
  );

  return (
    <div className="space-y-4 w-full">
      <Card className="border-muted w-full">
        <CardHeader>
          <CardTitle className="text-lg">Goal Families Overview</CardTitle>
          <p className="text-sm text-muted-foreground">
            Balance aspirational goals with obligations and resilience pillars.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-dashed p-4">
            <p className="text-xs uppercase text-muted-foreground">Families with goals</p>
            <p className="mt-2 text-2xl font-semibold">
              {familiesWithGoals} / {totalFamilies}
            </p>
          </div>
          <div className="rounded-lg border border-dashed p-4">
            <p className="text-xs uppercase text-muted-foreground">Total goals</p>
            <p className="mt-2 text-2xl font-semibold">{totalGoals}</p>
          </div>
          <div className="rounded-lg border border-dashed p-4">
            <p className="text-xs uppercase text-muted-foreground">Active goals</p>
            <p className="mt-2 text-2xl font-semibold">{activeGoals}</p>
          </div>
          <div className="rounded-lg border border-dashed p-4">
            <p className="text-xs uppercase text-muted-foreground">Coverage</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Tap a family card to explore progress & next actions.
            </p>
          </div>
        </CardContent>
      </Card>

      {activeFamilies.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activeFamilies.map((family) => (
            <GoalFamilyCard key={family.id} summary={family} onSelect={onSelectFamily} />
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-muted w-full">
          <CardContent className="py-8 text-center">
            <p className="text-base font-medium">No active goal families yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Start by picking a pillar below to keep your plan balanced.
            </p>
          </CardContent>
        </Card>
      )}

      {inactiveFamilies.length > 0 && (
        <Card className="border-muted w-full">
          <CardHeader>
            <CardTitle className="text-lg">Other pillars to explore</CardTitle>
            <p className="text-sm text-muted-foreground">
              These families don’t have goals yet—tap to open their workspace or create one.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {inactiveFamilies.map((family) => (
                <Button
                  key={family.id}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => onSelectFamily(family)}
                >
                  {family.displayName}
                  <Badge variant="secondary" className="ml-2">
                    0 goals
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoalFamiliesOverview;
