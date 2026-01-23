import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, ArrowRight, TrendingUp, Target, BookOpen, AlertCircle } from 'lucide-react';
import { personaApi, PersonaPreview } from '@/lib/api/personaApi';
import { cn } from '@/lib/utils';

const Explore: React.FC = () => {
  const navigate = useNavigate();

  const { data: personas, isLoading, error } = useQuery({
    queryKey: ['personas'],
    queryFn: () => personaApi.getAllPersonas(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container px-4 md:px-6 py-12">
          <LoadingState variant="expanded" lines={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container px-4 md:px-6 py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load sample profiles. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 md:px-6 py-12">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Explore Sample Financial Plans
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              See how Rimbun creates personalized financial plans for different life situations. 
              Each profile includes banking products, investment strategies, and educational content tailored to their goals.
            </p>
            <div className="pt-4">
              <Button
                onClick={() => navigate('/signup')}
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                Get Your Own Plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Personas Grid */}
          {personas && personas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personas.map((persona) => (
                <PersonaCard
                  key={persona.id}
                  persona={persona}
                  onClick={() => navigate(`/explore/${persona.slug}`, { 
                    state: { from: '/explore' } 
                  })}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No sample profiles available at this time.</p>
            </div>
          )}

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground">
                Ready for Your Personalized Plan?
              </h2>
              <p className="text-muted-foreground">
                Sign up to get your own customized financial plan based on your unique situation, goals, and preferences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  onClick={() => navigate('/signup')}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  size="lg"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PersonaCardProps {
  persona: PersonaPreview;
  onClick: () => void;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ persona, onClick }) => {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
        "border-border hover:border-primary/50"
      )}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl">{persona.title}</CardTitle>
            <CardDescription className="text-base">
              {persona.name}, {persona.age}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2">
            Sample
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {persona.description}
        </p>

        {/* Preview Stats */}
        <div className="space-y-3 pt-2 border-t">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Income</p>
              <p className="font-semibold text-foreground">{persona.preview.income}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Savings</p>
              <p className="font-semibold text-foreground">{persona.preview.savings}</p>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground text-sm mb-1">Goals</p>
            <div className="flex flex-wrap gap-1">
              {persona.preview.goals.slice(0, 2).map((goal, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {goal}
                </Badge>
              ))}
              {persona.preview.goals.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{persona.preview.goals.length - 2} more
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm pt-2 border-t">
            <div>
              <p className="text-muted-foreground">Risk Level</p>
              <p className="font-semibold text-foreground">{persona.preview.riskLevel}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Knowledge</p>
              <p className="font-semibold text-foreground">{persona.preview.knowledgeLevel}</p>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full mt-4"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          View Full Plan
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default Explore;


