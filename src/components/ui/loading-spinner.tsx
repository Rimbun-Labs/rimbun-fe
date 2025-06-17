import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type LoadingSpinnerSize = 'sm' | 'md' | 'lg';
export type LoadingSpinnerVariant = 'default' | 'primary' | 'white';

interface LoadingSpinnerProps {
  /**
   * Size of the spinner
   * @default 'md'
   */
  size?: LoadingSpinnerSize;
  /**
   * Variant of the spinner
   * @default 'default'
   */
  variant?: LoadingSpinnerVariant;
  /**
   * Additional CSS classes to apply to the spinner
   */
  className?: string;
  /**
   * Text to display below the spinner
   */
  text?: string;
}

const sizeClasses: Record<LoadingSpinnerSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

const variantClasses: Record<LoadingSpinnerVariant, string> = {
  default: 'text-muted-foreground',
  primary: 'text-primary',
  white: 'text-white',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className,
  text,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2 
        className={cn(
          'animate-spin',
          sizeClasses[size],
          variantClasses[variant]
        )} 
      />
      {text && (
        <p className={cn(
          'text-sm',
          variant === 'white' ? 'text-white' : 'text-muted-foreground'
        )}>
          {text}
        </p>
      )}
    </div>
  );
}; 