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
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Continue Your Assessment</h1>
            <p className="text-lg text-muted-foreground">
              You have an incomplete assessment. Would you like to continue where you left off?
            </p>
          </div>

          {progress && (
            <Card className="border border-primary/20 bg-primary/5">
              <CardContent className="pt-8">
                <div className="space-y-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">Progress</span>
                    <span className="text-foreground font-medium">{progress.questionsAnswered} of {progress.totalQuestions} questions</span>
                  </div>
                  <Progress value={getProgressPercentage()} className="h-2 bg-muted [&>div]:bg-primary" />
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
            <Button size="lg" onClick={onStart} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Resume Assessment
            </Button>
            <Button variant="outline" size="lg" onClick={onStart} className="border-border hover:bg-muted hover:text-foreground">
              Start Over
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'retake') {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Retake Assessment</h1>
            <p className="text-lg text-muted-foreground">
              You've already completed an assessment. Starting over will create new results.
            </p>
          </div>

          <Card className="border-amber-200 bg-amber-100 dark:bg-amber-900/20 dark:border-amber-800">
            <CardContent className="pt-8">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Note:</strong> Your previous assessment results will be preserved, but this new assessment will become your primary profile.
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onStart} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Start New Assessment
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.history.back()} className="border-border hover:bg-muted hover:text-foreground">
              Keep Current Results
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default new assessment mode
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-10">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-foreground">Start Your Assessment</h1>
          <p className="text-lg text-muted-foreground">
            Take our personalized assessment to understand your investment style and get customized recommendations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 w-full">
          <div className="flex items-start gap-4 p-6 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">10-15 minutes</h3>
              <p className="text-sm text-muted-foreground">Quick and comprehensive assessment</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex-shrink-0">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Save & Resume</h3>
              <p className="text-sm text-muted-foreground">Complete at your own pace</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Personalized Results</h3>
              <p className="text-sm text-muted-foreground">Tailored to your profile</p>
            </div>
          </div>
        </div>

        <Button size="lg" onClick={onStart} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300">
          Begin Assessment
        </Button>
      </div>
    </div>
  );
}; 