import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { getRecommendations } from '@/lib/api/recommendationApi';
import { learningPathsContent } from '@/lib/api/types/learningPaths';
import LearningPathCard from '@/components/learning/paths/LearningPathCard';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { cn } from "@/lib/utils";

const LearningPaths: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { session } = useSession();
  
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['recommendations', sessionId || session?.id],
    queryFn: () => getRecommendations(sessionId || session?.id || ''),
    enabled: !!(sessionId || session?.id)
  });

  console.log(recommendations)
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-40" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center p-6">
          <p>No recommendations available</p>
          <Button 
            onClick={() => navigate(-1)} 
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }
console.log(learningPathsContent)

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Your Learning Paths</h1>
            <p className="mt-1 text-sm text-slate-500">
              Start your learning journey with these recommended paths
            </p>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/dashboard/${sessionId}`)}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className={cn(
          "grid gap-6",
          getGridCols(nonZeroAllocations.length)
        )}>
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