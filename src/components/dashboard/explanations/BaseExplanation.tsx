import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExplanationData, ExplanationProps } from './types';
import { cn } from '@/lib/utils';

interface BaseExplanationProps extends ExplanationProps {
  explanation: ExplanationData;
}

export const BaseExplanation: React.FC<BaseExplanationProps> = ({
  explanation,
  className
}) => {
  return (
    <Card className={cn("bg-card", className)}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{explanation.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {explanation.description}
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Key Characteristics:</h4>
            <ul className="space-y-1">
              {explanation.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 