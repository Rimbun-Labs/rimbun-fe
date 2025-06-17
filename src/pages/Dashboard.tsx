import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { getUserSessions } from '@/lib/api/userResponsesApi';
import { getRecommendations } from '@/lib/api/recommendationApi';
import { getAssessmentResults } from '@/lib/api/assessmentApi';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { RecommendedMetricsWithWeights } from '@/lib/api/types/metrics';

// Component imports
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PortfolioAllocation from '@/components/dashboard/PortfolioAllocation';
import DirectInputs from '@/components/dashboard/DirectInputs';
import RiskProfileChart from '@/components/dashboard/RiskProfileChart';
import DiversificationAnalysis from '@/components/recommendations/DiversificationAnalysis';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  RiskStyleExplanation,
  KnowledgeLevelExplanation,
  DecisionStyleExplanation,
  AllocationStrategyExplanation,
  PortfolioInteractionExplanation,
  CorrelationExplanation
} from '@/components/dashboard/explanations';
import {
  EquitiesExplanation,
  BondsExplanation,
  RealEstateExplanation,
  CashExplanation
} from '@/components/dashboard/explanations/assetAllocation';
import { AlertCircle } from "lucide-react";
import InvestmentScenarios from '@/components/dashboard/InvestmentScenarios';

// Add type definitions
interface LowercaseAssetAllocations {
  equities: number;
  bonds: number;
  realEstate: number;
  cash: number;
}

interface UppercaseAssetAllocations {
  EQUITIES: number;
  BONDS: number;
  REAL_ESTATE: number;
  CASH: number;
}

const getScoreColor = (score: number) => {
  if (score >= 0.7) return "text-green-600";
  if (score >= 0.4) return "text-yellow-600";
  return "text-red-600";
};

const getScoreLabel = (score: number) => {
  if (score >= 0.7) return "High";
  if (score >= 0.4) return "Medium";
  return "Low";
};

const getRiskProfileLabel = (riskProfile: number) => {
  if (riskProfile >= 0.7) return "High Risk";
  if (riskProfile >= 0.4) return "Medium Risk";
  return "Low Risk";
};

const mapGoalGapInsights = (oldInsights: any) => {
  if (!oldInsights) return undefined;
  
  // If it already has timeAnalysis, return as is
  if (oldInsights.timeAnalysis) return oldInsights;
  
  // Otherwise, transform the old structure to the new one
  return {
    ...oldInsights,
    timeAnalysis: {
      actualYears: oldInsights.projectedTimeToGoal,
      investmentHorizon: oldInsights.investmentHorizon || 15, // Default to 15 if not provided
      isRealistic: oldInsights.projectedTimeToGoal <= (oldInsights.investmentHorizon || 15),
      suggestedAdjustments: oldInsights.recommendations.suggestedMonthlySavings ? {
        monthlySavings: oldInsights.recommendations.suggestedMonthlySavings
      } : undefined
    }
  };
};

