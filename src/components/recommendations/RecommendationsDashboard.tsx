import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/contexts/SessionContext';
import { getRecommendations } from '@/lib/api/recommendationApi';
import MetricRecommendationCard from './MetricRecommendationCard';
import PortfolioAllocation from '../dashboard/PortfolioAllocation';
import { Skeleton } from "@/components/ui/skeleton";
import { AssetClass, RecommendedMetric, RecommendedMetricsWithWeights } from '@/lib/api/types/metrics';

const RecommendationsDashboard: React.FC = () => {
  const { session } = useSession();
  
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['recommendations', session?.id],
    queryFn: () => getRecommendations(session?.id || ''),
    enabled: !!session?.id
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-80 w-full rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-40" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p>No recommendations available</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Portfolio Allocation Section */}
      <PortfolioAllocation
        allocations={recommendations.adjustedAllocations}
        recommendedMetrics={recommendations.recommendedMetrics}
      />

      {/* Metric Recommendations Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 px-1">Key Investment Metrics</h3>
        <div className="space-y-6">
          {Object.entries(recommendations.recommendedMetrics).map(([assetClass, metrics]) => (
            <div key={assetClass}>
              <h4 className="text-md font-medium mb-3 px-1">{assetClass}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Object.entries(metrics as Record<string, RecommendedMetric>).map(([key, metric]) => (
                  <MetricRecommendationCard
                    key={key}
                    name={metric.name}
                    category={metric.category}
                    weight={metric.weight}
                    priority={metric.priority}
                    assetClass={assetClass as AssetClass}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationsDashboard;
