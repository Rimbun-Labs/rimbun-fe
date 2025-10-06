import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Lightbulb, TrendingUp, ArrowRight } from "lucide-react";

interface AssessmentPromptProps {
  variant?: 'card' | 'banner' | 'modal';
  title?: string;
  description?: string;
  showFeatures?: boolean;
  className?: string;
}

export const AssessmentPrompt: React.FC<AssessmentPromptProps> = ({
  variant = 'card',
  title = "Complete Your Assessment",
  description = "Take our personalized assessment to unlock your custom dashboard and learning path.",
  showFeatures = true,
  className = ""
}) => {
  const navigate = useNavigate();

  const handleStartAssessment = () => {
    navigate('/assessment');
  };

  if (variant === 'banner') {
    return (
      <div className={`bg-primary/10 border border-primary/20 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <Button 
            size="sm"
            onClick={handleStartAssessment}
            className="flex items-center gap-2"
          >
            Start Assessment
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className={`border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {showFeatures && (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div className="text-center p-4 rounded-lg bg-background/50">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold text-sm mb-1">Personalized Assessment</h3>
              <p className="text-xs text-muted-foreground">
                Understand your risk tolerance and investment style
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-background/50">
              <Lightbulb className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold text-sm mb-1">AI Insights</h3>
              <p className="text-xs text-muted-foreground">
                Get detailed analysis and recommendations
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-background/50">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold text-sm mb-1">Learning Path</h3>
              <p className="text-xs text-muted-foreground">
                Access customized educational content
              </p>
            </div>
          </div>
        )}

        <div className="text-center">
          <Button 
            size="lg"
            onClick={handleStartAssessment}
            className="px-6"
          >
            Start Your Assessment
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Takes about 10-15 minutes • Completely free
          </p>
        </div>
      </CardContent>
    </Card>
  );
}; 