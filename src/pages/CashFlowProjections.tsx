import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  RefreshCw, 
  Target, 
  DollarSign, 
  Calendar,
  BarChart3,
  PieChart,
  Info
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/lib/api/userService';
import { useCashFlowProjections, useRefreshCashFlowProjections } from '@/hooks/useCashFlowData';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CashFlowProjectionsDto, MonthlyProjectionDto } from '@/lib/api/cashFlowApi';
import { useFormatters } from '@/hooks/useFormatters';
import { useTheme } from '@/hooks/useTheme';

const CashFlowProjectionsPage: React.FC = () => {
  const { user } = useAuth();
  const userId = userService.getDatabaseUserId();
  const [selectedScenario, setSelectedScenario] = useState<'conservative' | 'realistic' | 'optimistic'>('realistic');
  const [timelinePeriod, setTimelinePeriod] = useState<'1Y' | '3Y' | '5Y'>('5Y');
  const [breakdownPeriod, setBreakdownPeriod] = useState<'12M' | '24M' | 'All'>('12M');

  const { data: cashFlowData, isLoading, error } = useCashFlowProjections(userId);
  const refreshMutation = useRefreshCashFlowProjections(userId);
  const { formatCurrency, formatPercentage } = useFormatters();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Extract data safely (before early returns)
  const selectedScenarioData = cashFlowData?.cashFlowProjections?.scenarios?.[selectedScenario];
  
  // Timeline data is now used directly from monthlyProjections, no need for separate processing

  // Prepare breakdown chart data - MUST be called before any early returns
  const breakdownChartData = useMemo(() => {
    if (!selectedScenarioData?.monthlyProjections) return [];
    
    const monthsToShow = breakdownPeriod === '12M' ? 12 : breakdownPeriod === '24M' ? 24 : 60;
    const filtered = selectedScenarioData.monthlyProjections.slice(0, monthsToShow);
    
    return filtered.map((proj) => {
      const date = new Date(proj.year, proj.month - 1);
      const monthName = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getFullYear();
      
      return {
        month: proj.month,
        year: proj.year,
        label: `${monthName} ${year}`,
        income: proj.income,
        spending: proj.spending,
        savings: proj.savings,
        net: proj.income - proj.spending,
        fullDate: `${year}-${String(proj.month).padStart(2, '0')}`,
      };
    });
  }, [selectedScenarioData, breakdownPeriod]);

  // Milestones no longer needed for list view
  
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
                          <div className="flex justify-between items-center">
                            <span className="font-medium capitalize">{scenario}</span>
                            <span className="text-sm font-bold">{formatCurrency(data.finalValue)}</span>
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
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          {selectedScenario.charAt(0).toUpperCase() + selectedScenario.slice(1)} Scenario Timeline
                        </CardTitle>
                        <div className="flex gap-2">
                          {(['1Y', '3Y', '5Y'] as const).map((period) => (
                            <Button
                              key={period}
                              variant={timelinePeriod === period ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setTimelinePeriod(period)}
                            >
                              {period}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedScenarioData?.monthlyProjections
                          ? selectedScenarioData.monthlyProjections
                              .slice(0, timelinePeriod === '1Y' ? 12 : timelinePeriod === '3Y' ? 36 : 60)
                              .filter((_, index) => {
                                // Show every 6 months for 5Y, every 3 months for 3Y, every month for 1Y
                                const interval = timelinePeriod === '1Y' ? 1 : timelinePeriod === '3Y' ? 3 : 6;
                                return index % interval === 0;
                              })
                              .map((projection, index) => (
                                <div key={`${projection.month}-${projection.year}-${index}`} className="flex items-center justify-between p-4 border rounded-lg">
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
                                    <div className="flex items-center justify-end gap-1.5">
                                      <p className="text-sm text-muted-foreground">
                                        Investment Return: <span className="font-bold">{formatMonthlyReturn(projection.monthlyReturn)}</span>
                                      </p>
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                                          </TooltipTrigger>
                                          <TooltipContent className="max-w-xs">
                                            <p className="font-semibold mb-1">Monthly Investment Return</p>
                                            <p className="text-sm text-muted-foreground">
                                              The dollar amount of returns from your investment portfolio for this month. This varies by scenario (conservative, realistic, optimistic) based on different market return assumptions.
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      Savings: <span className="font-bold">{formatCurrency(projection.savings)}</span>
                                    </p>
                                  </div>
                                </div>
                              ))
                          : (
                            <div className="py-8 text-center text-muted-foreground">
                              No projection data available
                            </div>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="breakdown">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Monthly Breakdown
                      </CardTitle>
                        <div className="flex gap-2">
                          {(['12M', '24M', 'All'] as const).map((period) => (
                            <Button
                              key={period}
                              variant={breakdownPeriod === period ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setBreakdownPeriod(period)}
                            >
                              {period}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            data={breakdownChartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                            <XAxis 
                              dataKey="label"
                              angle={-45}
                              textAnchor="end"
                              height={80}
                              tick={{ fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                              interval={breakdownPeriod === 'All' ? 'preserveStartEnd' : 0}
                            />
                            <YAxis 
                              tickFormatter={(value) => formatCurrency(value)}
                              tick={{ fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                            />
                            <RechartsTooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-popover p-3 rounded-lg shadow-lg border border-border">
                                      <p className="font-medium text-popover-foreground mb-2">
                                        {data.label}
                                      </p>
                                      <div className="space-y-1 text-sm">
                                        <p className="text-green-600 dark:text-green-400 font-semibold">
                                          Total Income: <span className="font-bold">{formatCurrency(data.income)}</span>
                                        </p>
                                        <div className="pt-1 border-t space-y-1">
                                          <p className="text-red-600 dark:text-red-400">
                                            Spending: <span className="font-bold">{formatCurrency(data.spending)}</span>
                                            <span className="text-muted-foreground ml-2">
                                              ({((data.spending / data.income) * 100).toFixed(1)}%)
                                            </span>
                                          </p>
                                          <p className="text-green-600 dark:text-green-400">
                                            Savings: <span className="font-bold">{formatCurrency(data.savings)}</span>
                                            <span className="text-muted-foreground ml-2">
                                              ({((data.savings / data.income) * 100).toFixed(1)}%)
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Legend 
                              wrapperStyle={{ paddingTop: '20px' }}
                              formatter={(value) => {
                                if (value === 'spending') return 'Spending';
                                if (value === 'savings') return 'Savings';
                                return value;
                              }}
                            />
                            <Bar
                              dataKey="spending"
                              stackId="income"
                              fill="#ef4444"
                              name="spending"
                              radius={[0, 0, 0, 0]}
                            />
                            <Bar
                              dataKey="savings"
                              stackId="income"
                              fill="#10b981"
                              name="savings"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="goals">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        {cashFlowData.goals?.count && cashFlowData.goals.count > 1 
                          ? 'Goals Achievement Analysis' 
                          : 'Goal Achievement Analysis'
                        }
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Goal Status */}
                      <div className="text-center">
                        <Badge 
                          className={`text-lg px-4 py-2 ${
                            selectedScenarioData.goalAchieved 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          }`}
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          {selectedScenarioData.goalAchieved 
                            ? `${cashFlowData.goals?.count && cashFlowData.goals.count > 1 ? 'All Goals' : 'Goal'} Achieved!` 
                            : `${selectedScenarioData.monthsToGoal} months to ${cashFlowData.goals?.count && cashFlowData.goals.count > 1 ? 'goals' : 'goal'}`
                          }
                        </Badge>
                      </div>

                      {/* Goals Summary - Show if multiple goals */}
                      {cashFlowData.goals && cashFlowData.goals.count > 1 && (
                        <div className="p-4 border rounded-lg bg-muted/50">
                          <h4 className="font-medium mb-3">Goals Summary</h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Active Goals</p>
                              <p className="text-lg font-bold">{cashFlowData.goals.count}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Total Target</p>
                              <p className="text-lg font-bold">{formatCurrency(cashFlowData.goals.totalTargetAmount)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Total Current</p>
                              <p className="text-lg font-bold">{formatCurrency(cashFlowData.goals.totalCurrentAmount)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Progress</p>
                              <p className="text-lg font-bold">
                                {formatPercentage((cashFlowData.goals.totalCurrentAmount / cashFlowData.goals.totalTargetAmount) * 100)}
                              </p>
                            </div>
                          </div>
                          {cashFlowData.metadata?.targetSourceDescription && (
                            <p className="text-xs text-muted-foreground mt-3">
                              {cashFlowData.metadata.targetSourceDescription}
                            </p>
                          )}
                        </div>
                      )}

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
                          <div className="flex items-center gap-1.5 mb-2">
                            <h4 className="font-medium">Average Investment Return</h4>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="font-semibold mb-1">Average Monthly Investment Return</p>
                                  <p className="text-sm text-muted-foreground">
                                    The average dollar amount of monthly returns from your investment portfolio over the projection period. This varies by scenario (conservative, realistic, optimistic) based on different market return assumptions.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <p className="text-2xl font-bold">{formatCurrency(selectedScenarioData.averageMonthlyReturn)}</p>
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
                    {cashFlowData.goals?.count && cashFlowData.goals.count > 1 
                      ? `${cashFlowData.goals.count} Goals Progress` 
                      : 'Goal Progress'
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">
                      {selectedScenarioData.goalAchieved ? '100%' : `${((selectedScenarioData.finalValue / assessment.targetAmount) * 100).toFixed(1)}%`}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {cashFlowData.goals?.count && cashFlowData.goals.count > 1 ? 'Goals Achievement' : 'Goal Achievement'}
                    </p>
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
                      <span>Time to {cashFlowData.goals?.count && cashFlowData.goals.count > 1 ? 'Goals' : 'Goal'}</span>
                      <span className="font-medium">{selectedScenarioData.monthsToGoal} months</span>
                    </div>
                  </div>

                  {/* Goals Info */}
                  {cashFlowData.goals && (
                    <div className="pt-3 border-t">
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Goals Included</span>
                          <span className="font-medium">{cashFlowData.goals.count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Target</span>
                          <span className="font-medium">{formatCurrency(cashFlowData.goals.totalTargetAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Current</span>
                          <span className="font-medium">{formatCurrency(cashFlowData.goals.totalCurrentAmount)}</span>
                        </div>
                      </div>
                    </div>
                  )}
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
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1.5">
                        <span>Avg Investment Return</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="font-semibold mb-1">Average Monthly Investment Return</p>
                              <p className="text-sm text-muted-foreground">
                                The average dollar amount of monthly returns from your investment portfolio over the projection period. This varies by scenario (conservative, realistic, optimistic) based on different market return assumptions.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <span className="font-medium">{formatCurrency(selectedScenarioData.averageMonthlyReturn)}</span>
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