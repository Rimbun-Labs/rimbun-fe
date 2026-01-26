import { useMemo, useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Play } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { StrategyControls, StrategyType } from './StrategyControls';
import { GoalProgressTimeline } from './GoalProgressTimeline';
import {
  GoalWithInsightsDto,
  BudgetValidationResult,
  GoalFamilySummaryDto,
  SimulateStrategyResponse,
} from '@/lib/api/types/goals';
import { useAuth } from '@/contexts/AuthContext';
import { useSimulateStrategy } from '@/hooks/useGoals';

interface AllocationStrategySimulatorProps {
  goals: GoalWithInsightsDto[];
  budgetValidation?: BudgetValidationResult | null;
  familySummaries?: GoalFamilySummaryDto[];
  isLoading?: boolean;
}

export const AllocationStrategySimulator = ({
  goals,
  budgetValidation,
  familySummaries,
  isLoading,
}: AllocationStrategySimulatorProps) => {
  const { user } = useAuth();
  const userId = user?.uid ?? '';
  const simulateStrategy = useSimulateStrategy(userId);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>('current');
  
  // Calculate default budget from goals if not provided
  const defaultBudget = useMemo(() => {
    if (budgetValidation?.availableBudget) {
      return budgetValidation.availableBudget;
    }
    // Sum all current monthly contributions
    const totalContributions = goals.reduce(
      (sum, goal) => sum + Number(goal.monthlyContribution ?? 0),
      0
    );
    // Default to 1.5x total contributions or $1000, whichever is higher
    return Math.max(totalContributions * 1.5, 1000);
  }, [budgetValidation?.availableBudget, goals]);
  
  const [monthlyBudget, setMonthlyBudget] = useState(defaultBudget);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Update budget when default changes
  useEffect(() => {
    if (defaultBudget > 0 && monthlyBudget === 0) {
      setMonthlyBudget(defaultBudget);
    }
  }, [defaultBudget, monthlyBudget]);

  // Debounced simulation API call
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Don't call API if current strategy or no goals
    if (selectedStrategy === 'current' || !goals.length || !userId) {
      return;
    }

    // Debounce API call by 500ms
    debounceTimerRef.current = setTimeout(() => {
      simulateStrategy.mutate({
        strategy: selectedStrategy as 'priority' | 'timeline' | 'proportional' | 'required_savings',
        monthlyBudget,
        includeInactive: false,
      });
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [selectedStrategy, monthlyBudget, goals.length, userId]);

  // Create simulated goals from API response
  const simulatedGoals = useMemo(() => {
    if (selectedStrategy === 'current' || !simulateStrategy.data) {
      return goals;
    }

    const allocationMap = new Map(
      simulateStrategy.data.allocations.map(a => [a.goalId, a.suggestedContribution])
    );

    // Update goals with new monthly contributions from API
    return goals.map(goal => {
      const allocation = allocationMap.get(goal.id);
      if (allocation !== undefined) {
        return {
          ...goal,
          monthlyContribution: allocation,
        };
      }
      return goal;
    });
  }, [goals, simulateStrategy.data, selectedStrategy]);

  const totalRequested = budgetValidation?.totalRequested ?? 
    goals.reduce((sum, goal) => sum + Number(goal.monthlyContribution ?? 0), 0);
  const availableBudget = budgetValidation?.availableBudget ?? monthlyBudget;

  // Don't show if no goals
  if (!goals.length && !isLoading) {
    return null;
  }

  return (
    <Card className="w-full">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto"
            >
              <div className="flex items-center gap-3">
                <Play className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <CardTitle className="text-lg">Strategy Simulator</CardTitle>
                  <CardDescription>
                    Compare different allocation strategies and see their impact on your goals
                  </CardDescription>
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Controls */}
            <StrategyControls
              selectedStrategy={selectedStrategy}
              onStrategyChange={setSelectedStrategy}
              monthlyBudget={monthlyBudget}
              onBudgetChange={setMonthlyBudget}
              availableBudget={availableBudget}
              totalRequested={totalRequested}
              strategies={budgetValidation?.suggestions}
            />
            
            {/* Show error if simulation fails */}
            {simulateStrategy.isError && selectedStrategy !== 'current' && (
              <div className="rounded-lg border border-red-200 dark:border-red-500/40 bg-red-50/50 dark:bg-red-950/20 p-3">
                <p className="text-sm text-red-800 dark:text-red-200">
                  Failed to simulate strategy. Please try again.
                </p>
              </div>
            )}

            {/* Comparison Chart */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Strategy Comparison</h3>
                {selectedStrategy !== 'current' && (
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-muted-foreground opacity-60" />
                      <span className="text-muted-foreground">Current (dashed)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-primary" />
                      <span>{strategyOptions.find(s => s.value === selectedStrategy)?.label}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Enhanced Timeline with Strategy Overlay */}
              <GoalProgressTimeline
                goals={selectedStrategy === 'current' ? goals : simulatedGoals}
                isLoading={isLoading || simulateStrategy.isPending}
                familySummaries={familySummaries}
                showStrategyComparison={selectedStrategy !== 'current'}
                comparisonGoals={selectedStrategy !== 'current' ? goals : undefined}
              />
              
              {/* Show warnings if any */}
              {simulateStrategy.data?.warnings && simulateStrategy.data.warnings.length > 0 && (
                <div className="rounded-lg border border-amber-200 dark:border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20 p-3">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">Warnings</p>
                  <ul className="text-xs text-amber-700 dark:text-amber-300 list-disc list-inside space-y-1">
                    {simulateStrategy.data.warnings.map((warning, idx) => (
                      <li key={idx}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

// Strategy options for display
const strategyOptions = [
  { value: 'current', label: 'Current Allocation' },
  { value: 'priority', label: 'Priority-Based' },
  { value: 'timeline', label: 'Timeline-Based' },
  { value: 'proportional', label: 'Proportional' },
  { value: 'required_savings', label: 'Required Savings' },
];

