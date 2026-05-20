/**
 * Demo-only types for the public RM workspace preview — not production API shapes.
 */

export type FiDemoPulse = "imminent_risk" | "high_value_upsell" | "watch";

export interface FiDemoMeta {
  asOf: string;
  scenarioName: string;
  disclaimerVersion: string;
}

/** Timeline cluster — icons are illustrative category proxies, not literal medical claims. */
export interface FiDemoTimelineMarker {
  daysAgo: number;
  label: string;
  /** Maps to a Lucide icon name in the UI */
  iconKey: "baby" | "hospital" | "plane" | "shopping" | "home" | "car";
}

export interface FiDemoTxnRow {
  category: string;
  amount: number;
  daysAgo: number;
  categoryAverage6m: number;
  /** Optional merchant / counterpart string for logic trace drilldown */
  merchantHint?: string;
  /** Precomputed: amount > 2 * categoryAverage6m for demo */
  isAnomaly: boolean;
}

export interface FiDemoLiquidity {
  daysOfRunway: number;
  burnRateCurrent: number;
  burnRate6mAvg: number;
  showLiquidityCrunchWarning: boolean;
}

/**
 * Synthetic “behavior → review queue” bridge for demos — not a credit decision or approval.
 * Banks would merge this with bureau, application, and policy systems in production.
 */
export interface FiDemoDecisionSupport {
  /** Routing hint for underwriting / credit ops */
  reviewTier: "standard" | "enhanced_due_diligence" | "priority_credit_review";
  reviewTierLabel: string;
  /** Stable-style codes for audit narratives (illustrative) */
  reasonCodes: string[];
  /** One paragraph: how behavior informs review priority vs. classic file-only views */
  underwritingBridge: string;
}

export interface FiDemoMomentumPoint {
  monthLabel: string;
  score: number;
}

export interface FiDemoActionPayload {
  strategyLabel: string;
  whyNow: string;
}

export interface FiDemoProductOption {
  product: string;
  fitRationale: string;
  tradeoff?: string;
  tag: "recommended" | "alternative";
}

export interface FiDemoProductRecommendation {
  confidenceBand: "high" | "medium" | "low";
  basedOnSignals: {
    matched: number;
    total: number;
  };
  provenanceChips: string[];
  options: FiDemoProductOption[];
}

/** Secondary lane: investment / fund suitability after core banking fit (synthetic). */
export interface FiDemoWealthOption {
  fundName: string;
  fundType: string;
  fitRationale: string;
  tradeoff?: string;
  tag: "recommended" | "alternative";
}

export interface FiDemoWealthRecommendation {
  /** When false, show policy message instead of fund options (e.g. stabilise-first). */
  eligible: boolean;
  ineligibleReason?: string;
  confidenceBand?: "high" | "medium" | "low";
  basedOnSignals?: { matched: number; total: number };
  provenanceChips?: string[];
  options: FiDemoWealthOption[];
}

export interface FiDemoLogicRule {
  code: string;
  expression: string;
  plainEnglish: string;
}

export interface FiDemoLead {
  id: string;
  /** Synthetic stand-in for a customer key — demo only */
  pseudonymKey: string;
  pulse: FiDemoPulse;
  archetypeTag: string;
  merchantClusterId: string;
  propensityScore: number;
  loanBalance: number;
  /** priorityScore = propensityScore * loanBalance (canonical sort key) */
  priorityScore: number;
  oneLiner: string;
  timeline: FiDemoTimelineMarker[];
  liquidity: FiDemoLiquidity;
  transactions: FiDemoTxnRow[];
  callScriptBullets: string[];
  /** Extra narrative bullets for the Customer snapshot panel (demo) */
  snapshotHighlights?: string[];
  /** Behavior → review / underwriting queue (synthetic) */
  decisionSupport: FiDemoDecisionSupport;
  /** 6-month trajectory of behavior health (synthetic index, 0-100) */
  healthMomentum: FiDemoMomentumPoint[];
  /** Deterministic-style indicators for archetype and intent storytelling */
  supportingIndicators: string[];
  /** Suggested RM strategy from the decision-support layer */
  actionPayload: FiDemoActionPayload;
  /** Behavior → banking product-fit (primary lane) */
  productRecommendation: FiDemoProductRecommendation;
  /** Investment / fund suitability (secondary lane; gated by relationship readiness) */
  wealthRecommendation: FiDemoWealthRecommendation;
  /** Bank-auditable logic snippets for demo transparency */
  logicEvidence: {
    rules: FiDemoLogicRule[];
    triggerTransactions: FiDemoTxnRow[];
  };
}

/** Book-level aggregates — synthetic, for product / portfolio planning in the demo */
export interface FiDemoPortfolioKpis {
  customersInBook: number;
  customersWithModeledSignals: number;
  /** Modeled priority queue depth (not only the sample leads on screen) */
  activeQueueDepth: number;
  avgPropensityModeled: number;
  /** Customers flagged with liquidity stress pattern (illustrative) */
  liquidityStressApprox: number;
}

export interface FiDemoArchetypeSlice {
  archetype: string;
  count: number;
  pct: number;
}

/** Book-level pulse mix; `neutral` = no active priority pulse in queue */
export type FiDemoBookPulse = FiDemoPulse | "neutral";

export interface FiDemoPulseSlice {
  pulse: FiDemoBookPulse;
  count: number;
  pct: number;
}

export interface FiDemoProductTheme {
  id: string;
  theme: string;
  primaryArchetype: string;
  /** Share of book with strong cluster alignment to this theme */
  bookSharePct: number;
  productAngle: string;
  /** Sample fixture lead to open in Lead workspace — omit if none in this demo */
  sampleLeadId?: string;
}

export interface FiDemoPortfolio {
  kpis: FiDemoPortfolioKpis;
  archetypes: FiDemoArchetypeSlice[];
  pulses: FiDemoPulseSlice[];
  productThemes: FiDemoProductTheme[];
}

export interface FiDemoFixture {
  meta: FiDemoMeta;
  portfolio: FiDemoPortfolio;
  leads: FiDemoLead[];
}
