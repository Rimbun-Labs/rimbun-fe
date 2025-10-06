import React from 'react';
import { Question, QuestionType } from "@/lib/api/types/assessment";
import { MultipleChoiceInput } from './MultipleChoiceInput';
import { NumberInput } from './NumberInput';
import { BooleanInput } from './BooleanInput';
import { SelectInput } from './SelectInput';
import { TextInput } from './TextInput';
import { SliderInput } from './SliderInput';

interface Option {
  id: string;
  optionLabel: string;
}

interface AnswerInputsProps {
  question: Question;
  answer: string | number;
  onAnswerChange: (value: string | number) => void;
  validationError: string | null;
}

export const AnswerInputs: React.FC<AnswerInputsProps> = ({
  question,
  answer,
  onAnswerChange,
  validationError
}) => {
  switch (question.questionType?.toLowerCase()?.trim()) {
    case 'multiple_choice':
      return (
        <MultipleChoiceInput
          question={question}
          value={answer as string}
          onChange={(value: string) => {
            // Now we receive option labels directly, not UUIDs
            onAnswerChange(value);
          }}
        />
      );

    case 'select':
      return (
        <SelectInput
          question={question}
          value={answer as string}
          onChange={(value: string) => {
            // Now we receive option labels directly, not UUIDs
            onAnswerChange(value);
          }}
        />
      );

    case 'number':
      return (
        <NumberInput
          question={question}
          value={answer as number}
          onChange={(value: number | string) => {
            // Ensure we're passing a number
            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            onAnswerChange(numValue);
          }}
          validationError={validationError}
        />
      );

    case 'boolean':
      return (
        <BooleanInput
          question={question}
          value={answer as string}
          onChange={(value: string) => {
            // Now we receive "true" or "false" strings directly
            onAnswerChange(value);
          }}
        />
      );

    case 'slider':
      return (
        <SliderInput
          question={question}
          value={answer as number}
          onChange={(value: number) => {
            onAnswerChange(value);
          }}
          validationError={validationError}
        />
      );

    case 'single_text':
      return (
        <TextInput
          question={question}
          value={answer as string}
          onChange={(value: string) => {
            onAnswerChange(value);
          }}
          validationError={validationError}
        />
      );

    default:
      return (
        <div className="p-4 text-center text-muted-foreground">
          Unsupported question type: {question.questionType}
        </div>
      );
  }
};
