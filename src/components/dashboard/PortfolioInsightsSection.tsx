import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AllocationStrategyExplanation } from './explanations/AllocationStrategyExplanation';
import { PortfolioInteractionExplanation } from './explanations/PortfolioInteractionExplanation';
import { RiskStyleExplanation } from './explanations/RiskStyleExplanation';
import { AlertCircle } from 'lucide-react';

interface PortfolioInsightsSectionProps {
  diversificationScore: number;
  riskProfile: number;
  riskAdjustedVolatility: number;
  riskCapacity: number;
  loading?: boolean;
  error?: Error | null;
}

const PortfolioInsightsSection: React.FC<PortfolioInsightsSectionProps> = ({
  diversificationScore,
  riskProfile,
  riskAdjustedVolatility,
  riskCapacity,
  loading = false,
  error = null
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Insights</CardTitle>
          <CardDescription>Understanding your portfolio strategy and risk management</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" variant="primary" />
            <p className="text-sm text-muted-foreground">Loading portfolio insights...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Insights</CardTitle>
          <CardDescription>Understanding your portfolio strategy and risk management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center space-y-4 py-8">
            <div className="p-3 rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Error Loading Insights</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {error.message || "Failed to load portfolio insights"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Insights</CardTitle>
        <CardDescription>Understanding your portfolio strategy and risk management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <AllocationStrategyExplanation
          diversificationScore={diversificationScore}
          riskProfile={riskProfile}
          riskAdjustedVolatility={riskAdjustedVolatility}
        />
        <PortfolioInteractionExplanation
          riskAdjustedVolatility={riskAdjustedVolatility}
          riskProfile={riskProfile}
          diversificationScore={diversificationScore}
        />
        <RiskStyleExplanation
          score={riskProfile}
        />
      </CardContent>
    </Card>
  );
};

export default PortfolioInsightsSection; 