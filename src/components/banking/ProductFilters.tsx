import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { ProductTypeFilter, GoalFilter } from '@/lib/api/types/banking';

export type SortOption = 'matchScore' | 'eligibility' | 'productType' | 'name';

interface ProductFiltersProps {
  selectedType: ProductTypeFilter;
  selectedGoal: GoalFilter;
  sortBy?: SortOption;
  quickFilter?: 'eligibleOnly' | 'highMatch' | null;
  onTypeChange: (type: ProductTypeFilter) => void;
  onGoalChange: (goal: GoalFilter) => void;
  onSortChange?: (sort: SortOption) => void;
  onQuickFilterChange?: (filter: 'eligibleOnly' | 'highMatch' | null) => void;
  availableGoals?: string[];
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedType,
  selectedGoal,
  sortBy,
  quickFilter,
  onTypeChange,
  onGoalChange,
  onSortChange,
  onQuickFilterChange,
  availableGoals = [],
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="savings">Savings</SelectItem>
          <SelectItem value="credit_card">Credit Card</SelectItem>
          <SelectItem value="checking">Checking</SelectItem>
          <SelectItem value="cd">Fixed Deposit</SelectItem>
          <SelectItem value="loan">Loan</SelectItem>
          <SelectItem value="debit_card">Debit Card</SelectItem>
          <SelectItem value="virtual_prepaid_card">Virtual Prepaid Card</SelectItem>
        </SelectContent>
      </Select>

      {availableGoals.length > 0 && (
        <Select value={selectedGoal} onValueChange={onGoalChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Goals" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Goals</SelectItem>
            {availableGoals.map((goal) => (
              <SelectItem key={goal} value={goal}>
                {goal}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {onSortChange && (
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="matchScore">Match Score</SelectItem>
            <SelectItem value="eligibility">Eligibility</SelectItem>
            <SelectItem value="productType">Product Type</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      )}

      {onQuickFilterChange && (
        <div className="flex gap-2">
          <Button
            variant={quickFilter === 'eligibleOnly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onQuickFilterChange(quickFilter === 'eligibleOnly' ? null : 'eligibleOnly')}
          >
            Eligible Only
          </Button>
          <Button
            variant={quickFilter === 'highMatch' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onQuickFilterChange(quickFilter === 'highMatch' ? null : 'highMatch')}
          >
            High Match (80%+)
          </Button>
        </div>
      )}
    </div>
  );
};

