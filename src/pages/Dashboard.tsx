import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RiskProfileChart from '@/components/dashboard/RiskProfileChart';
import PortfolioAllocation from '@/components/dashboard/PortfolioAllocation';
import RecommendationCard from '@/components/dashboard/RecommendationCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { mockAssessmentResult, mockPortfolioAllocation, mockRecommendations } from '@/lib/mock/mockData';

const Dashboard: React.FC = () => {
  const assessmentResult = mockAssessmentResult;
  const portfolioAllocation = mockPortfolioAllocation;
  const recommendations = mockRecommendations;
  
  // Convert assessment result to radar chart data format
  const radarData = {
    riskProfile: assessmentResult.riskProfile,
    knowledgeLevel: assessmentResult.knowledgeLevel,
    leverageAptitude: assessmentResult.leverageAptitude,
    decisionStyleScore: assessmentResult.decisionStyleScore,
    personalityScore: assessmentResult.personalityScore
  };
  
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Your Financial Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Welcome to your personalized dashboard. Here's an overview of your financial profile and recommendations.
        </p>
      </div>
      
      {/* Profile Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Investment Profile: {assessmentResult.profile}</CardTitle>
          <CardDescription>
            Overall Score: {assessmentResult.finalScore}/10
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Profile Analysis</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Risk Tolerance</span>
                    <span className="font-medium">{assessmentResult.riskProfile}/10</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${assessmentResult.riskProfile * 10}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Knowledge Level</span>
                    <span className="font-medium">{assessmentResult.knowledgeLevel}/10</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${assessmentResult.knowledgeLevel * 10}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Decision Style</span>
                    <span className="font-medium">{assessmentResult.decisionStyleScore}/10</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${assessmentResult.decisionStyleScore * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button asChild>
                  <Link to="/assessment">Retake Assessment</Link>
                </Button>
              </div>
            </div>
            
            <div className="h-[300px]">
              <RiskProfileChart data={radarData} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Portfolio & Recommendations Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Portfolio Allocation */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Recommended Portfolio Allocation</CardTitle>
            <CardDescription>
              Based on your risk profile and investment goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PortfolioAllocation 
              allocations={portfolioAllocation}
              recommendedMetrics={portfolioAllocation.recommendedMetrics}
            />
          </CardContent>
        </Card>
        
        {/* Top Recommendations */}
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>
                Actions to improve your financial health
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/recommendations" className="flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  title={rec.title}
                  description={rec.description}
                  priority={rec.priority as "High" | "Medium" | "Low"}
                  category={rec.category}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Learning Progress Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Learning Progress</CardTitle>
            <CardDescription>
              Continue your financial education journey
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/learning" className="flex items-center gap-1">
              <span>View All Modules</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Overall Learning Progress</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: '45%' }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="font-medium">Completed</div>
                  <div className="text-2xl font-bold">1</div>
                  <div className="text-xs text-muted-foreground">modules</div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="font-medium">In Progress</div>
                  <div className="text-2xl font-bold">2</div>
                  <div className="text-xs text-muted-foreground">modules</div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-gray-400">
                <CardContent className="p-4">
                  <div className="font-medium">Not Started</div>
                  <div className="text-2xl font-bold">1</div>
                  <div className="text-xs text-muted-foreground">modules</div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="p-4">
                  <div className="font-medium">Suggested</div>
                  <div className="text-2xl font-bold">2</div>
                  <div className="text-xs text-muted-foreground">new modules</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
