import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Clock, Shield, Target, ArrowRight } from 'lucide-react';

interface AssessmentStartPageProps {
  mode: 'new' | 'resume' | 'retake';
  onStart: () => void;
  progress?: {
    questionsAnswered: number;
    totalQuestions: number;
    lastAnsweredAt?: string;
  };
}

export const AssessmentStartPage: React.FC<AssessmentStartPageProps> = ({ 
  mode, 
  onStart, 
  progress 
}) => {
  const getProgressPercentage = () => {
    if (!progress) return 0;
    return Math.round((progress.questionsAnswered / progress.totalQuestions) * 100);
  };

  if (mode === 'resume') {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Continue Your Assessment</h1>
            <p className="text-lg text-muted-foreground">
              You have an incomplete assessment. Would you like to continue where you left off?
            </p>
          </div>

          {progress && (
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress.questionsAnswered} of {progress.totalQuestions} questions</span>
                  </div>
                  <Progress value={getProgressPercentage()} />
                  {progress.lastAnsweredAt && (
                    <p className="text-xs text-muted-foreground">
                      Last activity: {new Date(progress.lastAnsweredAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onStart}>
              Resume Assessment
            </Button>
            <Button variant="outline" size="lg" onClick={onStart}>
              Start Over
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'retake') {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Retake Assessment</h1>
            <p className="text-lg text-muted-foreground">
              You've already completed an assessment. Starting over will create new results.
            </p>
          </div>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Your previous assessment results will be preserved, but this new assessment will become your primary profile.
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onStart}>
              Start New Assessment
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.history.back()}>
              Keep Current Results
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default new assessment mode
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Start Your Assessment</h1>
          <p className="text-lg text-muted-foreground">
            Take our personalized assessment to understand your investment style and get customized recommendations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-4 rounded-lg bg-primary/10">
            <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold">10-15 minutes</h3>
            <p className="text-muted-foreground">Quick and comprehensive</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-primary/10">
            <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold">Save & Resume</h3>
            <p className="text-muted-foreground">Complete at your own pace</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-primary/10">
            <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold">Personalized Results</h3>
            <p className="text-muted-foreground">Tailored to your profile</p>
          </div>
        </div>

        <Button size="lg" onClick={onStart}>
          Begin Assessment
        </Button>
      </div>
    </div>
  );
}; 