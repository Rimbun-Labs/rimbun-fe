import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Shield, Plus, Info } from 'lucide-react';
import type { InsuranceProductDto } from '@/lib/api/types/insuranceProducts';
import type { ResilienceProductDto } from '@/lib/api/types/resilience';
import {
  getInsuranceCurrencyFormat,
  getMonthlyPaymentLabel,
  PRODUCT_CATEGORY_EXPLANATIONS,
  PRODUCT_SUBCATEGORY_EXPLANATIONS,
} from '@/lib/constants/insuranceEducation';
import {
  getInsuranceProductDisplayName,
  formatInsuranceCategoryWithSub,
} from '@/lib/utils/insuranceDisplay';
import { cn } from '@/lib/utils';

const currency = getInsuranceCurrencyFormat();

type ProductLike = InsuranceProductDto | ResilienceProductDto;

interface InsuranceProductCardProps {
  product: ProductLike;
  /** Show "Recommended for you" badge (when product is in user's resilience recommendations) */
  isRecommended?: boolean;
  /** When from a goal, e.g. "Education" – shown as "For {name}" */
  recommendedForGoal?: string;
  /** When recommended but not goal-specific, e.g. "Part of your essential cover" */
  recommendationContext?: string;
  /** Short line for foundation/safety context (e.g. "Helps protect your current savings from shocks") */
  foundationRole?: string;
  showAddToCompare?: boolean;
  onAddToCompare?: (productId: string) => void;
  isInCompare?: boolean;
  className?: string;
}

function CategoryWithTooltip({ category, subcategory }: { category?: string; subcategory?: string }) {
  const label = formatInsuranceCategoryWithSub(category ?? null, subcategory ?? null);
  if (!label) return null;
  const catExplain = category ? (PRODUCT_CATEGORY_EXPLANATIONS[category] ?? PRODUCT_CATEGORY_EXPLANATIONS[category.replace(/_/g, ' ')]) : null;
  const subExplain = subcategory
    ? PRODUCT_SUBCATEGORY_EXPLANATIONS[subcategory] ?? PRODUCT_SUBCATEGORY_EXPLANATIONS[subcategory.replace(/_/g, ' ')]
    : null;
  const explanation = [catExplain, subExplain].filter(Boolean).join(' ') || undefined;
  if (!explanation) return <p className="text-xs text-muted-foreground mt-0.5">{label}</p>;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 cursor-help hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded text-left"
            aria-label={`Explanation: ${label}`}
          >
            {label}
            <Info className="h-3 w-3 shrink-0" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{explanation}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export const InsuranceProductCard: React.FC<InsuranceProductCardProps> = ({
  product,
  isRecommended = false,
  recommendedForGoal,
  recommendationContext,
  foundationRole,
  showAddToCompare = true,
  onAddToCompare,
  isInCompare = false,
  className,
}) => {
  const url = product.productPageUrl ?? product.brochureUrl;
  const monthly = product.estimatedMonthlyPremiumProxy;
  const primaryIntent = 'primaryIntent' in product ? product.primaryIntent : undefined;

  return (
    <Card className={cn('transition-shadow hover:shadow-md min-w-0 min-h-[300px] flex flex-col', className)}>
      <CardContent className="p-4 space-y-3 flex flex-col flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground truncate">
              {getInsuranceProductDisplayName(product)}
            </p>
            <CategoryWithTooltip category={product.productCategory} subcategory={product.productSubcategory} />
          </div>
          <div className="flex flex-wrap gap-1">
            {product.isTakaful && (
              <Badge variant="secondary" className="text-xs">Shariah-compliant</Badge>
            )}
            {isRecommended && (
              <Badge variant="default" className="text-xs">
                <Shield className="mr-1 h-3 w-3" />
                Recommended for you
              </Badge>
            )}
          </div>
        </div>
        {primaryIntent && (
          <p className="text-xs font-medium text-foreground">{primaryIntent}</p>
        )}
        {foundationRole && (
          <p className="text-xs text-muted-foreground">{foundationRole}</p>
        )}
        {(recommendedForGoal || (isRecommended && recommendationContext)) && (
          <p className="text-xs text-muted-foreground">
            {recommendedForGoal ? `For ${recommendedForGoal}` : recommendationContext}
          </p>
        )}
        {product.nudgeCopy && (
          <p className="text-sm text-muted-foreground line-clamp-2">{product.nudgeCopy}</p>
        )}
        {monthly != null && (() => {
          const { term } = getMonthlyPaymentLabel(product.isTakaful === true);
          return (
            <p className="text-xs text-muted-foreground">
              From {currency.format(monthly)}/mo
              <span className="block text-[10px] text-muted-foreground/80 mt-0.5">
                Indicative {term.toLowerCase()} · Eligibility in details
              </span>
            </p>
          );
        })()}
        <div className="flex flex-wrap gap-2 mt-auto pt-1">
          <Button variant="default" size="sm" asChild>
            <Link to={`/insurance/products/${encodeURIComponent(product.productId)}`}>
              View details
            </Link>
          </Button>
          {url && (
            <Button variant="outline" size="sm" asChild>
              <a href={url} target="_blank" rel="noopener noreferrer">
                View on insurer site
              </a>
            </Button>
          )}
          {showAddToCompare && onAddToCompare && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddToCompare(product.productId)}
              disabled={isInCompare}
            >
              <Plus className="h-4 w-4 mr-1" />
              {isInCompare ? 'In compare' : 'Add to compare'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
