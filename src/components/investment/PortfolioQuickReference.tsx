import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Shield, BookOpen } from 'lucide-react';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';

interface PortfolioQuickReferenceProps {
  riskProfile?: number;
  knowledgeLevel?: number;
  allocations?: {
    equities: number;
    bonds: number;
    realEstate: number;
    cash: number;
  };
  diversificationScore?: number;
  isLoading?: boolean;
  sessionId?: string;
}

export const PortfolioQuickReference: React.FC<PortfolioQuickReferenceProps> = ({
  riskProfile,
  knowledgeLevel,
  allocations,
  diversificationScore,
  isLoading,
  sessionId,
}) => {

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingState variant="compact" lines={2} />
        </CardContent>
      </Card>
    );
  }

  const getRiskLabel = (risk: number) => {
    if (risk >= 80) return 'Very Aggressive';
    if (risk >= 60) return 'Aggressive';
    if (risk >= 40) return 'Moderate';
    if (risk >= 20) return 'Conservative';
    return 'Very Conservative';
  };

  const getDiversificationBadge = (score?: number) => {
    if (!score) return null;
    if (score >= 0.8) return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Excellent</Badge>;
    if (score >= 0.6) return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Needs Improvement</Badge>;
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Portfolio Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              Risk Profile
            </div>
            <div className="text-lg font-bold">{riskProfile ?? 0}%</div>
            <div className="text-xs text-muted-foreground">
              {riskProfile !== undefined ? getRiskLabel(riskProfile) : 'N/A'}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <BookOpen className="h-3 w-3" />
              Knowledge Level
            </div>
            <div className="text-lg font-bold">{knowledgeLevel ?? 0}%</div>
            <div className="text-xs text-muted-foreground">Investment Knowledge</div>
          </div>
        </div>

        {/* Allocation Summary */}
        {allocations && (
          <div className="space-y-2 pt-2 border-t">
            <div className="text-xs font-medium text-muted-foreground">Current Allocation</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Equities</span>
                <span className="font-semibold">{allocations.equities}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bonds</span>
                <span className="font-semibold">{allocations.bonds}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Real Estate</span>
                <span className="font-semibold">{allocations.realEstate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cash</span>
                <span className="font-semibold">{allocations.cash}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Diversification Score */}
        {diversificationScore !== undefined && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Diversification</div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  {(diversificationScore * 100).toFixed(0)}%
                </span>
                {getDiversificationBadge(diversificationScore)}
              </div>
            </div>
          </div>
        )}

        {/* Note */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground italic">
            This is a quick reference. Use the Portfolio Simulator tab to experiment with different allocations.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};


