import React, { useEffect, useState, useReducer, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { getUserSessions } from '@/lib/api/userResponsesApi';
import { getRecommendations } from '@/lib/api/recommendationApi';
import { userService } from '@/lib/api/userService';
// Removed environmentStorage - using API-first approach
import { RecommendedMetricsWithWeights } from '@/lib/api/types/metrics';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { RouteErrorBoundary } from '@/components/error/RouteErrorBoundary';
import { useAssessmentResume } from '@/hooks/useAssessmentResume';
import { getAssessmentResults, getLatestAssessmentResults } from '@/lib/api/assessmentApi';
import { config } from '@/lib/api/config';

// Component imports
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import OnboardingChecklist from '@/components/dashboard/OnboardingChecklist';
import PortfolioAllocation from '@/components/dashboard/PortfolioAllocation';
import RiskProfileChart from '@/components/dashboard/RiskProfileChart';
import DiversificationAnalysis from '@/components/recommendations/DiversificationAnalysis';
import BankingProductsSection from '@/components/dashboard/BankingProductsSection';
import InvestmentHoldingsSection from '@/components/dashboard/InvestmentHoldingsSection';
import LearningPathSection from '@/components/dashboard/LearningPathSection';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ChevronRight, Info, AlertCircle, BarChart3, Lightbulb, TrendingUp, Shield, PieChart, DollarSign } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EnhancedEmptyState } from "@/components/ui/enhanced-empty-state";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SPACING } from '@/lib/constants/spacing';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import InvestmentScenarios from '@/components/dashboard/InvestmentScenarios';
import { useSpendingData } from '@/hooks/useSpendingData';
import { useCashFlowProjections, useRefreshCashFlowProjections } from '@/hooks/useCashFlowData';
import { useFormatters } from '@/hooks/useFormatters';
import { useGoalsOverview } from '@/hooks/useGoals';
import { getLearningProgress } from '@/lib/api/profileApi';
import { useBankingProfile } from '@/hooks/useBankingProducts';

// Types
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

// Dashboard state interface
interface DashboardState {
  expandedSections: {
    banking: boolean;
    portfolio: boolean;
    learning: boolean;
  };
  showWelcome: boolean;
  loading: boolean;
}

// Dashboard action types
type DashboardAction = 
  | { type: 'TOGGLE_SECTION'; section: keyof DashboardState['expandedSections'] }
  | { type: 'SET_WELCOME'; show: boolean }
  | { type: 'SET_LOADING'; loading: boolean };

// Dashboard reducer
const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case 'TOGGLE_SECTION':
      return {
        ...state,
        expandedSections: {
          ...state.expandedSections,
          [action.section]: !state.expandedSections[action.section]
        }
      };
    case 'SET_WELCOME':
      return {
        ...state,
        showWelcome: action.show
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.loading
      };
    default:
      return state;
  }
};

// Initial state
const initialState: DashboardState = {
  expandedSections: {
    banking: false,
    portfolio: false,
    learning: false
  },
  showWelcome: false,
  loading: false
};

// Utility functions
const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreLabel = (score: number) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  return 'Needs Improvement';
};

const getRiskProfileLabel = (riskProfile: number) => {
  if (riskProfile >= 80) return 'Very Aggressive';
  if (riskProfile >= 60) return 'Aggressive';
  if (riskProfile >= 40) return 'Moderate';
  if (riskProfile >= 20) return 'Conservative';
  return 'Very Conservative';
};


