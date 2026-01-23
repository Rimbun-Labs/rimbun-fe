import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart,
  Line,
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
  Calendar,
  BarChart3,
  PieChart,
  Info,
  ArrowRight,
  ChevronDown,
  CheckCircle2
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/lib/api/userService';
import { useSpendingData, useSpendingHistory } from '@/hooks/useSpendingData';
import { useCashFlowProjections, useRefreshCashFlowProjections } from '@/hooks/useCashFlowData';
import { useGoalsOverview } from '@/hooks/useGoals';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useFormatters } from '@/hooks/useFormatters';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader, PageContainer } from '@/components/layout';
import SpendingScenarioSimulator, { SpendingScenario } from '@/components/spending/SpendingScenarioSimulator';
import SpendingImpactCards from '@/components/spending/SpendingImpactCards';
import EmergencyFundTimelineChart from '@/components/spending/EmergencyFundTimelineChart';
import GoalImpactDisplay from '@/components/spending/GoalImpactDisplay';
import { calculateDataQuality } from '@/utils/dataQuality';

const PlanningPage: React.FC = () => {
  const { user } = useAuth();
  const userId = userService.getDatabaseUserId();
  const navigate = useNavigate();
  
  // Spending Analysis state
  const [scenario, setScenario] = useState<SpendingScenario | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [resultsUpdated, setResultsUpdated] = useState(false);
  const simulatorRef = useRef<HTMLDivElement>(null);
  const previousScenarioRef = useRef<SpendingScenario | null>(null);
  
  // Cash Flow state
  const [selectedScenario, setSelectedScenario] = useState<'conservative' | 'realistic' | 'optimistic'>('realistic');
  const [timelinePeriod, setTimelinePeriod] = useState<'1Y' | '3Y' | '5Y'>('5Y');
  const [breakdownPeriod, setBreakdownPeriod] = useState<'12M' | '24M' | 'All'>('12M');

  // Fetch spending data
  const { 
    data: spendingData, 
    isLoading: spendingLoading
  } = useSpendingData();

  // Fetch goals data
  const { 
    data: goalsData, 
    isLoading: goalsLoading 
  } = useGoalsOverview(false);

  // Fetch spending history
  const { 
    data: historyData 
  } = useSpendingHistory({ limit: 12 });

  // Fetch cash flow data
  const { 
    data: cashFlowData, 
    isLoading: cashFlowLoading, 
    error: cashFlowError 
  } = useCashFlowProjections();

  const refreshCashFlowMutation = useRefreshCashFlowProjections();

  const { formatCurrency, formatPercentage } = useFormatters();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Calculate current state for impact cards
  const currentState = useMemo(() => {
    if (!spendingData) return null;
    
    const savings = spendingData.monthlyIncome - spendingData.monthlySpending;
    const savingsRate = spendingData.monthlyIncome > 0 ? (savings / spendingData.monthlyIncome) * 100 : 0;
    
    const investmentMonthly = goalsData?.goals
      ? goalsData.goals
          .filter(goal => goal.isActive !== false && goal.status !== 'completed' && goal.status !== 'archived')
          .reduce((sum, goal) => sum + (goal.monthlyContribution || 0), 0)
      : savings;
    
    return {
      savingsRate,
      emergencyFundCurrent: spendingData.emergencyFundStatus?.currentAmount || 0,
      emergencyFundTarget: spendingData.emergencyFundStatus?.recommendedTarget || 0,
      investmentMonthly,
      monthlySpending: spendingData.monthlySpending,
      monthlyIncome: spendingData.monthlyIncome,
    };
  }, [spendingData, goalsData]);

  // Calculate scenario state for impact cards
  const scenarioState = useMemo(() => {
    if (!scenario || !spendingData) return null;
    
    const savings = spendingData.monthlyIncome - scenario.adjustedSpending;
    const savingsRate = spendingData.monthlyIncome > 0 ? (savings / spendingData.monthlyIncome) * 100 : 0;
    const emergencyFundMonthly = scenario.emergencyFundAllocation;
    const investmentMonthly = scenario.investmentAllocation;
    
    return {
      ...scenario,
      savingsRate,
      emergencyFundMonthly,
      investmentMonthly,
    };
  }, [scenario, spendingData]);

  // Calculate data quality metrics
  const dataQuality = useMemo(() => {
    if (!historyData?.periods) return null;
    return calculateDataQuality(historyData.periods, 3);
  }, [historyData]);

  // Cash Flow data processing
  const { cashFlowProjections, assessment } = cashFlowData || {};
  const scenarios = cashFlowProjections?.scenarios;
  const selectedScenarioData = cashFlowData?.cashFlowProjections?.scenarios?.[selectedScenario];
  
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

  const timelineChartData = useMemo(() => {
    if (!selectedScenarioData?.monthlyProjections) return [];
    
    const monthsToShow = timelinePeriod === '1Y' ? 12 : timelinePeriod === '3Y' ? 36 : 60;
    const filtered = selectedScenarioData.monthlyProjections.slice(0, monthsToShow);
    
    const interval = timelinePeriod === '1Y' ? 1 : timelinePeriod === '3Y' ? 3 : 6;
    
    return filtered
      .filter((_, index) => index % interval === 0)
      .map((proj) => {
        const date = new Date(proj.year, proj.month - 1);
        const monthName = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        
        return {
          month: proj.month,
          year: proj.year,
          label: `${monthName} ${year}`,
          netWorth: proj.totalNetWorth,
          goalProgress: proj.goalProgress,
          savings: proj.savings,
          monthlyReturn: proj.monthlyReturn,
          fullDate: `${year}-${String(proj.month).padStart(2, '0')}`,
        };
      });
  }, [selectedScenarioData, timelinePeriod]);

  const formatMonthlyReturn = (value: number) => {
    return formatCurrency(value);
  };

  const handleRefreshCashFlow = () => {
    refreshCashFlowMutation.mutate();
  };

  // Show loading state
  if (cashFlowLoading && !cashFlowData) {
    return (
      <PageContainer>
        <div className="py-8">
          <LoadingState 
            variant="expanded"
            showTitle
            showSubtitle
            lines={3}
          />
        </div>
      </PageContainer>
    );
  }

  // Show error state
  if (cashFlowError) {
    return (
      <PageContainer>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load cash flow projections. Please try again.
          </AlertDescription>
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        icon={BarChart3}
        title="Planning"
        description="Simulate financial scenarios and view cash flow projections"
        action={
          cashFlowData ? (
            <Button 
              variant="outline" 
              onClick={handleRefreshCashFlow}
              disabled={refreshCashFlowMutation.isPending}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshCashFlowMutation.isPending ? 'animate-spin' : ''}`} />
              Refresh Projections
            </Button>
          ) : undefined
        }
      />

      {/* Main Content - Simulator (Combined Financial Analysis + Projections) */}
      <div className="space-y-6 mt-6">
        {/* Simulator Tab - Combines Financial Analysis and Projections */}
        {!spendingData ? (
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">Complete Spending Data</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Enter your spending data first to use the financial simulator.
              </p>
              <Button size="lg" onClick={() => navigate('/spending')}>
                Go to Spending
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Spending Scenario Planning */}
            {spendingData && (
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5" />
                  Spending Scenario Planning
                </h3>
                
                {/* Results Summary - Always visible at top */}
                {scenario && currentState && scenarioState ? (
                  <div className="mb-6 space-y-4 relative">
                    {/* Update Indicator */}
                    {resultsUpdated && (
                      <div className="absolute -top-2 right-0 z-10 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Badge className="bg-green-500 text-white border-0 shadow-lg">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Updated
                        </Badge>
                      </div>
                    )}
                    
                    {/* Scroll to Controls Button - Mobile/Tablet */}
                    {showScrollButton && (
                      <div className="flex justify-center mb-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={scrollToSimulator}
                          className="lg:hidden"
                        >
                          <ChevronDown className="h-4 w-4 mr-1" />
                          Scroll to adjust controls
                        </Button>
                      </div>
                    )}
                    
                    <div className={resultsUpdated ? "animate-pulse" : ""}>
                      <SpendingImpactCards
                        current={currentState}
                        scenario={scenarioState}
                        dataQuality={dataQuality}
                      />
                    </div>
                    
                    {/* Emergency Fund Timeline Chart */}
                    {currentState.emergencyFundTarget > 0 && (
                      <div className={resultsUpdated ? "animate-pulse" : ""}>
                        <EmergencyFundTimelineChart
                          currentAmount={currentState.emergencyFundCurrent}
                          targetAmount={currentState.emergencyFundTarget}
                          currentMonthlyContribution={
                            Math.max(
                              (spendingData.monthlyIncome - spendingData.monthlySpending) * 0.1,
                              currentState.emergencyFundTarget > currentState.emergencyFundCurrent
                                ? (currentState.emergencyFundTarget - currentState.emergencyFundCurrent) / 60
                                : 0
                            )
                          }
                          scenarioMonthlyContribution={scenarioState.emergencyFundMonthly}
                          monthlySpending={scenario.adjustedSpending}
                          dataQuality={dataQuality}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <Card className="mb-6">
                    <CardContent className="text-center py-8">
                      <Target className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm mb-2">
                        Adjust the sliders below to see the impact on your financial goals
                      </p>
                      <ChevronDown className="h-5 w-5 text-muted-foreground mx-auto animate-bounce" />
                    </CardContent>
                  </Card>
                )}
                
                {/* Simulator - Below results */}
                <div ref={simulatorRef} className="space-y-4 scroll-mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Adjust your spending scenario
                    </h4>
                    {scenario && currentState && scenarioState && (
                      <Badge variant="outline" className="text-xs">
                        Live updates above
                      </Badge>
                    )}
                  </div>
                  <SpendingScenarioSimulator
                    monthlyIncome={spendingData.monthlyIncome}
                    monthlySpending={spendingData.monthlySpending}
                    onScenarioChange={setScenario}
                  />
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/spending')}
                  >
                    View Full Spending Analysis
                  </Button>
                </div>
              </div>
            )}

            {/* Combined Goal Impact */}
            {goalsData && goalsData.goals.length > 0 && scenario && currentState && scenarioState && (
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5" />
                  Goal Impact Analysis
                </h3>
                <Card>
                  <CardContent>
                    <GoalImpactDisplay
                      goals={goalsData.goals}
                      currentInvestmentAllocation={currentState.investmentMonthly}
                      scenarioInvestmentAllocation={scenarioState.investmentMonthly}
                      dataQuality={dataQuality}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Cash Flow Projections */}
            {!cashFlowData || cashFlowData.message ? (
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5" />
                  Cash Flow Projections
                </h3>
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
            ) : (
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5" />
                  Cash Flow Projections
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Main Analysis (2/3 width) */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Scenario Comparison */}
                    <div>
                      <h4 className="text-lg font-semibold flex items-center gap-2 mb-4">
                        <BarChart3 className="h-5 w-5" />
                        Scenario Comparison
                      </h4>
                      <Card>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {(['conservative', 'realistic', 'optimistic'] as const).map((scenario) => {
                              const data = scenarios?.[scenario];
                              if (!data) return null;
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
                    </div>
                            
                    {/* Detailed Analysis Tabs */}
                    <Tabs defaultValue="timeline" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50">
                        <TabsTrigger 
                          value="timeline" 
                          className="gap-2 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
                        >
                          <Calendar className="h-4 w-4" />
                          Timeline
                        </TabsTrigger>
                        <TabsTrigger 
                          value="breakdown" 
                          className="gap-2 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
                        >
                          <BarChart3 className="h-4 w-4" />
                          Breakdown
                        </TabsTrigger>
                        <TabsTrigger 
                          value="goals" 
                          className="gap-2 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
                        >
                          <PieChart className="h-4 w-4" />
                          Goals
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="timeline">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            {selectedScenario.charAt(0).toUpperCase() + selectedScenario.slice(1)} Scenario Timeline
                          </h4>
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
                        {timelineChartData.length > 0 ? (
                          <div className="h-[500px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart 
                                data={timelineChartData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                                <XAxis 
                                  dataKey="label"
                                  angle={-45}
                                  textAnchor="end"
                                  height={80}
                                  tick={{ fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                                  interval="preserveStartEnd"
                                />
                                <YAxis 
                                  yAxisId="left"
                                  tickFormatter={(value) => formatCurrency(value)}
                                  tick={{ fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                                />
                                <YAxis 
                                  yAxisId="right"
                                  orientation="right"
                                  tickFormatter={(value) => `${value.toFixed(1)}%`}
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
                                            <p className="text-blue-600 dark:text-blue-400 font-semibold">
                                              Net Worth: <span className="font-bold">{formatCurrency(data.netWorth)}</span>
                                            </p>
                                            <p className="text-purple-600 dark:text-purple-400">
                                              Goal Progress: <span className="font-bold">{data.goalProgress.toFixed(1)}%</span>
                                            </p>
                                            <div className="pt-1 border-t space-y-1">
                                              <p className="text-green-600 dark:text-green-400">
                                                Savings: <span className="font-bold">{formatCurrency(data.savings)}</span>
                                              </p>
                                              <p className="text-muted-foreground">
                                                Investment Return: <span className="font-bold">{formatMonthlyReturn(data.monthlyReturn)}</span>
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
                                    if (value === 'netWorth') return 'Net Worth';
                                    if (value === 'goalProgress') return 'Goal Progress (%)';
                                    return value;
                                  }}
                                />
                                <Line
                                  yAxisId="left"
                                  type="monotone"
                                  dataKey="netWorth"
                                  stroke="#3b82f6"
                                  strokeWidth={2}
                                  dot={{ r: 4 }}
                                  activeDot={{ r: 6 }}
                                  name="netWorth"
                                />
                                <Line
                                  yAxisId="right"
                                  type="monotone"
                                  dataKey="goalProgress"
                                  stroke="#a855f7"
                                  strokeWidth={2}
                                  dot={{ r: 4 }}
                                  activeDot={{ r: 6 }}
                                  name="goalProgress"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="py-8 text-center text-muted-foreground">
                            No projection data available
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="breakdown">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Monthly Breakdown
                          </h4>
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
                      <CardContent className="pt-6">
                        <h4 className="text-lg font-semibold flex items-center gap-2 mb-6">
                          <PieChart className="h-5 w-5" />
                          {cashFlowData.goals?.count && cashFlowData.goals.count > 1 
                            ? 'Goals Achievement Analysis' 
                            : 'Goal Achievement Analysis'
                          }
                        </h4>
                        <div className="space-y-6">
                          <div className="text-center">
                            <Badge 
                              className={`text-lg px-4 py-2 ${
                                selectedScenarioData?.goalAchieved 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              }`}
                            >
                              <Target className="h-4 w-4 mr-2" />
                              {selectedScenarioData?.goalAchieved 
                                ? `${cashFlowData.goals?.count && cashFlowData.goals.count > 1 ? 'All Goals' : 'Goal'} Achieved!` 
                                : `${selectedScenarioData?.monthsToGoal || 0} months to ${cashFlowData.goals?.count && cashFlowData.goals.count > 1 ? 'goals' : 'goal'}`
                              }
                            </Badge>
                          </div>

                          {cashFlowData.goals && cashFlowData.goals.count > 1 && (
                            <div className="p-4 border rounded-lg bg-muted/50">
                              <h5 className="font-medium mb-3">Goals Summary</h5>
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
                            </div>
                          )}

                          {assessment && selectedScenarioData && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="p-4 border rounded-lg">
                                <h5 className="font-medium mb-2">Target Amount</h5>
                                <p className="text-2xl font-bold">{formatCurrency(assessment.targetAmount)}</p>
                              </div>
                              <div className="p-4 border rounded-lg">
                                <h5 className="font-medium mb-2">Final Value</h5>
                                <p className="text-2xl font-bold">{formatCurrency(selectedScenarioData.finalValue)}</p>
                              </div>
                              <div className="p-4 border rounded-lg">
                                <h5 className="font-medium mb-2">Total Savings</h5>
                                <p className="text-2xl font-bold">{formatCurrency(selectedScenarioData.totalSavings)}</p>
                              </div>
                              <div className="p-4 border rounded-lg">
                                <div className="flex items-center gap-1.5 mb-2">
                                  <h5 className="font-medium">Average Investment Return</h5>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent className="max-w-xs">
                                        <p className="font-semibold mb-1">Average Monthly Investment Return</p>
                                        <p className="text-sm text-muted-foreground">
                                          The average dollar amount of monthly returns from your investment portfolio over the projection period.
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                                <p className="text-2xl font-bold">{formatCurrency(selectedScenarioData.averageMonthlyReturn)}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
                  </div>

                  {/* Right Column - Summary & Actions (1/3 width) */}
                  <div className="space-y-6">
                    {assessment && selectedScenarioData && (
                  <>
                    <Card>
                      <CardContent className="pt-6">
                        <h4 className="text-lg font-semibold flex items-center gap-2 mb-4">
                          <Target className="h-5 w-5" />
                          {cashFlowData.goals?.count && cashFlowData.goals.count > 1 
                            ? `${cashFlowData.goals.count} Goals Progress` 
                            : 'Goal Progress'
                          }
                        </h4>
                        <div className="space-y-4">
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
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <h4 className="text-lg font-semibold mb-4">Key Metrics</h4>
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
                                      The average dollar amount of monthly returns from your investment portfolio over the projection period.
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
                  </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default PlanningPage;

