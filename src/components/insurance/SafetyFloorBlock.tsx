import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, ChevronRight } from 'lucide-react';
import type { SafetyFloorResponseDto } from '@/lib/api/types/resilience';
import { FOUNDATION_SECURE_EXPLANATION } from '@/lib/constants/insuranceEducation';
import { InsuranceProductCard } from './InsuranceProductCard';
import { cn } from '@/lib/utils';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

interface SafetyFloorBlockProps {
  data: SafetyFloorResponseDto;
  /** Optional: on "Manage foundation" click, e.g. switch to All Products tab */
  onManageFoundation?: () => void;
  className?: string;
}

/**
 * Safety-first block for Tab 1: foundation status, nudge copy, and low-friction essential products.
 */
export const SafetyFloorBlock: React.FC<SafetyFloorBlockProps> = ({
  data,
  onManageFoundation,
  className,
}) => {
  const { products, nudgeCopy, foundationSecurePercent } = data;
  const hasProducts = products.length > 0;

  return (
    <Card className={cn('border-primary/20', className)}>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Layers className="h-5 w-5 text-primary" />
          Your foundation
        </CardTitle>
        <CardDescription>
          Before growing your wealth, protect your current savings from sudden shocks.
        </CardDescription>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <div className="text-3xl font-bold tabular-nums text-primary">
            {Math.round(foundationSecurePercent)}%
          </div>
          <span className="text-sm text-muted-foreground">foundation secure</span>
        </div>
        <p className="text-xs text-muted-foreground pt-0.5 max-w-md">
          {FOUNDATION_SECURE_EXPLANATION}
        </p>
        {nudgeCopy && (
          <p className="text-sm text-muted-foreground pt-1">{nudgeCopy}</p>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        {hasProducts && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 6).map((product) => (
              <InsuranceProductCard
                key={product.productId}
                product={product}
                showAddToCompare={false}
                foundationRole="Helps protect your current savings from shocks (e.g. medical, accident)."
              />
            ))}
          </div>
        )}
        {(onManageFoundation || hasProducts) && (
          <div className="flex flex-wrap gap-2">
            {onManageFoundation && (
              <Button variant="outline" size="sm" onClick={onManageFoundation}>
                View all foundation products
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
