import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RecommendedMetric } from '@/lib/api/types/metrics';
import { MetricExplanation } from '@/lib/api/types/metricContent';

interface MetricLearningCardProps {
  metricName: string;
  metric: RecommendedMetric;
  content: MetricExplanation;
  completedMetrics: string[];
  onSelectMetric: () => void;
  children: React.ReactNode;
}

const MetricLearningCard: React.FC<MetricLearningCardProps> = ({
  metricName,
  metric,
  content,
  completedMetrics,
  onSelectMetric,
  children
}) => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default MetricLearningCard; 