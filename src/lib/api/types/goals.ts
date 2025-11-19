export type GoalType =
  | 'retirement'
  | 'house'
  | 'education'
  | 'emergency_fund'
  | 'other';

export type GoalStatus = 'active' | 'paused' | 'completed' | 'archived';

export interface GoalMetadata {
  initialInvestment?: number;
  assetAllocation?: Record<string, number>;
  notes?: string;
}

export interface GoalDto {
  id: string;
  userId?: string;
  goalName: string;
  goalType: GoalType;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  investmentHorizon?: number | null;
  targetDate?: string | null;
  priority?: number;
  metadata?: GoalMetadata;
  status?: GoalStatus;
  isActive?: boolean;
  isFromAssessment?: boolean;
  assessmentSessionId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface GoalGapInsightsDto {
  currentGap: number;
  recommendedMonthlyContribution?: number;
  recommendedTimeline?: number;
  insights?: string[];
}

export interface TimeAnalysisDto {
  actualYears?: number;
  targetYears?: number;
  differenceYears?: number;
  status?: 'on_track' | 'warning' | 'off_track';
  projectedCompletionYear?: number;
}

export interface GoalWithInsightsDto extends GoalDto {
  goalGapInsights?: GoalGapInsightsDto;
  requiredMonthlySavings?: number;
  currentSavingsRate?: number;
  timeAnalysis?: TimeAnalysisDto;
  goalAchievabilityScore?: number;
  progressPercentage?: number;
  projectedTimeToGoal?: number;
}

export interface GoalsSummaryDto {
  totalGoals: number;
  activeGoals: number;
  totalTargetAmount: number;
  totalCurrentAmount: number;
  overallProgress: number;
}

export interface GoalAllocationSuggestion {
  goalId: string;
  goalName: string;
  currentContribution: number;
  suggestedContribution: number;
  reason: string;
  // difference is calculated on frontend: suggestedContribution - currentContribution
}

export interface AllocationSuggestion {
  strategy: 'priority' | 'timeline' | 'proportional' | 'required_savings';
  allocations: GoalAllocationSuggestion[];
  totalAllocated: number;
  remainingBudget: number;
  reasoning: string;
}

export interface BudgetValidationResult {
  totalRequested: number;
  availableBudget: number;
  isOverBudget: boolean;
  overBudgetAmount?: number;
  warnings: string[];
  suggestions: AllocationSuggestion[];
  assessmentAgeMonths?: number;
  isStaleAssessment?: boolean;
}

export interface UserGoalsResponse {
  goals: GoalWithInsightsDto[];
  summary: GoalsSummaryDto;
  budgetValidation?: BudgetValidationResult | null;
}

export interface CreateGoalRequest {
  goalName: string;
  goalType: GoalType;
  targetAmount: number;
  currentAmount?: number;
  monthlyContribution: number;
  investmentHorizon?: number | null;
  targetDate?: string | null;
  priority?: number;
  metadata?: GoalMetadata;
}

export interface UpdateGoalRequest extends Partial<CreateGoalRequest> {
  status?: GoalStatus;
  isActive?: boolean;
}

export interface GoalProgressSnapshotDto {
  id: string;
  goalId: string;
  month: number;
  year: number;
  currentAmount: number;
  contribution?: number;
  progressPercentage?: number;
  remainingAmount?: number;
  projectedAmount?: number;
  createdAt?: string;
}

export interface GoalProgressTrendsDto {
  momChange?: number | null;
  averageMonthlyContribution?: number | null;
  projectedCompletionDate?: string | null;
  velocity?: 'accelerating' | 'slowing' | 'steady';
}

export interface GoalProgressHistoryDto {
  goal: GoalWithInsightsDto;
  snapshots: GoalProgressSnapshotDto[];
  trends: GoalProgressTrendsDto;
}

