import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface ScoreDisplayProps {
  score: number;
  label: string;
  tooltip?: string;
  className?: string;
}

const getScoreColor = (score: number) => {
  if (score >= 0.7) return "bg-green-100 text-green-800";
  if (score >= 0.4) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

const getScoreLabel = (score: number) => {
  if (score >= 0.7) return "High";
  if (score >= 0.4) return "Medium";
  return "Low";
};

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  label,
  tooltip,
  className
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{label}</span>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <Badge className={getScoreColor(score)}>
          {getScoreLabel(score)}
        </Badge>
      </div>
      <Progress value={score * 100} className="h-2" />
    </div>
  );
}; 