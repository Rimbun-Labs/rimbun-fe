
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
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-primary mb-2">
          {question.category.name}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </div>
        {question.whyWeAsk && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Why we ask</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{question.whyWeAsk}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <CardTitle className="text-2xl">{question.questionText}</CardTitle>
      <CardDescription>{question.category.description}</CardDescription>
    </CardHeader>
  );
};
