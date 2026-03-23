import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getLatestAssessmentResults } from '@/lib/api/assessmentApi';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useInsuranceCompare } from '@/hooks/useInsuranceProducts';
import type { InsuranceProductDetailDto } from '@/lib/api/types/insuranceProducts';
import {
  INSURANCE_DISPLAY_CURRENCY,
  PRODUCT_CATEGORY_EXPLANATIONS,
  PRODUCT_SUBCATEGORY_EXPLANATIONS,
} from '@/lib/constants/insuranceEducation';
import { getInsuranceProductDisplayName, formatInsuranceCategoryWithSub } from '@/lib/utils/insuranceDisplay';
import { LabelWithBridgeTooltip } from './LabelWithBridgeTooltip';
import { ProductMatchCard } from './ProductMatchCard';
import { Scale, ShoppingBag, X, Info } from 'lucide-react';

function formatPremium(product: InsuranceProductDetailDto): string {
  const v = product.estimatedMonthlyPremiumProxy;
  if (v == null) return '—';
  const code = product.currency ?? INSURANCE_DISPLAY_CURRENCY;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: code, maximumFractionDigits: 0 }).format(v) + '/mo';
}

function getAgeRange(product: InsuranceProductDetailDto): string {
  const el = product.eligibility;
  if (!el || (el.minAge == null && el.maxAge == null)) return '—';
  const min = el.minAge ?? '—';
  const max = el.maxAge ?? '—';
  return `${min}–${max}`;
}

