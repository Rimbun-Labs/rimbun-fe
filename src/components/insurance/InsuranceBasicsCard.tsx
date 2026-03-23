import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { HEDGE_TYPE_EXPLANATIONS, INSURANCE_TERMS } from '@/lib/constants/insuranceEducation';
import { cn } from '@/lib/utils';

const DEFAULT_OPEN = false;

/**
 * Educational card: "Learn about insurance" so users understand resilience, hedge types, and terms.
 */
export const InsuranceBasicsCard: React.FC<{ className?: string }> = ({ className }) => {
  const [open, setOpen] = useState(DEFAULT_OPEN);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className={cn('border-dashed border-primary/30 bg-muted/20', className)}>
        <CardHeader className="p-4 pb-2">
          <CollapsibleTrigger className="flex w-full items-center justify-between text-left hover:opacity-90">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-5 w-5 text-primary" />
              Learn about insurance & resilience
            </CardTitle>
            {open ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CardDescription>
            Why cover is tied to goals and what the terms mean
          </CardDescription>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="p-4 pt-0 space-y-4 text-sm">
            <section>
              <h4 className="font-semibold text-foreground mb-1">What is resilience?</h4>
              <p className="text-muted-foreground">{INSURANCE_TERMS.resilience}</p>
            </section>
            <section>
              <h4 className="font-semibold text-foreground mb-2">Types of cover we recommend</h4>
              <ul className="space-y-3 text-muted-foreground">
                {Object.entries(HEDGE_TYPE_EXPLANATIONS)
                  .filter(([key]) => key !== 'none')
                  .map(([key, { title, body }]) => (
                    <li key={key} className="rounded-lg border bg-background/50 p-3">
                      <span className="font-medium text-foreground">{title}.</span> {body}
                    </li>
                  ))}
              </ul>
            </section>
            <section>
              <h4 className="font-semibold text-foreground mb-1">Understanding the score</h4>
              <p className="text-muted-foreground">{INSURANCE_TERMS.score}</p>
            </section>
            <section>
              <h4 className="font-semibold text-foreground mb-1">Key terms</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Recommended cover:</strong> {INSURANCE_TERMS.recommendedCover}</li>
                <li><strong className="text-foreground">Indicative premium:</strong> {INSURANCE_TERMS.indicativePremium}</li>
                <li><strong className="text-foreground">Takaful:</strong> {INSURANCE_TERMS.takaful}</li>
              </ul>
            </section>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
