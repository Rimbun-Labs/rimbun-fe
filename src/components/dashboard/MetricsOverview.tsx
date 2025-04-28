
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, Award, BookOpen, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricsOverviewProps {
  className?: string;
}

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  loading?: boolean;
  formatter?: (value: number | string) => string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend,
  icon,
  loading = false,
  formatter = (val) => String(val)
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-24 mt-1" />
            ) : (
              <h3 className="text-2xl font-bold mt-1">{formatter(value)}</h3>
            )}
          </div>
          <div className={cn(
            "rounded-full p-2",
            trend === 'up' ? "bg-green-100 text-green-600" : 
            trend === 'down' ? "bg-red-100 text-red-600" : 
            "bg-gray-100 text-gray-600"
          )}>
            {icon || (trend === 'up' ? <TrendingUp className="h-4 w-4" /> : 
                      trend === 'down' ? <TrendingDown className="h-4 w-4" /> : null)}
          </div>
        </div>
        
        {change !== undefined && !loading && (
          <div className={cn(
            "flex items-center mt-3 text-sm",
            change > 0 ? "text-green-600" : 
            change < 0 ? "text-red-600" : 
            "text-gray-600"
          )}>
            {change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : 
             change < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : null}
            <span>{change > 0 ? '+' : ''}{change}% from last assessment</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const MetricsOverview: React.FC<MetricsOverviewProps> = ({ className }) => {
  // Mock data for metrics overview
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['performance-metrics'],
    queryFn: () => Promise.resolve({
      learningProgress: {
        completedModules: 2,
        totalModules: 8,
        currentStreak: 5,
        averageScore: 85
      },
      portfolioMetrics: {
        riskAdjustedReturn: 7.2,
        sharpeRatio: 0.68,
        volatility: 12.4,
        maxDrawdown: 8.5
      }
    })
  });

  const formatPercentage = (value: number | string) => {
    if (typeof value === 'number') {
      return `${value}%`;
    }
    return String(value);
  };

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-4">Analytics Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Learning Progress"
          value={metrics?.learningProgress.completedModules && metrics?.learningProgress.totalModules ? 
            Math.round((metrics.learningProgress.completedModules / metrics.learningProgress.totalModules) * 100) : 0}
          formatter={formatPercentage}
          icon={<BookOpen className="h-4 w-4" />}
          loading={isLoading}
        />
        
        <MetricCard
          title="Risk-Adjusted Return"
          value={metrics?.portfolioMetrics.riskAdjustedReturn || 0}
          change={2.1}
          trend="up"
          icon={<PieChart className="h-4 w-4" />}
          formatter={(val) => `${val}%`}
          loading={isLoading}
        />
        
        <MetricCard
          title="Sharpe Ratio"
          value={metrics?.portfolioMetrics.sharpeRatio || 0}
          change={0.12}
          trend="up"
          loading={isLoading}
        />
        
        <MetricCard
          title="Knowledge Level"
          value={65}
          change={15}
          trend="up"
          icon={<Award className="h-4 w-4" />}
          formatter={formatPercentage}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default MetricsOverview;
