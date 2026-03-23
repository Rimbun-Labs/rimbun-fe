import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFormatters } from '@/hooks/useFormatters';
import type { FinancialHealthMetrics } from '@/lib/api/types/bankInsights';

interface FinancialHealthSectionProps {
  data: FinancialHealthMetrics;
}

export const FinancialHealthSection: React.FC<FinancialHealthSectionProps> = ({ data }) => {
  const { formatCurrency, formatNumber } = useFormatters();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Health Metrics</CardTitle>
        <CardDescription>
          Customer financial wellness indicators
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Health Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Health Score</span>
            <span className="text-lg font-bold">{data.overallHealthScore.toFixed(1)}%</span>
          </div>
          <Progress value={data.overallHealthScore} className="h-2" />
        </div>

        {/* Savings Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Average Savings Rate</span>
            <span className="text-sm font-semibold">{data.averageSavingsRate.toFixed(1)}%</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Median: {data.medianSavingsRate.toFixed(1)}%
          </div>
        </div>

        {/* Emergency Fund */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Emergency Fund Adequacy</span>
            <span className="text-sm font-semibold">
              {data.averageEmergencyFundAdequacy.toFixed(1)} months
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-semibold text-red-600 dark:text-red-400">
                {formatNumber(data.emergencyFundDistribution.insufficient)}
              </div>
              <div className="text-muted-foreground">&lt; 3 months</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-yellow-600 dark:text-yellow-400">
                {formatNumber(data.emergencyFundDistribution.adequate)}
              </div>
              <div className="text-muted-foreground">3-6 months</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600 dark:text-green-400">
                {formatNumber(data.emergencyFundDistribution.optimal)}
              </div>
              <div className="text-muted-foreground">&gt; 6 months</div>
            </div>
          </div>
        </div>

        {/* Income Metrics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Income Distribution</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Average</span>
              <span className="text-xs font-medium">
                {formatCurrency(data.incomeMetrics.averageMonthlyIncome)}/mo
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Median</span>
              <span className="text-xs font-medium">
                {formatCurrency(data.incomeMetrics.medianMonthlyIncome)}/mo
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs mt-3">
            <div className="text-center">
              <div className="font-semibold">{formatNumber(data.incomeMetrics.incomeDistribution.low)}</div>
              <div className="text-muted-foreground">&lt; $4K/mo</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{formatNumber(data.incomeMetrics.incomeDistribution.medium)}</div>
              <div className="text-muted-foreground">$4K-$10K/mo</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{formatNumber(data.incomeMetrics.incomeDistribution.high)}</div>
              <div className="text-muted-foreground">&gt; $10K/mo</div>
            </div>
          </div>
        </div>

        {/* Spending Metrics */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Average Monthly Spending</span>
            <span className="text-sm font-semibold">
              {formatCurrency(data.averageMonthlySpending)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Median: {formatCurrency(data.medianMonthlySpending)}
          </div>
        </div>

        {/* Spending behavior (Phase 2) – from statements/categorization */}
        {data.spendingBehavior && (
          <div className="space-y-2 pt-4 border-t">
            <div className="text-sm font-medium">Spending behavior (from statements)</div>
            <div className="text-xs text-muted-foreground">
              Users with behavioral data: {formatNumber(data.spendingBehavior.usersWithBehavioralData)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Avg burn rate</span>
              <span className="text-sm font-semibold">
                {(data.spendingBehavior.averageBurnRate * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Median burn rate</span>
              <span className="text-sm font-medium">
                {(data.spendingBehavior.medianBurnRate * 100).toFixed(0)}%
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="font-semibold">{formatNumber(data.spendingBehavior.burnRateDistribution.low)}</div>
                <div className="text-muted-foreground">Low (&lt;60%)</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{formatNumber(data.spendingBehavior.burnRateDistribution.medium)}</div>
                <div className="text-muted-foreground">Medium (60–90%)</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{formatNumber(data.spendingBehavior.burnRateDistribution.high)}</div>
                <div className="text-muted-foreground">High (≥90%)</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground pt-1">
              Avg essential: {formatCurrency(data.spendingBehavior.averageEssentialMonthly)} ·{' '}
              discretionary: {formatCurrency(data.spendingBehavior.averageDiscretionaryMonthly)} ·{' '}
              debt: {formatCurrency(data.spendingBehavior.averageDebtMonthly)}
            </div>
          </div>
        )}

        {/* Statement-derived accounts (Phase 3) */}
        {data.statementAccountSummary && (
          <div className="space-y-2 pt-4 border-t">
            <div className="text-sm font-medium">Statement-derived accounts</div>
            <div className="text-xs text-muted-foreground">
              Users with statement data: {formatNumber(data.statementAccountSummary.usersWithStatementData)}
            </div>
            {data.statementAccountSummary.averageMonthlyFee != null && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Average monthly fee (from statements)</span>
                <span className="text-sm font-semibold">
                  {formatCurrency(data.statementAccountSummary.averageMonthlyFee)}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

