import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MetricCategory, MetricPriority, AssetClass } from '@/lib/api/types/metrics';

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
  const getPriorityColor = (priority: MetricPriority) => {
    switch (priority) {
      case 'Primary':
        return "bg-blue-100 text-blue-800";
      case 'Secondary':
        return "bg-purple-100 text-purple-800";
      case 'Tertiary':
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: MetricCategory) => {
    switch (category) {
      case 'Growth':
        return "bg-green-100 text-green-800";
      case 'Risk':
        return "bg-red-100 text-red-800";
      case 'Income':
        return "bg-yellow-100 text-yellow-800";
      case 'Valuation':
        return "bg-indigo-100 text-indigo-800";
      case 'Return':
        return "bg-emerald-100 text-emerald-800";
      case 'Cost':
        return "bg-orange-100 text-orange-800";
      case 'ETF Liquidity':
      case 'Liquidity':
        return "bg-cyan-100 text-cyan-800";
      case 'Performance':
        return "bg-violet-100 text-violet-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
