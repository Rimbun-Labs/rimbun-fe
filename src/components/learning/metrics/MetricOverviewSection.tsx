import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Star, Info, Clock, BookOpen, CheckCircle2, Trophy } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MetricCategory, RecommendedMetric } from '@/lib/api/types/metrics';
import { metricContent } from '@/lib/api/types/metricContent';
import { cn } from "@/lib/utils";
import { getCategoryColor, getPriorityColor } from '@/utils/metrics';
import MetricCard from './MetricCard';
import { getMetricDisplayName, getCategoryDisplayName } from '@/lib/constants/displayNames';

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
  const metricEntries = Object.entries(metrics)
    // Sort metrics by weight in descending order
    .sort(([_, a], [__, b]) => b.weight - a.weight);

  const totalMetrics = metricEntries.length;
  const completedCount = completedMetrics.length;
  const allMetricsCompleted = completedCount === totalMetrics;

  useEffect(() => {
    // Calculate progress based on completed metrics
    setProgress((completedMetrics.length / totalMetrics) * 100);
  }, [completedMetrics, totalMetrics]);

  return (
    <div className="space-y-8">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">{assetClass} Metrics</h2>
          <Badge variant="outline" className="text-sm">
            {completedCount} of {totalMetrics} completed
          </Badge>
        </div>
        <Progress 
          value={progress} 
          className="h-2 bg-muted [&>div]:bg-primary" 
        />
      </div>

      {/* Welcome Card */}
      <Card className="bg-gradient-to-b from-background to-muted/50">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Welcome to {assetClass} Metrics</h3>
              <p className="text-muted-foreground mt-2">
                Master these key metrics to make better investment decisions in {assetClass}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{totalMetrics} Metrics</div>
                  <div className="text-sm text-muted-foreground">to master</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">~{totalMetrics * 5} mins</div>
                  <div className="text-sm text-muted-foreground">estimated time</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{completedCount} Completed</div>
                  <div className="text-sm text-muted-foreground">metrics</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Path */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-foreground">Your Learning Path</h3>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Follow these metrics in order to build your knowledge step by step</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metricEntries.map(([metricName, metric]) => {
            const content = metricContent[metricName]?.[metric.category];
            return (
              <MetricCard
                key={metricName}
                name={getMetricDisplayName(metric.name)}
                category={metric.category}
                weight={metric.weight}
                assetClass={assetClass}
                onClick={() => onSelectMetric(metricName)}
                completed={completedMetrics.includes(metricName)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MetricOverviewSection; 