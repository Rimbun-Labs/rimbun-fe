
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Info } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ConfidenceIndicatorProps {
  confidence: number;
  label: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidence,
  label,
  showPercentage = true,
  size = 'md',
}) => {
  const confidencePercentage = Math.round(confidence * 100);
  
  const confidenceColor = () => {
    if (confidence >= 0.8) return "text-green-700 bg-green-100";
    if (confidence >= 0.6) return "text-blue-700 bg-blue-100";
    if (confidence >= 0.4) return "text-yellow-700 bg-yellow-100";
    return "text-red-700 bg-red-100";
  };

  const progressColor = () => {
    if (confidence >= 0.8) return "bg-green-600";
    if (confidence >= 0.6) return "bg-blue-600";
    if (confidence >= 0.4) return "bg-yellow-500";
    return "bg-red-600";
  };

  const tooltipContent = () => {
    if (confidence >= 0.8) return "High confidence: The data supports this score with strong certainty";
    if (confidence >= 0.6) return "Moderate confidence: The data supports this score with reasonable certainty";
    if (confidence >= 0.4) return "Low confidence: The data provides limited support for this score";
    return "Very low confidence: The data provides minimal support for this score";
  };

  const sizeClasses = {
    sm: "text-xs space-y-1",
    md: "text-sm space-y-2",
    lg: "text-base space-y-3"
  };

  return (
    <div className={cn("flex flex-col", sizeClasses[size])}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="font-medium">{label}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} className="text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tooltipContent()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {showPercentage && (
          <Badge variant="outline" className={cn("font-normal", confidenceColor())}>
            {confidencePercentage}%
          </Badge>
        )}
      </div>
      <Progress 
        value={confidencePercentage} 
        className={cn("h-2 bg-muted", progressColor())}
      />
    </div>
  );
};

export default ConfidenceIndicator;