function getCategoryWithTooltip(p: InsuranceProductDetailDto): React.ReactNode {
  const cat = p.productCategory;
  const sub = p.productSubcategory;
  const catExplain = PRODUCT_CATEGORY_EXPLANATIONS[cat] ?? PRODUCT_CATEGORY_EXPLANATIONS[cat?.replace(/_/g, ' ') ?? ''];
  const subExplain = sub ? (PRODUCT_SUBCATEGORY_EXPLANATIONS[sub] ?? PRODUCT_SUBCATEGORY_EXPLANATIONS[sub.replace(/_/g, ' ')]) : null;
  const explanation = [catExplain, subExplain].filter(Boolean).join(' ') || null;
  const label = formatInsuranceCategoryWithSub(cat, sub ?? null);
  if (!label) return '—';
  if (!explanation) return label;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1 cursor-help">
            {label}
            <Info className="h-3 w-3 shrink-0" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{explanation}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/** Persona for Product Match: finance persona with fallback to investor profile. */
function getFinancePersonaLabel(assessment: { scoreData?: { financePersona?: string; profile?: string } } | null): string {
  const sd = assessment?.scoreData;
  return sd?.financePersona ?? sd?.profile ?? 'Balanced builder';
}

interface InsuranceCompareTabProps {
  productIds: string[];
  onRemove: (productId: string) => void;
  onClear: () => void;
  onSwitchToAllProducts: () => void;
}

/** Row definition: label + optional bridge key for (i) tooltip + get display value from product */
const COMPARE_ROWS: Array<{
  key: string;
  label: string;
  bridgeKey?: string;
  getValue: (p: InsuranceProductDetailDto) => React.ReactNode;
}> = [
  { key: 'productName', label: 'Product', getValue: (p) => getInsuranceProductDisplayName(p) },
  { key: 'insurerName', label: 'Insurer', getValue: (p) => (p.insurerName?.trim() || '—') },
  { key: 'productCategory', label: 'Category', getValue: getCategoryWithTooltip },
  { key: 'primaryIntent', label: 'Primary intent', getValue: (p) => p.primaryIntent ?? '—' },
  { key: 'premium', label: 'From (per month, indicative)', bridgeKey: 'premium', getValue: (p) => formatPremium(p) },
  { key: 'isTakaful', label: 'Shariah-compliant', bridgeKey: 'takaful', getValue: (p) => (p.isTakaful ? 'Yes' : 'No') },
  { key: 'ageRange', label: 'Age range', getValue: getAgeRange },
  { key: 'maxCoverageAge', label: 'Max coverage age', getValue: (p) => p.eligibility?.maxCoverageAge != null ? `${p.eligibility.maxCoverageAge} yrs` : '—' },
  { key: 'payorBenefit', label: 'Payor benefit', bridgeKey: 'payorBenefit', getValue: (p) => p.hedgeCompatibility?.hasPayorBenefit != null ? (p.hedgeCompatibility.hasPayorBenefit ? 'Yes' : 'No') : '—' },
  { key: 'waiverOfPremium', label: 'Waiver of premium', bridgeKey: 'waiverOfPremium', getValue: (p) => p.hedgeCompatibility?.hasWaiverOfPremium != null ? (p.hedgeCompatibility.hasWaiverOfPremium ? 'Yes' : 'No') : '—' },
  { key: 'goalCompleter', label: 'Goal completer', bridgeKey: 'goalCompleter', getValue: (p) => p.hedgeCompatibility?.isGoalCompleter != null ? (p.hedgeCompatibility.isGoalCompleter ? 'Yes' : 'No') : '—' },
  { key: 'payoutStructure', label: 'Payout structure', getValue: (p) => p.payoutStructure ?? '—' },
  { key: 'acceptanceFriction', label: 'Acceptance', bridgeKey: 'acceptanceFriction', getValue: (p) => p.acceptanceFriction ?? '—' },
  { key: 'affordabilityEfficiency', label: 'Affordability efficiency', getValue: (p) => p.affordabilityEfficiency != null ? String(p.affordabilityEfficiency) : '—' },
  { key: 'frontEndLoaded', label: 'Upfront / bid-offer spread', bridgeKey: 'frontEndLoaded', getValue: (p) => p.feeStructure?.isFrontEndLoaded != null ? (p.feeStructure.isFrontEndLoaded ? 'Yes' : 'No') : '—' },
  { key: 'allocationPct', label: 'Allocation % (to investment)', bridgeKey: 'allocationSchedule', getValue: (p) => (p.feeStructure?.allocationSchedule?.[0]?.allocationPct != null ? `${p.feeStructure.allocationSchedule[0].allocationPct}%` : '—') },
  { key: 'managementFeePct', label: 'Management fee % p.a.', getValue: (p) => (p.feeStructure?.recurringFees?.managementFeePct != null ? `${p.feeStructure.recurringFees.managementFeePct}%` : '—') },
  { key: 'surrenderPenalty', label: 'Surrender penalty', bridgeKey: 'surrenderPenalty', getValue: (p) => p.feeStructure?.exitCosts?.hasSurrenderPenalty != null ? (p.feeStructure.exitCosts.hasSurrenderPenalty ? 'Yes' : 'No') : '—' },
];

export const InsuranceCompareTab: React.FC<InsuranceCompareTabProps> = ({
  productIds,
  onRemove,
  onClear,
  onSwitchToAllProducts,
}) => {
  const { data, isLoading, error } = useInsuranceCompare(productIds);
  const { data: latestAssessment } = useQuery({
    queryKey: ['assessment-results', 'latest'],
    queryFn: getLatestAssessmentResults,
    staleTime: 5 * 60 * 1000,
  });
  const count = productIds.length;

  if (count === 0 || count === 1) {
    return (
      <Card className="border-dashed">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-muted-foreground" />
            Compare products
          </CardTitle>
          <CardDescription>
            Select 2–4 products from All products to compare them side by side.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Button onClick={onSwitchToAllProducts}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Browse products
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (count > 4) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-4 pt-6">
          <p className="text-sm text-muted-foreground mb-2">
            You can compare at most 4 products. Remove some to continue.
          </p>
          <Button variant="outline" size="sm" onClick={onClear}>
            Clear selection
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="p-4 pt-6">
          <p className="text-sm text-destructive">Failed to load comparison.</p>
          <Button variant="outline" size="sm" onClick={onClear} className="mt-2">
            Clear and try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !data) {
    return (
      <Card>
        <CardContent className="p-4 pt-6">
          <p className="text-sm text-muted-foreground">Loading comparison…</p>
        </CardContent>
      </Card>
    );
  }

  const products = data.products ?? [];

  // Suitability case study: recommend product with lower fees (or first), alternative = next; demo persona/goal for pitch
  const recommendedIndex = products.length > 0
    ? products.reduce((best, p, i) => {
        const bestCharges = products[best].feeStructure?.recurringFees?.managementFeePct ?? 1e9;
        const currCharges = p.feeStructure?.recurringFees?.managementFeePct ?? 1e9;
        return currCharges < bestCharges ? i : best;
      }, 0)
    : 0;
  const recommended = products[recommendedIndex];
  const alternative = products.length >= 2 ? products[recommendedIndex === 0 ? 1 : 0] : undefined;
  const currencyCode = recommended?.currency ?? INSURANCE_DISPLAY_CURRENCY;
  // Demo savings for suitability case study (pitch deck); backend could later provide real TCO delta
  const savingsAmount = 400;

  return (
    <div className="space-y-4">
      {/* Suitability Case Study: Product Match (for pitch deck / investor demo) */}
      {products.length >= 2 && recommended && (
        <ProductMatchCard
          personaName={getFinancePersonaLabel(latestAssessment)}
          goalHorizon="5-year goal"
          recommendedProductName={getInsuranceProductDisplayName(recommended)}
          alternativeProductName={alternative ? getInsuranceProductDisplayName(alternative) : undefined}
          savingsAmount={savingsAmount}
          currency={currencyCode}
          savingsReason="in hidden fees"
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Comparing {products.length} products</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onSwitchToAllProducts}>
            Add another
          </Button>
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear all
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium w-40">Attribute</th>
              {products.map((p) => (
                <th key={p.productId} className="text-left p-3 font-medium max-w-[200px]">
                  <div className="flex items-start justify-between gap-2">
                    <span className="truncate">{getInsuranceProductDisplayName(p)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => onRemove(p.productId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map(({ key, label, bridgeKey, getValue }) => (
              <tr key={key} className="border-b last:border-0">
                <td className="p-3 text-muted-foreground font-medium">
                  <LabelWithBridgeTooltip label={label} bridgeKey={bridgeKey} />
                </td>
                {products.map((p) => (
                  <td key={p.productId} className="p-3 max-w-[200px]">
                    {getValue(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-2">
        {products.map((p) => (
          <Button key={p.productId} variant="outline" size="sm" asChild>
            <a
              href={p.productPageUrl ?? p.brochureUrl ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              View {getInsuranceProductDisplayName(p)}
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
};
