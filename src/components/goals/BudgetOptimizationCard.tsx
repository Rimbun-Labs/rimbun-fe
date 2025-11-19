import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  TrendingUp,
  Clock,
  Percent,
  Target,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { BudgetValidationResult, AllocationSuggestion } from '@/lib/api/types/goals';
import { useFormatters } from '@/hooks/useFormatters';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface BudgetOptimizationCardProps {
  budgetValidation: BudgetValidationResult;
}

const strategyLabels: Record<AllocationSuggestion['strategy'], { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  priority: { label: 'Priority-Based', icon: Target },
  timeline: { label: 'Timeline-Based', icon: Clock },
  proportional: { label: 'Proportional', icon: Percent },
  required_savings: { label: 'Required Savings', icon: TrendingUp },
};

export const BudgetOptimizationCard: React.FC<BudgetOptimizationCardProps> = ({
  budgetValidation,
}) => {
  const { formatCurrency } = useFormatters();
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);

  const { totalRequested, availableBudget, isOverBudget, overBudgetAmount, warnings, suggestions, isStaleAssessment } = budgetValidation;

  return (
    <Card className="border-amber-200 dark:border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              Budget Optimization
            </CardTitle>
            <CardDescription>
              Your goals require more than your available budget
            </CardDescription>
          </div>
          {isStaleAssessment && (
            <Badge variant="outline" className="text-xs">
              <Info className="h-3 w-3 mr-1" />
              Stale Assessment
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Budget Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-amber-200 dark:border-amber-500/40 bg-background p-4">
            <p className="text-xs uppercase text-muted-foreground mb-1">Total Requested</p>
            <p className="text-xl font-semibold text-amber-600 dark:text-amber-400">
              {formatCurrency(totalRequested)}
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 dark:border-amber-500/40 bg-background p-4">
            <p className="text-xs uppercase text-muted-foreground mb-1">Available Budget</p>
            <p className="text-xl font-semibold">{formatCurrency(availableBudget)}</p>
          </div>
          {isOverBudget && overBudgetAmount && (
            <div className="rounded-lg border border-red-200 dark:border-red-500/40 bg-red-50/50 dark:bg-red-950/20 p-4">
              <p className="text-xs uppercase text-muted-foreground mb-1">Over Budget</p>
              <p className="text-xl font-semibold text-red-600 dark:text-red-400">
                {formatCurrency(overBudgetAmount)}
              </p>
            </div>
          )}
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Budget Warning</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1 mt-2">
                {warnings.map((warning, idx) => (
                  <li key={idx}>{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Allocation Strategies */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Allocation Strategies</h4>
            <p className="text-sm text-muted-foreground">
              Choose a strategy to optimize your budget allocation across goals:
            </p>
            <div className="space-y-2">
              {suggestions.map((suggestion) => {
                const StrategyIcon = strategyLabels[suggestion.strategy].icon;
                const isExpanded = expandedStrategy === suggestion.strategy;
                const isFullyAllocated = suggestion.remainingBudget === 0;

                return (
                  <Collapsible
                    key={suggestion.strategy}
                    open={isExpanded}
                    onOpenChange={(open) => setExpandedStrategy(open ? suggestion.strategy : null)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between h-auto py-3 px-4"
                      >
                        <div className="flex items-center gap-3 flex-1 text-left">
                          <StrategyIcon className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {strategyLabels[suggestion.strategy].label}
                              </span>
                              {isFullyAllocated && (
                                <Badge variant="secondary" className="text-xs">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Fully Allocated
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {suggestion.reasoning}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">
                              {formatCurrency(suggestion.totalAllocated)}
                            </p>
                            {suggestion.remainingBudget > 0 && (
                              <p className="text-xs text-muted-foreground">
                                {formatCurrency(suggestion.remainingBudget)} remaining
                              </p>
                            )}
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 ml-2" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-2" />
                          )}
                        </div>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <Card className="mt-2 border-t-0 rounded-t-none">
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div className="text-sm text-muted-foreground mb-3">
                              {suggestion.reasoning}
                            </div>
                            <div className="space-y-2">
                              {suggestion.allocations.map((allocation) => (
                                <div
                                  key={allocation.goalId}
                                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                                >
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{allocation.goalName}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {allocation.reason}
                                    </p>
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-muted-foreground line-through">
                                        {formatCurrency(allocation.currentContribution)}
                                      </span>
                                      <span className="text-sm font-semibold">
                                        {formatCurrency(allocation.suggestedContribution)}
                                      </span>
                                    </div>
                                    {(() => {
                                      const difference = allocation.suggestedContribution - allocation.currentContribution;
                                      return difference !== 0 && (
                                        <p
                                          className={`text-xs mt-0.5 ${
                                            difference > 0
                                              ? 'text-green-600 dark:text-green-400'
                                              : 'text-red-600 dark:text-red-400'
                                          }`}
                                        >
                                          {difference > 0 ? '+' : ''}
                                          {formatCurrency(difference)}
                                        </p>
                                      );
                                    })()}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="pt-3 border-t flex items-center justify-between">
                              <span className="text-sm font-medium">Total Allocated</span>
                              <span className="text-sm font-semibold">
                                {formatCurrency(suggestion.totalAllocated)}
                              </span>
                            </div>
                            {suggestion.remainingBudget > 0 && (
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Remaining Budget</span>
                                <span>{formatCurrency(suggestion.remainingBudget)}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetOptimizationCard;

