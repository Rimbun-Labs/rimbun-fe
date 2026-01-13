import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface FeatureCardProps {
  title: string;
  description: string;
  isLocked: boolean;
  previewContent: React.ReactNode;
  assessmentRequired?: boolean;
  featurePath: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  isLocked,
  previewContent,
  assessmentRequired = true,
  featurePath
}) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (isLocked) {
      navigate('/assessment');
    } else {
      navigate(featurePath);
    }
  };

  return (
    <Card className="relative group hover:shadow-lg transition-shadow">
      {isLocked && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="text-center p-4">
            <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              {assessmentRequired 
                ? "Complete your assessment to unlock this feature"
                : "This feature is currently unavailable"}
            </p>
            {assessmentRequired && (
              <Button 
                variant="secondary" 
                className="mt-2"
                onClick={handleAction}
              >
                Start Assessment
              </Button>
            )}
          </div>
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {previewContent}
          {!isLocked && (
            <Button 
              variant="secondary" 
              className="mt-4 w-full"
              onClick={handleAction}
            >
              Explore
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 