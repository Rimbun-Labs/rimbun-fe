export type RiskBand = "low" | "medium" | "high";

export type FiQueueBucket = "ACT_NOW" | "MONITOR" | "SUPPRESSED_HOLD" | "NEEDS_DATA";

export interface FiQueueTriage {
  queueBucket?: FiQueueBucket;
  queueReason?: string;
  queuePriorityScore?: number; // 0-100, higher = sooner
}

export type FiActionCategory = "risk_mitigation" | "affordability" | "cross_sell" | "engagement";

export type FiIntentType =
  | "liquidity_pressure"
  | "income_stability"
  | "debt_consolidation"
  | "home_intent"
  | "travel_intent"
  | "savings_growth"
  | "unknown";

export interface FiDecisionRiskItem {
  score: number;
  band: RiskBand;
  confidence: RiskBand | string;
  reasons: string[];
}

export interface FiDecisionAffordability {
  monthlyIncome?: number;
  monthlySpending?: number;
  commitmentRatio: number;
  burnRate?: number;
  safeInstallmentCapacity: number;
  remainingAmount: number;
  recommendation: string;
}

/** Product suitability / profile fit (0–100). Replaces legacy `productPropensity` + `score`. */
export interface FiDecisionProductFit {
  productType: string;
  fitScore: number;
  rationale: string;
}

/** Near-term activation / next-best-action strength. */
export interface FiDecisionActivationPropensity {
  productType: string;
  fitScore: number;
  activationScore: number;
  rationale: string;
  suppressed: boolean;
  suppressReasons?: string[];
}

export interface FiDecisionMerchantPropensity {
  merchantFamily: string;
  /** Legacy concentration score (0-100). */
  score: number;
  /** Share-oriented concentration score (0-100). */
  shareScore?: number;
  /** Last 30 days vs prior 30 days share trend. */
  trend30dPct?: number | null;
  /** Distinct active days in last 30 days. */
  recency30d?: number;
  /** Transaction count in last 30 days. */
  txnCount30d?: number;
  /** 3-month coefficient of variation. */
  volatility3mCv?: number | null;
  /** Near-term intent strength (0-100). */
  intentScore?: number;
  /** Confidence 0-1. */
  confidence?: number;
  /** Monthly share series for mini sparkline (latest 6 months). */
  monthlyShareSeries?: Array<{
    period: string;
    share: number;
    amount: number;
  }>;
  rationale: string;
}

export interface FiDecisionIntentSignal {
  intentType: FiIntentType | string;
  urgency: "low" | "medium" | "high";
  message: string;
}

export interface FiDecisionAction {
  priority: number;
  title: string;
  rationale: string;
  category: FiActionCategory;
}

export interface FiDecisionSourceStatus {
  hasSpendingAnalysis?: boolean;
  hasNeedsAndGaps?: boolean;
  hasBankingRecommendations?: boolean;
  /** Whether behavioral spend windows could be computed (even if amounts are zero). */
  hasBehavioralEnrichment?: boolean;
  [key: string]: boolean | undefined;
}

/** Single period comparison (e.g. last 30 vs prior 30). */
export interface FiDecisionBehavioralWindowSlice {
  totalDebit: number;
  priorTotalDebit: number;
  totalDebitDeltaPct: number | null;
  debtDebit: number;
  priorDebtDebit: number;
  debtDebitDeltaPct: number | null;
  discretionaryDebit: number;
  priorDiscretionaryDebit: number;
  discretionaryDebitDeltaPct: number | null;
}

export interface FiDecisionBehavioralWindows {
  last30VsPrior30?: FiDecisionBehavioralWindowSlice;
  last90VsPrior90?: FiDecisionBehavioralWindowSlice;
}

export interface FiDecisionOfferSuppression {
  crossSellSuppressed: boolean;
  reasons: string[];
}

export interface FiDecisionLiquidityContext {
  monthlyCashflowDeficit: number;
  monthlyCashflowSurplus: number;
  emergencyFundCurrentAmount?: number | null;
  emergencyFundTargetAmount?: number | null;
  emergencyFundMonthsOfExpenses?: number | null;
  emergencyFundTargetMonths?: number | null;
  emergencyFundGapAmount?: number | null;
  emergencyFundGapMonths?: number | null;
  estimatedRunwayMonths?: number | null;
}

export interface FiDecisionLiquidityRiskBreakdown {
  baseScore: number;
  cashflowAdjustment: number;
  burnRateAdjustment: number;
  emergencyFundAdjustment: number;
  finalScore: number;
}

export interface FiDecisionStressRiskBreakdown {
  baseScore: number;
  highSeverityGapAdjustment: number;
  mediumSeverityGapAdjustment: number;
  cashflowAdjustment: number;
  burnRateAdjustment: number;
  finalScore: number;
}

