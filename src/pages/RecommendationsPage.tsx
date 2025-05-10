
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockRecommendations } from '@/lib/mock/mockData';
import { getRecommendations } from '@/lib/api/resultsApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import RecommendationCard from '@/components/dashboard/RecommendationCard';
import RecommendationsDashboard from '@/components/recommendations/RecommendationsDashboard';

const RecommendationsPage = () => {
  // Using the same API structure
  const { data: recommendationsData, isLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => getRecommendations('current-session')
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
            ) : mockRecommendations.map((rec) => (
              <RecommendationCard 
                key={rec.id} 
                title={rec.title}
                description={rec.description}
                priority={rec.priority as "High" | "Medium" | "Low"}
                category={rec.category}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationsPage;
