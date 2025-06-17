import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type LoadingStateVariant = 'default' | 'compact' | 'expanded';

interface LoadingStateProps {
  /**
   * Additional CSS classes to apply to the container
   */
  className?: string;
  /**
   * Number of skeleton lines to display
   * @default 2
   */
  lines?: number;
  /**
   * Variant of the loading state
   * @default 'default'
   */
  variant?: LoadingStateVariant;
  /**
   * Whether to show a title skeleton
   * @default false
   */
  showTitle?: boolean;
  /**
   * Whether to show a subtitle skeleton
   * @default false
   */
  showSubtitle?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  className,
  lines = 2,
  variant = 'default',
  showTitle = false,
  showSubtitle = false,
}) => {
  const variantStyles = {
    default: 'space-y-4',
    compact: 'space-y-2',
    expanded: 'space-y-6',
  };

  const lineStyles = {
    default: {
      primary: 'h-4 w-3/4',
      secondary: 'h-4 w-1/2',
    },
    compact: {
      primary: 'h-3 w-2/3',
      secondary: 'h-3 w-1/3',
    },
    expanded: {
      primary: 'h-5 w-4/5',
      secondary: 'h-5 w-2/3',
    },
  };

  return (
    <div className={cn(variantStyles[variant], className)}>
      {showTitle && (
        <div className="space-y-2">
          <Skeleton className={cn("h-6 w-1/2", variant === 'compact' && 'h-5', variant === 'expanded' && 'h-7')} />
          {showSubtitle && (
            <Skeleton className={cn("h-4 w-1/3", variant === 'compact' && 'h-3', variant === 'expanded' && 'h-5')} />
          )}
        </div>
      )}
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className={cn("space-y-2", variant === 'compact' && 'space-y-1', variant === 'expanded' && 'space-y-3')}>
          <Skeleton className={lineStyles[variant].primary} />
          <Skeleton className={lineStyles[variant].secondary} />
        </div>
      ))}
    </div>
  );
}; 