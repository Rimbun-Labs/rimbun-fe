import React, { useState, useEffect } from 'react';
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

const GuidedMetricLearning: React.FC<GuidedMetricLearningProps> = ({
  metrics,
  assetClass,
  onBack,
  onComplete,
  sessionId
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showPractice, setShowPractice] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [metricStates, setMetricStates] = useState<Record<string, MetricState>>({});

  const metricEntries = Object.entries(metrics);
  const currentMetric = metricEntries[currentStep];
  const [metricName, metric] = currentMetric;
  const content = metric.content;

  const totalSteps = metricEntries.length;
  const progress = (completedSteps.length / totalSteps) * 100;

  // Load saved progress on mount
  useEffect(() => {
    if (!sessionId) return;
    
    const savedProgress = localStorage.getItem(`metric-progress-${sessionId}-${assetClass}`);
    if (savedProgress) {
      try {
        const { completedSteps: savedCompleted, currentStep: savedStep } = JSON.parse(savedProgress);
        setCompletedSteps(savedCompleted);
        setCurrentStep(savedStep);
      } catch (error) {
        console.error('Error parsing saved progress:', error);
      }
    }
  }, [assetClass, sessionId]);

  // Save progress when it changes
  useEffect(() => {
    if (!sessionId) return;
    
    const saveProgress = () => {
      localStorage.setItem(`metric-progress-${sessionId}-${assetClass}`, JSON.stringify({
        completedSteps,
        currentStep
      }));
    };

    if (completedSteps.length > 0 || currentStep > 0) {
      saveProgress();
    }
  }, [assetClass, sessionId, completedSteps, currentStep]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
      setShowPractice(false);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setShowPractice(false);
    }
  };

  const handleCompleteStep = () => {
    if (!sessionId) return;
    
    if (!completedSteps.includes(metricName)) {
      setCompletedSteps(prev => [...prev, metricName]);
      setMetricStates(prev => ({
        ...prev,
        [metricName]: {
          ...metricStates[metricName],
          status: 'completed'
        }
      }));

      // Save individual metric progress with answers and practice data
      localStorage.setItem(`metric-progress-${sessionId}-${metricName}`, JSON.stringify({
        progress: 100,
        completed: true,
        answers: userAnswers[metricName],
        practiceAttempts: metricStates[metricName]?.practiceAttempts || 0,
        lastPracticeScore: metricStates[metricName]?.lastPracticeScore,
        completedAt: new Date().toISOString()
      }));

      // Check if all metrics are completed
      const allMetricsCompleted = metricEntries.every(([name]) => 
        [...completedSteps, metricName].includes(name)
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
  };

  const handlePracticeComplete = (isCorrect: boolean) => {
    setMetricStates(prev => ({
      ...prev,
      [metricName]: {
        ...metricStates[metricName],
        status: isCorrect ? 'completed' : 'practicing',
        practiceAttempts: (metricStates[metricName]?.practiceAttempts || 0) + 1,
        lastPracticeScore: isCorrect ? 100 : 0
      }
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
  };

  const handleStartPractice = () => {
    setShowPractice(true);
    setMetricStates(prev => ({
      ...prev,
      [metricName]: {
        ...metricStates[metricName],
        status: 'practicing'
      }
    }));
  };

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
                  <Info className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Complete each step to master {assetClass} metrics</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
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
              <div className="bg-slate-50 p-4 rounded-lg">
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
                <div className="bg-blue-50 p-4 rounded-lg">
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
                  allowRetry={true}
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