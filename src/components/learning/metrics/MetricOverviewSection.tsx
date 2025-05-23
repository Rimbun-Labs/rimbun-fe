import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Star, Info, Clock, BookOpen, CheckCircle2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MetricCategory, RecommendedMetric } from '@/lib/api/types/metrics';
import { metricContent } from '@/lib/api/types/metricContent';
import { cn } from "@/lib/utils";
import { getCategoryColor, getPriorityColor } from '@/utils/metrics';
import MetricCard from './MetricCard';

interface MetricOverviewSectionProps {
  metrics: Record<string, RecommendedMetric>;
  assetClass: string;
  onSelectMetric: (metricName: string) => void;
  completedMetrics: string[];
}

const MetricOverviewSection: React.FC<MetricOverviewSectionProps> = ({
  metrics,
  assetClass,
  onSelectMetric,
  completedMetrics
}) => {
  const [progress, setProgress] = useState(0);
  const metricEntries = Object.entries(metrics);
  const primaryMetrics = metricEntries.filter(([_, metric]) => metric.priority === 'Primary');
  const secondaryMetrics = metricEntries.filter(([_, metric]) => metric.priority === 'Secondary');

  const totalMetrics = metricEntries.length;
  const completedCount = completedMetrics.length;

  useEffect(() => {
    // Load overall progress
    const savedProgress = localStorage.getItem(`metric-progress-${assetClass}`);
    if (savedProgress) {
      try {
        const { completedSteps } = JSON.parse(savedProgress);
        setProgress((completedSteps.length / totalMetrics) * 100);
      } catch (error) {
        console.error('Error parsing saved progress:', error);
      }
    }
  }, [assetClass, metrics, totalMetrics]);

  return (
    <div className="space-y-8">
      {/* Welcome Screen */}
      <Card className="bg-gradient-to-b from-white to-slate-50/50">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Welcome to {assetClass} Metrics Learning</h2>
              <p className="text-slate-600 mt-2">
                Master the key metrics that will help you make better investment decisions in {assetClass}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">{totalMetrics} Metrics</div>
                  <div className="text-sm text-slate-600">to master</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Clock className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">~{totalMetrics * 5} mins</div>
                  <div className="text-sm text-slate-600">estimated time</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">{completedCount} Completed</div>
                  <div className="text-sm text-slate-600">metrics</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">Overall Progress</span>
                <span className="text-sm font-medium text-slate-700">{progress.toFixed(0)}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-2 bg-slate-100 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-600" 
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>{completedCount} of {totalMetrics} metrics completed</span>
                <span>{totalMetrics - completedCount} remaining</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Path */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Your Learning Path</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Follow the recommended order to build your knowledge step by step</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Primary Metrics */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-slate-900">Primary Metrics</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>These are the most important metrics for {assetClass} investing</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {primaryMetrics.map(([metricName, metric]) => {
              const content = metricContent[metricName]?.[metric.category];
              return (
                <MetricCard
                  key={metricName}
                  metricName={metricName}
                  metric={metric}
                  content={content}
                  completedMetrics={completedMetrics}
                  onSelectMetric={onSelectMetric}
                />
              );
            })}
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-slate-900">Secondary Metrics</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Additional metrics that provide deeper insights into {assetClass} investing</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {secondaryMetrics.map(([metricName, metric]) => {
              const content = metricContent[metricName]?.[metric.category];
              return (
                <MetricCard
                  key={metricName}
                  metricName={metricName}
                  metric={metric}
                  content={content}
                  completedMetrics={completedMetrics}
                  onSelectMetric={onSelectMetric}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricOverviewSection; 