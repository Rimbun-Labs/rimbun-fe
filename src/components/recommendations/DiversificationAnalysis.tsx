import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DiversificationAnalysisProps {
  diversificationScore: number;
  riskAdjustedVolatility: number;
  recommendations: string[];
  correlationMatrix?: Record<string, Record<string, number>>;
}

const getScoreColor = (score: number): string => {
  if (score >= 0.8) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  if (score >= 0.6) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
};

const getScoreLabel = (score: number): string => {
  if (score >= 0.8) return 'Excellent';
  if (score >= 0.6) return 'Good';
  return 'Needs Improvement';
};

const DiversificationAnalysis: React.FC<DiversificationAnalysisProps> = React.memo(({
  diversificationScore,
  riskAdjustedVolatility,
  recommendations,
  correlationMatrix
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Diversification Score */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Diversification Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {(diversificationScore * 100).toFixed(0)}%
                </span>
                <Badge className={getScoreColor(diversificationScore)}>
                  {getScoreLabel(diversificationScore)}
                </Badge>
              </div>
              <Progress 
                value={diversificationScore * 100} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Risk Metrics */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Risk Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Risk-Adjusted Volatility</span>
                <span className="text-2xl font-bold">
                  {riskAdjustedVolatility.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recommendations.slice(0, 2).map((recommendation, index) => (
                <div key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expanded Content */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center justify-between">
            <span>View Detailed Analysis</span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4">
          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>Specific actions to improve your portfolio diversification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Correlation Matrix */}
          {correlationMatrix && (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CardTitle>Asset Correlations</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Correlation values range from -1 (perfect negative) to +1 (perfect positive)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <CardDescription>How different asset classes move in relation to each other</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left p-2">Asset</th>
                        {Object.keys(correlationMatrix).map(asset => (
                          <th key={asset} className="p-2 text-center">{asset}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(correlationMatrix).map(([asset1, correlations]) => (
                        <tr key={asset1}>
                          <td className="p-2 font-medium">{asset1}</td>
                          {Object.entries(correlations).map(([asset2, correlation]) => (
                            <td key={asset2} className="p-2 text-center">
                              <span className={`px-2 py-1 rounded text-xs ${
                                correlation > 0.7 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                correlation > 0.3 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              }`}>
                                {correlation.toFixed(2)}
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
});

DiversificationAnalysis.displayName = 'DiversificationAnalysis';

export default DiversificationAnalysis; 