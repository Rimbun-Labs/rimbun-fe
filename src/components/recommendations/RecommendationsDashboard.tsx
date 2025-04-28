
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { getRecommendations } from '@/lib/api/resultsApi';
import MetricRecommendationCard from './MetricRecommendationCard';
import PortfolioAllocation from '../dashboard/PortfolioAllocation';

const RecommendationsDashboard: React.FC = () => {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => getRecommendations('current-session'),
  });

  if (isLoading) {
    return <div>Loading recommendations...</div>;
  }

  if (!recommendations) {
    return <div>No recommendations available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Allocation Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Portfolio Allocation</CardTitle>
          <CardDescription>
            Optimal asset distribution based on your risk profile and market conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[300px]">
            <PortfolioAllocation
              allocations={recommendations.assetAllocations}
              recommendedMetrics={recommendations.recommendedMetrics}
            />
          </div>
        </CardContent>
      </Card>

      {/* Metric Recommendations Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Key Investment Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
