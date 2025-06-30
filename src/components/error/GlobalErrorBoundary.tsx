import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ErrorPage } from './ErrorPage';

interface GlobalErrorBoundaryProps {
  children: React.ReactNode;
}

export const GlobalErrorBoundary: React.FC<GlobalErrorBoundaryProps> = ({ children }) => {
  return (
    <ErrorBoundary
      context="Global App"
      fallback={(error, errorInfo, resetError) => (
        <ErrorPage
          error={error}
          errorInfo={errorInfo}
          onRetry={resetError}
          showHomeButton={true}
          showContactSupport={true}
        />
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