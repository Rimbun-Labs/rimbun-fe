import type {
  BusinessClaimType,
  BusinessEvidenceQuality,
  BusinessOverviewCashSummary,
} from "@/lib/api/businessApi";

export function claimTypeLabel(
  claimType: BusinessClaimType | string | null | undefined,
  evidenceQuality?: BusinessEvidenceQuality | string | null,
): string {
  if (evidenceQuality === "insufficient") return "Insufficient evidence";
  switch (claimType) {
    case "observed":
      return "Verified finding";
    case "calculated":
      return "Calculated risk";
    case "conditional":
      return "If this happens";
    case "benchmark_based":
      return "Estimated opportunity";
    default:
      return "Recommendation";
  }
}

export function cashSummaryValues(summary: BusinessOverviewCashSummary | undefined) {
  if (!summary) {
    return {
      baselineFundingNeedIdr: 0,
      conditionalFundingReductionIdr: 0,
      residualFundingNeedIfActionsSucceedIdr: 0,
      verifiedMissingCashIdr: 0,
      estimatedCostOpportunityIdr: 0,
      residualFundingDate: null as string | null,
      cashBufferTargetIdr: null as number | null,
      openActionCount: 0,
    };
  }
  const conditional = Number(
    summary.conditionalFundingReductionIdr ??
      summary.addressableCashPressureIdr ??
      0,
  );
  const residual = Number(
    summary.residualFundingNeedIfActionsSucceedIdr ??
      summary.residualFundingNeedIdr ??
      0,
  );
  return {
    baselineFundingNeedIdr: Number(
      summary.baselineFundingNeedIdr ?? residual + conditional,
    ),
    conditionalFundingReductionIdr: conditional,
    residualFundingNeedIfActionsSucceedIdr: residual,
    verifiedMissingCashIdr: Number(summary.verifiedMissingCashIdr ?? 0),
    estimatedCostOpportunityIdr: Number(
      summary.estimatedCostOpportunityIdr ?? summary.costSavingsIdr ?? 0,
    ),
    residualFundingDate: summary.residualFundingDate,
    cashBufferTargetIdr: summary.cashBufferTargetIdr ?? null,
    openActionCount: summary.openActionCount,
  };
}

/** Compact money for funding copy (e.g. IDR 18m). */
export function formatFundingAmount(
  value: number | null | undefined,
  currency: string,
): string {
  if (value == null || Number.isNaN(value)) return "—";
  if (currency === "IDR" && Math.abs(value) >= 1_000_000) {
    const millions = value / 1_000_000;
    const rounded =
      Math.abs(millions) >= 10
        ? Math.round(millions)
        : Math.round(millions * 10) / 10;
    return `IDR ${rounded}m`;
  }
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function residualFundingCopy(
  residual: number,
  currency: string,
  daysBelowBuffer?: number | null,
): string | null {
  if (residual <= 0) return null;
  const amount = formatFundingAmount(residual, currency);
  if (daysBelowBuffer != null && daysBelowBuffer > 0) {
    return `After the modelled actions, an estimated ${amount} remains uncovered for approximately ${daysBelowBuffer} days.`;
  }
  return `After the modelled actions, an estimated ${amount} remains uncovered.`;
}
