import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface DiversificationAnalysisProps {
  diversificationScore: number;
  riskAdjustedVolatility: number;
  recommendations: string[];
  correlationMatrix: Record<string, Record<string, number>>;
}

const getScoreColor = (score: number) => {
  if (score >= 0.7) return "text-green-600";
  if (score >= 0.4) return "text-yellow-600";
  return "text-red-600";
};

const getScoreLabel = (score: number) => {
  if (score >= 0.7) return "High";
  if (score >= 0.4) return "Medium";
  return "Low";
};

const DiversificationAnalysis: React.FC<DiversificationAnalysisProps> = ({
  diversificationScore,
  riskAdjustedVolatility,
  recommendations,
  correlationMatrix
}) => {
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

      {/* Correlation Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Correlations</CardTitle>
          <CardDescription>
            How different assets in your portfolio move in relation to each other. 
            A correlation of 1 means assets move perfectly together, -1 means they move in opposite directions, 
            and 0 means no relationship.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2"></th>
                  {Object.keys(correlationMatrix).map((asset) => (
                    <th key={asset} className="text-center p-2 font-medium">
                      {asset}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(correlationMatrix).map(([asset, correlations]) => (
                  <tr key={asset}>
                    <td className="p-2 font-medium">{asset}</td>
                    {Object.entries(correlations).map(([correlatedAsset, value]) => (
                      <td
                        key={correlatedAsset}
                        className="text-center p-2"
                        style={{
                          backgroundColor: `rgba(0, 0, 0, ${Math.abs(value) * 0.1})`,
                          color: value < 0 ? 'red' : 'green'
                        }}
                      >
                        {value.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiversificationAnalysis; 