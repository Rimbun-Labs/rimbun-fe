import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AssessmentResult } from '@/lib/api/types/assessment';
import { Button } from '@/components/ui/button';
import { Download, Share2, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from 'react-router-dom';
import ProfileDetermination from './ProfileDetermination';
import { ResultsTabs } from './results/ResultsTabs';
import { getAssessmentResults } from '@/lib/api/assessmentApi';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';

interface AssessmentResultsProps {
  result?: AssessmentResult;
  onClose?: () => void;
}

const AssessmentResults: React.FC<AssessmentResultsProps> = ({ result: propResult, onClose }) => {
  const { sessionId } = useParams<{ sessionId: string }>();
  propResult = null 
  // Only fetch if we don't have results from props and have a sessionId
  const { data: fetchedResult, isLoading } = useQuery({
    queryKey: ['assessmentResults', sessionId],
    queryFn: () => getAssessmentResults(sessionId!),
    enabled: !propResult && !!sessionId,
  });

  // Use prop result if available, otherwise use fetched result
  const result = propResult || fetchedResult;

  if (isLoading) {
    return (
      <div className="py-6 px-4 space-y-6">
        <LoadingState variant="expanded" lines={1} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          <div className="lg:col-span-2">
            <LoadingState variant="expanded" lines={3} />
          </div>
          <LoadingState variant="expanded" lines={2} />
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="py-6 px-4 space-y-6">
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          No assessment results found. Please complete the assessment first.
        </div>
      </div>
    );
  }

  const scoreData = result.scoreData;

  return (
    <div className="py-6 px-4 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Assessment Results</h1>
          <p className="text-muted-foreground mt-2">
            Your personalized investment profile analysis
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="outline" asChild>
            <Link to="/assessment?mode=retake">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retake Assessment
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
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
