import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Award, PieChart, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricsOverviewProps {
  className?: string;
}

interface MetricCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  loading?: boolean;
  formatter?: (value: number | string) => string;
  progressValue?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon,
  loading = false,
  formatter = (val) => String(val),
  progressValue
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <div className={cn("rounded-full p-2 bg-primary/10 text-primary dark:bg-primary/20")}>
                {icon}
              </div>
              <p className="text-sm font-medium text-foreground">{title}</p>
            </div>
            {loading ? (
              <Skeleton className="h-8 w-24 mt-1" />
            ) : (
              <h3 className="text-2xl font-bold mt-2 text-foreground">{formatter(value)}</h3>
            )}
          </div>
        </div>
        
        {progressValue !== undefined && !loading && (
          <div className="mt-2">
            <Progress 
              value={progressValue} 
              className="h-1.5 bg-muted dark:bg-muted/50" 
            />
          </div>
        )}
        
        <p className="text-xs text-muted-foreground dark:text-[hsl(var(--card-description))] mt-3">
          {description}
        </p>
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
      profileMetrics: {
        riskScore: 65,
        knowledgeLevel: 70,
        confidenceScore: 82,
        completionRate: 100
      }
    })
  });

  const formatPercentage = (value: number | string) => {
    if (typeof value === 'number') {
      return `${value}%`;
    }
    return String(value);
  };
  
  const getProgressPercentage = () => {
    if (!metrics?.learningProgress) return 0;
    const { completedModules, totalModules } = metrics.learningProgress;
    return totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
  };

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-4 text-foreground">Your Learning Journey</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Learning Progress"
          value={metrics?.learningProgress.completedModules || 0}
          description="Modules completed out of total available curriculum"
          icon={<BookOpen className="h-4 w-4" />}
          loading={isLoading}
          formatter={(val) => `${val}/${metrics?.learningProgress.totalModules || 0}`}
          progressValue={getProgressPercentage()}
        />
        
        <MetricCard
          title="Knowledge Level"
          value={metrics?.profileMetrics.knowledgeLevel || 0}
          description="Your understanding of investment concepts"
          icon={<Award className="h-4 w-4" />}
          loading={isLoading}
          formatter={formatPercentage}
          progressValue={metrics?.profileMetrics.knowledgeLevel}
        />
        
        <MetricCard
          title="Risk Profile"
          value={metrics?.profileMetrics.riskScore || 0}
          description="Your comfort level with investment risk"
          icon={<PieChart className="h-4 w-4" />}
          loading={isLoading}
          formatter={formatPercentage}
          progressValue={metrics?.profileMetrics.riskScore}
        />
        
        <MetricCard
          title="Assessment Confidence"
          value={metrics?.profileMetrics.confidenceScore || 0}
          description="Confidence in your investment profile assessment"
          icon={<TrendingUp className="h-4 w-4" />}
          loading={isLoading}
          formatter={formatPercentage}
          progressValue={metrics?.profileMetrics.confidenceScore}
        />
      </div>
    </div>
  );
};

export default MetricsOverview;
