import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, RefreshCw, Target, DollarSign } from "lucide-react";
import { CashFlowProjectionsDto } from '@/lib/api/cashFlowApi';
import { useFormatters } from '@/hooks/useFormatters';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';

interface CashFlowSummaryProps {
  data: CashFlowProjectionsDto | undefined;
  loading: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const CashFlowSummary: React.FC<CashFlowSummaryProps> = ({ 
  data, 
  loading, 
  onRefresh, 
  isRefreshing 
}) => {
  const { formatCurrency, formatPercentage } = useFormatters();

  if (loading) {
    return <LoadingState message="Loading cash flow projections..." />;
  }

  if (!data || data.message) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Cash Flow Projections (5 Years)
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">Complete your financial assessment</p>
          <p className="text-sm text-muted-foreground">
            Get personalized 5-year cash flow projections based on your goals
          </p>
          <Button className="mt-4" onClick={() => window.location.href = '/assessment'}>
            Complete Assessment
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { cashFlowProjections, assessment } = data;
  const { scenarios } = cashFlowProjections;
  const { realistic } = scenarios;

  // Calculate goal progress
  const currentValue = realistic.monthlyProjections[0]?.totalNetWorth || 0;
  const targetValue = assessment.targetAmount;
  const goalProgress = targetValue > 0 ? Math.min((currentValue / targetValue) * 100, 100) : 0;

  // Get final values for each scenario
  const conservativeFinal = scenarios.conservative.finalValue;
  const realisticFinal = scenarios.realistic.finalValue;
  const optimisticFinal = scenarios.optimistic.finalValue;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Cash Flow Projections (5 Years)
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Goal Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Goal Progress</span>
            <span className="text-sm font-bold">{goalProgress.toFixed(1)}%</span>
          </div>
          <Progress value={goalProgress} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatCurrency(currentValue)}</span>
            <span>{formatCurrency(targetValue)}</span>
          </div>
        </div>

        {/* Scenario Summary */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Projected Final Values</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 border rounded-lg">
              <h5 className="text-xs text-muted-foreground mb-1">Conservative</h5>
              <p className="text-sm font-bold">{formatCurrency(conservativeFinal)}</p>
            </div>
            <div className="text-center p-3 border rounded-lg bg-primary/5">
              <h5 className="text-xs text-primary mb-1">Realistic</h5>
              <p className="text-sm font-bold text-primary">{formatCurrency(realisticFinal)}</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <h5 className="text-xs text-muted-foreground mb-1">Optimistic</h5>
              <p className="text-sm font-bold">{formatCurrency(optimisticFinal)}</p>
            </div>
          </div>
        </div>

        {/* Goal Achievement Status */}
        <div className="flex items-center justify-center">
          <Badge 
            className={`text-sm px-3 py-1 ${
              realistic.goalAchieved 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            <DollarSign className="h-3 w-3 mr-1" />
            {realistic.goalAchieved 
              ? 'Goal Achieved!' 
              : `${realistic.monthsToGoal} months to goal`
            }
          </Badge>
        </div>

        {/* View Details Button */}
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/cash-flow-projections'}
            className="w-full"
          >
            View Detailed Projections
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashFlowSummary;
