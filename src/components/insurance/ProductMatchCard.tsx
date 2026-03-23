import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingDown } from 'lucide-react';
import { INSURANCE_DISPLAY_CURRENCY } from '@/lib/constants/insuranceEducation';
import { cn } from '@/lib/utils';

export interface ProductMatchCardProps {
  /** Persona label, e.g. "Resilient Saver" */
  personaName: string;
  /** Goal context, e.g. "5-year goal" or "Education (10-year horizon)" */
  goalHorizon: string;
  /** Recommended product display name */
  recommendedProductName: string;
  /** Alternative product (when comparing). Omit for single-product "why this fits" view. */
  alternativeProductName?: string;
  /** Savings amount in currency (e.g. 400 for $400) */
  savingsAmount: number;
  /** Currency code for display, default BND */
  currency?: string;
  /** Short explanation, e.g. "in hidden fees" or "in total cost over term" */
  savingsReason?: string;
  /** Optional className for the card */
  className?: string;
  /** Compact layout for inline use next to TCO */
  compact?: boolean;
}

function formatCurrency(amount: number, currencyCode: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Suitability Case Study / Product Match UI for pitch and user clarity.
 * Shows: "Because you are a 'Resilient Saver' persona with a 5-year goal,
 * we recommend Product X over Product Y, which saves you $400 in hidden fees."
 */
export const ProductMatchCard: React.FC<ProductMatchCardProps> = ({
  personaName,
  goalHorizon,
  recommendedProductName,
  alternativeProductName,
  savingsAmount,
  currency = INSURANCE_DISPLAY_CURRENCY,
  savingsReason = 'in hidden fees',
  className,
  compact = false,
}) => {
  const hasComparison = Boolean(alternativeProductName);
  const savingsText = formatCurrency(savingsAmount, currency);

  return (
    <Card className={cn('border-primary/20 bg-primary/5', className)}>
      <CardHeader className={compact ? 'p-3 pb-1' : 'p-4 pb-2'}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          <CardTitle className="text-base font-semibold">
            Product Match
          </CardTitle>
          <Badge variant="secondary" className="text-xs font-normal">
            Suitability
          </Badge>
        </div>
        {!compact && (
          <CardDescription>
            Recommendation based on your profile and goal
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className={compact ? 'p-3 pt-0' : 'p-4 pt-0'}>
        <p className={cn('text-sm text-foreground', compact && 'leading-snug')}>
          Because you are a{' '}
          <span className="font-semibold text-primary">&quot;{personaName}&quot;</span>
          {' '}persona with a{' '}
          <span className="font-medium">{goalHorizon}</span>, we recommend{' '}
          <span className="font-semibold">{recommendedProductName}</span>
          {hasComparison && (
            <>
              {' '}over{' '}
              <span className="font-medium text-muted-foreground">{alternativeProductName}</span>
            </>
          )}
          , which saves you{' '}
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
            <TrendingDown className="h-3.5 w-3.5 shrink-0" />
            {savingsText}
          </span>
          {' '}{savingsReason}.
        </p>
      </CardContent>
    </Card>
  );
};
