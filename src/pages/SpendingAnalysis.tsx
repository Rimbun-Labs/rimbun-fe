import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, PieChart, Shield, Lightbulb, AlertCircle, Target } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/lib/api/userService';
import { useSpendingData, useSpendingCategories, useSpendingRecommendations, useSpendingHistory } from '@/hooks/useSpendingData';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Existing components
import SpendingOverviewCard from '@/components/spending/SpendingOverviewCard';
import TrendsInsightsCard from '@/components/spending/TrendsInsightsCard';
import SpendingHistory from '@/components/spending/SpendingHistory';
import SpendingInput from '@/components/spending/SpendingInput';
import SpendingCategories from '@/components/spending/SpendingCategories';
import EmergencyFundAnalysis from '@/components/spending/EmergencyFundAnalysis';
import SpendingRecommendations from '@/components/spending/SpendingRecommendations';

// Phase 3 components
import SpendingScenarioSimulator, { SpendingScenario } from '@/components/spending/SpendingScenarioSimulator';
import SpendingImpactCards from '@/components/spending/SpendingImpactCards';
import EmergencyFundTimelineChart from '@/components/spending/EmergencyFundTimelineChart';
import GoalImpactDisplay from '@/components/spending/GoalImpactDisplay';
import { useGoalsOverview } from '@/hooks/useGoals';
import { calculateDataQuality } from '@/utils/dataQuality';

const SpendingAnalysisPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('scenario');
  const [scenario, setScenario] = useState<SpendingScenario | null>(null);
  const userId = userService.getDatabaseUserId();

  // Fetch spending data
  const { 
    data: spendingData, 
    isLoading: spendingLoading, 
    error: spendingError 
  } = useSpendingData(userId || '');

  const { 
    data: categories, 
    isLoading: categoriesLoading 
  } = useSpendingCategories(userId || '');

  const { 
    data: recommendations, 
    isLoading: recommendationsLoading 
  } = useSpendingRecommendations(userId || '');

  // Fetch goals data for Phase 3 integration
  const { 
    data: goalsData, 
    isLoading: goalsLoading 
  } = useGoalsOverview(userId || '', false);

  // Fetch spending history for data quality calculation
  const { 
    data: historyData 
  } = useSpendingHistory(userId || '', { limit: 12 });

  // Calculate current state for impact cards
  const currentState = useMemo(() => {
    if (!spendingData) return null;
    
    const savings = spendingData.monthlyIncome - spendingData.monthlySpending;
    const savingsRate = spendingData.monthlyIncome > 0 ? (savings / spendingData.monthlyIncome) * 100 : 0;
    const emergencyFundMonths = spendingData.monthlySpending > 0
      ? (spendingData.emergencyFundStatus?.currentAmount || 0) / spendingData.monthlySpending
      : 0;
    
    // Calculate current investment from goals (sum of all goal contributions)
    const investmentMonthly = goalsData?.goals
      ? goalsData.goals
          .filter(goal => goal.isActive !== false && goal.status !== 'completed' && goal.status !== 'archived')
          .reduce((sum, goal) => sum + (goal.monthlyContribution || 0), 0)
      : savings; // Fallback to all savings if no goals
    
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
    // Allocations are now already in dollar amounts
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
    return calculateDataQuality(historyData.periods, 3); // Look back 3 months
  }, [historyData]);

  // Show loading state
  if (spendingLoading && !spendingData) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="py-8">
          <LoadingState 
            variant="expanded"
            showTitle
            showSubtitle
            lines={3}
          />
        </div>
      </div>
    );
  }

  // Show error state
  if (spendingError) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load spending data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Spending Analysis</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Track your spending habits and optimize your financial plan
          </p>
        </div>

        {/* Top Section: Overview & Trends - KEEP EXISTING */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpendingOverviewCard 
            data={spendingData}
            loading={spendingLoading}
          />
          <TrendsInsightsCard userId={userId || ''} />
        </div>

        {/* Middle Section: Full-width History Chart - KEEP EXISTING */}
        <SpendingHistory userId={userId || ''} />

        {/* Bottom Section: 2-Column Layout (Main Content + Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="scenario" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Scenario
                </TabsTrigger>
                <TabsTrigger value="input" className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Input
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  Categories
                </TabsTrigger>
              </TabsList>

              {/* Scenario Tab - NEW Phase 3 Features */}
              <TabsContent value="scenario" className="space-y-6">
                {spendingData ? (
                  <>
                    <SpendingScenarioSimulator
                      monthlyIncome={spendingData.monthlyIncome}
                      monthlySpending={spendingData.monthlySpending}
                      onScenarioChange={setScenario}
                    />
                    {scenario && currentState && scenarioState && (
                      <>
                        <SpendingImpactCards
                          current={currentState}
                          scenario={scenarioState}
                          dataQuality={dataQuality}
                        />
                        
                        {/* Emergency Fund Timeline Chart */}
                        {currentState.emergencyFundTarget > 0 && (
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
                        )}

                        {/* Goal Impact Display */}
                        {goalsData && goalsData.goals.length > 0 && (
                          <GoalImpactDisplay
                            goals={goalsData.goals}
                            currentInvestmentAllocation={currentState.investmentMonthly}
                            scenarioInvestmentAllocation={scenarioState.investmentMonthly}
                            dataQuality={dataQuality}
                          />
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Spending Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Enter your spending data first to use the scenario simulator.
                      </p>
                      <Button onClick={() => setActiveTab('input')}>
                        Go to Input Tab
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Input Tab - EXISTING CONTENT */}
              <TabsContent value="input" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Enter Your Spending Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SpendingInput 
                      userId={userId || ''}
                      currentData={spendingData}
                      onSuccess={() => {
                        // Data will be refreshed automatically via React Query
                        setActiveTab('scenario');
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Categories Tab - EXISTING CONTENT */}
              <TabsContent value="categories" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Spending Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SpendingCategories 
                      userId={userId || ''}
                      categories={categories || []}
                      loading={categoriesLoading}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar (1/3 width) - Always Visible */}
          <div className="space-y-6">
            {/* Emergency Fund Analysis - Always Visible */}
            {spendingData && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Emergency Fund
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EmergencyFundAnalysis 
                    data={spendingData}
                    loading={spendingLoading}
                  />
                </CardContent>
              </Card>
            )}

            {/* Recommendations - Always Visible */}
            {recommendations && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SpendingRecommendations 
                    recommendations={recommendations}
                    loading={recommendationsLoading}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingAnalysisPage;
