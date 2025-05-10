
import React from 'react';
import { Input } from '@/components/ui/input';
import { Question } from '@/lib/api/types/assessment';
import { ValidationError } from './ValidationError';
import { Label } from '@/components/ui/label';
import { InfoCircle } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

interface TextInputProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  validationError: string | null;
}

export const TextInput: React.FC<TextInputProps> = ({
  question,
  value,
  onChange,
  validationError
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label 
          htmlFor={`question-${question.id}`}
          className="text-base font-medium"
        >
          {question.questionText}
        </Label>
        
        {question.helpText && (
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="cursor-help">
                <InfoCircle className="h-4 w-4 text-muted-foreground" />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-3">
              <p className="text-sm text-muted-foreground">{question.helpText}</p>
            </HoverCardContent>
          </HoverCard>
        )}
      </div>
      
      <Input
        type="text"
        id={`question-${question.id}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder || "Enter your answer"}
        className={`transition-colors duration-200 ${validationError ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
        aria-invalid={validationError ? "true" : "false"}
        aria-describedby={validationError ? `error-${question.id}` : undefined}
      />
      
      {validationError && <ValidationError error={validationError} questionId={question.id} />}
    </div>
  );
};
