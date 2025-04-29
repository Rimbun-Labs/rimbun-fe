
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getAssessmentResults } from '@/lib/api/resultsApi';
import AssessmentResults from '@/components/assessment/AssessmentResults';
import { Skeleton } from '@/components/ui/skeleton';
import { mockAssessmentResult } from '@/lib/mock/mockData';

const AssessmentResultsPage = () => {
  const { sessionId = 'current-session' } = useParams();
  
  const { data: result, isPending } = useQuery({
    queryKey: ['assessment-result', sessionId],
    queryFn: () => getAssessmentResults(sessionId),
  });
  
  if (isPending) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Loading Assessment Results</h1>
        <div className="max-w-6xl mx-auto">
          <div className="space-y-6">
            <Skeleton className="h-[350px] w-full" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Skeleton className="h-[180px]" />
              <Skeleton className="h-[180px]" />
              <Skeleton className="h-[180px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!result) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Assessment Results Unavailable</h1>
        <p className="text-center text-muted-foreground">
          We couldn't find results for the requested assessment.
        </p>
      </div>
    );
  }
  
  return <AssessmentResults result={result} />;
};

export default AssessmentResultsPage;
