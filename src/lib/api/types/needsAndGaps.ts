/**
 * Profile needs and gaps – GET /api/v1/profile/needs
 * Backend returns prioritized gaps (assessment, goals, emergency fund, etc.).
 * Optional purposeStatus from Purpose-Centric Fiduciary Engine.
 */

/** Purpose IDs for the Purpose Scorecard (Purpose-Centric Fiduciary Engine). */
export type PurposeId =
  | 'liquidity_buffer'
  | 'protection_human_capital'
  | 'growth_long_term'
  | 'fee_optimization';

/** Status of a single purpose: coverage 0–1+ (e.g. 1.1 = 110%). */
export interface PurposeStatus {
  purposeId: PurposeId;
  isCovered: boolean;
  coveragePercent: number;
  metadata?: Record<string, unknown>;
}

export type GapType =
  | 'onboarding_assessment'
  | 'onboarding_goals'
  | 'emergency_fund'
  | 'goal_funding'
  | 'banking_fee'
  | 'safety_floor'
  | 'protection_goal';

export type GapSeverity = 'high' | 'medium' | 'low';

export interface GapItemDto {
  type: GapType;
  severity: GapSeverity;
  message: string;
  actionableCopy?: string | null;
  /** Route path or goal id (e.g. "/assessment", "/goals", or goal UUID for /goals/:id) */
  linkTarget?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface NeedsAndGapsDto {
  gaps: GapItemDto[];
  /** Optional; present when backend returns purpose-centric status. */
  purposeStatus?: PurposeStatus[];
}