export interface FiDecisionRiskBreakdown {
  liquidity: FiDecisionLiquidityRiskBreakdown;
  stress: FiDecisionStressRiskBreakdown;
}

export interface FiDecisionFamilyCoverageMeta {
  coverage: number; // 0..1
  qualityFlag: "HIGH" | "MEDIUM" | "INSUFFICIENT";
  confidenceFloor: number; // 0..1
}

export interface FiDecisionMetadata {
  decisionId?: string;
  generatedAt?: string;
  /** e.g. `fiDecisionEngine`, `merchantModel`, `spendLocationEngine` */
  versions?: Record<string, string>;
  featureFreshness?: Record<string, string>;
}

/** Where spend is concentrated and how stable that pattern is (engine narrative layer). */
export type FiDecisionSpendLocationBehaviorPattern =
  | "insufficient_history"
  | "sticky_recurring"
  | "episodic_volatile"
  | "mixed";

export type FiDecisionSpendLocationConfidenceTier = "HIGH" | "MED" | "LOW";

export interface FiDecisionSpendLocationHypothesis {
  rank: number;
  merchantFamily: string;
  anchorRole: "primary" | "secondary";
  behaviorPattern: FiDecisionSpendLocationBehaviorPattern;
  hypothesisConfidenceTier: FiDecisionSpendLocationConfidenceTier;
  narrativeHint: string;
  shareScore: number;
  intentScore: number;
}

export type FiDecisionSpendBehaviorDominantMode =
  | "routine"
  | "bursty"
  | "volatile"
  | "insufficient_data";

export type FiDecisionSpendBehaviorPressure = "low" | "medium" | "high";

export type FiDecisionSpendBehaviorConcentrationTier = "high" | "medium" | "low";

export interface FiDecisionSpendBehaviorProfile {
  dominantMode: FiDecisionSpendBehaviorDominantMode;
  discretionaryPressure: FiDecisionSpendBehaviorPressure;
  walletConcentration: number; // 0..100
  walletConcentrationTier: FiDecisionSpendBehaviorConcentrationTier;
  stabilityIndex: number; // 0..100
  confidenceTier: FiDecisionSpendLocationConfidenceTier;
  rmGuidance: string[];
}

export interface FiDecisionNext30dSpendLikelihood {
  rank: number;
  merchantFamily: string;
  likelihoodTier: FiDecisionSpendLocationConfidenceTier;
  expectedPattern: "repeat" | "episodic" | "uncertain";
  evidence: string;
  doNotOverclaim: string;
}

export interface FiDecisionSpendLocation {
  title: string;
  subtitle: string;
  disclaimer: string;
  engineVersion: string;
  hypotheses: FiDecisionSpendLocationHypothesis[];
  spendBehaviorProfile: FiDecisionSpendBehaviorProfile;
  next30dSpendLikelihoodByFamily: FiDecisionNext30dSpendLikelihood[];
}

export interface FiDecisionDataSufficiencyMetric {
  sufficient?: boolean;
  status?: "SUFFICIENT" | "PARTIAL" | "INSUFFICIENT" | string;
  reason?: string;
  details?: string;
}

export interface FiDecisionDataSufficiency {
  risk?: FiDecisionDataSufficiencyMetric;
  affordability?: FiDecisionDataSufficiencyMetric;
  propensity?: FiDecisionDataSufficiencyMetric;
  merchantPropensity?: FiDecisionDataSufficiencyMetric;
  behavioral?: FiDecisionDataSufficiencyMetric;
  actions?: FiDecisionDataSufficiencyMetric;
  [key: string]: FiDecisionDataSufficiencyMetric | undefined;
}

export interface FiDecisionSuppressionApplied {
  key?: string;
  scope?: string;
  rule?: string;
  reason: string;
  triggered: boolean;
}

export interface FiDecisionPropensityAndIntent {
  productFit?: FiDecisionProductFit[];
  activationPropensity?: FiDecisionActivationPropensity[];
  merchantPropensity?: FiDecisionMerchantPropensity[];
  intentSignals?: FiDecisionIntentSignal[];
  /**
   * @deprecated Pre–v2 API: `productPropensity` + `score`. Prefer `productFit` + `fitScore`.
   * Kept optional for transitional responses.
   */
  productPropensity?: Array<{ productType: string; score: number; rationale: string }>;
}

