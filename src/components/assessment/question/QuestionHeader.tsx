
import React from 'react';
import { CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Question } from "@/lib/api/types/assessment";

interface QuestionHeaderProps {
  question: Question;
}

export const QuestionHeader: React.FC<QuestionHeaderProps> = ({ question }) => {
  return (
    <div className="space-y-6">
      {/* Category Badge with app's styling */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20">
          <span className="text-sm font-medium text-primary">
            {question.category.name}
          </span>
          {question.required && (
            <span className="ml-2 text-xs text-destructive font-bold">*</span>
          )}
        </div>
        
        {/* Why We Ask Tooltip */}
        {question.whyWeAsk && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-muted-foreground hover:text-primary hover:bg-primary/10"
                >
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Why we ask</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-3">
                <p className="text-sm text-muted-foreground">{question.whyWeAsk}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {/* Question Text */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold leading-relaxed text-foreground w-full">
          {question.questionText}
        </h2>
        
        {/* Category Description with app's styling */}
        {question.category.description && (
          <div className="p-4 bg-muted/50 border border-border rounded-md">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {question.category.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
