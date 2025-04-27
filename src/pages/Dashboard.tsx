
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleChevronRight } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import RiskProfileChart from '@/components/dashboard/RiskProfileChart';
import PortfolioAllocation from '@/components/dashboard/PortfolioAllocation';
import RecommendationCard from '@/components/dashboard/RecommendationCard';
import LearningProgress from '@/components/dashboard/LearningProgress';
import { Skeleton } from '@/components/ui/skeleton';
import { mockAssessmentResult, mockPortfolioAllocation, mockLearningModules, mockRecommendations } from '@/lib/mock/mockData';
import { getRecommendations } from '@/lib/api/assessmentApi';

const Dashboard = () => {
  const navigate = useNavigate();
  
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
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Your Financial Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and portfolio insights</p>
        </div>
        <Button className="mt-4 md:mt-0" onClick={() => navigate('/assessment')}>
          Retake Assessment
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Risk Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Risk Profile</CardTitle>
            <CardDescription>Based on your assessment responses</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {profileLoading ? (
              <div className="h-full flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : profile ? (
              <RiskProfileChart data={profile} confidenceMetrics={profile.confidenceMetrics} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p>No risk profile data available</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Profile: <span className="font-medium">{profile?.profile || 'Unknown'}</span> • 
              Final Score: <span className="font-medium">{profile?.finalScore || 'N/A'}</span>
            </p>
          </CardFooter>
        </Card>
        
        {/* Portfolio Allocation Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Portfolio</CardTitle>
            <CardDescription>Optimal asset allocation based on your profile</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {portfolioLoading || recommendationsLoading ? (
              <div className="h-full flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (portfolioData && recommendationsData) ? (
              <PortfolioAllocation 
                allocations={portfolioData} 
                recommendedMetrics={recommendationsData.recommendedMetrics}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p>No portfolio data available</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="link" className="ml-auto flex items-center gap-1 p-0">
              Customize Portfolio <CircleChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Recommendations Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Personalized Recommendations</h2>
          <Button variant="outline" size="sm">View All</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendationsLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-[160px]">
                <Skeleton className="h-full w-full" />
              </div>
            ))
          ) : mockRecommendations.map((rec) => (
            <RecommendationCard 
              key={rec.id} 
              title={rec.title}
              description={rec.description}
              priority={rec.priority}
              category={rec.category}
            />
          ))}
        </div>
      </div>
      
      {/* Learning Progress Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Learning Progress</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/learning')}>
            View Courses
          </Button>
        </div>
        
        {learningLoading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : (
          <LearningProgress 
            completedModules={completedModules}
            totalModules={learningModules?.length || 0}
            currentModule={currentModule && {
              id: currentModule.id,
              name: currentModule.title,
              progress: currentModule.progress
            }}
            achievements={achievements}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
