import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, RefreshCw, CheckCircle2 } from 'lucide-react';

interface AssessmentCompletedInterstitialProps {
  sessionId: string;
  onViewResults: () => void;
  onRetake: () => void;
}

export const AssessmentCompletedInterstitial: React.FC<AssessmentCompletedInterstitialProps> = ({
  sessionId,
  onViewResults,
  onRetake,
}) => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Assessment Completed</h1>
          <p className="text-lg text-muted-foreground">
            You've already completed your investment assessment. What would you like to do?
          </p>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Your Assessment Results
            </CardTitle>
            <CardDescription>
              View your personalized investment profile and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              size="lg" 
              onClick={onViewResults}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              View My Results
              <BarChart3 className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Retake Assessment
            </CardTitle>
            <CardDescription>
              Start a new assessment to update your investment profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-amber-100 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Note:</strong> Your previous assessment results will be preserved, but this new assessment will become your primary profile.
                </p>
              </div>
              <Button 
                size="lg" 
                variant="outline"
                onClick={onRetake}
                className="w-full"
              >
                Retake Assessment
                <RefreshCw className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


