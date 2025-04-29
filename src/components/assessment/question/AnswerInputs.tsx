
import React from 'react';
import { Question } from "@/lib/api/types/assessment";
import { MultipleChoiceInput } from './MultipleChoiceInput';
import { NumberInput } from './NumberInput';
import { BooleanInput } from './BooleanInput';

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
          onChange={onAnswerChange}
        />
      );

    case 'number':
      return (
        <NumberInput
          question={question}
          value={answer as number}
          onChange={onAnswerChange}
          validationError={validationError}
        />
      );

    case 'boolean':
      return (
        <BooleanInput
          question={question}
          value={answer as boolean}
          onChange={onAnswerChange}
        />
      );

    default:
      return null;
  }
};
