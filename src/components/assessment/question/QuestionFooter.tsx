
import React from 'react';
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuestionFooterProps {
  isSubmitting: boolean;
  isLastQuestion: boolean;
  onSubmit: () => void;
}

export const QuestionFooter: React.FC<QuestionFooterProps> = ({
  isSubmitting,
  isLastQuestion,
  onSubmit
}) => {
  return (
    <CardFooter className="flex justify-between">
      <div className="text-sm text-muted-foreground">
        Answer carefully - your financial profile depends on it
      </div>
      <Button 
        onClick={onSubmit}
        disabled={isSubmitting}
        aria-label={isLastQuestion ? "Complete assessment" : "Next question"}
      >
        {isSubmitting ? "Saving..." : isLastQuestion ? "Complete" : "Next"}
      </Button>
    </CardFooter>
  );
};
