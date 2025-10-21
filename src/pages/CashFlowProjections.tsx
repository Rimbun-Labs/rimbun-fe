import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  RefreshCw, 
  Target, 
  DollarSign, 
  Calendar,
  BarChart3,
  PieChart
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/lib/api/userService';
import { useCashFlowProjections, useRefreshCashFlowProjections } from '@/hooks/useCashFlowData';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CashFlowProjectionsDto, MonthlyProjectionDto } from '@/lib/api/cashFlowApi';
import { useFormatters } from '@/hooks/useFormatters';

const CashFlowProjectionsPage: React.FC = () => {
  const { user } = useAuth();
  const userId = userService.getDatabaseUserId();
  const [selectedScenario, setSelectedScenario] = useState<'conservative' | 'realistic' | 'optimistic'>('realistic');

  const { data: cashFlowData, isLoading, error } = useCashFlowProjections(userId);
  const refreshMutation = useRefreshCashFlowProjections(userId);
  const { formatCurrency, formatPercentage } = useFormatters();
  
  // Monthly return is sent as dollar amount, not percentage
  const formatMonthlyReturn = (value: number) => {
    return formatCurrency(value);
  };

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  if (isLoading) {
    return <LoadingState variant="expanded" lines={3} />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load cash flow projections. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!cashFlowData || cashFlowData.message) {
    return (
      <div className="w-full py-8" style={{ marginLeft: '-2rem', marginRight: '-2rem', width: 'calc(100vw - 256px)' }}>
        <div className="px-8 ml-8">
          <div className="space-y-8">
            {/* Page Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Cash Flow Projections</h1>
              </div>
              <p className="text-muted-foreground text-lg">
                5-year financial outlook based on your goals
              </p>
            </div>

            {/* Empty State */}
            <Card>
              <CardContent className="text-center py-12">
                <Target className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4">Complete Your Financial Assessment</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Get personalized 5-year cash flow projections based on your financial goals and investment strategy.
                </p>
                <Button size="lg" onClick={() => window.location.href = '/assessment'}>
                  Complete Assessment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const { cashFlowProjections, assessment } = cashFlowData;
  const { scenarios } = cashFlowProjections;
  const selectedScenarioData = scenarios[selectedScenario];

  return (
    <div className="w-full py-8" style={{ marginLeft: '-2rem', marginRight: '-2rem', width: 'calc(100vw - 256px)' }}>
      <div className="px-8 ml-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Cash Flow Projections</h1>
              </div>
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={refreshMutation.isPending}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
            </div>
            <p className="text-muted-foreground text-lg">
              5-year financial outlook based on your goals
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Analysis (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Scenario Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Scenario Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(['conservative', 'realistic', 'optimistic'] as const).map((scenario) => {
                      const data = scenarios[scenario];
                      const isSelected = selectedScenario === scenario;
                      
                      return (
                        <div
                          key={scenario}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setSelectedScenario(scenario)}
                        >
                          <div className="text-center">
                            <h3 className="font-medium capitalize mb-2">{scenario}</h3>
                            <p className="text-xl font-bold mb-2">{formatCurrency(data.finalValue)}</p>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <p>Goal Achieved: {data.goalAchieved ? 'Yes' : 'No'}</p>
                              <p>Months to Goal: {data.monthsToGoal}</p>
                              <p>Avg Return: {formatPercentage(data.averageMonthlyReturn)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Analysis Tabs */}
              <Tabs defaultValue="timeline" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="timeline" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Timeline
                  </TabsTrigger>
                  <TabsTrigger value="breakdown" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Breakdown
                  </TabsTrigger>
                  <TabsTrigger value="goals" className="flex items-center gap-2">
                    <PieChart className="h-4 w-4" />
                    Goals
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="timeline">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        {selectedScenario.charAt(0).toUpperCase() + selectedScenario.slice(1)} Scenario Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedScenarioData.monthlyProjections
                          .filter((_, index) => index % 6 === 0) // Show every 6 months
                          .map((projection, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center gap-4">
                                <div className="text-center">
                                  <p className="text-sm font-medium">{projection.month}/{projection.year}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">
                                    Net Worth: <span className="font-bold">{formatCurrency(projection.totalNetWorth)}</span>
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Goal Progress: <span className="font-bold">{projection.goalProgress.toFixed(1)}%</span>
                                  </p>
                                </div>
                              </div>
                              <div className="text-right space-y-1">
                                <p className="text-sm text-muted-foreground">
                                  Monthly Return: <span className="font-bold">{formatMonthlyReturn(projection.monthlyReturn)}</span>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Savings: <span className="font-bold">{formatCurrency(projection.savings)}</span>
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="breakdown">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Monthly Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedScenarioData.monthlyProjections.slice(0, 12).map((projection, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-primary" />
                              <div>
                                <h4 className="font-medium text-sm text-muted-foreground">{projection.month}/{projection.year}</h4>
                                <p className="text-xs text-muted-foreground">Income: {formatCurrency(projection.income)}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold">Spending: {formatCurrency(projection.spending)}</p>
                              <p className="text-xs text-muted-foreground">Savings: {formatCurrency(projection.savings)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="goals">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Goal Achievement Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Goal Status */}
                      <div className="text-center">
                        <Badge 
                          className={`text-lg px-4 py-2 ${
                            selectedScenarioData.goalAchieved 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          {selectedScenarioData.goalAchieved 
                            ? 'Goal Achieved!' 
                            : `${selectedScenarioData.monthsToGoal} months to goal`
                          }
                        </Badge>
                      </div>

                      {/* Goal Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Target Amount</h4>
                          <p className="text-2xl font-bold">{formatCurrency(assessment.targetAmount)}</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Final Value</h4>
                          <p className="text-2xl font-bold">{formatCurrency(selectedScenarioData.finalValue)}</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Total Savings</h4>
                          <p className="text-2xl font-bold">{formatCurrency(selectedScenarioData.totalSavings)}</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Average Return</h4>
                          <p className="text-2xl font-bold">{formatPercentage(selectedScenarioData.averageMonthlyReturn)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Summary & Actions (1/3 width) */}
            <div className="space-y-6">
              {/* Goal Progress Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Goal Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">
                      {selectedScenarioData.goalAchieved ? '100%' : `${((selectedScenarioData.finalValue / assessment.targetAmount) * 100).toFixed(1)}%`}
                    </div>
                    <p className="text-sm text-muted-foreground">Goal Achievement</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Current Value</span>
                      <span className="font-medium">{formatCurrency(selectedScenarioData.finalValue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Target Amount</span>
                      <span className="font-medium">{formatCurrency(assessment.targetAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Time to Goal</span>
                      <span className="font-medium">{selectedScenarioData.monthsToGoal} months</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Scenario Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Comparison</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(['conservative', 'realistic', 'optimistic'] as const).map((scenario) => {
                    const data = scenarios[scenario];
                    const isSelected = selectedScenario === scenario;
                    
                    return (
                      <div
                        key={scenario}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedScenario(scenario)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium capitalize">{scenario}</span>
                          <span className="text-sm font-bold">{formatCurrency(data.finalValue)}</span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Monthly Income</span>
                      <span className="font-medium">{formatCurrency(assessment.monthlyIncome)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly Spending</span>
                      <span className="font-medium">{formatCurrency(cashFlowData.monthlySpending)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly Savings</span>
                      <span className="font-medium">{formatCurrency(assessment.monthlyIncome - cashFlowData.monthlySpending)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg Monthly Return</span>
                      <span className="font-medium">{formatPercentage(selectedScenarioData.averageMonthlyReturn)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashFlowProjectionsPage;