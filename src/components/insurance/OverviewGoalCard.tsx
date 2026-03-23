import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Shield, ShieldAlert, ChevronRight, Info } from 'lucide-react';
import type { ResilienceOverviewGoalDto, ResilienceProductDto } from '@/lib/api/types/resilience';
import {
  getInsuranceCurrencyFormat,
  getMonthlyPaymentLabel,
  HEDGE_TYPE_EXPLANATIONS,
  INSURANCE_TERMS,
} from '@/lib/constants/insuranceEducation';
import { getInsuranceProductDisplayName, formatGoalType } from '@/lib/utils/insuranceDisplay';
import { LabelWithBridgeTooltip } from './LabelWithBridgeTooltip';
import { cn } from '@/lib/utils';

const currency = getInsuranceCurrencyFormat();
const currencyMonthly = getInsuranceCurrencyFormat();

function ProductSlide({
  product,
  minMonthly,
}: {
  product: ResilienceProductDto;
  minMonthly: number | null;
}) {
  const productId = product.productId;
  const content = (
    <>
      <p className="font-medium text-foreground">
        {getInsuranceProductDisplayName(product)}
      </p>
      {product.nudgeCopy && (
        <p className="mt-1 text-muted-foreground">{product.nudgeCopy}</p>
      )}
      {minMonthly != null && (() => {
        const { term, indicativeLabel } = getMonthlyPaymentLabel(product.isTakaful === true);
        return (
          <p className="mt-2 text-xs text-muted-foreground">
            From {currencyMonthly.format(minMonthly)}/mo
            <span className="block text-[10px] text-muted-foreground/80 mt-0.5">
              Indicative {term.toLowerCase()} · {indicativeLabel}
            </span>
          </p>
        );
      })()}
    </>
  );
  return (
    <div className="rounded-lg border bg-muted/30 p-3 text-sm">
      {productId ? (
        <Link
          to={`/insurance/products/${encodeURIComponent(productId)}`}
          className="block text-left hover:bg-muted/20 -m-3 p-3 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  );
}

interface OverviewGoalCardProps {
  goal: ResilienceOverviewGoalDto;
  takafulOnly?: boolean;
  className?: string;
}

/** Goal card for Tab 1 using overview data (no per-goal fetch). */
export const OverviewGoalCard: React.FC<OverviewGoalCardProps> = ({
  goal,
  takafulOnly = false,
  className,
}) => {
  const products = goal.products ?? [];
  const filteredProducts = takafulOnly
    ? products.filter(
        (p) =>
          p.isTakaful === true ||
          /takaful|tba|tbk/i.test(p.productCategory) ||
          /takaful|tba|tbk/i.test(p.productSubcategory ?? '')
      )
    : products;

  const hasHedge = goal.hedgeType !== 'none';
  const showNudge = goal.showNudge === true && goal.dependencyScope == null;
  const statusLabel = hasHedge
    ? filteredProducts.length > 0
      ? `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`
      : 'Recommended'
    : 'Not hedged';

  const minMonthly = filteredProducts.reduce<number | null>((acc, p) => {
    const v = p.estimatedMonthlyPremiumProxy;
    if (v == null) return acc;
    return acc === null ? v : Math.min(acc, v);
  }, null);

  const explain = HEDGE_TYPE_EXPLANATIONS[goal.hedgeType] ?? HEDGE_TYPE_EXPLANATIONS.none;
  const goalName = goal.goalName ?? 'Goal';
  const goalType = goal.goalType ?? '';

  return (
    <Card className={cn('transition-shadow hover:shadow-md min-w-0 overflow-hidden', className)}>
      <CardHeader className="p-4 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            {goalName}
          </CardTitle>
          <div className="flex items-center gap-2">
            {showNudge && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                <ShieldAlert className="mr-1 h-3 w-3" />
                Missing information
              </Badge>
            )}
            <Badge variant={hasHedge ? 'default' : 'outline'}>{statusLabel}</Badge>
          </div>
        </div>
        <CardDescription className="flex flex-wrap items-center gap-1">
          {goalType ? formatGoalType(goalType) : ''}
          {goal.recommendedSumAssured > 0 && (
            <>
              <span> · <LabelWithBridgeTooltip label="Recommended cover" bridgeKey="recommendedCover" /> {currency.format(goal.recommendedSumAssured)}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                      aria-label="Explanation: Recommended cover"
                    >
                      <Info className="h-3.5 w-3.5 shrink-0" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{INSURANCE_TERMS.recommendedCoverContext}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        {hasHedge && (
          <>
            <p className="text-sm text-muted-foreground">{goal.actionCopy}</p>
            <p className="text-xs text-muted-foreground italic">
              Why it matters: {explain.body}
            </p>
            {filteredProducts.length > 0 &&
              (filteredProducts.length === 1 ? (
                <ProductSlide product={filteredProducts[0]} minMonthly={minMonthly} />
              ) : (
                <Carousel
                  opts={{ align: 'start', loop: false, containScroll: 'trimSnaps' }}
                  className="w-full min-w-0"
                >
                  <div className="relative min-w-0 px-6">
                    <CarouselPrevious
                      variant="ghost"
                      size="icon"
                      className="left-0 top-1/2 -translate-y-1/2 z-10 h-7 w-7 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white"
                    />
                    <CarouselNext
                      variant="ghost"
                      size="icon"
                      className="right-0 top-1/2 -translate-y-1/2 z-10 h-7 w-7 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white"
                    />
                    <CarouselContent className="-ml-2">
                      {filteredProducts.map((product) => (
                        <CarouselItem key={product.productId} className="pl-2 basis-full">
                          <ProductSlide
                            product={product}
                            minMonthly={product.estimatedMonthlyPremiumProxy ?? minMonthly}
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </div>
                </Carousel>
              ))}
          </>
        )}
        {!hasHedge && (
          <>
            <p className="text-sm text-muted-foreground">No resilience recommendation for this goal type.</p>
            <p className="text-xs text-muted-foreground mt-1">
              You can still add general cover (e.g. life or medical) from Essential cover or All products.
            </p>
          </>
        )}
        {hasHedge && filteredProducts.length === 0 && products.length > 0 && takafulOnly && (
          <p className="text-xs text-muted-foreground">
            No Takaful products in recommendations for this goal. Try conventional options or All products.
          </p>
        )}
        {hasHedge && filteredProducts.length === 0 && products.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No products in recommendations yet. Browse All products to find cover.
          </p>
        )}
        <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
          <Link to={`/goals/${goal.goalId}`}>
            Manage cover
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
