
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface MetricRecommendationProps {
  name: string;
  weight: number;
  description: string;
  confidence?: number;
}

const MetricRecommendationCard: React.FC<MetricRecommendationProps> = ({
  name,
  weight,
  description,
  confidence
}) => {
  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return "bg-green-500";
    if (score >= 0.6) return "bg-blue-500";
    if (score >= 0.4) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            {name}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <span className="text-sm font-semibold">
            {(weight * 100).toFixed(0)}%
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <Progress value={weight * 100} className="h-2" />
        {confidence && (
          <div className="mt-2 flex items-center gap-2">
            <div className="text-xs text-muted-foreground">Confidence:</div>
            <div 
              className={`px-2 py-0.5 rounded-full text-xs text-white ${getConfidenceColor(confidence)}`}
            >
              {(confidence * 100).toFixed(0)}%
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricRecommendationCard;
