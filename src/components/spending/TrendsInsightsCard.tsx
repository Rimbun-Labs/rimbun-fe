import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, ArrowUp, ArrowDown, ArrowRight, Lightbulb } from "lucide-react";
import { useSpendingTrends } from '@/hooks/useSpendingData';
import { useFormatters } from '@/hooks/useFormatters';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';

interface TrendsInsightsCardProps {
  userId: string;
}

const TrendsInsightsCard: React.FC<TrendsInsightsCardProps> = ({ userId }) => {
  const { data, isLoading } = useSpendingTrends(userId, '6m');
  const { formatCurrency } = useFormatters();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📈 Trends & Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingState variant="expanded" lines={2} />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.periods.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trends & Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">
              Not enough data to show trends. Enter spending data for multiple months.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { trends, insights } = data;

  // Get velocity display
  const getVelocityDisplay = (velocity: string) => {
    switch (velocity) {
      case 'increasing':
        return {
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          icon: ArrowUp,
          label: 'Increasing'
        };
      case 'decreasing':
        return {
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          icon: ArrowDown,
          label: 'Decreasing'
        };
      default:
        return {
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          icon: ArrowRight,
          label: 'Stable'
        };
    }
  };

  // Get trend direction display
  const getTrendDirectionDisplay = (direction: string) => {
    switch (direction) {
      case 'up':
        return {
          color: 'text-red-500',
          icon: TrendingUp,
          label: 'Upward'
        };
      case 'down':
        return {
          color: 'text-green-500',
          icon: TrendingDown,
          label: 'Downward'
        };
      default:
        return {
          color: 'text-muted-foreground',
          icon: Minus,
          label: 'Flat'
        };
    }
  };

  const velocityDisplay = getVelocityDisplay(trends.velocity);
  const trendDirectionDisplay = getTrendDirectionDisplay(trends.trendDirection);
  const VelocityIcon = velocityDisplay.icon;
  const TrendIcon = trendDirectionDisplay.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trends & Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Velocity Indicator */}
        <div className={`p-3 rounded-lg ${velocityDisplay.bgColor}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <VelocityIcon className={`h-4 w-4 ${velocityDisplay.color}`} />
              <span className="text-sm font-medium">Spending Velocity</span>
            </div>
            <span className={`font-bold ${velocityDisplay.color}`}>
              {velocityDisplay.label}
            </span>
          </div>
        </div>

        {/* Trend Direction */}
        <div className="p-3 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendIcon className={`h-4 w-4 ${trendDirectionDisplay.color}`} />
              <span className="text-sm font-medium">Trend Direction</span>
            </div>
            <span className={`font-bold ${trendDirectionDisplay.color}`}>
              {trendDirectionDisplay.label}
            </span>
          </div>
        </div>

        {/* Month-over-Month Change */}
        {trends.momChange !== null && (
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Month-over-Month</span>
              <div className="flex items-center gap-2">
                {trends.momChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                ) : trends.momChange < 0 ? (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                ) : (
                  <Minus className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={`font-bold ${
                  trends.momChange > 0 ? 'text-red-500' : 
                  trends.momChange < 0 ? 'text-green-500' : 
                  'text-muted-foreground'
                }`}>
                  {Math.abs(trends.momChange).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 6-Month Average */}
        {trends.sixMonthAverage !== null && (
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">6-Month Average</span>
              <span className="font-bold">{formatCurrency(trends.sixMonthAverage)}</span>
            </div>
          </div>
        )}

        {/* Top Insight */}
        {insights && insights.length > 0 && (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">{insights[0]}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendsInsightsCard;

