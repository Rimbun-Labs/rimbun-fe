import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/contexts/SessionContext';
import { getRecommendations } from '@/lib/api/recommendationApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import RecommendationCard from '@/components/dashboard/RecommendationCard';
import RecommendationsDashboard from '@/components/recommendations/RecommendationsDashboard';

const RecommendationsPage = () => {
  const { session } = useSession();
  
  // Using the real API
  const { data: recommendationsData, isLoading } = useQuery({
    queryKey: ['recommendations', session?.id],
    queryFn: () => getRecommendations(session?.id || ''),
    enabled: !!session?.id
  });

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Recommendations</h1>
        <p className="text-muted-foreground mt-1">
          Personalized suggestions to improve your investment knowledge
        </p>
      </div>

      {/* Recommendations Dashboard Component */}
      <RecommendationsDashboard />

      {/* Educational Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Educational Action Items</CardTitle>
          <CardDescription>Next steps to improve your investment knowledge</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-[160px]">
                  <Skeleton className="h-full w-full" />
                </div>
              ))
            ) : recommendationsData?.recommendedMetrics ? (
              Object.entries(recommendationsData.recommendedMetrics).map(([key, metric]) => (
                <RecommendationCard 
                  key={key}
                  title={key}
                  description={metric.description}
                  priority={metric.weight >= 0.8 ? "High" : metric.weight >= 0.6 ? "Medium" : "Low"}
                  category="Investment Metrics"
                />
              ))
            ) : (
              <div className="col-span-3 text-center text-muted-foreground">
                No recommendations available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationsPage;
