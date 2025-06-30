import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, ArrowLeft, Mail, MessageCircle } from 'lucide-react';

interface ErrorPageProps {
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId?: string;
  context?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  showHomeButton?: boolean;
  showContactSupport?: boolean;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  error,
  errorInfo,
  errorId,
  context = 'Unknown',
  onRetry,
  onGoBack,
  showHomeButton = true,
  showContactSupport = true
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      navigate(-1);
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent(`Error Report - ${errorId || 'Unknown Error'}`);
    const body = encodeURIComponent(`
Error Details:
- Error ID: ${errorId || 'N/A'}
- Context: ${context}
- Message: ${error?.message || 'N/A'}
- URL: ${window.location.href}
- User Agent: ${navigator.userAgent}

Please provide any additional context about what you were doing when this error occurred.
    `);
    
    window.open(`mailto:support@investlearn.com?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-background/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">
            Oops! Something went wrong
          </CardTitle>
          <CardDescription className="text-base">
            We encountered an unexpected error while processing your request
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Details */}
          {error && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Error Details</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Message:</span> {error.message}
                </div>
                {errorId && (
                  <div>
                    <span className="font-medium">Error ID:</span> {errorId}
                  </div>
                )}
                <div>
                  <span className="font-medium">Context:</span> {context}
                </div>
                <div>
                  <span className="font-medium">URL:</span> {window.location.pathname}
                </div>
              </div>
            </div>
          )}

          {/* Recovery Actions */}
          <div className="space-y-3">
            <h3 className="font-medium">What you can do:</h3>
            
            <div className="grid gap-3">
              <Button 
                onClick={handleRetry}
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

              {showHomeButton && (
                <Button 
                  asChild
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    Go to Home
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Support Contact */}
          {showContactSupport && (
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Need Help?
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                If this error persists, please contact our support team with the error details above.
              </p>
              <Button 
                onClick={handleContactSupport}
                size="sm"
                variant="outline"
                className="w-full justify-start"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          )}

          {/* Additional Help */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              If you continue to experience issues, try clearing your browser cache or using a different browser.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 