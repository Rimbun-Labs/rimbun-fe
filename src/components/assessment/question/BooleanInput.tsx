import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Question } from "@/lib/api/types/assessment";

interface BooleanInputProps {
  question: Question;
  value: string; // Changed from boolean to string
  onChange: (value: string) => void; // Changed from boolean to string
}

export const BooleanInput: React.FC<BooleanInputProps> = ({
  question,
  value,
  onChange
}) => {
  return (
    <div className="space-y-4">
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-2 gap-4"
        aria-label={question.questionText}
      >
        {/* Yes Option */}
        <div className="relative">
          <RadioGroupItem 
            value="true" 
            id={`${question.id}-yes`} 
            className="sr-only"
          />
          <Label 
            htmlFor={`${question.id}-yes`} 
            className={`
              block w-full p-6 rounded-md border-2 cursor-pointer transition-all duration-200 text-center
              ${value === 'true' 
                ? 'border-primary bg-primary/5 shadow-sm' 
                : 'border-border bg-card hover:border-primary/30 hover:bg-primary/2'
              }
            `}
          >
            <div className="space-y-2">
              <div className={`
                w-6 h-6 rounded-full border-2 mx-auto flex items-center justify-center
                ${value === 'true' 
                  ? 'border-primary bg-primary' 
                  : 'border-muted-foreground/30'
                }
              `}>
                {value === 'true' && (
                  <div className="w-3 h-3 rounded-full bg-primary-foreground" />
                )}
              </div>
              <span className={`
                text-lg font-semibold
                ${value === 'true' ? 'text-primary' : 'text-foreground'}
              `}>
                Yes
              </span>
            </div>
          </Label>
        </div>
        
        {/* No Option */}
        <div className="relative">
          <RadioGroupItem 
            value="false" 
            id={`${question.id}-no`} 
            className="sr-only"
          />
          <Label 
            htmlFor={`${question.id}-no`} 
            className={`
              block w-full p-6 rounded-md border-2 cursor-pointer transition-all duration-200 text-center
              ${value === 'false' 
                ? 'border-primary bg-primary/5 shadow-sm' 
                : 'border-border bg-card hover:border-primary/30 hover:bg-primary/2'
              }
            `}
          >
            <div className="space-y-2">
              <div className={`
                w-6 h-6 rounded-full border-2 mx-auto flex items-center justify-center
                ${value === 'false' 
                  ? 'border-primary bg-primary' 
                  : 'border-border bg-card hover:border-primary/30 hover:bg-primary/2'
                }
              `}>
                {value === 'false' && (
                  <div className="w-3 h-3 rounded-full bg-primary-foreground" />
                )}
              </div>
              <span className={`
                text-lg font-semibold
                ${value === 'false' ? 'text-primary' : 'text-foreground'}
              `}>
                No
              </span>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};
