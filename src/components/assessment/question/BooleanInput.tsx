
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Question } from "@/lib/api/types/assessment";

interface BooleanInputProps {
  question: Question;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const BooleanInput: React.FC<BooleanInputProps> = ({
  question,
  value,
  onChange
}) => {
  const handleChange = (value: string) => {
    onChange(value === 'true');
  };
  
  return (
    <RadioGroup
      value={String(value)}
      onValueChange={handleChange}
      className="space-y-3"
      aria-label={question.questionText}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="true" id={`${question.id}-yes`} />
        <Label htmlFor={`${question.id}-yes`} className="text-base cursor-pointer">
          Yes
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="false" id={`${question.id}-no`} />
        <Label htmlFor={`${question.id}-no`} className="text-base cursor-pointer">
          No
        </Label>
      </div>
    </RadioGroup>
  );
};
