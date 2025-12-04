import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, TrendingDown, Minus, Target } from "lucide-react";
import { useFormatters } from '@/hooks/useFormatters';
import { GoalWithInsightsDto } from '@/lib/api/types/goals';
import { calculateGoalImpact, GoalImpact } from '@/utils/spendingCalculations';
import { useNavigate } from 'react-router-dom';
import { DataQualityMetrics } from '@/utils/dataQuality';
import DataQualityIndicator from './DataQualityIndicator';

interface GoalImpactDisplayProps {
  goals: GoalWithInsightsDto[];
  currentInvestmentAllocation: number;
  scenarioInvestmentAllocation: number;
  dataQuality?: DataQualityMetrics | null;
}

/**
 * Component to display impact of spending scenario on goals
 * Shows completion date changes for each goal
 */
const GoalImpactDisplay: React.FC<GoalImpactDisplayProps> = ({
  goals,
  currentInvestmentAllocation,
  scenarioInvestmentAllocation,
  dataQuality,
}) => {
  const { formatCurrency, formatPercentage } = useFormatters();
  const navigate = useNavigate();

  // Filter active goals only
  const activeGoals = useMemo(() => 
    goals.filter(goal => goal.isActive !== false && goal.status !== 'completed' && goal.status !== 'archived'),
    [goals]
  );

  // Calculate impact for each goal
  const goalImpacts = useMemo(() => {
    return activeGoals.map(goal => 
      calculateGoalImpact(
        {
          id: goal.id,
          goalName: goal.goalName,
          targetAmount: goal.targetAmount,
          currentAmount: goal.currentAmount,
          monthlyContribution: goal.monthlyContribution,
          priority: goal.priority,
        },
        currentInvestmentAllocation,
        scenarioInvestmentAllocation,
        'proportional'
      )
    ).filter(impact => 
      // Only show goals that have valid calculations
      impact.currentMonthsToGoal >= 0 || impact.scenarioMonthsToGoal >= 0
    ).sort((a, b) => {
      // Sort by absolute impact (biggest changes first)
      return Math.abs(b.monthsDifference) - Math.abs(a.monthsDifference);
    });
  }, [activeGoals, currentInvestmentAllocation, scenarioInvestmentAllocation]);

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Format months/years for display
  const formatTimeToGoal = (months: number) => {
    if (months < 0) return 'N/A';
    if (months === 0) return 'Reached';
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} ${years === 1 ? 'year' : 'years'}`;
    return `${years}y ${remainingMonths}mo`;
  };

  // Format months difference
  const formatMonthsDifference = (months: number) => {
    const abs = Math.abs(months);
    if (abs < 12) return `${abs} ${abs === 1 ? 'month' : 'months'}`;
    const years = Math.floor(abs / 12);
    const remainingMonths = abs % 12;
    if (remainingMonths === 0) return `${years} ${years === 1 ? 'year' : 'years'}`;
    return `${years}y ${remainingMonths}mo`;
  };

  if (activeGoals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goal Impact
          </CardTitle>
          <CardDescription>
            See how your spending scenario affects your financial goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              No active goals found. Create goals to see how your spending decisions impact them.
            </p>
            <Button onClick={() => navigate('/goals')} variant="outline">
              View Goals
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (goalImpacts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goal Impact
          </CardTitle>
          <CardDescription>
            See how your spending scenario affects your financial goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Unable to calculate goal impact. Please ensure your goals have valid contribution amounts.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goal Impact
            </CardTitle>
            <CardDescription>
              How your spending scenario affects goal completion dates
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {dataQuality && (
              <DataQualityIndicator quality={dataQuality} compact />
            )}
            <Button 
              onClick={() => navigate('/goals')} 
              variant="outline" 
              size="sm"
            >
              View Goals
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goalImpacts.map((impact) => {
            const hasImpact = impact.monthsDifference !== 0;
            const isFaster = impact.isFaster;
            
            return (
              <div 
                key={impact.goalId}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold text-base">{impact.goalName}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {/* Current State */}
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Current Projection</p>
                        <div className="space-y-0.5">
                          <p className="font-medium">
                            {impact.currentMonthsToGoal < 0 
                              ? 'Target reached' 
                              : formatTimeToGoal(impact.currentMonthsToGoal)}
                          </p>
                          {impact.currentMonthsToGoal >= 0 && (
                            <p className="text-xs text-muted-foreground">
                              {formatDate(impact.currentCompletionDate)}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(impact.currentMonthlyContribution)}/month
                          </p>
                        </div>
                      </div>

                      {/* Scenario State */}
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Scenario Projection</p>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {impact.scenarioMonthsToGoal < 0 
                                ? 'Target reached' 
                                : formatTimeToGoal(impact.scenarioMonthsToGoal)}
                            </p>
                            {hasImpact && (
                              <Badge 
                                className={`${
                                  isFaster 
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                } border-0`}
                              >
                                {isFaster ? (
                                  <TrendingDown className="h-3 w-3 mr-1" />
                                ) : (
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                )}
                                {isFaster ? '-' : '+'}{formatMonthsDifference(impact.monthsDifference)}
                                {isFaster ? ' faster' : ' slower'}
                              </Badge>
                            )}
                          </div>
                          {impact.scenarioMonthsToGoal >= 0 && (
                            <p className="text-xs text-muted-foreground">
                              {formatDate(impact.scenarioCompletionDate)}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(impact.scenarioMonthlyContribution)}/month
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Progress</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-foreground">
                        {formatPercentage((impact.currentAmount / impact.targetAmount) * 100)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(impact.currentAmount)} of {formatCurrency(impact.targetAmount)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar with Milestones */}
                  <div className="relative w-full">
                    {/* Background Track */}
                    <div className="w-full bg-muted rounded-full h-3 relative overflow-hidden">
                      {/* Progress Fill */}
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          isFaster ? 'bg-green-500' : hasImpact ? 'bg-red-500' : 'bg-primary'
                        }`}
                        style={{ 
                          width: `${Math.min(100, (impact.currentAmount / impact.targetAmount) * 100)}%` 
                        }}
                      />
                      
                      {/* Milestone Markers - Subtle dots on the track */}
                      {[25, 50, 75, 100].map((milestone) => {
                        const progressPercent = (impact.currentAmount / impact.targetAmount) * 100;
                        const isReached = progressPercent >= milestone;
                        return (
                          <div
                            key={milestone}
                            className="absolute top-1/2 -translate-y-1/2"
                            style={{ left: `${milestone}%`, transform: 'translate(-50%, -50%)' }}
                          >
                            <div 
                              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                isReached
                                  ? 'bg-background ring-2 ring-background'
                                  : 'bg-muted-foreground/30'
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Milestone Labels - Below the bar */}
                    <div className="relative w-full mt-2 h-4">
                      {[25, 50, 75, 100].map((milestone) => {
                        const progressPercent = (impact.currentAmount / impact.targetAmount) * 100;
                        const isReached = progressPercent >= milestone;
                        return (
                          <div
                            key={milestone}
                            className="absolute top-0"
                            style={{ left: `${milestone}%`, transform: 'translateX(-50%)' }}
                          >
                            <span 
                              className={`text-[11px] font-medium transition-colors ${
                                isReached
                                  ? 'text-foreground'
                                  : 'text-muted-foreground/60'
                              }`}
                            >
                              {milestone}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        {goalImpacts.length > 1 && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-2">Summary</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Goals Affected</p>
                <p className="font-semibold">{goalImpacts.length} goals</p>
              </div>
              <div>
                <p className="text-muted-foreground">Average Impact</p>
                <p className="font-semibold">
                  {(() => {
                    const avgMonths = goalImpacts.reduce((sum, impact) => sum + impact.monthsDifference, 0) / goalImpacts.length;
                    const isAvgFaster = avgMonths < 0;
                    return `${isAvgFaster ? '-' : '+'}${formatMonthsDifference(Math.abs(avgMonths))} ${isAvgFaster ? 'faster' : 'slower'}`;
                  })()}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalImpactDisplay;

