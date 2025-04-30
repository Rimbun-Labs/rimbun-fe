
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ConfidenceBadgeProps {
  confidence: number | null | undefined;
}

const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ confidence }) => {
  if (confidence === null || confidence === undefined) return null;
  
  let color = "bg-gray-100 text-gray-800";
  let label = "Low";
  
  if (confidence >= 0.8) {
    color = "bg-green-100 text-green-800";
    label = "High";
  } else if (confidence >= 0.6) {
    color = "bg-blue-100 text-blue-800";
    label = "Good";
  } else if (confidence >= 0.4) {
    color = "bg-yellow-100 text-yellow-800";
    label = "Medium";
  } else {
    color = "bg-red-100 text-red-800";
    label = "Low";
  }

  return (
    <Badge variant="outline" className={cn("text-xs font-normal whitespace-nowrap", color)}>
      {Math.round(confidence * 100)}% <span className="hidden sm:inline ml-1">{label}</span>
    </Badge>
  );
};

export default ConfidenceBadge;
