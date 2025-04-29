
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AssessmentResult } from '@/lib/api/types/assessment';

interface DetailsTabProps {
  result: AssessmentResult;
}

export const DetailsTab: React.FC<DetailsTabProps> = ({ result }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-100 text-green-800";
    if (confidence >= 0.6) return "bg-blue-100 text-blue-800";
    if (confidence >= 0.4) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Direct Inputs</CardTitle>
          <CardDescription>Your provided information</CardDescription>
        </CardHeader>
        <CardContent>
          {result.directInputs ? (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Risk Capacity</span>
                  <span className="font-medium">{result.directInputs.riskCapacity}/10</span>
                </div>
                <Progress 
                  value={result.directInputs.riskCapacity * 10} 
                  className="h-2"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Your ability to take on financial risk based on your current situation
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Investment Horizon</span>
                  <span className="font-medium">{result.directInputs.investmentHorizon} years</span>
                </div>
                <Progress 
                  value={Math.min(result.directInputs.investmentHorizon * 5, 100)} 
                  className="h-2"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Your expected timeframe for investment before needing the funds
                </p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No direct input data available
            </p>
          )}
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
                  <span className="text-sm">{key.replace(/([A-Z])/g, ' $1').replace('Confidence', '').trim()}</span>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
