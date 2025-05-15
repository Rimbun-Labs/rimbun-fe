import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { getUserSessions } from '@/lib/api/userResponsesApi';
import { getRecommendations } from '@/lib/api/recommendationApi';
import { getAssessmentResults } from '@/lib/api/assessmentApi';
import { AssessmentLoading } from '@/components/assessment/AssessmentLoading';
import { AssessmentError } from '@/components/assessment/AssessmentError';
import { RecommendedMetricsWithWeights } from '@/lib/api/types/metrics';

// Component imports
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import EducationalInsights from '@/components/dashboard/EducationalInsights';
import ActionItems from '@/components/dashboard/ActionItems';
import PortfolioAllocation from '@/components/dashboard/PortfolioAllocation';
import DirectInputs from '@/components/dashboard/DirectInputs';
import RiskProfileChart from '@/components/dashboard/RiskProfileChart';

const Dashboard = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { session, setSession } = useSession();
  
  console.log('Dashboard - Current session:', session);
  
  // Get assessment results
  const { data: assessmentResults, isLoading: assessmentLoading, error: assessmentError } = useQuery({
    queryKey: ['assessmentResults', sessionId],
    queryFn: () => {
      console.log('Fetching assessment results for response group:', sessionId);
      return getAssessmentResults(sessionId!);
    },
    enabled: !!sessionId
  });

  // Get recommendations
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ['recommendations', sessionId],
    queryFn: () => {
      console.log('Fetching recommendations for response group:', sessionId);
      return getRecommendations(sessionId!);
    },
    enabled: !!sessionId
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
    return <AssessmentLoading />;
  }

  if (assessmentError || !sessionId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <AssessmentError 
            onRetry={() => {
              // Retry the query
            }}
          />
        </div>
      </div>
    );
  }

  const getReadableProfile = (profile: string): string => {
    return profile.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header Section */}
      <DashboardHeader />
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Assessment Results - Radar Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Your Assessment Results</h2>
            <div className="h-[400px]">
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

            {/* Profile Summary */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Profile Summary</h3>
              <div className="text-sm">
                <p className="mb-2">
                  Your profile is classified as <span className="font-medium">{getReadableProfile(assessmentResults?.scoreData.profile || '')}</span>, with a 
                  risk tolerance score of <span className="font-medium">{assessmentResults?.scoreData.riskProfile}</span> and 
                  knowledge level of <span className="font-medium">{assessmentResults?.scoreData.knowledgeLevel}</span>.
                </p>
                <p>
                  This means you're likely comfortable with {assessmentResults?.scoreData.profile === "CONSERVATIVE" ? "lower" : 
                    assessmentResults?.scoreData.profile === "AGGRESSIVE" ? "higher" : "moderate"} levels of investment risk.
                  Your learning recommendations are tailored to your current knowledge level.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  {assessmentResults?.scoreData.profile === "CONSERVATIVE" ? "Safety-focused" : 
                    assessmentResults?.scoreData.profile === "AGGRESSIVE" ? "Growth-oriented" : "Balanced approach"}
                </div>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  {assessmentResults?.scoreData.knowledgeLevel < 40 ? "Beginner" : 
                    assessmentResults?.scoreData.knowledgeLevel < 70 ? "Intermediate" : "Advanced"} knowledge
                </div>
              </div>
            </div>
          </div>
          
          {/* Direct Inputs */}
          <DirectInputs 
            inputs={assessmentResults?.scoreData?.directInputs}
            loading={isLoading}
          />
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Portfolio Allocation */}
          <PortfolioAllocation 
            allocations={recommendations?.adjustedAllocations || {
              EQUITIES: 0,
              BONDS: 0,
              REAL_ESTATE: 0,
              CASH: 0
            }}
            recommendedMetrics={recommendations?.recommendedMetrics as RecommendedMetricsWithWeights}
            loading={recommendationsLoading}
          />
          
          {/* Action Items */}
          <ActionItems 
            recommendations={recommendations?.adjustedAllocations} 
            loading={isLoading} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
