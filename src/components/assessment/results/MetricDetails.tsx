
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface MetricInsight {
  title: string;
  description: string;
  average: number;
  trend: string;
  recommendation: string;
}

interface MetricDetailsProps {
  title: string;
  score: number;
  average: number;
  trend: string;
  recommendation: string;
}

export const MetricDetails: React.FC<MetricDetailsProps> = ({
  title,
  score,
  average,
  trend,
  recommendation
}) => {
  const getTrendBadgeClass = (trend: string) => {
    return trend === 'up' ? 'bg-green-100 text-green-800' :
           trend === 'down' ? 'bg-red-100 text-red-800' :
           'bg-blue-100 text-blue-800';
  };

  const getTrendText = (trend: string) => {
    return trend === 'up' ? 'Increasing' :
           trend === 'down' ? 'Decreasing' :
           'Stable';
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Your Score</span>
          <span className="font-bold">{score}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Average Score</span>
          <span className="font-bold">{average}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Trend</span>
          <Badge variant="outline" className={getTrendBadgeClass(trend)}>
            {getTrendText(trend)}
          </Badge>
        </div>
        <div className="pt-4">
          <h4 className="font-medium mb-2">Recommendation</h4>
          <p className="text-sm text-muted-foreground">{recommendation}</p>
        </div>
      </div>
    </DialogContent>
  );
};

export const getMetricInsights = (metric: string): MetricInsight | null => {
  const insights: Record<string, MetricInsight> = {
    riskProfile: {
      title: "Risk Profile Insights",
      description: "Your risk tolerance level compared to other investors",
      average: 65,
      trend: "up",
      recommendation: "Consider diversifying your portfolio to match your risk profile"
    },
    knowledgeLevel: {
      title: "Knowledge Level Insights",
      description: "Your understanding of investment concepts",
      average: 70,
      trend: "up",
      recommendation: "Complete our investment basics modules to improve your knowledge"
    },
    decisionStyle: {
      title: "Decision Style Insights",
      description: "Your approach to financial decisions",
      average: 75,
      trend: "stable",
      recommendation: "Your decision-making style is well-balanced"
    }
  };
  
  return insights[metric] || null;
};
