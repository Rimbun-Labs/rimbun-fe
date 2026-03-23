import React from 'react';
import { InsuranceProductCard } from './InsuranceProductCard';
import type { ResilienceProductDto } from '@/lib/api/types/resilience';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface RecommendedProductsScrollProps {
  products: ResilienceProductDto[];
  onAddToCompare?: (productId: string) => void;
  compareProductIds: string[];
  /** Section heading above the carousel. If omitted, no heading is rendered. */
  title?: string;
  /** When set, shown on each card as recommendation context (e.g. "Part of your essential cover"). */
  recommendationContext?: string;
  className?: string;
}

/**
 * Carousel of product cards. Use for foundation products or other product lists.
 * Shows 1 card on mobile, 2 on tablet, 3 on desktop with prev/next controls.
 */
export const RecommendedProductsScroll: React.FC<RecommendedProductsScrollProps> = ({
  products,
  onAddToCompare,
  compareProductIds,
  title,
  recommendationContext,
  className,
}) => {
  if (products.length === 0) return null;

  return (
    <section className={cn('space-y-3 overflow-hidden min-w-0 max-w-5xl', className)}>
      {title ? <h2 className="text-lg font-semibold">{title}</h2> : null}
      <Carousel
        opts={{
          align: 'start',
          loop: false,
          containScroll: 'trimSnaps',
        }}
        className="w-full min-w-0"
      >
        <div className="relative min-w-0">
          <CarouselPrevious variant="ghost" size="icon" className="left-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white" />
          <CarouselNext variant="ghost" size="icon" className="right-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white" />
          <CarouselContent className="-ml-4">
            {products.map((product) => (
              <CarouselItem
                key={product.productId}
                className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 max-w-[320px]"
              >
                <div className="min-w-0 w-full">
                <InsuranceProductCard
                  product={product}
                  isRecommended
                  recommendationContext={recommendationContext}
                  showAddToCompare={Boolean(onAddToCompare)}
                  onAddToCompare={onAddToCompare}
                  isInCompare={compareProductIds.includes(product.productId)}
                />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
      </Carousel>
    </section>
  );
};
