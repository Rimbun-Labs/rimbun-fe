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
  availableTypes?: string[]; // Available product types from actual data
}

const TYPE_LABELS: Record<string, string> = {
  savings: 'Savings',
  credit_card: 'Credit Card',
  checking: 'Checking',
  cd: 'Fixed Deposit',
  loan: 'Loan',
  debit_card: 'Debit Card',
  virtual_prepaid_card: 'Virtual Prepaid Card',
};

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
  availableTypes = [],
}) => {
  // If availableTypes is provided, only show those types
  // Otherwise, show all types (for backward compatibility)
  const typesToShow = availableTypes.length > 0 
    ? availableTypes 
    : ['savings', 'credit_card', 'checking', 'cd', 'loan', 'debit_card', 'virtual_prepaid_card'];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {typesToShow.map((type) => (
            <SelectItem key={type} value={type}>
              {TYPE_LABELS[type] || type}
            </SelectItem>
          ))}
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

