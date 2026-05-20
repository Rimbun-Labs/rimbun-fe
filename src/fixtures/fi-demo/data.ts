import type { FiDemoFixture, FiDemoLead } from "./types";

function withPriority(l: Omit<FiDemoLead, "priorityScore">): FiDemoLead {
  return {
    ...l,
    priorityScore: l.propensityScore * l.loanBalance,
  };
}

const rawLeads: FiDemoLead[] = [
  withPriority({
    id: "lead_001",
    pseudonymKey: "cust_demo_882",
    pulse: "high_value_upsell",
    archetypeTag: "Rising Professional",
    merchantClusterId: "MC_HOME_FURN_01",
    propensityScore: 0.85,
    loanBalance: 420000,
    oneLiner:
      "Customer #882 shows ~85% modeled propensity for a home loan upsell based on 3 months of elevated furniture and utility spend vs. baseline — synthetic scenario.",
    timeline: [
      { daysAgo: 90, label: "Home goods cluster ↑", iconKey: "home" },
      { daysAgo: 60, label: "Furniture & baby retail lift", iconKey: "baby" },
      { daysAgo: 30, label: "Utility + recurring stability", iconKey: "shopping" },
    ],
    liquidity: {
      daysOfRunway: 118,
      burnRateCurrent: 4200,
      burnRate6mAvg: 3800,
      showLiquidityCrunchWarning: false,
    },
    transactions: [
      { category: "Furniture", amount: 2400, daysAgo: 12, categoryAverage6m: 400, merchantHint: "HomeHub Furnishings", isAnomaly: true },
      { category: "Utilities", amount: 320, daysAgo: 5, categoryAverage6m: 280, merchantHint: "BIBD Utilities Portal", isAnomaly: false },
      { category: "Groceries", amount: 580, daysAgo: 3, categoryAverage6m: 520, merchantHint: "Seri Mart", isAnomaly: false },
    ],
    callScriptBullets: [
      "Open with stability: “We noticed a positive pattern in how you’re setting up your household budget.”",
      "Bridge to need: “Many customers in a similar phase consolidate with a structured home solution.”",
      "Offer factsheet + next step — no rate promises in this demo.",
    ],
    snapshotHighlights: [
      "Modeled relationship tenure band: 3–5 yrs (synthetic).",
      "Primary bundle: retail mass + cards (illustrative).",
      "Last modeled outreach touch: 12 days ago (fixture).",
    ],
    decisionSupport: {
      reviewTier: "priority_credit_review",
      reviewTierLabel: "Priority credit review",
      reasonCodes: ["BHVR_HOME_INTENT_↑", "SPEND_FURN_90D", "UTIL_STABLE"],
      underwritingBridge:
        "Modeled life-stage and home-goods lift suggests high intent for a secured facility; behavior raises priority in the origination queue so underwriting sees the file with context before a bureau-only triage would surface it. Approval still follows bank policy, income verification, and scoring — this layer routes and explains priority, it does not replace credit decisioning.",
    },
    healthMomentum: [
      { monthLabel: "Nov", score: 72 },
      { monthLabel: "Dec", score: 74 },
      { monthLabel: "Jan", score: 77 },
      { monthLabel: "Feb", score: 81 },
      { monthLabel: "Mar", score: 84 },
      { monthLabel: "Apr", score: 86 },
    ],
    supportingIndicators: [
      "Consistent utility payments for 6 months with low variance.",
      "Home + furniture category lift sustained across 90 days.",
      "Low grocery spend volatility vs. personal baseline.",
    ],
    actionPayload: {
      strategyLabel: "Offer life-stage home bundle",
      whyNow: "Momentum has improved for 4 consecutive months while home-intent clusters stay elevated.",
    },
    productRecommendation: {
      confidenceBand: "high",
      basedOnSignals: { matched: 5, total: 6 },
      provenanceChips: ["statement-derived", "spending trend", "behavior cluster"],
      options: [
        {
          product: "Home & protection starter bundle",
          fitRationale: "Home-intent cluster + stable utilities + improving momentum align with life-stage lending entry.",
          tag: "recommended",
        },
        {
          product: "Priority pre-approval consult",
          fitRationale: "High propensity and balance justify fast-path advisory before formal application.",
          tradeoff: "Requires earlier underwriting engagement resources.",
          tag: "alternative",
        },
        {
          product: "Deposit growth plus mortgage prep",
          fitRationale: "Supports readiness if customer prefers to stage borrowing later.",
          tradeoff: "Lower near-term conversion than immediate bundle path.",
          tag: "alternative",
        },
      ],
    },
    wealthRecommendation: {
      eligible: true,
      confidenceBand: "medium",
      basedOnSignals: { matched: 4, total: 6 },
      provenanceChips: ["assessment risk profile", "surplus cashflow", "core banking in place"],
      options: [
        {
          fundName: "Balanced income unit trust (moderate risk)",
          fundType: "Unit trust",
          fitRationale:
            "Core banking relationship and improving momentum suggest capacity for a balanced income sleeve after life-stage lending is addressed — subject to suitability assessment. Illustrative product class; production would surface names from your fund catalog.",
          tag: "recommended",
        },
        {
          fundName: "Regular savings plan — Equity growth (moderate)",
          fundType: "Regular contribution",
          fitRationale: "Staged wealth build for customers who prefer smaller monthly commitments before larger lump sums.",
          tradeoff: "Longer horizon; less immediate AUM than a single subscription.",
          tag: "alternative",
        },
      ],
    },
    logicEvidence: {
      rules: [
        {
          code: "RULE_HOME_INTENT_01",
          expression: "IF (FURNITURE_90D > 2x AVG_6M) AND (UTILITIES_STABLE = TRUE)",
          plainEnglish: "Large furniture lift plus stable utilities indicates move-in / home setup intent.",
        },
        {
          code: "RULE_PROPENSITY_LIFE_STAGE",
          expression: "IF (HOME_CLUSTER_COUNT >= 3) AND (BURN_DELTA <= 15%)",
          plainEnglish: "Repeated home cluster with manageable burn supports origination-first talk track.",
        },
      ],
      triggerTransactions: [
        { category: "Furniture", amount: 2400, daysAgo: 12, categoryAverage6m: 400, merchantHint: "HomeHub Furnishings", isAnomaly: true },
        { category: "Utilities", amount: 320, daysAgo: 5, categoryAverage6m: 280, merchantHint: "BIBD Utilities Portal", isAnomaly: false },
      ],
    },
  }),
  withPriority({
    id: "lead_002",
    pseudonymKey: "cust_demo_441",
    pulse: "imminent_risk",
    archetypeTag: "Silent Struggler",
    merchantClusterId: "MC_CASHFLOW_STRESS",
    propensityScore: 0.72,
    loanBalance: 180000,
    oneLiner:
      "Burn rate vs. 6-month average suggests tightening liquidity — useful for a proactive restructuring conversation (illustrative).",
    timeline: [
      { daysAgo: 45, label: "Cash-out pattern", iconKey: "shopping" },
      { daysAgo: 21, label: "BNPL frequency ↑", iconKey: "car" },
      { daysAgo: 7, label: "Late-cycle signals (demo)", iconKey: "hospital" },
    ],
    liquidity: {
      daysOfRunway: 34,
      burnRateCurrent: 9100,
      burnRate6mAvg: 5200,
      showLiquidityCrunchWarning: true,
    },
    transactions: [
      { category: "Debt service", amount: 2100, daysAgo: 2, categoryAverage6m: 900, merchantHint: "AutoLoan ACH", isAnomaly: true },
      { category: "Groceries", amount: 890, daysAgo: 4, categoryAverage6m: 520, merchantHint: "Kampong Fresh Market", isAnomaly: true },
    ],
    callScriptBullets: [
      "Lead with care: “We’re reaching out early to see if cashflow has been tighter than usual.”",
      "Offer options vocabulary only: restructuring, term adjustment, consolidation — subject to bank policy.",
      "Schedule specialist follow-up; this UI does not execute products.",
    ],
    snapshotHighlights: [
      "Escalation path: soft restructure queue (concept only).",
      "Collections stage: not applicable in this synthetic record.",
      "Recommended next owner: RM primary (demo label).",
    ],
    decisionSupport: {
      reviewTier: "enhanced_due_diligence",
      reviewTierLabel: "Enhanced due diligence",
      reasonCodes: ["LIQ_STRESS", "BURN_Δ_6M", "CASHOUT_PATTERN"],
      underwritingBridge:
        "Cashflow stress pattern from behavior triggers enhanced review: same application might look borderline on static ratios, but spend velocity and runway collapse add early warning. Credit can request additional documentation or structure terms before deterioration — not an auto-decline from behavior alone.",
    },
    healthMomentum: [
      { monthLabel: "Nov", score: 69 },
      { monthLabel: "Dec", score: 66 },
      { monthLabel: "Jan", score: 61 },
      { monthLabel: "Feb", score: 55 },
      { monthLabel: "Mar", score: 49 },
      { monthLabel: "Apr", score: 42 },
    ],
    supportingIndicators: [
      "Burn rate rose >20% versus 6-month average.",
      "Debt-service and groceries both breached anomaly threshold.",
      "Days-of-runway dropped below 45 days.",
    ],
    actionPayload: {
      strategyLabel: "Initiate proactive restructure",
      whyNow: "Health momentum has declined for 5 straight months with escalating essential-spend pressure.",
    },
    productRecommendation: {
      confidenceBand: "high",
      basedOnSignals: { matched: 5, total: 5 },
      provenanceChips: ["statement-derived", "liquidity trend", "rule lineage"],
      options: [
        {
          product: "Proactive restructure assessment",
          fitRationale: "Runway compression and burn acceleration support early restructuring workflow.",
          tag: "recommended",
        },
        {
          product: "Term-adjustment pathway",
          fitRationale: "May reduce monthly pressure where customer remains serviceable.",
          tradeoff: "Can extend total cost horizon depending on terms.",
          tag: "alternative",
        },
        {
          product: "Consolidation consult",
          fitRationale: "Combines debt-service anomalies into one managed repayment conversation.",
          tradeoff: "Suitability depends on debt mix and policy checks.",
          tag: "alternative",
        },
      ],
    },
    wealthRecommendation: {
      eligible: false,
      ineligibleReason:
        "Stabilise cashflow and debt serviceability first — investment outreach is paused while liquidity stress and declining momentum are active.",
      options: [],
    },
    logicEvidence: {
      rules: [
        {
          code: "RULE_HIGH_STRESS_01",
          expression: "IF (RUNWAY_DAYS < 45) AND (BURN_DELTA_6M > 20%)",
          plainEnglish: "Short runway plus accelerated burn triggers high-stress intervention track.",
        },
        {
          code: "RULE_ESSENTIAL_PRESSURE_02",
          expression: "IF (ESSENTIAL_SPEND_RATIO > 80%) AND (DEBT_SERVICE_ANOMALY = TRUE)",
          plainEnglish: "Essential categories crowding spend with debt anomaly indicates tightening capacity.",
        },
      ],
      triggerTransactions: [
        { category: "Debt service", amount: 2100, daysAgo: 2, categoryAverage6m: 900, merchantHint: "AutoLoan ACH", isAnomaly: true },
        { category: "Groceries", amount: 890, daysAgo: 4, categoryAverage6m: 520, merchantHint: "Kampong Fresh Market", isAnomaly: true },
      ],
    },
  }),
  withPriority({
    id: "lead_003",
    pseudonymKey: "cust_demo_103",
    pulse: "watch",
    archetypeTag: "Global Traveler",
    merchantClusterId: "MC_TRAVEL_14",
    propensityScore: 0.58,
    loanBalance: 95000,
    oneLiner:
      "Travel-adjacent spend clusters ticked up — cross-sell angle for premium card or travel bundle (demo narrative).",
    timeline: [
      { daysAgo: 60, label: "Intl travel merchants", iconKey: "plane" },
      { daysAgo: 14, label: "Hotel + dining cluster", iconKey: "plane" },
    ],
    liquidity: {
      daysOfRunway: 86,
      burnRateCurrent: 6100,
      burnRate6mAvg: 5900,
      showLiquidityCrunchWarning: false,
    },
    transactions: [
      { category: "Travel", amount: 1800, daysAgo: 10, categoryAverage6m: 600, merchantHint: "FlyRoyal + StaySuite", isAnomaly: true },
    ],
    callScriptBullets: [
      "Anchor on lifestyle: “Your spend pattern suggests more time away from home lately.”",
      "Introduce bundle benefits at a high level; send factsheet for details.",
      "Confirm consent and channel preferences before any outreach.",
    ],
    snapshotHighlights: [
      "Travel cluster velocity: elevated vs. 6-mo baseline (illustrative).",
      "Cross-sell fit: premium card / travel insurance (high level).",
      "Consent & channel: confirm before campaign enrollment.",
    ],
    decisionSupport: {
      reviewTier: "standard",
      reviewTierLabel: "Standard origination path",
      reasonCodes: ["TRAV_CLUSTER_↑", "XSELL_CARD_FIT"],
      underwritingBridge:
        "Travel-heavy spend pattern supports unsecured or card-led offers with standard underwriting; behavior mainly informs **which product story** to lead with and **queue ordering** for RM-led origination, not a change to core approval thresholds.",
    },
    healthMomentum: [
      { monthLabel: "Nov", score: 62 },
      { monthLabel: "Dec", score: 63 },
      { monthLabel: "Jan", score: 64 },
      { monthLabel: "Feb", score: 65 },
      { monthLabel: "Mar", score: 67 },
      { monthLabel: "Apr", score: 69 },
    ],
    supportingIndicators: [
      "Travel-spend cluster increased while liquidity stayed stable.",
      "Repeat airline + hotel pattern within 14-day window.",
      "No liquidity crunch flag despite travel category anomaly.",
    ],
    actionPayload: {
      strategyLabel: "Offer travel-rewards bundle",
      whyNow: "Momentum trend is upward with a fresh travel-prep cluster inside the current campaign window.",
    },
    productRecommendation: {
      confidenceBand: "medium",
      basedOnSignals: { matched: 3, total: 5 },
      provenanceChips: ["spending trend", "behavior cluster", "campaign fit"],
      options: [
        {
          product: "Premium travel card + roaming pack",
          fitRationale: "Travel-prep cluster and stable runway align with rewards-led cross-sell timing.",
          tag: "recommended",
        },
        {
          product: "Travel insurance add-on path",
          fitRationale: "Complements repeated travel transactions with lower commitment entry point.",
          tradeoff: "Smaller revenue uplift than premium card path.",
          tag: "alternative",
        },
        {
          product: "Lifestyle rewards card",
          fitRationale: "Broader fit if customer declines travel-specific product.",
          tradeoff: "Less precise match to observed transaction rhythm.",
          tag: "alternative",
        },
      ],
    },
    wealthRecommendation: {
      eligible: true,
      confidenceBand: "low",
      basedOnSignals: { matched: 2, total: 5 },
      provenanceChips: ["stable runway", "assessment horizon"],
      options: [
        {
          fundName: "Short-term liquidity fund — USD sleeve",
          fundType: "Money market / liquidity",
          fitRationale:
            "After banking bundle fit is confirmed, surplus from travel-season cashflow may suit a low-volatility parking sleeve — secondary to card-led engagement.",
          tradeoff: "Not a substitute for rewards or insurance conversation in this window.",
          tag: "recommended",
        },
      ],
    },
    logicEvidence: {
      rules: [
        {
          code: "RULE_TRAVEL_PREP_01",
          expression: "IF (TRAVEL_14D > 2x AVG_6M) AND (RUNWAY_DAYS >= 60)",
          plainEnglish: "Recent travel spike with stable runway supports lifestyle-led cross-sell outreach.",
        },
      ],
      triggerTransactions: [
        { category: "Travel", amount: 1800, daysAgo: 10, categoryAverage6m: 600, merchantHint: "FlyRoyal + StaySuite", isAnomaly: true },
      ],
    },
  }),
];

