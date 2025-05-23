import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryColor, getPriorityColor } from '@/utils/metrics';
import { Progress } from "@/components/ui/progress";
import { RecommendedMetric } from '@/lib/api/types/metrics';

interface MetricCardProps {
  metricName: string;
  metric: RecommendedMetric;
  content?: { overview?: string };
  completedMetrics: string[];
  onSelectMetric: (metricName: string) => void;
  children?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({
  metricName,
  metric,
  content,
  completedMetrics,
  onSelectMetric,
  children
}) => {
  const [progress, setProgress] = useState(0);
  const isCompleted = completedMetrics.includes(metricName);

  useEffect(() => {
    // Load progress from localStorage
    const savedProgressData = localStorage.getItem(`metric-progress-${metricName}`);
    if (savedProgressData) {
      try {
        const { progress: savedProgress } = JSON.parse(savedProgressData);
        setProgress(savedProgress);
      } catch (error) {
        console.error('Error parsing saved progress:', error);
      }
    }
  }, [metricName]);

  return (
    <Card
      className={cn(
        "hover:shadow-lg transition-all duration-200",
        isCompleted && "border-emerald-200 bg-emerald-50/50"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold text-slate-900">
              {metricName}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getPriorityColor(metric.priority)}>
                {metric.priority}
              </Badge>
              <Badge variant="outline" className={getCategoryColor(metric.category)}>
                {metric.category}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-lg font-semibold text-emerald-600">
              {(metric.weight * 100).toFixed(0)}%
            </span>
            <span className="text-xs text-slate-500">Weight</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {children || (
          <div className="space-y-4">
            <p className="text-slate-600 line-clamp-2">
              {content?.overview || "Learn about this important metric..."}
            </p>
            
            {/* Progress Section */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Progress</span>
                <span className="font-medium text-slate-700">{progress}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-2 bg-slate-100 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-600" 
              />
            </div>

            {/* Action Button */}
            <Button
              onClick={() => onSelectMetric(metricName)}
              className={cn(
                "w-full gap-2",
                isCompleted
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-slate-900 hover:bg-slate-800"
              )}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Review
                </>
              ) : (
                <>
                  <Circle className="h-4 w-4" />
                  Start Learning
                </>
              )}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard; 