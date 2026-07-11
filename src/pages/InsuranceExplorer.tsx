import { useState, useCallback, useMemo } from 'react';
import { Shield, Filter, Info, Target, Grid3x3, Scale, Wallet } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PageHeader, PageContainer } from '@/components/layout';
import { useResilienceOverview } from '@/hooks/useResilienceOverview';
import { INSURANCE_TERMS, TAKAFUL_SURPLUS_EXPLANATION } from '@/lib/constants/insuranceEducation';
import {
  ProtectionOverviewStrip,
  RecommendedProductsScroll,
  InsuranceBasicsCard,
  OverviewGoalCard,
  InsuranceAllProductsTab,
  InsuranceCompareTab,
  MyPoliciesTab,
} from '@/components/insurance';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { SPACING } from '@/lib/constants/spacing';
import {
  formatInsuranceCategoryLabel,
  getNeedGroupForCategory,
  INSURANCE_NEED_GROUPS,
  NEED_OTHER,
} from '@/lib/utils/insuranceDisplay';
import type { ResilienceProductDto } from '@/lib/api/types/resilience';
import { cn } from '@/lib/utils';

/** Need-based blocks only (Health & income, Life & family, Assets & lifestyle). Products that don't map go in unmapped. */
function groupProductsByNeed(
  products: ResilienceProductDto[]
): {
  needBlocks: Array<{ needId: (typeof INSURANCE_NEED_GROUPS)[number]['id']; label: string; products: ResilienceProductDto[] }>;
  unmapped: ResilienceProductDto[];
} {
  const byNeed = new Map<string, ResilienceProductDto[]>();
  for (const p of products) {
    const needId = getNeedGroupForCategory(p.productCategory);
    if (!byNeed.has(needId)) byNeed.set(needId, []);
    byNeed.get(needId)!.push(p);
  }
  const needBlocks = INSURANCE_NEED_GROUPS.filter((g) => (byNeed.get(g.id)?.length ?? 0) > 0).map((g) => ({
    needId: g.id,
    label: g.label,
    products: byNeed.get(g.id) ?? [],
  }));
  const unmapped = byNeed.get(NEED_OTHER) ?? [];
  return { needBlocks, unmapped };
}

