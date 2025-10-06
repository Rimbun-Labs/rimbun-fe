import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Question } from "@/lib/api/types/assessment";

interface MultipleChoiceInputProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export const MultipleChoiceInput: React.FC<MultipleChoiceInputProps> = ({
  question,
  value,
  onChange
}) => {
  return (
    <div className="space-y-3">
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="space-y-3"
        aria-label={question.questionText}
      >
        {question.options?.map((option) => (
          <div key={option.id} className="relative">
            <RadioGroupItem 
              value={option.optionLabel} 
              id={option.id} 
              className="sr-only" // Hide default radio button
            />
            <Label 
              htmlFor={option.id} 
              className={`
                block w-full p-4 rounded-md border-2 cursor-pointer transition-all duration-200
                ${value === option.optionLabel 
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-border bg-card hover:border-primary/30 hover:bg-primary/2'
                }
              `}
            >
              <div className="flex items-start space-x-3">
                {/* Custom radio button - positioned at top for better alignment */}
                <div className="flex-shrink-0 mt-0.5">
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${value === option.optionLabel 
                      ? 'border-primary bg-primary' 
                      : 'border-muted-foreground/30'
                    }
                  `}>
                    {value === option.optionLabel && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />
                    )}
                  </div>
                </div>
                
                {/* Option text with cleaner formatting */}
                <div className="flex-1 min-w-0">
                  <span className={`
                    text-base font-medium leading-relaxed break-words
                    ${value === option.optionLabel ? 'text-primary' : 'text-foreground'}
                  `}>
                    {option.optionLabel}
                  </span>
                </div>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
