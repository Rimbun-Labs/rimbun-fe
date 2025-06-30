import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { ErrorFallback } from './ErrorFallback';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
  routeName: string;
  showFullPage?: boolean;
}

export const RouteErrorBoundary: React.FC<RouteErrorBoundaryProps> = ({ 
  children, 
  routeName,
  showFullPage = false 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (showFullPage) {
    return (
      <ErrorBoundary
        context={`Route: ${routeName}`}
        fallback={(error, errorInfo, resetError) => (
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl shadow-2xl border-0 bg-background/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="text-2xl font-bold text-destructive">
                  {routeName} Error
                </CardTitle>
                <CardDescription className="text-base">
                  We encountered an error while loading this page
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Error Details */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Error Details</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Page:</span> {routeName}
                    </div>
                    <div>
                      <span className="font-medium">Message:</span> {error.message}
                    </div>
                    <div>
                      <span className="font-medium">URL:</span> {location.pathname}
                    </div>
                  </div>
                </div>

                {/* Recovery Actions */}
                <div className="space-y-3">
                  <h3 className="font-medium">What you can do:</h3>
                  
                  <div className="grid gap-3">
                    <Button 
                      onClick={resetError}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>

                    <Button 
                      onClick={handleGoBack}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Go Back
                    </Button>

                    <Button 
                      onClick={handleGoHome}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Go to Home
                    </Button>
                  </div>
                </div>

                {/* Additional Help */}
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    If this error persists, try refreshing the page or clearing your browser cache.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        onError={(error, errorInfo) => {
          console.error(`🚨 Route Error - ${routeName}:`, {
            error: error.message,
            route: routeName,
            pathname: location.pathname,
            componentStack: errorInfo.componentStack
          });
        }}
      >
        {children}
      </ErrorBoundary>
    );
  }

  // Default inline fallback
  return (
    <ErrorBoundary
      context={`Route: ${routeName}`}
      fallback={(error, errorInfo, resetError) => (
        <ErrorFallback
          error={error}
          errorInfo={errorInfo}
          resetError={resetError}
          context={routeName}
          variant="card"
          showDetails={false}
        />
      )}
      onError={(error, errorInfo) => {
        console.error(`🚨 Route Error - ${routeName}:`, {
          error: error.message,
          route: routeName,
          pathname: location.pathname
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}; 