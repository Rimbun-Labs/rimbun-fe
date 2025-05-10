
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockAssessmentResult, mockPortfolioAllocation, mockLearningModules, mockRecommendations } from '@/lib/mock/mockData';
import { getRecommendations } from '@/lib/api/assessmentApi';

// Component imports
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricsOverview from '@/components/dashboard/MetricsOverview';
import EducationalInsights from '@/components/dashboard/EducationalInsights';
import ActionItems from '@/components/dashboard/ActionItems';
import LearningProgressBar from '@/components/dashboard/LearningProgressBar';

const Dashboard = () => {
  // Mock session ID for API calls
  const sessionId = "mock-session-id";
  
  // Get user profile data
  const { data: profile, isPending: profileLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => Promise.resolve(mockAssessmentResult)
  });
  
  // Get portfolio allocation data
  const { data: portfolioData, isPending: portfolioLoading } = useQuery({
    queryKey: ['portfolio-allocation'],
    queryFn: () => Promise.resolve(mockPortfolioAllocation)
  });
  
  // Get recommendations data
  const { data: recommendationsData, isPending: recommendationsLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => getRecommendations(sessionId)
  });
  
  // Get learning modules data
  const { data: learningModules, isPending: learningLoading } = useQuery({
    queryKey: ['learning-modules'],
    queryFn: () => Promise.resolve(mockLearningModules)
  });
  
  const completedModules = learningModules?.filter(m => m.progress === 100).length || 0;
  const totalModules = learningModules?.length || 0;
  
  // Filter recommendations to only show high priority ones for the dashboard
  const topRecommendations = mockRecommendations
    .filter(rec => rec.priority === "High")
    .slice(0, 2);
  
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header Section */}
      <DashboardHeader />
      
      {/* Analytics Overview */}
      <MetricsOverview />
      
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Educational Insights */}
        <EducationalInsights 
          profile={profile}
          portfolioData={portfolioData}
          profileLoading={profileLoading}
          portfolioLoading={portfolioLoading}
        />
        
        {/* Right Column: Action Items and Learning Progress */}
        <div className="space-y-6">
          {/* Action Items Section */}
          <ActionItems 
            recommendations={topRecommendations} 
            loading={recommendationsLoading} 
          />
          
          {/* Learning Progress Bar */}
          <LearningProgressBar 
            completedModules={completedModules}
            totalModules={totalModules}
            loading={learningLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
