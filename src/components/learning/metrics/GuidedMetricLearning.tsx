import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  BookOpen, 
  CheckCircle2,
  Circle,
  Info,
  ArrowRight
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RecommendedMetric } from '@/lib/api/types/metrics';
import { metricContent } from '@/lib/api/types/metricContent';
import { cn } from "@/lib/utils";
import { getCategoryColor, getPriorityColor } from '@/utils/metrics';
import { toast } from "sonner";
import { PracticeQuestion } from '../quiz/PracticeQuestion';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface GuidedMetricLearningProps {
  metrics: Record<string, RecommendedMetric>;
  assetClass: string;
  onBack: () => void;
  onComplete: () => void;
  sessionId?: string;
}

type MetricState = {
  status: 'not_started' | 'learning' | 'practicing' | 'completed';
  practiceAttempts: number;
  lastPracticeScore?: number;
};

interface MetricProgress {
  completedSteps: string[];
  currentStep: number;
  userAnswers: Record<string, string>;
  metricStates: Record<string, MetricState>;
}

const GuidedMetricLearning: React.FC<GuidedMetricLearningProps> = ({
  metrics,
  assetClass,
  onBack,
  onComplete,
  sessionId
}) => {
  const [showPractice, setShowPractice] = useState(false);

  // Optimized localStorage hook for metric progress
  const [metricProgress, setMetricProgress] = useLocalStorage<MetricProgress>(
    `metric-progress-${sessionId}-${assetClass}`,
    {
      completedSteps: [],
      currentStep: 0,
      userAnswers: {},
      metricStates: {}
    },
    { debounceMs: 200 }
  );

  const { completedSteps, currentStep, userAnswers, metricStates } = metricProgress;

  const metricEntries = Object.entries(metrics);
  const currentMetric = metricEntries[currentStep];
  const [metricName, metric] = currentMetric;
  const content = metric.content;

  const totalSteps = metricEntries.length;
  const progress = (completedSteps.length / totalSteps) * 100;

  // Optimized step navigation
  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setMetricProgress(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1
      }));
      setShowPractice(false);
    } else {
      onComplete();
    }
  }, [currentStep, totalSteps, setMetricProgress, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setMetricProgress(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1
      }));
      setShowPractice(false);
    }
  }, [currentStep, setMetricProgress]);

  // Optimized step completion
  const handleCompleteStep = useCallback(() => {
    if (!sessionId) return;
    
    if (!completedSteps.includes(metricName)) {
      const newCompletedSteps = [...completedSteps, metricName];
      const newMetricStates = {
        ...metricStates,
        [metricName]: {
          ...metricStates[metricName],
          status: 'completed' as const
        }
      };

      setMetricProgress(prev => ({
        ...prev,
        completedSteps: newCompletedSteps,
        metricStates: newMetricStates
      }));

      // Save individual metric progress with answers and practice data
      const individualProgress = {
        progress: 100,
        completed: true,
        answers: userAnswers[metricName],
        practiceAttempts: metricStates[metricName]?.practiceAttempts || 0,
        lastPracticeScore: metricStates[metricName]?.lastPracticeScore,
        completedAt: new Date().toISOString()
      };

      // Use localStorage directly for individual metric data (not cached)
      try {
        localStorage.setItem(`metric-progress-${sessionId}-${metricName}`, JSON.stringify(individualProgress));
      } catch (error) {
        console.error('Failed to save individual metric progress:', error);
      }

      // Check if all metrics are completed
      const allMetricsCompleted = metricEntries.every(([name]) => 
        newCompletedSteps.includes(name)
      );

      if (allMetricsCompleted) {
        toast.success("All Metrics Completed! 🎉", {
          description: "You're ready to test your knowledge!",
        });
      } else {
        toast.success("Metric completed! 🎉", {
          description: "Great job understanding this metric!",
        });
      }

      onComplete();
    }
  }, [sessionId, completedSteps, metricName, metricStates, userAnswers, setMetricProgress, metricEntries, onComplete]);

  // Optimized practice completion
  const handlePracticeComplete = useCallback((isCorrect: boolean) => {
    const newMetricStates = {
      ...metricStates,
      [metricName]: {
        ...metricStates[metricName],
        status: isCorrect ? 'completed' : 'practicing',
        practiceAttempts: (metricStates[metricName]?.practiceAttempts || 0) + 1,
        lastPracticeScore: isCorrect ? 100 : 0
      }
    };

    setMetricProgress(prev => ({
      ...prev,
      metricStates: newMetricStates
    }));

    if (isCorrect) {
      handleCompleteStep();
      if (currentStep < totalSteps - 1) {
        handleNext();
      } else {
        onComplete();
      }
    } else {
      toast.error("Not quite right. Try again!");
    }
  }, [metricStates, metricName, setMetricProgress, handleCompleteStep, currentStep, totalSteps, handleNext, onComplete]);

  // Optimized practice start
  const handleStartPractice = useCallback(() => {
    setShowPractice(true);
    setMetricProgress(prev => ({
      ...prev,
      metricStates: {
        ...prev.metricStates,
        [metricName]: {
          ...prev.metricStates[metricName],
          status: 'practicing'
        }
      }
    }));
  }, [metricName, setMetricProgress]);

  // Update user answers
  const updateUserAnswer = useCallback((questionId: string, answer: string) => {
    setMetricProgress(prev => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [questionId]: answer
      }
    }));
  }, [setMetricProgress]);

  if (!currentMetric) return null;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Step {currentStep + 1} of {totalSteps}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Complete each step to master {assetClass} metrics</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">~5 mins</span>
          </div>
        </div>
        <Progress value={progress} className="w-32" />
      </div>

      {/* Learning Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{metricName}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className={getPriorityColor(metric.priority)}>
                  {metric.priority}
                </Badge>
                <Badge variant="outline" className={getCategoryColor(metric.category)}>
                  {metric.category}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                Weight in portfolio
              </div>
              <div className="text-lg font-semibold">
                {(metric.weight * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!showPractice ? (
            <div className="space-y-6">
              {/* Learning Objectives */}
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">What You'll Learn</h3>
                <ul className="list-disc list-inside space-y-1 text-foreground">
                  <li>Understanding {metricName} and its importance</li>
                  <li>How to calculate and interpret {metricName}</li>
                  <li>Real-world applications in {assetClass} investing</li>
                </ul>
              </div>

              {/* Main Content */}
              <div className="prose max-w-none">
                <h3>Overview</h3>
                <p className="text-foreground">{content?.overview}</p>
                
                <h3>Why This Matters</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-foreground">{content?.details}</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  onClick={handleStartPractice}
                  className="gap-2"
                >
                  {metricStates[metricName]?.status === 'completed' ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Review Practice
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4" />
                      Start Practice
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Practice Section */}
              {content?.practiceQuestion && (
                <PracticeQuestion
                  data={content.practiceQuestion}
                  mode="learning"
                  onComplete={handlePracticeComplete}
                  onAnswerChange={updateUserAnswer}
                  userAnswer={userAnswers[metricName]}
                />
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowPractice(false)}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Learning
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GuidedMetricLearning; 