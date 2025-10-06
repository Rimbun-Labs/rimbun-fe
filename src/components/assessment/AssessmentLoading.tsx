import React from 'react';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';

/**
 * @deprecated This component is deprecated and will be removed in a future version.
 * Please use the new LoadingState component instead:
 * 
 * ```tsx
 * <LoadingState 
 *   variant="expanded"
 *   showTitle
 *   showSubtitle
 *   lines={3}
 * />
 * ```
 * 
 * See the migration guide for more details.
 */
interface AssessmentLoadingProps {
  /**
   * Additional CSS classes to apply to the container
   */
  className?: string;
  /**
   * Whether to show the assessment title
   * @default true
   */
  showTitle?: boolean;
}

export const AssessmentLoading: React.FC<AssessmentLoadingProps> = ({
  className,
  showTitle = true,
}) => {
  return (
    <div className="container mx-auto py-12 px-4">
      {showTitle && (
        <h1 className="text-3xl font-bold mb-10 text-center text-foreground">Investment Profile Assessment</h1>
      )}
      <div className="max-w-3xl mx-auto">
        <LoadingState
          variant="expanded"
          lines={3}
          showTitle
          showSubtitle
          className={className}
        />
      </div>
    </div>
  );
};
