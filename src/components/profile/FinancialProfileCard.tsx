import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useProfile } from '@/contexts/ProfileContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FinancialProfileCard = () => {
  const { profile, isLoading, error } = useProfile();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Financial Profile</CardTitle>
          <CardDescription>Based on your assessment results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center py-8">
            <LoadingSpinner size="lg" variant="primary" />
            <p className="text-sm text-muted-foreground mt-4">Loading your financial profile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Financial Profile</CardTitle>
          <CardDescription>Based on your assessment results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center space-y-4 py-8">
            <div className="p-3 rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Error Loading Profile</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {error || "Failed to load financial profile"}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!profile) return null;
  
  const { financialProfile } = profile;
  
  const riskLevelDescription = () => {
    switch (financialProfile.riskProfile) {
      case 'CONSERVATIVE':
        return 'Focus on capital preservation with minimal risk exposure';
      case 'MODERATE':
        return 'Balanced approach with moderate risk for long-term growth';
      case 'AGGRESSIVE':
        return 'Higher risk exposure for potentially greater returns';
      default:
        return 'Custom risk profile based on your assessment';
    }
  };
  
  const knowledgeLevelDescription = () => {
    switch (financialProfile.knowledgeLevel) {
      case 'BEGINNER':
        return 'Understanding basic investment concepts';
      case 'INTERMEDIATE':
        return 'Familiar with major investment types and strategies';
      case 'ADVANCED':
        return 'Comprehensive understanding of complex investment concepts';
      default:
        return 'Custom knowledge level based on your assessment';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Profile</CardTitle>
        <CardDescription>Based on your assessment results</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile Summary</TabsTrigger>
            <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6 pt-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <h3 className="font-medium text-sm">Risk Profile</h3>
                <span className="text-sm font-bold">{financialProfile.riskProfile}</span>
              </div>
              <p className="text-xs text-muted-foreground">{riskLevelDescription()}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <h3 className="font-medium text-sm">Knowledge Level</h3>
                <span className="text-sm font-bold">{financialProfile.knowledgeLevel}</span>
              </div>
              <p className="text-xs text-muted-foreground">{knowledgeLevelDescription()}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <h3 className="font-medium text-sm">Investment Horizon</h3>
                <span className="text-sm font-bold">{financialProfile.investmentHorizon} years</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Your planned investment timeframe affects strategy recommendations
              </p>
            </div>
            
            <Button asChild variant="outline" className="w-full mt-2">
              <Link to="/assessment" className="flex items-center justify-center">
                <span>Retake Assessment</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </TabsContent>
          
          <TabsContent value="metrics" className="space-y-6 pt-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <h3 className="font-medium text-sm">Risk Capacity</h3>
                <span className="text-sm font-bold">{financialProfile.riskCapacity}%</span>
              </div>
              <Progress value={financialProfile.riskCapacity} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Your financial ability to endure investment losses
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <h3 className="font-medium text-sm">Leverage Aptitude</h3>
                <span className="text-sm font-bold">{financialProfile.leverageAptitude}%</span>
              </div>
              <Progress value={financialProfile.leverageAptitude} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Your comfort level with using borrowed funds
              </p>
            </div>
            
            <div className="space-y-2 mt-4 pt-4 border-t">
              <h3 className="font-medium text-sm">Assessment History</h3>
              <div className="text-sm">
                {profile.assessmentHistory.length > 0 ? (
                  <div className="space-y-2">
                    {profile.assessmentHistory.slice(0, 2).map((assessment) => (
                      <div key={assessment.id} className="flex justify-between items-center">
                        <span>{assessment.type}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(assessment.date).toLocaleDateString()}
                          </span>
                          <span className="font-medium">Score: {assessment.score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No assessment history found</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FinancialProfileCard;
