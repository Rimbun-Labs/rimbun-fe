
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockAssessmentResult, mockPortfolioAllocation, mockLearningModules, mockRecommendations } from '@/lib/mock/mockData';
import { getRecommendations } from '@/lib/api/assessmentApi';

// Component imports
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricsOverview from '@/components/dashboard/MetricsOverview';
import MainContent from '@/components/dashboard/MainContent';
import AchievementGrid from '@/components/dashboard/AchievementGrid';
import RecommendationsSection from '@/components/dashboard/RecommendationsSection';
import LearningSection from '@/components/dashboard/LearningSection';

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
  const currentModule = learningModules?.find(m => m.progress > 0 && m.progress < 100);
  
  const achievements = [
    { 
      id: "ach1", 
      name: "Risk Profile Complete", 
      description: "Completed the risk assessment questionnaire",
      unlocked: true 
    },
    { 
      id: "ach2", 
      name: "First Module Completed", 
      description: "Finished your first learning module",
      unlocked: completedModules > 0 
    },
    { 
      id: "ach3", 
      name: "Portfolio Strategy Defined", 
      description: "Defined your initial portfolio strategy",
      unlocked: true 
    }
  ];
  
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header Section */}
      <DashboardHeader />
      
      {/* Analytics Overview */}
      <MetricsOverview />
      
      {/* Main Content Grid - Risk Profile and Portfolio */}
      <MainContent 
        profile={profile}
        portfolioData={portfolioData}
        recommendationsData={recommendationsData}
        profileLoading={profileLoading}
        portfolioLoading={portfolioLoading}
        recommendationsLoading={recommendationsLoading}
      />
      
      {/* Achievements Section */}
      <AchievementGrid />
      
      {/* Recommendations Section */}
      <RecommendationsSection 
        recommendations={mockRecommendations} 
        loading={recommendationsLoading} 
      />
      
      {/* Learning Progress Section */}
      <LearningSection 
        completedModules={completedModules}
        totalModules={learningModules?.length || 0}
        currentModule={currentModule}
        achievements={achievements}
        loading={learningLoading}
      />
    </div>
  );
};

export default Dashboard;
