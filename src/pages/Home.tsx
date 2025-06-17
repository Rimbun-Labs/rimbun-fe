import React, { useState, useEffect } from 'react';
import { FeaturesGrid } from '@/components/features/FeaturesGrid';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from '@/contexts/SessionContext';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Target, Clock, Lightbulb } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { session } = useSession();
  const [showWelcome, setShowWelcome] = useState(false);
  
  // Check if user has completed assessment by looking at the session's isCompleted flag
  const hasCompletedAssessment = Boolean(session?.isCompleted);

  // Check if it's first login
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to InvestLearn
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your personalized journey to investment mastery starts here
        </p>
        {!hasCompletedAssessment && (
          <div className="flex justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => navigate('/assessment')}
            >
              Start Your Assessment
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/about')}
            >
              Learn More
            </Button>
          </div>
        )}
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">
          Explore Our Features
        </h2>
        <FeaturesGrid />
      </div>

      {!hasCompletedAssessment && (
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">
            Unlock Your Full Potential
          </h3>
          <p className="text-muted-foreground mb-6">
            Complete your assessment to get personalized learning paths and access to all features
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/assessment')}
          >
            Take Assessment Now
          </Button>
        </div>
      )}

      {/* Welcome Popup */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="max-w-md">
          <div className="space-y-6">
            {/* Value Proposition Header */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Welcome to Your Investment Learning Journey</h2>
              <p className="text-muted-foreground">
                We're here to help you build confidence in your investment decisions
              </p>
            </div>

            {/* Key Benefits */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Personalized Learning</h4>
                  <p className="text-sm text-muted-foreground">
                    Get a custom learning path that matches your investment goals and knowledge level
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Learn at Your Pace</h4>
                  <p className="text-sm text-muted-foreground">
                    Flexible learning modules that fit your schedule and learning style
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Lightbulb className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Practical Knowledge</h4>
                  <p className="text-sm text-muted-foreground">
                    Apply what you learn with our AI-powered investment explorer
                  </p>
                </div>
              </div>
            </div>

            {/* Clear Call to Action */}
            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => {
                  setShowWelcome(false);
                  navigate('/assessment');
                }}
                className="w-full"
              >
                Start Your Journey
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowWelcome(false)}
                className="w-full"
              >
                Explore First
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home; 