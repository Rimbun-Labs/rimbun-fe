import type {
  FiDecisionActivationPropensity,
  FiDecisionExplainDto,
  FiDecisionInsightsDto,
  FiDecisionProductFit,
  FiDecisionPropensityAndIntent,
  FiDecisionSpendLocation,
  FiDecisionSpendLocationHypothesis,
} from "./types/fiDecision";

/**
 * Normalize product fit: new `productFit` + `fitScore`, or legacy `productPropensity` + `score`.
 */
export function normalizeProductFit(p: FiDecisionPropensityAndIntent): FiDecisionProductFit[] {
  if (p.productFit?.length) return p.productFit;
  const legacy = p.productPropensity;
  if (legacy?.length) {
    return legacy.map((row) => ({
      productType: row.productType,
      fitScore: row.score,
      rationale: row.rationale,
    }));
  }
  return [];
}

/**
 * Activation propensity — new API only (no legacy equivalent).
 */
export function normalizeActivationPropensity(p: FiDecisionPropensityAndIntent): FiDecisionActivationPropensity[] {
  return p.activationPropensity ?? [];
}

/** Safe arrays for merchant / intent (always arrays). */
export function normalizeMerchantPropensity(p: FiDecisionPropensityAndIntent) {
  return p.merchantPropensity ?? [];
}

export function normalizeIntentSignals(p: FiDecisionPropensityAndIntent) {
  return p.intentSignals ?? [];
}

/** True when backend signals cross-sell should not be primary CTA. */
export function shouldDemoteCrossSell(data: FiDecisionInsightsDto): boolean {
  if (data.offerSuppression?.crossSellSuppressed) return true;
  const liq = data.risk.liquidityRisk.band === "high";
  const stress = data.risk.stressRisk.band === "high";
  return liq || stress;
}

/** Explain payload: `productFitDrivers`, or legacy `propensityDrivers` + score/fitScore. */
export function normalizeExplainProductFit(explain: FiDecisionExplainDto): FiDecisionProductFit[] {
  if (explain.productFitDrivers?.length) return explain.productFitDrivers;
  const legacy = explain.propensityDrivers;
  if (!legacy?.length) return [];
  return legacy.map((row) => ({
    productType: row.productType,
    fitScore: row.fitScore ?? row.score ?? 0,
    rationale: row.rationale,
  }));
}

export function normalizeExplainActivation(explain: FiDecisionExplainDto): FiDecisionActivationPropensity[] {
  return explain.activationPropensityDrivers ?? [];
}

/** Primary RM-facing row: rank 1 + primary anchor, else rank 1, else first hypothesis. */
export function pickPrimarySpendLocationHypothesis(
  spendLocation?: FiDecisionSpendLocation | null
): FiDecisionSpendLocationHypothesis | undefined {
  const list = spendLocation?.hypotheses;
  if (!list?.length) return undefined;
  const rankedPrimary = list.find((h) => h.rank === 1 && h.anchorRole === "primary");
  if (rankedPrimary) return rankedPrimary;
  const rank1 = list.find((h) => h.rank === 1);
  return rank1 ?? list[0];
}
