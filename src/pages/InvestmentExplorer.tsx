import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Sparkles,
  ChevronRight,
  Brain,
  Target,
  TrendingUp,
  LineChart,
  AlertCircle
} from 'lucide-react';
import { InvestmentExplorerChat } from '@/components/investment/InvestmentExplorerChat';
import { motion } from 'framer-motion';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { RouteErrorBoundary } from '@/components/error/RouteErrorBoundary';

const MotionCard = motion(Card);

const InvestmentExplorer: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { session, isLoading, error: sessionError } = useSession();
  const [showWelcome, setShowWelcome] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!session) {
      navigate('/assessment');
      return;
    }
    if (!session.isCompleted) {
      navigate('/assessment');
      return;
    }
    if (sessionId !== session.id) {
      navigate(`/investment-explorer/${session.id}`);
      return;
    }
  }, [session, sessionId, navigate, isLoading]);

  if (isLoading) {
    return (
      <LoadingState
        title="Loading Investment Explorer"
        subtitle="Please wait while we prepare your personalized investment insights"
      />
    );
  }

  if (sessionError) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <Card className="w-full max-w-lg border border-border shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col items-center space-y-6">
                <div className="p-4 rounded-full bg-destructive/10 border border-destructive/20">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Error Loading Session</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {sessionError instanceof Error ? sessionError.message : "Failed to load your session"}
                  </p>
                </div>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!session || !session.isCompleted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-6 mb-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-muted hover:text-foreground border-border"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Investment Explorer
            </h1>
            <p className="text-muted-foreground text-lg">
              Your AI-Powered Research Hub for Personalized Investing
            </p>
          </div>
        </div>

        <div className="w-full">
          {error && (
            <div className="mb-8">
              <div className="flex items-center gap-3 text-destructive bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {showWelcome ? (
            <div className="space-y-10">
              {/* Hero Section */}
              <MotionCard 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden border border-border bg-gradient-to-br from-primary/5 to-background"
              >
                <CardContent className="p-10">
                  <div className="grid md:grid-cols-2 gap-10 items-center w-full">
                    <div className="space-y-6">
                      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
                        <Sparkles className="h-4 w-4" />
                        <span>AI-Powered Insights</span>
                      </div>
                      <h2 className="text-4xl font-bold tracking-tight text-foreground">
                        Your Personal Investment AI Assistant
                      </h2>
                      <p className="text-lg text-muted-foreground">
                        Ask anything about investing, get personalized insights, and explore markets with intelligent guidance tailored to your profile.
                      </p>
                      <Button 
                        size="lg" 
                        className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => setShowWelcome(false)}
                      >
                        Start Chatting
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    <div className="relative">
                      <div className="relative grid grid-cols-2 gap-6 w-full">
                        <MotionCard 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-background border border-border shadow-lg"
                        >
                          <CardContent className="p-6">
                            <Brain className="h-6 w-6 text-primary mb-3" />
                            <h3 className="font-semibold text-foreground">Smart AI</h3>
                            <p className="text-sm text-muted-foreground">Personalized insights</p>
                          </CardContent>
                        </MotionCard>
                        <MotionCard 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="bg-background border border-border shadow-lg"
                        >
                          <CardContent className="p-6">
                            <Target className="h-6 w-6 text-primary mb-3" />
                            <h3 className="font-semibold text-foreground">Goal Focused</h3>
                            <p className="text-sm text-muted-foreground">Tailored to your profile</p>
                          </CardContent>
                        </MotionCard>
                        <MotionCard 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                          className="bg-background border border-border shadow-lg"
                        >
                          <CardContent className="p-6">
                            <TrendingUp className="h-6 w-6 text-primary mb-3" />
                            <h3 className="font-semibold text-foreground">Market Analysis</h3>
                            <p className="text-sm text-muted-foreground">Real-time insights</p>
                          </CardContent>
                        </MotionCard>
                        <MotionCard 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                          className="bg-background border border-border shadow-lg"
                        >
                          <CardContent className="p-6">
                            <LineChart className="h-6 w-6 text-primary mb-3" />
                            <h3 className="font-semibold text-foreground">Learning</h3>
                            <p className="text-sm text-muted-foreground">Grow your knowledge</p>
                          </CardContent>
                        </MotionCard>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </MotionCard>

              {/* Quick Start Guide */}
              <MotionCard 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-primary/5 to-background border border-border"
              >
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-6 text-foreground">How to Get Started</h3>
                  <div className="grid md:grid-cols-2 gap-8 w-full">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                          <span className="text-primary font-semibold">1</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Ask Anything</h4>
                          <p className="text-sm text-muted-foreground">
                            Start with any investment question - from basics to advanced strategies
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                          <span className="text-primary font-semibold">2</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Get Personalized Insights</h4>
                          <p className="text-sm text-muted-foreground">
                            AI analyzes your profile and provides tailored recommendations
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                          <span className="text-primary font-semibold">3</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Explore Deeper</h4>
                          <p className="text-sm text-muted-foreground">
                            Use suggested follow-up questions to dive into specific topics
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                          <span className="text-primary font-semibold">4</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Learn & Grow</h4>
                          <p className="text-sm text-muted-foreground">
                            Build your investment knowledge with guided learning paths
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </MotionCard>
            </div>
          ) : (
            <Card className="border border-border shadow-lg">
              <CardContent className="p-8">
                <InvestmentExplorerChat 
                  sessionId={sessionId!} 
                  onError={(error) => setError(error.message)}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// Wrap the InvestmentExplorer component with RouteErrorBoundary
const InvestmentExplorerWithErrorBoundary: React.FC = () => {
  return (
    <RouteErrorBoundary routeName="Investment Explorer" showFullPage={true}>
      <InvestmentExplorer />
    </RouteErrorBoundary>
  );
};

export default InvestmentExplorerWithErrorBoundary; 