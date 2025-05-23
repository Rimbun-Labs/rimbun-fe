import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MetricCategory, MetricPriority, AssetClass } from '@/lib/api/types/metrics';
import { getCategoryColor, getPriorityColor } from '@/utils/metrics';

interface MetricRecommendationProps {
  name: string;
  category: MetricCategory;
  weight: number;
  priority: MetricPriority;
  assetClass?: AssetClass;
}

const MetricRecommendationCard: React.FC<MetricRecommendationProps> = ({
  name,
  category,
  weight,
  priority,
  assetClass
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow h-full">
      <CardHeader className="pb-2 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium text-base">
            {name}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    {assetClass && <span className="font-medium">{assetClass}: </span>}
                    {category} metric
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <span className="text-sm font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {(weight * 100).toFixed(0)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getPriorityColor(priority)}>
            {priority}
          </Badge>
          <Badge variant="outline" className={getCategoryColor(category)}>
            {category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Progress value={weight * 100} className="h-2" />
      </CardContent>
    </Card>
  );
};

export default MetricRecommendationCard;
