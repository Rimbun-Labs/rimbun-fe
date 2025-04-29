
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Question } from "@/lib/api/types/assessment";

interface NumberInputProps {
  question: Question;
  value: number;
  onChange: (value: number) => void;
  validationError: string | null;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  question,
  value,
  onChange,
  validationError
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor={`number-${question.id}`}>Enter a number</Label>
      <Input
        id={`number-${question.id}`}
        type="number"
        value={value || ''}
        onChange={handleChange}
        className="w-full"
        placeholder={question.placeholder}
        aria-invalid={!!validationError}
        aria-describedby={validationError ? `error-${question.id}` : undefined}
      />
    </div>
  );
};
