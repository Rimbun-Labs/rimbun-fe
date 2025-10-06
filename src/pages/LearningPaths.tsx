import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { getRecommendations } from '@/lib/api/recommendationApi';
import { learningPathsContent } from '@/lib/api/types/learningPaths';
import LearningPathCard from '@/components/learning/paths/LearningPathCard';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const LearningPaths: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { session } = useSession();
  
  const { data: recommendations, isLoading, error, refetch } = useQuery({
    queryKey: ['recommendations', sessionId || session?.id],
    queryFn: () => getRecommendations(sessionId || session?.id || ''),
    enabled: !!(sessionId || session?.id),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  if (isLoading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <LoadingState 
          variant="expanded"
          showTitle
          showSubtitle
          lines={3}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-red-600">Error Loading Learning Paths</CardTitle>
            <CardDescription>
              There was a problem loading your learning paths. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>Failed to load learning paths. Please check your connection and try again.</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => refetch()}
                variant="outline"
              >
                Retry
              </Button>
              <Button 
                onClick={() => navigate(-1)}
                variant="ghost"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">No Learning Paths Available</CardTitle>
            <CardDescription>
              We couldn't find any learning paths for your current profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatAssetClass = (assetClass: string): string => {
    return assetClass.toLowerCase().replace('_', '');
  };

  // Filter out asset classes with 0% allocation
  const nonZeroAllocations = Object.entries(recommendations.adjustedAllocations)
    .filter(([_, allocation]) => allocation > 0);

  // Determine grid columns based on number of items
  const getGridCols = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "md:grid-cols-2";
    return "md:grid-cols-2 lg:grid-cols-3";
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Learning Paths</h1>
        <p className="text-muted-foreground">
          Choose your learning journey and master investment concepts
        </p>
      </div>

      {/* Featured Learning Paths */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Featured Learning Paths</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nonZeroAllocations.map(([assetClass, allocation]) => {
            const formattedAssetClass = formatAssetClass(assetClass);
            return (
              <LearningPathCard
                key={assetClass}
                assetClass={assetClass}
                content={learningPathsContent[formattedAssetClass]}
                allocation={allocation}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LearningPaths; 