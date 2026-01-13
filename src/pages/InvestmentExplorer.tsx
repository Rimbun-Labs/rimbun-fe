import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Compass,
  AlertCircle,
  MessageSquare,
  PieChart,
  TrendingUp,
  Info,
  BarChart3
} from 'lucide-react';
import { InvestmentExplorerChat } from '@/components/investment/InvestmentExplorerChat';
import { PortfolioSimulator } from '@/components/investment/PortfolioSimulator';
import { PortfolioQuickReference } from '@/components/investment/PortfolioQuickReference';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { RouteErrorBoundary } from '@/components/error/RouteErrorBoundary';
import { PageHeader, PageContainer } from '@/components/layout';
import { SPACING } from '@/lib/constants/spacing';
import { useQuery } from '@tanstack/react-query';
import { getAssessmentResults } from '@/lib/api/assessmentApi';
import { getRecommendations } from '@/lib/api/recommendationApi';
import PortfolioAllocation from '@/components/dashboard/PortfolioAllocation';
import RiskProfileChart from '@/components/dashboard/RiskProfileChart';
import DiversificationAnalysis from '@/components/recommendations/DiversificationAnalysis';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { EnhancedEmptyState } from '@/components/ui/enhanced-empty-state';

// Lazy load Asset Analyzer to reduce initial bundle size
const AssetAnalyzerTab = lazy(() => 
  import('@/components/asset-analyzer/AssetAnalyzerTab').then(module => ({
    default: module.AssetAnalyzerTab
  }))
);

