import React from 'react';
import { Question, QuestionType } from "@/lib/api/types/assessment";
import { MultipleChoiceInput } from './MultipleChoiceInput';
import { NumberInput } from './NumberInput';
import { BooleanInput } from './BooleanInput';
import { SelectInput } from './SelectInput';
import { TextInput } from './TextInput';

interface Option {
  id: string;
  optionLabel: string;
}

interface AnswerInputsProps {
  question: Question;
  answer: string | number | boolean;
  onAnswerChange: (value: string | number | boolean) => void;
  validationError: string | null;
}

export const AnswerInputs: React.FC<AnswerInputsProps> = ({
  question,
  answer,
  onAnswerChange,
  validationError
}) => {
  switch (question.questionType) {
    case 'multiple_choice':
      return (
        <MultipleChoiceInput
          question={question}
          value={answer as string}
          onChange={(value: string | Option) => {
            // Ensure we're passing the option ID as a string
            const optionId = typeof value === 'object' && value !== null ? value.id : value;
            onAnswerChange(optionId as string);
          }}
        />
      );

    case 'select':
      return (
        <SelectInput
          question={question}
          value={answer as string}
          onChange={(value: string | Option) => {
            // Ensure we're passing the option ID as a string
            const optionId = typeof value === 'object' && value !== null ? value.id : value;
            onAnswerChange(optionId as string);
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
          value={answer as boolean}
          onChange={(value: boolean | string) => {
            // Ensure we're passing a boolean
            const boolValue = typeof value === 'string' ? value === 'true' : value;
            onAnswerChange(boolValue);
          }}
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
      console.warn(`Unsupported question type: ${question.questionType}`);
      return null;
  }
};
