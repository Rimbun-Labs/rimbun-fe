import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, ChevronLeft, Info, CheckCircle2, Circle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MetricCategory, RecommendedMetric } from '@/lib/api/types/metrics';
import { metricContent } from '@/lib/api/types/metricContent';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getCategoryColor, getPriorityColor } from '@/utils/metrics';
import MetricCard from './MetricCard';

interface MetricLearningSectionProps {
  metrics: Record<string, RecommendedMetric>;
  assetClass: string;
  onBack: () => void;
  onComplete: () => void;
}

const MetricLearningSection: React.FC<MetricLearningSectionProps> = ({ 
  metrics, 
  assetClass,
  onBack,
  onComplete 
}) => {
  const [currentMetricIndex, setCurrentMetricIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'practice'>('overview');
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [completedMetrics, setCompletedMetrics] = useState<string[]>([]);

  const metricEntries = Object.entries(metrics);
  const currentMetric = metricEntries[currentMetricIndex];
  const [metricName, metric] = currentMetric;
  const content = metricContent[metricName]?.[metric.category];

  const handleNext = () => {
    if (currentMetricIndex < metricEntries.length - 1) {
      setCurrentMetricIndex(prev => prev + 1);
      setActiveTab('overview');
    }
  };

  const handlePrevious = () => {
    if (currentMetricIndex > 0) {
      setCurrentMetricIndex(prev => prev - 1);
      setActiveTab('overview');
    }
  };

  const handleCompleteMetric = () => {
    if (!completedMetrics.includes(metricName)) {
      setCompletedMetrics(prev => [...prev, metricName]);
      onComplete();
      toast.success("Metric completed! 🎉", {
        description: "Great job understanding this metric!",
      });
    }
  };

  if (!currentMetric) return null;

  return (
    <MetricCard
      metricName={metricName}
      metric={metric}
      content={content}
      completedMetrics={completedMetrics}
      onSelectMetric={() => {}}
    >
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed">
                {content?.overview}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentMetricIndex === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentMetricIndex === metricEntries.length - 1}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">How to Use This Metric</h4>
                <p className="text-slate-700">
                  {content?.details}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Weight in Portfolio</h4>
                <Progress value={metric.weight * 100} className="h-2" />
                <p className="text-sm text-slate-600 mt-1">
                  This metric has a {(metric.weight * 100).toFixed(0)}% weight in your {assetClass} allocation
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="practice" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Practice Questions</h4>
                {content?.practiceQuestion && (
                  <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                    <p className="font-medium mb-2">{content.practiceQuestion.question}</p>
                    <div className="space-y-2">
                      {content.practiceQuestion.options.map((option, optIndex) => (
                        <Button
                          key={optIndex}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => {
                            setUserAnswers(prev => ({
                              ...prev,
                              [metricName]: option
                            }));
                            if (option === content.practiceQuestion.options[content.practiceQuestion.correct]) {
                              toast.success("Correct! 🎉");
                            } else {
                              toast.error("Try again!");
                            }
                          }}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                    {userAnswers[metricName] && (
                      <div className="mt-2 text-sm text-slate-600">
                        {userAnswers[metricName] === content.practiceQuestion.options[content.practiceQuestion.correct]
                          ? "Correct! Well done!"
                          : "Not quite right. Try again!"}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleCompleteMetric}
            className={cn(
              "gap-2",
              completedMetrics.includes(metricName)
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-slate-900 hover:bg-slate-800"
            )}
          >
            {completedMetrics.includes(metricName) ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Completed
              </>
            ) : (
              <>
                <Circle className="h-4 w-4" />
                Mark as Complete
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </MetricCard>
  );
};

export default MetricLearningSection; 