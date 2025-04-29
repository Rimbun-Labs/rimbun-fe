
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
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className="space-y-3"
      aria-label={question.questionText}
    >
      {question.options?.map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <RadioGroupItem value={option.id} id={option.id} />
          <Label htmlFor={option.id} className="text-base cursor-pointer">
            {option.text}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};
