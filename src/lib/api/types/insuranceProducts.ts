/**
 * Insurance products API types.
 * List/overview/safety use ResilienceProductDto; detail and compare use InsuranceProductDetailDto.
 */

import type { ResilienceProductDto } from './resilience';

/** Summary shape for list and overview (cards). Same as backend ResilienceProductDto. */
export type InsuranceProductDto = ResilienceProductDto;

export interface InsuranceProductListResponseDto {
  products: ResilienceProductDto[];
  total: number;
  limit: number;
  offset: number;
}

/** Backend HedgeCompatibilityDto – coverage features for goal/resilience matching */
export interface HedgeCompatibilityDto {
  hasPayorBenefit?: boolean;
  hasWaiverOfPremium?: boolean;
  isGoalCompleter?: boolean;
}

/** Backend EligibilityRulesDto – who can apply */
export interface EligibilityRulesDto {
  minAge?: number;
  maxAge?: number;
  maxCoverageAge?: number;
  occupationalClasses?: string[];
  residencyReq?: string;
}

/** Allocation schedule entry (e.g. 95% to investment, 5% to charges) */
export interface AllocationScheduleEntryDto {
  years?: number | number[];
  allocationPct?: number;
  note?: string;
}

/** Recurring fees (policy admin, management fee, etc.) */
export interface RecurringFeesDto {
  policyAdminFee?: { amount?: number; frequency?: string; note?: string };
  managementFeePct?: number;
  mortalityChargeBasis?: string;
  topUpChargePct?: number;
}

/** Exit costs (surrender penalty, etc.) */
export interface ExitCostsDto {
  hasSurrenderPenalty?: boolean;
  penaltyPeriodYears?: number;
  penaltyNotes?: string;
}

/** Fee structure for TCO / true cost (when product has fee data) */
export interface FeeStructureDto {
  isFrontEndLoaded?: boolean;
  allocationSchedule?: AllocationScheduleEntryDto[];
  recurringFees?: RecurringFeesDto;
  exitCosts?: ExitCostsDto;
}

/**
 * Full product detail (GET .../products/:id and GET .../products/compare).
 * Extends ResilienceProductDto with fields for detail page and comparison.
 */
export interface InsuranceProductDetailDto extends ResilienceProductDto {
  currency?: string;
  riskVectors?: string[];
  payoutStructure?: string;
  capitalCertaintyScore?: number;
  acceptanceFriction?: string;
  hedgeCompatibility?: HedgeCompatibilityDto;
  incomeReplacementMultiplier?: number;
  affordabilityEfficiency?: number;
  eligibility?: EligibilityRulesDto;
  matchingTags?: string[];
  feeStructure?: FeeStructureDto;
}

export interface InsuranceProductCompareResponseDto {
  products: InsuranceProductDetailDto[];
}
