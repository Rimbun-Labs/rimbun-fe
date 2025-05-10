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
    const newValue = e.target.value === '' ? 0 : Number(e.target.value);
    onChange(newValue);
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor={`number-${question.id}`}>{question.questionText}</Label>
      <Input
        id={`number-${question.id}`}
        type="number"
        value={value === 0 ? '' : value}
        onChange={handleChange}
        className="w-full"
        placeholder={question.placeholder || 'Enter a number'}
        min={0}
        aria-invalid={!!validationError}
        aria-describedby={validationError ? `error-${question.id}` : undefined}
      />
      {validationError && (
        <div className="text-sm text-red-500" id={`error-${question.id}`}>
          {validationError}
        </div>
      )}
    </div>
  );
};
