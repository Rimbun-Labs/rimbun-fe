import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AssessmentResult } from '@/lib/api/types/assessment';

interface DetailsTabProps {
  result: AssessmentResult['scoreData'];
}

export const DetailsTab: React.FC<DetailsTabProps> = ({ result }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-100 text-green-800";
    if (confidence >= 0.6) return "bg-blue-100 text-blue-800";
    if (confidence >= 0.4) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const formatValue = (key: string, value: string | number) => {
    if (key === 'age') return `${value} years`;
    if (key === 'investmentHorizon') return `${value} years`;
    if (key === 'riskCapacity') return `${value}/100`;
    return value;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Direct Inputs</CardTitle>
          <CardDescription>Your provided information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(result.directInputs).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="font-medium">{formatValue(key, value)}</span>
                </div>
                {(key === 'riskCapacity' || key === 'investmentHorizon') && (
                  <Progress 
                    value={key === 'investmentHorizon' ? Math.min(Number(value) * 3.33, 100) : Number(value)} 
                    className="h-2"
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Confidence Analysis</CardTitle>
          <CardDescription>Reliability of your assessment results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(result.confidenceMetrics).map(([key, value]) => (
              <div key={key} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm">
                    {key.replace(/([A-Z])/g, ' $1').replace('Confidence', '').trim()}
                  </span>
                  <Badge variant="outline" className={getConfidenceColor(value)}>
                    {Math.round(value * 100)}%
                  </Badge>
                </div>
                <Progress 
                  value={value * 100} 
                  className="h-1.5"
                />
              </div>
            ))}
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Overall Confidence</span>
                <Badge variant="outline" className={getConfidenceColor(result.overallConfidence)}>
                  {Math.round(result.overallConfidence * 100)}%
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Deviation Analysis</CardTitle>
          <CardDescription>Consistency in your responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Decision Style Deviation</span>
                <span className="font-medium">{result.decisionStyleDeviation.toFixed(1)}</span>
              </div>
              <Progress 
                value={Math.min(result.decisionStyleDeviation * 5, 100)} 
                className="h-2"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Variation in your decision-making patterns
              </p>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Personality Deviation</span>
                <span className="font-medium">{result.personalityDeviation.toFixed(1)}</span>
              </div>
              <Progress 
                value={Math.min(result.personalityDeviation * 5, 100)} 
                className="h-2"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Consistency in your personality-related responses
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
