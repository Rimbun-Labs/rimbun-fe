import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, ArrowUp, ArrowDown } from "lucide-react";
import { useFormatters } from '@/hooks/useFormatters';
import { SpendingScenario } from './SpendingScenarioSimulator';
import { DataQualityMetrics } from '@/utils/dataQuality';
import DataQualityIndicator from './DataQualityIndicator';

interface SpendingImpactCardsProps {
  current: {
    savingsRate: number;
    emergencyFundCurrent: number;
    emergencyFundTarget: number;
    investmentMonthly: number;
    monthlySpending: number;
    monthlyIncome: number;
  };
  scenario: SpendingScenario & {
    savingsRate: number;
    emergencyFundMonthly: number;
    investmentMonthly: number;
  };
  dataQuality?: DataQualityMetrics | null;
}

/**
 * Component to display before/after comparison of spending scenario
 * 
 * Shows side-by-side comparison of:
 * - Savings rate
 * - Emergency fund timeline
 * - Investment allocation
 * - Monthly spending
 */
const SpendingImpactCards: React.FC<SpendingImpactCardsProps> = ({
  current,
  scenario,
  dataQuality,
}) => {
  const { formatCurrency, formatPercentage } = useFormatters();

  // Calculate current emergency fund months
  const currentEmergencyFundMonths = current.monthlySpending > 0 
    ? current.emergencyFundCurrent / current.monthlySpending 
    : 0;

  // Calculate scenario emergency fund months (current + projected growth)
  // For simplicity, we'll calculate months to reach target, or current coverage if already met
  const scenarioEmergencyFundMonths = scenario.adjustedSpending > 0 && scenario.emergencyFundMonthly > 0
    ? (() => {
        const target = current.emergencyFundTarget || (scenario.adjustedSpending * 6);
        const monthsToTarget = Math.ceil((target - current.emergencyFundCurrent) / scenario.emergencyFundMonthly);
        // If already at target, show current coverage
        if (current.emergencyFundCurrent >= target) {
          return current.emergencyFundCurrent / scenario.adjustedSpending;
        }
        // Otherwise show projected months to reach target
        return monthsToTarget > 0 ? monthsToTarget : 0;
      })()
    : currentEmergencyFundMonths;

  // Calculate changes
  const savingsRateChange = scenario.savingsRate - current.savingsRate;
  const emergencyFundChange = scenarioEmergencyFundMonths - currentEmergencyFundMonths;
  const investmentChange = scenario.investmentMonthly - current.investmentMonthly;
  const spendingChange = scenario.adjustedSpending - current.monthlySpending;

  // Get change indicators
  const getChangeIndicator = (change: number, isPositive: boolean) => {
    if (change === 0) {
      return {
        icon: Minus,
        color: 'text-muted-foreground',
        bgColor: 'bg-muted',
        label: 'No change'
      };
    }
    
    const isGood = isPositive ? change > 0 : change < 0;
    
    return {
      icon: isGood ? ArrowUp : ArrowDown,
      color: isGood ? 'text-green-600' : 'text-red-600',
      bgColor: isGood ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20',
      label: isGood ? 'Improved' : 'Worse'
    };
  };

  const savingsRateIndicator = getChangeIndicator(savingsRateChange, true);
  const emergencyFundIndicator = getChangeIndicator(emergencyFundChange, true);
  const investmentIndicator = getChangeIndicator(investmentChange, true);
  const spendingIndicator = getChangeIndicator(spendingChange, false); // Lower spending is better

  const SavingsIcon = savingsRateIndicator.icon;
  const EmergencyIcon = emergencyFundIndicator.icon;
  const InvestmentIcon = investmentIndicator.icon;
  const SpendingIcon = spendingIndicator.icon;

  return (
    <div className="space-y-6">
      {/* Data Quality Indicator */}
      {dataQuality && (
        <div className="flex justify-end">
          <DataQualityIndicator quality={dataQuality} />
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current State Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current State</CardTitle>
          </CardHeader>
        <CardContent className="space-y-4">
          {/* Savings Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Savings Rate</span>
              <span className="text-lg font-bold">{formatPercentage(current.savingsRate)}</span>
            </div>
          </div>

          {/* Emergency Fund */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Emergency Fund Coverage</span>
              <span className="text-lg font-bold">
                {currentEmergencyFundMonths > 0 
                  ? `${currentEmergencyFundMonths.toFixed(1)} months`
                  : 'Not funded'
                }
              </span>
            </div>
          </div>

          {/* Investment */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monthly Investment</span>
              <span className="text-lg font-bold">{formatCurrency(current.investmentMonthly)}</span>
            </div>
          </div>

          {/* Monthly Spending */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monthly Spending</span>
              <span className="text-lg font-bold">{formatCurrency(current.monthlySpending)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scenario State Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Scenario State</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Savings Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Savings Rate</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{formatPercentage(scenario.savingsRate)}</span>
                {savingsRateChange !== 0 && (
                  <Badge className={`${savingsRateIndicator.bgColor} ${savingsRateIndicator.color} border-0`}>
                    <SavingsIcon className="h-3 w-3 mr-1" />
                    {savingsRateChange > 0 ? '+' : ''}{formatPercentage(savingsRateChange)}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Fund */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Emergency Fund Coverage</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">
                  {scenarioEmergencyFundMonths > 0 
                    ? `${scenarioEmergencyFundMonths.toFixed(1)} months`
                    : 'Not funded'
                  }
                </span>
                {emergencyFundChange !== 0 && (
                  <Badge className={`${emergencyFundIndicator.bgColor} ${emergencyFundIndicator.color} border-0`}>
                    <EmergencyIcon className="h-3 w-3 mr-1" />
                    {emergencyFundChange > 0 ? '+' : ''}{emergencyFundChange.toFixed(1)}mo
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Investment */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monthly Investment</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{formatCurrency(scenario.investmentMonthly)}</span>
                {investmentChange !== 0 && (
                  <Badge className={`${investmentIndicator.bgColor} ${investmentIndicator.color} border-0`}>
                    <InvestmentIcon className="h-3 w-3 mr-1" />
                    {investmentChange > 0 ? '+' : ''}{formatCurrency(investmentChange)}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Monthly Spending */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monthly Spending</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{formatCurrency(scenario.adjustedSpending)}</span>
                {spendingChange !== 0 && (
                  <Badge className={`${spendingIndicator.bgColor} ${spendingIndicator.color} border-0`}>
                    <SpendingIcon className="h-3 w-3 mr-1" />
                    {spendingChange > 0 ? '+' : ''}{formatCurrency(spendingChange)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default SpendingImpactCards;

