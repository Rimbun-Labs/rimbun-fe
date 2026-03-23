import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Shield, Info } from 'lucide-react';
import { getResilienceStatusString, STAY_ON_TRACK_TOOLTIP } from '@/lib/constants/insuranceEducation';
import { cn } from '@/lib/utils';

interface ResilienceScorecardProps {
  /** Number of goals that have some resilience (hedgeType !== 'none' and has products or recommended cover) */
  hedgedGoalsCount: number;
  /** Total number of active goals considered */
  totalGoalsCount: number;
  className?: string;
}

/**
 * Aggregate "Security Score" – gamifies protection across goals.
 * Score = (hedgedGoalsCount / totalGoalsCount) * 100, or 0 if no goals.
 */
export const ResilienceScorecard: React.FC<ResilienceScorecardProps> = ({
  hedgedGoalsCount,
  totalGoalsCount,
  className,
}) => {
  const scorePercent =
    totalGoalsCount > 0 ? Math.round((hedgedGoalsCount / totalGoalsCount) * 100) : 0;
  const statusString = getResilienceStatusString(scorePercent);
  const label = totalGoalsCount === 0
    ? 'No goals yet'
    : hedgedGoalsCount === totalGoalsCount
      ? 'All goals covered'
      : `${hedgedGoalsCount} of ${totalGoalsCount} goals with cover`;

  return (
    <Card className={cn('border-primary/20', className)}>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-primary" />
          Stay on Track
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-muted-foreground hover:text-foreground focus:outline-none">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{STAY_ON_TRACK_TOOLTIP}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>Your cover at a glance</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-end gap-4">
          <div className="text-xl font-bold text-primary">{statusString}</div>
          <div className="text-sm text-muted-foreground pb-1">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
};