/** Sorted by Propensity × Loan Balance (priorityScore), descending */
const leadsSorted = [...rawLeads].sort((a, b) => b.priorityScore - a.priorityScore);

const portfolio = {
  kpis: {
    customersInBook: 12450,
    customersWithModeledSignals: 9710,
    activeQueueDepth: 50,
    avgPropensityModeled: 0.54,
    liquidityStressApprox: 1240,
  },
  archetypes: [
    { archetype: "Rising Professional", count: 2810, pct: 23 },
    { archetype: "Steady Saver", count: 3360, pct: 27 },
    { archetype: "Global Traveler", count: 1870, pct: 15 },
    { archetype: "Silent Struggler", count: 1490, pct: 12 },
    { archetype: "Early Career", count: 2240, pct: 18 },
    { archetype: "Pre-retirement", count: 680, pct: 5 },
  ],
  pulses: [
    { pulse: "high_value_upsell" as const, count: 980, pct: 8 },
    { pulse: "imminent_risk" as const, count: 310, pct: 2 },
    { pulse: "watch" as const, count: 8420, pct: 68 },
    { pulse: "neutral" as const, count: 2740, pct: 22 },
  ],
  productThemes: [
    {
      id: "pt_01",
      theme: "Home & life-stage lending",
      primaryArchetype: "Rising Professional",
      bookSharePct: 19,
      productAngle: "Bundle home loan + protection with furniture/life-event cluster timing — good for campaign design.",
      sampleLeadId: "lead_001",
    },
    {
      id: "pt_02",
      theme: "Liquidity resilience",
      primaryArchetype: "Silent Struggler",
      bookSharePct: 11,
      productAngle: "Restructure-first playbook; pair with budgeting tools where the bank offers them.",
      sampleLeadId: "lead_002",
    },
    {
      id: "pt_03",
      theme: "Travel & rewards uplift",
      primaryArchetype: "Global Traveler",
      bookSharePct: 14,
      productAngle: "Premium card / travel insurance cross-sell; align fee structure to cluster spend rhythm.",
      sampleLeadId: "lead_003",
    },
    {
      id: "pt_04",
      theme: "Core deposit growth",
      primaryArchetype: "Steady Saver",
      bookSharePct: 24,
      productAngle: "Term deposit ladders and goal-based savings — low touch, high coverage.",
    },
    {
      id: "pt_05",
      theme: "Suitability-gated wealth",
      primaryArchetype: "Steady Saver",
      bookSharePct: 14,
      productAngle:
        "Secondary fund and regular-savings ideas when core banking is stable and assessment supports accumulate mode — not pitched during stress queues.",
      sampleLeadId: "lead_001",
    },
  ],
};

/** Canonical synthetic RM workspace dataset for /for-banks/demo */
export const fiDemoFixture: FiDemoFixture = {
  meta: {
    asOf: "2026-04-01",
    scenarioName: "RM morning queue — synthetic",
    disclaimerVersion: "2.6-wealth-lane",
  },
  portfolio,
  leads: leadsSorted,
};
