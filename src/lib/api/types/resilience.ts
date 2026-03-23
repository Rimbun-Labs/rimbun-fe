/**
 * Resilience API types – GET /resilience/safety-floor, GET /resilience/overview.
 * Aligned with backend: all responses { data: T }, camelCase, ResilienceProductDto used everywhere.
 */

/** Single source of truth for product shape (list, detail, compare, overview, safety floor) */
export interface ResilienceProductDto {
  productId: string;
  insurerName: string;
  productName: string;
  productCategory: string;
  productSubcategory?: string;
  productPageUrl?: string;
  brochureUrl?: string;
  nudgeCopy?: string;
  estimatedMonthlyPremiumProxy?: number;
  primaryIntent?: string;
  resilienceDepth?: number;
  isTakaful?: boolean;
}

export interface SafetyFloorResponseDto {
  products: ResilienceProductDto[];
  nudgeCopy: string;
  foundationSecurePercent: number;
}

/**
 * Goal with resilience in overview. Matches backend ResilienceResponseDto (same shape as GET /goals/:id/resilience).
 * Overview includes goalName, goalType for display.
 */
export interface ResilienceOverviewGoalDto {
  goalId: string;
  goalName?: string;
  goalType?: string;
  hedgeType: string;
  recommendedSumAssured: number;
  actionCopy: string;
  products: ResilienceProductDto[];
  showNudge: boolean;
  nudgeQuestionCopy: string;
  dependencyScope?: 'self' | 'others';
}

export interface ResilienceOverviewResponseDto {
  safetyFloor: SafetyFloorResponseDto;
  goals: ResilienceOverviewGoalDto[];
}

/** POST /resilience/simulate – request body */
export interface ResilienceSimulateRequest {
  productId: string;
  durationYears: number;
  monthlyPremium?: number;
  lumpSumAmount?: number;
  riskToggle: 'guaranteed_min' | 'projected_best';
  hedgeEventYear?: number;
}

/** One row of the projection table (year 1 to durationYears) */
export interface ProjectionTableRowDto {
  year: number;
  totalPremiumsPaid: number;
  guaranteedCashValue: number;
  projectedValue: number;
  hedgeBenefitIfEventThisYear?: number | null;
  /** Estimated charges/fees to end of this year (BND); from fee_structure */
  estimatedChargesToDate?: number;
}

/** POST /resilience/simulate – response (wrapped as { data: T }) */
export interface ResilienceSimulateResponse {
  projectedValueAtMaturity: number;
  hasPremiumGrowth: boolean;
  hedgeGainIfEventAtYearX?: number | null;
  yieldUsed?: number;
  maturityCapOrFloorApplied?: 'cap' | 'floor' | null;
  projectionTable?: ProjectionTableRowDto[];
  totalPremiumsOverTerm?: number;
  totalEstimatedCharges?: number;
  allocationPctUsed?: number | null;
  managementFeePctUsed?: number | null;
}
