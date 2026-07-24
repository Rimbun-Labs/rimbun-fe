/**
 * Short hover explanations for the public client workspace preview.
 */

import type { FiDemoBookPulse, FiDemoPulse } from "@/fixtures/fi-demo/types";

export const fiDemoHelp = {
  pulseImminentRisk:
    "Imminent risk: modeled signals suggest tightening cashflow or early distress. Queue for proactive outreach before conditions worsen. Stronger urgency than Watch.",
  pulseHighValueUpsell:
    "High-value upsell: modeled fit for a structured revenue or relationship expansion conversation. Priority for origination-style outreach.",
  pulseWatch:
    "Watch: spend or behavior is elevated or interesting — worth monitoring or a light-touch / cross-sell angle. Lower urgency than Imminent risk.",
  pulseBookNeutral:
    "No active queue pulse: customers not currently tagged with upsell, risk, or watch for priority-queue purposes — typical run-the-book majority.",

  kpiCustomersInBook:
    "Count of relationships attributed to this book in the preview.",
  kpiWithModeledSignals:
    "Customers with enough history for clustering or scoring. Smaller than “in book” because not everyone has usable signals.",
  kpiQueueDepth:
    "How many customers sit in the modeled priority queue in this scenario — broader than the sample leads on screen.",
  kpiAvgPropensity:
    "Book-wide average of modeled propensity (0–1) for next-best-action fit.",
  kpiLiquidityStress:
    "Approximate count of customers with a liquidity stress pattern in the narrative (for example burn vs baseline).",

  sectionArchetypeMix:
    "Segment labels (for example life stage + spend style) for campaigns and talk tracks. Percent = share of this book.",
  sectionPriorityPulseBook:
    "Where the modeled queue is focusing: upsell opportunity, early risk, watch, or no active pulse. Book-level mix — not the same as one customer’s pulse badge.",
  sectionProductHints:
    "Themes for proposition design — which archetypes and angles to bundle. Open jumps to a sample lead that illustrates the story.",

  todaysOutreach:
    "Ranked triage list for this preview. Priority uses propensity × balance. Select a row to load detail on the right.",
  engagementContext:
    "Detail column for the selected customer: working strip, decision support, liquidity, timeline, and category table.",
  engagementAndLeadWorkspace:
    "Lead workspace tab: triage list plus this detail column for one selected customer — working strip, decision support, liquidity, timeline, and category activity.",
  workingOn:
    "Who you are focused on for this session — name, archetype, pulse, and suggested next step.",

  decisionSupportTitle:
    "How behavior might change review priority or file ordering in this preview.",
  reviewTier:
    "Hint for where the file lands in process (standard vs more diligence vs priority review). Routing and attention.",
  reasonCodes:
    "Short tags for why behavior mattered for routing in this preview.",

  nextTenMinutes:
    "Suggested actions for the conversation in this preview.",
  healthMomentum:
    "0–100 behavioral momentum index: summarizes how supportive cashflow and spend-behavior patterns look over about six months as a trajectory. Bar height = index that month; bar color = month-over-month change. Net trend rising, falling, or flat guides expansion vs help conversations alongside pulse, liquidity, and archetype.",
  liquidityMeter:
    "Runway and burn vs 6-month average — used to trigger a liquidity conversation in this preview.",
  behaviorTimeline:
    "Themed markers over time for talk tracks — spend clusters in this preview.",
  recentCategoryActivity:
    "Recent debits by category vs a 6-month average for that category. Anomaly when amount is more than twice the category average.",

  tableCategory: "Merchant category bucket used for comparison (for example Furniture, Travel).",
  tableAmount: "Transaction amount in this preview.",
  tableAvg6m:
    "Typical spend in this category over six months — baseline for the anomaly flag.",
  tableDaysAgo: "How long ago this transaction appeared in the feed.",
  tableAnomaly:
    "Flagged when amount exceeds twice the category’s 6-month average.",
  tableMerchantHint:
    "Merchant string used in logic trace to show which transaction cluster triggered the signal.",

  dtPropensity:
    "0–1 score for strength of the modeled next-action story (for example upsell vs restructure). Higher means stronger narrative fit.",
  dtFacilityBalance:
    "Rough exposure used to size importance of the conversation in this preview.",
  dtPriorityScore:
    "Propensity × loan balance so larger relationships rank higher in the triage list — queue ordering.",
  dtMerchantCluster:
    "ID grouping similar merchants or spend themes — features for models; not a merchant name.",
  dtLiquidityDemo:
    "Runway and burn snapshot — supports the liquidity meter and stress flag in this preview.",
  supportingIndicators:
    "Cues describing why this archetype or intent is inferred from transaction behavior.",
  actionPayload:
    "Recommendation that translates pattern detection into the next best strategy.",
  productRecommendation:
    "Banking product fit (primary lane): cards, loans, deposits, and servicing options with alternatives, confidence band, and provenance chips.",
  wealthRecommendation:
    "Investment suitability (secondary lane): named fund or plan ideas when relationship readiness allows — after core banking fit.",
  wealthIneligible:
    "Wealth outreach is paused while stabilisation signals are active.",
  recommendationConfidence:
    "How strongly available signals support the proposed product-fit story in this preview (high/medium/low).",
  recommendationSignals:
    "Count of matched indicators out of indicators evaluated in this recommendation routine.",
  recommendationProvenance:
    "Data-source hints for the recommendation narrative (for example statement-derived, trend, cluster).",
  logicEvidence:
    "Transparency drawer with rule lineage and trigger transactions. Shows the path from signal to action.",

  archetypeBadge:
    "Segment label summarizing stable patterns (life stage + spend). Useful for campaigns.",

  bookShare:
    "Estimated share of this book aligned with the theme — for proposition planning.",
  jumpToLead:
    "Opens a sample customer row that illustrates this theme, if one exists.",

  portfolioOverviewTab: "Aggregated book: KPIs, segment mix, pulse mix, and product themes.",

  callScript: "Three scripted bullets to open the conversation.",
  customerSnapshot:
    "Side panel for the selected lead — same data as the main column, consolidated for review.",

  privacyMode:
    "Blurs identifiers and sensitive numbers while keeping behavioral labels visible.",
} as const;

export function fiDemoPulseHelpText(pulse: FiDemoPulse): string {
  switch (pulse) {
    case "imminent_risk":
      return fiDemoHelp.pulseImminentRisk;
    case "high_value_upsell":
      return fiDemoHelp.pulseHighValueUpsell;
    case "watch":
    default:
      return fiDemoHelp.pulseWatch;
  }
}

export function fiDemoBookPulseHelpText(pulse: FiDemoBookPulse): string {
  if (pulse === "neutral") return fiDemoHelp.pulseBookNeutral;
  return fiDemoPulseHelpText(pulse);
}
