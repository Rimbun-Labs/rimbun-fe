export type GoalType =
  | 'retirement'
  | 'house'
  | 'education'
  | 'emergency_fund'
  | 'other';

// Family slug (for logic/mapping) - matches backend slugs exactly
export type GoalFamilySlug =
  | 'invest-grow'
  | 'debt-obligations'
  | 'liquidity-resilience'
  | 'risk-protection'
  | 'lifestyle-milestones'
  | 'values-legacy';

// Family ID (UUID from database) - used for primaryFamilyId field
export type GoalFamilyId = string; // UUID format

export type GoalLifecycleState =
  | 'not_started'
  | 'active'
  | 'on_track'
  | 'needs_attention'
  | 'paused'
  | 'completed'
  | 'archived';

export type GoalStatus = 'active' | 'paused' | 'completed' | 'archived';

export interface GoalMetadata {
  initialInvestment?: number;
  assetAllocation?: Record<string, number>;
  notes?: string;
  templateId?: string | null;
  checklistItems?: Array<{ id: string; label: string; completed: boolean }>;
}

export interface GoalAutomationSettings {
  reminderCadence?: 'weekly' | 'monthly' | 'quarterly';
  autoTransfersEnabled?: boolean;
  nextReminderDate?: string | null;
  lastReminderSentAt?: string | null;
  [key: string]: unknown;
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
  primaryFamilyId?: GoalFamilyId;
  state?: GoalLifecycleState;
  automationSettings?: GoalAutomationSettings | null;
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

export interface GoalFamilyStats {
  totalGoals: number;
  activeGoals: number;
  totalTargetAmount: number;
  totalCurrentAmount: number;
  overallProgress: number;
  averageProgress: number;
}

export interface GoalFamilySummaryDto {
  id: string;
  slug: string;
  displayName: string;
  description: string;
  primaryMetricType: string;
  sortOrder: number;
  stats: GoalFamilyStats;
}

export interface GoalFamiliesSummaryTotals {
  totalFamilies: number;
  familiesWithGoals: number;
  totalGoalsAcrossFamilies: number;
}

export interface GoalFamilySummariesResponse {
  families: GoalFamilySummaryDto[];
  summary?: GoalFamiliesSummaryTotals;
}

export interface GoalFamilyBoardGoal {
  id: string;
  goalName: string;
  primaryMetric: number;
  primaryMetricLabel: string;
  progressPercentage: number;
  priority?: number | null;
}

export interface GoalFamilyBoardColumn {
  state: GoalLifecycleState | string;
  label: string;
  goals: GoalFamilyBoardGoal[];
}

export interface GoalFamilyBoardDto {
  family: {
    id: string;
    slug: string;
    displayName: string;
    description: string;
    primaryMetricType: string;
    sortOrder: number;
  };
  columns: GoalFamilyBoardColumn[];
  stats: GoalFamilyStats;
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
  primaryFamilyId?: GoalFamilyId;
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

// Strategy Simulation Types
export interface SimulateStrategyRequest {
  strategy: 'priority' | 'timeline' | 'proportional' | 'required_savings';
  monthlyBudget: number;
  goalIds?: string[];
  includeInactive?: boolean;
}

export interface GoalAllocationResult {
  goalId: string;
  goalName: string;
  currentContribution: number;
  suggestedContribution: number;
  reason: string;
  projectedCompletionYear?: number;
  projectedCompletionMonth?: number;
  monthsToComplete?: number;
  timeDifference?: number;
}

export interface SimulateStrategyResponse {
  strategy: 'priority' | 'timeline' | 'proportional' | 'required_savings';
  monthlyBudget: number;
  totalAllocated: number;
  remainingBudget: number;
  allocations: GoalAllocationResult[];
  warnings?: string[];
  reasoning: string;
}

// Goal Family Mapping Types
export interface GoalFamilyMappingResponse {
  goalTypeToFamily: Record<string, GoalFamilySlug>;
  familyToGoalTypes: Record<GoalFamilySlug, string[]>;
  validGoalTypes: string[];
  validFamilies: GoalFamilySlug[];
}