const Dashboard = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { session, setSession } = useSession();
  
  // State for expandable sections
  const [expandedSections, setExpandedSections] = React.useState({
    profile: false,
    portfolio: false,
    insights: false
  });
  
  // Get assessment results
  const { data: assessmentResults, isLoading: assessmentLoading, error: assessmentError, refetch: refetchAssessment } = useQuery({
    queryKey: ['assessmentResults', sessionId],
    queryFn: () => getAssessmentResults(sessionId!),
    enabled: !!sessionId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  // Get recommendations
  const { data: recommendations, isLoading: recommendationsLoading, refetch: refetchRecommendations } = useQuery({
    queryKey: ['recommendations', sessionId],
    queryFn: () => getRecommendations(sessionId!),
    enabled: !!sessionId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  // Update session when results are loaded
  useEffect(() => {
    if (assessmentResults && sessionId) {
      setSession({
        id: sessionId,
        userId: assessmentResults.responseGroupId,
        questionnaireType: "ONBOARDING",
        isCompleted: true,
        metadata: {
          score: assessmentResults.scoreData.finalScore,
          profile: assessmentResults.scoreData.profile,
          riskProfile: assessmentResults.scoreData.riskProfile,
          knowledgeLevel: assessmentResults.scoreData.knowledgeLevel,
          leverageAptitude: assessmentResults.scoreData.leverageAptitude,
          riskCapacity: assessmentResults.scoreData.riskCapacity,
          investmentHorizon: assessmentResults.scoreData.investmentHorizon,
          overallConfidence: assessmentResults.scoreData.overallConfidence
        },
        createdAt: assessmentResults.createdAt,
        updatedAt: assessmentResults.updatedAt
      });
    }
  }, [assessmentResults, sessionId, setSession]);

  const isLoading = assessmentLoading || recommendationsLoading;

  if (isLoading) {
    return (
      <div className="container max-w-7xl py-8">
        <LoadingState 
          variant="expanded"
          showTitle
          showSubtitle
          lines={3}
        />
      </div>
    );
  }

  if (assessmentError || !sessionId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-red-600">Error Loading Dashboard</CardTitle>
              <CardDescription>
                There was a problem loading your dashboard data. Please try again.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p>
                  {!sessionId 
                    ? 'No assessment session ID provided.' 
                    : 'Failed to load assessment results. The assessment might not be complete yet.'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => refetchAssessment()}
                  variant="outline"
                >
                  Retry Assessment Data
                </Button>
                <Button 
                  onClick={() => refetchRecommendations()}
                  variant="outline"
                >
                  Retry Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getReadableProfile = (profile: string): string => {
    return profile.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header Section */}
      <DashboardHeader />
      
      {/* Main Content */}
        <div className="space-y-6">
        {/* Investment Profile Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Your Investment Profile</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('profile')}
              className="flex items-center gap-2"
            >
              {expandedSections.profile ? 'Show Less' : 'Learn More'}
              {expandedSections.profile ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            {/* Always Visible: Radar Chart */}
            <div className="h-[400px] w-full mb-6">
              <RiskProfileChart 
                data={{
                  riskProfile: assessmentResults?.scoreData.riskProfile || 0,
                  knowledgeLevel: assessmentResults?.scoreData.knowledgeLevel || 0,
                  leverageAptitude: assessmentResults?.scoreData.leverageAptitude || 0,
                  decisionStyleScore: assessmentResults?.scoreData.decisionStyleScore || 0,
                  personalityScore: assessmentResults?.scoreData.personalityScore || 0
                }}
                confidenceMetrics={assessmentResults?.scoreData.confidenceMetrics}
              />
            </div>

            {/* Expanded Content: Question Cards */}
            {expandedSections.profile && (
              <div className="space-y-6">
                {/* What's your risk style? */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">What's your risk style?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">
                          {assessmentResults?.scoreData.riskProfile}%
                        </div>
                      </div>
                      <RiskStyleExplanation 
                        score={assessmentResults?.scoreData.riskProfile || 0}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* How well do you know? */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How well do you know?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">
                          {assessmentResults?.scoreData.knowledgeLevel}%
                        </div>
                      </div>
                      <KnowledgeLevelExplanation 
                        score={assessmentResults?.scoreData.knowledgeLevel || 0}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* What's your approach? */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">What's your approach?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">
                          {assessmentResults?.scoreData.decisionStyleScore}%
                        </div>
                      </div>
                      <DecisionStyleExplanation 
                        score={assessmentResults?.scoreData.decisionStyleScore || 0}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Portfolio Breakdown Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Your Portfolio Breakdown</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('portfolio')}
              className="flex items-center gap-2"
            >
              {expandedSections.portfolio ? 'Show Less' : 'Learn More'}
              {expandedSections.portfolio ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            {/* Always Visible: Portfolio Allocation Chart */}
            <div className="min-h-[300px] mb-6">
              <PortfolioAllocation 
                allocations={recommendations?.adjustedAllocations || {
                  equities: 0,
                  bonds: 0,
                  realEstate: 0,
                  cash: 0
                }}
                recommendedMetrics={recommendations?.recommendedMetrics}
                loading={recommendationsLoading}
              />
            </div>

            {/* Expanded Content: Asset Explanations */}
            {expandedSections.portfolio && (
              <div className="space-y-6">
                {/* What are you investing in? */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">What are you investing in?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Equities */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Equities</span>
                          <span className="text-lg font-bold">{recommendations?.adjustedAllocations?.equities}%</span>
                        </div>
                        <EquitiesExplanation 
                          allocation={recommendations?.adjustedAllocations?.equities || 0}
                          riskProfile={assessmentResults?.scoreData.riskProfile || 0}
                        />
                      </div>

                      {/* Bonds */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Bonds</span>
                          <span className="text-lg font-bold">{recommendations?.adjustedAllocations?.bonds}%</span>
                        </div>
                        <BondsExplanation 
                          allocation={recommendations?.adjustedAllocations?.bonds || 0}
                          riskProfile={assessmentResults?.scoreData.riskProfile || 0}
                        />
                      </div>

                      {/* Real Estate */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Real Estate</span>
                          <span className="text-lg font-bold">{recommendations?.adjustedAllocations?.realEstate}%</span>
                        </div>
                        <RealEstateExplanation 
                          allocation={recommendations?.adjustedAllocations?.realEstate || 0}
                          riskProfile={assessmentResults?.scoreData.riskProfile || 0}
                        />
                      </div>

                      {/* Cash */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Cash</span>
                          <span className="text-lg font-bold">{recommendations?.adjustedAllocations?.cash}%</span>
                        </div>
                        <CashExplanation 
                          allocation={recommendations?.adjustedAllocations?.cash || 0}
                          riskProfile={assessmentResults?.scoreData.riskProfile || 0}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Portfolio Insights Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Portfolio Insights</CardTitle>
              <CardDescription>Key metrics and analysis of your portfolio's performance and risk management</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('insights')}
              className="flex items-center gap-2"
            >
              {expandedSections.insights ? 'Show Less' : 'Learn More'}
              {expandedSections.insights ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* Diversification Score */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Diversification Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        {(recommendations?.diversificationAnalysis?.diversificationScore * 100).toFixed(0)}%
                      </span>
                      <Badge className={getScoreColor(recommendations?.diversificationAnalysis?.diversificationScore)}>
                        {getScoreLabel(recommendations?.diversificationAnalysis?.diversificationScore)}
                      </Badge>
                    </div>
                    <Progress 
                      value={recommendations?.diversificationAnalysis?.diversificationScore * 100} 
                      className="h-2" 
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Risk Metrics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Risk Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Risk-Adjusted Volatility</span>
                      <span className="text-2xl font-bold">
                        {recommendations?.diversificationAnalysis?.riskAdjustedVolatility.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Risk Profile</span>
                      <span className="text-sm font-medium">
                        {getRiskProfileLabel(assessmentResults?.scoreData.riskProfile)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Insights */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recommendations?.diversificationAnalysis?.recommendations.slice(0, 2).map((recommendation, index) => (
                      <div key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span className="text-sm">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Expanded Content */}
            {expandedSections.insights && (
              <div className="mt-6 space-y-6">
                {/* Portfolio Strategy */}
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Strategy</CardTitle>
                    <CardDescription>How your portfolio is structured to achieve your investment goals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AllocationStrategyExplanation
                      diversificationScore={recommendations?.diversificationAnalysis?.diversificationScore || 0}
                      riskProfile={assessmentResults?.scoreData.riskProfile || 0}
                      riskAdjustedVolatility={recommendations?.diversificationAnalysis?.riskAdjustedVolatility || 0}
                    />
                  </CardContent>
                </Card>

                {/* Asset Correlations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Asset Correlations</CardTitle>
                    <CardDescription>
                      How different assets in your portfolio move in relation to each other. 
                      A correlation of 1 means assets move perfectly together, -1 means they move in opposite directions, 
                      and 0 means no relationship.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="min-h-[400px]">
                      <CorrelationExplanation
                        correlationMatrix={recommendations?.diversificationAnalysis?.correlationMatrix || {}}
                        goal="other"
                        allocations={{
                          equities: recommendations?.adjustedAllocations?.equities || 0,
                          bonds: recommendations?.adjustedAllocations?.bonds || 0,
                          realEstate: recommendations?.adjustedAllocations?.realEstate || 0,
                          cash: recommendations?.adjustedAllocations?.cash || 0
                        }}
                        riskProfile={assessmentResults?.scoreData.riskProfile || 0}
                        investmentHorizon={assessmentResults?.scoreData.investmentHorizon || 0}
                        knowledgeLevel={assessmentResults?.scoreData.knowledgeLevel >= 0.7 ? 'advanced' : 
                                      assessmentResults?.scoreData.knowledgeLevel >= 0.4 ? 'intermediate' : 
                                      'beginner'}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Your Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <DirectInputs 
              inputs={assessmentResults?.scoreData?.directInputs}
              goalGapInsights={mapGoalGapInsights(recommendations?.recommendationCalculationData?.goalGapInsights)}
              loading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Add Investment Scenarios */}
        {recommendations?.recommendationCalculationData?.goalGapInsights?.investmentScenarios && (
          <InvestmentScenarios
            scenarios={recommendations.recommendationCalculationData.goalGapInsights.investmentScenarios}
            targetAmount={assessmentResults?.scoreData?.directInputs?.targetAmount || 0}
            investmentHorizon={assessmentResults?.scoreData?.directInputs?.investmentHorizon || 0}
            loading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
