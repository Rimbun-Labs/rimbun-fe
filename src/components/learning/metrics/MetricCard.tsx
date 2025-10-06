import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryColor } from '@/utils/metrics';
import { MetricCategory } from '@/lib/api/types/metrics';
import { getCategoryDisplayName } from '@/lib/constants/displayNames';
import { metricContent } from '@/lib/api/types/metricContent';

interface MetricCardProps {
  name: string;
  category: MetricCategory;
  weight: number;
  assetClass: string;
  onClick: () => void;
  completed: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  name,
  category,
  weight,
  assetClass,
  onClick,
  completed
}) => {
  const content = metricContent[name]?.content;

  const getWeightColor = (weight: number) => {
    if (weight >= 0.8) return 'bg-primary/10 text-primary border-primary/20';
    if (weight >= 0.5) return 'bg-primary/5 text-primary border-primary/10';
    return 'bg-muted text-muted-foreground border-border';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800';
      case 'in-progress':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'locked':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-200",
        completed ? "border-green-500" : "hover:border-border",
        "hover:shadow-lg"
      )}
    >
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">{name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={getCategoryColor(category)}>
                {getCategoryDisplayName(category)}
              </Badge>
              <Badge variant="outline" className={getWeightColor(weight)}>
                {(weight * 100).toFixed(0)}% Weight
              </Badge>
            </div>
          </div>
          {completed && (
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          )}
        </div>

        {/* Overview */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {content?.overview || "Learn about this important metric for your investment decisions."}
        </p>

        {/* Action Button */}
        <Button 
          variant="outline" 
          className="w-full group-hover:bg-muted"
          onClick={onClick}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          {completed ? "Review Metric" : "Start Learning"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MetricCard; 