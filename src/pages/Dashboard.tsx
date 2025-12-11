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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ChevronRight, Info, AlertCircle, BarChart3, Lightbulb, TrendingUp, Shield, PieChart, DollarSign } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EnhancedEmptyState } from "@/components/ui/enhanced-empty-state";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
    profile: boolean;
    portfolio: boolean;
    insights: boolean;
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
    profile: false,
    portfolio: false,
    insights: false
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
  } = useSpendingData(userService.getDatabaseUserId() || '');

  // Get cash flow data
  const { 
    data: cashFlowData, 
    isLoading: cashFlowLoading, 
    error: cashFlowError 
  } = useCashFlowProjections(userService.getDatabaseUserId() || '');

  const refreshCashFlowMutation = useRefreshCashFlowProjections(userService.getDatabaseUserId() || '');

  // Get goals data for checklist
  const { 
    data: goalsData, 
    isLoading: goalsLoading 
  } = useGoalsOverview(userService.getDatabaseUserId() || '', false);

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
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
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
          <div className="w-full space-y-8">
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
                <CardTitle className="text-xl text-destructive">Error Loading Dashboard</CardTitle>
                <CardDescription>
                  There was a problem loading your dashboard data. Please try again.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <p>Failed to load assessment results. The assessment might not be complete yet.</p>
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
            {/* Financial Progress Section - Combined Spending & Cash Flow */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Your Financial Progress
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
                      <EnhancedEmptyState
                        icon={DollarSign}
                        title="No Spending Data Yet"
                        description="Add your spending information to see insights, recommendations, and track your financial progress"
                        actionText="Set Up Spending Analysis"
                        onAction={() => navigate('/financial-planning?tab=current')}
                        variant="compact"
                      />
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
                      <EnhancedEmptyState
                        icon={TrendingUp}
                        title="Complete Assessment to See Projections"
                        description="Finish your investment assessment to unlock cash flow projections and goal tracking insights"
                        actionText="Complete Assessment"
                        onAction={() => navigate('/assessment')}
                        variant="compact"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investment Profile Section */}
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl">Your Investment Profile</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="p-1 rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          aria-label="About your investment profile"
                        >
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Click 'Learn More' to see detailed explanations of your risk profile, knowledge level, and decision style</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('profile')}
                  className="flex items-center gap-2 self-start sm:self-auto"
                >
                  {expandedSections.profile ? 'Show Less' : 'Learn More'}
                  {expandedSections.profile ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                {/* Always Visible: Radar Chart */}
                <div className="h-[300px] sm:h-[350px] md:h-[400px] w-full mb-6">
                  <RiskProfileChart 
                    data={{
                      riskProfile: Math.min(assessmentResults?.scoreData?.riskProfile || 0, 100),
                      knowledgeLevel: Math.min(assessmentResults?.scoreData?.knowledgeLevel || 0, 100),
                      leverageAptitude: Math.min(assessmentResults?.scoreData?.leverageAptitude || 0, 100),
                      decisionStyleScore: Math.min(assessmentResults?.scoreData?.decisionStyleScore || 0, 100),
                      personalityScore: Math.min(assessmentResults?.scoreData?.personalityScore || 0, 100)
                    }}
                    confidenceMetrics={assessmentResults?.scoreData?.confidenceMetrics}
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
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl">Your Portfolio Breakdown</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="p-1 rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          aria-label="About your portfolio breakdown"
                        >
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Click 'Learn More' to see detailed explanations of each asset class (equities, bonds, real estate, cash) and their role in your portfolio</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('portfolio')}
                  className="flex items-center gap-2 self-start sm:self-auto"
                >
                  {expandedSections.portfolio ? 'Show Less' : 'Learn More'}
                  {expandedSections.portfolio ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                {/* Always Visible: Portfolio Allocation Chart */}
                <div className="min-h-[250px] sm:min-h-[300px] mb-6">
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
                          <div className="space-y-3">
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
                          <div className="space-y-3">
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
                          <div className="space-y-3">
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
                          <div className="space-y-3">
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

            {/* Investment Insights Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl">Investment Insights</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="p-1 rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          aria-label="About investment insights"
                        >
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Click 'Learn More' to explore investment scenarios, diversification analysis, and portfolio strategy recommendations</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                {/* Always Visible: Portfolio Strategy Summary */}
                {recommendationsLoading ? (
                  <div className="mb-6 py-4">
                    <LoadingState variant="compact" lines={2} />
                  </div>
                ) : recommendations?.diversificationAnalysis ? (
                  <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Diversification Score */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Diversification Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold">
                                {(recommendations.diversificationAnalysis.diversificationScore * 100).toFixed(0)}%
                              </span>
                              <Badge 
                                className={
                                  recommendations.diversificationAnalysis.diversificationScore >= 0.8 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : recommendations.diversificationAnalysis.diversificationScore >= 0.6
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }
                              >
                                {recommendations.diversificationAnalysis.diversificationScore >= 0.8 
                                  ? 'Excellent' 
                                  : recommendations.diversificationAnalysis.diversificationScore >= 0.6
                                  ? 'Good'
                                  : 'Needs Improvement'}
                              </Badge>
                            </div>
                            <Progress 
                              value={recommendations.diversificationAnalysis.diversificationScore * 100} 
                              className="h-2" 
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Risk-Adjusted Volatility */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Risk-Adjusted Volatility</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold">
                                {recommendations.diversificationAnalysis.riskAdjustedVolatility.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Lower is better for risk management
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Portfolio Strategy Insight */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Portfolio Strategy</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="text-sm text-foreground">
                              {recommendations.diversificationAnalysis.diversificationScore >= 0.8
                                ? 'Well-diversified portfolio with balanced risk'
                                : recommendations.diversificationAnalysis.diversificationScore >= 0.6
                                ? 'Moderately diversified portfolio'
                                : 'Consider diversifying across more asset classes'}
                            </p>
                            {recommendations.diversificationAnalysis.recommendations && recommendations.diversificationAnalysis.recommendations.length > 0 && (
                              <p className="text-xs text-muted-foreground">
                                {recommendations.diversificationAnalysis.recommendations[0]}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground text-center">
                      Complete your assessment to see portfolio strategy insights
                    </p>
                  </div>
                )}

                {/* Expanded Content: Detailed Analysis */}
                {expandedSections.insights && (
                  <div className="space-y-6">
                    {/* Investment Scenarios */}
                    {recommendations?.recommendationCalculationData?.goalGapInsights?.investmentScenarios && (
                      <InvestmentScenarios 
                        scenarios={recommendations.recommendationCalculationData.goalGapInsights.investmentScenarios}
                        targetAmount={assessmentResults?.scoreData?.directInputs?.targetAmount || 0}
                        investmentHorizon={assessmentResults?.scoreData?.directInputs?.investmentHorizon || 0}
                        loading={assessmentLoading}
                      />
                    )}

                    {/* Diversification Analysis */}
                    {recommendations?.diversificationAnalysis && (
                      <DiversificationAnalysis 
                        diversificationScore={recommendations.diversificationAnalysis.diversificationScore}
                        riskAdjustedVolatility={recommendations.diversificationAnalysis.riskAdjustedVolatility}
                        recommendations={recommendations.diversificationAnalysis.recommendations}
                        correlationMatrix={recommendations.diversificationAnalysis.correlationMatrix}
                      />
                    )}

                    {/* Portfolio Interaction */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">How do your investments work together?</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <PortfolioInteractionExplanation 
                          riskAdjustedVolatility={recommendations?.diversificationAnalysis?.riskAdjustedVolatility || 0}
                          riskProfile={assessmentResults?.scoreData.riskProfile || 0}
                          diversificationScore={recommendations?.diversificationAnalysis?.diversificationScore || 0}
                        />
                      </CardContent>
                    </Card>

                    {/* Correlation Analysis */}
                    {recommendations?.diversificationAnalysis?.correlationMatrix && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Asset Correlation Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CorrelationExplanation 
                            correlationMatrix={recommendations.diversificationAnalysis.correlationMatrix}
                            allocations={recommendations?.adjustedAllocations || {
                              equities: 0,
                              bonds: 0,
                              realEstate: 0,
                              cash: 0
                            }}
                            riskProfile={assessmentResults?.scoreData.riskProfile || 0}
                            investmentHorizon={assessmentResults?.scoreData?.directInputs?.investmentHorizon || 0}
                            goal={(assessmentResults?.scoreData?.directInputs?.financialGoal as 'retirement' | 'house' | 'wealth' | 'education' | 'other') || 'wealth'}
                            knowledgeLevel={
                              (assessmentResults?.scoreData.knowledgeLevel || 0) < 30 ? 'beginner' :
                              (assessmentResults?.scoreData.knowledgeLevel || 0) < 70 ? 'intermediate' : 'advanced'
                            }
                          />
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
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