const Dashboard = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { session, setSession, isLoading: sessionLoading } = useSession();
  const { userRegistrationComplete, user } = useAuth();
  
  // Use sessionId from params or fall back to session context
  const effectiveSessionId = sessionId || session?.id;
  
  // Use reducer for state management
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const { expandedSections, showWelcome, loading } = state;
  
  // Progressive hint state
  const [showExpandHint, setShowExpandHint] = useState(() => {
    const hasSeen = localStorage.getItem('hasSeenExpandHint');
    return !hasSeen;
  });

  // Onboarding checklist state
  const [showChecklist, setShowChecklist] = useState(() => {
    const dismissed = localStorage.getItem('onboardingChecklistDismissed');
    return !dismissed && effectiveSessionId && session?.isCompleted;
  });

  // Update checklist visibility when assessment is completed
  useEffect(() => {
    if (effectiveSessionId && session?.isCompleted) {
      const dismissed = localStorage.getItem('onboardingChecklistDismissed');
      if (!dismissed) {
        setShowChecklist(true);
      }
      // Mark dashboard as visited
      localStorage.setItem('hasVisitedDashboard', 'true');
    }
  }, [effectiveSessionId, session?.isCompleted]);
  
  // Get assessment results for the current session
  const { data: assessmentResults, isLoading: assessmentLoading, error: assessmentError } = useQuery({
    queryKey: ['assessment-results', effectiveSessionId],
    queryFn: () => getAssessmentResults(effectiveSessionId!),
    enabled: !!effectiveSessionId,
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Check for incomplete sessions (efficiently using isCompleted field)
  const { data: incompleteSessions } = useQuery({
    queryKey: ['incomplete-sessions', userService.getDatabaseUserId()],
    queryFn: async () => {
      const databaseUserId = userService.getDatabaseUserId();
      if (!databaseUserId) return [];
      
      const userSessions = await getUserSessions(databaseUserId);
      // Filter incomplete sessions using isCompleted field (efficient)
      const incompleteSessions = userSessions.filter((session: any) => session.isCompleted === false);
      
      return incompleteSessions;
    },
    enabled: !!userService.getDatabaseUserId(),
    staleTime: 30 * 1000, // 30 seconds
  });

  // Check for completed assessments before showing welcome modal
  const { data: hasCompletedAssessment, isLoading: checkingCompletedAssessment } = useQuery({
    queryKey: ['check-completed-assessment', userService.getDatabaseUserId()],
    queryFn: async () => {
      const results = await getLatestAssessmentResults();
      return !!results; // Return true if there are any completed assessments
    },
    enabled: !!userService.getDatabaseUserId() && !effectiveSessionId && !session?.isCompleted,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get recommendations
  const { data: recommendations, isLoading: recommendationsLoading, refetch: refetchRecommendations } = useQuery({
    queryKey: ['recommendations', effectiveSessionId],
    queryFn: () => getRecommendations(effectiveSessionId!),
    enabled: !!effectiveSessionId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  // Get spending data
  const { 
    data: spendingData, 
    isLoading: spendingLoading, 
    error: spendingError 
  } = useSpendingData();

  // Get cash flow data
  const { 
    data: cashFlowData, 
    isLoading: cashFlowLoading, 
    error: cashFlowError 
  } = useCashFlowProjections();

  const refreshCashFlowMutation = useRefreshCashFlowProjections();

  // Get goals data for checklist
  const { 
    data: goalsData, 
    isLoading: goalsLoading 
  } = useGoalsOverview(false);

  // Get learning progress for checklist
  const { 
    data: learningProgress, 
    isLoading: learningProgressLoading 
  } = useQuery({
    queryKey: ['learning-progress', userService.getDatabaseUserId()],
    queryFn: () => getLearningProgress(userService.getDatabaseUserId() || ''),
    enabled: !!userService.getDatabaseUserId(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get banking profile for checklist
  const { data: bankingProfile } = useBankingProfile();
  const hasBankingProducts = !!(bankingProfile && bankingProfile.products && bankingProfile.products.length > 0);

  const { formatCurrency, formatPercentage } = useFormatters();

  // Memoize loading state - include checking for completed assessments AND data availability
  // Keep spinner showing until data is actually available, not just when API calls finish
  const isLoading = useMemo(() =>
    sessionLoading || // Show loading while SessionContext is determining session
    checkingCompletedAssessment || 
    ((assessmentLoading || recommendationsLoading) && effectiveSessionId) ||
    (effectiveSessionId && (!assessmentResults || !recommendations)),
    [sessionLoading, assessmentLoading, recommendationsLoading, effectiveSessionId, checkingCompletedAssessment, assessmentResults, recommendations]
  );

  // Session state is managed by SessionContext

  // Show welcome modal for new users without assessment
  useEffect(() => {
    // Only check after user registration is complete
    if (!userRegistrationComplete) {
      return;
    }

    // Wait for assessment check to complete
    if (checkingCompletedAssessment) {
      return;
    }

    // Don't show modal if user has completed assessment
    if (hasCompletedAssessment === true) {
      return;
    }

    // Don't show modal if there's an effective session or current session is completed
    if (effectiveSessionId || session?.isCompleted) {
      return;
    }

    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      dispatch({ type: 'SET_WELCOME', show: true });
    }
  }, [effectiveSessionId, session?.isCompleted, hasCompletedAssessment, userRegistrationComplete, checkingCompletedAssessment]);

  // Memoize utility functions
  const getReadableProfile = useMemo(() => (profile: string): string => {
    return profile.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  }, []);

  // Memoize event handlers
  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    dispatch({ type: 'TOGGLE_SECTION', section });
  }, [expandedSections]);

  const handleCloseWelcome = useCallback(() => {
    dispatch({ type: 'SET_WELCOME', show: false });
    localStorage.setItem('hasSeenWelcome', 'true');
  }, []);

  const handleStartAssessment = useCallback(() => {
    navigate('/assessment');
  }, [navigate]);

  // Resume functionality - navigate to assessment with session ID
  const handleResumeAssessment = useCallback(() => {
    if (incompleteSessions && incompleteSessions.length > 0) {
      const mostRecentIncomplete = incompleteSessions[0]; // Most recent incomplete session
      navigate(`/assessment?sessionId=${mostRecentIncomplete.id}`);
    }
  }, [navigate, incompleteSessions]);

  // Consolidated return with conditional content
  return (
    <div className="min-h-screen bg-background">
      <div className={SPACING.page.container}>
      {/* Loading State */}
      {isLoading && (
        <div className="py-8">
          <LoadingState 
            variant="expanded"
            showTitle
            showSubtitle
            lines={3}
          />
        </div>
      )}

      {/* Welcome/No Session State */}
      {!isLoading && !checkingCompletedAssessment && (!effectiveSessionId || assessmentError) && (
        <div className="py-12">
          <div className={cn("w-full", SPACING.page.section)}>
            {/* Welcome Header */}
            <div className="w-full space-y-4">
              <h1 className="text-4xl font-bold">Welcome to Your Investment Journey!</h1>
              <p className="text-xl text-muted-foreground">
                Complete your personalized assessment to unlock your custom dashboard and learning path.
              </p>
            </div>

            {/* Main CTA Card */}
            <Card className="w-full border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="pt-8 pb-8">
                <div className="space-y-6">
                  {/* Feature Highlight with better layout */}
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <BarChart3 className="h-16 w-16 text-primary" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <h3 className="text-xl font-semibold">Discover Your Investment Profile</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Our comprehensive 10-15 minute assessment will help you understand your risk tolerance, 
                        knowledge level, and investment preferences. This personalized evaluation creates a 
                        foundation for your investment strategy and learning journey.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Complete your assessment to unlock personalized insights, recommendations, and a 
                        customized learning path tailored to your investment goals.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-6 w-full">
              <div className="flex items-start gap-4 p-4 rounded-lg border bg-card/50">
                <div className="flex-shrink-0">
                  <Lightbulb className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">AI-Powered Insights</h4>
                  <p className="text-sm text-muted-foreground">
                    Get personalized recommendations based on your risk profile and investment goals
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg border bg-card/50">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Customized Learning Path</h4>
                  <p className="text-sm text-muted-foreground">
                    Access tailored educational content that matches your knowledge level and interests
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg border bg-card/50">
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Secure & Private</h4>
                  <p className="text-sm text-muted-foreground">
                    Your personal and financial data is protected with enterprise-grade security
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && assessmentError && effectiveSessionId && (
        <div className="py-8">
          <div className="w-full space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-destructive">Dashboard Unavailable</CardTitle>
                <CardDescription>
                  We couldn't load your dashboard. Your session may have expired, or there's a connection issue.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <p>Your assessment results aren't available yet. Complete your assessment to see your dashboard.</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => window.location.reload()}
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
      )}

      {/* Main Dashboard Content */}
      {!isLoading && !assessmentError && effectiveSessionId && (
        <>
          {/* Header Section */}
          <DashboardHeader />
          
          {/* Onboarding Checklist - Show after assessment completion */}
          {showChecklist && effectiveSessionId && session?.isCompleted && (
            <OnboardingChecklist
              assessmentComplete={!!(effectiveSessionId && session?.isCompleted)}
              hasSpendingData={!!spendingData}
              hasGoals={!!(goalsData?.goals && goalsData.goals.length > 0)}
              hasLearningProgress={!!(learningProgress && learningProgress.completedModules > 0)}
              hasBankingProducts={hasBankingProducts}
              sessionId={effectiveSessionId}
              onDismiss={() => {
                localStorage.setItem('onboardingChecklistDismissed', 'true');
                setShowChecklist(false);
              }}
            />
          )}
          
          {/* Progressive Hint - Show once for first-time users */}
          {showExpandHint && effectiveSessionId && (
            <Alert variant="default" className="mb-6 border-primary/20 bg-primary/5">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between gap-4">
                <span>
                  💡 <strong>Tip:</strong> Click "Learn More" on any section to discover detailed insights about your portfolio
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    localStorage.setItem('hasSeenExpandHint', 'true');
                    setShowExpandHint(false);
                  }}
                  className="shrink-0"
                >
                  Got it
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Resume Assessment Section - Only show if user has incomplete session but no completed session */}
          {incompleteSessions && incompleteSessions.length > 0 && !effectiveSessionId && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-orange-900">Continue Your Assessment</h3>
                    <p className="text-sm text-orange-700">
                      You have an incomplete assessment. Resume where you left off.
                    </p>
                  </div>
                  <Button 
                    onClick={handleResumeAssessment} 
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Resume Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Main Content */}
          <div className="space-y-6">
            {/* Financial Status Section - Combined Spending & Cash Flow */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Your Financial Status
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/financial-planning')}
                    className="flex items-center gap-2"
                  >
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Spending Summary */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold">Spending Analysis</h3>
                    </div>
                    {spendingLoading ? (
                      <div className="py-4">
                        <LoadingState variant="compact" lines={2} />
                      </div>
                    ) : spendingData ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Monthly Income</span>
                          <span className="font-medium">{formatCurrency(spendingData.monthlyIncome)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Monthly Spending</span>
                          <span className="font-medium">{formatCurrency(spendingData.monthlySpending)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Savings Rate</span>
                          <span className="font-medium">{formatPercentage(spendingData.savingsRate || 0)}</span>
                        </div>
                        {spendingData.emergencyFundStatus && (
                          <div className="pt-3 border-t">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Emergency Fund</span>
                              <span className="font-medium">
                                {formatCurrency(spendingData.emergencyFundStatus.currentAmount || 0)} / {formatCurrency(spendingData.emergencyFundStatus.recommendedTarget || 0)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <EnhancedEmptyState
                          icon={DollarSign}
                          title="No Spending Data Yet"
                          description="Add your spending information to see insights, recommendations, and track your financial status"
                          actionText="Set Up Spending Analysis"
                          onAction={() => navigate('/financial-planning?tab=current')}
                          variant="compact"
                        />
                        {/* Preview/Teaser Content */}
                        <div className="p-4 rounded-lg bg-muted/30 border border-border">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-foreground">What you'll discover:</p>
                            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                              <li>Your savings rate and how it supports your investment goals</li>
                              <li>Emergency fund status and recommendations</li>
                              <li>Spending trends and optimization opportunities</li>
                              <li>How your cash flow impacts your portfolio strategy</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cash Flow Summary */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold">Cash Flow Projections</h3>
                    </div>
                    {cashFlowLoading ? (
                      <div className="py-4">
                        <LoadingState variant="compact" lines={2} />
                      </div>
                    ) : cashFlowData && !cashFlowData.message ? (
                      <div className="space-y-3">
                        {cashFlowData.cashFlowProjections?.scenarios?.realistic && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">5-Year Projection</span>
                              <span className="font-medium">
                                {formatCurrency(cashFlowData.cashFlowProjections.scenarios.realistic.finalValue)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Goal Progress</span>
                              <span className="font-medium">
                                {cashFlowData.cashFlowProjections.scenarios.realistic.goalAchieved 
                                  ? '100%' 
                                  : `${((cashFlowData.cashFlowProjections.scenarios.realistic.finalValue / cashFlowData.assessment.targetAmount) * 100).toFixed(1)}%`
                                }
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Time to Goal</span>
                              <span className="font-medium">
                                {cashFlowData.cashFlowProjections.scenarios.realistic.monthsToGoal} months
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <EnhancedEmptyState
                          icon={TrendingUp}
                          title="Complete Assessment to See Projections"
                          description="Finish your investment assessment to unlock cash flow projections and goal tracking insights"
                          actionText="Complete Assessment"
                          onAction={() => navigate('/assessment')}
                          variant="compact"
                        />
                        {/* Preview/Teaser Content */}
                        <div className="p-4 rounded-lg bg-muted/30 border border-border">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-foreground">What you'll see:</p>
                            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                              <li>5-year cash flow projections based on your goals</li>
                              <li>Goal progress tracking and timeline estimates</li>
                              <li>Scenario analysis (conservative vs aggressive)</li>
                              <li>How your savings rate affects goal achievement</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Banking Products Section */}
            <BankingProductsSection
              sessionId={effectiveSessionId}
              riskProfile={assessmentResults?.scoreData?.riskProfile}
              investmentGoals={{
                targetAmount: assessmentResults?.scoreData?.directInputs?.targetAmount,
                monthlyContribution: assessmentResults?.scoreData?.directInputs?.monthlyInvestable,
                investmentHorizon: assessmentResults?.scoreData?.directInputs?.investmentHorizon,
              }}
              savingsRate={spendingData?.savingsRate}
            />

            {/* Investment Holdings Section */}
            <InvestmentHoldingsSection
              sessionId={effectiveSessionId}
            />

            {/* Investment Portfolio Section - Moved to Investment Explorer */}
            {/* Detailed portfolio analysis, charts, and recommendations are now in the Investment Explorer page */}

            {/* Learning Path Section */}
            <LearningPathSection
              sessionId={effectiveSessionId}
              knowledgeLevel={assessmentResults?.scoreData?.knowledgeLevel}
              portfolioAllocations={recommendations?.adjustedAllocations}
            />
          </div>
        </>
      )}

      {/* Welcome Modal */}
      <Dialog open={showWelcome} onOpenChange={(open) => dispatch({ type: 'SET_WELCOME', show: open })}>
        <DialogContent className="sm:max-w-2xl p-8">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-2xl">Welcome to InvestLearn!</DialogTitle>
            <DialogDescription className="text-lg">
              Let's get started with your personalized investment journey.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <p className="text-base text-muted-foreground leading-relaxed">
              Complete a quick assessment to unlock your custom dashboard, learning path, and investment recommendations.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-base">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                <span>10-15 minute assessment</span>
              </div>
              <div className="flex items-center gap-3 text-base">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                <span>Personalized recommendations</span>
              </div>
              <div className="flex items-center gap-3 text-base">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                <span>Custom learning path</span>
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-4 pt-6">
            <Button variant="outline" onClick={handleCloseWelcome} className="flex-1 sm:flex-none">
              Maybe Later
            </Button>
            <Button 
              onClick={incompleteSessions && incompleteSessions.length > 0 && !effectiveSessionId ? handleResumeAssessment : handleStartAssessment} 
              className="flex-1 sm:flex-none"
            >
              {incompleteSessions && incompleteSessions.length > 0 && !effectiveSessionId ? 'Resume Assessment' : 'Start Assessment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};

// Wrap the Dashboard component with RouteErrorBoundary
const DashboardWithErrorBoundary: React.FC = () => {
  return (
    <RouteErrorBoundary routeName="Dashboard" showFullPage={true}>
      <Dashboard />
    </RouteErrorBoundary>
  );
};

export default DashboardWithErrorBoundary;
