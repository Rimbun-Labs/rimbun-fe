import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle } from "lucide-react";

interface AnswerInputProps {
  type: 'multiple_choice' | 'number' | 'boolean';
  options?: Array<{ id: string; optionLabel: string; }>;
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  error?: string;
}

const AnswerInput: React.FC<AnswerInputProps> = ({
  type,
  options,
  value,
  onChange,
  placeholder,
  error
}) => {
  const inputId = React.useId();
  
  switch (type) {
    case 'multiple_choice':
      return (
        <div className="space-y-1">
          <RadioGroup
            value={value}
            onValueChange={onChange}
            className="space-y-4"
          >
            {options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-3 p-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="text-base cursor-pointer flex-1">
                  {option.optionLabel}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {error && (
            <div className="flex items-center text-sm text-destructive mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>{error}</span>
            </div>
          )}
        </div>
      );

    case 'number':
      return (
        <div className="space-y-1">
          <Input
            id={inputId}
            type="number"
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={placeholder}
            className="w-full"
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
          />
          {error && (
            <div className="flex items-center text-sm text-destructive mt-1" id={`${inputId}-error`}>
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>{error}</span>
            </div>
          )}
        </div>
      );

    case 'boolean':
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Label htmlFor={`${inputId}-switch`} className="text-base cursor-pointer">
              {value ? 'Yes' : 'No'}
            </Label>
            <Switch
              id={`${inputId}-switch`}
              checked={value === true}
              onCheckedChange={onChange}
            />
          </div>
          {error && (
            <div className="flex items-center text-sm text-destructive mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>{error}</span>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
};

export default AnswerInput;
