import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, ArrowRight, Target, PiggyBank, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface InvestmentScenario {
  name: string;
  baseAmount: number;
  monthlyContribution: number;
  projectedAmount: number;
  timeToGoal: number;
  isRealistic: boolean;
  requiredMonthlySavings?: number;
  currentSavingsRate?: number;
}

interface InvestmentScenariosProps {
  scenarios: {
    conservative: InvestmentScenario;
    aggressive: InvestmentScenario;
  };
  targetAmount: number;
  investmentHorizon: number;
  loading?: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatYears = (value: number) => {
  return `${value.toFixed(1)} years`;
};

const InvestmentScenarios: React.FC<InvestmentScenariosProps> = ({
  scenarios,
  targetAmount,
  investmentHorizon,
  loading = false
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-slate-200 animate-pulse rounded" />
          <div className="h-4 w-64 bg-slate-200 animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getScenarioColor = (scenario: InvestmentScenario) => {
    if (!scenario.isRealistic) return 'text-red-600';
    if (scenario.timeToGoal <= investmentHorizon) return 'text-emerald-600';
    return 'text-yellow-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Investment Scenarios</CardTitle>
        <CardDescription className="text-muted-foreground card-description">
          Compare different approaches to reach your goal of {formatCurrency(targetAmount)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Conservative Scenario */}
          <div className="p-4 border rounded-lg dark:border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-medium text-foreground">Conservative Plan</h3>
              </div>
              <Badge variant="outline" className={cn(
                "bg-blue-50 dark:bg-blue-900/30",
                "text-blue-700 dark:text-blue-200",
                getScenarioColor(scenarios.conservative)
              )}>
                {scenarios.conservative.isRealistic ? 'Achievable' : 'Challenging'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground form-label-secondary">Initial Investment</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground tooltip-icon" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your current savings for this goal</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="font-medium">{formatCurrency(scenarios.conservative.baseAmount)}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground form-label-secondary">Monthly Investment</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground tooltip-icon" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your current monthly investment amount</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="font-medium">{formatCurrency(scenarios.conservative.monthlyContribution)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Time to Goal</span>
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    getScenarioColor(scenarios.conservative)
                  )}>
                    {formatYears(scenarios.conservative.timeToGoal)}
                  </span>
                </div>
                <Progress 
                  value={(scenarios.conservative.timeToGoal / investmentHorizon) * 100} 
                  className="h-2"
                />
                {!scenarios.conservative.isRealistic && (
                  <p className="text-sm text-red-600 mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Exceeds your investment horizon by {formatYears(scenarios.conservative.timeToGoal - investmentHorizon)}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Projected Amount</span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatCurrency(scenarios.conservative.projectedAmount)}
                  </span>
                </div>
                <Progress 
                  value={(scenarios.conservative.projectedAmount / targetAmount) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          </div>

          {/* Aggressive Scenario */}
          <div className="p-4 border rounded-lg dark:border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <h3 className="font-medium text-foreground">Aggressive Plan</h3>
              </div>
              <Badge variant="outline" className={cn(
                "bg-orange-50 dark:bg-orange-900/30",
                "text-orange-700 dark:text-orange-200",
                getScenarioColor(scenarios.aggressive)
              )}>
                {scenarios.aggressive.isRealistic ? 'Achievable' : 'Challenging'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground form-label-secondary">Total Savings</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground tooltip-icon" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Includes all your savings for this goal</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="font-medium">{formatCurrency(scenarios.aggressive.baseAmount)}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground form-label-secondary">Monthly Investment</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground tooltip-icon" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your current monthly investment amount</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="font-medium">{formatCurrency(scenarios.aggressive.monthlyContribution)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Time to Goal</span>
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    getScenarioColor(scenarios.aggressive)
                  )}>
                    {formatYears(scenarios.aggressive.timeToGoal)}
                  </span>
                </div>
                <Progress 
                  value={(scenarios.aggressive.timeToGoal / investmentHorizon) * 100} 
                  className="h-2"
                />
                {!scenarios.aggressive.isRealistic && (
                  <p className="text-sm text-red-600 mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Exceeds your investment horizon by {formatYears(scenarios.aggressive.timeToGoal - investmentHorizon)}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Projected Amount</span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatCurrency(scenarios.aggressive.projectedAmount)}
                  </span>
                </div>
                <Progress 
                  value={(scenarios.aggressive.projectedAmount / targetAmount) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          </div>

          {/* Comparison Summary */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-medium mb-2">Key Differences</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 text-slate-400" />
                <span>
                  <strong>Conservative Plan</strong> uses your initial investment and investment rate
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 text-slate-400" />
                <span>
                  <strong>Aggressive Plan</strong> includes your savings and intial investment for this goal
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 text-slate-400" />
                <span>
                  Time difference: {formatYears(Math.abs(scenarios.aggressive.timeToGoal - scenarios.conservative.timeToGoal))}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentScenarios; 