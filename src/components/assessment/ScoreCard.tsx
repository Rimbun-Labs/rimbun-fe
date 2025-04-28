
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ConfidenceIndicator from './ConfidenceIndicator';
import { cn } from "@/lib/utils";

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
  confidence: number;
  description: string;
  category?: string;
  className?: string;
  showConfidence?: boolean;
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  title,
  score,
  maxScore,
  confidence,
  description,
  category,
  className,
  showConfidence = true
}) => {
  const percentage = Math.round((score / maxScore) * 100);
  
  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-blue-600";
    if (percentage >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = () => {
    if (percentage >= 80) return "bg-green-600";
    if (percentage >= 60) return "bg-blue-600";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-600";
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            {title}
            {category && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({category})
              </span>
            )}
          </CardTitle>
          <div className={cn("text-xl font-bold", getScoreColor())}>
            {score}/{maxScore}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Score</span>
              <span className="text-sm font-medium">{percentage}%</span>
            </div>
            <Progress value={percentage} className={cn("h-2.5", getProgressColor())} />
          </div>
          
          <p className="text-sm text-muted-foreground">{description}</p>
          
          {showConfidence && (
            <ConfidenceIndicator 
              confidence={confidence} 
              label="Confidence" 
              size="sm"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
