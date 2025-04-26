import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AssessmentResult } from '@/lib/api/assessmentApi';
import RiskProfileChart from '../dashboard/RiskProfileChart';

interface AssessmentCompleteProps {
  result: AssessmentResult;
}

const AssessmentComplete: React.FC<AssessmentCompleteProps> = ({ result }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Assessment Complete!</h1>
        <p className="text-muted-foreground">
          Thank you for completing your investment profile assessment.
          We've analyzed your responses and prepared your personalized results.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Your Investment Profile</CardTitle>
            <CardDescription>Based on your responses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <span className="block text-4xl font-bold text-primary">{result.profile}</span>
              <span className="text-sm text-muted-foreground">Overall Profile</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Risk Tolerance:</span>
                <span className="font-semibold">{result.riskProfile}/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Knowledge Level:</span>
                <span className="font-semibold">{result.knowledgeLevel}/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Decision Style:</span>
                <span className="font-semibold">{result.decisionStyleScore}/10</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Your Profile Visualization</CardTitle>
            <CardDescription>Overview of your investing preferences</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <RiskProfileChart data={{
              riskProfile: result.riskProfile,
              knowledgeLevel: result.knowledgeLevel,
              leverageAptitude: result.leverageAptitude,
              decisionStyleScore: result.decisionStyleScore,
              personalityScore: result.personalityScore
            }} />
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center gap-4">
        <Button asChild variant="default" size="lg">
          <Link to="/dashboard">View Your Dashboard</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/learning">Explore Learning Modules</Link>
        </Button>
      </div>
    </div>
  );
};

export default AssessmentComplete;
