import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { DollarSign, TrendingUp, Shield, Target } from "lucide-react";
import { useFormatters } from '@/hooks/useFormatters';

/**
 * Spending scenario configuration
 */
export interface SpendingScenario {
  adjustedSpending: number;
  emergencyFundAllocation: number; // dollar amount per month
  investmentAllocation: number; // dollar amount per month
}

interface SpendingScenarioSimulatorProps {
  monthlyIncome: number;
  monthlySpending: number;
  onScenarioChange?: (scenario: SpendingScenario) => void;
}

/**
 * Interactive component for simulating spending adjustments and allocations
 * 
 * Allows users to:
 * - Adjust monthly spending (reduce by amount)
 * - Allocate savings to emergency fund (dollar amount)
 * - Allocate savings to investment (dollar amount)
 * 
 * Calculates and displays:
 * - Adjusted savings rate
 * - Emergency fund monthly contribution
 * - Investment monthly contribution
 * - Remaining unallocated savings
 */
const SpendingScenarioSimulator: React.FC<SpendingScenarioSimulatorProps> = ({
  monthlyIncome,
  monthlySpending,
  onScenarioChange,
}) => {
  const { formatCurrency, formatPercentage } = useFormatters();

  // Scenario state
  const [spendingReduction, setSpendingReduction] = useState(0);
  const [emergencyFundAllocation, setEmergencyFundAllocation] = useState(0); // dollar amount
  const [investmentAllocation, setInvestmentAllocation] = useState(0); // dollar amount
  
  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate derived values (memoized for performance)
  const adjustedSpending = useMemo(() => monthlySpending - spendingReduction, [monthlySpending, spendingReduction]);
  const savings = useMemo(() => monthlyIncome - adjustedSpending, [monthlyIncome, adjustedSpending]);
  const savingsRate = useMemo(() => monthlyIncome > 0 ? (savings / monthlyIncome) * 100 : 0, [savings, monthlyIncome]);
  
  // Cap allocations when savings decrease
  useEffect(() => {
    if (emergencyFundAllocation > savings) {
      setEmergencyFundAllocation(Math.max(0, savings));
    }
    if (investmentAllocation > savings) {
      setInvestmentAllocation(Math.max(0, savings));
    }
  }, [savings, emergencyFundAllocation, investmentAllocation]);
  
  // Allocations are now direct dollar amounts (capped at available savings)
  const emergencyFundMonthly = useMemo(() => Math.min(emergencyFundAllocation, savings), [emergencyFundAllocation, savings]);
  const investmentMonthly = useMemo(() => Math.min(investmentAllocation, savings), [investmentAllocation, savings]);
  const totalAllocated = useMemo(() => emergencyFundMonthly + investmentMonthly, [emergencyFundMonthly, investmentMonthly]);
  const remainingSavings = useMemo(() => savings - totalAllocated, [savings, totalAllocated]);

  // Create scenario object (memoized) - store actual dollar amounts
  const scenario: SpendingScenario = useMemo(() => ({
    adjustedSpending,
    emergencyFundAllocation: emergencyFundMonthly,
    investmentAllocation: investmentMonthly,
  }), [adjustedSpending, emergencyFundMonthly, investmentMonthly]);

  // Debounced callback to notify parent (500ms delay like goals simulator)
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Don't notify if no changes
    if (spendingReduction === 0 && emergencyFundAllocation === 0 && investmentAllocation === 0) {
      return;
    }

    // Debounce callback by 500ms
    debounceTimerRef.current = setTimeout(() => {
      if (onScenarioChange) {
        onScenarioChange(scenario);
      }
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [scenario, onScenarioChange, spendingReduction, emergencyFundAllocation, investmentAllocation]);

  const handleReset = () => {
    setSpendingReduction(0);
    setEmergencyFundAllocation(0);
    setInvestmentAllocation(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Target className="h-5 w-5" />
          Scenario Simulator
        </CardTitle>
        <CardDescription>
          Adjust your spending and see how it affects your savings and allocations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Spending Reduction Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="spending-reduction" className="text-base font-medium">
              Monthly Spending Reduction
            </Label>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">
                {formatCurrency(spendingReduction)}
              </div>
              <div className="text-xs text-muted-foreground">
                New spending: {formatCurrency(adjustedSpending)}
              </div>
            </div>
          </div>
          <Slider
            id="spending-reduction"
            min={0}
            max={monthlySpending}
            step={50}
            value={[spendingReduction]}
            onValueChange={(value) => setSpendingReduction(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>No reduction</span>
            <span>{formatCurrency(monthlySpending)}</span>
          </div>
        </div>

        {/* Available Savings Display */}
        <div className="p-3 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Available Savings</span>
            <span className="text-lg font-bold text-primary">{formatCurrency(savings)}/month</span>
          </div>
        </div>

        {/* Emergency Fund Allocation Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="emergency-fund" className="text-base font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Emergency Fund Allocation
            </Label>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(emergencyFundAllocation)}
              </div>
              <div className="text-xs text-muted-foreground">
                {savings > 0 ? formatPercentage((emergencyFundAllocation / savings) * 100) : '0%'} of savings
              </div>
            </div>
          </div>
          <Slider
            id="emergency-fund"
            min={0}
            max={Math.max(savings, 0)}
            step={50}
            value={[emergencyFundAllocation]}
            onValueChange={(value) => setEmergencyFundAllocation(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>{formatCurrency(savings)}</span>
          </div>
        </div>

        {/* Investment Allocation Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="investment" className="text-base font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Investment Allocation
            </Label>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">
                {formatCurrency(investmentAllocation)}
              </div>
              <div className="text-xs text-muted-foreground">
                {savings > 0 ? formatPercentage((investmentAllocation / savings) * 100) : '0%'} of savings
              </div>
            </div>
          </div>
          <Slider
            id="investment"
            min={0}
            max={Math.max(savings, 0)}
            step={50}
            value={[investmentAllocation]}
            onValueChange={(value) => setInvestmentAllocation(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>{formatCurrency(savings)}</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Adjusted Savings Rate</p>
            <p className="text-2xl font-bold">{formatPercentage(savingsRate)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Remaining Savings</p>
            <p className={`text-2xl font-bold ${remainingSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(remainingSavings)}
            </p>
          </div>
        </div>

        {/* Reset Button */}
        {(spendingReduction > 0 || emergencyFundAllocation > 0 || investmentAllocation > 0) && (
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full"
          >
            Reset Scenario
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingScenarioSimulator;

