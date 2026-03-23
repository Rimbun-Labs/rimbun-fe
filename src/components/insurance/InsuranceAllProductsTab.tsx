import React, { useState, useMemo } from 'react';
import { useInsuranceProducts } from '@/hooks/useInsuranceProducts';
import { useResilienceOverview } from '@/hooks/useResilienceOverview';
import { InsuranceProductCard } from './InsuranceProductCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Search, PackageOpen, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All categories' },
  { value: 'protection', label: 'Protection products' },
  { value: 'pa', label: 'Personal accident' },
  { value: 'medical', label: 'Medical' },
  { value: 'whole_life', label: 'Whole life' },
  { value: 'term_life', label: 'Term life' },
  { value: 'endowment', label: 'Endowment' },
];

/** Set of product IDs that are recommended (from overview goals + safety floor) */
function useRecommendedProductIds(): Set<string> {
  const { data: overview } = useResilienceOverview();
  const set = new Set<string>();
  if (!overview) return set;
  overview.safetyFloor?.products?.forEach((p) => set.add(p.productId));
  overview.goals?.forEach((g) => g.products?.forEach((p) => set.add(p.productId)));
  return set;
}

interface InsuranceAllProductsTabProps {
  takafulOnly: boolean;
  compareProductIds: string[];
  onAddToCompare: (productId: string) => void;
  onRemoveFromCompare: (productId: string) => void;
  /** When Takaful filter is on and no products match, call this to offer showing conventional options */
  onShowConventionalOptions?: () => void;
}

const LIMIT = 50;

export const InsuranceAllProductsTab: React.FC<InsuranceAllProductsTabProps> = ({
  takafulOnly,
  compareProductIds,
  onAddToCompare,
  onRemoveFromCompare,
  onShowConventionalOptions,
}) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [offset, setOffset] = useState(0);
  const recommendedIds = useRecommendedProductIds();

  const filters = useMemo(
    () => ({
      takaful_only: takafulOnly || undefined,
      search: search.trim() || undefined,
      category: category.trim() || undefined,
      limit: LIMIT,
      offset,
    }),
    [takafulOnly, search, category, offset]
  );

  const { data, isLoading, error } = useInsuranceProducts(filters);
  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const hasMore = offset + products.length < total;

  const handleAddToCompare = (productId: string) => {
    if (compareProductIds.includes(productId)) {
      onRemoveFromCompare(productId);
    } else if (compareProductIds.length < 4) {
      onAddToCompare(productId);
    }
  };

  const currentPage = total > 0 ? Math.floor(offset / LIMIT) + 1 : 0;
  const totalPages = total > 0 ? Math.ceil(total / LIMIT) : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOffset(0);
            }}
            className="pl-9"
          />
        </div>
        <div className="w-[180px]">
          <Label className="text-xs text-muted-foreground">Category</Label>
          <Select
            value={category || 'all'}
            onValueChange={(v) => {
              setCategory(v === 'all' ? '' : v);
              setOffset(0);
            }}
          >
            <SelectTrigger className="mt-0.5">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value || 'all'} value={opt.value || 'all'}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Couldn’t load products</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try again. If the problem continues, refresh the page.
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && products.length === 0 && (
        <div className="rounded-lg border border-dashed bg-muted/20 p-8 text-center space-y-4">
          <PackageOpen className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          {takafulOnly && onShowConventionalOptions ? (
            <>
              <p className="font-medium text-foreground">
                We couldn&apos;t find any Takaful products matching your filters.
              </p>
              <p className="text-sm text-muted-foreground">
                Would you like to see conventional options?
              </p>
              <Button variant="default" size="sm" onClick={onShowConventionalOptions} className="mt-2">
                See conventional options
              </Button>
            </>
          ) : (
            <>
              <p className="font-medium text-foreground">No products match your filters</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try a different search term, category, or turn off “Takaful only” to see more.
              </p>
            </>
          )}
        </div>
      )}

      {!isLoading && !error && products.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {offset + 1}–{offset + products.length} of {total} products
            {totalPages > 1 && (
              <span className="ml-2">
                · Page {currentPage} of {totalPages}
              </span>
            )}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <InsuranceProductCard
                key={product.productId}
                product={product}
                isRecommended={recommendedIds.has(product.productId)}
                showAddToCompare
                onAddToCompare={handleAddToCompare}
                isInCompare={compareProductIds.includes(product.productId)}
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              type="button"
              className="text-sm text-primary hover:underline disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => setOffset((o) => Math.max(0, o - LIMIT))}
              disabled={offset === 0}
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              className="text-sm text-primary hover:underline disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => setOffset((o) => o + LIMIT)}
              disabled={!hasMore}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};
