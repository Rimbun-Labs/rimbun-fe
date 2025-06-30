import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorFallbackProps {
  error: Error;
  errorInfo: React.ErrorInfo;
  resetError: () => void;
  context?: string;
  variant?: 'inline' | 'card' | 'minimal';
  showDetails?: boolean;
  className?: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  resetError,
  context = 'Component',
  variant = 'inline',
  showDetails = false,
  className
}) => {
  const handleRetry = () => {
    resetError();
  };

  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center gap-2 text-destructive", className)}>
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">Something went wrong</span>
        <Button 
          onClick={handleRetry}
          size="sm"
          variant="ghost"
          className="h-6 px-2 text-xs"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn("p-6 border border-destructive/20 rounded-lg bg-destructive/5", className)}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-destructive mb-1">
              {context} Error
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              {error.message || 'An unexpected error occurred'}
            </p>
            
            {showDetails && (
              <details className="mb-3">
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                  Show error details
                </summary>
                <div className="mt-2 p-2 bg-muted/50 rounded text-xs font-mono text-muted-foreground">
                  <div className="mb-1">
                    <strong>Error:</strong> {error.message}
                  </div>
                  <div className="mb-1">
                    <strong>Stack:</strong>
                  </div>
                  <pre className="whitespace-pre-wrap text-xs">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}
            
            <Button 
              onClick={handleRetry}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default inline variant
  return (
    <div className={cn("p-4 border border-destructive/20 rounded-lg bg-destructive/5", className)}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-5 h-5 bg-destructive rounded-full flex items-center justify-center">
            <span className="text-destructive-foreground text-xs font-bold">!</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-destructive">
            Something went wrong
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {error.message || 'An unexpected error occurred'}
          </p>
          
          {showDetails && (
            <details className="mt-2">
              <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                Show error details
              </summary>
              <div className="mt-1 p-2 bg-muted/50 rounded text-xs font-mono text-muted-foreground">
                <div className="mb-1">
                  <strong>Error:</strong> {error.message}
                </div>
                <div className="mb-1">
                  <strong>Stack:</strong>
                </div>
                <pre className="whitespace-pre-wrap text-xs">
                  {errorInfo.componentStack}
                </pre>
              </div>
            </details>
          )}
          
          <button
            onClick={handleRetry}
            className="mt-2 text-xs text-primary hover:text-primary/80 underline"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}; 