
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface AssessmentErrorProps {
  onRetry: () => void;
}

export const AssessmentError: React.FC<AssessmentErrorProps> = ({ onRetry }) => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Error Loading Assessment</h1>
      <div className="text-center space-y-4">
        <p className="text-muted-foreground">Unable to load assessment questions.</p>
        <Button onClick={onRetry} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
};
