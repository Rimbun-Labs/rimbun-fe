import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, AlertCircle, ArrowRight, Target, PiggyBank, Shield } from "lucide-react";

interface GoalGapInsights {
  currentGap: number;
  requiredMonthlySavings: number;
  currentSavingsRate: number;
  timeAnalysis: {
    actualYears: number;        // This is the time to goal
    investmentHorizon: number;
    isRealistic: boolean;
    suggestedAdjustments?: {
      targetAmount?: number;
      monthlySavings?: number;
    };
  };
  goalAchievabilityScore: number;
  recommendations: {
    primaryAction: 'increase_savings' | 'adjust_strategy' | 'extend_timeline' | 'on_track';
    message: string;
    suggestedMonthlySavings?: number;
    suggestedStrategy?: 'more_aggressive' | 'more_conservative' | 'maintain';
  };
}

interface DirectInputsProps {
  inputs?: {
    age?: number;
    financialGoal?: string;
    monthlyIncome?: string;
    totalSavings?: string;
    targetAmount?: number;
    monthlyInvestable?: number;
    investmentHorizon?: number;
  };
  goalGapInsights?: GoalGapInsights;
  loading?: boolean;
}

const DirectInputs: React.FC<DirectInputsProps> = ({ inputs, goalGapInsights, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!inputs || Object.keys(inputs).length === 0) {
    return null;
  }

  const formatLabel = (key: string) => {
    return key
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatValue = (key: string, value: string | number) => {
    if (typeof value === 'number') {
      if (key.toLowerCase().includes('amount') || 
          key.toLowerCase().includes('savings') || 
          key.toLowerCase().includes('income') ||
          key.toLowerCase().includes('gap')) {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      }
      if (key.toLowerCase().includes('rate')) {
        return `${value}%`;
      }
      if (key.toLowerCase().includes('time') || key.toLowerCase().includes('horizon')) {
        return `${value} years`;
      }
      return value.toLocaleString();
    }
    return value;
  };

  const getActionColor = (action: GoalGapInsights['recommendations']['primaryAction']) => {
    switch (action) {
      case 'increase_savings':
        return 'text-yellow-600';
      case 'adjust_strategy':
        return 'text-blue-600';
      case 'extend_timeline':
        return 'text-orange-600';
      case 'on_track':
        return 'text-green-600';
      default:
        return 'text-foreground';
    }
  };

  const getGoalTypeLabel = (goal: string | undefined) => {
    if (!goal) return 'your goal';
    
    switch (goal.toLowerCase()) {
      case 'house': return 'a house';
      case 'retirement': return 'retirement';
      case 'education': return 'education';
      case 'wealth': return 'wealth building';
      default: return goal.toLowerCase();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Investment Profile</CardTitle>
        <CardDescription>Your assessment inputs and goal analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Goal Summary */}
          {inputs && goalGapInsights && (
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Your Goal Summary
              </h4>
              <p className="text-sm">
                You're investing for {getGoalTypeLabel(inputs.financialGoal)}, targeting {formatValue('amount', inputs.targetAmount || 0)} in {inputs.investmentHorizon || 0} years.
                With your current monthly income of {formatValue('income', inputs.monthlyIncome || '0')}, you're investing {formatValue('savings', inputs.monthlyInvestable || 0)} monthly.
              </p>
            </div>
          )}

          {/* Direct Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(inputs).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">
                  {formatLabel(key)}
                </h4>
                <p className="text-sm">
                  {formatValue(key, value)}
                </p>
              </div>
            ))}
          </div>

          {/* Goal Gap Insights */}
          {goalGapInsights && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Goal Gap Analysis</h3>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium text-muted-foreground">Current Gap</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 ml-1 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The difference between your current investments and target amount</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm">{formatValue('gap', goalGapInsights.currentGap)}</p>
                </div>
              </div>

              {/* Goal Achievability Score */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium text-muted-foreground">Goal Achievability Score</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 ml-1 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Based on your investment progress, timeline, and market conditions</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-sm font-medium">{goalGapInsights.goalAchievabilityScore}/100</span>
                </div>
                <Progress value={goalGapInsights.goalAchievabilityScore} className="h-2" />
              </div>

              {/* Analysis and Recommendations */}
              <div className="space-y-4">
                {/* Timeline and Investment Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Timeline Analysis */}
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Timeline Analysis
                    </h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Time to Goal</span>
                        <span>{formatValue('time', goalGapInsights.timeAnalysis.actualYears)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Investment Horizon</span>
                        <span>{formatValue('time', goalGapInsights.timeAnalysis.investmentHorizon)}</span>
                      </div>
                      {!goalGapInsights.timeAnalysis.isRealistic && (
                        <div className="text-sm text-yellow-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Exceeds your investment horizon by {goalGapInsights.timeAnalysis.actualYears - goalGapInsights.timeAnalysis.investmentHorizon} years
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Investment Analysis */}
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center">
                      <PiggyBank className="w-4 h-4 mr-2" />
                      Investment Analysis
                    </h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Current Monthly Investment</span>
                        <span>{formatValue('savings', inputs.monthlyInvestable || 0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Required Monthly Investment</span>
                        <span>{formatValue('savings', goalGapInsights.requiredMonthlySavings)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        You're currently investing {Math.round(((inputs.monthlyInvestable || 0) / goalGapInsights.requiredMonthlySavings) * 100)}% of what's needed
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommended Actions */}
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Recommended Actions</h5>
                  <div className="space-y-3">
                    {goalGapInsights.timeAnalysis.suggestedAdjustments?.targetAmount && (
                      <div className="flex items-start">
                        <span className="mr-2 text-blue-600 font-medium">1.</span>
                        <div>
                          <p className="text-sm font-medium">Adjust Target Amount (Recommended First)</p>
                          <p className="text-sm text-muted-foreground">
                            Reduce your target to {formatValue('amount', goalGapInsights.timeAnalysis.suggestedAdjustments.targetAmount)} to reach your goal within {goalGapInsights.timeAnalysis.investmentHorizon} years
                          </p>
                        </div>
                      </div>
                    )}
                    {goalGapInsights.timeAnalysis.suggestedAdjustments?.monthlySavings && (
                      <div className="flex items-start">
                        <span className="mr-2 text-blue-600 font-medium">2.</span>
                        <div>
                          <p className="text-sm font-medium">Increase Monthly Investment</p>
                          <p className="text-sm text-muted-foreground">
                            Invest {formatValue('savings', goalGapInsights.timeAnalysis.suggestedAdjustments.monthlySavings)} monthly to reach your goal within {goalGapInsights.timeAnalysis.investmentHorizon} years
                          </p>
                        </div>
                      </div>
                    )}
                    {goalGapInsights.recommendations.suggestedStrategy && (
                      <div className="flex items-start">
                        <span className="mr-2 text-blue-600 font-medium">3.</span>
                        <div>
                          <p className="text-sm font-medium">Investment Strategy</p>
                          <p className="text-sm text-muted-foreground">
                            Adopt a {goalGapInsights.recommendations.suggestedStrategy.replace('_', ' ')} approach to better manage market risks
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Risk Considerations */}
                <div className="p-4 border rounded-lg bg-yellow-50">
                  <h5 className="font-medium mb-2 text-yellow-800 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Risk Considerations
                  </h5>
                  <div className="space-y-2 text-sm text-yellow-700">
                    <p>• Market volatility may affect your returns of 13.8% annually</p>
                    <p>• Your current investment rate may not be sufficient for your timeline</p>
                    <p>• Consider adjusting your risk tolerance to match your goals</p>
                  </div>
                </div>

                {/* What's Next */}
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h5 className="font-medium mb-2 text-blue-800">What's Next</h5>
                  <div className="space-y-2 text-sm text-blue-700">
                    <p>1. Review and adjust your target amount based on the recommendation</p>
                    <p>2. Update your monthly investment plan</p>
                    <p>3. Review your investment strategy with a financial advisor</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DirectInputs; 