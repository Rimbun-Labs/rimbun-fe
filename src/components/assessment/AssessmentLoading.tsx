
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const AssessmentLoading: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Investment Profile Assessment</h1>
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    </div>
  );
};
