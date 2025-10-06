import React, { useMemo } from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Question } from "@/lib/api/types/assessment";
import { useFormatters } from '@/hooks/useFormatters';

interface SliderInputProps {
  question: Question;
  value: number;
  onChange: (value: number) => void;
  validationError: string | null;
}

// Configuration for different slider questions
const SLIDER_CONFIGS = {
  // Income question
  "eabf99f8-9a79-4cbd-baad-a81f0c48a3c9": {
    min: 0,
    max: 20000,
    step: 1000,
    format: 'currency' as const
  },
  // Investment goal amount question
  "84ae265a-fce0-4d23-ad74-57e9f385d1f8": {
    min: 0,
    max: 1000000,
    step: 10000,
    format: 'currency' as const
  },
  // Default configuration for any other slider questions
  default: {
    min: 0,
    max: 100,
    step: 1,
    format: 'number' as const
  }
};

export const SliderInput: React.FC<SliderInputProps> = React.memo(({
  question,
  value,
  onChange,
  validationError
}) => {
  const { formatCurrency, formatNumber } = useFormatters();

  // Use sliderConfig from the question if available, otherwise fall back to hardcoded configs
  const config = question.sliderConfig || SLIDER_CONFIGS[question.id as keyof typeof SLIDER_CONFIGS] || SLIDER_CONFIGS.default;

  // Memoize the formatValue function to prevent recalculation
  const formatValue = useMemo(() => (val: number) => {
    if (config.format === 'currency') {
      return formatCurrency(val);
    }
    return formatNumber(val);
  }, [config.format, formatCurrency, formatNumber]);

  return (
    <div className="space-y-4">
      {/* Value Display */}
      <div className="flex justify-between items-center p-4 bg-muted/30 rounded-md border border-border">
        <Label className="text-sm font-medium text-muted-foreground">
          {formatValue(config.min)}
        </Label>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {formatValue(value)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Current Value</div>
        </div>
        <Label className="text-sm font-medium text-muted-foreground">
          {formatValue(config.max)}
        </Label>
      </div>
      
      {/* Slider */}
      <div className="px-2">
        <Slider
          value={[value]}
          min={config.min}
          max={config.max}
          step={config.step}
          onValueChange={([newValue]) => onChange(newValue)}
          className="w-full"
        />
      </div>
      
      {/* Validation Error */}
      {validationError && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{validationError}</p>
        </div>
      )}
    </div>
  );
});

SliderInput.displayName = 'SliderInput'; 