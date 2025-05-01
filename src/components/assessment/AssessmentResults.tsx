import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AssessmentResult } from '@/lib/api/types/assessment';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ProfileDetermination from './ProfileDetermination';
import { ResultsTabs } from './results/ResultsTabs';
import { getAssessmentResults } from '@/lib/api/assessmentApi';
import { Skeleton } from '@/components/ui/skeleton';

interface AssessmentResultsProps {
  result?: AssessmentResult;
  onClose?: () => void;
}

const AssessmentResults: React.FC<AssessmentResultsProps> = ({ result: propResult, onClose }) => {
  const { sessionId } = useParams<{ sessionId: string }>();

  // Only fetch if we don't have results from props and have a sessionId
  const { data: fetchedResult, isLoading } = useQuery({
    queryKey: ['assessmentResults', sessionId],
    queryFn: () => getAssessmentResults(sessionId!),
    enabled: !propResult && !!sessionId,
  });

  // Use prop result if available, otherwise use fetched result
  const result = propResult || fetchedResult;

  console.log("results", result);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 space-y-6 max-w-6xl">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-[400px] w-full" />
          </div>
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container mx-auto py-6 px-4 space-y-6 max-w-6xl">
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          No assessment results found. Please complete the assessment first.
        </div>
      </div>
    );
  }

  const scoreData = result.scoreData;

  return (
    <div className="container mx-auto py-6 px-4 space-y-6 max-w-6xl animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Assessment Results</h1>
          <p className="text-muted-foreground mt-1">
            Your personalized investment profile analysis
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download your assessment results</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share your results with others</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ResultsTabs result={scoreData} />
        </div>

        <div>
          <ProfileDetermination 
            profile={scoreData.profile}
            finalScore={scoreData.finalScore}
            confidenceMetrics={scoreData.confidenceMetrics}
          />
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;
