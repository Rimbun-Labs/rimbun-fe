/**
 * Short hover explanations for the public FI RM demo — aligned with fixture copy, not production policy.
 */

import type { FiDemoBookPulse, FiDemoPulse } from "@/fixtures/fi-demo/types";

export const fiDemoHelp = {
  pulseImminentRisk:
    "Imminent risk: modeled signals suggest tightening cashflow or early distress. Queue for proactive outreach (e.g. restructuring) before conditions worsen. Stronger urgency than Watch — not a prediction of default.",
  pulseHighValueUpsell:
    "High-value upsell: modeled fit for a structured revenue or relationship expansion conversation (e.g. life-stage lending). Priority for origination-style outreach — not a guarantee of take-up.",
  pulseWatch:
    "Watch: spend or behavior is elevated or interesting — worth monitoring or a light-touch / cross-sell angle. Lower urgency than Imminent risk; not an emergency flag.",
  pulseBookNeutral:
    "No active queue pulse: customers not currently tagged with upsell, risk, or watch for priority-queue purposes — typical “run the book” majority.",

  kpiCustomersInBook:
    "Synthetic count of relationships attributed to this RM in the demo. Not a live core-banking total.",
  kpiWithModeledSignals:
    "Customers with enough history in the story for clustering or scoring. Smaller than “in book” because not everyone has usable signals.",
  kpiQueueDepth:
    "How many customers sit in the modeled priority queue (outreach / review ordering) in this scenario — broader than the sample leads on screen.",
  kpiAvgPropensity:
    "Book-wide average of modeled propensity (0–1) for “next best action” fit. Fixture number for the synthetic book — not recalculated from the three sample leads.",
  kpiLiquidityStress:
    "Approximate count of customers with a liquidity stress pattern in the narrative (e.g. burn vs. baseline). Illustrative, not a regulatory metric.",

  sectionArchetypeMix:
    "Segment labels (e.g. life stage + spend style) for campaigns and talk tracks. Percent = share of this synthetic book; counts are illustrative.",
  sectionPriorityPulseBook:
    "Where the modeled queue is focusing: upsell opportunity, early risk, watch, or no active pulse. Book-level mix — not the same as one customer’s pulse badge.",
  sectionProductHints:
    "Themes for proposition design — which archetypes and angles to bundle. Open jumps to a sample lead that illustrates the story.",

  todaysOutreach:
    "Ranked triage list for this demo. Priority uses propensity × balance in fixtures. Select a row to load detail on the right.",
  engagementContext:
    "Detail column for the selected customer: working strip, decision support, liquidity, timeline, and category table.",
  /** Lead workspace tab — combined with engagement for one tooltip on the column header */
  engagementAndLeadWorkspace:
    "Lead workspace tab: triage list plus this detail column for one selected customer — working strip, decision support, liquidity, timeline, and category activity (fixtures only).",
  workingOn:
    "Who you are focused on for this demo session — pseudonym, archetype, pulse, and suggested next step.",

  decisionSupportTitle:
    "Synthetic routing narrative: how behavior might change review priority or file ordering. Not credit approval — production merges bureau, application, and policy.",
  reviewTier:
    "Hint for where the file lands in process (standard vs. more diligence vs. priority review). Routing and attention, not an approve/deny outcome.",
  reasonCodes:
    "Short tags for audit-friendly storytelling — why behavior mattered for routing in this demo. Illustrative codes, not bureau reason codes.",

  nextTenMinutes:
    "Placeholder RM actions for the conversation — buttons do not call core banking in this mock.",
  healthMomentum:
    "Synthetic 0–100 behavioral momentum index (demo): summarizes how supportive cashflow and spend-behavior patterns look over ~six months as a trajectory — not a credit score, bureau outcome, or medical meaning. Bar height = index that month (higher ≈ more supportive/opportunity-rich patterns in the story; lower ≈ more pressured/less supportive). Bar color = month-over-month change (green up, amber down, gray flat); first month is the window baseline. Net trend: rising = momentum strengthening (often expansion/cross-sell when other signals agree); falling = momentum weakening (often earlier help/restructure when other signals agree — not automatic distress); flat = no strong drift — use pulse, liquidity, and archetype next. Demo illustration only.",
  liquidityMeter:
    "Illustrative runway and burn vs. 6-month average — demo math to trigger a liquidity conversation, not a certified forecast.",
  behaviorTimeline:
    "Themed markers over time for talk tracks — illustrative spend clusters, not verified life events.",
  recentCategoryActivity:
    "Recent debits by category vs. a 6-month average for that category. Anomaly uses the demo rule: amount more than twice the category average.",

  tableCategory: "Merchant category bucket used for comparison (e.g. Furniture, Travel).",
  tableAmount: "Transaction amount in the demo fixture.",
  tableAvg6m:
    "Illustrative typical spend in this category over six months — baseline for the anomaly flag.",
  tableDaysAgo: "How long ago this transaction appeared in the synthetic feed.",
  tableAnomaly:
    "Flagged when amount exceeds twice the category’s 6-month average — simple demo rule.",
  tableMerchantHint:
    "Illustrative merchant string used in logic trace to show which transaction cluster triggered the signal.",

  dtPropensity:
    "0–1 score for strength of the modeled next-action story (e.g. upsell vs. restructure). Higher means stronger narrative fit, not a guaranteed sale.",
  dtFacilityBalance:
    "Rough exposure used to size importance of the conversation in the demo.",
  dtPriorityScore:
    "Propensity × loan balance so larger relationships rank higher in the triage list — queue ordering, not credit quality.",
  dtMerchantCluster:
    "Opaque ID grouping similar merchants or spend themes — features for models; not a merchant name.",
  dtLiquidityDemo:
    "Runway and burn snapshot from fixtures — supports the liquidity meter and stress flag in the demo.",
  supportingIndicators:
    "Deterministic-style cues describing why this archetype or intent is inferred from transaction behavior.",
  actionPayload:
    "Decision-support recommendation that translates pattern detection into the RM's next best strategy.",
  productRecommendation:
    "Behavior-to-product fit panel for this selected lead: primary recommendation, alternatives with trade-offs, confidence band, and provenance chips.",
  recommendationConfidence:
    "How strongly available signals support the proposed product-fit story in this demo (high/medium/low), not an approval probability.",
  recommendationSignals:
    "Count of matched indicators out of indicators evaluated in this recommendation routine.",
  recommendationProvenance:
    "Data-source hints for the recommendation narrative (e.g., statement-derived, trend, cluster).",
  logicEvidence:
    "Transparency drawer with rule lineage and trigger transactions. Shows auditable path from signal to action.",

  archetypeBadge:
    "Segment label summarizing stable patterns (life stage + spend). Useful for campaigns; not a value judgment.",

  bookShare:
    "Estimated share of this synthetic book aligned with the theme — for proposition planning, not pricing.",
  jumpToLead:
    "Opens a sample customer row that illustrates this theme, if one exists in the fixture.",

  portfolioOverviewTab: "Aggregated synthetic book: KPIs, segment mix, pulse mix, and product themes.",

  callScript: "Three scripted bullets to open the conversation — synthetic copy only.",
  customerSnapshot:
    "Side panel dossier for the selected lead — same fixtures as the main column, consolidated for storytelling.",

  privacyMode:
    "Blurs identifiers and sensitive numbers while keeping behavioral labels visible for demo flow.",
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
