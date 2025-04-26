
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  category?: string;
  isComplete?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentStep, 
  totalSteps, 
  category, 
  isComplete = false 
}) => {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 animate-fade-in">
      <div className="flex justify-between mb-2 text-sm">
        <div className="flex items-center">
          <span className="font-medium">Question {currentStep} of {totalSteps}</span>
          {category && <span className="ml-2 text-muted-foreground">• {category}</span>}
        </div>
        <div className="flex items-center">
          {isComplete ? (
            <div className="flex items-center text-primary">
              <Check className="h-4 w-4 mr-1" />
              <span>Complete</span>
            </div>
          ) : (
            <span className={cn(
              progress === 100 ? "text-primary font-medium" : ""
            )}>{progress}% Complete</span>
          )}
        </div>
      </div>
      <Progress 
        value={progress} 
        className="h-2" 
        aria-label={`Assessment progress: ${progress}%`}
      />
    </div>
  );
};

export default ProgressBar;
