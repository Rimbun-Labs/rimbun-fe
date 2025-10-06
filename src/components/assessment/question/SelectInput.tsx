import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Question } from "@/lib/api/types/assessment";

interface SelectInputProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  question,
  value,
  onChange
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {question.options?.map((option) => (
          <SelectItem key={option.id} value={option.optionLabel}>
            {option.optionLabel}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}; 