export interface FiDecisionInsightsDto {
  executiveSummary: string;
  risk: {
    liquidityRisk: FiDecisionRiskItem;
    stressRisk: FiDecisionRiskItem;
  };
  affordability: FiDecisionAffordability;
  propensityAndIntent: FiDecisionPropensityAndIntent;
  actions: FiDecisionAction[];
  sourceStatus?: FiDecisionSourceStatus;
  /** `null` when enrichment DB unavailable or insufficient history. */
  behavioralWindows?: FiDecisionBehavioralWindows | null;
  offerSuppression?: FiDecisionOfferSuppression;
  liquidityContext?: FiDecisionLiquidityContext;
  riskBreakdown?: FiDecisionRiskBreakdown;
  merchantResolutionCoverage?: number; // 0..1
  unresolvedSpendShare?: number; // 0..1
  familyCoverageMap?: Record<string, FiDecisionFamilyCoverageMeta>;
  decisionMetadata?: FiDecisionMetadata;
  /** Primary anchor + behavior pattern narrative; optional — use `merchantPropensity` for detail when absent. */
  spendLocation?: FiDecisionSpendLocation;
  dataSufficiency?: FiDecisionDataSufficiency;
  suppressionApplied?: FiDecisionSuppressionApplied[];
  // Optional RM triage fields (if backend provides queue bucketing)
  queueBucket?: FiQueueBucket;
  queueReason?: string;
  queuePriorityScore?: number;
  generatedAt?: string;
}

export interface BankCustomerListItem {
  userId: string;
  email?: string;
  displayName?: string;
  role?: string;
  // Optional RM triage fields (if backend provides them)
  queueBucket?: FiQueueBucket;
  queueReason?: string;
  queuePriorityScore?: number; // 0-100
}

export interface BankCustomersResponseDto {
  data: BankCustomerListItem[];
  pagination?: {
    limit: number;
    offset: number;
    count: number;
  };
}

export interface FiQueueBucketSummaryDto {
  userId: string;
  email?: string;
  displayName?: string;
  queueBucket: FiQueueBucket;
  queueReason: string;
  queuePriorityScore: number; // 0-100
  diagnostics?: {
    readinessTier?: string;
    gateFailures?: string[];
    resolvedShare?: number;
    debitRows?: number;
    lastDebitDate?: string | null;
  };
}

export interface FiQueueBucketSummaryResponseDto {
  data: FiQueueBucketSummaryDto[];
  pagination?: {
    limit: number;
    offset: number;
    count: number;
  };
}

/** Readiness tier counts from `meta.bookSummary` (ranked candidate pool or legacy page). */
export type FiQueueReadinessTier = "READY" | "PARTIAL" | "NEEDS_DATA";

export type FiQueueBookSummaryScope = "ranked_candidate_pool" | "legacy_page";

export type FiQueueBookSummaryMode = "ranked" | "legacy";

/** Aggregated queue/readiness counts — same resolver as rows; no extra scoring. */
export interface FiQueueBookSummary {
  scope: FiQueueBookSummaryScope;
  mode: FiQueueBookSummaryMode;
  candidatePoolSize: number;
  returnedCount: number;
  limit: number;
  offset: number;
  asOf: string;
  countsByQueueBucket: Record<FiQueueBucket, number>;
  countsByReadinessTier: Record<FiQueueReadinessTier, number>;
}

/** Optional keys on list responses (queue-buckets, etc.). */
export interface FiQueueBucketsResponseMeta {
  timestamp?: string | number;
  version?: string;
  bookSummary?: FiQueueBookSummary;
}

export interface FiDecisionExplainDto {
  generatedAt?: string;
  riskDrivers?: {
    liquidity?: string[];
    stress?: string[];
  };
  affordabilityDrivers?: {
    recommendation?: string;
    commitmentRatio?: number;
    safeInstallmentCapacity?: number;
  };
  productFitDrivers?: FiDecisionProductFit[];
  activationPropensityDrivers?: FiDecisionActivationPropensity[];
  merchantPropensityDrivers?: FiDecisionMerchantPropensity[];
  intentDrivers?: FiDecisionIntentSignal[];
  behavioralWindows?: FiDecisionBehavioralWindows | null;
  offerSuppression?: FiDecisionOfferSuppression;
  liquidityContext?: FiDecisionLiquidityContext;
  riskBreakdown?: FiDecisionRiskBreakdown;
  merchantResolutionCoverage?: number; // 0..1
  unresolvedSpendShare?: number; // 0..1
  familyCoverageMap?: Record<string, FiDecisionFamilyCoverageMeta>;
  decisionMetadata?: FiDecisionMetadata;
  spendLocation?: FiDecisionSpendLocation;
  dataSufficiency?: FiDecisionDataSufficiency;
  suppressionApplied?: FiDecisionSuppressionApplied[];
  /**
   * @deprecated Use `productFitDrivers` + `activationPropensityDrivers`.
   */
  propensityDrivers?: Array<{ productType: string; score?: number; fitScore?: number; rationale: string }>;
}
