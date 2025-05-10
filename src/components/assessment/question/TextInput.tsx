
import React from 'react';
import { Input } from '@/components/ui/input';
import { Question } from '@/lib/api/types/assessment';
import { ValidationError } from './ValidationError';

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
      <Input
        type="text"
        id={`question-${question.id}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder || "Enter your answer"}
        className={validationError ? "border-destructive" : ""}
        aria-invalid={validationError ? "true" : "false"}
      />
      {validationError && <ValidationError error={validationError} questionId={question.id} />}
    </div>
  );
};
