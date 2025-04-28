
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ConfidenceBadgeProps {
  confidence: number | null | undefined;
}

const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ confidence }) => {
  if (confidence === null || confidence === undefined) return null;
  
  let color = "bg-gray-200 text-gray-800";
  if (confidence >= 0.8) color = "bg-green-100 text-green-800";
  else if (confidence >= 0.6) color = "bg-blue-100 text-blue-800";
  else if (confidence >= 0.4) color = "bg-yellow-100 text-yellow-800";
  else color = "bg-red-100 text-red-800";

  return (
    <Badge variant="outline" className={cn("ml-2 text-xs font-normal", color)}>
      {Math.round(confidence * 100)}% confidence
    </Badge>
  );
};

export default ConfidenceBadge;
