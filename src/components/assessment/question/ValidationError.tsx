
import React from 'react';
import { AlertCircle } from "lucide-react";

interface ValidationErrorProps {
  error: string;
  questionId: string;
}

export const ValidationError: React.FC<ValidationErrorProps> = ({ error, questionId }) => {
  if (!error) return null;
  
  return (
    <div className="mt-2 flex items-center text-sm text-destructive" id={`error-${questionId}`}>
      <AlertCircle className="h-4 w-4 mr-1" />
      <span>{error}</span>
    </div>
  );
};
