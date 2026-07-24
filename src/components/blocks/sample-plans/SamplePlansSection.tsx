import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, ArrowRight, Eye, TrendingUp, Target } from 'lucide-react';
import { personaApi, PersonaPreview } from '@/lib/api/personaApi';
import { cn } from '@/lib/utils';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';

interface SamplePlansSectionProps {
  className?: string;
}

const PersonaPreviewCard: React.FC<{ persona: PersonaPreview; onClick: () => void }> = ({ 
  persona, 
  onClick 
}) => {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
        "border-border hover:border-primary/50 bg-card/50 backdrop-blur-sm"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg font-semibold">{persona.title}</CardTitle>
            <CardDescription className="text-sm">
              {persona.name}, {persona.age}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-primary/20">
            Sample
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {persona.description}
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Income</p>
            <p className="text-sm font-semibold text-foreground">{persona.preview.income}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Savings</p>
            <p className="text-sm font-semibold text-foreground">{persona.preview.savings}</p>
          </div>
        </div>

        {/* Goals Preview */}
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-2">Goals</p>
          <div className="flex flex-wrap gap-1.5">
            {persona.preview.goals.slice(0, 2).map((goal, idx) => (
              <Badge key={idx} variant="outline" className="text-xs bg-primary/5 border-primary/20">
                {goal}
              </Badge>
            ))}
            {persona.preview.goals.length > 2 && (
              <Badge variant="outline" className="text-xs bg-muted/50">
                +{persona.preview.goals.length - 2} more
              </Badge>
            )}
          </div>
        </div>

        {/* Risk & Knowledge */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
            <p className="text-sm font-medium text-foreground">{persona.preview.riskLevel}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Knowledge</p>
            <p className="text-sm font-medium text-foreground">{persona.preview.knowledgeLevel}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const SamplePlansSection: React.FC<SamplePlansSectionProps> = ({ className }) => {
  const navigate = useNavigate();

  const { data: personas, isLoading, error } = useQuery({
    queryKey: ['personas'],
    queryFn: () => personaApi.getAllPersonas(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Show first 3 personas as preview
  const previewPersonas = personas?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <section className={cn("py-16 bg-gradient-to-br from-primary/5 via-background to-primary/5", className)}>
        <div className="container px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <LoadingState variant="compact" lines={2} />
          </div>
        </div>
      </section>
    );
  }

  if (error || !personas || personas.length === 0) {
    // Don't show error, just don't render the section
    return null;
  }

  return (
    <section 
      id="sample-plans"
      className={cn(
        "py-16 md:py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5",
        "border-y border-border/50",
        className
      )}
    >
      <div className="container px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-2.5 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                See Real Financial Plans in Action
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore personalized financial plans created for different life situations. 
              Each plan includes banking products, investment strategies, and educational content tailored to specific goals.
            </p>
          </div>

          {/* Persona Preview Cards */}
          {previewPersonas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {previewPersonas.map((persona) => (
                <PersonaPreviewCard
                  key={persona.id}
                  persona={persona}
                  onClick={() => navigate(`/explore/${persona.slug}`, { 
                    state: { from: window.location.pathname } 
                  })}
                />
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
            >
              <Link to="/explore">
                <Eye className="mr-2 h-5 w-5" />
                Explore All Sample Plans
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2"
            >
              <Link to="/contact">
                Request a demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Real financial scenarios</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span>Personalized recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>Multiple life situations</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