/** Group unmapped products by their product category so we show real category names (no "Other"). Sorted by display label. */
function groupUnmappedByCategory(
  products: ResilienceProductDto[]
): Array<{ category: string; label: string; products: ResilienceProductDto[] }> {
  const byCategory = new Map<string, ResilienceProductDto[]>();
  for (const p of products) {
    const key = (p.productCategory ?? '').trim() || 'general';
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key)!.push(p);
  }
  return Array.from(byCategory.entries())
    .map(([category, products]) => ({ category, label: formatInsuranceCategoryLabel(category), products }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

const InsuranceExplorer = () => {
  const [takafulOnly, setTakafulOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('by-goal');
  const [compareProductIds, setCompareProductIds] = useState<string[]>([]);

  const { data: overview, isLoading: overviewLoading, error: overviewError } = useResilienceOverview();

  const safetyFloor = overview?.safetyFloor;
  const goals = overview?.goals ?? [];
  const hedgedGoalsCount = goals.filter((g) => g.hedgeType !== 'none').length;
  const totalGoalsCount = goals.length;

  const handleManageFoundation = useCallback(() => {
    setActiveTab('all-products');
  }, []);

  const handleAddToCompare = useCallback((productId: string) => {
    setCompareProductIds((prev) =>
      prev.includes(productId) ? prev : prev.length < 4 ? [...prev, productId] : prev
    );
  }, []);

  const handleRemoveFromCompare = useCallback((productId: string) => {
    setCompareProductIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const handleClearCompare = useCallback(() => {
    setCompareProductIds([]);
  }, []);

  const compareCount = compareProductIds.length;

  const foundationProducts = useMemo(() => {
    if (!safetyFloor?.products) return [];
    let list = [...safetyFloor.products];
    if (takafulOnly) {
      list = list.filter(
        (p) =>
          p.isTakaful === true ||
          /takaful|tba|tbk/i.test(p.productCategory) ||
          /takaful|tba|tbk/i.test(p.productSubcategory ?? '')
      );
    }
    return list;
  }, [safetyFloor?.products, takafulOnly]);

  return (
    <PageContainer>
      <PageHeader
        icon={Shield}
        title="Insurance"
        description="Insurance products and coverage options"
        action={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="takaful-toggle" className="text-sm font-medium cursor-pointer">
                <span className="hidden sm:inline">Show Shariah-compliant (Takaful) only</span>
                <span className="sm:hidden">Takaful only</span>
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-muted-foreground hover:text-foreground focus:outline-none">
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{INSURANCE_TERMS.takaful}</p>
                    <p className="mt-2">{TAKAFUL_SURPLUS_EXPLANATION}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Switch
                id="takaful-toggle"
                checked={takafulOnly}
                onCheckedChange={setTakafulOnly}
              />
            </div>
          </div>
        }
      />

      <div className={cn(SPACING.page.subsection, 'mt-6 w-full min-w-0 overflow-hidden')}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full min-w-0">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50 max-w-3xl">
            <TabsTrigger value="by-goal" className="gap-2 py-2.5">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">By goal</span>
            </TabsTrigger>
            <TabsTrigger value="all-products" className="gap-2 py-2.5">
              <Grid3x3 className="h-4 w-4" />
              <span className="hidden sm:inline">All products</span>
            </TabsTrigger>
            <TabsTrigger value="compare" className="gap-2 py-2.5 relative">
              <Scale className="h-4 w-4" />
              <span>Compare</span>
              {compareCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1 flex items-center justify-center text-xs">
                  {compareCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="my-policies" className="gap-2 py-2.5">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">My policies</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="by-goal" className="mt-6 space-y-8 data-[state=inactive]:hidden min-w-0 overflow-hidden">
            {overviewLoading && (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-40 w-3/4" />
              </div>
            )}

            {overviewError && (
              <Alert variant="destructive">
                <AlertTitle>Couldn’t load your cover overview</AlertTitle>
                <AlertDescription>
                  Something went wrong. Please try again or refresh the page.
                </AlertDescription>
              </Alert>
            )}

            {!overviewLoading && !overviewError && overview && (
              <>
                {/* 1. Cover overview */}
                {safetyFloor && (
                  <section className="space-y-4" aria-labelledby="cover-overview-heading">
                    <h2 id="cover-overview-heading" className="sr-only">
                      Your cover at a glance
                    </h2>
                    <ProtectionOverviewStrip
                      foundationSecurePercent={safetyFloor.foundationSecurePercent}
                      hedgedGoalsCount={hedgedGoalsCount}
                      totalGoalsCount={totalGoalsCount}
                      nudgeCopy={safetyFloor.nudgeCopy}
                    />
                  </section>
                )}

                {/* 2. Essential cover (grouped by need) */}
                {safetyFloor && (() => {
                  const { needBlocks, unmapped } = groupProductsByNeed(foundationProducts);
                  const unmappedByCategory = groupUnmappedByCategory(unmapped);
                  const hasAny = needBlocks.length > 0 || unmappedByCategory.length > 0;
                  const showTakafulEmpty = !hasAny && takafulOnly;

                  return (
                    <section className="max-w-6xl space-y-8" aria-labelledby="essential-cover-heading">
                      <h2 id="essential-cover-heading" className="text-lg font-semibold">
                        Essential cover
                      </h2>
                      {showTakafulEmpty ? (
                        <div className="rounded-lg border border-dashed bg-muted/20 p-6 text-center space-y-4">
                          <p className="text-sm text-muted-foreground">
                            We couldn&apos;t find a Takaful product in this area yet. Would you like to see conventional options?
                          </p>
                          <Button variant="default" size="sm" onClick={() => setTakafulOnly(false)}>
                            See conventional options
                          </Button>
                        </div>
                      ) : !hasAny ? null : (
                        <>
                          {needBlocks.map(({ needId, label, products }) => (
                            <div key={needId} className="space-y-3">
                              <h3 className="text-base font-medium text-foreground">{label}</h3>
                              <RecommendedProductsScroll
                                products={products}
                                recommendationContext="Part of your essential cover"
                                onAddToCompare={handleAddToCompare}
                                compareProductIds={compareProductIds}
                              />
                            </div>
                          ))}
                          {unmappedByCategory.map(({ category, label, products }) => (
                            <div key={category} className="space-y-3">
                              <h3 className="text-base font-medium text-foreground">{label}</h3>
                              <RecommendedProductsScroll
                                products={products}
                                recommendationContext="Part of your essential cover"
                                onAddToCompare={handleAddToCompare}
                                compareProductIds={compareProductIds}
                              />
                            </div>
                          ))}
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="text-sm text-primary hover:underline"
                              onClick={handleManageFoundation}
                            >
                              View all essential cover →
                            </button>
                          </div>
                        </>
                      )}
                    </section>
                  );
                })()}

                {/* 3. Cover for your goals */}
                <section className="max-w-6xl">
                  <h2 className="text-lg font-semibold mb-4">Cover for your goals</h2>
                  {goals.length === 0 ? (
                    <div className="rounded-lg border border-dashed bg-muted/20 p-6 text-center">
                      <p className="text-muted-foreground text-sm">
                        Add goals in Planning to see resilience recommendations here.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 min-w-0">
                      {goals.map((goal) => (
                        <div key={goal.goalId} className="min-w-0">
                          <OverviewGoalCard
                            goal={goal}
                            takafulOnly={takafulOnly}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* 4. Learn about insurance (collapsed by default) */}
                <InsuranceBasicsCard />
              </>
            )}
          </TabsContent>

          <TabsContent value="all-products" className="mt-6 data-[state=inactive]:hidden">
            <InsuranceAllProductsTab
              takafulOnly={takafulOnly}
              compareProductIds={compareProductIds}
              onAddToCompare={handleAddToCompare}
              onRemoveFromCompare={handleRemoveFromCompare}
              onShowConventionalOptions={() => setTakafulOnly(false)}
            />
          </TabsContent>

          <TabsContent value="compare" className="mt-6 data-[state=inactive]:hidden">
            <InsuranceCompareTab
              productIds={compareProductIds}
              onRemove={handleRemoveFromCompare}
              onClear={handleClearCompare}
              onSwitchToAllProducts={() => setActiveTab('all-products')}
            />
          </TabsContent>

          <TabsContent value="my-policies" className="mt-6 data-[state=inactive]:hidden">
            <MyPoliciesTab />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default InsuranceExplorer;
