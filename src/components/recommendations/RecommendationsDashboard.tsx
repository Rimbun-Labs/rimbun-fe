
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { getRecommendations } from '@/lib/api/resultsApi';
import MetricRecommendationCard from './MetricRecommendationCard';
import PortfolioAllocation from '../dashboard/PortfolioAllocation';
import { Skeleton } from "@/components/ui/skeleton";

const RecommendationsDashboard: React.FC = () => {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => getRecommendations('current-session'),
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
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recommended Portfolio Allocation</CardTitle>
          <CardDescription>
            Optimal asset distribution based on your risk profile and market conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[320px]">
            <PortfolioAllocation
              allocations={recommendations.assetAllocations}
              recommendedMetrics={recommendations.recommendedMetrics}
            />
          </div>
        </CardContent>
      </Card>

      {/* Metric Recommendations Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 px-1">Key Investment Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(recommendations.recommendedMetrics).map(([key, metric]) => (
            <MetricRecommendationCard
              key={key}
              name={key}
              weight={metric.weight}
              description={metric.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationsDashboard;
