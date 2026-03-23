import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import { Calculator, ChevronDown, ChevronUp, Info, Loader2 } from 'lucide-react';
import { useResilienceSimulate } from '@/hooks/useResilienceSimulate';
import type { InsuranceProductDetailDto } from '@/lib/api/types/insuranceProducts';
import type { HedgeCompatibilityDto } from '@/lib/api/types/insuranceProducts';
import { cn } from '@/lib/utils';

const DURATION_MIN = 1;
const DURATION_MAX = 50;
const DURATION_DEFAULT = 15;

type PremiumType = 'monthly' | 'lump_sum';
type RiskToggle = 'guaranteed_min' | 'projected_best';

function formatCurrency(amount: number, currencyCode: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatPercent(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Subcategories that have premium growth (match backend GROWTH_SUBCATEGORIES) */
const GROWTH_SUBCATEGORIES = ['endowment', 'whole_life', 'ilp'] as const;

function isHedgeEligible(hedge: HedgeCompatibilityDto | undefined): boolean {
  if (!hedge) return false;
  return hedge.hasWaiverOfPremium === true || hedge.isGoalCompleter === true;
}

function isGrowthProduct(product: InsuranceProductDetailDto): boolean {
  const sub = (product.productSubcategory ?? '').toLowerCase().replace(/\s+/g, '_');
  return GROWTH_SUBCATEGORIES.some((s) => sub === s);
}

interface ResilienceSimulatorCardProps {
  productId: string;
  product: InsuranceProductDetailDto;
  className?: string;
}

export const ResilienceSimulatorCard: React.FC<ResilienceSimulatorCardProps> = ({
  productId,
  product,
  className,
}) => {
  const currencyCode = product.currency ?? 'BND';
  const defaultMonthly = product.estimatedMonthlyPremiumProxy ?? undefined;
  const hedge = product.hedgeCompatibility;
  const showHedgeEvent = isHedgeEligible(hedge);
  const isGrowth = isGrowthProduct(product);

  const [durationYears, setDurationYears] = useState(DURATION_DEFAULT);
  const [premiumType, setPremiumType] = useState<PremiumType>('monthly');
  const [monthlyPremium, setMonthlyPremium] = useState<string>(
    defaultMonthly != null ? String(defaultMonthly) : ''
  );
  const [lumpSumAmount, setLumpSumAmount] = useState<string>('');
  const [riskToggle, setRiskToggle] = useState<RiskToggle>('guaranteed_min');
  const [hedgeEventYear, setHedgeEventYear] = useState<string>('');
  const [tableOpen, setTableOpen] = useState(false);
  const [crisisYear, setCrisisYear] = useState(1);

  const { mutate, data: result, error, isPending, reset } = useResilienceSimulate();

  const projectionTable = result?.projectionTable ?? [];
  const crisisYearClamped = projectionTable.length
    ? Math.min(Math.max(1, crisisYear), projectionTable.length)
    : 1;
  const selectedRow = projectionTable.find((r) => r.year === crisisYearClamped);
  const hasHedgeColumn = projectionTable.some((r) => r.hedgeBenefitIfEventThisYear != null);
  const hasChargesColumn = projectionTable.some((r) => r.estimatedChargesToDate != null);

  useEffect(() => {
    if (projectionTable.length > 0 && crisisYear > projectionTable.length) {
      setCrisisYear(1);
    }
  }, [projectionTable.length, crisisYear]);

  const hedgeEventNum = useMemo(() => {
    const n = parseInt(hedgeEventYear, 10);
    if (Number.isNaN(n) || n < 1 || n > durationYears) return undefined;
    return n;
  }, [hedgeEventYear, durationYears]);

  const handleSimulate = () => {
    reset();
    const monthly =
      premiumType === 'monthly'
        ? (monthlyPremium ? parseFloat(monthlyPremium) : defaultMonthly)
        : undefined;
    const lumpSum =
      premiumType === 'lump_sum' && lumpSumAmount ? parseFloat(lumpSumAmount) : undefined;

    if (premiumType === 'monthly' && monthly != null && monthly <= 0) return;
    if (premiumType === 'lump_sum' && (!lumpSum || lumpSum <= 0)) return;

    const body = {
      productId,
      durationYears,
      riskToggle,
      ...(premiumType === 'monthly' && monthly != null && monthly > 0 ? { monthlyPremium: monthly } : {}),
      ...(premiumType === 'lump_sum' && lumpSum != null && lumpSum > 0 ? { lumpSumAmount: lumpSum } : {}),
      ...(showHedgeEvent && hedgeEventNum != null ? { hedgeEventYear: hedgeEventNum } : {}),
    };
    mutate(body);
  };

  const canSubmit =
    durationYears >= DURATION_MIN &&
    durationYears <= DURATION_MAX &&
    (premiumType === 'monthly'
      ? (monthlyPremium ? parseFloat(monthlyPremium) > 0 : defaultMonthly != null && defaultMonthly > 0)
      : lumpSumAmount ? parseFloat(lumpSumAmount) > 0 : false);

  const apiErrorMessage =
    error && 'response' in error && (error as { response?: { data?: { message?: string }; status?: number } }).response
      ? (error as { response: { data?: { message?: string }; status: number } }).response.status === 404
        ? 'Product not found or inactive.'
        : (error as { response: { data?: { message?: string } } }).response?.data?.message || error.message
      : error?.message;

  return (
    <Card className={cn(className)}>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-muted-foreground" />
          {isGrowth ? 'Project your maturity value' : 'See your total cost of protection'}
        </CardTitle>
        <CardDescription>
          {isGrowth
            ? 'See how your premiums could grow over the policy term. Projections are illustrative only.'
            : 'See how your premiums add up over the policy term (total contributions; no investment return).'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-5">
        {/* Policy term */}
        <div className="space-y-2">
          <Label>Policy term (years)</Label>
          <div className="flex items-center gap-4">
            <Slider
              min={DURATION_MIN}
              max={DURATION_MAX}
              step={1}
              value={[durationYears]}
              onValueChange={([v]) => setDurationYears(v)}
              className="flex-1 max-w-[240px]"
            />
            <span className="text-sm font-medium tabular-nums w-10">{durationYears}</span>
          </div>
        </div>

        {/* Premium type and amount */}
        <div className="space-y-3">
          <Label>Premium</Label>
          <RadioGroup
            value={premiumType}
            onValueChange={(v) => setPremiumType(v as PremiumType)}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="monthly" id="sim-monthly" />
              <Label htmlFor="sim-monthly" className="font-normal cursor-pointer">Monthly</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="lump_sum" id="sim-lump" />
              <Label htmlFor="sim-lump" className="font-normal cursor-pointer">Lump sum</Label>
            </div>
          </RadioGroup>
          {premiumType === 'monthly' && (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                step={1}
                placeholder={defaultMonthly != null ? String(defaultMonthly) : 'e.g. 120'}
                value={monthlyPremium}
                onChange={(e) => setMonthlyPremium(e.target.value)}
                className="w-32"
              />
              <span className="text-sm text-muted-foreground">{currencyCode}/mo</span>
              {defaultMonthly != null && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setMonthlyPremium(String(defaultMonthly))}
                >
                  Use product estimate
                </Button>
              )}
            </div>
          )}
          {premiumType === 'lump_sum' && (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                step={100}
                placeholder="e.g. 20000"
                value={lumpSumAmount}
                onChange={(e) => setLumpSumAmount(e.target.value)}
                className="w-32"
              />
              <span className="text-sm text-muted-foreground">{currencyCode}</span>
            </div>
          )}
        </div>

        {/* Scenario */}
        <div className="space-y-2">
          <Label>Scenario</Label>
          <RadioGroup
            value={riskToggle}
            onValueChange={(v) => setRiskToggle(v as RiskToggle)}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="guaranteed_min" id="sim-guaranteed" />
              <Label htmlFor="sim-guaranteed" className="font-normal cursor-pointer">
                Guaranteed minimum
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-muted-foreground hover:text-foreground">
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Conservative projection (lower yield band).</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="projected_best" id="sim-projected" />
              <Label htmlFor="sim-projected" className="font-normal cursor-pointer">
                Projected best
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-muted-foreground hover:text-foreground">
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Optimistic projection (higher yield band).</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </RadioGroup>
        </div>

        {/* Hedge event year (optional) */}
        {showHedgeEvent && (
          <div className="space-y-2">
            <Label htmlFor="sim-hedge-year">If event happens in year (optional)</Label>
            <p className="text-xs text-muted-foreground">
              See how much benefit you’d get if the insured event (e.g. critical illness) occurs in a specific year.
            </p>
            <Input
              id="sim-hedge-year"
              type="number"
              min={1}
              max={durationYears}
              step={1}
              placeholder={`1–${durationYears}`}
              value={hedgeEventYear}
              onChange={(e) => setHedgeEventYear(e.target.value)}
              className="w-24"
            />
          </div>
        )}

        <Button onClick={handleSimulate} disabled={!canSubmit || isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Simulating…
            </>
          ) : (
            'Simulate'
          )}
        </Button>
        {!result && !isPending && !error && (
          <p className="text-xs text-muted-foreground">
            Change term or premium and click Simulate to see your projection.
          </p>
        )}

        {/* Error */}
        {error && apiErrorMessage && (
          <Alert variant="destructive">
            <AlertTitle>Simulation failed</AlertTitle>
            <AlertDescription>{apiErrorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {result && !error && (
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Results</p>
            {result.hasPremiumGrowth ? (
              <>
                <p className="text-2xl font-semibold tabular-nums">
                  {formatCurrency(result.projectedValueAtMaturity, currencyCode)}
                  <span className="text-base font-normal text-muted-foreground ml-1">at maturity</span>
                </p>
                {result.yieldUsed != null && (
                  <p className="text-sm text-muted-foreground">
                    Projected yield (CAGR): {formatPercent(result.yieldUsed)}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-2xl font-semibold tabular-nums">
                  {formatCurrency(result.projectedValueAtMaturity, currencyCode)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total contributions over the term
                </p>
                <p className="text-xs text-muted-foreground">
                  This is the total cost of protection; no investment return is implied.
                </p>
              </>
            )}
            {result.hedgeGainIfEventAtYearX != null && result.hedgeGainIfEventAtYearX !== undefined && hedgeEventNum != null && (
              <p className="text-sm">
                If event at year {hedgeEventNum}: total benefit ≈ {formatCurrency(result.hedgeGainIfEventAtYearX, currencyCode)}
                <span className="block text-xs text-muted-foreground">Includes waiver / goal-completer benefit.</span>
              </p>
            )}
            {result.hasPremiumGrowth && result.maturityCapOrFloorApplied === 'cap' && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3 shrink-0" />
                This value is subject to a product cap (e.g. max multiple of premiums).
              </p>
            )}
            {result.hasPremiumGrowth && result.maturityCapOrFloorApplied === 'floor' && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3 shrink-0" />
                A minimum floor was applied to this projection.
              </p>
            )}

            {/* Total cost (premiums + fees) */}
            {(result.totalPremiumsOverTerm != null || result.totalEstimatedCharges != null) && (
              <div className="rounded-md border border-border/50 bg-muted/20 p-3 space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">Total cost over term</p>
                {result.totalPremiumsOverTerm != null && (
                  <p className="text-sm">
                    Total premiums: {formatCurrency(result.totalPremiumsOverTerm, currencyCode)}
                  </p>
                )}
                {result.totalEstimatedCharges != null && result.totalEstimatedCharges > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Estimated fees/charges: {formatCurrency(result.totalEstimatedCharges, currencyCode)}
                  </p>
                )}
                {result.allocationPctUsed != null && (
                  <p className="text-xs text-muted-foreground">
                    {result.allocationPctUsed}% to investment
                    {result.allocationPctUsed < 100 && `, ${100 - result.allocationPctUsed}% to charges`}
                  </p>
                )}
                {result.managementFeePctUsed != null && (
                  <p className="text-xs text-muted-foreground">
                    Management fee: {result.managementFeePctUsed}% p.a.
                  </p>
                )}
              </div>
            )}

            {/* Projection chart, crisis slider, and table */}
            {projectionTable.length > 0 && (
              <div className="space-y-4 pt-3 border-t border-border/50">
                <p className="text-sm font-medium text-muted-foreground">Projection over term</p>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projectionTable} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="year" tick={{ fontSize: 11 }} tickFormatter={(v) => `Year ${v}`} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${currencyCode} ${(v / 1000).toFixed(0)}k`} width={42} />
                      <RechartsTooltip
                        formatter={(value: number) => [formatCurrency(value, currencyCode), '']}
                        labelFormatter={(label) => `Year ${label}`}
                        contentStyle={{ fontSize: 12 }}
                      />
                      <Line type="monotone" dataKey="projectedValue" name="Projected value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="totalPremiumsPaid" name="Total premiums paid" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {hasHedgeColumn && (
                  <div className="space-y-2">
                    <Label className="text-xs">If event happens in year</Label>
                    <div className="flex flex-wrap items-center gap-3">
                      <Slider
                        min={1}
                        max={projectionTable.length}
                        step={1}
                        value={[crisisYearClamped]}
                        onValueChange={([v]) => setCrisisYear(v)}
                        className="w-32 max-w-[140px]"
                      />
                      <span className="text-sm font-medium tabular-nums">Year {crisisYearClamped}</span>
                      {selectedRow?.hedgeBenefitIfEventThisYear != null && (
                        <span className="text-sm text-muted-foreground">
                          Benefit if event this year: {formatCurrency(selectedRow.hedgeBenefitIfEventThisYear, currencyCode)}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  Tip: Open the year-by-year table below to see the full breakdown.
                </p>
                <Collapsible open={tableOpen} onOpenChange={setTableOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-between">
                      {tableOpen ? 'Hide year-by-year table' : 'View year-by-year table'}
                      {tableOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 overflow-x-auto rounded-md border">
                      <table className="w-full min-w-[500px] text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left p-2 font-medium">Policy year</th>
                            <th className="text-right p-2 font-medium">Total premiums paid</th>
                            <th className="text-right p-2 font-medium">Guaranteed cash value</th>
                            <th className="text-right p-2 font-medium">Projected value</th>
                            {hasChargesColumn && (
                              <th className="text-right p-2 font-medium">Charges to date</th>
                            )}
                            {hasHedgeColumn && (
                              <th className="text-right p-2 font-medium">Benefit if event this year</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {projectionTable.map((row) => (
                            <tr
                              key={row.year}
                              className={cn(
                                'border-b last:border-0',
                                row.year === crisisYearClamped && hasHedgeColumn && 'bg-primary/10'
                              )}
                            >
                              <td className="p-2 tabular-nums">{row.year}</td>
                              <td className="p-2 text-right tabular-nums">{formatCurrency(row.totalPremiumsPaid, currencyCode)}</td>
                              <td className="p-2 text-right tabular-nums">{formatCurrency(row.guaranteedCashValue, currencyCode)}</td>
                              <td className="p-2 text-right tabular-nums">{formatCurrency(row.projectedValue, currencyCode)}</td>
                              {hasChargesColumn && (
                                <td className="p-2 text-right tabular-nums">
                                  {row.estimatedChargesToDate != null
                                    ? formatCurrency(row.estimatedChargesToDate, currencyCode)
                                    : '—'}
                                </td>
                              )}
                              {hasHedgeColumn && (
                                <td className="p-2 text-right tabular-nums">
                                  {row.hedgeBenefitIfEventThisYear != null
                                    ? formatCurrency(row.hedgeBenefitIfEventThisYear, currencyCode)
                                    : '—'}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}

            <p className="text-xs text-muted-foreground pt-1 border-t border-border/50">
              {result.hasPremiumGrowth
                ? 'Projections are illustrative only and do not guarantee future performance. Get a quote from the insurer for actual terms.'
                : 'Get a quote from the insurer for actual terms and coverage details.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