const InvestmentExplorer: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { session, isLoading, error: sessionError } = useSession();
  const [activeTab, setActiveTab] = useState<'profile' | 'chat' | 'simulator' | 'analyzer'>('profile');
  const [error, setError] = useState<string | null>(null);

  // Fetch assessment results and recommendations (always fetch for Quick Reference, needed for Simulator)
  const { data: assessmentResults, isLoading: assessmentLoading } = useQuery({
    queryKey: ['assessment-results', sessionId],
    queryFn: () => getAssessmentResults(sessionId!),
    enabled: !!sessionId,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });

  const { data: recommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ['recommendations', sessionId],
    queryFn: () => getRecommendations(sessionId!),
    enabled: !!sessionId,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isLoading) return;
    if (!session) {
      navigate('/assessment');
      return;
    }
    if (!session.isCompleted) {
      navigate('/assessment');
      return;
    }
    if (sessionId !== session.id) {
      navigate(`/investment-explorer/${session.id}`);
      return;
    }
  }, [session, sessionId, navigate, isLoading]);

  if (isLoading) {
    return (
      <LoadingState
        title="Loading Investment Explorer"
        subtitle="Analyzing your assessment results and preparing personalized recommendations"
      />
    );
  }

  if (sessionError) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <Card className="w-full max-w-lg border border-border shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col items-center space-y-6">
                <div className="p-4 rounded-full bg-destructive/10 border border-destructive/20">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Error Loading Session</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {sessionError instanceof Error ? sessionError.message : "Failed to load your session"}
                  </p>
                </div>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!session || !session.isCompleted) {
    return null;
  }

  // Helper function to get risk profile label
  const getRiskProfileLabel = (score?: number): string => {
    if (!score) return 'N/A';
    if (score >= 80) return 'Aggressive';
    if (score >= 60) return 'Growth-Oriented';
    if (score >= 40) return 'Balanced';
    if (score >= 20) return 'Conservative';
    return 'Very Conservative';
  };

  // Helper function to get knowledge level label
  const getKnowledgeLevelLabel = (score?: number): string => {
    if (!score) return 'N/A';
    if (score >= 80) return 'Expert';
    if (score >= 60) return 'Advanced';
    if (score >= 40) return 'Intermediate';
    if (score >= 20) return 'Beginner';
    return 'Novice';
  };

  return (
    <PageContainer>
      <PageHeader
        icon={Compass}
        title="Investment Explorer"
        description="Your personalized investment profile, recommendations, and portfolio insights"
      />

      {error && (
        <div className={SPACING.page.tight}>
          <div className="flex items-center gap-3 text-destructive bg-destructive/10 p-4 rounded-lg border border-destructive/20">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

        {/* Quick Reference Card */}
        {(assessmentResults || recommendations || assessmentLoading || recommendationsLoading) && (
          <PortfolioQuickReference
            riskProfile={assessmentResults?.scoreData?.riskProfile}
            knowledgeLevel={assessmentResults?.scoreData?.knowledgeLevel}
            allocations={recommendations?.adjustedAllocations}
            diversificationScore={recommendations?.diversificationAnalysis?.diversificationScore}
            isLoading={assessmentLoading || recommendationsLoading}
            sessionId={sessionId}
          />
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className={SPACING.page.subsection}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid h-auto p-1 bg-muted/50">
            <TabsTrigger 
              value="profile" 
              className="gap-2 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">My Profile</span>
              <span className="sm:hidden">Profile</span>
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="gap-2 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">AI Chat</span>
              <span className="sm:hidden">Chat</span>
            </TabsTrigger>
            <TabsTrigger 
              value="simulator" 
              className="gap-2 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Portfolio Simulator</span>
              <span className="sm:hidden">Simulator</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analyzer" 
              className="gap-2 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Asset Analyzer</span>
              <span className="sm:hidden">Analyzer</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6 space-y-6">
            {assessmentLoading || recommendationsLoading ? (
              <LoadingState 
                title="Loading Your Investment Profile"
                subtitle="Analyzing your assessment results and preparing personalized recommendations"
              />
            ) : !assessmentResults?.scoreData && !recommendations?.adjustedAllocations ? (
              <EnhancedEmptyState
                icon={TrendingUp}
                title="No Assessment Data Available"
                description="Complete your investment assessment to see your personalized risk profile, portfolio recommendations, and diversification analysis."
                actionText="Complete Assessment"
                onAction={() => navigate('/assessment')}
              />
            ) : (
              <>
                {/* Risk Profile Section */}
                {assessmentResults?.scoreData && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">Risk Profile</CardTitle>
                          <CardDescription>
                            Your investment risk tolerance and personality assessment
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-lg px-4 py-2">
                          {getRiskProfileLabel(assessmentResults.scoreData.riskProfile)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Risk Profile Score</span>
                            <span className="text-2xl font-bold">{assessmentResults.scoreData.riskProfile}%</span>
                          </div>
                          <Progress value={assessmentResults.scoreData.riskProfile} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Knowledge Level</span>
                            <span className="text-2xl font-bold">{assessmentResults.scoreData.knowledgeLevel}%</span>
                          </div>
                          <Progress value={assessmentResults.scoreData.knowledgeLevel} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {getKnowledgeLevelLabel(assessmentResults.scoreData.knowledgeLevel)}
                          </p>
                        </div>
                      </div>
                      {assessmentResults.scoreData && (
                        <div className="h-[300px]">
                          <RiskProfileChart
                            data={{
                              riskProfile: assessmentResults.scoreData.riskProfile,
                              knowledgeLevel: assessmentResults.scoreData.knowledgeLevel,
                              leverageAptitude: assessmentResults.scoreData.leverageAptitude,
                              decisionStyleScore: assessmentResults.scoreData.decisionStyleScore,
                              personalityScore: assessmentResults.scoreData.personalityScore,
                            }}
                            confidenceMetrics={assessmentResults.confidence}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Portfolio Allocation Section */}
                {recommendations?.adjustedAllocations ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">Recommended Portfolio Allocation</CardTitle>
                          <CardDescription>
                            Optimal asset distribution based on your risk profile and goals
                          </CardDescription>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className="p-1 rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                aria-label="About portfolio allocation"
                              >
                                <Info className="h-4 w-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>This allocation is personalized based on your assessment results and investment goals.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="min-h-[400px]">
                        <PortfolioAllocation
                          allocations={recommendations.adjustedAllocations}
                          recommendedMetrics={recommendations.recommendedMetrics}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <EnhancedEmptyState
                    icon={PieChart}
                    title="No Portfolio Recommendations Yet"
                    description="Complete your assessment to receive personalized portfolio allocation recommendations based on your risk profile and investment goals."
                    actionText="Complete Assessment"
                    onAction={() => navigate('/assessment')}
                    variant="compact"
                  />
                )}

                {/* Diversification Analysis Section */}
                {recommendations?.diversificationAnalysis && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Diversification Analysis</CardTitle>
                      <CardDescription>
                        Assessment of your portfolio's risk distribution and correlation
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DiversificationAnalysis
                        diversificationScore={recommendations.diversificationAnalysis.diversificationScore}
                        riskAdjustedVolatility={recommendations.diversificationAnalysis.riskAdjustedVolatility}
                        recommendations={recommendations.diversificationAnalysis.recommendations}
                        correlationMatrix={recommendations.diversificationAnalysis.correlationMatrix}
                      />
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          {/* AI Chat Tab */}
          <TabsContent value="chat" className="mt-6">
            <InvestmentExplorerChat 
              sessionId={sessionId!} 
              onError={(error) => setError(error.message)}
            />
          </TabsContent>

          {/* Portfolio Simulator Tab */}
          <TabsContent value="simulator" className="mt-6">
            <PortfolioSimulator
              currentAllocations={recommendations?.adjustedAllocations}
              recommendedAllocations={recommendations?.adjustedAllocations}
              riskProfile={assessmentResults?.scoreData?.riskProfile}
              targetAmount={assessmentResults?.scoreData?.directInputs?.targetAmount}
              investmentHorizon={assessmentResults?.scoreData?.directInputs?.investmentHorizon}
              monthlyContribution={assessmentResults?.scoreData?.directInputs?.monthlyInvestable}
              isLoading={assessmentLoading || recommendationsLoading}
            />
          </TabsContent>

          {/* Asset Analyzer Tab - Lazy loaded */}
          <TabsContent value="analyzer" className="mt-6">
            <Suspense fallback={<LoadingState variant="compact" title="Loading Asset Analyzer" subtitle="Preparing analysis tools..." />}>
              <AssetAnalyzerTab />
            </Suspense>
          </TabsContent>
        </Tabs>
    </PageContainer>
  );
};

// Wrap the InvestmentExplorer component with RouteErrorBoundary
const InvestmentExplorerWithErrorBoundary: React.FC = () => {
  return (
    <RouteErrorBoundary routeName="Investment Explorer" showFullPage={true}>
      <InvestmentExplorer />
    </RouteErrorBoundary>
  );
};

export default InvestmentExplorerWithErrorBoundary; 