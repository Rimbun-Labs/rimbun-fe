import { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useFormatters } from '@/hooks/useFormatters';
import { AllocationSuggestion } from '@/lib/api/types/goals';
import { Target, Clock, Percent, TrendingUp } from 'lucide-react';

export type StrategyType = AllocationSuggestion['strategy'] | 'current';

interface StrategyControlsProps {
  selectedStrategy: StrategyType;
  onStrategyChange: (strategy: StrategyType) => void;
  monthlyBudget: number;
  onBudgetChange: (budget: number) => void;
  availableBudget: number;
  totalRequested: number;
  strategies?: AllocationSuggestion[];
}

const strategyOptions: Array<{
  value: StrategyType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  {
    value: 'current',
    label: 'Current Allocation',
    icon: Target,
    description: 'Your current goal contributions',
  },
  {
    value: 'priority',
    label: 'Priority-Based',
    icon: Target,
    description: 'Fund highest priority goals first',
  },
  {
    value: 'timeline',
    label: 'Timeline-Based',
    icon: Clock,
    description: 'Fund goals with earliest deadlines first',
  },
  {
    value: 'proportional',
    label: 'Proportional',
    icon: Percent,
    description: 'Distribute by target amount ratio',
  },
  {
    value: 'required_savings',
    label: 'Required Savings',
    icon: TrendingUp,
    description: 'Match required monthly for each goal',
  },
];

export const StrategyControls = ({
  selectedStrategy,
  onStrategyChange,
  monthlyBudget,
  onBudgetChange,
  availableBudget,
  totalRequested,
  strategies = [],
}: StrategyControlsProps) => {
  const { formatCurrency } = useFormatters();

  // Calculate budget range
  const minBudget = Math.max(0, totalRequested - availableBudget * 2);
  const maxBudget = Math.max(totalRequested * 1.5, availableBudget * 2);

  const budgetDifference = monthlyBudget - totalRequested;
  const isOverBudget = budgetDifference > 0;
  const remainingBudget = monthlyBudget - totalRequested;

  // Get strategy options (only show strategies that are available)
  const availableStrategies = useMemo(() => {
    const strategyMap = new Map(strategies.map(s => [s.strategy, s]));
    return strategyOptions.filter(opt => 
      opt.value === 'current' || strategyMap.has(opt.value as AllocationSuggestion['strategy'])
    );
  }, [strategies]);

  return (
    <div className="space-y-4">
      {/* Strategy Selector */}
      <div className="space-y-2">
        <Label htmlFor="strategy-select">Allocation Strategy</Label>
        <Select
          value={selectedStrategy}
          onValueChange={(value) => onStrategyChange(value as StrategyType)}
        >
          <SelectTrigger id="strategy-select">
            <SelectValue placeholder="Select a strategy" />
          </SelectTrigger>
          <SelectContent>
            {availableStrategies.map((strategy) => {
              const Icon = strategy.icon;
              return (
                <SelectItem key={strategy.value} value={strategy.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{strategy.label}</div>
                      <div className="text-xs text-muted-foreground">{strategy.description}</div>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Budget Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="budget-slider">Monthly Budget</Label>
          <div className="text-sm font-semibold">{formatCurrency(monthlyBudget)}</div>
        </div>
        <Slider
          id="budget-slider"
          min={minBudget}
          max={maxBudget}
          step={100}
          value={[monthlyBudget]}
          onValueChange={([value]) => onBudgetChange(value)}
          className="w-full"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatCurrency(minBudget)}</span>
          <span>{formatCurrency(maxBudget)}</span>
        </div>
        
        {/* Budget Status */}
        <div className="rounded-lg border p-3 space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Requested</span>
            <span>{formatCurrency(totalRequested)}</span>
          </div>
          {isOverBudget ? (
            <div className="flex items-center justify-between text-sm text-red-600 dark:text-red-400">
              <span>Over Budget</span>
              <span>+{formatCurrency(budgetDifference)}</span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-sm text-green-600 dark:text-green-400">
              <span>Remaining Budget</span>
              <span>{formatCurrency(remainingBudget)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

