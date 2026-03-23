import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, ShieldAlert, ChevronRight } from 'lucide-react';
import { useResilience } from '@/hooks/useGoals';
import type { GoalWithInsightsDto } from '@/lib/api/types/goals';
import {
  getInsuranceCurrencyFormat,
  getMonthlyPaymentLabel,
  HEDGE_TYPE_EXPLANATIONS,
} from '@/lib/constants/insuranceEducation';
import { getInsuranceProductDisplayName, formatGoalType } from '@/lib/utils/insuranceDisplay';
import { cn } from '@/lib/utils';

const currency = getInsuranceCurrencyFormat();
const currencyMonthly = getInsuranceCurrencyFormat();

interface GoalResilienceCardProps {
  goal: GoalWithInsightsDto;
  /** When true, only show products that look Takaful (category/subcategory contains Takaful, TBA, TBK) */
  takafulOnly?: boolean;
  className?: string;
}

/** Single goal's resilience summary for the Insurance Explorer list. */
export const GoalResilienceCard: React.FC<GoalResilienceCardProps> = ({
  goal,
  takafulOnly = false,
  className,
}) => {
  const { data: resilience, isLoading } = useResilience(goal.id);

  const products = resilience?.products ?? [];
  const filteredProducts = takafulOnly
    ? products.filter(
        (p) =>
          /takaful|tba|tbk/i.test(p.productCategory) ||
          /takaful|tba|tbk/i.test(p.productSubcategory ?? '')
      )
    : products;

  const hasHedge = resilience && resilience.hedgeType !== 'none';
  const showNudge = resilience?.showNudge === true && resilience?.dependencyScope == null;
  const statusLabel = (() => {
    if (!resilience) return null;
    if (resilience.hedgeType === 'none') return 'Not hedged';
    if (filteredProducts.length > 0) return `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`;
    return 'Recommended';
  })();

  const minMonthly = filteredProducts.reduce<number | null>((acc, p) => {
    const v = p.estimatedMonthlyPremiumProxy;
    if (v == null) return acc;
    return acc === null ? v : Math.min(acc, v);
  }, null);

  return (
    <Card className={cn('transition-shadow hover:shadow-md', className)}>
      <CardHeader className="p-4 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            {goal.goalName}
          </CardTitle>
          <div className="flex items-center gap-2">
            {showNudge && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                <ShieldAlert className="mr-1 h-3 w-3" />
                Missing information
              </Badge>
            )}
            {statusLabel && (
              <Badge variant={hasHedge ? 'default' : 'outline'}>
                {statusLabel}
              </Badge>
            )}
          </div>
        </div>
        <CardDescription>
          {formatGoalType(goal.goalType)} · Target {currency.format(goal.targetAmount)}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading protection options…</p>
        )}
        {!isLoading && resilience && resilience.hedgeType !== 'none' && (
          <>
            <p className="text-sm text-muted-foreground">{resilience.actionCopy}</p>
            {(() => {
              const explain = HEDGE_TYPE_EXPLANATIONS[resilience.hedgeType] ?? HEDGE_TYPE_EXPLANATIONS.none;
              return (
                <p className="text-xs text-muted-foreground italic">
                  Why it matters: {explain.body}
                </p>
              );
            })()}
            {filteredProducts.length > 0 && (() => {
              const product = filteredProducts[0];
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
                    const { term } = getMonthlyPaymentLabel(product.isTakaful === true);
                    return (
                      <p className="mt-2 text-xs text-muted-foreground">
                        From {currencyMonthly.format(minMonthly)}/mo
                        <span className="block text-[10px] text-muted-foreground/80 mt-0.5">
                          Indicative {term.toLowerCase()}
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
            })()}
            {takafulOnly && products.length > 0 && filteredProducts.length === 0 && (
              <p className="text-xs text-muted-foreground">No Takaful products in recommendations for this goal.</p>
            )}
          </>
        )}
        {!isLoading && resilience && resilience.hedgeType === 'none' && (
          <p className="text-sm text-muted-foreground">No resilience recommendation for this goal type.</p>
        )}
        <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
          <Link to={`/goals/${goal.id}`}>
            Manage cover
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
