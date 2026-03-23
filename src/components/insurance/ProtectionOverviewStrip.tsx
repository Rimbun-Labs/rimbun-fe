import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Layers, Shield, Info } from 'lucide-react';
import {
  FOUNDATION_SECURE_EXPLANATION,
  FOUNDATION_SECURE_LABEL,
  getResilienceStatusString,
  STAY_ON_TRACK_TOOLTIP,
} from '@/lib/constants/insuranceEducation';
import { cn } from '@/lib/utils';

interface ProtectionOverviewStripProps {
  foundationSecurePercent: number;
  hedgedGoalsCount: number;
  totalGoalsCount: number;
  nudgeCopy?: string | null;
  className?: string;
}

/**
 * Foundation & resilience overview: section title, two metrics with hierarchy,
 * one-line "what is foundation", optional status hint, and CTA to view foundation products.
 */
export const ProtectionOverviewStrip: React.FC<ProtectionOverviewStripProps> = ({
  foundationSecurePercent,
  hedgedGoalsCount,
  totalGoalsCount,
  nudgeCopy,
  className,
}) => {
  const scorePercent = totalGoalsCount > 0 ? Math.round((hedgedGoalsCount / totalGoalsCount) * 100) : 0;
  const statusString = getResilienceStatusString(scorePercent);
  const scoreLabel =
    totalGoalsCount === 0
      ? 'No goals yet'
      : hedgedGoalsCount === totalGoalsCount
        ? 'All goals covered'
        : `${hedgedGoalsCount} of ${totalGoalsCount} goals`;

  const foundationPercent = Math.round(foundationSecurePercent);
  const showImproveHint = foundationPercent < 100;
  const showGetStartedHint = foundationPercent === 0;

  return (
    <Card className={cn('border-primary/30 bg-primary/5 dark:bg-primary/10', className)}>
      <CardContent className="p-4">
        <p className="text-sm font-medium text-foreground mb-4">Your cover at a glance</p>

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
          {/* Foundation (primary) */}
          <div className="flex items-start gap-3">
            <Layers className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl font-bold tabular-nums text-primary">
                  {foundationPercent}%
                </span>
                <span className="text-sm text-muted-foreground">essential cover</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                        aria-label="Explanation: Essential cover"
                      >
                        <Info className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{FOUNDATION_SECURE_EXPLANATION}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{FOUNDATION_SECURE_LABEL}</p>
              {showGetStartedHint && (
                <p className="text-xs text-primary font-medium mt-1">Get started with essential cover</p>
              )}
              {showImproveHint && !showGetStartedHint && (
                <p className="text-xs text-muted-foreground mt-1">Add cover to improve</p>
              )}
            </div>
          </div>

          {/* Stay on Track (secondary) – status string + protection progress bar */}
          <div className="flex items-start gap-3 md:border-l md:border-border md:pl-8">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-lg font-bold text-primary">{statusString}</span>
                <span className="text-xs text-muted-foreground tabular-nums">{scorePercent}%</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                        aria-label="Explanation: Stay on Track"
                      >
                        <Info className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{STAY_ON_TRACK_TOOLTIP}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{scoreLabel}</p>
            </div>
          </div>
        </div>

        {nudgeCopy && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">{nudgeCopy}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
