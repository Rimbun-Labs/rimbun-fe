import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ErrorFallback } from './ErrorFallback';

interface ComponentErrorBoundaryProps {
  children: React.ReactNode;
  componentName: string;
  variant?: 'inline' | 'card' | 'minimal';
  showDetails?: boolean;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export const ComponentErrorBoundary: React.FC<ComponentErrorBoundaryProps> = ({
  children,
  componentName,
  variant = 'inline',
  showDetails = false,
  fallback,
  onError
}) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error(`🚨 Component Error - ${componentName}:`, {
      error: error.message,
      component: componentName,
      componentStack: errorInfo.componentStack
    });

    if (onError) {
      onError(error, errorInfo);
    }
  };

  return (
    <ErrorBoundary
      context={`Component: ${componentName}`}
      fallback={fallback || ((error, errorInfo, resetError) => (
        <ErrorFallback
          error={error}
          errorInfo={errorInfo}
          resetError={resetError}
          context={componentName}
          variant={variant}
          showDetails={showDetails}
        />
      ))}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
}; 