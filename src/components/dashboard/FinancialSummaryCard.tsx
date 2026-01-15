import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, Info } from 'lucide-react';
import { useFormatters } from '@/hooks/useFormatters';
import { useBankingFinancialSummary } from '@/hooks/useBankingProducts';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { EnhancedEmptyState } from '@/components/ui/enhanced-empty-state';
import { Wallet } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const FinancialSummaryCard: React.FC = () => {
  const { formatCurrency } = useFormatters();
  const { data: summary, isLoading, error } = useBankingFinancialSummary();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingState variant="compact" lines={3} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedEmptyState
            icon={Wallet}
            title="Unable to Load Summary"
            description="We couldn't load your financial summary. Check your connection and try again."
            variant="compact"
          />
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return null;
  }

  const isPositiveNetWorth = summary.netWorth >= 0;
  const hasHighDebtRatio = summary.debtToIncomeRatio && summary.debtToIncomeRatio > 40;
  const hasHighCreditUtilization = summary.creditUtilizationRatio && summary.creditUtilizationRatio > 30;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Summary
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="p-1 rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="About financial summary"
                >
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Your financial overview showing what you own (assets), what you owe (liabilities), and your net worth</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Assets Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-muted-foreground">What You Own</span>
            </div>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {formatCurrency(summary.totalAssets)}
            </span>
          </div>
          {summary.assetsBreakdown && (
            <div className="pl-6 text-xs text-muted-foreground space-y-1">
              {summary.assetsBreakdown.savings > 0 && (
                <div>Savings: {formatCurrency(summary.assetsBreakdown.savings)}</div>
              )}
              {summary.assetsBreakdown.fixedDeposits > 0 && (
                <div>Fixed Deposits: {formatCurrency(summary.assetsBreakdown.fixedDeposits)}</div>
              )}
            </div>
          )}
        </div>

        {/* Liabilities Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-muted-foreground">What You Owe</span>
            </div>
            <span className="text-lg font-bold text-red-600 dark:text-red-400">
              {formatCurrency(summary.totalLiabilities)}
            </span>
          </div>
          {summary.liabilitiesBreakdown && (
            <div className="pl-6 text-xs text-muted-foreground space-y-1">
              {summary.liabilitiesBreakdown.creditCardDebt > 0 && (
                <div>Credit Cards: {formatCurrency(summary.liabilitiesBreakdown.creditCardDebt)}</div>
              )}
              {summary.liabilitiesBreakdown.loanDebt > 0 && (
                <div>Loans: {formatCurrency(summary.liabilitiesBreakdown.loanDebt)}</div>
              )}
            </div>
          )}
        </div>

        {/* Net Worth */}
        <div className="pt-3 border-t space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Net Worth</span>
            <span className={`text-2xl font-bold ${isPositiveNetWorth ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(summary.netWorth)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {isPositiveNetWorth ? 'You have more assets than liabilities' : 'Your liabilities exceed your assets'}
          </div>
        </div>

        {/* Debt Ratios */}
        {(summary.debtToIncomeRatio !== undefined || summary.creditUtilizationRatio !== undefined) && (
          <div className="pt-3 border-t space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Debt Ratios
            </div>
            
            {summary.debtToIncomeRatio !== undefined && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Debt-to-Income</span>
                  <Badge variant={hasHighDebtRatio ? 'destructive' : 'secondary'}>
                    {summary.debtToIncomeRatio.toFixed(1)}%
                  </Badge>
                </div>
                {hasHighDebtRatio && (
                  <Alert variant="destructive" className="py-2">
                    <AlertTriangle className="h-3 w-3" />
                    <AlertDescription className="text-xs">
                      High debt-to-income ratio. Consider reducing debt or increasing income.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {summary.creditUtilizationRatio !== undefined && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Credit Utilization</span>
                  <Badge variant={hasHighCreditUtilization ? 'destructive' : 'secondary'}>
                    {summary.creditUtilizationRatio.toFixed(1)}%
                  </Badge>
                </div>
                {hasHighCreditUtilization && (
                  <Alert variant="destructive" className="py-2">
                    <AlertTriangle className="h-3 w-3" />
                    <AlertDescription className="text-xs">
                      High credit utilization. Try to keep it below 30% for better credit health.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

