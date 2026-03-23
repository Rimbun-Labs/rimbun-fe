import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useInsuranceProduct } from '@/hooks/useInsuranceProducts';
import { getLatestAssessmentResults } from '@/lib/api/assessmentApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ArrowLeft, ExternalLink, Shield, UserCheck, AlertTriangle, TrendingUp, Tag, Info, DollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  getMonthlyPaymentLabel,
  INSURANCE_DISPLAY_CURRENCY,
  PRODUCT_CATEGORY_EXPLANATIONS,
  PRODUCT_SUBCATEGORY_EXPLANATIONS,
  INSURANCE_TERMS,
  VALUE_INDICATOR_EXPLANATIONS,
} from '@/lib/constants/insuranceEducation';
import { getInsuranceProductDisplayName, formatInsuranceCategoryWithSub } from '@/lib/utils/insuranceDisplay';
import { LabelWithBridgeTooltip } from '@/components/insurance/LabelWithBridgeTooltip';
import { ResilienceSimulatorCard } from '@/components/insurance/ResilienceSimulatorCard';
import { ProductMatchCard } from '@/components/insurance/ProductMatchCard';
import { cn } from '@/lib/utils';

function formatCurrency(amount: number, currencyCode?: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode ?? INSURANCE_DISPLAY_CURRENCY,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Persona for Product Match: finance persona (insurance/banking) with fallback to investor profile. */
function getFinancePersonaLabel(assessment: { scoreData?: { financePersona?: string; profile?: string } } | null): string {
  const sd = assessment?.scoreData;
  return sd?.financePersona ?? sd?.profile ?? 'Balanced builder';
}

const InsuranceProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useInsuranceProduct(productId);
  const { data: latestAssessment } = useQuery({
    queryKey: ['assessment-results', 'latest'],
    queryFn: getLatestAssessmentResults,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="space-y-6 p-4 md:p-8">
        <Alert variant="destructive">
          <AlertTitle>Product not found</AlertTitle>
          <AlertDescription>
            We couldn&apos;t load that product. It may have been removed or the link is incorrect.
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => navigate('/insurance')}>
          Back to Insurance
        </Button>
      </div>
    );
  }

  const brochureUrl = product.productPageUrl ?? product.brochureUrl;
  const currencyCode = product.currency ?? INSURANCE_DISPLAY_CURRENCY;
  const premium = product.estimatedMonthlyPremiumProxy;
  const el = product.eligibility;
  const hedge = product.hedgeCompatibility;
  const fees = product.feeStructure;

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/insurance')} asChild>
          <Link to="/insurance">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Insurance
          </Link>
        </Button>
      </div>

      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                {getInsuranceProductDisplayName(product)}
              </CardTitle>
              <CardDescription className="mt-1 flex items-center gap-1">
                {(() => {
                  const cat = product.productCategory;
                  const sub = product.productSubcategory;
                  const catExplain = PRODUCT_CATEGORY_EXPLANATIONS[cat] ?? PRODUCT_CATEGORY_EXPLANATIONS[cat?.replace(/_/g, ' ') ?? ''];
                  const subExplain = sub ? (PRODUCT_SUBCATEGORY_EXPLANATIONS[sub] ?? PRODUCT_SUBCATEGORY_EXPLANATIONS[sub.replace(/_/g, ' ')]) : null;
                  const explanation = [catExplain, subExplain].filter(Boolean).join(' ') || null;
                  const label = formatInsuranceCategoryWithSub(cat, sub ?? null);
                  if (!label) return null;
                  if (!explanation) return <span>{label}</span>;
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
                })()}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.isTakaful && (
                <Badge variant="secondary">Shariah-compliant</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {product.primaryIntent && (
            <div>
              <p className="text-xs uppercase text-muted-foreground">Primary intent</p>
              <p className="font-medium">{product.primaryIntent}</p>
            </div>
          )}
          {premium != null && (() => {
            const { term, indicativeLabel } = getMonthlyPaymentLabel(product.isTakaful === true);
            return (
              <div>
                <p className="text-xs uppercase text-muted-foreground">Indicative {term.toLowerCase()}</p>
                <p className="text-lg font-semibold">
                  From {formatCurrency(premium, currencyCode)}/mo
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{indicativeLabel}</p>
              </div>
            );
          })()}
          {product.nudgeCopy && (
            <p className="text-sm text-muted-foreground">{product.nudgeCopy}</p>
          )}
          {brochureUrl && (
            <Button asChild>
              <a href={brochureUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                View product / brochure
              </a>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Eligibility (first: can I get it?) */}
      {el && (el.minAge != null || el.maxAge != null || el.maxCoverageAge != null || el.occupationalClasses?.length || el.residencyReq) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-muted-foreground" />
              Eligibility
            </CardTitle>
            <CardDescription>Who can apply for this product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {(el.minAge != null || el.maxAge != null) && (
              <p><span className="text-muted-foreground">Age range:</span> {el.minAge != null ? el.minAge : '—'}–{el.maxAge != null ? el.maxAge : '—'} years</p>
            )}
            {el.maxCoverageAge != null && (
              <p><span className="text-muted-foreground">Max coverage age:</span> {el.maxCoverageAge} years</p>
            )}
            {el.occupationalClasses?.length ? (
              <p><span className="text-muted-foreground">Occupational classes:</span> {el.occupationalClasses.join(', ')}</p>
            ) : null}
            {el.residencyReq && (
              <p><span className="text-muted-foreground">Residency:</span> {el.residencyReq}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Coverage features (hedge compatibility) */}
      {hedge && (hedge.hasPayorBenefit != null || hedge.hasWaiverOfPremium != null || hedge.isGoalCompleter != null) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              Coverage features
            </CardTitle>
            <CardDescription>Key product features for goal protection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {hedge.hasPayorBenefit != null && (
              <p>
                <span className="text-muted-foreground">
                  <LabelWithBridgeTooltip label="Payor benefit:" bridgeKey="payorBenefit" />
                </span>{' '}
                {hedge.hasPayorBenefit ? 'Yes' : 'No'}
              </p>
            )}
            {hedge.hasWaiverOfPremium != null && (
              <p>
                <span className="text-muted-foreground">
                  <LabelWithBridgeTooltip label="Waiver of premium:" bridgeKey="waiverOfPremium" />
                </span>{' '}
                {hedge.hasWaiverOfPremium ? 'Yes' : 'No'}
              </p>
            )}
            {hedge.isGoalCompleter != null && (
              <p>
                <span className="text-muted-foreground">
                  <LabelWithBridgeTooltip label="Goal completer:" bridgeKey="goalCompleter" />
                </span>{' '}
                {hedge.isGoalCompleter ? 'Yes' : 'No'}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Resilience simulator + Suitability case study (Product Match) */}
      <div className="grid gap-4 lg:grid-cols-[1fr,minmax(320px,400px)]">
        <ResilienceSimulatorCard productId={product.productId} product={product} />
        <div className="flex flex-col gap-4">
          <ProductMatchCard
            personaName={getFinancePersonaLabel(latestAssessment)}
            goalHorizon="5-year goal"
            recommendedProductName={getInsuranceProductDisplayName(product)}
            alternativeProductName="similar endowment plans"
            savingsAmount={400}
            currency={currencyCode}
            savingsReason="in hidden fees"
            compact
          />
        </div>
      </div>

      {/* Fees & costs */}
      {fees && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Fees & costs
            </CardTitle>
            <CardDescription>Charges and fees that affect total cost (from product data)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {fees.isFrontEndLoaded != null && (
              <p>
                <span className="text-muted-foreground">
                  <LabelWithBridgeTooltip label="Upfront / bid-offer spread:" bridgeKey="frontEndLoaded" />
                </span>{' '}
                {fees.isFrontEndLoaded ? 'Yes' : 'No'}
              </p>
            )}
            {fees.allocationSchedule?.length ? (
              <div>
                <p className="text-muted-foreground font-medium mb-1">
                  <LabelWithBridgeTooltip label="Allocation schedule" bridgeKey="allocationSchedule" />
                </p>
                <ul className="space-y-1">
                  {fees.allocationSchedule.map((entry, i) => (
                    <li key={i}>
                      {entry.years != null && (
                        <span className="text-muted-foreground">
                          {Array.isArray(entry.years) ? entry.years.join('–') : entry.years} yrs:{' '}
                        </span>
                      )}
                      {entry.allocationPct != null && `${entry.allocationPct}% to investment`}
                      {entry.note && ` (${entry.note})`}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {fees.recurringFees && (
              <div>
                <p className="text-muted-foreground font-medium mb-1">Recurring fees</p>
                <ul className="space-y-1">
                  {fees.recurringFees.policyAdminFee != null && (
                    <li>
                      <span className="text-muted-foreground">Policy admin fee:</span>{' '}
                      {typeof fees.recurringFees.policyAdminFee === 'object'
                        ? [fees.recurringFees.policyAdminFee.amount, fees.recurringFees.policyAdminFee.frequency]
                            .filter(Boolean)
                            .join(' ') || fees.recurringFees.policyAdminFee.note || '—'
                        : '—'}
                      {typeof fees.recurringFees.policyAdminFee === 'object' && fees.recurringFees.policyAdminFee.note && (
                        <span className="text-muted-foreground"> — {fees.recurringFees.policyAdminFee.note}</span>
                      )}
                    </li>
                  )}
                  {fees.recurringFees.managementFeePct != null && (
                    <li><span className="text-muted-foreground">Management fee:</span> {fees.recurringFees.managementFeePct}% p.a.</li>
                  )}
                  {fees.recurringFees.mortalityChargeBasis && (
                    <li><span className="text-muted-foreground">Mortality charge:</span> {fees.recurringFees.mortalityChargeBasis}</li>
                  )}
                  {fees.recurringFees.topUpChargePct != null && (
                    <li><span className="text-muted-foreground">Top-up charge:</span> {fees.recurringFees.topUpChargePct}%</li>
                  )}
                </ul>
              </div>
            )}
            {fees.exitCosts && (fees.exitCosts.hasSurrenderPenalty != null || fees.exitCosts.penaltyPeriodYears != null || fees.exitCosts.penaltyNotes) && (
              <div>
                <p className="text-muted-foreground font-medium mb-1">Exit costs</p>
                <ul className="space-y-1">
                  {fees.exitCosts.hasSurrenderPenalty != null && (
                    <li>
                      <span className="text-muted-foreground">
                        <LabelWithBridgeTooltip label="Surrender penalty:" bridgeKey="surrenderPenalty" />
                      </span>{' '}
                      {fees.exitCosts.hasSurrenderPenalty ? 'Yes' : 'No'}
                    </li>
                  )}
                  {fees.exitCosts.penaltyPeriodYears != null && (
                    <li><span className="text-muted-foreground">Penalty period:</span> {fees.exitCosts.penaltyPeriodYears} years</li>
                  )}
                  {fees.exitCosts.penaltyNotes && (
                    <li className="text-muted-foreground">{fees.exitCosts.penaltyNotes}</li>
                  )}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Risks covered */}
      {product.riskVectors?.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              Risks covered
            </CardTitle>
            <CardDescription>Risks this product can help protect against</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-wrap gap-2">
              {product.riskVectors.map((v) => (
                <li key={v}>
                  <Badge variant="secondary">{v}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      {/* Payout & acceptance */}
      {(product.payoutStructure || product.capitalCertaintyScore != null || product.acceptanceFriction) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payout & acceptance</CardTitle>
            <CardDescription>How benefits are paid and how easy it is to get cover</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {product.payoutStructure && (
              <p><span className="text-muted-foreground">Payout structure:</span> {product.payoutStructure}</p>
            )}
            {product.capitalCertaintyScore != null && (
              <p>
                <span className="text-muted-foreground">
                  <LabelWithBridgeTooltip label="Capital certainty score:" bridgeKey="capitalCertainty" />
                </span>{' '}
                {product.capitalCertaintyScore}
              </p>
            )}
            {product.acceptanceFriction && (
              <p>
                <span className="text-muted-foreground">
                  <LabelWithBridgeTooltip label="Acceptance:" bridgeKey="acceptanceFriction" />
                </span>{' '}
                {product.acceptanceFriction}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Value / efficiency */}
      {(product.incomeReplacementMultiplier != null || product.affordabilityEfficiency != null) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Value indicators
            </CardTitle>
            <CardDescription>Indicative efficiency (for comparison only; not advice)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {product.incomeReplacementMultiplier != null && (
              <p>
                <span className="text-muted-foreground">Income replacement multiplier:</span> {product.incomeReplacementMultiplier}
                <span className="block text-xs text-muted-foreground mt-0.5">{VALUE_INDICATOR_EXPLANATIONS.incomeReplacementMultiplier}</span>
              </p>
            )}
            {product.affordabilityEfficiency != null && (
              <p>
                <span className="text-muted-foreground">Affordability efficiency:</span> {product.affordabilityEfficiency}
                <span className="block text-xs text-muted-foreground mt-0.5">{VALUE_INDICATOR_EXPLANATIONS.affordabilityEfficiency}</span>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Why we show this (matching tags) */}
      {product.matchingTags?.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              Why this might fit you
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-wrap gap-2">
              {product.matchingTags.map((t) => (
                <li key={t}>
                  <Badge variant="outline">{t}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default InsuranceProductDetailPage;
