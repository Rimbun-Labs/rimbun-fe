import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  BookOpen, 
  Lightbulb, 
  MessageSquare,
  TrendingUp,
  BarChart3,
  Sparkles,
  ChevronRight,
  Brain,
  Target,
  LineChart,
  AlertCircle
} from 'lucide-react';
import { InvestmentExplorerChat } from '@/components/investment/InvestmentExplorerChat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Error Loading Session</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {sessionError instanceof Error ? sessionError.message : "Failed to load your session"}
                </p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session || !session.isCompleted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
            className="hover:bg-primary/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Investment Explorer
            </h1>
          <p className="text-muted-foreground">
            Your AI-Powered Research Hub for Personalized Investing
          </p>
        </div>
      </div>

        <div className="max-w-5xl mx-auto">
          {error && (
            <div className="mb-6">
              <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {showWelcome ? (
            <div className="space-y-8">
              {/* Hero Section */}
              <MotionCard 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden border-none bg-gradient-to-br from-primary/10 via-primary/5 to-background"
              >
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                        <Sparkles className="h-4 w-4" />
                        <span>AI-Powered Insights</span>
                      </div>
                      <h2 className="text-4xl font-bold tracking-tight">
                        Discover Your Investment Journey
                      </h2>
                      <p className="text-lg text-muted-foreground">
                        Get personalized investment insights and learn about financial markets with our AI assistant.
                      </p>
                      <Button 
                        size="lg" 
                        className="mt-4"
                        onClick={() => setShowWelcome(false)}
                      >
                        Start Exploring
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-lg blur-3xl" />
                      <div className="relative grid grid-cols-2 gap-4">
                        <MotionCard 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-background/50 backdrop-blur-sm"
                        >
                          <CardContent className="p-4">
                            <TrendingUp className="h-6 w-6 text-primary mb-2" />
                            <h3 className="font-semibold">Market Analysis</h3>
                            <p className="text-sm text-muted-foreground">Real-time insights</p>
                          </CardContent>
                        </MotionCard>
                        <MotionCard 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="bg-background/50 backdrop-blur-sm"
                        >
                          <CardContent className="p-4">
                            <Brain className="h-6 w-6 text-primary mb-2" />
                            <h3 className="font-semibold">AI Insights</h3>
                            <p className="text-sm text-muted-foreground">Smart recommendations</p>
                          </CardContent>
                        </MotionCard>
                        <MotionCard 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                          className="bg-background/50 backdrop-blur-sm"
                        >
                          <CardContent className="p-4">
                            <Target className="h-6 w-6 text-primary mb-2" />
                            <h3 className="font-semibold">Goal Tracking</h3>
                            <p className="text-sm text-muted-foreground">Personalized targets</p>
                          </CardContent>
                        </MotionCard>
                        <MotionCard 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                          className="bg-background/50 backdrop-blur-sm"
                        >
                          <CardContent className="p-4">
                            <LineChart className="h-6 w-6 text-primary mb-2" />
                            <h3 className="font-semibold">Performance</h3>
                            <p className="text-sm text-muted-foreground">Track your progress</p>
                          </CardContent>
                        </MotionCard>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </MotionCard>

              {/* Features Section */}
              <div className="grid md:grid-cols-3 gap-6">
                <MotionCard 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="group hover:bg-primary/5 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <MessageSquare className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">AI-Powered Chat</h3>
                        <p className="text-sm text-muted-foreground">
                          Get personalized investment insights
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </MotionCard>

                <MotionCard 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="group hover:bg-primary/5 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Learning Integration</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect with your learning path
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </MotionCard>

                <MotionCard 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="group hover:bg-primary/5 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Lightbulb className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Smart Suggestions</h3>
                        <p className="text-sm text-muted-foreground">
                          Personalized recommendations
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </MotionCard>
              </div>

              {/* Quick Start Guide */}
              <MotionCard 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-primary/5 to-background"
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Quick Start Guide</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <span className="text-primary font-semibold">1</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Choose a Topic</h4>
                          <p className="text-sm text-muted-foreground">
                            Select from various investment topics to explore
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <span className="text-primary font-semibold">2</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Ask Questions</h4>
                          <p className="text-sm text-muted-foreground">
                            Use suggested prompts or ask your own questions
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <span className="text-primary font-semibold">3</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Follow Up</h4>
                          <p className="text-sm text-muted-foreground">
                            Use suggested follow-up questions to dive deeper
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <span className="text-primary font-semibold">4</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Learn More</h4>
                          <p className="text-sm text-muted-foreground">
                            Explore related learning materials and resources
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </MotionCard>
            </div>
          ) : (
            <Card className="border-none shadow-lg">
          <CardContent className="p-6">
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