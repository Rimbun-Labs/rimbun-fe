import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface GlobalErrorBoundaryProps {
  children: React.ReactNode;
}

export const GlobalErrorBoundary: React.FC<GlobalErrorBoundaryProps> = ({ children }) => {
  return (
    <ErrorBoundary
      context="Global App"
      fallback={(error, errorInfo, resetError) => (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-foreground">We're having trouble loading the app</h1>
              <p className="text-muted-foreground text-lg">
                This might be a temporary issue. Try reloading the page or come back in a moment.
              </p>
            </div>
            <div className="space-y-4">
              <button 
                onClick={resetError}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Reload App
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors ml-4"
              >
                Refresh Page
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left text-sm text-muted-foreground">
                <summary className="cursor-pointer hover:text-foreground">Error Details</summary>
                <pre className="mt-2 p-4 bg-muted rounded-lg overflow-auto text-xs">
                  {error?.message}
                  {errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )}
      onError={(error, errorInfo) => {
        // Log critical errors that reach the global boundary
        console.error('🚨 CRITICAL ERROR - Global Error Boundary caught:', {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          url: window.location.href,
          timestamp: new Date().toISOString()
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}; 